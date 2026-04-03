# kom3da.dev

Ryuichi Komeda（米田 龍一）のプロフィールサイト。

## 技術スタック

- **ビルド**: Vite 8
- **UI**: React 19 + TypeScript
- **ホスティング**: Cloudflare Workers（SSR + Cache API）
- **スタイル**: CSS（フレームワーク不使用）
- **CI/CD**: GitHub Actions → 自動ビルド・デプロイ・キャッシュパージ
- **Analytics**: Cloudflare Web Analytics + GA4

## プロジェクト構成

```
├── profile.json          # プロフィールデータ（編集はここだけ）
├── index.html            # HTMLテンプレート
├── vite.config.ts
├── wrangler.jsonc        # Cloudflare Workers 設定
├── public/
│   ├── favicon.svg       # SVG favicon
│   ├── apple-touch-icon.png  # iPhone ホーム画面用
│   ├── icon-192.png      # Android PWA アイコン
│   ├── icon-512.png      # Android PWA アイコン（大）
│   ├── og-image.png      # OGP 画像
│   ├── manifest.json     # Web App Manifest
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── types.ts          # 型定義（Profile, Skill）
│   ├── App.tsx           # メインアプリ
│   ├── entry-client.tsx  # クライアントハイドレーション
│   ├── entry-server.tsx  # SSR レンダリング関数
│   ├── worker.tsx        # Cloudflare Worker エントリ
│   ├── components/       # React コンポーネント
│   │   ├── About.tsx     # 自己紹介 + リンク（SVGアイコン付き）
│   │   ├── Skills.tsx    # スキルタグ一覧
│   │   ├── Neofetch.tsx  # neofetch風の技術スタック表示
│   │   ├── Terminal.tsx  # ターミナルウィンドウUI
│   │   └── ThemeToggle.tsx  # ダーク/ライト切り替え
│   ├── lib/
│   │   ├── jsonld.ts     # JSON-LD 生成（ProfilePage + Person + WebSite）
│   │   └── llms.ts       # llms.txt / llms-full.txt 生成
│   └── styles/
│       └── global.css    # テーマ対応CSS
└── .github/workflows/
    └── deploy.yml        # 自動デプロイ + キャッシュパージ
```

## デザイン方針

- ターミナル風UI（表示型）：ターミナルウィンドウの見た目でコンテンツを表示
- ダーク/ライトモード切り替え対応（OS設定に連動、手動切替も可）
- セマンティックHTML（`<article>`, `<section>`, `<nav>`）を正しく使用

## SEO / AI 最適化

- `/llms.txt` `/llms-full.txt` — AIエージェント向けマークダウン配信
- JSON-LD（`@graph`: ProfilePage + Person + WebSite）— 構造化データ
- セマンティックHTML + Fragment Identifiers — RAG最適化
- `robots.txt` + `sitemap.xml` + canonical URL
- OGP / Twitter Card（og-image.png）
- meta description にプロフィール全文

## アクセシビリティ

- WCAG AA コントラスト比準拠
- Skip-to-content リンク（キーボードナビゲーション）
- ARIA ラベル（セクション、ナビゲーション、プログレスバー）
- `prefers-reduced-motion` 対応（アニメーション無効化）
- `prefers-color-scheme` 対応（OS テーマ連動）

## セキュリティ

- HTTPS（Cloudflare）
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## モバイル対応

- レスポンシブデザイン（480px ブレークポイント）
- apple-touch-icon（iPhone ホーム画面）
- Web App Manifest + PWA アイコン（Android）
- theme-color（アドレスバー色）

## 開発コマンド

```bash
npm run dev        # 開発サーバー起動（wrangler state 自動クリア）
npm run build      # プロダクションビルド
npm run preview    # ビルド結果プレビュー
npm run deploy     # Cloudflare Workers へ手動デプロイ
```

## コーディング規約

- 言語: TypeScript strict mode
- コンポーネント: 関数コンポーネント + hooks
- CSS: CSS変数でテーマ管理（`--terminal-bg`, `--text` 等）
- プロフィールデータは `profile.json` に集約。コンポーネントにハードコードしない
- Worker では `run_worker_first: true` を使用。配列パターンはアセット MIME type が壊れるため不可
- llms.txt ルートは静的アセットチェックの前に配置（.txt 拡張子のため）
