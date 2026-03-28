import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BUSINESS_UC_PATH = resolve(__dirname, '..', 'business_usecase.md')
const SYSTEM_UC_PATH = resolve(__dirname, '..', 'system_usecase.md')
const USER_STORY_PATH = resolve(__dirname, '..', 'user_story.md')
const INDEX_PATH = resolve(__dirname, '..', 'index.md')

// --- Helper functions ---

function readBusinessUsecase() {
  if (!existsSync(BUSINESS_UC_PATH)) {
    throw new Error(
      `ビジネスユースケースが存在しません: ${BUSINESS_UC_PATH}`
    )
  }
  return readFileSync(BUSINESS_UC_PATH, 'utf-8')
}

function readSystemUsecase() {
  if (!existsSync(SYSTEM_UC_PATH)) {
    throw new Error(
      `システムユースケースが存在しません: ${SYSTEM_UC_PATH}`
    )
  }
  return readFileSync(SYSTEM_UC_PATH, 'utf-8')
}

function readUserStory() {
  if (!existsSync(USER_STORY_PATH)) {
    throw new Error(
      `ユーザーストーリーが存在しません: ${USER_STORY_PATH}`
    )
  }
  return readFileSync(USER_STORY_PATH, 'utf-8')
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

describe('ファイルの存在確認', () => {
  it('should exist at docs/requirements/business_usecase.md', () => {
    // Given: ビジネスユースケースのパス
    // When: ファイルの存在を確認する
    const exists = existsSync(BUSINESS_UC_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `ビジネスユースケースが存在しません: ${BUSINESS_UC_PATH}`)
  })

  it('should exist at docs/requirements/system_usecase.md', () => {
    // Given: システムユースケースのパス
    // When: ファイルの存在を確認する
    const exists = existsSync(SYSTEM_UC_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `システムユースケースが存在しません: ${SYSTEM_UC_PATH}`)
  })

  it('should exist at docs/requirements/user_story.md', () => {
    // Given: ユーザーストーリーのパス
    // When: ファイルの存在を確認する
    const exists = existsSync(USER_STORY_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `ユーザーストーリーが存在しません: ${USER_STORY_PATH}`)
  })
})

describe('ビジネスユースケース', () => {
  describe('必須セクション', () => {
    it('should have a title with system name', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: タイトル行を確認する
      // Then: タイトルにビジネスユースケースであることが示されている
      assert.match(
        content,
        /^# .*ビジネスユースケース/m,
        'タイトルに「ビジネスユースケース」が含まれていません'
      )
    })

    it('should contain a PlantUML use case diagram', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: PlantUML 図の存在を確認する
      // Then: ユースケース図が含まれる
      assert.match(
        content,
        /```plantuml[\s\S]*?@startuml[\s\S]*?@enduml[\s\S]*?```/,
        'PlantUML ユースケース図が含まれていません'
      )
    })
  })

  describe('5件のビジネスユースケースの網羅', () => {
    it('should include BUC: 商品企画', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: 商品企画の存在を確認する
      // Then: 商品企画が含まれる
      assert.match(content, /商品企画/, 'BUC「商品企画」が含まれていません')
    })

    it('should include BUC: WEB 受注', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: WEB 受注の存在を確認する
      // Then: WEB 受注が含まれる
      assert.match(
        content,
        /WEB 受注|WEB受注/,
        'BUC「WEB 受注」が含まれていません'
      )
    })

    it('should include BUC: 仕入れ・入荷', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: 仕入れ・入荷の存在を確認する
      // Then: 仕入れ・入荷が含まれる
      assert.match(
        content,
        /仕入れ・入荷|仕入/,
        'BUC「仕入れ・入荷」が含まれていません'
      )
    })

    it('should include BUC: 結束', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: 結束の存在を確認する
      // Then: 結束が含まれる
      assert.match(content, /結束/, 'BUC「結束」が含まれていません')
    })

    it('should include BUC: 出荷・配送', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: 出荷・配送の存在を確認する
      // Then: 出荷・配送が含まれる
      assert.match(
        content,
        /出荷・配送|出荷/,
        'BUC「出荷・配送」が含まれていません'
      )
    })
  })

  describe('アクターとの関係', () => {
    it('should include all three actors', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: 3 アクターの存在を確認する
      // Then: 得意先、スタッフ、仕入先が含まれる
      assert.match(content, /得意先/, 'アクター「得意先」が含まれていません')
      assert.match(
        content,
        /スタッフ|フレール・メモワール/,
        'アクター「スタッフ」が含まれていません'
      )
      assert.match(content, /仕入先/, 'アクター「仕入先」が含まれていません')
    })
  })

  describe('業務目標', () => {
    it('should describe business objectives for each BUC', () => {
      // Given: ビジネスユースケースの内容
      const content = readBusinessUsecase()

      // When: 各 BUC に業務目標の記述があるか確認する
      // Then: 5 つの BUC それぞれに説明テキストがある
      const bucNames = ['商品企画', 'WEB 受注', '仕入', '結束', '出荷']
      for (const buc of bucNames) {
        const pattern = new RegExp(buc)
        assert.match(
          content,
          pattern,
          `BUC「${buc}」の業務目標記述が含まれていません`
        )
      }
    })
  })
})

describe('システムユースケース', () => {
  describe('9件のシステムユースケースの網羅', () => {
    const usecases = [
      { id: 'UC001', name: '商品マスタ管理' },
      { id: 'UC002', name: 'WEB 受注' },
      { id: 'UC003', name: '在庫推移' },
      { id: 'UC004', name: '発注管理' },
      { id: 'UC005', name: '入荷管理' },
      { id: 'UC006', name: '出荷管理' },
      { id: 'UC007', name: '届け日変更' },
      { id: 'UC008', name: '届け先コピー' },
      { id: 'UC009', name: '得意先管理' },
    ]

    for (const uc of usecases) {
      it(`should include ${uc.id}: ${uc.name}`, () => {
        // Given: システムユースケースの内容
        const content = readSystemUsecase()

        // When: ユースケースの存在を確認する
        // Then: UC番号とユースケース名が含まれる
        const idPattern = new RegExp(uc.id)
        const namePattern = new RegExp(uc.name.replace(/\s+/g, '\\s*'))
        assert.match(
          content,
          idPattern,
          `ユースケース番号「${uc.id}」が含まれていません`
        )
        assert.match(
          content,
          namePattern,
          `ユースケース名「${uc.name}」が含まれていません`
        )
      })
    }
  })

  describe('完全形式の必須セクション', () => {
    it('should include scope for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: スコープの記述を確認する
      // Then: スコープの記述が含まれる
      assert.match(
        content,
        /\*\*スコープ\*\*/,
        'ユースケースに「スコープ」セクションが含まれていません'
      )
    })

    it('should include level for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: レベルの記述を確認する
      // Then: レベルの記述が含まれる
      assert.match(
        content,
        /\*\*レベル\*\*/,
        'ユースケースに「レベル」セクションが含まれていません'
      )
    })

    it('should include primary actor for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: 主アクターの記述を確認する
      // Then: 主アクターの記述が含まれる
      assert.match(
        content,
        /\*\*主アクター\*\*/,
        'ユースケースに「主アクター」セクションが含まれていません'
      )
    })

    it('should include preconditions for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: 事前条件の記述を確認する
      // Then: 事前条件の記述が含まれる
      assert.match(
        content,
        /\*\*事前条件\*\*/,
        'ユースケースに「事前条件」セクションが含まれていません'
      )
    })

    it('should include main success scenario for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: 主成功シナリオの記述を確認する
      // Then: 主成功シナリオの記述が含まれる
      assert.match(
        content,
        /\*\*主成功シナリオ\*\*/,
        'ユースケースに「主成功シナリオ」セクションが含まれていません'
      )
    })

    it('should include extensions for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: 拡張の記述を確認する
      // Then: 拡張の記述が含まれる
      assert.match(
        content,
        /\*\*拡張\*\*/,
        'ユースケースに「拡張」セクションが含まれていません'
      )
    })

    it('should include success guarantee for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: 成功保証の記述を確認する
      // Then: 成功保証の記述が含まれる
      assert.match(
        content,
        /\*\*成功保証時?\*\*/,
        'ユースケースに「成功保証」セクションが含まれていません'
      )
    })

    it('should include trigger for each use case', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: トリガーの記述を確認する
      // Then: トリガーの記述が含まれる
      assert.match(
        content,
        /\*\*トリガー\*\*/,
        'ユースケースに「トリガー」セクションが含まれていません'
      )
    })

    it('should include scope icon (system) and level icon', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: スコープアイコンとレベルアイコンを確認する
      // Then: 🖥️（システム）と 🌊（ユーザー目的）アイコンが含まれる
      assert.match(
        content,
        /🖥️/,
        'システムスコープアイコン（🖥️）が含まれていません'
      )
      assert.match(
        content,
        /🌊/,
        'ユーザー目的レベルアイコン（🌊）が含まれていません'
      )
    })

    it('should have all 9 use cases with main success scenario sections', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: 主成功シナリオの出現回数を確認する
      const count = countPatternMatches(content, /\*\*主成功シナリオ\*\*/g)

      // Then: 9件のユースケースすべてに主成功シナリオがある
      assert.equal(
        count,
        9,
        `主成功シナリオの数が9件ではありません（${count}件）`
      )
    })
  })

  describe('画面・帳票モデルとの対応', () => {
    it('should reference related screens for use cases', () => {
      // Given: システムユースケースの内容
      const content = readSystemUsecase()

      // When: 画面名への参照を確認する
      // Then: 主要な画面名が含まれる
      assert.match(content, /商品一覧/, '画面「商品一覧」への参照がありません')
      assert.match(content, /注文/, '注文関連の画面への参照がありません')
      assert.match(content, /在庫推移/, '画面「在庫推移」への参照がありません')
    })
  })
})

describe('ユーザーストーリー', () => {
  describe('ストーリー形式の準拠', () => {
    it('should use the format: として、〜したい。なぜなら〜', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: ストーリー形式を確認する
      // Then: 「〜として、〜したい。なぜなら〜」の形式が含まれる
      assert.match(
        content,
        /として.*したい.*なぜなら/,
        'ユーザーストーリー形式「〜として、〜したい。なぜなら〜」が含まれていません'
      )
    })

    it('should have multiple user stories', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: ストーリーの数を数える
      const storyCount = countPatternMatches(content, /として.*したい/g)

      // Then: 複数のストーリーが存在する（最低9件、各UCから1件以上）
      assert.ok(
        storyCount >= 9,
        `ユーザーストーリーが9件未満です（${storyCount}件）。9件のユースケースから最低1件ずつ必要`
      )
    })
  })

  describe('受け入れ基準', () => {
    it('should include Given-When-Then acceptance criteria', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: Given-When-Then パターンの存在を確認する
      // Then: Given, When, Then がすべて含まれる
      assert.match(content, /Given/i, '受け入れ基準に「Given」が含まれていません')
      assert.match(content, /When/i, '受け入れ基準に「When」が含まれていません')
      assert.match(content, /Then/i, '受け入れ基準に「Then」が含まれていません')
    })

    it('should have acceptance criteria for each story', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: 受け入れ基準の出現回数を確認する
      const criteriaCount = countPatternMatches(
        content,
        /受け入れ基準|受入基準|受入条件/g
      )

      // Then: 複数の受け入れ基準がある
      assert.ok(
        criteriaCount >= 9,
        `受け入れ基準が9件未満です（${criteriaCount}件）。各ストーリーに受け入れ基準が必要`
      )
    })
  })

  describe('ビジネスルールの反映', () => {
    it('should reflect: 1受注=1届け先=1商品', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: 1受注=1届け先=1商品のルールを確認する
      // Then: このビジネスルールへの言及がある
      const hasRule =
        /1\s*受注.*1\s*届け先.*1\s*商品/.test(content) ||
        /1\s*受注\s*=\s*1\s*届け先\s*=\s*1\s*商品/.test(content) ||
        /受注.*届け先.*商品/.test(content)
      assert.ok(
        hasRule,
        'ビジネスルール「1受注=1届け先=1商品」が受け入れ基準に反映されていません'
      )
    })

    it('should reflect: 出荷日=届け日の前日', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: 出荷日=届け日の前日のルールを確認する
      // Then: このビジネスルールへの言及がある
      const hasRule =
        /出荷日.*届け日.*前日/.test(content) ||
        /出荷.*=.*届け.*前日/.test(content) ||
        /届け日の前日.*出荷/.test(content)
      assert.ok(
        hasRule,
        'ビジネスルール「出荷日=届け日の前日」が受け入れ基準に反映されていません'
      )
    })

    it('should reflect: 発注判断は人間が行う', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: 発注判断は人間が行うルールを確認する
      // Then: 人間判断に関する記述がある
      const hasRule =
        /発注判断.*人間/.test(content) ||
        /人間.*判断/.test(content) ||
        /判断材料.*提供/.test(content) ||
        /人間判断/.test(content)
      assert.ok(
        hasRule,
        'ビジネスルール「発注判断は人間が行う」が受け入れ基準に反映されていません'
      )
    })

    it('should reflect: 単品ごとに特定の仕入先', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: 単品ごとに仕入先のルールを確認する
      // Then: このビジネスルールへの言及がある
      const hasRule =
        /単品.*仕入先/.test(content) || /仕入先.*単品/.test(content)
      assert.ok(
        hasRule,
        'ビジネスルール「単品ごとに特定の仕入先」が受け入れ基準に反映されていません'
      )
    })

    it('should reflect: 品質維持日数を考慮した在庫管理', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: 品質維持日数の記述を確認する
      // Then: 品質維持日数への言及がある
      assert.match(
        content,
        /品質維持日数|品質維持/,
        '「品質維持日数」を考慮した在庫管理への言及がありません'
      )
    })
  })

  describe('トレーサビリティ', () => {
    it('should reference UC numbers in user stories', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: UC番号への参照を確認する
      // Then: UC番号への参照が含まれる
      const ucRefs = countPatternMatches(content, /UC\d{3}/g)
      assert.ok(
        ucRefs >= 9,
        `UC番号への参照が9件未満です（${ucRefs}件）。各ユースケースとの対応が必要`
      )
    })

    it('should cover all 9 use cases in stories', () => {
      // Given: ユーザーストーリーの内容
      const content = readUserStory()

      // When: 9件すべてのUC番号が参照されているか確認する
      const ucIds = [
        'UC001', 'UC002', 'UC003', 'UC004', 'UC005',
        'UC006', 'UC007', 'UC008', 'UC009',
      ]

      // Then: すべてのUC番号が参照されている
      for (const ucId of ucIds) {
        assert.match(
          content,
          new RegExp(ucId),
          `ユースケース「${ucId}」に対応するストーリーがありません`
        )
      }
    })
  })
})

describe('PlantUML 図の整合性', () => {
  it('should have matching @startuml and @enduml pairs in business_usecase.md', () => {
    // Given: ビジネスユースケースの内容
    const content = readBusinessUsecase()

    // When: @startuml と @enduml の数を数える
    const startCount = countPatternMatches(content, /@startuml/g)
    const endCount = countPatternMatches(content, /@enduml/g)

    // Then: 対応が一致する
    assert.equal(
      startCount,
      endCount,
      `business_usecase.md: @startuml (${startCount}) と @enduml (${endCount}) の数が一致しません`
    )
  })

  it('should wrap all PlantUML in markdown code blocks in business_usecase.md', () => {
    // Given: ビジネスユースケースの内容
    const content = readBusinessUsecase()

    // When: plantuml ブロックと @startuml の数を比較する
    const plantumlBlocks = countPatternMatches(content, /```plantuml/g)
    const startumlCount = countPatternMatches(content, /@startuml/g)

    // Then: すべての @startuml が ```plantuml ブロック内にある
    assert.equal(
      plantumlBlocks,
      startumlCount,
      `business_usecase.md: \`\`\`plantuml ブロック (${plantumlBlocks}) と @startuml (${startumlCount}) の数が一致しません`
    )
  })

  it('should have at least one PlantUML diagram in business_usecase.md', () => {
    // Given: ビジネスユースケースの内容
    const content = readBusinessUsecase()

    // When: PlantUML 図の数を確認する
    const diagramCount = countPatternMatches(content, /@startuml/g)

    // Then: 少なくとも1つの図がある
    assert.ok(
      diagramCount >= 1,
      `business_usecase.md: PlantUML 図が存在しません（${diagramCount}個）`
    )
  })
})

describe('テンプレートプレースホルダの残留チェック', () => {
  it('should not contain template placeholders in business_usecase.md', () => {
    // Given: ビジネスユースケースの内容
    const content = readBusinessUsecase()

    // When: テンプレートのプレースホルダを検索する
    // Then: プレースホルダが残っていない
    const placeholderPattern = /\[(?:システム名|アクター\d*名|UC名\d*|BUC\d*名)\]/g
    const matches = content.match(placeholderPattern)
    assert.equal(
      matches,
      null,
      `business_usecase.md: テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
    )
  })

  it('should not contain template placeholders in system_usecase.md', () => {
    // Given: システムユースケースの内容
    const content = readSystemUsecase()

    // When: テンプレートのプレースホルダを検索する
    // Then: プレースホルダが残っていない
    const placeholderPattern = /\[(?:システム名|アクター\d*名|UC名\d*)\]/g
    const matches = content.match(placeholderPattern)
    assert.equal(
      matches,
      null,
      `system_usecase.md: テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
    )
  })

  it('should not contain template placeholders in user_story.md', () => {
    // Given: ユーザーストーリーの内容
    const content = readUserStory()

    // When: テンプレートのプレースホルダを検索する
    // Then: プレースホルダが残っていない
    const placeholderPattern = /\[(?:ロール名|アクション|理由|条件|操作|期待結果)\]/g
    const matches = content.match(placeholderPattern)
    assert.equal(
      matches,
      null,
      `user_story.md: テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
    )
  })
})

describe('index.md の更新', () => {
  it('should update ビジネスユースケース status to 作成済み with link', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: ビジネスユースケースの状況を確認する
    // Then: 「作成済み」に更新され、リンクがある
    assert.match(
      content,
      /ビジネスユースケース.*作成済み/,
      'index.md のビジネスユースケースの状況が「作成済み」に更新されていません'
    )
    assert.match(
      content,
      /\[.*ビジネスユースケース.*\]\(.*business_usecase\.md.*\)/,
      'index.md にビジネスユースケースへのリンクがありません'
    )
  })

  it('should update システムユースケース status to 作成済み with link', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: システムユースケースの状況を確認する
    // Then: 「作成済み」に更新され、リンクがある
    assert.match(
      content,
      /システムユースケース.*作成済み/,
      'index.md のシステムユースケースの状況が「作成済み」に更新されていません'
    )
    assert.match(
      content,
      /\[.*システムユースケース.*\]\(.*system_usecase\.md.*\)/,
      'index.md にシステムユースケースへのリンクがありません'
    )
  })

  it('should update ユーザーストーリー status to 作成済み with link', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: ユーザーストーリーの状況を確認する
    // Then: 「作成済み」に更新され、リンクがある
    assert.match(
      content,
      /ユーザーストーリー.*作成済み/,
      'index.md のユーザーストーリーの状況が「作成済み」に更新されていません'
    )
    assert.match(
      content,
      /\[.*ユーザーストーリー.*\]\(.*user_story\.md.*\)/,
      'index.md にユーザーストーリーへのリンクがありません'
    )
  })
})

describe('用語の一貫性', () => {
  it('should use 得意先 as the customer actor name in business_usecase.md', () => {
    // Given: ビジネスユースケースの内容
    const content = readBusinessUsecase()

    // When: アクター名の表記を確認する
    // Then: 「得意先」を使用している
    assert.match(
      content,
      /得意先/,
      'ビジネスユースケースでアクター「得意先」が使用されていません'
    )
  })

  it('should use 得意先 as the customer actor name in user_story.md', () => {
    // Given: ユーザーストーリーの内容
    const content = readUserStory()

    // When: アクター名の表記を確認する
    // Then: 「得意先」を使用している
    assert.match(
      content,
      /得意先/,
      'ユーザーストーリーでアクター「得意先」が使用されていません'
    )
  })

  it('should use consistent entity names: 商品（花束）and 単品（花）', () => {
    // Given: システムユースケースの内容
    const content = readSystemUsecase()

    // When: エンティティ名の表記を確認する
    // Then: 「商品」と「単品」が含まれる
    assert.match(
      content,
      /商品/,
      'システムユースケースに「商品」の記述がありません'
    )
    assert.match(
      content,
      /単品/,
      'システムユースケースに「単品」の記述がありません'
    )
  })
})
