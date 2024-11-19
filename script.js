const STORAGE_KEY = 'athlete_data';

// 事前登録選手リスト
const defaultAthletes = [
    "相方紫帆", 
    "岩見琉音", 
    "前田莉佐", 
    "湯本真未", 
    "崎本七海", 
    "佐藤安里紗", 
    "永瀬裕大", 
    "和田卓英", 
    "北川大喜", 
    "木下裕翔", 
    "中村香葉"
];

// 選手データを取得する関数
function getAthleteData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// 選手データを保存する関数
function saveAthleteData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 選手登録フォームの処理
document.getElementById('register-athlete-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const newAthleteName = document.getElementById('new-athlete-name').value.trim();
    const athleteData = getAthleteData();

    if (newAthleteName && !athleteData[newAthleteName]) {
        athleteData[newAthleteName] = [];
        saveAthleteData(athleteData);
        alert(`選手 "${newAthleteName}" を登録しました！`);
        document.getElementById('new-athlete-name').value = '';
        populateAthleteSelect();
    } else {
        alert('この選手はすでに登録されています！');
    }
});

// 選手セレクトボックスを更新する関数
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

// 選手追加ボタンの処理
document.getElementById('add-selected-athletes').addEventListener('click', function () {
    const selectedAthletes = Array.from(document.getElementById('athlete-select').selectedOptions);
    const tableBody = document.getElementById('record-table-body');

    selectedAthletes.forEach((athlete) => {
        if (!document.querySelector(`tr[data-athlete="${athlete.value}"]`)) {
            const row = document.createElement('tr');
            row.setAttribute('data-athlete', athlete.value);
            row.innerHTML = `
                <td>${athlete.value}</td>
                <td><input type="number" step="0.1" class="distance-input"></td>
                <td><input type="number" step="0.01" class="time-input"></td>
                <td><button class="save-record">記録を保存</button></td>
            `;
            tableBody.appendChild(row);
        }
    });
});

// 記録保存ボタンの処理
document.getElementById('record-table-body').addEventListener('click', function (e) {
    if (e.target.classList.contains('save-record')) {
        const row = e.target.closest('tr');
        const athleteName = row.getAttribute('data-athlete');
        const distance = parseFloat(row.querySelector('.distance-input').value);
        const time = parseFloat(row.querySelector('.time-input').value);

        if (!distance || !time) {
            alert('距離とタイムを正しく入力してください。');
            return;
        }

        const athleteData = getAthleteData();
        athleteData[athleteName].push({ distance, time, date: new Date().toISOString() });
        saveAthleteData(athleteData);

        alert(`記録を保存しました！\n選手: ${athleteName}\n距離: ${distance}m\nタイム: ${time}秒`);
        row.querySelector('.distance-input').value = '';
        row.querySelector('.time-input').value = '';
    }
});

// ページ読み込み時に選手リストを更新
window.onload = function() {
    const athleteData = getAthleteData();
    
    // 事前登録選手をlocalStorageに追加
    defaultAthletes.forEach((athleteName) => {
        if (!athleteData[athleteName]) {
            athleteData[athleteName] = [];
        }
    });

    saveAthleteData(athleteData);
    populateAthleteSelect();
};

