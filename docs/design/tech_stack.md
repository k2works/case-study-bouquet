# 技術スタック選定 - フレール・メモワール WEB ショップシステム

## 概要

本ドキュメントでは、フレール・メモワール WEB ショップシステムで採用する技術スタックを一覧化し、各技術の選定理由を記録する。アーキテクチャ設計（レイヤード3層アーキテクチャ＋ドメインモデル）および非機能要件に基づき、保守性・開発効率・運用性のバランスを重視して選定した。

## バックエンド

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Java | 25 | アプリケーション実装言語 | 長期サポート、豊富なエコシステム、Spring Boot との親和性 | Oracle Free Terms | GA（LTS: Java 21） |
| Spring Boot | 4.0.x | アプリケーションフレームワーク | 自動構成による開発効率、Spring エコシステムの活用、モジュール化された自動設定（ADR-001 参照） | Apache 2.0 | GA（4.0.5 リリース済み） |
| Spring Framework | 7.x | コアフレームワーク | Spring Boot 4 の基盤、JSpecify による null safety 強化、Jakarta EE 11 対応 | Apache 2.0 | GA（Spring Boot 4 に同梱） |
| Spring MVC | 7.x | Web フレームワーク | SSR アーキテクチャとの親和性、Controller-Service-Repository の標準的なパターン | Apache 2.0 | GA（Spring Boot に同梱） |
| Spring Security | 7.x | 認証・認可 | フォームベース認証、RBAC、セッション管理の標準実装（非機能要件: セキュリティ） | Apache 2.0 | GA（Spring Boot に同梱） |
| MyBatis | 3.x | データアクセス | XML マッパーによる SQL の明示的管理、Spring Boot 統合（ADR-004 参照） | Apache 2.0 | GA（アクティブ開発中、Spring Boot 4 互換性要確認） |

## フロントエンド

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Thymeleaf | 3.x | テンプレートエンジン（SSR） | Spring Boot との統合、サーバーサイドレンダリングによるシンプルな構成（ADR-002 参照） | Apache 2.0 | GA（安定版） |
| Bootstrap | 5.x | CSS フレームワーク | レスポンシブデザイン、豊富なコンポーネント、学習コストの低さ | MIT | GA（LTS） |
| htmx | 2.x | 動的 UI 操作 | SSR 構成を維持しつつ部分的な動的更新を実現、JavaScript の最小化 | BSD 2-Clause | GA（アクティブ開発中） |

## データベース

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PostgreSQL | 16.x | 本番用 RDBMS | 信頼性、ACID 準拠、JSON 型サポート、運用実績 | PostgreSQL License | GA（EOL: 2028-11） |
| H2 | 2.x | テスト・開発用インメモリ DB | MyBatis 互換、テスト実行の高速化、セットアップ不要 | MPL 2.0 / EPL 1.0 | GA（アクティブ開発中） |
| Flyway | 10.x | DB マイグレーション | バージョン管理されたスキーマ変更、Spring Boot 統合 | Apache 2.0 | GA（Community Edition） |

## テスト

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| JUnit 5 | 5.x | テストフレームワーク | Java 標準のテストフレームワーク、パラメータ化テスト対応 | EPL 2.0 | GA（アクティブ開発中） |
| Mockito | 5.x | モックライブラリ | Spring Boot Test との統合、直感的な API | MIT | GA（アクティブ開発中） |
| AssertJ | 3.x | アサーションライブラリ | 流暢な API、可読性の高いテストコード | Apache 2.0 | GA（アクティブ開発中） |
| Testcontainers | 2.x | 統合テスト用コンテナ | 実 DB（PostgreSQL）を使用した統合テスト、Spring Boot 4 の @ServiceConnection 対応 | Apache 2.0 | GA（2.0 リリース済み） |
| Spring MockMvc | - | Controller テスト | Spring MVC のエンドポイントテスト、Thymeleaf テンプレートの検証 | Apache 2.0 | GA（Spring Boot に同梱） |

## ビルド・CI/CD

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Gradle | 9.x | ビルドツール | 柔軟なビルド設定、依存関係管理、Spring Boot 4 プラグイン対応 | Apache 2.0 | GA（9.2.1 使用中） |
| GitHub Actions | - | CI/CD パイプライン | GitHub リポジトリとの統合、ワークフロー定義の柔軟性 | - | GA（GitHub マネージド） |
| SonarQube | - | コード品質管理 | 静的解析、カバレッジ計測、Quality Gate による品質担保 | LGPL 3.0 | GA（Community Edition） |

## インフラ

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Docker | 24.x | コンテナ化 | 環境の再現性、開発・本番環境の一貫性 | Apache 2.0 | GA（アクティブ開発中） |
| Docker Compose | 2.x | ローカル開発環境構築 | マルチコンテナ管理、開発環境のセットアップ簡素化 | Apache 2.0 | GA（Docker に同梱） |
| Terraform | 1.x | IaC（Infrastructure as Code） | インフラのコード管理、再現性のあるプロビジョニング | BUSL 1.1 | GA（HashiCorp サポート） |
| AWS (ECS/RDS) | - | クラウド実行環境 | マネージドサービスによる運用負荷軽減、スケーラビリティ | - | GA（AWS マネージド） |

## ドキュメント

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MkDocs | 1.x | ドキュメントサイト生成 | Markdown ベース、Material テーマ、PlantUML 統合 | BSD 2-Clause | GA（アクティブ開発中） |
| PlantUML | - | ダイアグラム生成 | UML 図・ER 図のコードベース管理、テキストから図を生成 | GPL 3.0 | GA（アクティブ開発中） |
| Mermaid | 10.x | ダイアグラム生成 | Markdown 内でのインライン図表、MkDocs 統合 | MIT | GA（アクティブ開発中） |

## 開発ツール

| 技術名 | バージョン | 用途・役割 | 選定理由 | ライセンス | サポート状況 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| IntelliJ IDEA | - | IDE | Java/Spring Boot 開発の標準 IDE、リファクタリング支援 | Commercial / Community | GA（JetBrains サポート） |
| Node.js | 22.x | 開発タスクランナー | Gulp タスク実行、MkDocs 連携スクリプト | MIT | GA（LTS） |
| Gulp | 5.x | タスクランナー | 運用スクリプトの統合管理、開発ワークフローの自動化 | MIT | GA（アクティブ開発中） |
| Checkstyle | - | Java コードスタイルチェック | コーディング規約の自動チェック | LGPL 2.1 | GA（アクティブ開発中） |
| SpotBugs | - | Java 静的解析 | バグパターンの自動検出 | LGPL 2.1 | GA（アクティブ開発中） |

## 選定理由の総括

本システムの技術スタック選定は、以下の方針に基づいている。

1. **シンプルさの優先**: レイヤード3層アーキテクチャに適合する Spring Boot エコシステムを中心に据え、SSR（Thymeleaf）により フロントエンド/バックエンドの分離を不要とした（ADR-002 参照）
2. **保守性の確保**: 広く普及した技術を採用し、長期的なメンテナンスとチームの学習コストを低減した
3. **段階的な拡張**: MVP フェーズでは単一サーバー構成から開始し、負荷に応じてスケールアウト可能な技術を選定した（ADR-003 参照）
4. **テスト容易性**: TDD を支援するテストツール群を標準装備し、各層に適したテスト戦略を実現した
