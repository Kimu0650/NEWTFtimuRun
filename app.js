const STORAGE_KEY = 'athlete_data';

// 事前に登録する選手名
const initialAthletes = [
    "相方紫帆", "岩見琉音", "前田莉佐", "湯本真未",
    "崎本七海", "佐藤安里紗", "永瀬裕大", "和田卓英",
    "北川大喜", "木下裕翔", "中村香葉"
];

// 選手データを取得
function getAthleteData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// 選手データを保存
function saveAthleteData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 事前に選手を登録
function registerInitialAthletes() {
    const athleteData = getAthleteData();

    initialAthletes.forEach((name) => {
        if (!athleteData[name]) {
            athleteData[name] = [];
        }
    });

    saveAthleteData(athleteData);
}

// 選手を登録するイベント
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

// 選手名を選択肢として表示
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

// 選手を記録表に追加する
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
                <td>
                    <button class="save-record">記録を保存</button>
                    <button class="delete-record">削除</button>
                </td>
            `;
            tableBody.appendChild(row);
        }
    });
});

// 記録を保存または削除する
document.getElementById('record-table-body').addEventListener('click', function (e) {
    const row = e.target.closest('tr');
    const athleteName = row.getAttribute('data-athlete');
    const athleteData = getAthleteData();

    if (e.target.classList.contains('save-record')) {
        const distance = parseFloat(row.querySelector('.distance-input').value);
        const time = parseFloat(row.querySelector('.time-input').value);

        if (!distance || !time) {
            alert('距離とタイムを正しく入力してください。');
            return;
        }

        athleteData[athleteName].push({ distance, time, date: new Date().toISOString() });
        saveAthleteData(athleteData);

        alert(`記録を保存しました！\n選手: ${athleteName}\n距離: ${distance}m\nタイム: ${time}秒`);
        row.querySelector('.distance-input').value = '';
        row.querySelector('.time-input').value = '';
    }

    if (e.target.classList.contains('delete-record')) {
        const distance = row.querySelector('.distance-input').value;
        const time = row.querySelector('.time-input').value;

        // 確認ダイアログ
        if (confirm(`選手 "${athleteName}" の記録 (距離: ${distance}m, タイム: ${time}秒) を削除しますか？`)) {
            // 削除ボタンが押された場合、記録を削除
            const indexToRemove = athleteData[athleteName].findIndex(record =>
                record.distance === parseFloat(distance) && record.time === parseFloat(time)
            );

            if (indexToRemove !== -1) {
                athleteData[athleteName].splice(indexToRemove, 1);
                saveAthleteData(athleteData);
                alert('記録を削除しました！');
                row.remove(); // 表からも削除
            }
        }
    }
});

// ページ読み込み時に事前選手を登録し、選手リストを更新
document.addEventListener('DOMContentLoaded', function () {
    registerInitialAthletes(); // ページが読み込まれた時に事前選手を登録
    populateAthleteSelect(); // 選手リストの更新
});

