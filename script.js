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

    // 選手記録ページリンクを生成
    const athleteLinksList = document.getElementById('athlete-links-list');
    athleteLinksList.innerHTML = '';
    for (const name in athleteData) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="athletePage.html?name=${name}">${name}の記録</a>`;
        athleteLinksList.appendChild(listItem);
    }
}

// ページが読み込まれたときに事前登録選手を追加
window.onload = function() {
    addDefaultAthletes();  // 事前登録選手を追加
    populateAthleteSelect();  // 選手選択ボックスを更新
};

// 記録を保存する処理
document.getElementById('save-record').addEventListener('click', () => {
    const distance = document.getElementById('distance-input').value;
    const timeInputs = document.querySelectorAll('.time-input');
    const athleteName = document.getElementById('athlete-select').value;

    if (!distance || !athleteName || timeInputs.length === 0) {
        alert('すべてのフィールドを入力してください。');
        return;
    }

    const times = [];
    timeInputs.forEach(input => {
        const time = parseFloat(input.value);
        if (isNaN(time)) {
            alert('タイムに正しい値を入力してください。');
            return;
        }
        times.push(time);
    });

    const athleteData = getAthleteData();
    const date = new Date().toISOString().split('T')[0];  // 今日の日付

    if (!athleteData[athleteName]) {
        athleteData[athleteName] = [];
    }

    athleteData[athleteName].push({
        distance: distance,
        times: times,
        date: date
    });

    saveAthleteData(athleteData);
    alert('記録が保存されました。');
});

// タイム入力欄を動的に追加する処理
document.getElementById('add-time-input').addEventListener('click', () => {
    const timeInputsDiv = document.getElementById('time-inputs');
    const newTimeInput = document.createElement('div');
    newTimeInput.innerHTML = `
        <label for="time-input">タイム (秒):</label>
        <input type="number" class="time-input" step="0.01" required>
    `;
    timeInputsDiv.appendChild(newTimeInput);
});

