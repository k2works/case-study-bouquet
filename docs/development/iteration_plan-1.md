# イテレーション 1 計画

## 概要

| 項目 | 内容 |
|------|------|
| **イテレーション** | 1 |
| **期間** | 2026-03-30 〜 2026-04-05（1 週間） |
| **ゴール** | 認証基盤と商品管理の基盤を構築し、スタッフが単品・商品を登録できる状態にする |
| **目標 SP** | 10 |

---

## ゴール

### イテレーション終了時の達成状態

1. **認証基盤**: 得意先が会員登録・ログインできる
2. **単品マスタ**: スタッフが単品（花）を登録・一覧表示できる
3. **商品管理**: スタッフが商品（花束）を登録し、構成（単品の組合せ）を設定できる

### 成功基準

- [ ] 会員登録フォームからユーザーを登録できる
- [ ] ログイン・ログアウトが正常に動作する
- [ ] 単品マスタの CRUD 操作が完了している
- [ ] 商品（花束）の登録と構成設定が動作する
- [ ] テストカバレッジ 80% 以上

---

## ユーザーストーリー

### 対象ストーリー

| ID | ユーザーストーリー | SP | 優先度 |
|----|-------------------|----|----|
| US014 | 会員登録・ログイン | 3 | 必須 |
| US001 | 単品マスタ登録 | 2 | 必須 |
| US002 | 商品（花束）登録 | 2 | 必須 |
| US003 | 商品構成設定 | 3 | 必須 |
| **合計** | | **10** | |

### ストーリー詳細

#### US014: 会員登録・ログイン

**ストーリー**:
> 得意先として、WEB ショップに会員登録してログインしたい。なぜなら、注文や届け先コピーなどの機能を利用するために本人確認が必要だからだ。

**受入条件**:

1. メールアドレス・パスワード・名前・連絡先で会員登録できる
2. 登録済みのメールアドレスとパスワードでログインできる
3. 重複メールアドレスで登録しようとするとエラーが表示される
4. 誤ったパスワードでログインするとエラーが表示される

#### US001: 単品マスタ登録

**ストーリー**:
> フレール・メモワール スタッフとして、単品（花）のマスタを登録したい。なぜなら、商品（花束）の構成に使用する花材を整備する必要があるからだ。

**受入条件**:

1. 単品名・品質維持日数・仕入先を入力して保存できる
2. 単品名が空欄の場合はエラーが表示される
3. 品質維持日数が 0 日以下の場合はエラーが表示される

#### US002: 商品（花束）登録

**ストーリー**:
> フレール・メモワール スタッフとして、商品（花束）を新規登録したい。なぜなら、得意先に提供する商品ラインナップを拡充する必要があるからだ。

**受入条件**:

1. 商品名・説明・価格を入力して保存できる
2. 価格が 0 円以下の場合はエラーが表示される
3. 価格 1 円以上で正しく登録される

#### US003: 商品構成設定

**ストーリー**:
> フレール・メモワール スタッフとして、商品（花束）の構成（単品の組合せ）を設定したい。なぜなら、花束に使用する花材の種類と数量を定義する必要があるからだ。

**受入条件**:

1. 商品に対して単品と数量の組合せを設定できる
2. 構成が空（単品 0 件）の場合はエラーが表示される
3. 単品数量 1 本以上で正しく保存される

### タスク

#### 1. 認証基盤（US014: 3 SP）

| # | タスク | 見積もり | 担当 | 状態 |
|---|--------|---------|------|------|
| 1.1 | ユーザーエンティティ・リポジトリの設計と実装 | 4h | - | [x] |
| 1.2 | 会員登録 API・画面の実装 | 4h | - | [ ] |
| 1.3 | ログイン・ログアウト機能の実装（Spring Security） | 4h | - | [ ] |
| 1.4 | バリデーション（重複メール、パスワード不正）の実装 | 2h | - | [ ] |

**小計**: 14h（理想時間）

#### 2. 単品マスタ登録（US001: 2 SP）

| # | タスク | 見積もり | 担当 | 状態 |
|---|--------|---------|------|------|
| 2.1 | 単品エンティティ・リポジトリの設計と実装 | 4h | - | [ ] |
| 2.2 | 単品 CRUD API・画面の実装 | 4h | - | [ ] |
| 2.3 | バリデーション（単品名必須、品質維持日数 >= 1）の実装 | 2h | - | [ ] |

**小計**: 10h（理想時間）

#### 3. 商品登録（US002: 2 SP）

| # | タスク | 見積もり | 担当 | 状態 |
|---|--------|---------|------|------|
| 3.1 | 商品エンティティ・リポジトリの設計と実装 | 4h | - | [ ] |
| 3.2 | 商品 CRUD API・画面の実装 | 4h | - | [ ] |
| 3.3 | バリデーション（価格 >= 1）の実装 | 2h | - | [ ] |

**小計**: 10h（理想時間）

#### 4. 商品構成設定（US003: 3 SP）

| # | タスク | 見積もり | 担当 | 状態 |
|---|--------|---------|------|------|
| 4.1 | 商品構成エンティティ・リポジトリの設計と実装 | 4h | - | [ ] |
| 4.2 | 商品構成設定 API・画面の実装 | 4h | - | [ ] |
| 4.3 | バリデーション（構成 >= 1 件、数量 >= 1）の実装 | 2h | - | [ ] |
| 4.4 | 商品詳細画面での構成表示 | 2h | - | [ ] |

**小計**: 12h（理想時間）

#### タスク合計

| カテゴリ | SP | 理想時間 | 状態 |
|---------|----|----|------|
| 認証基盤（US014） | 3 | 14h | [ ] |
| 単品マスタ登録（US001） | 2 | 10h | [ ] |
| 商品登録（US002） | 2 | 10h | [ ] |
| 商品構成設定（US003） | 3 | 12h | [ ] |
| **合計** | **10** | **46h** | |

**1 SP あたり**: 約 4.6h
**進捗率**: 0% (0/10 SP)

---

## スケジュール

### Week 1（Day 1-5: 2026-03-30 〜 2026-04-03）

```mermaid
gantt
    title イテレーション 1
    dateFormat  YYYY-MM-DD
    section 認証基盤 (US014)
    エンティティ・リポジトリ     :d1, 2026-03-30, 1d
    会員登録 API・画面            :d2, 2026-03-31, 1d
    ログイン・ログアウト          :d3, 2026-04-01, 1d
    section 単品マスタ (US001)
    エンティティ・CRUD            :d4, 2026-04-01, 1d
    バリデーション                :d5, 2026-04-02, 1d
    section 商品管理 (US002, US003)
    商品エンティティ・CRUD        :d6, 2026-04-02, 1d
    商品構成設定                  :d7, 2026-04-03, 1d
    統合テスト・バグ修正          :d8, 2026-04-04, 1d
```

| 日 | タスク |
|----|--------|
| Day 1 (3/30) | 認証: エンティティ・リポジトリの設計と実装 |
| Day 2 (3/31) | 認証: 会員登録 API・画面の実装 |
| Day 3 (4/1) | 認証: ログイン・ログアウト、単品: エンティティ・CRUD |
| Day 4 (4/2) | 単品: バリデーション、商品: エンティティ・CRUD |
| Day 5 (4/3) | 商品構成設定、統合テスト・バグ修正 |

---

## 設計

### ドメインモデル

```plantuml
@startuml

package "得意先集約" {
  class 得意先 <<集約ルート>> {
    得意先ID
    名前
    メールアドレス
    パスワード
    電話番号
    住所
  }
  class メールアドレス <<値オブジェクト>> {
    アドレス
  }
  class パスワード <<値オブジェクト>> {
    ハッシュ値
  }
  class 名前 <<値オブジェクト>> {
    氏名
  }
  class 住所 <<値オブジェクト>> {
    住所文字列
  }
  class 電話番号 <<値オブジェクト>> {
    番号
  }

  得意先 *-- メールアドレス
  得意先 *-- パスワード
  得意先 *-- 名前
  得意先 *-- 住所
  得意先 *-- 電話番号
}

package "単品集約" {
  class 単品 <<集約ルート>> {
    単品ID
    単品名
    品質維持日数
    仕入単価
  }
  class 品質維持日数 <<値オブジェクト>> {
    日数
    + 期限日を計算する()
  }

  単品 *-- 品質維持日数
}

package "商品集約" {
  class 商品 <<集約ルート>> {
    商品ID
    商品名
    説明
    価格
    有効フラグ
    + 構成を設定する()
    + 廃止する()
  }
  class 商品構成 <<エンティティ>> {
    構成ID
    単品ID
    数量
  }
  class 価格 <<値オブジェクト>> {
    金額
  }

  商品 *-- 価格
  商品 "1" *-- "*" 商品構成
}

商品構成 ..> 単品 : 参照

@enduml
```

### データモデル

```plantuml
@startuml
hide circle
skinparam linetype ortho

entity "customers（得意先）" as customers {
  * customer_id : BIGINT <<PK>>
  --
  * name : VARCHAR(100)
  * email : VARCHAR(255) <<UNIQUE>>
  * password_hash : VARCHAR(255)
  * phone : VARCHAR(20)
  * address : VARCHAR(500)
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

entity "items（単品）" as items {
  * item_id : BIGINT <<PK>>
  --
  * item_name : VARCHAR(200)
  * supplier_id : BIGINT <<FK>>
  * quality_retention_days : INT
  * unit_price : DECIMAL(10,0)
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

entity "products（商品）" as products {
  * product_id : BIGINT <<PK>>
  --
  * product_name : VARCHAR(200)
  description : TEXT
  * price : DECIMAL(10,0)
  * is_active : BOOLEAN
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

entity "product_compositions（商品構成）" as product_compositions {
  * composition_id : BIGINT <<PK>>
  --
  * product_id : BIGINT <<FK>>
  * item_id : BIGINT <<FK>>
  * quantity : INT
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

products ||--o{ product_compositions
product_compositions }o--|| items

@enduml
```

### ユーザーインターフェース

#### ビュー

```plantuml
@startsalt
{+
  ログイン画面
  {+
    {
      メールアドレス | "example@mail.com   "
      パスワード     | "********           "
    }
    [ログイン]
    ---
    <&person> 新規会員登録はこちら
  }
----------------
  会員登録画面
  {+
    {
      氏名           | "山田 花子           "
      メールアドレス | "hanako@example.com  "
      パスワード     | "********            "
      パスワード確認 | "********            "
      電話番号       | "03-1234-5678        "
      住所           | "東京都千代田区...    "
    }
    [登録する]
    ---
    <&person> ログイン画面に戻る
  }
----------------
  商品管理画面
  {+
    管理画面 | [受注] | [在庫推移] | [発注] | [入荷] | [出荷] | [得意先]
    ==
    商品管理
    ---
    {T
      + 商品ID | 商品名       | 価格    | 有効 | 操作
      + P-001  | バラの花束   | ¥5,000 | ✓    | [編集] | [構成]
      + P-002  | ユリの花束   | ¥7,000 | ✓    | [編集] | [構成]
      + P-003  | ミックス花束 | ¥6,000 | ✓    | [編集] | [構成]
    }
    ---
    [新規商品登録]
    ---
    商品構成（バラの花束）
    {T
      + 単品名     | 数量 | 操作
      + バラ（赤） | 5    | [削除]
      + バラ（白） | 3    | [削除]
      + カスミソウ | 2    | [削除]
    }
    [単品追加]
  }
}
@endsalt
```

#### インタラクション

```plantuml
@startuml

title 画面遷移図

[*] --> ログイン

state ログイン : メールアドレス・パスワードを入力
ログイン --> 会員登録 : 新規会員登録
ログイン --> 商品管理 : ログイン成功（管理者）
ログイン --> ログイン : ログイン失敗

state 会員登録 : 会員情報を入力
会員登録 --> ログイン : 登録完了
会員登録 --> 会員登録 : バリデーションエラー

state 商品管理 : 商品一覧・CRUD
商品管理 --> 商品構成設定 : 構成設定
商品構成設定 --> 商品管理 : 保存完了
商品管理 --> [*] : ログアウト

@enduml
```

### ディレクトリ構成

```
apps/webapp/src/main/java/
├── presentation/
│   ├── controller/
│   │   ├── AuthController        # UC010: 会員登録・ログイン
│   │   └── ProductController     # UC001: 商品マスタ管理
│   └── dto/
│       ├── RegisterRequest
│       ├── LoginRequest
│       ├── ProductRequest
│       └── ItemRequest
├── application/
│   └── service/
│       ├── AuthService
│       └── ProductService
├── infrastructure/
│   ├── persistence/
│   │   ├── CustomerMapper
│   │   ├── ItemMapper
│   │   └── ProductMapper
│   └── config/
│       └── SecurityConfig
└── domain/
    └── model/
        ├── customer/
        │   ├── Customer, Email, Password, Name, Address
        ├── item/
        │   ├── Item, QualityRetentionDays
        └── product/
            ├── Product, ProductComposition, Price
```

### API 設計

| メソッド | エンドポイント | 説明 | 関連 US |
|---------|---------------|------|---------|
| GET | /login | ログイン画面表示 | US014 |
| POST | /login | ログイン処理 | US014 |
| GET | /register | 会員登録画面表示 | US014 |
| POST | /register | 会員登録処理 | US014 |
| POST | /logout | ログアウト処理 | US014 |
| GET | /admin/products | 商品一覧表示 | US001, US002 |
| POST | /admin/products | 商品新規登録 | US002 |
| PUT | /admin/products/{id} | 商品更新 | US002 |
| GET | /admin/products/{id}/compositions | 商品構成表示 | US003 |
| POST | /admin/products/{id}/compositions | 商品構成追加 | US003 |
| DELETE | /admin/products/{id}/compositions/{cid} | 商品構成削除 | US003 |
| GET | /admin/items | 単品一覧表示 | US001 |
| POST | /admin/items | 単品新規登録 | US001 |

### データベーススキーマ

```sql
CREATE TABLE customers (
    customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(200) NOT NULL,
    supplier_id BIGINT,
    quality_retention_days INT NOT NULL,
    unit_price DECIMAL(10,0) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,0) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_compositions (
    composition_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);
```

### ADR

| ADR | タイトル | ステータス |
|-----|---------|-----------|
| ADR-001 | Spring Boot 採用 | 承認 |
| ADR-002 | Thymeleaf SSR 採用 | 承認 |
| ADR-003 | レイヤード 3 層アーキテクチャ採用 | 承認 |
| ADR-004 | MyBatis 採用 | 承認 |

---

## リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| Spring Security の設定が複雑 | 中 | ADR-001 に従い標準的な設定を使用、公式ドキュメント参照 |
| 商品構成のデータモデルが複雑 | 中 | 多対多リレーションをシンプルに設計、TDD で段階的に実装 |
| テストカバレッジ目標未達 | 低 | TDD サイクルを厳守し、テストファーストで開発 |

---

## 完了条件

### Definition of Done

- [ ] コードレビュー完了
- [ ] ユニットテストがパス
- [ ] E2E テストがパス
- [ ] ESLint エラーなし
- [ ] 機能がローカル環境で動作確認済み
- [ ] ドキュメント更新完了

### デモ項目

1. 会員登録フォームからの新規ユーザー登録
2. ログイン・ログアウトの動作確認
3. 単品マスタの登録・一覧表示
4. 商品（花束）の登録と構成設定

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2026-03-30 | 初版作成 | - |

---

## 関連ドキュメント

- [リリース計画](./release_plan.md)
