// 記録データを格納するための配列
let records = [];

// 事前登録の選手名
const predefinedAthletes = [
    '木村美海', '相方紫帆', '岩見琉音', '前田莉佐', 
    '湯本真未', '崎本七海', '佐藤安里紗', '永瀬裕大', 
    '和田卓英', '北川大喜', '木下裕翔', '中村香葉'
];

// ページ読み込み時にローカルストレージから記録を読み込む
function loadRecordsFromStorage() {
    const storedRecords = localStorage.getItem('records');
    if (storedRecords) {
        records = JSON.parse(storedRecords);  // 保存されている記録をパースして配列に戻す
    } else {
        // ローカルストレージに記録がない場合は、事前登録選手をデフォルトとして設定
        predefinedAthletes.forEach(name => {
            records.push({
                playerId: records.length + 1,
                name: name,
                event: '',
                distance: '',
                records: [],
                count: 1
            });
        });
    }
}

// 記録をローカルストレージに保存する
function saveRecordsToStorage() {
    localStorage.setItem('records', JSON.stringify(records));  // records 配列を JSON 文字列として保存
}

// 記録テーブルを再描画する関数
function renderTable() {
    const tbody = document.getElementById('record-table-body');
    tbody.innerHTML = ''; // 既存のテーブル行をクリア

    records.forEach((record, index) => {
        const tr = document.createElement('tr');
        
        // 選手名
        tr.innerHTML += `<td>${record.name}</td>`;
        
        // 種目
        tr.innerHTML += `<td><input type="text" value="${record.event}" onchange="updateRecordField(${index}, 'event', this.value)" placeholder="種目名"></td>`;
        
        // 距離
        tr.innerHTML += `<td><input type="text" value="${record.distance}" onchange="updateRecordField(${index}, 'distance', this.value)" placeholder="距離"></td>`;
        
        // 記録入力（本数に応じた入力フィールド）
        let recordInputs = '';
        for (let i = 0; i < record.count; i++) {
            recordInputs += `<input type="text" value="${record.records[i] || ''}" onchange="updateRecordField(${index}, 'records', this.value, ${i})" 
placeholder="タイム・記録 ${i+1}">`;
        }
        tr.innerHTML += `<td>${recordInputs}</td>`;
        
        // 本数入力と変更
        tr.innerHTML += `<td><input type="number" value="${record.count}" onchange="updateRecordField(${index}, 'count', this.value)"></td>`;
        
        // 操作ボタン（新しい距離の記録を追加する）
        tr.innerHTML += `<td><button onclick="addRecordForPlayer(${index})">新しい距離の記録を追加</button></td>`;

        tbody.appendChild(tr);
    });
}

// 記録フィールドを更新する関数
function updateRecordField(playerIndex, field, value, recordIndex = null) {
    if (field === 'count') {
        // 本数を変更した場合、入力フィールドの数を調整
        records[playerIndex].count = parseInt(value);
        records[playerIndex].records.length = parseInt(value);
    } else if (field === 'records' && recordIndex !== null) {
        // 特定の記録フィールドを更新
        records[playerIndex].records[recordIndex] = value;
    } else {
        // その他のフィールド（選手名や種目、距離）
        records[playerIndex][field] = value;
    }
    saveRecordsToStorage();  // 更新後にローカルストレージに保存
    renderTable();
}

// 新しい距離の記録を追加する関数
function addRecordForPlayer(playerIndex) {
    records[playerIndex].count++;
    records[playerIndex].records.push('');
    saveRecordsToStorage();  // 追加後にローカルストレージに保存
    renderTable();
}

// ページ読み込み時に記録をロードし、テーブルを描画
loadRecordsFromStorage();
renderTable();

