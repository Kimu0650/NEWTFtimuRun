// Service Worker の登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            console.log('Service Worker 登録成功:', registration);
        }).catch(function (error) {
            console.log('Service Worker 登録失敗:', error);
        });
    });
}

// ローカルストレージから選手データと記録データを取得
let athletes = JSON.parse(localStorage.getItem('athletes')) || [];
let records = JSON.parse(localStorage.getItem('records')) || [];

// 選手名登録フォームの処理
const registerForm = document.getElementById('register-athlete-form');
registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const athleteName = document.getElementById('new-athlete-name').value.trim();
    if (athleteName && !athletes.includes(athleteName)) {
        athletes.push(athleteName);
        localStorage.setItem('athletes', JSON.stringify(athletes));
        updateAthleteSelect();
    }
    document.getElementById('new-athlete-name').value = '';
});

// 選手選択フォームの処理
const athleteSelect = document.getElementById('athlete-select');
const addSelectedAthletesButton = document.getElementById('add-selected-athletes');
addSelectedAthletesButton.addEventListener('click', function () {
    const selectedOptions = athleteSelect.selectedOptions;
    selectedOptions.forEach(option => {
        const athleteName = option.value;
        if (!records.find(record => record.name === athleteName)) {
            records.push({
                name: athleteName,
                distance: '',
                times: []
            });
        }
    });
    localStorage.setItem('records', JSON.stringify(records));
    updateRecordTable();
});

// 記録入力フォームの処理
const recordSubmitButton = document.getElementById('record-submit');
recordSubmitButton.addEventListener('click', function () {
    const distance = document.getElementById('distance').value;
    const runs = document.getElementById('runs').value;

    if (!distance || !runs) {
        alert('距離と本数を入力してください');
        return;
    }

    // 記録の入力
    records.forEach(record => {
        if (record.distance === '') {
            record.distance = distance;
        }

        // 本数分のタイムを空で初期化
        while (record.times.length < runs) {
            record.times.push('');
        }
    });

    localStorage.setItem('records', JSON.stringify(records));
    updateRecordTable();
});

// 記録テーブルを更新
function updateRecordTable() {
    const recordTableBody = document.getElementById('record-table-body');
    recordTableBody.innerHTML = '';

    records.forEach(record => {
        const row = document.createElement('tr');
        const timesHtml = record.times.map((time, index) => `<td><input type="number" value="${time}" class="time-input" data-athlete="${record.name}" data-index="${index}"></td>`).join('');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.distance}</td>
            ${timesHtml}
            <td><button class="remove-record" data-athlete="${record.name}">削除</button></td>
        `;
        recordTableBody.appendChild(row);
    });

    // 時間入力の変更イベント
    const timeInputs = document.querySelectorAll('.time-input');
    timeInputs.forEach(input => {
        input.addEventListener('input', function () {
            const athleteName = input.dataset.athlete;
            const index = input.dataset.index;
            const value = input.value;
            const athleteRecord = records.find(record => record.name === athleteName);
            athleteRecord.times[index] = value;
            localStorage.setItem('records', JSON.stringify(records));
        });
    });

    // 削除ボタンのイベント
    const removeButtons = document.querySelectorAll('.remove-record');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const athleteName = button.dataset.athlete;
            records = records.filter(record => record.name !== athleteName);
            localStorage.setItem('records', JSON.stringify(records));
            updateRecordTable();
        });
    });
}

// 選手セレクトボックスを更新
function updateAthleteSelect() {
    const athleteSelect = document.getElementById('athlete-select');
    athleteSelect.innerHTML = '';
    athletes.forEach(athlete => {
        const option = document.createElement('option');
        option.value = athlete;
        option.textContent = athlete;
        athleteSelect.appendChild(option);
    });
}

// 初期データの表示
updateAthleteSelect();
updateRecordTable();

