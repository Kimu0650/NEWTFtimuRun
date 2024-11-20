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

    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.distance}</td>
            <td>${record.times.join(', ')}</td>
            <td>${record.date}</td>
            <td><button class="delete-btn" data-index="${index}">削除</button></td>
        `;
        tableBody.appendChild(row);
    });

    // 削除ボタンのイベントリスナー
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.dataset.index;
            records.splice(index, 1); // 指定された記録を削除
            athleteData[athleteName] = records; // データを更新
            localStorage.setItem('athlete_data', JSON.stringify(athleteData)); // 保存
            window.location.reload(); // ページをリロード
        });
    });

    // グラフ用のデータを処理
    const distances = [];
    const times = [];

    records.forEach(record => {
        distances.push(record.distance); // 各記録の距離を配列に追加
        times.push(...record.times); // 各記録の全タイムを展開して配列に追加
    });

    // グラフを描画
    const ctx = document.getElementById('athlete-record-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // 折れ線グラフ
        data: {
            labels: distances, // X軸に距離
            datasets: [{
                label: 'タイム (秒)',
                data: times, // Y軸にタイム
                borderColor: 'rgba(75, 192, 192, 1)', // 線の色
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // 塗りつぶしの色
                fill: true, // 塗りつぶし
                tension: 0.1 // 線の滑らかさ
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
                    min: 0 // Y軸の最小値を0に設定
                }
            }
        }
    });

    // 新しいコード: 選手の記録リストを追加
    const recordsList = document.getElementById('records-list');
    athleteData[athleteName].forEach(record => {
        const listItem = document.createElement('li');
        listItem.textContent = `${record.date}: 種目 - ${record.event}, 記録 - ${record.record}`;
        if (record.distance) {
            listItem.textContent += `, 距離 - ${record.distance}m`;
        }
        recordsList.appendChild(listItem);
    });
};

