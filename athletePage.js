window.onload = function() {
    // URLから選手名を取得
    const athleteName = new URLSearchParams(window.location.search).get('name');
    const athleteData = JSON.parse(localStorage.getItem('athlete_data')) || {};

    // 選手名が存在しない場合や記録がない場合の処理
    if (!athleteName || !athleteData[athleteName]) {
        document.getElementById('athlete-name').textContent = "選手の記録がありません。";
        return;
    }

    // 選手名を表示
    document.getElementById('athlete-name').textContent = athleteName + 'の記録';

    // 記録データをテーブルに追加
    const records = athleteData[athleteName];
    const tableBody = document.getElementById('record-table-body');

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.distance}</td>
            <td>${record.times.join(', ')}</td>
            <td>${record.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // グラフ用のデータを処理
    const distances = records.map(record => record.distance);  // 距離の配列
    const times = records.map(record => Math.max(...record.times));  // 最長タイムを取得

    // グラフを描画
    const ctx = document.getElementById('athlete-record-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',  // 折れ線グラフ
        data: {
            labels: distances,  // X軸に距離
            datasets: [{
                label: 'タイム (秒)',
                data: times,  // Y軸にタイム
                borderColor: 'rgba(75, 192, 192, 1)',  // 線の色
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // 線の背景色
                fill: true,  // 塗りつぶし
                tension: 0.1  // 線の滑らかさ
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '距離 (m)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'タイム (秒)'
                    },
                    min: 0  // Y軸の最小値を0に設定
                }
            }
        }
    });
};

