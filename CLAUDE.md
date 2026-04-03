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
│   └── favicon.svg
├── src/
│   ├── types.ts          # 型定義（Profile, Skill）
│   ├── App.tsx           # メインアプリ
│   ├── entry-client.tsx  # クライアントハイドレーション
│   ├── entry-server.tsx  # SSR レンダリング関数
│   ├── worker.tsx        # Cloudflare Worker エントリ
│   ├── components/       # React コンポーネント
│   ├── lib/              # ユーティリティ（llms.txt, JSON-LD生成）
│   └── styles/           # グローバルCSS
└── .github/workflows/
    └── deploy.yml        # 自動デプロイ
```

## デザイン方針

- ターミナル風UI（表示型）：ターミナルウィンドウの見た目でコンテンツを表示
- ダーク/ライトモード切り替え対応
- セマンティックHTML（`<article>`, `<section>`, `<nav>`）を正しく使用

## AI最適化

- `/llms.txt` `/llms-full.txt` — AIエージェント向けマークダウン配信
- JSON-LD（Person スキーマ）— 構造化データ埋め込み
- セマンティックHTML + Fragment Identifiers — RAG最適化

## 開発コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run preview    # ビルド結果プレビュー
npm run deploy     # Cloudflare Workers へ手動デプロイ
```

## コーディング規約

- 言語: TypeScript strict mode
- コンポーネント: 関数コンポーネント + hooks
- CSS: CSS変数でテーマ管理（`--terminal-bg`, `--terminal-text` 等）
- プロフィールデータは `profile.json` に集約。コンポーネントにハードコードしない
- Worker では `run_worker_first: true` を使用。配列パターンはアセット MIME type が壊れるため不可
