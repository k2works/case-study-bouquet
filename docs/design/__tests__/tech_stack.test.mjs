import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TECH_STACK_PATH = resolve(__dirname, '..', 'tech_stack.md')
const INDEX_PATH = resolve(__dirname, '..', 'index.md')
const MKDOCS_PATH = resolve(__dirname, '..', '..', '..', 'mkdocs.yml')

// --- Helper functions ---

function readTechStack() {
  if (!existsSync(TECH_STACK_PATH)) {
    throw new Error(
      `技術スタック選定書が存在しません: ${TECH_STACK_PATH}`
    )
  }
  return readFileSync(TECH_STACK_PATH, 'utf-8')
}

function readIndex() {
  if (!existsSync(INDEX_PATH)) {
    throw new Error(`index.md が存在しません: ${INDEX_PATH}`)
  }
  return readFileSync(INDEX_PATH, 'utf-8')
}

function readMkdocs() {
  if (!existsSync(MKDOCS_PATH)) {
    throw new Error(`mkdocs.yml が存在しません: ${MKDOCS_PATH}`)
  }
  return readFileSync(MKDOCS_PATH, 'utf-8')
}

function countPatternMatches(content, pattern) {
  const matches = content.match(pattern)
  return matches ? matches.length : 0
}

// ============================================================
// ファイルの存在確認
// ============================================================

describe('技術スタック選定書の存在確認', () => {
  it('should exist at docs/design/tech_stack.md', () => {
    // Given: 技術スタック選定書のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(TECH_STACK_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `技術スタック選定書が存在しません: ${TECH_STACK_PATH}`)
  })
})

// ============================================================
// タイトルとテンプレートプレースホルダ
// ============================================================

describe('技術スタック選定書のタイトル', () => {
  it('should have a title indicating tech stack', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: タイトル行を確認する
    // Then: 技術スタックに関するタイトルである
    assert.match(
      content,
      /^# .*技術スタック/m,
      'タイトルに「技術スタック」が含まれていません'
    )
  })

  it('should not contain template placeholders', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: テンプレートのプレースホルダを検索する
    // Then: プレースホルダが残っていない
    const placeholderPattern = /\[(?:システム名|プロジェクト名|技術名|バージョン|用途|ライセンス)\]/g
    const matches = content.match(placeholderPattern)
    assert.equal(
      matches,
      null,
      `テンプレートのプレースホルダが残っています: ${matches?.join(', ')}`
    )
  })
})

// ============================================================
// カテゴリ別セクション
// ============================================================

describe('技術スタック選定書のカテゴリ', () => {
  let content

  before(() => {
    content = readTechStack()
  })

  it('should have backend category', () => {
    // Given: 技術スタック選定書の内容
    // When: バックエンドカテゴリを検索する
    // Then: バックエンドセクションが存在する
    assert.match(
      content,
      /##.*バックエンド/m,
      'バックエンドカテゴリが見つかりません'
    )
  })

  it('should have frontend category', () => {
    // Given: 技術スタック選定書の内容
    // When: フロントエンドカテゴリを検索する
    // Then: フロントエンドセクションが存在する
    assert.match(
      content,
      /##.*フロントエンド/m,
      'フロントエンドカテゴリが見つかりません'
    )
  })

  it('should have database category', () => {
    // Given: 技術スタック選定書の内容
    // When: データベースカテゴリを検索する
    // Then: データベースセクションが存在する
    assert.match(
      content,
      /##.*データベース/m,
      'データベースカテゴリが見つかりません'
    )
  })

  it('should have test category', () => {
    // Given: 技術スタック選定書の内容
    // When: テストカテゴリを検索する
    // Then: テストセクションが存在する
    assert.match(
      content,
      /##.*テスト/m,
      'テストカテゴリが見つかりません'
    )
  })

  it('should have build/cicd category', () => {
    // Given: 技術スタック選定書の内容
    // When: ビルド・CI/CD カテゴリを検索する
    // Then: ビルド・CI/CD セクションが存在する
    assert.match(
      content,
      /##.*(?:ビルド|CI\/CD|CI・CD)/m,
      'ビルド・CI/CD カテゴリが見つかりません'
    )
  })

  it('should have infrastructure category', () => {
    // Given: 技術スタック選定書の内容
    // When: インフラカテゴリを検索する
    // Then: インフラセクションが存在する
    assert.match(
      content,
      /##.*インフラ/m,
      'インフラカテゴリが見つかりません'
    )
  })

  it('should have documentation category', () => {
    // Given: 技術スタック選定書の内容
    // When: ドキュメントカテゴリを検索する
    // Then: ドキュメントセクションが存在する
    assert.match(
      content,
      /##.*ドキュメント/m,
      'ドキュメントカテゴリが見つかりません'
    )
  })

  it('should have dev tools category', () => {
    // Given: 技術スタック選定書の内容
    // When: 開発ツールカテゴリを検索する
    // Then: 開発ツールセクションが存在する
    assert.match(
      content,
      /##.*開発ツール/m,
      '開発ツールカテゴリが見つかりません'
    )
  })
})

// ============================================================
// 必須技術の記載確認
// ============================================================

describe('技術スタック選定書の必須技術（バックエンド）', () => {
  let content

  before(() => {
    content = readTechStack()
  })

  it('should mention Java', () => {
    // Given: 技術スタック選定書の内容
    // When: Java への言及を確認する
    // Then: Java が記載されている
    assert.match(content, /Java/i, 'Java が記載されていません')
  })

  it('should mention Spring Boot', () => {
    // Given: 技術スタック選定書の内容
    // When: Spring Boot への言及を確認する
    // Then: Spring Boot が記載されている
    assert.match(content, /Spring Boot/i, 'Spring Boot が記載されていません')
  })

  it('should mention Spring MVC', () => {
    // Given: 技術スタック選定書の内容
    // When: Spring MVC への言及を確認する
    // Then: Spring MVC が記載されている
    assert.match(content, /Spring MVC/i, 'Spring MVC が記載されていません')
  })

  it('should mention Spring Security', () => {
    // Given: 技術スタック選定書の内容
    // When: Spring Security への言及を確認する
    // Then: Spring Security が記載されている
    assert.match(content, /Spring Security/i, 'Spring Security が記載されていません')
  })

  it('should mention JPA', () => {
    // Given: 技術スタック選定書の内容
    // When: JPA への言及を確認する
    // Then: JPA が記載されている
    assert.match(content, /JPA/, 'JPA が記載されていません')
  })
})

describe('技術スタック選定書の必須技術（フロントエンド）', () => {
  it('should mention Thymeleaf', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: Thymeleaf への言及を確認する
    // Then: Thymeleaf が記載されている
    assert.match(content, /Thymeleaf/i, 'Thymeleaf が記載されていません')
  })
})

describe('技術スタック選定書の必須技術（データベース）', () => {
  let content

  before(() => {
    content = readTechStack()
  })

  it('should mention PostgreSQL', () => {
    // Given: 技術スタック選定書の内容
    // When: PostgreSQL への言及を確認する
    // Then: PostgreSQL が記載されている
    assert.match(content, /PostgreSQL/i, 'PostgreSQL が記載されていません')
  })

  it('should mention H2', () => {
    // Given: 技術スタック選定書の内容
    // When: H2 への言及を確認する
    // Then: H2 が記載されている
    assert.match(content, /H2/, 'H2（テスト用 DB）が記載されていません')
  })
})

describe('技術スタック選定書の必須技術（テスト）', () => {
  let content

  before(() => {
    content = readTechStack()
  })

  it('should mention JUnit 5', () => {
    // Given: 技術スタック選定書の内容
    // When: JUnit 5 への言及を確認する
    // Then: JUnit 5 が記載されている
    assert.match(content, /JUnit\s*5/i, 'JUnit 5 が記載されていません')
  })

  it('should mention Mockito', () => {
    // Given: 技術スタック選定書の内容
    // When: Mockito への言及を確認する
    // Then: Mockito が記載されている
    assert.match(content, /Mockito/i, 'Mockito が記載されていません')
  })

  it('should mention Testcontainers', () => {
    // Given: 技術スタック選定書の内容
    // When: Testcontainers への言及を確認する
    // Then: Testcontainers が記載されている
    assert.match(content, /Testcontainers/i, 'Testcontainers が記載されていません')
  })
})

describe('技術スタック選定書の必須技術（インフラ）', () => {
  let content

  before(() => {
    content = readTechStack()
  })

  it('should mention Docker', () => {
    // Given: 技術スタック選定書の内容
    // When: Docker への言及を確認する
    // Then: Docker が記載されている
    assert.match(content, /Docker/i, 'Docker が記載されていません')
  })

  it('should mention GitHub Actions', () => {
    // Given: 技術スタック選定書の内容
    // When: GitHub Actions への言及を確認する
    // Then: GitHub Actions が記載されている
    assert.match(content, /GitHub Actions/i, 'GitHub Actions が記載されていません')
  })
})

describe('技術スタック選定書の必須技術（ドキュメント）', () => {
  it('should mention MkDocs', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: MkDocs への言及を確認する
    // Then: MkDocs が記載されている
    assert.match(content, /MkDocs/i, 'MkDocs が記載されていません')
  })
})

// ============================================================
// テーブル形式の確認
// ============================================================

describe('技術スタック選定書のテーブル形式', () => {
  it('should contain markdown tables', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: Markdown テーブルの存在を確認する
    const tableCount = countPatternMatches(content, /\|.*\|.*\|/g)

    // Then: 複数のテーブル行が存在する
    assert.ok(
      tableCount >= 8,
      `テーブル行が少なすぎます（${tableCount} 行）。カテゴリごとにテーブルが必要です`
    )
  })

  it('should have table headers with technology name column', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: テーブルヘッダーに技術名列があることを確認する
    // Then: 技術名に関する列ヘッダーがある
    assert.match(
      content,
      /\|.*(?:技術名?|技術|名称).*\|/m,
      'テーブルに技術名の列がありません'
    )
  })

  it('should have table headers with purpose/role column', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: テーブルヘッダーに用途・役割列があることを確認する
    // Then: 用途に関する列ヘッダーがある
    assert.match(
      content,
      /\|.*(?:用途|役割).*\|/m,
      'テーブルに用途・役割の列がありません'
    )
  })

  it('should have table headers with support status column', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: テーブルヘッダーにサポート状況列があることを確認する
    const supportColumnCount = countPatternMatches(content, /\|.*サポート状況.*\|/gm)

    // Then: 全8カテゴリのテーブルにサポート状況列がある
    assert.ok(
      supportColumnCount >= 8,
      `サポート状況列が不足しています（${supportColumnCount} / 8 カテゴリ）`
    )
  })
})

// ============================================================
// 選定理由の記載
// ============================================================

describe('技術スタック選定書の選定理由', () => {
  it('should contain selection rationale', () => {
    // Given: 技術スタック選定書の内容
    const content = readTechStack()

    // When: 選定理由に関する記述を確認する
    // Then: 選定理由が記載されている
    assert.match(
      content,
      /選定理由|採用理由|理由/m,
      '選定理由に関する記述がありません'
    )
  })
})

// ============================================================
// index.md のリンク確認
// ============================================================

describe('設計ドキュメント一覧（index.md）の tech_stack リンク', () => {
  it('should have a link to tech_stack.md', () => {
    // Given: 設計ドキュメント一覧の内容
    const content = readIndex()

    // When: tech_stack.md へのリンクを確認する
    // Then: tech_stack.md へのリンクが存在する
    assert.match(
      content,
      /\[.*技術スタック.*\]\(tech_stack\.md\)/,
      'index.md に tech_stack.md へのリンクがありません'
    )
  })

  it('should not mark tech_stack as 未作成', () => {
    // Given: 設計ドキュメント一覧の内容
    const content = readIndex()

    // When: 技術スタック行の状況を確認する
    // Then: 「未作成」ではなく「作成済み」になっている
    const techStackLine = content.split('\n').find(line =>
      line.includes('技術スタック')
    )
    assert.ok(techStackLine, '技術スタックの行が見つかりません')
    assert.doesNotMatch(
      techStackLine,
      /未作成/,
      '技術スタックの状況が「未作成」のままです'
    )
  })
})

// ============================================================
// mkdocs.yml の nav 確認
// ============================================================

describe('mkdocs.yml の技術スタック nav 設定', () => {
  it('should include tech_stack in design section nav', () => {
    // Given: mkdocs.yml の内容
    const content = readMkdocs()

    // When: 設計セクションの nav に tech_stack があることを確認する
    // Then: tech_stack が nav に含まれている
    assert.match(
      content,
      /design\/tech_stack\.md/,
      'mkdocs.yml の nav に design/tech_stack.md が含まれていません'
    )
  })
})
