import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * 主にシングルテーブル設計の際に使用されるテーブル名。
 *
 * シングルテーブル設計の場合、テーブル名の環境変数が設定されていない場合はエラーを吐く。（開発環境のみデフォルト値として Development テーブルが使用される）\
 * マルチテーブル設計の場合は、テーブル名の環境変数が設定されていない場合は空文字を返す。
 */
const tableName = (() => {
  const tableName = process.env.DB_TABLE_NAME;

  if (tableName) {
    return tableName;
  }

  // 開発環境の場合、DB_TABLE_NAME が設定されていない場合はデフォルト値として Development テーブルを使用する
  if (process.env.IS_OFFLINE === 'true') {
    return 'Development';
  }

  // シングルテーブル設計の場合はテーブル名を必須にする
  if (process.env.IS_MULTI_TABLE !== 'true') {
    throw new Error('Please set the environment variables: DB_TABLE_NAME');
  }

  return '';
})();

/**
 * DynamoDB に対する追加・取得・更新・削除などの操作を実行するためのクライアント。
 */
const client = (() => {
  // 本番環境の場合は AWS の DynamoDB に接続
  if (process.env.IS_OFFLINE !== 'true') {
    return new DynamoDBClient({});
  }

  // Remote 接続するかどうか
  const isRemoteDB = process.env.IS_REMOTE_DB === 'true';
  if (isRemoteDB) {
    const region = process.env.DB_REGION;
    if (!region) {
      throw new Error('Please set the environment variables: DB_REGION');
    }

    const accessKeyId = process.env.DB_ACCESS_KEY_ID;
    if (!accessKeyId) {
      throw new Error('Please set the environment variables: DB_ACCESS_KEY_ID');
    }

    const secretAccessKey = process.env.DB_SECRET_ACCESS_KEY;
    if (!secretAccessKey) {
      throw new Error(
        'Please set the environment variables: DB_SECRET_ACCESS_KEY'
      );
    }

    return new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  console.info('[INFO] Connecting to Local DynamoDB.');
  return new DynamoDBClient({
    region: 'localhost',
    endpoint: `http://localhost:${process.env.DB_PORT || 8000}`,
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local',
    },
  });
})();

/**
 * DynamoDB に対する追加・取得・更新・削除などの操作を実行するためのクライアント。
 *
 * 内部で client をラップしており、アイテムの自動マッピングや変換を行うので、より直感的にデータ操作ができる。
 */
const document = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

/**
 * Entity の定義。
 *
 * アイテムを種別を分けた保存・検索する際に使用する。
 */
const entity = {
  message: 'Message',
};

export default {
  client,
  document,
  tableName,
  entity,
};
