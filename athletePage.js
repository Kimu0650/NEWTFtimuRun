// URLから選手名を取得
const urlParams = new URLSearchParams(window.location.search);
const athleteName = urlParams.get('name');

document.getElementById('athlete-name').textContent = athleteName;

// 選手データを取得する関数
function getAthleteData() {
    return JSON.parse(localStorage.getItem('athlete_data')) || {};
}

// 記録を表示する関数
function displayRecords() {
    const athleteData = getAthleteData();
    const records = athleteData[athleteName] || [];
    const tableBody = document.getElementById('record-table-body');
    tableBody.innerHTML = ''; // 既存の内容をクリア

    // 記録をテーブルに表示
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.distance}</td>
            <td>${record.times[0]}</td>
            <td>${record.times[1]}</td>
            <td>${record.times[2]}</td>
        `;
        tableBody.appendChild(row);
    });

    // グラフの描画
    const chartData = {
        labels: records.map(record => `${record.distance}m`),
        datasets: [{
            label: `${athleteName}の記録`,
            data: records.map(record => record.times.reduce((a, b) => a + b, 0) / record.times.length), // 平均タイム
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true
        }]
    };

    const ctx = document.getElementById('record-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: chartData
    });
}

// 戻るボタンの設定
document.getElementById('back-button').addEventListener('click', () => {
    window.history.back();
});

// 記録を表示
displayRecords();

// 記録を保存する処理
document.getElementById('save-record').addEventListener('click', () => {
    const distance = document.getElementById('distance-input').value;
    const time1 = parseFloat(document.getElementById('time1-input').value);
    const time2 = parseFloat(document.getElementById('time2-input').value);
    const time3 = parseFloat(document.getElementById('time3-input').value);

    if (!distance || !time1 || !time2 || !time3) {
        alert('すべてのフィールドを入力してください。');
        return;
    }

    const athleteData = getAthleteData();
    if (!athleteData[athleteName]) {
        athleteData[athleteName] = [];
    }

    athleteData[athleteName].push({
        distance: distance,
        times: [time1, time2, time3]
    });

    saveAthleteData(athleteData);
    alert('記録が保存されました。');
    displayRecords(); // 更新された記録を表示
});

