import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ADR_DIR = resolve(__dirname, '..')
const ADR_001_PATH = resolve(ADR_DIR, '001-spring-boot-backend.md')
const ADR_002_PATH = resolve(ADR_DIR, '002-thymeleaf-ssr.md')
const ADR_003_PATH = resolve(ADR_DIR, '003-layered-architecture.md')
const INDEX_PATH = resolve(ADR_DIR, 'index.md')
const MKDOCS_PATH = resolve(__dirname, '..', '..', '..', 'mkdocs.yml')

// --- Helper functions ---

function readAdr(path) {
  if (!existsSync(path)) {
    throw new Error(`ADR が存在しません: ${path}`)
  }
  return readFileSync(path, 'utf-8')
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

// ============================================================
// ファイルの存在確認
// ============================================================

describe('ADR ファイルの存在確認', () => {
  it('should exist at docs/adr/001-spring-boot-backend.md', () => {
    // Given: ADR-001 のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(ADR_001_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `ADR-001 が存在しません: ${ADR_001_PATH}`)
  })

  it('should exist at docs/adr/002-thymeleaf-ssr.md', () => {
    // Given: ADR-002 のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(ADR_002_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `ADR-002 が存在しません: ${ADR_002_PATH}`)
  })

  it('should exist at docs/adr/003-layered-architecture.md', () => {
    // Given: ADR-003 のパス
    // When: ファイルの存在を確認する
    const exists = existsSync(ADR_003_PATH)

    // Then: ファイルが存在する
    assert.ok(exists, `ADR-003 が存在しません: ${ADR_003_PATH}`)
  })
})

// ============================================================
// ADR-001: Spring Boot 採用
// ============================================================

describe('ADR-001: Spring Boot バックエンドフレームワーク採用', () => {
  let content

  before(() => {
    content = readAdr(ADR_001_PATH)
  })

  it('should have ADR-001 in the title', () => {
    // Given: ADR-001 の内容
    // When: タイトル行を確認する
    // Then: ADR-001 がタイトルに含まれる
    assert.match(
      content,
      /^# ADR-001/m,
      'タイトルに ADR-001 が含まれていません'
    )
  })

  it('should mention Spring Boot in the title', () => {
    // Given: ADR-001 の内容
    // When: タイトルに Spring Boot が含まれるか確認する
    // Then: Spring Boot がタイトルに記載されている
    assert.match(
      content,
      /^# .*Spring Boot/m,
      'タイトルに Spring Boot が含まれていません'
    )
  })

  it('should have status section with accepted status', () => {
    // Given: ADR-001 の内容
    // When: ステータスセクションを確認する
    // Then: 承認済みステータスが記載されている
    assert.match(
      content,
      /## ステータス/m,
      'ステータスセクションがありません'
    )
    assert.match(
      content,
      /承認済み|Accepted/i,
      'ステータスが「承認済み」になっていません'
    )
  })

  it('should have context section', () => {
    // Given: ADR-001 の内容
    // When: コンテキストセクションを確認する
    // Then: コンテキストセクションが存在する
    assert.match(
      content,
      /## コンテキスト/m,
      'コンテキストセクションがありません'
    )
  })

  it('should have decision section', () => {
    // Given: ADR-001 の内容
    // When: 決定セクションを確認する
    // Then: 決定セクションが存在する
    assert.match(
      content,
      /## 決定/m,
      '決定セクションがありません'
    )
  })

  it('should have alternatives section', () => {
    // Given: ADR-001 の内容
    // When: 代替案セクションを確認する
    // Then: 代替案が記載されている
    assert.match(
      content,
      /代替案|検討した選択肢/m,
      '代替案セクションがありません'
    )
  })

  it('should mention alternative frameworks', () => {
    // Given: ADR-001 の内容
    // When: 代替フレームワークへの言及を確認する
    // Then: 少なくとも1つの代替案が記載されている
    assert.match(
      content,
      /Quarkus|Micronaut|Jakarta EE/,
      '代替フレームワーク（Quarkus, Micronaut, Jakarta EE）のいずれも記載されていません'
    )
  })

  it('should have impact section', () => {
    // Given: ADR-001 の内容
    // When: 影響セクションを確認する
    // Then: 影響セクションが存在する
    assert.match(
      content,
      /## 影響/m,
      '影響セクションがありません'
    )
  })

  it('should not contain template placeholders', () => {
    // Given: ADR-001 の内容
    // When: テンプレートプレースホルダを検索する
    // Then: プレースホルダが残っていない
    assert.doesNotMatch(
      content,
      /この決定を行った状況|決定とその根拠|この決定による影響/,
      'テンプレートのプレースホルダテキストが残っています'
    )
  })

  it('should have a date', () => {
    // Given: ADR-001 の内容
    // When: 日付の記載を確認する
    // Then: 日付が記載されている
    assert.match(
      content,
      /日付:\s*\d{4}-\d{2}-\d{2}/m,
      '日付が記載されていません'
    )
  })
})

// ============================================================
// ADR-002: Thymeleaf SSR 採用
// ============================================================

describe('ADR-002: Thymeleaf SSR 採用', () => {
  let content

  before(() => {
    content = readAdr(ADR_002_PATH)
  })

  it('should have ADR-002 in the title', () => {
    // Given: ADR-002 の内容
    // When: タイトル行を確認する
    // Then: ADR-002 がタイトルに含まれる
    assert.match(
      content,
      /^# ADR-002/m,
      'タイトルに ADR-002 が含まれていません'
    )
  })

  it('should mention Thymeleaf or SSR in the title', () => {
    // Given: ADR-002 の内容
    // When: タイトルに Thymeleaf または SSR が含まれるか確認する
    // Then: Thymeleaf または SSR がタイトルに記載されている
    assert.match(
      content,
      /^# .*(?:Thymeleaf|SSR)/m,
      'タイトルに Thymeleaf または SSR が含まれていません'
    )
  })

  it('should have status section with accepted status', () => {
    // Given: ADR-002 の内容
    // When: ステータスを確認する
    // Then: 承認済みステータスである
    assert.match(content, /## ステータス/m)
    assert.match(content, /承認済み|Accepted/i)
  })

  it('should have context section', () => {
    // Given: ADR-002 の内容
    // When: コンテキストセクションを確認する
    // Then: コンテキストセクションが存在する
    assert.match(content, /## コンテキスト/m, 'コンテキストセクションがありません')
  })

  it('should have decision section', () => {
    // Given: ADR-002 の内容
    // When: 決定セクションを確認する
    // Then: 決定セクションが存在する
    assert.match(content, /## 決定/m, '決定セクションがありません')
  })

  it('should mention SPA as alternative', () => {
    // Given: ADR-002 の内容
    // When: SPA への言及を確認する
    // Then: SPA が代替案として記載されている
    assert.match(
      content,
      /SPA|React|Vue|Next\.js|Nuxt/,
      'SPA フレームワーク（React, Vue 等）が代替案として記載されていません'
    )
  })

  it('should have impact section', () => {
    // Given: ADR-002 の内容
    // When: 影響セクションを確認する
    // Then: 影響セクションが存在する
    assert.match(content, /## 影響/m, '影響セクションがありません')
  })

  it('should not contain template placeholders', () => {
    // Given: ADR-002 の内容
    // When: テンプレートプレースホルダを検索する
    // Then: プレースホルダが残っていない
    assert.doesNotMatch(
      content,
      /この決定を行った状況|決定とその根拠|この決定による影響/,
      'テンプレートのプレースホルダテキストが残っています'
    )
  })

  it('should have a date', () => {
    // Given: ADR-002 の内容
    // When: 日付の記載を確認する
    // Then: 日付が記載されている
    assert.match(content, /日付:\s*\d{4}-\d{2}-\d{2}/m, '日付が記載されていません')
  })
})

// ============================================================
// ADR-003: レイヤード3層アーキテクチャ採用
// ============================================================

describe('ADR-003: レイヤード3層アーキテクチャ採用', () => {
  let content

  before(() => {
    content = readAdr(ADR_003_PATH)
  })

  it('should have ADR-003 in the title', () => {
    // Given: ADR-003 の内容
    // When: タイトル行を確認する
    // Then: ADR-003 がタイトルに含まれる
    assert.match(
      content,
      /^# ADR-003/m,
      'タイトルに ADR-003 が含まれていません'
    )
  })

  it('should mention layered architecture in the title', () => {
    // Given: ADR-003 の内容
    // When: タイトルにレイヤードアーキテクチャが含まれるか確認する
    // Then: レイヤードアーキテクチャがタイトルに記載されている
    assert.match(
      content,
      /^# .*(?:レイヤード|3層|レイヤー)/m,
      'タイトルにレイヤードアーキテクチャが含まれていません'
    )
  })

  it('should have status section with accepted status', () => {
    // Given: ADR-003 の内容
    // When: ステータスを確認する
    // Then: 承認済みステータスである
    assert.match(content, /## ステータス/m)
    assert.match(content, /承認済み|Accepted/i)
  })

  it('should have context section', () => {
    // Given: ADR-003 の内容
    // When: コンテキストセクションを確認する
    // Then: コンテキストセクションが存在する
    assert.match(content, /## コンテキスト/m, 'コンテキストセクションがありません')
  })

  it('should have decision section', () => {
    // Given: ADR-003 の内容
    // When: 決定セクションを確認する
    // Then: 決定セクションが存在する
    assert.match(content, /## 決定/m, '決定セクションがありません')
  })

  it('should mention alternative architecture patterns', () => {
    // Given: ADR-003 の内容
    // When: 代替アーキテクチャパターンへの言及を確認する
    // Then: 少なくとも1つの代替案が記載されている
    assert.match(
      content,
      /ヘキサゴナル|クリーンアーキテクチャ|Vertical Slice|Clean Architecture/,
      '代替アーキテクチャパターン（ヘキサゴナル, クリーンアーキテクチャ, Vertical Slice）のいずれも記載されていません'
    )
  })

  it('should have impact section', () => {
    // Given: ADR-003 の内容
    // When: 影響セクションを確認する
    // Then: 影響セクションが存在する
    assert.match(content, /## 影響/m, '影響セクションがありません')
  })

  it('should not contain template placeholders', () => {
    // Given: ADR-003 の内容
    // When: テンプレートプレースホルダを検索する
    // Then: プレースホルダが残っていない
    assert.doesNotMatch(
      content,
      /この決定を行った状況|決定とその根拠|この決定による影響/,
      'テンプレートのプレースホルダテキストが残っています'
    )
  })

  it('should have a date', () => {
    // Given: ADR-003 の内容
    // When: 日付の記載を確認する
    // Then: 日付が記載されている
    assert.match(content, /日付:\s*\d{4}-\d{2}-\d{2}/m, '日付が記載されていません')
  })
})

// ============================================================
// ADR index.md のリンク確認
// ============================================================

describe('ADR 一覧（index.md）のリンク確認', () => {
  let content

  before(() => {
    content = readIndex()
  })

  it('should have a link to ADR-001', () => {
    // Given: ADR index.md の内容
    // When: ADR-001 へのリンクを確認する
    // Then: ADR-001 へのリンクが存在する
    assert.match(
      content,
      /\[.*ADR-001.*\]\(001-spring-boot-backend\.md\)|001-spring-boot-backend\.md/,
      'index.md に ADR-001 へのリンクがありません'
    )
  })

  it('should have a link to ADR-002', () => {
    // Given: ADR index.md の内容
    // When: ADR-002 へのリンクを確認する
    // Then: ADR-002 へのリンクが存在する
    assert.match(
      content,
      /\[.*ADR-002.*\]\(002-thymeleaf-ssr\.md\)|002-thymeleaf-ssr\.md/,
      'index.md に ADR-002 へのリンクがありません'
    )
  })

  it('should have a link to ADR-003', () => {
    // Given: ADR index.md の内容
    // When: ADR-003 へのリンクを確認する
    // Then: ADR-003 へのリンクが存在する
    assert.match(
      content,
      /\[.*ADR-003.*\]\(003-layered-architecture\.md\)|003-layered-architecture\.md/,
      'index.md に ADR-003 へのリンクがありません'
    )
  })

  it('should have at least 3 entries in the ADR table', () => {
    // Given: ADR index.md の内容
    // When: テーブル行数を確認する（ヘッダーとセパレーター除く）
    const tableLines = content.split('\n').filter(line =>
      line.startsWith('|') && !line.includes(':---') && !line.includes('ADR | 決定内容')
    )

    // Then: 少なくとも 3件の ADR エントリがある
    assert.ok(
      tableLines.length >= 3,
      `ADR テーブルのエントリが ${tableLines.length} 件しかありません（最低 3 件必要）`
    )
  })
})

// ============================================================
// mkdocs.yml の ADR nav 確認
// ============================================================

describe('mkdocs.yml の ADR nav 設定', () => {
  let content

  before(() => {
    content = readMkdocs()
  })

  it('should include ADR-001 in nav', () => {
    // Given: mkdocs.yml の内容
    // When: nav に ADR-001 があることを確認する
    // Then: ADR-001 が nav に含まれている
    assert.match(
      content,
      /adr\/001-spring-boot-backend\.md/,
      'mkdocs.yml の nav に ADR-001 が含まれていません'
    )
  })

  it('should include ADR-002 in nav', () => {
    // Given: mkdocs.yml の内容
    // When: nav に ADR-002 があることを確認する
    // Then: ADR-002 が nav に含まれている
    assert.match(
      content,
      /adr\/002-thymeleaf-ssr\.md/,
      'mkdocs.yml の nav に ADR-002 が含まれていません'
    )
  })

  it('should include ADR-003 in nav', () => {
    // Given: mkdocs.yml の内容
    // When: nav に ADR-003 があることを確認する
    // Then: ADR-003 が nav に含まれている
    assert.match(
      content,
      /adr\/003-layered-architecture\.md/,
      'mkdocs.yml の nav に ADR-003 が含まれていません'
    )
  })
})
