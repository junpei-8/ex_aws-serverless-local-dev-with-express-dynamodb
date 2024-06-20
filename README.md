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

#### Remote DB に接続する

環境変数を設定することで、リモートの DynamoDB に接続することができます。

```sh
IS_REMOTE_DB=true
DB_REGION=ap-northeast-1
DB_TABLE_NAME=RemoteDBTableName
DB_ACCESS_KEY_ID=xxx
DB_SECRET_ACCESS_KEY=xxx
```

```sh
npm run dev
```

<br />

## 🪧 デモ

---

### Message の一覧取得

```sh
curl http://localhost:3000/messages
```

＊ ブラウザで http://localhost:3000/messages を開いても確認できます

<br />

### Message の追加

```sh
curl -X POST http://localhost:2400/messages \
     -H "Content-Type: application/json" \
     -d '{"content": "🚀 Hello World"}'
```
