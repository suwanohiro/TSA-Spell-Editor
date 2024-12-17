document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const span = checkbox.nextElementSibling;
        checkbox.addEventListener('change', function () {
            span.textContent = checkbox.checked ? 'true' : 'false';
        });
    });

    // ModelIDのselect要素を生成する関数
    function populateModelIDSelect(modelIDs) {
        const modelIDSelect = document.getElementById('modelID');
        modelIDSelect.innerHTML = ''; // 既存のオプションをクリア

        modelIDs.forEach((modelID, index) => {
            const option = document.createElement('option');
            option.value = modelID.value;
            option.textContent = modelID.text;
            modelIDSelect.appendChild(option);
        });
    }

    // .hppファイルを読み込んでModelIDを取得する関数
    function loadModelIDsFromFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const modelIDs = [];
            const lines = text.split('\n');
            let enumStarted = false;
            let pushedCount = 0;

            lines.forEach(line => {
                line = line.trim();
                if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
                    // コメント行をスキップ
                    return;
                }
                if (line.startsWith('enum class ModelID')) {
                    enumStarted = true;
                } else if (enumStarted && line.endsWith('};')) {
                    enumStarted = false;
                } else if (enumStarted && line) {
                    const modelID = line.replace(',', '').trim();
                    if (modelID !== 'Length') {
                        const data = {
                            value: pushedCount,
                            text: modelID
                        };

                        modelIDs.push(data);
                        pushedCount++;
                    }
                }
            });

            // ソート
            modelIDs.sort((a, b) => a.text.localeCompare(b.text));

            populateModelIDSelect(modelIDs);
            localStorage.setItem('modelIDs', JSON.stringify(modelIDs));
        };
        reader.readAsText(file);
    }

    // localStorageからModelIDを読み込む関数
    function loadModelIDsFromLocalStorage() {
        const modelIDs = JSON.parse(localStorage.getItem('modelIDs'));
        if (modelIDs) {
            populateModelIDSelect(modelIDs);
        } else {
            alert('ModelIDが読み込まれていません。');
            alert("ファイル > ModelID.hpp を開く から読み込んでください。");
        }
    }

    document.getElementById("reload").addEventListener('click', function () { location.reload(); });

    // .hppファイルのinput要素のイベントリスナー
    document.getElementById('loadHpp').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            loadModelIDsFromFile(file);
        }
    });

    // ModelIDを表示するボタンのイベントリスナー
    document.getElementById('showModelIDsMenu').addEventListener('click', function () {
        const modelIDs = JSON.parse(localStorage.getItem('modelIDs'));
        if (modelIDs) {
            let ids = "";
            for (let cnt = 0; cnt < modelIDs.length; cnt++) {
                ids += modelIDs[cnt].text + "\n";
            }

            alert('読み込んだModelID:\n' + ids);
        } else {
            alert('ModelIDが読み込まれていません。');
            document.getElementById('openHpp').click();
        }
        // サブメニューを非表示にする
        if (currentOpenMenu) {
            currentOpenMenu.style.display = 'none';
            currentOpenMenu = null;
        }
    });

    // JSONファイル選択ボタンのイベントリスナー
    document.getElementById('openJson').addEventListener('click', function () {
        document.getElementById('loadJson').click();
    });

    // HPPファイル選択ボタンのイベントリスナー
    document.getElementById('openHpp').addEventListener('click', function () {
        document.getElementById('loadHpp').click();
    });

    document.getElementById("deleteHpp").addEventListener('click', function () {
        localStorage.removeItem("modelIDs");
        alert('ModelIDを削除しました。');
        location.reload();
    });

    // メニュー項目のイベントリスナー
    document.getElementById('save').addEventListener('click', function () {
        document.getElementById("Submit").click();
    });

    // ショートカットキーのイベントリスナー
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            document.getElementById('save').click();
        }

        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            document.getElementById('openJson').click();
        }

        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            document.getElementById('openHpp').click();
        }

        document.title = `${event.ctrlKey} && ${event.key}`;

        if (event.ctrlKey && event.key === 'n') {
            alert('新規作成');
            event.preventDefault();
            document.getElementById('reload').click();
        }
    });

    // メニューの表示・非表示の制御
    let currentOpenMenu = null;
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function (event) {
            event.stopPropagation();
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                    currentOpenMenu = null;
                } else {
                    if (currentOpenMenu) {
                        currentOpenMenu.style.display = 'none';
                    }
                    submenu.style.display = 'block';
                    currentOpenMenu = submenu;
                }
            }
        });
    });

    // メニュー外をクリックしたときにメニューを非表示にする
    document.addEventListener('click', function () {
        if (currentOpenMenu) {
            currentOpenMenu.style.display = 'none';
            currentOpenMenu = null;
        }
    });

    // メニュー内のクリックイベントを伝播させない
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    });

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // 一度に発射する弾数の値に応じて初期移動ベクトルと発射間隔の入力項目数を動的に変更する
    document.getElementById('burstCount').addEventListener('input', function (event) {
        const burstCount = clamp(parseInt(event.target.value), event.target.min, event.target.max);
        event.target.value = burstCount; // 入力値を範囲内に修正
        const velocityContainer = document.getElementById('initialVelocityContainer');
        const intervalContainer = document.getElementById('burstIntervalContainer');
        velocityContainer.innerHTML = ''; // 既存の入力項目をクリア
        intervalContainer.innerHTML = ''; // 既存の入力項目をクリア

        for (let i = 0; i < burstCount; i++) {
            const div = document.createElement('div');
            div.className = 'xyz-input';
            div.innerHTML = `[&nbsp;${(i + 1).toString().padStart(burstCount.toString().length, "0")}&nbsp;]&nbsp;`;

            const inputX = document.createElement('input');
            inputX.type = 'number';
            inputX.id = `initialVelocityX${i}`;
            inputX.name = `initialVelocityX${i}`;
            inputX.placeholder = 'X';

            const inputY = document.createElement('input');
            inputY.type = 'number';
            inputY.id = `initialVelocityY${i}`;
            inputY.name = `initialVelocityY${i}`;
            inputY.placeholder = 'Y';

            const inputZ = document.createElement('input');
            inputZ.type = 'number';
            inputZ.id = `initialVelocityZ${i}`;
            inputZ.name = `initialVelocityZ${i}`;
            inputZ.placeholder = 'Z';

            div.appendChild(inputX);
            div.appendChild(inputY);
            div.appendChild(inputZ);

            velocityContainer.appendChild(div);

            const intervalInputDiv = document.createElement('div');
            intervalInputDiv.classList.add("intervalInputDiv");


            const span = document.createElement('span');
            span.innerHTML = `[&nbsp;${(i + 1).toString().padStart(burstCount.toString().length, "0")}&nbsp;]&nbsp;`;

            const intervalInput = document.createElement('input');
            intervalInput.type = 'number';
            intervalInput.id = `burstInterval${i}`;
            intervalInput.name = `burstInterval${i}`;
            intervalInput.classList.add("burstInterval");
            intervalInput.placeholder = '発射間隔';
            intervalInput.step = '0.01';
            intervalInput.min = '0';
            intervalInput.value = '0';

            intervalInputDiv.appendChild(span);
            intervalInputDiv.appendChild(intervalInput);
            intervalContainer.appendChild(intervalInputDiv);
        }
    });

    loadModelIDsFromLocalStorage();
});