Only comments remain — no functional `\b` usage left.

## 作業結果
- レビュー指摘 3 件（new 1 件、persists 2 件）をすべて修正した

## 変更内容
- **ARCH-01 (code-defect, persists)**: `requirements_definition.test.mjs:741` の `\b` 正規表現を行 589 と同一アプローチ（`/\n## システム(?!境界)/`）に修正
- **ARCH-02 (test-integrity, new)**: テストに `control` の assert を追加し、4 つの UC 複合図すべてに `control` 要素を追加（WEB 受注: 在庫確認・届け日検証、商品企画・管理: 商品構成検証、仕入れ・入荷: 品質維持日数チェック・発注数量算出、出荷・配送: 出荷日判定）
- **ARCH-03 (spec-inconsistency, persists)**: バリエーション表の受注ステータスに `届け日変更済み` を追加し、状態遷移図との整合性を確保

## ビルド結果
- ドキュメントのみのタスクのため型チェック対象なし

## テスト結果
- `node --test docs/requirements/__tests__/requirements_definition.test.mjs`
- **47 tests, 47 pass, 0 fail**

## 収束ゲート
| 指標 | 件数 |
|------|------|
| new（今回修正） | 1 |
| reopened（再発修正） | 0 |
| persists（前回から継続、今回修正） | 2 |

## 証拠
- `reports/ai-review.md`: W1（control 省略）、W2（\b 残存）、W3（状態不整合）確認
- `reports/architect-review.md`: ARCH-01、ARCH-02、ARCH-03 確認
- `requirements_definition.test.mjs:741`: `\b` → `\n` 接頭辞に修正済み（Grep で `\b` のコード使用がゼロであることを確認）
- `requirements_definition.test.mjs:375`: `control` assert 追加済み
- `requirements_definition.md`: 4 つの UC 複合図すべてに `control` 要素追加、バリエーション表に `届け日変更済み` 追加
- テスト結果: 47/47 パス