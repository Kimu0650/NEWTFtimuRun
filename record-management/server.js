// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// MongoDB接続
mongoose.connect('mongodb://localhost:27017/record-management', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 3000;

// CORSを許可
app.use(cors());

// JSONリクエストボディを解析
app.use(bodyParser.json());

// モデルの定義
const recordSchema = new mongoose.Schema({
    date: String,
    name: String,
    event: String,
    distance: String,
    time: String,
});

const Record = mongoose.model('Record', recordSchema);

// 記録の取得
app.get('/api/records/:date', async (req, res) => {
    try {
        const records = await Record.find({ date: req.params.date });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'データの取得に失敗しました' });
    }
});

// 記録の保存
app.post('/api/records/:date', async (req, res) => {
    const { name, event, distance, time } = req.body;
    const newRecord = new Record({
        date: req.params.date,
        name,
        event,
        distance,
        time,
    });

    try {
        await newRecord.save();
        res.status(201).json({ message: '記録が保存されました' });
    } catch (error) {
        res.status(500).json({ error: '記録の保存に失敗しました' });
    }
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

