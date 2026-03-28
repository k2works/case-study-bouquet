import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REQUIREMENTS_PATH = resolve(__dirname, '..', 'requirements_definition.md')
const INDEX_PATH = resolve(__dirname, '..', 'index.md')

// --- Helper functions ---

function readRequirements() {
  if (!existsSync(REQUIREMENTS_PATH)) {
    throw new Error(
      `要件定義書が存在しません: ${REQUIREMENTS_PATH}`
    )
  }
  return readFileSync(REQUIREMENTS_PATH, 'utf-8')
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

// --- Tests ---

describe('要件定義書の存在確認', () => {
  it('should exist at docs/requirements/requirements_definition.md', () => {
    // Given: 要件定義書のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(REQUIREMENTS_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `要件定義書が存在しません: ${REQUIREMENTS_PATH}`)
  })
})

describe('要件定義書のタイトル', () => {
  it('should have system name in the title', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: タイトル行を確認する
    // Then: システム名「フレール・メモワール」と「WEB ショップシステム」が含まれる
    assert.match(
      content,
      /^# .*(フレール・メモワール|WEB ショップシステム)/m,
      'タイトルにシステム名が含まれていません'
    )
  })

  it('should not contain template placeholders', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: テンプレートのプレースホルダ [システム名] 等を検索する
    // Then: プレースホルダが残っていない
    const placeholderPattern = /\[(?:システム名|アクター\d*名|外部システム\d*名|組織名|部門\d*名|業務\d*名|BUC\d*名|UC名\d*|画面名\d*|情報名\d*|条件名\d*|分類[名値軸]\d*|利用シーン\d*名|イベント名\d*|アクティビティ\d*|フェーズ\d*名|判定条件|内部アクター\d*|外部アクター\d*|業務資産\d*|外部組織)\]/g
    const matches = content.match(placeholderPattern)
    assert.equal(
      matches,
      null,
      `テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
    )
  })
})

describe('層1: システム価値', () => {
  describe('システムコンテキスト', () => {
    it('should contain a system context diagram in PlantUML', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: システムコンテキスト図のセクションを確認する
      // Then: PlantUML でシステムコンテキスト図が含まれる
      assert.match(
        content,
        /### システムコンテキスト/,
        'システムコンテキストセクションが存在しません'
      )
      assert.match(
        content,
        /システムコンテキスト図/,
        'システムコンテキスト図のタイトルが含まれていません'
      )
    })

    it('should include all three actors', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 3 アクターの存在を確認する
      // Then: 得意先、フレール・メモワール（スタッフ）、仕入先が含まれる
      assert.match(content, /得意先/, 'アクター「得意先」が含まれていません')
      assert.match(
        content,
        /フレール・メモワール/,
        'アクター「フレール・メモワール」が含まれていません'
      )
      assert.match(content, /仕入先/, 'アクター「仕入先」が含まれていません')
    })

    it('should include WEB shop system as the central system', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: WEB ショップシステムの存在を確認する
      // Then: WEB ショップシステムが中心に配置されている
      assert.match(
        content,
        /WEB ショップシステム/,
        '「WEB ショップシステム」が含まれていません'
      )
    })
  })

  describe('要求モデル', () => {
    it('should contain a requirements model section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 要求モデルセクションを確認する
      // Then: 要求モデルセクションが存在する
      assert.match(
        content,
        /### 要求モデル/,
        '要求モデルセクションが存在しません'
      )
    })

    it('should contain requirements from all actors in PlantUML', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 要求モデル図に @startuml/@enduml が含まれるか確認する
      // Then: PlantUML 図が存在する
      assert.match(
        content,
        /```plantuml[\s\S]*?要求モデル[\s\S]*?```/,
        '要求モデルの PlantUML 図が含まれていません'
      )
    })
  })
})

describe('層2: システム外部環境', () => {
  describe('ビジネスコンテキスト', () => {
    it('should contain business context section with organization map', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: ビジネスコンテキストセクションを確認する
      // Then: ビジネスコンテキストセクションが存在する
      assert.match(
        content,
        /### ビジネスコンテキスト/,
        'ビジネスコンテキストセクションが存在しません'
      )
    })

    it('should include all five departments from organization map', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 5 部門の存在を確認する
      // Then: 店舗運営、営業・受注、仕入・在庫、配送、IT が含まれる
      assert.match(content, /店舗運営/, '部門「店舗運営」が含まれていません')
      assert.match(content, /営業/, '部門「営業」が含まれていません')
      assert.match(content, /受注/, '「受注」が含まれていません')
      assert.match(content, /仕入/, '「仕入」が含まれていません')
      assert.match(content, /在庫/, '「在庫」が含まれていません')
      assert.match(content, /配送/, '「配送」が含まれていません')
    })
  })

  describe('ビジネスユースケース', () => {
    it('should contain business use case section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: ビジネスユースケースセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### ビジネスユースケース/,
        'ビジネスユースケースセクションが存在しません'
      )
    })

    it('should include all five value stream stages as BUCs', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: バリューストリーム 5 ステージの存在を確認する
      // Then: 商品企画、WEB 受注、仕入れ・入荷、結束、出荷・配送 が含まれる
      assert.match(content, /商品企画/, 'BUC「商品企画」が含まれていません')
      assert.match(content, /WEB 受注|WEB受注/, 'BUC「WEB 受注」が含まれていません')
      assert.match(content, /仕入/, 'BUC「仕入れ」が含まれていません')
      assert.match(content, /結束/, 'BUC「結束」が含まれていません')
      assert.match(content, /出荷/, 'BUC「出荷」が含まれていません')
      assert.match(content, /配送/, 'BUC「配送」が含まれていません')
    })
  })

  describe('業務フロー', () => {
    it('should contain business flow section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 業務フローセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### 業務フロー/,
        '業務フローセクションが存在しません'
      )
    })

    it('should include at least three activity diagrams in PlantUML', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 業務フロー内のアクティビティ図の数を数える
      const flowSection = content.split('### 業務フロー')[1]?.split('### ')[0]
      const diagramCount = countPatternMatches(
        flowSection || '',
        /@startuml/g
      )

      // Then: 少なくとも 3 つのアクティビティ図がある
      assert.ok(
        diagramCount >= 3,
        `業務フローのアクティビティ図が3つ未満です（${diagramCount}つ）。WEB 受注、仕入れ・入荷、出荷・配送の3つが必要`
      )
    })
  })

  describe('利用シーン', () => {
    it('should contain usage scene section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 利用シーンセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### 利用シーン/,
        '利用シーンセクションが存在しません'
      )
    })

    it('should include customer order scene and staff scenes', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 利用シーンの内容を確認する
      // Then: 得意先の注文シーンとスタッフのシーンが含まれる
      const sceneSection = content.split('### 利用シーン')[1]?.split('## ')[0]
      assert.ok(sceneSection, '利用シーンセクションの内容が空です')
      assert.match(
        sceneSection,
        /得意先|注文|顧客/,
        '得意先（顧客）の利用シーンが含まれていません'
      )
      assert.match(
        sceneSection,
        /スタッフ|フレール・メモワール|在庫|発注/,
        'スタッフの利用シーンが含まれていません'
      )
    })
  })

  describe('バリエーション・条件', () => {
    it('should contain variation and condition section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: バリエーション・条件セクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### バリエーション・条件/,
        'バリエーション・条件セクションが存在しません'
      )
    })

    it('should define key business variations', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 主要なバリエーション（商品種別、受注ステータス、在庫ステータス）を確認する
      const variationSection = content.split('### バリエーション・条件')[1]?.split('## ')[0]
      assert.ok(variationSection, 'バリエーション・条件セクションの内容が空です')

      // Then: テーブル形式のバリエーション定義が含まれる
      assert.match(
        variationSection,
        /\|.*\|.*\|/,
        'テーブル形式のバリエーション定義が含まれていません'
      )
    })
  })
})

describe('層3: システム境界', () => {
  describe('ユースケース複合図', () => {
    it('should contain use case composite diagram section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: ユースケース複合図セクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### ユースケース複合図/,
        'ユースケース複合図セクションが存在しません'
      )
    })

    it('should include all nine scope features as use cases', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 9 フィーチャの存在を確認する
      const features = [
        '商品マスタ管理',
        'WEB 受注',
        '在庫推移',
        '発注管理',
        '入荷管理',
        '出荷管理',
        '届け日変更',
        '届け先コピー',
        '得意先管理',
      ]

      // Then: すべてのフィーチャがユースケースとして含まれる
      for (const feature of features) {
        const pattern = new RegExp(feature.replace(/\s+/g, '\\s*'))
        assert.match(
          content,
          pattern,
          `フィーチャ「${feature}」がユースケースとして含まれていません`
        )
      }
    })

    it('should include boundary (screen), entity (information), and control (condition) elements', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: ユースケース複合図内の要素を確認する
      const ucSection = content.split('### ユースケース複合図')[1]?.split('### ')[0]
      assert.ok(ucSection, 'ユースケース複合図セクションの内容が空です')

      // Then: boundary、entity、control が含まれる
      assert.match(
        ucSection,
        /boundary/,
        'ユースケース複合図に boundary（画面）要素が含まれていません'
      )
      assert.match(
        ucSection,
        /entity/,
        'ユースケース複合図に entity（情報）要素が含まれていません'
      )
      assert.match(
        ucSection,
        /control/,
        'ユースケース複合図に control（条件）要素が含まれていません'
      )
    })
  })

  describe('画面・帳票モデル', () => {
    it('should contain screen and report model section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 画面・帳票モデルセクションを確認する
      // Then: セクションが存在する（表記揺れに対応）
      assert.match(
        content,
        /### 画面/,
        '画面モデルセクションが存在しません'
      )
    })

    it('should include both customer-facing and management screens', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 顧客向け画面と管理画面の存在を確認する
      // Then: 主要な画面が含まれる
      assert.match(content, /商品一覧/, '画面「商品一覧」が含まれていません')
      assert.match(content, /注文/, '注文関連の画面が含まれていません')
      assert.match(content, /受注一覧|受注管理/, '管理画面「受注一覧」が含まれていません')
      assert.match(content, /在庫推移/, '管理画面「在庫推移」が含まれていません')
    })
  })

  describe('イベントモデル', () => {
    it('should address event model section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: イベントモデルセクションを確認する
      // Then: イベントモデルのセクションまたは「該当なし」の記述がある
      const hasEventSection = /### イベント/.test(content)
      const hasNoEventNote = /該当なし|外部システム連携.*スコープ外/.test(content)
      assert.ok(
        hasEventSection || hasNoEventNote,
        'イベントモデルセクションまたは「該当なし」の記述がありません'
      )
    })
  })
})

describe('層4: システム内部構造', () => {
  describe('情報モデル', () => {
    it('should contain information model section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 情報モデルセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### 情報モデル/,
        '情報モデルセクションが存在しません'
      )
    })

    it('should include all nine information entities', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 9 エンティティの存在を確認する
      const entities = [
        '得意先',
        '受注',
        '商品',
        '商品構成',
        '単品',
        '仕入先',
        '入荷',
        '在庫',
        '届け先',
      ]

      // Then: すべてのエンティティが含まれる
      for (const entity of entities) {
        assert.match(
          content,
          new RegExp(entity),
          `情報エンティティ「${entity}」が含まれていません`
        )
      }
    })

    it('should contain information model as PlantUML diagram', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 情報モデル図の PlantUML を確認する
      // Then: 情報モデルの PlantUML 図が含まれる
      assert.match(
        content,
        /```plantuml[\s\S]*?情報モデル[\s\S]*?```/,
        '情報モデルの PlantUML 図が含まれていません'
      )
    })
  })

  describe('状態モデル', () => {
    it('should contain state model section', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 状態モデルセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### 状態モデル/,
        '状態モデルセクションが存在しません'
      )
    })

    it('should include state transition diagrams for key entities', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 主要エンティティの状態遷移図を確認する
      const stateSection = content.split('### 状態モデル')[1]
      assert.ok(stateSection, '状態モデルセクションの内容が空です')

      // Then: 受注の状態遷移が含まれる
      assert.match(
        stateSection,
        /受注/,
        '受注の状態遷移図が含まれていません'
      )
    })

    it('should contain state diagrams in PlantUML', () => {
      // Given: 要件定義書の内容
      const content = readRequirements()

      // When: 状態モデルの PlantUML 図を確認する
      const stateSection = content.split('### 状態モデル')[1]
      const diagramCount = countPatternMatches(
        stateSection || '',
        /@startuml/g
      )

      // Then: 少なくとも 1 つの状態遷移図がある
      assert.ok(
        diagramCount >= 1,
        `状態モデルの PlantUML 図が不足しています（${diagramCount}つ）`
      )
    })
  })
})

describe('PlantUML 図の整合性', () => {
  it('should have matching @startuml and @enduml pairs', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

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

  it('should have at least 10 PlantUML diagrams total', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: PlantUML 図の総数を確認する
    const diagramCount = countPatternMatches(content, /@startuml/g)

    // Then: RDRA 4 層で少なくとも 10 個の図が必要
    // （コンテキスト1 + 要求モデル1 + ビジネスコンテキスト1 + BUC図1+ 業務フロー3 + 利用シーン1 + UC複合図1 + 情報モデル1 + 状態遷移1 = 12）
    assert.ok(
      diagramCount >= 10,
      `PlantUML 図が10個未満です（${diagramCount}個）。RDRA 4 層すべてに図が必要`
    )
  })

  it('should wrap all PlantUML in markdown code blocks', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: @startuml が ```plantuml ブロック内にあるか確認する
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

describe('RDRA 4 層の構造', () => {
  it('should contain all four RDRA layers in correct order', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 4 層のセクションの位置を確認する
    const layer1Pos = content.indexOf('## システム価値')
    const layer2Pos = content.indexOf('## システム外部環境')
    const layer3Pos = content.indexOf('## システム境界')
    // Why: \b は日本語文字間で機能しない（\w は ASCII のみ）ため除去。
    // \n で行頭に固定し ### 内の部分一致を防ぐ。
    const layer4Pos = content.search(/\n## システム(?!価値|外部|境界)/)

    // Then: すべての層が存在し、正しい順序で配置されている
    assert.ok(layer1Pos >= 0, '層1「システム価値」セクションが存在しません')
    assert.ok(layer2Pos >= 0, '層2「システム外部環境」セクションが存在しません')
    assert.ok(layer3Pos >= 0, '層3「システム境界」セクションが存在しません')
    assert.ok(layer4Pos >= 0, '層4「システム」セクションが存在しません')
    assert.ok(layer1Pos < layer2Pos, '層1 は層2 より前に配置される必要があります')
    assert.ok(layer2Pos < layer3Pos, '層2 は層3 より前に配置される必要があります')
    assert.ok(layer3Pos < layer4Pos, '層3 は層4 より前に配置される必要があります')
  })

  it('should not contain template guide section', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 記入ガイドセクションの存在を確認する
    // Then: テンプレートの記入ガイドが含まれていない
    assert.doesNotMatch(
      content,
      /## 記入ガイド/,
      'テンプレートの記入ガイドセクションが残っています。成果物には含めないでください'
    )
  })
})

describe('ビジネスルールの反映', () => {
  it('should reflect the rule: 1 order = 1 delivery destination = 1 product', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 1受注=1届け先=1商品のルールを確認する
    // Then: このビジネスルールへの言及がある
    const hasOrderRule =
      /1\s*受注.*1\s*届け先.*1\s*商品/.test(content) ||
      /受注.*届け先.*商品/.test(content)
    assert.ok(
      hasOrderRule,
      'ビジネスルール「1受注=1届け先=1商品」への言及がありません'
    )
  })

  it('should reflect the rule: shipping date = delivery date minus 1 day', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 出荷日=届け日の前日のルールを確認する
    // Then: このビジネスルールへの言及がある
    const hasShippingRule =
      /出荷日.*届け日.*前日/.test(content) ||
      /出荷.*=.*届け.*前日/.test(content) ||
      /届け日の前日.*出荷/.test(content)
    assert.ok(
      hasShippingRule,
      'ビジネスルール「出荷日=届け日の前日」への言及がありません'
    )
  })

  it('should reflect the rule: ordering decision is made by humans', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 発注判断は人間が行うルールを確認する
    // Then: 人間判断に関する記述がある
    const hasHumanDecision =
      /発注判断.*人間/.test(content) ||
      /人間.*判断.*発注/.test(content) ||
      /判断材料.*提供/.test(content) ||
      /人間判断の尊重/.test(content)
    assert.ok(
      hasHumanDecision,
      'ビジネスルール「発注判断は人間が行う」への言及がありません'
    )
  })

  it('should reflect the rule: each item has a specific supplier', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 単品ごとに仕入先が決まっているルールを確認する
    // Then: 単品と仕入先の関係への言及がある
    const hasSupplierRule =
      /単品.*仕入先/.test(content) || /仕入先.*単品/.test(content)
    assert.ok(
      hasSupplierRule,
      'ビジネスルール「単品ごとに特定の仕入先」への言及がありません'
    )
  })

  it('should reflect quality retention days in inventory management', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 品質維持日数を考慮した在庫管理を確認する
    // Then: 品質維持日数への言及がある
    assert.match(
      content,
      /品質維持日数|品質維持/,
      '「品質維持日数」を考慮した在庫管理への言及がありません'
    )
  })
})

describe('スコープ外フィーチャの排除', () => {
  it('should not include auto-ordering as a feature', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 自動発注がユースケースとして定義されていないか確認する
    // Then: 自動発注はスコープ外（存在してもスコープ外の説明として）
    const ucSection = content.split('### ユースケース複合図')[1]?.split('## ')[0]
    if (ucSection) {
      assert.doesNotMatch(
        ucSection,
        /usecase.*自動発注/,
        'スコープ外の「自動発注」がユースケースとして定義されています'
      )
    }
  })

  it('should not include corporate customer handling', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 法人顧客がアクターとして定義されていないか確認する
    // Then: 法人顧客はスコープ外
    assert.doesNotMatch(
      content,
      /actor.*法人/,
      'スコープ外の「法人顧客」がアクターとして定義されています'
    )
  })
})

describe('トレーサビリティ', () => {
  it('should have actors from layer 1 appearing in layer 2', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 層1のアクターが層2にも登場するか確認する
    const layer2Content = content.split('## システム外部環境')[1]?.split('## システム境界')[0]
    assert.ok(layer2Content, '層2の内容が取得できません')

    // Then: 主要アクターが層2にも登場する
    assert.match(layer2Content, /得意先/, '層2に「得意先」が登場していません')
  })

  it('should have information entities from layer 4 referenced in layer 3', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 層3のユースケース複合図に層4の情報エンティティが参照されているか確認する
    // Why: \b は日本語文字間で機能しない（\w は ASCII のみ）ため除去。
    // \n で行頭に固定し ### 内の部分一致を防ぐ。
    const layer3Content = content.split('## システム境界')[1]?.split(/\n## システム(?!境界)/)[0]
    assert.ok(layer3Content, '層3の内容が取得できません')

    // Then: 主要な情報エンティティが entity として参照されている
    assert.match(
      layer3Content,
      /受注|商品|在庫|得意先/,
      '層3に情報エンティティへの参照がありません'
    )
  })
})

describe('index.md の更新', () => {
  it('should update requirements definition status to 作成済み', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: 要件定義書の状況を確認する
    // Then: 「作成済み」に更新されている
    assert.match(
      content,
      /要件定義書.*作成済み/,
      'index.md の要件定義書の状況が「作成済み」に更新されていません'
    )
  })
})

describe('用語の一貫性', () => {
  it('should use consistent actor names matching business architecture', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: アクター名の表記揺れを確認する
    // Then: 「お客様」「顧客」ではなく「得意先」を使用している
    // 得意先がメインのアクター名であること
    const customerActorCount = countPatternMatches(content, /actor.*得意先/g)
    assert.ok(
      customerActorCount >= 1,
      'アクターとしての「得意先」の使用が確認できません（ビジネスアーキテクチャ分析書と一致させてください）'
    )
  })

  it('should use consistent entity names matching information map', () => {
    // Given: 要件定義書の内容
    const content = readRequirements()

    // When: 情報エンティティ名の表記を確認する
    // Then: 「商品（花束）」と「単品（花）」の表記が含まれる
    assert.match(
      content,
      /商品.*花束|花束.*商品/,
      '「商品（花束）」の表記が含まれていません'
    )
    assert.match(
      content,
      /単品.*花|花.*単品/,
      '「単品（花）」の表記が含まれていません'
    )
  })
})
