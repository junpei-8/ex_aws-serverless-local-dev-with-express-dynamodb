# AWS Serverless Example with Express + DynamoDB in Local

## 🍀 必須環境

- [Node 22.x >= 20.14.x](https://nodejs.org/en/download/package-manager)

<br />

## 🎱 開発

---

### 準備

1. 依存関係のインストール

```sh
npm install
```

2. Local DynamoDB のインストール

```sh
npm run db:install
```

<br />

### 開発サーバーの起動

```bash
npm run dev
```

<br />

### Remote DB に接続して開発サーバーを起動

`.env` を作成し環境変数を設定することで、リモートの DynamoDB に接続することができます。

1. 環境変数を設定する

   ```sh
   DB_REGION=
   DB_TABLE_NAME=
   DB_ACCESS_KEY_ID=
   DB_SECRET_ACCESS_KEY=
   ```

   ※ `DB_ACCESS_KEY_ID` と `DB_SECRET_ACCESS_KEY` は、AWS の IAM にて作成できるアクセスキーを設定してください。\
   また、作成したアクセスキーを持つユーザーには、DynamoDB の読み書き権限を付与してください。

2. リモート接続コマンドを実行する

   ```sh
   npm run dev:remote
   ```

<br />

## 🪧 デモ

---

### Message の一覧取得

```sh
curl http://localhost:2400/messages
```

＊ ブラウザで http://localhost:2400/messages を開いても確認できます

<br />

### Message の追加

```sh
curl -X POST http://localhost:2400/messages \
     -H "Content-Type: application/json" \
     -d '{"content": "🚀 Hello World"}'
```
