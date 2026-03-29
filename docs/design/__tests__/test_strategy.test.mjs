import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEST_STRATEGY_PATH = resolve(__dirname, '..', 'test_strategy.md')
const INDEX_PATH = resolve(__dirname, '..', 'index.md')

// --- Helper functions ---

function readTestStrategy() {
  if (!existsSync(TEST_STRATEGY_PATH)) {
    throw new Error(
      `テスト戦略書が存在しません: ${TEST_STRATEGY_PATH}`
    )
  }
  return readFileSync(TEST_STRATEGY_PATH, 'utf-8')
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

describe('テスト戦略書の存在確認', () => {
  it('should exist at docs/design/test_strategy.md', () => {
    // Given: テスト戦略書のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(TEST_STRATEGY_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `テスト戦略書が存在しません: ${TEST_STRATEGY_PATH}`)
  })
})

// ============================================================
// タイトルとテンプレートプレースホルダ
// ============================================================

describe('テスト戦略書のタイトル', () => {
  it('should have system name in the title', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: タイトル行を確認する
    // Then: システム名「フレール・メモワール」と「WEB ショップシステム」が含まれる
    assert.match(
      content,
      /^# .*(フレール・メモワール|WEB ショップシステム)/m,
      'タイトルにシステム名が含まれていません'
    )
  })

  it('should not contain template placeholders', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: テンプレートのプレースホルダを検索する
    // Then: プレースホルダが残っていない
    const placeholderPattern = /\[(?:システム名|プロジェクト名|テスト種別名|ツール名|テスト対象名)\]/g
    const matches = content.match(placeholderPattern)
    assert.equal(
      matches,
      null,
      `テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
    )
  })

  it('should not contain meeting room reservation system examples', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: 会議室予約システムの例がそのまま残っていないか確認する
    // Then: ガイドの例がコピーされていない
    assert.doesNotMatch(
      content,
      /会議室予約システム/,
      'ガイドの「会議室予約システム」の例がそのまま残っています。フレール・メモワール WEB ショップのドメインに合わせてください'
    )
  })
})

// ============================================================
// テストピラミッド設計
// ============================================================

describe('テストピラミッド設計', () => {
  it('should contain test pyramid section', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: テストピラミッドセクションを確認する
    // Then: セクションが存在する
    assert.match(
      content,
      /## テストピラミッド/,
      'テストピラミッドセクションが存在しません'
    )
  })

  it('should define pyramid-shaped test ratios for domain model pattern', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: ピラミッド形テストの比率を確認する
    // Then: ユニット 80%、統合 15%、E2E 5% の比率が定義されている
    assert.match(
      content,
      /80\s*%/,
      'ユニットテストの比率 80% が定義されていません'
    )
    assert.match(
      content,
      /15\s*%/,
      '統合テストの比率 15% が定義されていません'
    )
    assert.match(
      content,
      /5\s*%/,
      'E2E テストの比率 5% が定義されていません'
    )
  })

  it('should reference domain model pattern as the basis for pyramid selection', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: ドメインモデルパターンへの言及を確認する
    // Then: ピラミッド形テスト選択の根拠としてドメインモデルパターンが言及されている
    assert.match(
      content,
      /ドメインモデル/,
      'ドメインモデルパターンへの言及がありません'
    )
    assert.match(
      content,
      /ピラミッド/,
      'ピラミッド形テストへの言及がありません'
    )
  })

  describe('バックエンド層別テスト方針', () => {
    it('should define test strategy for domain layer', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: ドメイン層のテスト方針を確認する
      // Then: ドメイン層のユニットテスト方針が定義されている
      assert.match(
        content,
        /ドメイン層/,
        'ドメイン層のテスト方針が含まれていません'
      )
    })

    it('should define test strategy for application layer', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: アプリケーション層のテスト方針を確認する
      // Then: アプリケーション層のテスト方針が定義されている
      assert.match(
        content,
        /アプリケーション層/,
        'アプリケーション層のテスト方針が含まれていません'
      )
    })

    it('should define test strategy for infrastructure layer', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: インフラ層のテスト方針を確認する
      // Then: インフラ層のテスト方針が定義されている
      assert.match(
        content,
        /インフラ/,
        'インフラ層のテスト方針が含まれていません'
      )
    })
  })

  describe('フロントエンド（Thymeleaf SSR）テスト方針', () => {
    it('should mention Thymeleaf SSR as the frontend technology', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: Thymeleaf SSR への言及を確認する
      // Then: Thymeleaf が言及されている
      assert.match(
        content,
        /Thymeleaf/,
        'フロントエンド技術として Thymeleaf への言及がありません'
      )
    })

    it('should define MockMvc for controller testing', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: MockMvc の利用方針を確認する
      // Then: MockMvc による Controller テストが定義されている
      assert.match(
        content,
        /MockMvc/,
        'Controller テストの MockMvc への言及がありません'
      )
    })
  })
})

// ============================================================
// テスト種別の定義
// ============================================================

describe('テスト種別の定義', () => {
  describe('ユニットテスト', () => {
    it('should contain unit test section', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: ユニットテストセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### ユニットテスト/,
        'ユニットテストセクションが存在しません'
      )
    })

    it('should specify JUnit 5 as the testing framework', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: JUnit 5 の指定を確認する
      // Then: JUnit 5 が指定されている
      assert.match(
        content,
        /JUnit\s*5/,
        'テストフレームワークとして JUnit 5 が指定されていません'
      )
    })

    it('should specify AssertJ for assertions', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: AssertJ の指定を確認する
      // Then: AssertJ が指定されている
      assert.match(
        content,
        /AssertJ/,
        'アサーションライブラリとして AssertJ が指定されていません'
      )
    })

    it('should target domain model components', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: ドメインモデルのコンポーネントがテスト対象として明記されているか確認する
      // Then: 値オブジェクト、エンティティ、ドメインサービスがテスト対象として含まれる
      assert.match(
        content,
        /値オブジェクト/,
        'ユニットテスト対象に「値オブジェクト」が含まれていません'
      )
      assert.match(
        content,
        /エンティティ/,
        'ユニットテスト対象に「エンティティ」が含まれていません'
      )
      assert.match(
        content,
        /ドメインサービス/,
        'ユニットテスト対象に「ドメインサービス」が含まれていません'
      )
    })

    it('should cover business rules BR01-BR08', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: ビジネスルールの言及を確認する
      // Then: BR01-BR08 への言及がある
      assert.match(
        content,
        /BR01/,
        'ビジネスルール BR01 への言及がありません'
      )
      assert.match(
        content,
        /BR08/,
        'ビジネスルール BR08 への言及がありません'
      )
    })
  })

  describe('統合テスト', () => {
    it('should contain integration test section', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: 統合テストセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### 統合テスト/,
        '統合テストセクションが存在しません'
      )
    })

    it('should specify Spring Boot Test as the framework', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: Spring Boot Test の指定を確認する
      // Then: Spring Boot Test が指定されている
      assert.match(
        content,
        /Spring Boot Test/,
        'テストフレームワークとして Spring Boot Test が指定されていません'
      )
    })

    it('should specify Testcontainers for database testing', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: Testcontainers の指定を確認する
      // Then: Testcontainers が指定されている
      assert.match(
        content,
        /Testcontainers/,
        'DB テストに Testcontainers が指定されていません'
      )
    })

    it('should target application services and repositories', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: アプリケーション層のテスト対象を確認する
      // Then: Service と Repository が統合テスト対象として含まれる
      assert.match(
        content,
        /Service/,
        '統合テスト対象に Service が含まれていません'
      )
      assert.match(
        content,
        /Repository/,
        '統合テスト対象に Repository が含まれていません'
      )
    })
  })

  describe('E2E テスト', () => {
    it('should contain E2E test section', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: E2E テストセクションを確認する
      // Then: セクションが存在する
      assert.match(
        content,
        /### E2E テスト/,
        'E2E テストセクションが存在しません'
      )
    })

    it('should target key user stories', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: 主要ユーザーストーリーが E2E テスト対象として言及されているか確認する
      // Then: US005（WEB 注文）、US007（在庫推移）、US014（ログイン）が含まれる
      assert.match(
        content,
        /US005/,
        'E2E テスト対象にユーザーストーリー US005 が含まれていません'
      )
      assert.match(
        content,
        /US007/,
        'E2E テスト対象にユーザーストーリー US007 が含まれていません'
      )
      assert.match(
        content,
        /US014/,
        'E2E テスト対象にユーザーストーリー US014 が含まれていません'
      )
    })
  })

  describe('その他のテスト種別', () => {
    it('should address performance testing', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: 性能テストの方針を確認する
      // Then: 性能テストへの言及がある
      const hasPerformance = /性能テスト|パフォーマンステスト/.test(content)
      assert.ok(
        hasPerformance,
        '性能テストへの言及がありません'
      )
    })

    it('should address security testing', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: セキュリティテストの方針を確認する
      // Then: セキュリティテストへの言及がある
      assert.match(
        content,
        /セキュリティテスト|セキュリティ/,
        'セキュリティテストへの言及がありません'
      )
    })
  })
})

// ============================================================
// カバレッジ目標
// ============================================================

describe('カバレッジ目標', () => {
  it('should contain coverage target section', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: カバレッジ目標セクションを確認する
    // Then: セクションが存在する
    assert.match(
      content,
      /## カバレッジ目標/,
      'カバレッジ目標セクションが存在しません'
    )
  })

  it('should define overall coverage target of 80%', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: 全体カバレッジ目標を確認する
    // Then: 全体 80% 以上が定義されている
    assert.match(
      content,
      /全体.*80\s*%|80\s*%.*全体/,
      '全体カバレッジ目標 80% が定義されていません'
    )
  })

  it('should define domain layer coverage target of 90%', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: ドメイン層のカバレッジ目標を確認する
    // Then: ドメイン層 90% 以上が定義されている
    assert.match(
      content,
      /ドメイン層.*90\s*%|90\s*%.*ドメイン/,
      'ドメイン層カバレッジ目標 90% が定義されていません'
    )
  })

  it('should define application layer coverage target of 85%', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: アプリケーション層のカバレッジ目標を確認する
    // Then: アプリケーション層 85% 以上が定義されている
    assert.match(
      content,
      /アプリケーション層.*85\s*%|85\s*%.*アプリケーション/,
      'アプリケーション層カバレッジ目標 85% が定義されていません'
    )
  })

  it('should define infrastructure layer coverage target of 70%', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: インフラ層のカバレッジ目標を確認する
    // Then: インフラ層 70% 以上が定義されている
    assert.match(
      content,
      /インフラ.*70\s*%|70\s*%.*インフラ/,
      'インフラ層カバレッジ目標 70% が定義されていません'
    )
  })
})

// ============================================================
// テスト環境・データ戦略
// ============================================================

describe('テスト環境・データ戦略', () => {
  it('should contain test environment section', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: テスト環境セクションを確認する
    // Then: セクションが存在する
    assert.match(
      content,
      /## テスト環境/,
      'テスト環境セクションが存在しません'
    )
  })

  describe('テストデータ管理方針', () => {
    it('should define test data management strategy', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: テストデータ管理方針を確認する
      // Then: テストデータ管理の方針が定義されている
      assert.match(
        content,
        /テストデータ/,
        'テストデータ管理方針が含まれていません'
      )
    })

    it('should specify Object Mother or Test Data Builder pattern', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: テストデータパターンの指定を確認する
      // Then: Object Mother または Test Data Builder が指定されている
      const hasPattern =
        /Object Mother/.test(content) ||
        /Test Data Builder/.test(content) ||
        /テストビルダー/.test(content)
      assert.ok(
        hasPattern,
        'テストデータパターン（Object Mother / Test Data Builder）が指定されていません'
      )
    })
  })

  describe('モック・スタブの利用方針', () => {
    it('should define mocking strategy', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: モック利用方針を確認する
      // Then: モックの利用方針が定義されている
      assert.match(
        content,
        /モック|Mock/,
        'モック利用方針が含まれていません'
      )
    })

    it('should specify Mockito for mocking', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: Mockito の指定を確認する
      // Then: Mockito が指定されている
      assert.match(
        content,
        /Mockito/,
        'モックフレームワークとして Mockito が指定されていません'
      )
    })
  })

  describe('テスト環境の構成', () => {
    it('should define test environment configuration', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: テスト環境構成を確認する
      // Then: テスト環境の構成が定義されている
      const hasEnvConfig =
        /Testcontainers/.test(content) ||
        /テスト環境/.test(content)
      assert.ok(
        hasEnvConfig,
        'テスト環境の構成が定義されていません'
      )
    })

    it('should mention transaction management for test isolation', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: テスト分離のためのトランザクション管理を確認する
      // Then: @Transactional や Rollback などの言及がある
      const hasIsolation =
        /@Transactional/.test(content) ||
        /Rollback/.test(content) ||
        /トランザクション/.test(content)
      assert.ok(
        hasIsolation,
        'テスト分離のためのトランザクション管理への言及がありません'
      )
    })
  })
})

// ============================================================
// CI/CD との統合方針
// ============================================================

describe('CI/CD との統合方針', () => {
  it('should contain CI/CD integration section', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: CI/CD 統合セクションを確認する
    // Then: セクションが存在する
    assert.match(
      content,
      /## CI\/CD/,
      'CI/CD 統合セクションが存在しません'
    )
  })

  describe('テスト実行タイミング', () => {
    it('should define test execution at commit time', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: コミット時のテスト実行を確認する
      // Then: コミット時にユニットテストが実行される
      assert.match(
        content,
        /コミット/,
        'コミット時のテスト実行タイミングが定義されていません'
      )
    })

    it('should define test execution at PR time', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: PR 時のテスト実行を確認する
      // Then: PR 時に統合テストを含むテストが実行される
      assert.match(
        content,
        /PR|プルリクエスト/,
        'PR 時のテスト実行タイミングが定義されていません'
      )
    })

    it('should define test execution before deploy', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: デプロイ前のテスト実行を確認する
      // Then: デプロイ前に全テストが実行される
      assert.match(
        content,
        /デプロイ/,
        'デプロイ前のテスト実行タイミングが定義されていません'
      )
    })
  })

  describe('Quality Gate の基準', () => {
    it('should define quality gate criteria', () => {
      // Given: テスト戦略書の内容
      const content = readTestStrategy()

      // When: Quality Gate の基準を確認する
      // Then: Quality Gate が定義されている
      assert.match(
        content,
        /Quality Gate|品質ゲート/,
        'Quality Gate の基準が定義されていません'
      )
    })
  })
})

// ============================================================
// TDD/BDD 方針
// ============================================================

describe('TDD/BDD 方針', () => {
  it('should contain TDD section', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: TDD セクションを確認する
    // Then: セクションが存在する
    assert.match(
      content,
      /## TDD/,
      'TDD セクションが存在しません'
    )
  })

  it('should define inside-out TDD for backend', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: バックエンドの TDD 方針を確認する
    // Then: インサイドアウト TDD が定義されている
    assert.match(
      content,
      /インサイドアウト/,
      'バックエンドのインサイドアウト TDD 方針が定義されていません'
    )
  })

  it('should define outside-in TDD for frontend', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: フロントエンドの TDD 方針を確認する
    // Then: アウトサイドイン TDD が定義されている
    assert.match(
      content,
      /アウトサイドイン/,
      'フロントエンドのアウトサイドイン TDD 方針が定義されていません'
    )
  })
})

// ============================================================
// トレーサビリティ
// ============================================================

describe('トレーサビリティ', () => {
  it('should contain traceability section or matrix', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: トレーサビリティセクションを確認する
    // Then: トレーサビリティマトリクスまたはユースケースとテスト種別の対応表がある
    const hasTraceability =
      /トレーサビリティ/.test(content) ||
      /ユースケース.*テスト種別/.test(content) ||
      /テスト種別.*ユースケース/.test(content)
    assert.ok(
      hasTraceability,
      'トレーサビリティ（ユースケース × テスト種別）への言及がありません'
    )
  })

  it('should reference use cases from architecture design', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: アーキテクチャ設計のユースケースが参照されているか確認する
    // Then: UC001 と UC011 への言及がある（最初と最後のユースケース）
    assert.match(
      content,
      /UC001/,
      'ユースケース UC001 への言及がありません'
    )
    assert.match(
      content,
      /UC011/,
      'ユースケース UC011 への言及がありません'
    )
  })
})

// ============================================================
// ドメイン固有のテスト対象
// ============================================================

describe('ドメイン固有のテスト対象', () => {
  it('should include inventory transition calculation (BR06) as a test target', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: 在庫推移計算のテスト対象を確認する
    // Then: 在庫推移に関するテスト方針が含まれる
    assert.match(
      content,
      /在庫推移/,
      'ドメイン固有のテスト対象「在庫推移」が含まれていません'
    )
  })

  it('should include delivery date validation (BR07) as a test target', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: 届け日バリデーションのテスト対象を確認する
    // Then: 届け日に関するテスト方針が含まれる
    assert.match(
      content,
      /届け日/,
      'ドメイン固有のテスト対象「届け日」が含まれていません'
    )
  })

  it('should include order status transitions as a test target', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: 受注ステータス遷移のテスト対象を確認する
    // Then: 受注ステータスに関するテスト方針が含まれる
    assert.match(
      content,
      /受注.*ステータス|ステータス.*遷移/,
      'ドメイン固有のテスト対象「受注ステータス遷移」が含まれていません'
    )
  })

  it('should reference the nine aggregates from domain model', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: ドメインモデルの集約がテスト対象として言及されているか確認する
    // Then: 主要な集約（受注、商品、在庫、得意先）への言及がある
    assert.match(content, /受注/, '集約「受注」への言及がありません')
    assert.match(content, /商品/, '集約「商品」への言及がありません')
    assert.match(content, /在庫/, '集約「在庫」への言及がありません')
    assert.match(content, /得意先/, '集約「得意先」への言及がありません')
  })

  it('should reference the three domain services', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: 3 つのドメインサービスが言及されているか確認する
    // Then: ドメインサービスへの言及がある
    assert.match(
      content,
      /ドメインサービス/,
      'ドメインサービスへの言及がありません'
    )
  })
})

// ============================================================
// SPA 向けテスト戦略の排除
// ============================================================

describe('SPA 向けテスト戦略の排除', () => {
  it('should not include React Testing Library', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: React Testing Library がフロントエンドテストとして定義されていないか確認する
    // Then: SPA 向けのテストツールが含まれていない
    assert.doesNotMatch(
      content,
      /React Testing Library/,
      'SPA 向けの React Testing Library が含まれています。Thymeleaf SSR 構成には不要です'
    )
  })

  it('should not include Cypress or Playwright as primary E2E tool', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: SPA 向け E2E ツールがプライマリツールとして定義されていないか確認する
    // Then: Cypress/Playwright がプライマリ E2E ツールとして含まれていない
    // Why: Thymeleaf SSR では MockMvc がプライマリ E2E ツールとなる
    const hasSpaE2E =
      /Cypress.*プライマリ|Playwright.*プライマリ/.test(content) ||
      /プライマリ.*Cypress|プライマリ.*Playwright/.test(content)
    assert.ok(
      !hasSpaE2E,
      'SPA 向け E2E ツール（Cypress/Playwright）がプライマリツールとして定義されています'
    )
  })
})

// ============================================================
// PlantUML 図の整合性
// ============================================================

describe('PlantUML 図の整合性', () => {
  it('should have matching @startuml and @enduml pairs', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

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
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

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

// ============================================================
// ドキュメント構造
// ============================================================

describe('ドキュメント構造', () => {
  it('should have all required top-level sections', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: 必須トップレベルセクションの存在を確認する
    const requiredSections = [
      '## 概要',
      '## テストピラミッド',
      '## テスト種別',
      '## カバレッジ目標',
      '## テスト環境',
      '## CI/CD',
      '## TDD',
    ]

    // Then: すべての必須セクションが存在する
    for (const section of requiredSections) {
      const pattern = new RegExp(section)
      assert.match(
        content,
        pattern,
        `必須セクション「${section}」が存在しません`
      )
    }
  })

  it('should have sections in logical order', () => {
    // Given: テスト戦略書の内容
    const content = readTestStrategy()

    // When: セクションの順序を確認する
    const overviewPos = content.indexOf('## 概要')
    const pyramidPos = content.search(/## テストピラミッド/)
    const typesPos = content.search(/## テスト種別/)
    const coveragePos = content.search(/## カバレッジ目標/)

    // Then: セクションが論理的な順序で配置されている
    assert.ok(overviewPos >= 0, '概要セクションが存在しません')
    assert.ok(
      overviewPos < pyramidPos,
      '概要はテストピラミッドより前に配置される必要があります'
    )
    assert.ok(
      pyramidPos < typesPos,
      'テストピラミッドはテスト種別より前に配置される必要があります'
    )
    assert.ok(
      typesPos < coveragePos,
      'テスト種別はカバレッジ目標より前に配置される必要があります'
    )
  })
})

// ============================================================
// index.md の更新
// ============================================================

describe('index.md の更新', () => {
  it('should update test strategy status to 作成済み', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: テスト戦略の状況を確認する
    // Then: 「作成済み」に更新されている
    assert.match(
      content,
      /テスト戦略.*作成済み/,
      'index.md のテスト戦略の状況が「作成済み」に更新されていません'
    )
  })

  it('should have a link to test_strategy.md', () => {
    // Given: index.md の内容
    const content = readIndex()

    // When: テスト戦略へのリンクを確認する
    // Then: test_strategy.md へのリンクが含まれている
    assert.match(
      content,
      /test_strategy\.md/,
      'index.md にテスト戦略ドキュメントへのリンクがありません'
    )
  })
})
