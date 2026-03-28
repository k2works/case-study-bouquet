import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ARCH_PATH = resolve(__dirname, '..', 'architecture_design.md')
const DATA_MODEL_PATH = resolve(__dirname, '..', 'data_model.md')
const DOMAIN_MODEL_PATH = resolve(__dirname, '..', 'domain_model.md')
const UI_DESIGN_PATH = resolve(__dirname, '..', 'ui_design.md')
const INDEX_PATH = resolve(__dirname, '..', 'index.md')

// --- Helper functions ---

function readArchitecture() {
  if (!existsSync(ARCH_PATH)) {
    throw new Error(
      `アーキテクチャ設計書が存在しません: ${ARCH_PATH}`
    )
  }
  return readFileSync(ARCH_PATH, 'utf-8')
}

function readDataModel() {
  if (!existsSync(DATA_MODEL_PATH)) {
    throw new Error(
      `データモデル設計書が存在しません: ${DATA_MODEL_PATH}`
    )
  }
  return readFileSync(DATA_MODEL_PATH, 'utf-8')
}

function readDomainModel() {
  if (!existsSync(DOMAIN_MODEL_PATH)) {
    throw new Error(
      `ドメインモデル設計書が存在しません: ${DOMAIN_MODEL_PATH}`
    )
  }
  return readFileSync(DOMAIN_MODEL_PATH, 'utf-8')
}

function readUiDesign() {
  if (!existsSync(UI_DESIGN_PATH)) {
    throw new Error(
      `UI 設計書が存在しません: ${UI_DESIGN_PATH}`
    )
  }
  return readFileSync(UI_DESIGN_PATH, 'utf-8')
}

function readIndex() {
  if (!existsSync(INDEX_PATH)) {
    throw new Error(`index.md が存在しません: ${INDEX_PATH}`)
  }
  return readFileSync(INDEX_PATH, 'utf-8')
}

function countPatternMatches(content, pattern) {
  const matches = content.match(pattern)
  return matches ? matches.length : 0
}

// ============================================================
// ファイルの存在確認
// ============================================================

describe('設計ドキュメントの存在確認', () => {
  it('should exist at docs/design/architecture_design.md', () => {
    // Given: アーキテクチャ設計書のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(ARCH_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `アーキテクチャ設計書が存在しません: ${ARCH_PATH}`)
  })

  it('should exist at docs/design/data_model.md', () => {
    // Given: データモデル設計書のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(DATA_MODEL_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `データモデル設計書が存在しません: ${DATA_MODEL_PATH}`)
  })

  it('should exist at docs/design/domain_model.md', () => {
    // Given: ドメインモデル設計書のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(DOMAIN_MODEL_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `ドメインモデル設計書が存在しません: ${DOMAIN_MODEL_PATH}`)
  })

  it('should exist at docs/design/ui_design.md', () => {
    // Given: UI 設計書のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(UI_DESIGN_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `UI 設計書が存在しません: ${UI_DESIGN_PATH}`)
  })
})

// ============================================================
// アーキテクチャ設計
// ============================================================

describe('アーキテクチャ設計', () => {
  describe('タイトルと概要', () => {
    it('should have a title indicating architecture design', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: タイトル行を確認する
      // Then: アーキテクチャ設計であることが示されている
      assert.match(
        content,
        /^# .*アーキテクチャ/m,
        'タイトルに「アーキテクチャ」が含まれていません'
      )
    })

    it('should mention hexagonal architecture', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: ヘキサゴナルアーキテクチャへの言及を確認する
      // Then: ヘキサゴナルアーキテクチャが記述されている
      assert.match(
        content,
        /ヘキサゴナル|hexagonal/i,
        'ヘキサゴナルアーキテクチャへの言及がありません'
      )
    })

    it('should not contain template placeholders', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: テンプレートのプレースホルダを検索する
      // Then: プレースホルダが残っていない
      const placeholderPattern = /\[(?:システム名|レイヤー名\d*|パッケージ名\d*|コンポーネント名\d*)\]/g
      const matches = content.match(placeholderPattern)
      assert.equal(
        matches,
        null,
        `テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
      )
    })
  })

  describe('レイヤー構成', () => {
    it('should define domain layer', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: ドメイン層の記述を確認する
      // Then: ドメイン層が定義されている
      assert.match(
        content,
        /ドメイン層|ドメインレイヤー|domain/i,
        'ドメイン層の定義がありません'
      )
    })

    it('should define application layer', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: アプリケーション層の記述を確認する
      // Then: アプリケーション層が定義されている
      assert.match(
        content,
        /アプリケーション層|アプリケーションレイヤー|application/i,
        'アプリケーション層の定義がありません'
      )
    })

    it('should define adapter layer', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: アダプター層の記述を確認する
      // Then: アダプター層が定義されている
      assert.match(
        content,
        /アダプター層|アダプターレイヤー|adapter/i,
        'アダプター層の定義がありません'
      )
    })

    it('should define infrastructure layer', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: インフラストラクチャ層の記述を確認する
      // Then: インフラストラクチャ層が定義されている
      assert.match(
        content,
        /インフラストラクチャ層|インフラ層|infrastructure/i,
        'インフラストラクチャ層の定義がありません'
      )
    })
  })

  describe('ポートの定義', () => {
    it('should define inbound ports', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: インバウンドポートの記述を確認する
      // Then: インバウンドポートが定義されている
      assert.match(
        content,
        /インバウンド.*ポート|inbound.*port|ポート.*in/i,
        'インバウンドポートの定義がありません'
      )
    })

    it('should define outbound ports', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: アウトバウンドポートの記述を確認する
      // Then: アウトバウンドポートが定義されている
      assert.match(
        content,
        /アウトバウンド.*ポート|outbound.*port|ポート.*out/i,
        'アウトバウンドポートの定義がありません'
      )
    })
  })

  describe('パッケージ構成', () => {
    it('should define domain/model package', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: domain/model パッケージの記述を確認する
      // Then: パッケージが定義されている
      assert.match(
        content,
        /domain.*model|domain\/model/i,
        'domain/model パッケージの定義がありません'
      )
    })

    it('should define domain/repository package', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: domain/repository パッケージの記述を確認する
      // Then: パッケージが定義されている
      assert.match(
        content,
        /domain.*repository|domain\/repository/i,
        'domain/repository パッケージの定義がありません'
      )
    })

    it('should define application/service or application/port package', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: application パッケージの記述を確認する
      // Then: パッケージが定義されている
      assert.match(
        content,
        /application.*service|application.*port|application\/service|application\/port/i,
        'application パッケージの定義がありません'
      )
    })

    it('should define adapter/in/web package for Spring MVC Controllers', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: adapter/in/web パッケージの記述を確認する
      // Then: パッケージが定義されている
      assert.match(
        content,
        /adapter.*in.*web|adapter\/in\/web/i,
        'adapter/in/web パッケージの定義がありません'
      )
    })

    it('should define adapter/out/persistence package', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: adapter/out/persistence パッケージの記述を確認する
      // Then: パッケージが定義されている
      assert.match(
        content,
        /adapter.*out.*persistence|adapter\/out\/persistence/i,
        'adapter/out/persistence パッケージの定義がありません'
      )
    })
  })

  describe('技術スタックの言及', () => {
    it('should mention Spring Boot', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: Spring Boot の言及を確認する
      // Then: Spring Boot が記述されている
      assert.match(
        content,
        /Spring Boot/,
        'Spring Boot への言及がありません'
      )
    })

    it('should mention Thymeleaf', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: Thymeleaf の言及を確認する
      // Then: Thymeleaf が記述されている
      assert.match(
        content,
        /Thymeleaf/,
        'Thymeleaf への言及がありません'
      )
    })

    it('should mention apps/webapp/ as deployment target', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: apps/webapp/ の言及を確認する
      // Then: 配置先が記述されている
      assert.match(
        content,
        /apps\/webapp/,
        'apps/webapp/ 配置先への言及がありません'
      )
    })
  })

  describe('PlantUML 図', () => {
    it('should contain at least one architecture diagram in PlantUML', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: PlantUML 図の数を確認する
      const diagramCount = countPatternMatches(content, /@startuml/g)

      // Then: 少なくとも1つの図がある
      assert.ok(
        diagramCount >= 1,
        `PlantUML アーキテクチャ図が存在しません（${diagramCount}個）`
      )
    })

    it('should have matching @startuml and @enduml pairs', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: @startuml と @enduml の数を数える
      const startCount = countPatternMatches(content, /@startuml/g)
      const endCount = countPatternMatches(content, /@enduml/g)

      // Then: 対応が一致する
      assert.equal(
        startCount,
        endCount,
        `@startuml (${startCount}) と @enduml (${endCount}) の数が一致しません`
      )
    })

    it('should wrap all PlantUML in markdown code blocks', () => {
      // Given: アーキテクチャ設計書の内容
      const content = readArchitecture()

      // When: plantuml ブロックと @startuml の数を比較する
      const plantumlBlocks = countPatternMatches(content, /```plantuml/g)
      const startumlCount = countPatternMatches(content, /@startuml/g)

      // Then: すべての @startuml が ```plantuml ブロック内にある
      assert.equal(
        plantumlBlocks,
        startumlCount,
        `\`\`\`plantuml ブロック (${plantumlBlocks}) と @startuml (${startumlCount}) の数が一致しません`
      )
    })
  })
})

// ============================================================
// データモデル設計
// ============================================================

describe('データモデル設計', () => {
  describe('タイトルと概要', () => {
    it('should have a title indicating data model design', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: タイトル行を確認する
      // Then: データモデル設計であることが示されている
      assert.match(
        content,
        /^# .*データモデル/m,
        'タイトルに「データモデル」が含まれていません'
      )
    })

    it('should not contain template placeholders', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: テンプレートのプレースホルダを検索する
      // Then: プレースホルダが残っていない
      const placeholderPattern = /\[(?:テーブル名\d*|カラム名\d*|エンティティ名\d*)\]/g
      const matches = content.match(placeholderPattern)
      assert.equal(
        matches,
        null,
        `テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
      )
    })
  })

  describe('概念データモデル', () => {
    it('should contain a conceptual data model section', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 概念データモデルのセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /概念.*データモデル|概念.*モデル/,
        '概念データモデルセクションが存在しません'
      )
    })

    it('should include all 10 information entities', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 10 エンティティの存在を確認する
      const entities = [
        '得意先', '届け先', '受注', '商品',
        '商品構成', '単品', '仕入先', '発注', '入荷', '在庫',
      ]

      // Then: すべてのエンティティが含まれる
      for (const entity of entities) {
        assert.match(
          content,
          new RegExp(entity),
          `エンティティ「${entity}」が含まれていません`
        )
      }
    })
  })

  describe('論理データモデル', () => {
    it('should contain a logical data model section', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 論理データモデルのセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /論理.*データモデル|論理.*モデル/,
        '論理データモデルセクションが存在しません'
      )
    })

    it('should define primary keys for tables', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 主キーの定義を確認する
      // Then: 主キー（PK / PRIMARY KEY）の記述がある
      assert.match(
        content,
        /PK|PRIMARY KEY|主キー/i,
        '主キーの定義がありません'
      )
    })

    it('should define foreign keys for relationships', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 外部キーの定義を確認する
      // Then: 外部キー（FK / FOREIGN KEY）の記述がある
      assert.match(
        content,
        /FK|FOREIGN KEY|外部キー/i,
        '外部キーの定義がありません'
      )
    })
  })

  describe('テーブル定義', () => {
    it('should define customers table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: customers テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /customers|得意先.*テーブル/i,
        'customers（得意先）テーブルの定義がありません'
      )
    })

    it('should define orders table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: orders テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /orders|受注.*テーブル/i,
        'orders（受注）テーブルの定義がありません'
      )
    })

    it('should define products table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: products テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /products|商品.*テーブル/i,
        'products（商品）テーブルの定義がありません'
      )
    })

    it('should define items table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: items テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /items|単品.*テーブル/i,
        'items（単品）テーブルの定義がありません'
      )
    })

    it('should define stocks table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: stocks テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /stocks|在庫.*テーブル/i,
        'stocks（在庫）テーブルの定義がありません'
      )
    })

    it('should define suppliers table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: suppliers テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /suppliers|仕入先.*テーブル/i,
        'suppliers（仕入先）テーブルの定義がありません'
      )
    })

    it('should define delivery_destinations table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: delivery_destinations テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /delivery_destinations|届け先.*テーブル/i,
        'delivery_destinations（届け先）テーブルの定義がありません'
      )
    })

    it('should define purchase_orders table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: purchase_orders テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /purchase_orders|発注.*テーブル/i,
        'purchase_orders（発注）テーブルの定義がありません'
      )
    })

    it('should define arrivals table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: arrivals テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /arrivals|入荷.*テーブル/i,
        'arrivals（入荷）テーブルの定義がありません'
      )
    })

    it('should define product_compositions table', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: product_compositions テーブルの定義を確認する
      // Then: テーブルが定義されている
      assert.match(
        content,
        /product_compositions|商品構成.*テーブル/i,
        'product_compositions（商品構成）テーブルの定義がありません'
      )
    })
  })

  describe('ステータス定義', () => {
    it('should define order statuses (6 values)', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 受注ステータスの定義を確認する
      // Then: 受注ステータスが定義されている
      assert.match(
        content,
        /受注.*ステータス|order.*status/i,
        '受注ステータスの定義がありません'
      )
    })

    it('should define inventory statuses', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 在庫ステータスの定義を確認する
      // Then: 在庫ステータスが定義されている
      assert.match(
        content,
        /在庫.*ステータス|stock.*status|inventory.*status/i,
        '在庫ステータスの定義がありません'
      )
    })

    it('should define purchase order statuses', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: 発注ステータスの定義を確認する
      // Then: 発注ステータスが定義されている
      assert.match(
        content,
        /発注.*ステータス|purchase.*order.*status/i,
        '発注ステータスの定義がありません'
      )
    })
  })

  describe('PlantUML ER 図', () => {
    it('should contain at least one ER diagram in PlantUML', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: PlantUML 図の数を確認する
      const diagramCount = countPatternMatches(content, /@startuml/g)

      // Then: 少なくとも1つの図がある
      assert.ok(
        diagramCount >= 1,
        `PlantUML ER 図が存在しません（${diagramCount}個）`
      )
    })

    it('should have matching @startuml and @enduml pairs', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: @startuml と @enduml の数を数える
      const startCount = countPatternMatches(content, /@startuml/g)
      const endCount = countPatternMatches(content, /@enduml/g)

      // Then: 対応が一致する
      assert.equal(
        startCount,
        endCount,
        `@startuml (${startCount}) と @enduml (${endCount}) の数が一致しません`
      )
    })

    it('should wrap all PlantUML in markdown code blocks', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: plantuml ブロックと @startuml の数を比較する
      const plantumlBlocks = countPatternMatches(content, /```plantuml/g)
      const startumlCount = countPatternMatches(content, /@startuml/g)

      // Then: すべての @startuml が ```plantuml ブロック内にある
      assert.equal(
        plantumlBlocks,
        startumlCount,
        `\`\`\`plantuml ブロック (${plantumlBlocks}) と @startuml (${startumlCount}) の数が一致しません`
      )
    })

    it('should use entity keyword in ER diagrams', () => {
      // Given: データモデル設計書の内容
      const content = readDataModel()

      // When: entity キーワードの使用を確認する
      // Then: PlantUML の entity が使われている
      assert.match(
        content,
        /entity\s+/,
        'PlantUML ER 図で entity キーワードが使用されていません'
      )
    })
  })
})

// ============================================================
// ドメインモデル設計
// ============================================================

describe('ドメインモデル設計', () => {
  describe('タイトルと概要', () => {
    it('should have a title indicating domain model design', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: タイトル行を確認する
      // Then: ドメインモデル設計であることが示されている
      assert.match(
        content,
        /^# .*ドメインモデル/m,
        'タイトルに「ドメインモデル」が含まれていません'
      )
    })

    it('should not contain template placeholders', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: テンプレートのプレースホルダを検索する
      // Then: プレースホルダが残っていない
      const placeholderPattern = /\[(?:集約名\d*|エンティティ名\d*|値オブジェクト名\d*)\]/g
      const matches = content.match(placeholderPattern)
      assert.equal(
        matches,
        null,
        `テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
      )
    })
  })

  describe('集約の定義', () => {
    it('should define Order aggregate', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 受注集約の定義を確認する
      // Then: 受注集約が定義されている
      assert.match(
        content,
        /受注.*集約|Order.*Aggregate/i,
        '受注集約の定義がありません'
      )
    })

    it('should define Customer aggregate', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 得意先集約の定義を確認する
      // Then: 得意先集約が定義されている
      assert.match(
        content,
        /得意先.*集約|Customer.*Aggregate/i,
        '得意先集約の定義がありません'
      )
    })

    it('should define Product aggregate', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 商品集約の定義を確認する
      // Then: 商品集約が定義されている
      assert.match(
        content,
        /商品.*集約|Product.*Aggregate/i,
        '商品集約の定義がありません'
      )
    })

    it('should define Stock aggregate', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 在庫集約の定義を確認する
      // Then: 在庫集約が定義されている
      assert.match(
        content,
        /在庫.*集約|Stock.*Aggregate|Inventory.*Aggregate/i,
        '在庫集約の定義がありません'
      )
    })

    it('should define PurchaseOrder aggregate', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 発注集約の定義を確認する
      // Then: 発注集約が定義されている
      assert.match(
        content,
        /発注.*集約|PurchaseOrder.*Aggregate/i,
        '発注集約の定義がありません'
      )
    })

    it('should define Supplier aggregate', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 仕入先集約の定義を確認する
      // Then: 仕入先集約が定義されている
      assert.match(
        content,
        /仕入先.*集約|Supplier.*Aggregate/i,
        '仕入先集約の定義がありません'
      )
    })
  })

  describe('値オブジェクトの定義', () => {
    it('should define OrderStatus value object', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 受注ステータス値オブジェクトの定義を確認する
      // Then: 定義がある
      assert.match(
        content,
        /受注ステータス|OrderStatus/,
        '受注ステータス値オブジェクトの定義がありません'
      )
    })

    it('should define DeliveryDate value object', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 届け日値オブジェクトの定義を確認する
      // Then: 定義がある
      assert.match(
        content,
        /届け日|DeliveryDate/,
        '届け日値オブジェクトの定義がありません'
      )
    })

    it('should define QualityRetentionDays or similar value object', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 品質維持日数値オブジェクトの定義を確認する
      // Then: 定義がある
      assert.match(
        content,
        /品質維持日数|QualityRetentionDays/,
        '品質維持日数値オブジェクトの定義がありません'
      )
    })
  })

  describe('ドメインサービスの定義', () => {
    it('should define inventory transition calculation service (BR06)', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 在庫推移計算サービスの定義を確認する
      // Then: 定義がある
      assert.match(
        content,
        /在庫推移.*計算|在庫推移.*サービス|InventoryTransition/i,
        '在庫推移計算ドメインサービスの定義がありません'
      )
    })

    it('should define delivery date validation service (BR07)', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 届け日検証サービスの定義を確認する
      // Then: 定義がある
      assert.match(
        content,
        /届け日.*検証|届け日.*バリデーション|DeliveryDate.*Validat/i,
        '届け日検証ドメインサービスの定義がありません'
      )
    })

    it('should define shipping date determination service (BR02)', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 出荷日判定サービスの定義を確認する
      // Then: 定義がある
      assert.match(
        content,
        /出荷日.*判定|出荷日.*計算|ShippingDate/i,
        '出荷日判定ドメインサービスの定義がありません'
      )
    })
  })

  describe('ユビキタス言語', () => {
    it('should contain a ubiquitous language section or glossary', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: ユビキタス言語セクションの存在を確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /ユビキタス言語|用語集|Ubiquitous Language/i,
        'ユビキタス言語（用語集）セクションが存在しません'
      )
    })

    it('should include key domain terms in ubiquitous language', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: 主要なドメイン用語の存在を確認する
      const terms = ['得意先', '受注', '商品', '単品', '仕入先', '在庫', '発注']

      // Then: すべての主要用語が含まれる
      for (const term of terms) {
        assert.match(
          content,
          new RegExp(term),
          `ユビキタス言語にドメイン用語「${term}」が含まれていません`
        )
      }
    })
  })

  describe('PlantUML 図', () => {
    it('should contain at least one domain model diagram in PlantUML', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: PlantUML 図の数を確認する
      const diagramCount = countPatternMatches(content, /@startuml/g)

      // Then: 少なくとも1つの図がある
      assert.ok(
        diagramCount >= 1,
        `PlantUML ドメインモデル図が存在しません（${diagramCount}個）`
      )
    })

    it('should have matching @startuml and @enduml pairs', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: @startuml と @enduml の数を数える
      const startCount = countPatternMatches(content, /@startuml/g)
      const endCount = countPatternMatches(content, /@enduml/g)

      // Then: 対応が一致する
      assert.equal(
        startCount,
        endCount,
        `@startuml (${startCount}) と @enduml (${endCount}) の数が一致しません`
      )
    })

    it('should wrap all PlantUML in markdown code blocks', () => {
      // Given: ドメインモデル設計書の内容
      const content = readDomainModel()

      // When: plantuml ブロックと @startuml の数を比較する
      const plantumlBlocks = countPatternMatches(content, /```plantuml/g)
      const startumlCount = countPatternMatches(content, /@startuml/g)

      // Then: すべての @startuml が ```plantuml ブロック内にある
      assert.equal(
        plantumlBlocks,
        startumlCount,
        `\`\`\`plantuml ブロック (${plantumlBlocks}) と @startuml (${startumlCount}) の数が一致しません`
      )
    })
  })
})

// ============================================================
// UI 設計
// ============================================================

describe('UI 設計', () => {
  describe('タイトルと概要', () => {
    it('should have a title indicating UI design', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: タイトル行を確認する
      // Then: UI 設計であることが示されている
      assert.match(
        content,
        /^# .*UI 設計|^# .*UI設計|^# .*画面設計/m,
        'タイトルに「UI 設計」が含まれていません'
      )
    })

    it('should not contain template placeholders', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: テンプレートのプレースホルダを検索する
      // Then: プレースホルダが残っていない
      const placeholderPattern = /\[(?:画面名\d*|コンポーネント名\d*|URL\d*)\]/g
      const matches = content.match(placeholderPattern)
      assert.equal(
        matches,
        null,
        `テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
      )
    })
  })

  describe('画面一覧', () => {
    it('should contain a screen list section', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 画面一覧のセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /画面一覧/,
        '画面一覧セクションが存在しません'
      )
    })

    it('should include customer-facing screens', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 顧客向け画面の存在を確認する
      // Then: 主要な顧客向け画面が含まれる
      assert.match(content, /商品一覧/, '顧客向け画面「商品一覧」が含まれていません')
      assert.match(content, /注文/, '顧客向け画面「注文」関連が含まれていません')
      assert.match(content, /ログイン/, '顧客向け画面「ログイン」が含まれていません')
    })

    it('should include management screens', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 管理画面の存在を確認する
      // Then: 主要な管理画面が含まれる
      assert.match(content, /受注一覧|受注管理/, '管理画面「受注一覧」が含まれていません')
      assert.match(content, /在庫推移/, '管理画面「在庫推移」が含まれていません')
      assert.match(content, /発注/, '管理画面「発注」関連が含まれていません')
    })

    it('should have at least 14 screens total', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 画面一覧テーブルの行数を確認する
      // 画面一覧セクション内のテーブル行をカウント
      const screenListSection = content.split(/画面一覧/)[1]?.split(/##\s/)[0]
      if (screenListSection) {
        const tableRows = countPatternMatches(
          screenListSection,
          /\|.*\|.*\|/g
        )
        // ヘッダー行と区切り行を除外（最低2行）
        const dataRows = tableRows - 2

        // Then: 少なくとも14画面が定義されている
        assert.ok(
          dataRows >= 14,
          `画面一覧のデータ行が14行未満です（${dataRows}行）。顧客向け7画面+管理7画面=14画面が必要`
        )
      }
    })
  })

  describe('画面遷移図', () => {
    it('should contain screen transition diagrams in PlantUML', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 画面遷移図の存在を確認する
      // Then: 画面遷移図が含まれている
      assert.match(
        content,
        /画面遷移/,
        '画面遷移図セクションが存在しません'
      )
    })

    it('should have customer-facing transition diagram', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 顧客向け画面遷移図の存在を確認する
      // Then: 顧客向けの遷移が含まれている
      assert.match(
        content,
        /顧客.*遷移|得意先.*遷移|顧客向け/,
        '顧客向け画面遷移図が含まれていません'
      )
    })

    it('should have management transition diagram', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 管理画面遷移図の存在を確認する
      // Then: 管理向けの遷移が含まれている
      assert.match(
        content,
        /管理.*遷移|管理向け/,
        '管理向け画面遷移図が含まれていません'
      )
    })
  })

  describe('画面イメージ (salt 図)', () => {
    it('should contain at least one salt diagram', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: salt 図の数を確認する
      const saltCount = countPatternMatches(content, /@startsalt|salt/g)

      // Then: 少なくとも1つの salt 図がある
      assert.ok(
        saltCount >= 1,
        `salt 図（ワイヤーフレーム）が存在しません（${saltCount}個）`
      )
    })
  })

  describe('URL パス設計', () => {
    it('should define customer-facing URL paths', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 顧客向け URL パスの定義を確認する
      // Then: 主要な顧客向け URL パスが定義されている
      assert.match(
        content,
        /\/login|\/products|\/orders/,
        '顧客向け URL パス（/login, /products, /orders）の定義がありません'
      )
    })

    it('should define admin URL paths', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 管理 URL パスの定義を確認する
      // Then: /admin/ パスが定義されている
      assert.match(
        content,
        /\/admin/,
        '管理 URL パス（/admin/）の定義がありません'
      )
    })
  })

  describe('Thymeleaf テンプレート構成', () => {
    it('should describe Thymeleaf template structure', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: Thymeleaf テンプレート構成の記述を確認する
      // Then: テンプレート構成が記述されている
      assert.match(
        content,
        /Thymeleaf|テンプレート/,
        'Thymeleaf テンプレート構成の記述がありません'
      )
    })

    it('should mention layout template for shared header/footer', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: レイアウトテンプレートの言及を確認する
      // Then: レイアウトテンプレートが記述されている
      assert.match(
        content,
        /レイアウト|layout|ヘッダー|フッター|header|footer/i,
        'レイアウトテンプレート（共通ヘッダー・フッター）の記述がありません'
      )
    })
  })

  describe('PlantUML 図', () => {
    it('should contain PlantUML diagrams', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: PlantUML 図の数を確認する
      const diagramCount = countPatternMatches(content, /@startuml|@startsalt/g)

      // Then: 少なくとも2つの図がある（画面遷移図 2 系統）
      assert.ok(
        diagramCount >= 2,
        `PlantUML 図が2つ未満です（${diagramCount}個）。画面遷移図が必要`
      )
    })

    it('should have matching start and end pairs', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: @startuml/@startsalt と @enduml/@endsalt の数を数える
      const startCount = countPatternMatches(content, /@startuml|@startsalt/g)
      const endCount = countPatternMatches(content, /@enduml|@endsalt/g)

      // Then: 対応が一致する
      assert.equal(
        startCount,
        endCount,
        `開始タグ (${startCount}) と終了タグ (${endCount}) の数が一致しません`
      )
    })

    it('should wrap all PlantUML in markdown code blocks', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: plantuml ブロックと start タグの数を比較する
      const plantumlBlocks = countPatternMatches(content, /```plantuml/g)
      const startCount = countPatternMatches(content, /@startuml|@startsalt/g)

      // Then: すべての start タグが ```plantuml ブロック内にある
      assert.equal(
        plantumlBlocks,
        startCount,
        `\`\`\`plantuml ブロック (${plantumlBlocks}) と start タグ (${startCount}) の数が一致しません`
      )
    })
  })
})

// ============================================================
// 4 文書間の整合性
// ============================================================

describe('4 文書間の整合性', () => {
  describe('ドメインモデルとデータモデルの対応', () => {
    it('should have matching entities between domain model and data model', () => {
      // Given: ドメインモデルとデータモデルの内容
      const domainContent = readDomainModel()
      const dataContent = readDataModel()

      // When: 主要エンティティの対応を確認する
      const entities = ['得意先', '受注', '商品', '単品', '仕入先', '在庫', '発注', '入荷', '届け先']

      // Then: 両方のドキュメントに同じエンティティが含まれる
      for (const entity of entities) {
        const inDomain = new RegExp(entity).test(domainContent)
        const inData = new RegExp(entity).test(dataContent)
        assert.ok(
          inDomain && inData,
          `エンティティ「${entity}」がドメインモデル(${inDomain})とデータモデル(${inData})の両方に存在しません`
        )
      }
    })
  })

  describe('アーキテクチャとドメインモデルの整合', () => {
    it('should reference domain layer in both architecture and domain model', () => {
      // Given: アーキテクチャとドメインモデルの内容
      const archContent = readArchitecture()
      const domainContent = readDomainModel()

      // When: ドメイン層への参照を確認する
      // Then: 両方のドキュメントでドメイン層が参照されている
      assert.match(
        archContent,
        /ドメイン層|domain/i,
        'アーキテクチャ設計にドメイン層への参照がありません'
      )
      assert.match(
        domainContent,
        /ドメイン|domain/i,
        'ドメインモデル設計にドメインへの参照がありません'
      )
    })
  })

  describe('UI 設計と要件定義の画面対応', () => {
    it('should include screens matching requirements definition screen model', () => {
      // Given: UI 設計書の内容
      const content = readUiDesign()

      // When: 要件定義の画面・帳票モデルで定義された主要画面の存在を確認する
      const screens = ['商品一覧', '注文', '受注', '在庫推移']

      // Then: 主要画面が UI 設計に含まれる
      for (const screen of screens) {
        assert.match(
          content,
          new RegExp(screen),
          `要件定義で定義された画面「${screen}」が UI 設計に含まれていません`
        )
      }
    })
  })
})

// ============================================================
// トレーサビリティ
// ============================================================

describe('トレーサビリティ', () => {
  it('should reference UC numbers in architecture design', () => {
    // Given: アーキテクチャ設計書の内容
    const content = readArchitecture()

    // When: UC 番号またはユーザーストーリー番号への参照を確認する
    // Then: トレーサビリティの参照がある
    const hasUcRef = /UC\d{3}/.test(content)
    const hasUsRef = /US\d{3}/.test(content)
    const hasTraceability = /トレーサビリティ|ユースケース|ユーザーストーリー/.test(content)
    assert.ok(
      hasUcRef || hasUsRef || hasTraceability,
      'アーキテクチャ設計に UC/US 番号またはトレーサビリティへの参照がありません'
    )
  })

  it('should reference UC numbers in domain model', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: UC 番号への参照を確認する
    // Then: UC 番号への参照がある
    const hasUcRef = /UC\d{3}/.test(content)
    const hasUsRef = /US\d{3}/.test(content)
    const hasBrRef = /BR\d{2}/.test(content)
    assert.ok(
      hasUcRef || hasUsRef || hasBrRef,
      'ドメインモデル設計に UC/US/BR 番号への参照がありません'
    )
  })

  it('should reference UC numbers in UI design', () => {
    // Given: UI 設計書の内容
    const content = readUiDesign()

    // When: UC 番号への参照を確認する
    // Then: UC 番号への参照がある
    const hasUcRef = /UC\d{3}/.test(content)
    const hasUsRef = /US\d{3}/.test(content)
    assert.ok(
      hasUcRef || hasUsRef,
      'UI 設計に UC/US 番号への参照がありません'
    )
  })
})

// ============================================================
// index.md の更新
// ============================================================

describe('index.md の更新', () => {
  it('should update architecture design status to 作成済み', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: アーキテクチャ設計の状況を確認する
    // Then: 「作成済み」に更新されている
    assert.match(
      content,
      /アーキテクチャ.*作成済み/,
      'index.md のアーキテクチャ設計の状況が「作成済み」に更新されていません'
    )
  })

  it('should update data model design status to 作成済み', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: データモデル設計の状況を確認する
    // Then: 「作成済み」に更新されている
    assert.match(
      content,
      /データモデル.*作成済み/,
      'index.md のデータモデル設計の状況が「作成済み」に更新されていません'
    )
  })

  it('should update domain model design status to 作成済み', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: ドメインモデル設計の状況を確認する
    // Then: 「作成済み」に更新されている
    assert.match(
      content,
      /ドメインモデル.*作成済み/,
      'index.md のドメインモデル設計の状況が「作成済み」に更新されていません'
    )
  })

  it('should update UI design status to 作成済み', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: UI 設計の状況を確認する
    // Then: 「作成済み」に更新されている
    assert.match(
      content,
      /UI 設計.*作成済み|UI設計.*作成済み/,
      'index.md の UI 設計の状況が「作成済み」に更新されていません'
    )
  })
})

// --- scope-shrink 再発防止テスト ---
describe('scope-shrink 再発防止: ドメインモデルのパッケージ構成', () => {
  it('should have a package structure section in domain model', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: パッケージ構成セクションの存在を確認する
    // Then: パッケージ構成セクションが存在する
    assert.match(
      content,
      /パッケージ構成/,
      'domain_model.md にパッケージ構成セクションが欠落しています（SCOPE-SHRINK-001）'
    )
  })

  it('should define aggregate-based sub-packages under domain/model/', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: 集約ごとのサブパッケージの定義を確認する
    const packages = ['order', 'customer', 'product', 'item', 'supplier', 'stock']

    // Then: すべての集約パッケージが定義されている
    for (const pkg of packages) {
      assert.match(
        content,
        new RegExp(pkg, 'i'),
        `domain/model/${pkg} パッケージの定義がありません`
      )
    }
  })

  it('should define domain/service/ package', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: domain/service パッケージの定義を確認する
    // Then: サービスパッケージが定義されている
    assert.match(
      content,
      /domain.*service|"service"/i,
      'domain/service パッケージの定義がありません'
    )
  })

  it('should define domain/repository/ package', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: domain/repository パッケージの定義を確認する
    // Then: リポジトリパッケージが定義されている
    assert.match(
      content,
      /domain.*repository|"repository"/i,
      'domain/repository パッケージの定義がありません'
    )
  })

  it('should include a PlantUML diagram for package structure', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: パッケージ構成の PlantUML 図を確認する
    // Then: パッケージ構成セクション内に PlantUML 図がある
    const pkgSectionMatch = content.match(/## ドメイン層のパッケージ構成[\s\S]*?(?=\n## [^#])/)?.[0]
    assert.ok(pkgSectionMatch, 'パッケージ構成セクションが見つかりません')
    assert.match(
      pkgSectionMatch,
      /@startuml/,
      'パッケージ構成セクションに PlantUML 図がありません'
    )
  })
})

describe('scope-shrink 再発防止: UI 設計の salt 図網羅性', () => {
  it('should have at least 14 salt diagrams for all screens', () => {
    // Given: UI 設計書の内容
    const content = readUiDesign()

    // When: salt 図の数を数える
    const saltCount = countPatternMatches(content, /@startsalt/g)

    // Then: 14 画面分の salt 図がある
    assert.ok(
      saltCount >= 14,
      `salt 図が 14 個未満です（${saltCount}個）。全 14 画面分の salt 図が必要です（SCOPE-SHRINK-002）`
    )
  })

  it('should have salt diagrams for all customer-facing screens', () => {
    // Given: UI 設計書の内容
    const content = readUiDesign()

    // When: 顧客向け 7 画面の salt 図の存在を確認する
    const screens = ['ログイン画面', '会員登録画面', '商品一覧画面', '注文画面', '注文確認画面', '注文履歴画面', '届け先選択画面']

    // Then: すべての顧客向け画面の salt 図がある
    for (const screen of screens) {
      assert.match(
        content,
        new RegExp(`### ${screen}[\\s\\S]*?@startsalt`),
        `顧客向け画面「${screen}」の salt 図がありません`
      )
    }
  })

  it('should have salt diagrams for all management screens', () => {
    // Given: UI 設計書の内容
    const content = readUiDesign()

    // When: 管理向け 7 画面の salt 図の存在を確認する
    const screens = ['受注一覧画面', '在庫推移画面', '発注管理画面', '入荷管理画面', '出荷管理画面', '商品管理画面', '得意先管理画面']

    // Then: すべての管理向け画面の salt 図がある
    for (const screen of screens) {
      assert.match(
        content,
        new RegExp(`### ${screen}[\\s\\S]*?@startsalt`),
        `管理向け画面「${screen}」の salt 図がありません`
      )
    }
  })
})

// --- design-consistency 再発防止テスト ---
describe('design-consistency 再発防止: 3NF 宣言と実設計の整合性', () => {
  it('should document intentional denormalization when 3NF exceptions exist', () => {
    // Given: データモデル設計書の内容
    const content = readDataModel()

    // When: 非正規化に関する説明を確認する
    // Then: 意図的な非正規化が文書化されている
    assert.match(
      content,
      /意図的.*非正規化|非正規化.*理由/,
      'data_model.md に 3NF 例外の非正規化理由が文書化されていません（ARCH-3NF-001）'
    )
  })

  it('should explain denormalization for purchase_orders.supplier_id', () => {
    // Given: データモデル設計書の内容
    const content = readDataModel()

    // When: purchase_orders.supplier_id の非正規化理由を確認する
    // Then: 理由が説明されている
    assert.match(
      content,
      /purchase_orders.*supplier_id.*非正規化|supplier_id.*導出可能/,
      'purchase_orders.supplier_id の非正規化理由が説明されていません'
    )
  })

  it('should explain denormalization for arrivals.item_id', () => {
    // Given: データモデル設計書の内容
    const content = readDataModel()

    // When: arrivals.item_id の非正規化理由を確認する
    // Then: 理由が説明されている
    assert.match(
      content,
      /arrivals.*item_id.*非正規化|arrivals.*item_id.*導出可能/,
      'arrivals.item_id の非正規化理由が説明されていません'
    )
  })
})

// --- domain-model 再発防止テスト ---
describe('domain-model 再発防止: 集約ルートの外部参照 ID', () => {
  it('should include foreign reference IDs in Order aggregate root', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: 受注集約ルートのフィールドを確認する
    const orderSection = content.match(/class 受注 <<集約ルート>>[\s\S]*?\}/)?.[0]
    assert.ok(orderSection, '受注集約ルートクラスが見つかりません')

    // Then: 外部参照 ID が含まれている
    assert.match(orderSection, /得意先ID/, '受注クラスに得意先ID が欠落しています（ARCH-REF-001）')
    assert.match(orderSection, /商品ID/, '受注クラスに商品ID が欠落しています（ARCH-REF-001）')
    assert.match(orderSection, /届け先ID/, '受注クラスに届け先ID が欠落しています（ARCH-REF-001）')
  })

  it('should include foreign reference IDs in PurchaseOrder aggregate root', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: 発注集約ルートのフィールドを確認する
    const poSection = content.match(/class 発注 <<集約ルート>>[\s\S]*?\}/)?.[0]
    assert.ok(poSection, '発注集約ルートクラスが見つかりません')

    // Then: 外部参照 ID が含まれている
    assert.match(poSection, /単品ID/, '発注クラスに単品ID が欠落しています（ARCH-REF-001）')
    assert.match(poSection, /仕入先ID/, '発注クラスに仕入先ID が欠落しています（ARCH-REF-001）')
  })

  it('should include foreign reference IDs in Arrival aggregate root', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: 入荷集約ルートのフィールドを確認する
    const arrSection = content.match(/class 入荷 <<集約ルート>>[\s\S]*?\}/)?.[0]
    assert.ok(arrSection, '入荷集約ルートクラスが見つかりません')

    // Then: 外部参照 ID が含まれている
    assert.match(arrSection, /発注ID/, '入荷クラスに発注ID が欠落しています（ARCH-REF-001）')
    assert.match(arrSection, /単品ID/, '入荷クラスに単品ID が欠落しています（ARCH-REF-001）')
  })

  it('should include foreign reference ID in ProductComposition entity', () => {
    // Given: ドメインモデル設計書の内容
    const content = readDomainModel()

    // When: 商品構成エンティティのフィールドを確認する
    const compSection = content.match(/class 商品構成 <<エンティティ>>[\s\S]*?\}/)?.[0]
    assert.ok(compSection, '商品構成エンティティクラスが見つかりません')

    // Then: 外部参照 ID が含まれている
    assert.match(compSection, /単品ID/, '商品構成クラスに単品ID が欠落しています（ARCH-REF-001）')
  })
})

// --- doc-inconsistency 再発防止テスト ---
describe('docs/index.md と docs/design/index.md のステータス整合性', () => {
  const ROOT_INDEX_PATH = resolve(__dirname, '..', '..', 'index.md')

  function readRootIndex() {
    if (!existsSync(ROOT_INDEX_PATH)) {
      throw new Error(`docs/index.md が存在しません: ${ROOT_INDEX_PATH}`)
    }
    return readFileSync(ROOT_INDEX_PATH, 'utf-8')
  }

  it('should not show 設計 as 未着手 when design documents exist', () => {
    // Given: docs/index.md の内容
    const rootContent = readRootIndex()

    // When: 設計カテゴリのステータスを確認する
    // Then: 「未着手」ではない（設計文書が存在するため）
    const designRow = rootContent.match(/\[設計\].*\|.*\|.*\|/)
    assert.ok(designRow, 'docs/index.md に設計カテゴリの行が見つかりません')
    assert.ok(
      !designRow[0].includes('未着手'),
      'docs/index.md の設計ステータスが「未着手」のまま。docs/design/index.md のステータスと整合させてください'
    )
  })

  it('should reflect 作成済み count consistently with design index', () => {
    // Given: 両方の index.md
    const rootContent = readRootIndex()
    const designContent = readIndex()

    // When: design/index.md の作成済み件数を数える
    const createdCount = (designContent.match(/作成済み/g) || []).length

    // Then: docs/index.md の設計ステータスに件数が反映されている
    assert.ok(
      createdCount > 0,
      'design/index.md に「作成済み」のドキュメントがありません'
    )
    assert.match(
      rootContent,
      /\[設計\].*作成済み/,
      'docs/index.md の設計ステータスに「作成済み」が反映されていません'
    )
  })
})
