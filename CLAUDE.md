# kom3da.dev

Ryuichi Komeda（米田 龍一）のプロフィールサイト。

## 技術スタック

- **ビルド**: Vite+（Vite 8 / Vitest / Oxlint / Oxfmt / tsgolint を `vp` で一括）
- **ページ生成**: ビルド時に `profile.json` から HTML を生成する自前の Vite プラグイン（`src/build/site-plugin.ts`）
- **スタイル**: Tailwind CSS 4（`@theme` でデザイントークン管理）
- **フォント**: JetBrains Mono（`@fontsource-variable` でセルフホスト）+ 日本語はシステムフォント
- **ホスティング**: Cloudflare Workers（Static Assets + 薄い Worker）、`cf` CLI + `@cloudflare/vite-plugin`
- **その他**: mise（Node / pnpm）、pnpm、Playwright + axe、Renovate
- **CI/CD**: GitHub Actions（PR と main で検査 → main のみ `cf deploy`）
- **Analytics**: Cloudflare Web Analytics + GA4

`cf`、`@cloudflare/vite-plugin` 2.x はベータ版。挙動が変わったら公式ドキュメント（`cf docs search`）を優先して確認する。

## プロジェクト構成

```
├── profile.json              # プロフィールデータ（編集はここだけ）
├── index.html / 404.html     # HTML の骨組み（<!--head--> <!--body--> をビルド時に置換）
├── vite.config.ts            # Vite + Vite+（lint / fmt / staged）設定
├── cloudflare.config.ts      # Worker 設定（cf）
├── public/                   # favicon, PWA アイコン, OG 画像, manifest, robots.txt
├── src/
│   ├── build/site-plugin.ts  # HTML 生成 + llms.txt / llms-full.txt / sitemap.xml 出力
│   ├── templates/            # ページ・コンポーネント（エスケープ付き html`` テンプレート）
│   ├── lib/                  # html エスケープ, profile 型, JSON-LD / llms / sitemap 生成（+ テスト）
│   ├── scripts/site.ts       # スクロール連動アニメ, ステータスバーの scroll-spy, motion トグル
│   └── styles/global.css     # Tailwind + トークン + アニメーション
├── worker/index.ts           # www リダイレクト, markdown ネゴシエーション, セキュリティヘッダー
├── e2e/site.spec.ts          # Playwright（ルート, ヘッダー, a11y, モバイル横スクロール）
└── .github/workflows/deploy.yml
```

## デザイン方針

- tmux 風ターミナル UI：特大プロンプト `$ kom3da` + スキルのティッカー + ペイン分割 + 下部固定のステータスバー
- **ダーク固定**（OS 連動・ライトモードなし）、アクセントは Acid Lime `#C6F432`
- 動き：ヒーローは読み込み時、ペインはスクロールで表示されてから開始。ループするもの（ティッカー・ペインの光）は `motion` ボタンで停止可
- セマンティック HTML（h1 は名前、`<nav>` / `<section>`、Fragment ID `#about` `#links` `#skills` `#skill-*`）

## SEO / AI 最適化

- `/llms.txt` `/llms-full.txt` — AI エージェント向けマークダウン（ビルド時生成）
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
pnpm dev         # cf dev（Vite + workerd、:4321）
pnpm build       # cf build（.cloudflare/output に Build Output）
pnpm preview     # build → vp preview（Worker 込みで確認）
pnpm check       # cf workers types → vp check（fmt + lint + 型）→ vp test
pnpm format      # vp check --fix
pnpm test:e2e    # Playwright（ローカルは build → vp preview を自動起動。CI はビルド済み出力を使う）
pnpm run deploy  # cf deploy --prebuilt（通常は CI から。`pnpm deploy` は pnpm 組み込みと衝突）
```

## Claude Code スラッシュコマンド

- `/dev` — 開発サーバーを起動し、ルートページの応答を確認
- `/check` — check → build → E2E → 本番サイトの疎通確認
- `/deploy` — check / build → コミット → `main` へ push（CI/CD で自動デプロイ）

## コーディング規約

- 言語: TypeScript strict（`noUncheckedIndexedAccess` 有効）
- プロフィールデータは `profile.json` に集約。テンプレートにハードコードしない
- HTML は必ず `src/lib/html.ts` の `html` タグ付きテンプレートで組み立てる（値は自動エスケープ。生 HTML は `raw()` を明示）
- 色・フォントは `global.css` の `@theme` トークン（`text-lime`, `border-line` 等）を使う
- Oxfmt の `embeddedLanguageFormatting` は `off`（`html` テンプレート内の文字列を整形で変えないため）
- Worker は `runWorkerFirst: true` で全リクエストを受け、静的ファイルは `env.ASSETS.fetch` に渡す
- 404 はアセットの `notFoundHandling: "404-page"` に任せる
- Worker の型は `cf workers types` が生成する `.cloudflare/types`（`worker/tsconfig.json` から参照）
- pre-commit は Vite+ の `vp staged`（`.vite-hooks/pre-commit`）。`pnpm install` 時に `vp config` でフックを有効化
