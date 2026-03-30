# アプリケーション開発環境セットアップ手順書

## 概要

本ドキュメントは、フレール・メモワール WEB ショップシステムのアプリケーション開発環境をセットアップする手順を説明します。

テスト駆動開発（TDD）のゴールは **動作するきれいなコード** です。それを実現するためには [ソフトウェア開発の三種の神器](https://t-wada.hatenablog.jp/entry/clean-code-that-works) が必要です。

> 今日のソフトウェア開発の世界において絶対になければならない 3 つの技術的な柱があります。
> 三本柱と言ったり、三種の神器と言ったりしていますが、それらは
>
> - バージョン管理
> - テスティング
> - 自動化
>
> の 3 つです。
>
> — https://t-wada.hatenablog.jp/entry/clean-code-that-works

---

## 1. 前提条件

以下のツールがインストールされていることを確認してください。

| ツール | バージョン | 確認コマンド |
|--------|-----------|-------------|
| Java | 25 以上 | `java -version` |
| Gradle | 9.x 以上（Wrapper 使用） | `./gradlew --version` |
| Docker | 最新 | `docker -v` |
| Docker Compose | v2.x | `docker compose version` |
| Git | 最新 | `git -v` |
| Node.js | v22.x LTS | `node -v` |
| npm | v10.x | `npm -v` |

### Java のインストール

Java をインストールします。SDKMAN! を使用すると複数バージョンの管理が容易です。

```bash
# SDKMAN! でインストール
sdk install java 25-open

# バージョン確認
java -version
```

公式サイトから直接ダウンロードする場合：

- https://adoptium.net/

### Docker のインストール

Docker Desktop をインストールします。

- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **macOS**: https://docs.docker.com/desktop/install/mac-install/

```bash
# バージョン確認
docker -v

docker compose version
```

### Node.js のインストール

コミット前の品質チェック（husky + lint-staged）に Node.js が必要です。

- https://nodejs.org/

```bash
# バージョン確認
node -v

npm -v
```

---

## 2. プロジェクトの取得

### リポジトリのクローン

```bash
git clone https://github.com/k2works/case-study-bouquet.git
cd case-study-bouquet
```

### Node.js 依存パッケージのインストール

```bash
npm install
```

> **Note**: husky（Git Hooks）が `prepare` スクリプトで自動的にセットアップされます。

---

## 3. サブシステム一覧

フレール・メモワール WEB ショップシステムは以下のサブシステムで構成されています。

| システム | ディレクトリ | 説明 | ポート (DB / App) |
|---------|-------------|------|-------------------|
| webapp | `apps/webapp` | WEB ショップアプリケーション | 5432 / 8080 |

---

## 4. 技術スタック

### バックエンド

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| 言語 | Java | 25 |
| フレームワーク | Spring Boot | 4.0.x |
| ビルドツール | Gradle | 9.x (Wrapper) |
| ORM | MyBatis | 4.0.1 |
| データベース | PostgreSQL / H2 | 16.x / 2.x |
| マイグレーション | Flyway | 10.x |
| テスト | JUnit 5, Mockito, AssertJ, Testcontainers | - |
| 品質管理 | Checkstyle, SpotBugs, JaCoCo | - |

### フロントエンド

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| テンプレートエンジン | Thymeleaf | 3.x |
| CSS | Bootstrap | 5.3.x |
| 動的 UI | htmx | 2.x |

### インフラストラクチャ

| カテゴリ | 技術 |
|---------|------|
| コンテナ | Docker / Docker Compose |
| CI/CD | GitHub Actions |

---

## 5. プロファイル構成

開発効率を高めるため、複数のプロファイルを使い分けます。

| プロファイル | データベース | Docker | 用途 |
|-------------|------------|--------|------|
| default | H2（インメモリ） | 不要 | 日常開発・即座起動 |
| product | PostgreSQL 16.x | 必要 | 本番互換テスト |

### default プロファイル（推奨：日常開発）

Docker なしで即座に起動できます。

```bash
cd apps/webapp
./gradlew bootRun
```

### product プロファイル（本番互換）

```bash
# データベースコンテナを起動
docker compose up -d postgres

# product プロファイルで起動
cd apps/webapp
./gradlew bootRun --args='--spring.profiles.active=product'
```

---

## 6. 開発サーバーの起動

### タスクランナー経由（推奨）

```bash
# 開発サーバー起動（default プロファイル）
npm run webapp:dev

# TDD モード（テスト自動再実行）
npm run webapp:tdd

# タスク一覧を表示
npx gulp --tasks
```

### ビルドツール直接実行

```bash
cd apps/webapp

# default プロファイルで起動
./gradlew bootRun

# TDD モード（テストを常に再実行）
./gradlew test --continuous
```

### アクセス確認

| サービス | URL | 説明 |
|---------|-----|------|
| アプリケーション | http://localhost:8080 | メインアプリケーション |
| H2 コンソール | http://localhost:8080/h2-console | データベース管理（default プロファイル） |

---

## 7. Docker Compose のセットアップ

### データベースコンテナの起動

```bash
# PostgreSQL を起動
docker compose up -d postgres

# コンテナの状態確認
docker compose ps
```

### Docker Compose の便利なコマンド

```bash
# PostgreSQL を起動
docker compose up -d postgres

# コンテナの停止と削除
docker compose down

# ログを確認
docker compose logs -f postgres

# データベースに接続
docker compose exec postgres psql -U frere -d frere
```

---

## 8. テストの実行

### 全テスト実行

```bash
cd apps/webapp

# テスト実行（カバレッジレポート付き）
./gradlew test
```

### テストの種類

| テスト種別 | ツール | 説明 |
|-----------|--------|------|
| 単体テスト | JUnit 5 + Mockito | ドメインロジックのテスト |
| 統合テスト | Testcontainers | データベースを使用したテスト |

### テストカバレッジ

```bash
# テストを実行してカバレッジレポートを生成
cd apps/webapp
./gradlew test jacocoTestReport

# レポートの表示
# apps/webapp/build/reports/jacoco/test/html/index.html
```

---

## 9. コード品質管理

### 静的コード解析ツール

| ツール | 目的 | コマンド |
|--------|------|---------|
| Checkstyle | コーディング規約の検証 | `./gradlew checkstyleMain` |
| SpotBugs | バグパターン検出 | `./gradlew spotbugsMain` |
| JaCoCo | テストカバレッジ | `./gradlew jacocoTestReport` |

### 品質チェックの実行

```bash
cd apps/webapp

# 品質チェックのみ
./gradlew checkstyleMain spotbugsMain

# すべてのテストと品質チェック
./gradlew build
```

### コード複雑度の基準

| 指標 | 閾値 | 説明 |
|------|------|------|
| 循環的複雑度 | 10 | 分岐・ループの複雑さ |
| ファイルサイズ | 500 行 | 1 ファイルの最大行数 |
| メソッドサイズ | 150 行 | 1 メソッドの最大行数 |
| パラメータ数 | 7 | メソッドの最大パラメータ数 |

### レポートの確認

品質チェック後、以下のディレクトリにレポートが生成されます。

| ツール | レポートパス |
|--------|-------------|
| Checkstyle | `apps/webapp/build/reports/checkstyle/main.html` |
| SpotBugs | `apps/webapp/build/reports/spotbugs/main.html` |
| JaCoCo | `apps/webapp/build/reports/jacoco/test/html/index.html` |
| テスト結果 | `apps/webapp/build/reports/tests/test/index.html` |

---

## 10. ディレクトリ構造

```
case-study-bouquet/
├── .husky/                          # Git Hooks (Husky)
│   └── pre-commit                   # コミット前品質チェック
├── apps/
│   └── webapp/
│       ├── build.gradle
│       ├── config/                  # 品質管理ツール設定
│       │   ├── checkstyle/
│       │   │   └── checkstyle.xml
│       │   └── spotbugs/
│       │       └── exclude-filter.xml
│       └── src/
│           ├── main/
│           │   ├── java/com/example/frere/
│           │   │   ├── domain/            # ドメイン層
│           │   │   ├── infrastructure/    # インフラストラクチャ層
│           │   │   └── presentation/      # プレゼンテーション層
│           │   └── resources/
│           │       ├── application.yml
│           │       ├── application-product.yml
│           │       ├── templates/         # Thymeleaf テンプレート
│           │       └── db/migration/      # Flyway マイグレーション
│           └── test/
├── docs/                            # ドキュメント
├── ops/                             # 運用スクリプト
│   └── scripts/
│       └── webapp.js                # Gulp webapp タスク
├── docker-compose.yml
├── gulpfile.js
└── package.json                     # Node.js 依存関係（husky, lint-staged）
```

---

## 11. 命名規則

| 要素 | 規則 | 例 |
|------|------|-----|
| テーブル名 | snake_case | `purchase_order` |
| カラム名 | snake_case | `order_status` |
| クラス名 | PascalCase | `PurchaseOrder` |
| フィールド名 | camelCase | `orderStatus` |

---

## 12. Git 規約

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/ja/) に従います。

| タイプ | 説明 |
|--------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードの意味に影響しない変更 |
| `refactor` | バグ修正でも機能追加でもないコード変更 |
| `perf` | パフォーマンス改善 |
| `test` | テストの追加・修正 |
| `chore` | ビルドプロセス・補助ツールの変更 |

### スコープ

サブシステムを示すスコープを使用します。

```
feat(webapp): 変更内容
fix(webapp): 変更内容
docs: 変更内容
```

### Git Hooks（Husky + lint-staged）

コミット時に自動で品質チェックが実行されます。

#### セットアップ

`npm install` 実行時に Husky は自動的にセットアップされます（`prepare` スクリプト）。

```bash
# 手動でセットアップする場合
npx husky init
```

#### pre-commit フック

ソースファイルに変更がある場合、以下のチェックが自動実行されます。

| ツール | 目的 |
|--------|------|
| Checkstyle | コーディング規約の検証 |

いずれかのチェックが失敗すると、コミットがブロックされます。

#### フックをスキップする場合

緊急時にフックをスキップしてコミットする場合（非推奨）：

```bash
git commit --no-verify -m "メッセージ"
```

> **Warning**: フックのスキップは緊急時のみ使用してください。品質チェックを通過しないコードはチームに影響を与える可能性があります。

---

## 13. セットアップの確認

すべてのセットアップが完了したら、以下のコマンドで動作確認を行います。

```bash
# 1. Node.js 依存パッケージのインストール
npm install

# 2. ビルド確認
cd apps/webapp
./gradlew build -x test

# 3. テスト実行
./gradlew test

# 4. 品質チェック
./gradlew checkstyleMain spotbugsMain

# 5. 開発サーバー起動（default プロファイル）
./gradlew bootRun
```

### アクセス確認

| サービス | URL | 説明 |
|---------|-----|------|
| アプリケーション | http://localhost:8080 | メインアプリケーション |
| H2 コンソール | http://localhost:8080/h2-console | データベース管理ツール |

---

## 14. CI/CD

CI/CD による継続的インテグレーション・デプロイは別途設定予定です。

---

## トラブルシューティング

### ポート 8080 が使用中

**問題**: アプリケーション起動時にポート 8080 が使用中と表示される。

**解決策**: 使用中のプロセスを終了するか、別ポートで起動する。

```bash
# ポートを使用中のプロセスを確認
lsof -i :8080

# 別ポートで起動
./gradlew bootRun --args='--server.port=8081'
```

### PostgreSQL コンテナが起動しない

**問題**: Docker Compose で PostgreSQL が起動しない。

**解決策**: Docker Desktop が起動していることを確認し、ポート競合がないか確認する。

```bash
# Docker の状態確認
docker info

# ポート確認
lsof -i :5432
```

### pre-commit フックが失敗する場合

```bash
cd apps/webapp

# 品質チェックを手動実行してエラーを確認
./gradlew checkstyleMain spotbugsMain

# エラーを修正してから再度コミット
```

---

## 関連ドキュメント

- [技術スタック選定](../design/tech_stack.md)
- [アーキテクチャ設計](../design/architecture.md)
- [テスト戦略](../design/test_strategy.md)
