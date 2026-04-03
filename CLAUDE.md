# kom3da.dev

Ryuichi Komeda のプロフィールサイト。

## 技術スタック

- **ビルド**: Vite 8
- **UI**: React 19 + TypeScript
- **ホスティング**: Cloudflare Workers（SSG + ISR）
- **スタイル**: CSS（フレームワーク不使用）

## アーキテクチャ

```
src/
├── components/    # React コンポーネント
├── data/          # プロフィールデータ（profile.ts）
├── lib/           # ユーティリティ（llms.txt生成, JSON-LD生成）
├── styles/        # グローバルCSS
├── App.tsx        # メインアプリ
├── entry-client.tsx  # クライアントハイドレーション
├── entry-server.tsx  # SSR レンダリング関数
└── worker.ts      # Cloudflare Worker エントリ
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
npm run deploy     # Cloudflare Workers へデプロイ
```

## コーディング規約

- 言語: TypeScript strict mode
- コンポーネント: 関数コンポーネント + hooks
- CSS: CSS変数でテーマ管理（`--terminal-bg`, `--terminal-text` 等）
- プロフィールデータは `src/data/profile.ts` に集約。コンポーネントにハードコードしない
