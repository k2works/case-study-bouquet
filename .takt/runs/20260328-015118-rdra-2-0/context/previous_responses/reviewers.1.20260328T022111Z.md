## arch-review
## Architecture Review — RDRA 2.0 要件定義書

---

### Phase 1: 前回 open findings の追跡

前回（ai-review）は **APPROVE** 判定で、3 件の Warning を記録。いずれもブロッキングではなかった。

| finding_id | 前回の内容 | 今回の状態 | 根拠 |
|---|---|---|---|
| `AIR-W1` | UC 複合図に `control` 要素が欠落 | `persists` | `docs/requirements/requirements_definition.md` 行 444〜593 — 4 つの UC 複合図すべてで `control` 要素なし |
| `AIR-W2` | テストの `\b` 修正が不完全（行 741） | `persists` | `docs/requirements/__tests__/requirements_definition.test.mjs` 行 741 — `/## システム\b(?!境界)/` が残存 |
| `AIR-W3` | 状態モデルとバリエーション定義の不整合 | `persists` | `requirements_definition.md` 行 674 に `届け日変更済み` 状態があるが、行 418-425 の受注ステータス一覧にない |

---

### Phase 2: 構造・設計レビュー

#### 変更スコープ

| ファイル | 行数 | 役割 |
|---|---|---|
| `docs/requirements/requirements_definition.md` | 722 行 | 要件定義書本体（Markdown + PlantUML） |
| `docs/requirements/__tests__/requirements_definition.test.mjs` | 800 行 | テストファイル |
| `docs/requirements/index.md` | 17 行 | インデックス更新 |

合計 **1,539 行**（Large）。ただし、RDRA 4 層の要件定義書を一括作成するタスクであり、変更は論理的にまとまっている。分割の必要はない。

---

### 検出事項

#### ARCH-01: テストの `\b` が日本語文字間で機能せず、テスト検証範囲が意図と異なる（persists from AIR-W2）

**状態**: `persists`（前回 `AIR-W2` と同一問題）

**該当ファイル**: `docs/requirements/__tests__/requirements_definition.test.mjs` 行 741

**何が問題か**: 決定ログ #1 で「JavaScript の `\b` は日本語文字間で機能しない」と正しく分析し、行 589 の正規表現を `/\n## システム(?!価値|外部|境界)/` に修正した。しかし行 741 に同じ問題を持つ正規表現が残っている：

```javascript
// 行 741（未修正）
const layer3Content = content.split('## システム境界')[1]?.split(/## システム\b(?!境界)/)[0]
```

**実際の影響**: `\b` が日本語文字間でマッチしないため、この `split` は分割に失敗する。`layer3Content` は「`## システム境界`」以降の **全文**（層 4 の `## システム` セクションを含む）になる。テストの意図は「層 3 のみ」を対象にすることだが、実質的に層 4 の情報モデル内容もチェック範囲に含まれる。テストはパスするが、検証精度が低下しており、将来の変更で誤検知/検知漏れを起こす可能性がある。

**同一問題が決定ログで修正方針が確立済み**: 行 589 で採用した `\n` プレフィックスアプローチと同じ修正を適用すべき。

**どう修正すべきか**: 行 741 を以下に変更する：
```javascript
const layer3Content = content.split('## システム境界')[1]?.split(/\n## システム(?!境界)/)[0]
```

**判定**: **ブロッキング**（変更ファイル内の既存問題 — ボーイスカウトルール適用。かつ、同じ問題の修正を行 589 で実施しており、同一ファイル内で修正漏れ）

---

#### ARCH-02: UC 複合図テストが `control` 要素を検証していない（new）

**状態**: `new`

**該当ファイル**: `docs/requirements/__tests__/requirements_definition.test.mjs` 行 357-376

**何が問題か**: テスト名は `'should include boundary (screen), entity (information), and control (condition) elements'` と 3 要素の検証を宣言しているが、実際には `boundary` と `entity` の 2 つしか assert していない。`control` の assert が欠落している：

```javascript
// 行 365-375: boundary と entity のみ検証、control が未検証
assert.match(ucSection, /boundary/, ...)
assert.match(ucSection, /entity/, ...)
// control の assert がない
```

**何がまずいか**: テスト名が検証内容と一致していない。テスト名を信じた開発者は `control` の検証が行われていると誤認する。これは「テストがない新しい振る舞い」に準じる — テスト名で約束した検証を実行していない。

タスク指示書（order.md 行 48）にも「各 UC に画面（boundary）、情報（entity）、条件（control）を関連付ける」と明記されているため、`control` は仕様要求であり、テストと実装の両方が欠落している。

**どう修正すべきか**: 以下のいずれかを行う：
- **(A) テストに `control` の assert を追加し、要件定義書の UC 複合図にも `control` 要素を追加する**（仕様準拠）
- **(B) `control` が本タスクのスコープ外であると判断した場合、テスト名を実態に合わせて修正する**（例: `'should include boundary and entity elements'`）

推奨は **(A)**。タスク指示書が `control` を要求しており、RDRA 2.0 の UC 複合図の標準要素でもある。

**判定**: **ブロッキング**（テスト名と検証内容の不一致 — テストの信頼性を損なう。かつ、仕様で要求された `control` 要素が未実装）

---

#### ARCH-03: 状態モデルとバリエーション定義の不整合（persists from AIR-W3）

**状態**: `persists`（前回 `AIR-W3` と同一問題）

**該当ファイル**: `docs/requirements/requirements_definition.md`

**何が問題か**: 受注の状態遷移図（行 672-675）に `届け日変更済み` 状態が定義されている：

```
受注済み --> 届け日変更済み : 届け日変更
届け日変更済み --> 受注済み : 変更確定
```

一方、バリエーション・条件セクション（行 418-425）の受注ステータスは以下の 5 つ：
> 受注済み / 出荷準備中 / 出荷済み / 配送完了 / キャンセル

`届け日変更済み` がバリエーション一覧に含まれていない。RDRA の状態モデルとバリエーション定義は相互参照される設計文書であり、不整合があると後続の開発フェーズでドメインモデル設計やテーブル設計に矛盾が波及する。

**どう修正すべきか**: どちらかに統一する：
- **(A)** バリエーション・条件の受注ステータス表に `届け日変更済み` を追加する
- **(B)** `届け日変更済み` を独立した状態ではなく `受注済み` 内の一時的な遷移とみなし、状態遷移図を修正する（例: 自己遷移 `受注済み --> 受注済み : 届け日変更`）

**判定**: **ブロッキング**（変更ファイル内の仕様整合性の問題 — 関連フィールドのクロスバリデーション欠如に該当。状態モデルとバリエーション定義は同一ドキュメント内で意味的に結合している）

---

### 非ブロッキング事項（Warning）

#### ARCH-W1: UC 複合図に `control` 要素が欠落（persists from AIR-W1）

ARCH-02 と関連するが、ドキュメント側の問題として記録。4 つの UC 複合図すべてで `control` 要素が省略されている。ARCH-02 の修正時に併せて対応することを推奨。ARCH-02 で修正案 (A) を選択した場合、自動的にこの Warning も解消される。

#### ARCH-W2: テストファイルが 800 行

テストファイルの行数超過は Warning 扱い（ポリシー: テストファイルの行数超過は原則 Warning）。現時点で実害（フレーク、誤検知等）は確認されていないが、将来的にセクション追加時に保守性が低下する可能性がある。

---

### 確認済み項目（問題なし）

| 観点 | 結果 |
|---|---|
| ファイル構成・ディレクトリ階層 | `docs/requirements/` 配下に適切に配置 ✓ |
| モジュール凝集性 | 要件定義書・テスト・インデックスが1ディレクトリにまとまっている ✓ |
| テンプレート準拠 | 4 層構造がテンプレートに準拠 ✓ |
| PlantUML 整合性 | `@startuml` 18 個 = `@enduml` 18 個 ✓ |
| デッドコード・未使用コード | 検出なし ✓ |
| TODO コメント | 検出なし ✓ |
| 説明コメント（What/How） | テスト内コメントは Given/When/Then パターンで意図説明。問題なし ✓ |
| DRY 違反 | テスト内の `readRequirements()` は適切にヘルパー関数化されている ✓ |
| 入力資料との整合性（アクター・エンティティ・フィーチャ） | ai-review で検証済み、問題なし ✓ |
| `index.md` の更新 | 「未作成」→「作成済み」 ✓ |
| 決定ログの設計判断の妥当性 | 決定 #1（`\b` → `\n` プレフィックス）、決定 #2（`####` → `**太字**`）— いずれも合理的 ✓ |

---

### 判定: **REJECT**

ブロッキング問題が 3 件（`ARCH-01` / `ARCH-02` / `ARCH-03`）検出されたため、差し戻します。

| finding_id | 状態 | 概要 | 判定 |
|---|---|---|---|
| `ARCH-01` | `persists` | テスト行 741 の `\b` 修正漏れ | ブロッキング |
| `ARCH-02` | `new` | テスト名が `control` 検証を宣言するが assert 欠落 + 仕様要求の `control` 未実装 | ブロッキング |
| `ARCH-03` | `persists` | 状態モデルとバリエーション定義の `届け日変更済み` 不整合 | ブロッキング |
| `ARCH-W1` | `persists` | UC 複合図の `control` 要素欠落（ARCH-02 修正時に解消推奨） | Warning |
| `ARCH-W2` | `new` | テストファイル 800 行 | Warning |

---

## supervise
# 最終検証結果

## 結果: REJECT

## 要件充足チェック

タスク指示書（`order.md`）から要件を抽出し、実コードで個別に検証した。

| # | 要件（タスク指示書から抽出） | 充足 | 根拠（ファイル:行） |
|---|---------------------------|------|-------------------|
| 1 | 成果物 `docs/requirements/requirements_definition.md` が存在すること | ✅ | ファイル存在確認済（16,076 bytes） |
| 2 | テンプレート `docs/template/要件定義.md` の構造をコピーして作成 | ✅ | 4層構造・セクション順序がテンプレートに準拠 |
| 3 | 層1: システムコンテキスト図（PlantUML、アクター3者、WEB ショップシステム中心） | ✅ | `requirements_definition.md:7-30` — 得意先・スタッフ・仕入先の3アクターとWEB ショップシステム |
| 4 | 層1: 要求モデル（各アクターの要求を構造化） | ✅ | `requirements_definition.md:34-84` — 3アクターの要求とデザイン要求が構造化 |
| 5 | 層2: ビジネスコンテキスト（5部門の組織構造） | ✅ | `requirements_definition.md:88-138` — 店舗運営/営業・受注/仕入・在庫/配送/IT の5部門 |
| 6 | 層2: ビジネスユースケース（バリューストリーム5ステージ） | ✅ | `requirements_definition.md:140-189` — 商品企画/WEB受注/仕入れ・入荷/結束/出荷・配送 |
| 7 | 層2: 業務フロー（各BUCのアクティビティ図、PlantUML） | ✅ | `requirements_definition.md:192-323` — WEB受注/仕入れ・入荷/出荷・配送/届け日変更の4フロー |
| 8 | 層2: 利用シーン（得意先の注文シーン） | ✅ | `requirements_definition.md:327-365` — 記念日注文、届け先コピーの2シーン |
| 9 | 層2: 利用シーン（スタッフの在庫確認・発注シーン） | ✅ | `requirements_definition.md:367-407` — 在庫確認・発注判断、出荷準備の2シーン |
| 10 | 層3: UC複合図 — 画面（boundary）を関連付ける | ✅ | `requirements_definition.md:448-593` — 全4図に `boundary` 要素あり |
| 11 | 層3: UC複合図 — 情報（entity）を関連付ける | ✅ | `requirements_definition.md:448-593` — 全4図に `entity` 要素あり |
| 12 | 層3: UC複合図 — 条件（control）を関連付ける | ❌ | `requirements_definition.md:448-593` — 全4図で `control` 要素が**完全に省略**されている |
| 13 | 層3: 9フィーチャをUCとして定義 | ✅ | 商品マスタ管理/WEB受注/在庫推移表示/発注管理/入荷管理/出荷管理/届け日変更/届け先コピー/得意先管理 — 全9フィーチャが4図に分散して定義 |
| 14 | 層3: 画面・帳票モデル（顧客向け画面3つ） | ✅ | `requirements_definition.md:597-603` — 商品一覧/注文/届け先選択 |
| 15 | 層3: 画面・帳票モデル（管理画面） | ✅ | `requirements_definition.md:607-615` — 受注一覧/在庫推移/発注管理/入荷管理/出荷管理/商品管理/得意先管理 |
| 16 | 層3: イベントモデル | ✅ | `requirements_definition.md:619` — 「該当なし」と明記 |
| 17 | 層3: バリエーション・条件（商品種別/受注ステータス/在庫ステータス） | ✅ | `requirements_definition.md:409-441` — 4種のバリエーション表 |
| 18 | 層4: 情報モデル（9エンティティ、PlantUML） | ✅ | `requirements_definition.md:625-661` — 得意先/受注/商品/商品構成/単品/仕入先/入荷/在庫/届け先 |
| 19 | 層4: 状態モデル（受注/在庫/発注の状態遷移図） | ✅ | `requirements_definition.md:665-722` — 3エンティティの状態遷移図 |
| 20 | `docs/requirements/index.md` を「未作成」→「作成済み」に更新 | ✅ | `index.md:9` — `作成済み` を確認 |
| 21 | PlantUML 図が各セクションに含まれていること | ✅ | `@startuml`/`@enduml` 15対15（implement レポートで確認） |
| 22 | ビジネスアーキテクチャ・インセプションデッキとの整合性 | ✅ | アクター名・情報エンティティ名・フィーチャが一致（AI review で確認済） |

**❌ 要件 #12 が未充足のため REJECT。**

タスク指示書 `order.md` 行 48 に明記:
> 「各 UC に画面（boundary）、情報（entity）、条件（control）を関連付ける」

`boundary` と `entity` は実装されているが、`control` 要素は全4つの UC 複合図で完全に省略されている。

## 前段 finding の再評価

| finding_id | 前段判定 | 再評価 | 根拠 |
|------------|----------|--------|------|
| AI-W1-reqdef-UC | Warning (non-blocking) | **妥当だが判定を引き上げ: blocking** | `order.md:48` に `control` を明記。タスク指示書の明示的要件であり、Supervisor としては要件未充足で REJECT |
| AI-W2-test-L742 | Warning (non-blocking) | **妥当 (warning)** | `test.mjs:741` — `\b` が日本語で機能しない問題が残存。テストは偶然パスするが検証範囲が意図より広い。ブロッキングではないが修正推奨 |
| AI-W3-reqdef-state | Warning (non-blocking) | **妥当 (warning)** | `requirements_definition.md:674` に「届け日変更済み」状態があるが行418-425のバリエーション表に未掲載。内部不整合だが、W1 修正時に併せて修正可能 |

**AI review の APPROVE 判定について**: AI review は Policy の REJECT 基準（テスト欠如・バグ等のコード品質基準）に照らして W1 を non-blocking と判断した。コード品質観点としてはその判断は理解できるが、Supervisor の検証観点は「要求が満たされているか（Validation）」であり、タスク指示書の明示的要件が未充足であるため、ここで REJECT とする。

## 検証サマリー

| 項目 | 状態 | 確認方法 |
|------|------|---------|
| テスト | ✅ | implement レポート: `node --test` — 47 pass / 0 fail |
| ビルド | ✅ | Markdown ドキュメントのため型チェック対象外。PlantUML `@startuml`/`@enduml` 15対15 |
| 動作確認 | ⚠️ | PlantUML のレンダリング確認の証跡なし（構文対応チェックのみ） |

**テスト証跡に関する注記**: テストは `boundary` と `entity` の存在のみ検証しており、`control` 要素の検証が含まれていない。そのためテストは全パスしているが、要件 #12 の欠落を検出できていない。

## 成果物

- 作成: `docs/requirements/requirements_definition.md`（RDRA 2.0 要件定義書）
- 作成: `docs/requirements/__tests__/requirements_definition.test.mjs`（検証テスト）
- 変更: `docs/requirements/index.md`（状況を「作成済み」に更新）

## 未完了項目（REJECT）

| # | 項目 | 理由 |
|---|------|------|
| 1 | UC複合図に `control` 要素を追加 | タスク指示書 `order.md:48`「各UCに条件（control）を関連付ける」が未実装。全4つのUC複合図（WEB受注/商品企画・管理/仕入れ・入荷/出荷・配送）に `control` 要素を追加する必要がある。例: WEB受注UC図に `control "在庫確認" as c01`、出荷管理UC図に `control "出荷日計算" as c01` など |
| 2 | （推奨）テストに `control` 要素の検証を追加 | `test.mjs` の UC 複合図検証（boundary/entity チェック部分）に `control` の存在チェックを追加し、今後の欠落を防止する |
| 3 | （推奨）テスト行741の `\b` 修正 | `test.mjs:741` の `/## システム\b(?!境界)/` を行589と同じパターン `/\n## システム(?!境界)/` に修正する |
| 4 | （推奨）バリエーション表に「届け日変更済み」を追加 | 状態遷移図（行674）とバリエーション表（行418-425）の不整合を解消する |