import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { createId } from '@paralleldrive/cuid2';
import serverlessExpress from '@vendia/serverless-express';
import bodyParser from 'body-parser';
import express from 'express';
import db from './db';

const app = express();
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/**
 * ヘルスチェック
 */
router.get('/', (_req, res, _next) => {
  return res.status(200).json({ message: 'Health Check' });
});

/**
 * メッセージ Entity を全て取得する。
 */
router.get('/messages', async (_, res) => {
  try {
    // アイテムを取得
    const items = await db.document.send(
      new ScanCommand({
        TableName: db.tableName,
        ExpressionAttributeNames: {
          '#entity': 'Entity',
        },
        ExpressionAttributeValues: {
          ':entry': { S: db.entity.message },
        },
        FilterExpression: '#entity = :entry',
      })
    );

    return res
      .status(200)
      .json(items.Items?.map((item) => unmarshall(item)) || []);

    // ↓ エラー時の処理
  } catch (error) {
    console.error('Could not get items from Hello Items\n', error);
    return res.status(500).json(error);
  }
});

/**
 * メッセージ Entity をテーブルに追加する。
 */
router.post('/messages', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json(
          new Error(`The 'content' field is required in the request body.`)
        );
    }

    // ID 生成
    const id = createId();

    // 追加
    await db.document.send(
      new PutCommand({
        TableName: db.tableName,
        Item: {
          Id: id,
          Entity: db.entity.message,
          Content: content,
          CreatedAt: new Date().toISOString(),
        },
      })
    );

    return res.status(200).json({ Id: id });

    // ↓ エラー時の処理
  } catch (error) {
    console.error('Could not create items from Hello Items\n', error);
    return res.status(500).json(error);
  }
});

/**
 * ルートがどれにもマッチしない場合のエラーハンドリング
 */
router.use((_req, res, _next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

app.use('/', router);

export const handler = serverlessExpress({ app });
