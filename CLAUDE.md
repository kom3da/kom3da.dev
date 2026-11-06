# kom3da.dev

Ryuichi Komeda（米田 龍一）のプロフィールサイト。

## 技術スタック

- **フレームワーク**: Astro 7（静的出力、クライアント JS は小さな `site.ts` のみ）
- **スタイル**: Tailwind CSS 4（`@theme` でデザイントークン管理）
- **フォント**: JetBrains Mono（`@fontsource-variable` でセルフホスト）+ 日本語はシステムフォント
- **ホスティング**: Cloudflare Workers（Static Assets + 薄い Worker）
- **ツール**: mise（Node / pnpm）、pnpm、Biome、Vitest、Playwright + axe、lefthook、Renovate
- **CI/CD**: GitHub Actions（PR と main で検査 → main のみデプロイ + キャッシュパージ）
- **Analytics**: Cloudflare Web Analytics + GA4

## プロジェクト構成

```
├── profile.json            # プロフィールデータ（編集はここだけ）
├── astro.config.mjs
├── wrangler.jsonc          # Worker + Static Assets 設定
├── public/                 # favicon, PWA アイコン, OG 画像, manifest, robots.txt
├── src/
│   ├── pages/
│   │   ├── index.astro     # トップページ
│   │   ├── 404.astro       # 404（noindex）
│   │   ├── llms.txt.ts     # /llms.txt（ビルド時生成）
│   │   ├── llms-full.txt.ts
│   │   └── sitemap.xml.ts
│   ├── layouts/Base.astro  # <head>（meta, OGP, JSON-LD, GA4）
│   ├── components/         # Header, Hero, Ticker, Links, Skills, Footer, StatusBar ...
│   ├── lib/                # profile 型, JSON-LD / llms.txt 生成（+ Vitest）
│   ├── scripts/site.ts     # スクロール連動アニメ, ステータスバーの scroll-spy, motion トグル
│   └── styles/global.css   # Tailwind + トークン + アニメーション
├── worker/index.ts         # www リダイレクト, markdown ネゴシエーション, セキュリティヘッダー
├── e2e/site.spec.ts        # Playwright（ルート, ヘッダー, a11y, モバイル横スクロール）
└── .github/workflows/deploy.yml
```

## デザイン方針

- tmux 風ターミナル UI：特大プロンプト `$ kom3da` + スキルのティッカー + ペイン分割 + 下部固定のステータスバー
- **ダーク固定**（OS 連動・ライトモードなし）、アクセントは Acid Lime `#C6F432`
- 動き：ヒーローは読み込み時、ペインはスクロールで表示されてから開始。ループするもの（ティッカー・ペインの光）は `motion` ボタンで停止可
- セマンティック HTML（h1 は名前、`<nav>` / `<section>`、Fragment ID `#about` `#links` `#skills` `#skill-*`）

## SEO / AI 最適化

- `/llms.txt` `/llms-full.txt` — AI エージェント向けマークダウン
- `Accept: text/markdown` で `/` にアクセスすると llms-full.txt を返す（Worker）
- `Link` ヘッダーで llms.txt / sitemap を通知
- JSON-LD（`@graph`: ProfilePage + Person + WebSite）
- robots.txt + sitemap.xml + canonical URL + OGP / Twitter Card

## アクセシビリティ

- WCAG AA コントラスト（axe を E2E で検査）
- Skip-to-content リンク
- `prefers-reduced-motion` 対応、ループアニメの停止ボタン（WCAG 2.2.2）
- JS 無効時も全コンテンツ表示（アニメの初期非表示は `.js` クラスで制御）

## セキュリティ（Worker で付与）

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## 開発コマンド

```bash
pnpm dev         # Astro 開発サーバー（:4321）
pnpm build       # 静的ビルド（dist/）
pnpm preview     # ビルド → wrangler dev（Worker 込みで確認、:8787）
pnpm check       # Biome + astro check + worker tsc + Vitest
pnpm test:e2e    # Playwright（wrangler dev を自動起動。事前に pnpm build）
pnpm cf-typegen  # wrangler.jsonc 変更後に Worker の型を再生成
```

## Claude Code スラッシュコマンド

- `/dev` — 開発サーバーを起動し、ルートページの応答を確認
- `/check` — check → build → E2E → 本番サイトの疎通確認
- `/deploy` — check / build → コミット → `main` へ push（CI/CD で自動デプロイ）

## コーディング規約

- 言語: TypeScript strict
- プロフィールデータは `profile.json` に集約。コンポーネントにハードコードしない
- 色・フォントは `global.css` の `@theme` トークン（`text-lime`, `border-line` 等）を使う
- Astro 7 のコンパイラは要素間の改行の空白を詰めるので、空白が必要な箇所は `{" "}` を明示する
- Worker は `run_worker_first: true` で全リクエストを受け、静的ファイルは `env.ASSETS.fetch` に渡す（配列パターンはアセットの MIME type が壊れるため不可）
- 404 はアセットの `not_found_handling: "404-page"` に任せる
- Biome は `.astro` のテンプレートを解析しないため、`.astro` では未使用変数/インポートのルールを無効化している
