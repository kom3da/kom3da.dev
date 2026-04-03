# 要件定義 — kom3da.dev

## 概要

Ryuichi Komeda のプロフィールサイト。AI最適化を重視した設計。

## 技術スタック

| 項目 | 選定 | 備考 |
|------|------|------|
| ビルドツール | Vite 8 | |
| フレームワーク | React 19 | SSR/SSG対応 |
| ホスティング | Cloudflare Workers | エッジ配信 |
| 言語 | TypeScript | strict mode |
| レンダリング | SSG + ISR | ビルド時に静的HTML生成、Workers上でキャッシュ配信 |

## デザイン

- **テイスト**: ターミナル風（表示型）
  - ターミナルウィンドウのような外観
  - プロンプト風のセクションヘッダー（`> About`, `> Skills`）
  - プログレスバーでスキルレベルを表示
- **テーマ**: ダーク/ライト切り替え可能
- **レスポンシブ**: モバイル対応

## コンテンツ

### About セクション
- 名前
- 肩書き / 役職
- 自己紹介文

### Skills セクション
- 技術スキル一覧
- プログレスバーによるレベル可視化
- 各スキルに `id` 属性付与（例: `id="skill-react"`）

## AI最適化要件

### 1. llms.txt / llms-full.txt
- `/llms.txt`: サイト概要と主要リンク（目次）
- `/llms-full.txt`: 全コンテンツを結合したマークダウン
- Workers上で動的生成

### 2. JSON-LD 構造化データ
- `Person` スキーマ: name, jobTitle, url, sameAs（SNSリンク）
- HTMLの `<head>` 内に `<script type="application/ld+json">` として埋め込み

### 3. セマンティックHTML
- `<article>`, `<section>`, `<nav>` を正しく使用
- 各セクションに Fragment Identifier（`id`属性）を付与
- AIが特定箇所へ直接リンクできるようにする

### 4. Web Vitals 最適化
- SSGによる高速初期表示
- 最小限のクライアントサイドJS
- LCP最適化

## スコープ外（将来拡張）

- ブログ機能
- セマンティック検索（Vector Search / Cloudflare Vectorize）
- ポートフォリオ（制作物一覧）
