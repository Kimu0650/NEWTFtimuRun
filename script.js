const STORAGE_KEY = 'athlete_data';

// 事前登録する選手名リスト
const defaultAthletes = [
    "木村美海", "相方紫帆", "岩見琉音", "前田莉佐", "湯本真未",
    "崎本七海", "佐藤安里紗", "永瀬裕大", "和田卓英", "北川大喜",
    "木下裕翔", "中村香葉"
];

// 選手データを取得する関数
function getAthleteData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// 選手データを保存する関数
function saveAthleteData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 事前登録選手を追加する関数
function addDefaultAthletes() {
    const athleteData = getAthleteData();

    defaultAthletes.forEach((athleteName) => {
        if (!athleteData[athleteName]) {
            athleteData[athleteName] = [];
        }
    });

    saveAthleteData(athleteData);
}

// ページが読み込まれたときに事前登録選手を追加
window.onload = function() {
    addDefaultAthletes();  // 事前登録選手を追加
    populateAthleteSelect();  // 選手選択ボックスを更新
    displayTodayRecords();  // 今日の記録を表示
};

// 選手選択フォームの更新
function populateAthleteSelect() {
    const athleteData = getAthleteData();
    const athleteSelect = document.getElementById('athlete-select');
    athleteSelect.innerHTML = '';

    for (const name in athleteData) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        athleteSelect.appendChild(option);
    }
}

// 今日の記録を表示する関数
function displayTodayRecords() {
    const athleteData = getAthleteData();
    const today = new Date().toISOString().split('T')[0];  // 今日の日付 (YYYY-MM-DD)

    const todayRecords = [];

    // すべての選手の記録をチェックして、今日の記録を抽出
    for (const athleteName in athleteData) {
        const records = athleteData[athleteName];

        // 今日の記録をフィルタリング
        const todayRecord = records.filter(record => {
            return record.date && record.date.startsWith(today);
        });

        // 今日の記録があれば、リストに追加
        if (todayRecord.length > 0) {
            todayRecords.push({
                athleteName,
                records: todayRecord
            });
        }
    }

    const tbody = document.getElementById('today-records-body');
    tbody.innerHTML = '';  // 既存の内容をクリア

    todayRecords.forEach(record => {
        const row = document.createElement('tr');
        record.records.forEach(r => {
            row.innerHTML += `
                <td>${record.athleteName}</td>
                <td>${r.distance}</td>
                <td>${r.times[0]}</td>
                <td>${r.times[1]}</td>
                <td>${r.times[2]}</td>
            `;
            tbody.appendChild(row);
        });
    });
}

// 選手名が選択されたときに専用ページに飛ぶ
document.getElementById('athlete-select').addEventListener('change', function() {
    const selectedAthlete = this.value;
    if (selectedAthlete) {
        window.location.href = `athletePage.html?name=${selectedAthlete}`;
    }
});

// 記録を保存する処理
document.getElementById('save-record').addEventListener('click', () => {
    const distance = document.getElementById('distance-input').value;
    const time1 = parseFloat(document.getElementById('time1-input').value);
    const time2 = parseFloat(document.getElementById('time2-input').value);
    const time3 = parseFloat(document.getElementById('time3-input').value);
    const athleteName = document.getElementById('athlete-select').value; // 選択した選手名

    if (!distance || !time1 || !time2 || !time3 || !athleteName) {
        alert('すべてのフィールドを入力してください。');
        return;
    }

    const athleteData = getAthleteData();
    const date = new Date().toISOString().split('T')[0];  // 今日の日付

    if (!athleteData[athleteName]) {
        athleteData[athleteName] = [];
    }

    athleteData[athleteName].push({
        distance: distance,
        times: [time1, time2, time3],
        date: date  // 記録に日付を追加
    });

    saveAthleteData(athleteData);
    alert('記録が保存されました。');
    displayTodayRecords(); // 今日の記録を再表示
});

