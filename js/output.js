class getDataID {
    static textData(ID) {
        try {
            return document.getElementById(ID).value;
        }
        catch (e) {
            console.error(`ID: ${ID} がテキストではありません`);
        }
    }

    static intData(ID) {
        try {
            return parseInt(document.getElementById(ID).value);
        }
        catch (e) {
            console.error(`ID: ${ID} が整数ではありません`);
        }
    }

    static floatData(ID) {
        try {
            return parseFloat(document.getElementById(ID).value);
        }
        catch (e) {
            console.error(`ID: ${ID} が実数ではありません`);
        }
    }

    static checkBoxData(ID) {
        try {
            return document.getElementById(ID).checked;
        }
        catch (e) {
            console.error(`ID: ${ID} がチェックボックスではありません`);
        }
    }
}

class getDataClass {
    static textData(className, index) {
        try {
            return document.getElementsByClassName(className)[index].value;
        }
        catch (e) {
            console.error(`クラス名: ${className} がテキストではありません`);
        }
    }

    static numberDataInt(className, index) {
        try {
            return parseInt(document.getElementsByClassName(className)[index].value);
        }
        catch (e) {
            console.error(`クラス名: ${className} が整数ではありません`);
        }
    }

    static numberDataFloat(className, index) {
        try {
            return parseFloat(document.getElementsByClassName(className)[index].value);
        }
        catch (e) {
            console.error(`クラス名: ${className} が実数ではありません`);
        }
    }

    static checkBoxData(className, index) {
        try {
            return document.getElementsByClassName(className)[index].checked;
        }
        catch (e) {
            console.error(`クラス名: ${className} がチェックボックスではありません`);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const span = checkbox.nextElementSibling;
        checkbox.addEventListener('change', function () {
            span.textContent = checkbox.checked ? 'true' : 'false';
        });
    });

    document.getElementById('spellCardForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const requiredFields = [];
        const labels = document.querySelectorAll('label');

        labels.forEach(label => {
            const inputId = label.getAttribute('for');
            if (inputId) {
                requiredFields.push({ id: inputId, name: label.textContent.trim() });
            }
        });

        let missingFields = [];
        requiredFields.forEach(field => {
            let missing = false;
            if (!formData.get(field.id)) missing = true;

            if (missing) {
                const classArray = document.getElementsByClassName(field.id);

                for (let cnt = 0; cnt < classArray.length; cnt++) {
                    if (!formData.get(classArray[cnt].id)) {
                        missing = true;
                        break;
                    }

                    missing = false;
                }
            }

            if (missing) {
                missingFields.push(field.name);
                console.error(`Missing field: ${field.name}`);
            }
        });

        if (missingFields.length > 0) {
            alert('以下の項目が未入力です:\n' + missingFields.join('\n'));
            const flg = confirm('未入力の項目をスキップしてもよろしいですか？');
            if (!flg) return;
            console.clear();
        }

        let InitialVelocitys = [];
        let burstIntervals = [];
        const initialVelocity = document.getElementsByClassName('initialVelocity');
        const burstInterval = document.getElementsByClassName('burstInterval');

        for (let cnt = 0; cnt < initialVelocity.length; cnt += 3) {
            InitialVelocitys.push({
                x: getDataClass.numberDataFloat('initialVelocity', 0),
                y: getDataClass.numberDataFloat('initialVelocity', 1),
                z: getDataClass.numberDataFloat('initialVelocity', 2)
            });
        }

        for (let cnt = 0; cnt < burstInterval.length; cnt++) {
            burstIntervals.push(getDataClass.numberDataFloat('burstInterval', cnt));
        }

        const jsonData = {
            SpellCard: {
                // スペルカードの基本情報
                BasicData: {
                    name: getDataID.textData("name"),   // スペルカード名
                    englishName: getDataID.textData("englishName"),  // 英語名
                    modelID: getDataID.intData("modelID"),  // ModelID
                    spellCardType: getDataID.intData("spellCardType"),  // スペルカードタイプ
                    movementType: getDataID.intData("movementType"),  // 移動タイプ
                    chargeTime: getDataID.floatData("chargeTime"),  // チャージ時間
                    reloadTime: getDataID.floatData("reloadTime"),  // リロード時間
                    maxAmmo: getDataID.intData("maxAmmo"),  // 最大弾数
                    stopMovement: getDataID.checkBoxData("stopMovement"),  // 足を止めるかどうか
                    initialPosition: {
                        x: getDataClass.numberDataFloat('initialPosition', 0),
                        y: getDataClass.numberDataFloat('initialPosition', 1),
                        z: getDataClass.numberDataFloat('initialPosition', 2)
                    },  // 初期位置
                    burstCount: getDataID.intData("burstCount"),  // 一度に発射する弾数
                    initialVelocity: InitialVelocitys,  // 初期移動ベクトル (リスト)
                    burstInterval: burstIntervals,  // 弾の発射間隔 (リスト)
                    castTime: getDataID.floatData("castTime"),  // キャスト時間
                    waitForReturn: getDataID.checkBoxData("waitForReturn"),  // 弾が戻ってくるのを待つかどうか
                    travelDistance: getDataID.floatData("travelDistance"),  // 移動距離
                    isTeleporting: getDataID.checkBoxData("isTeleporting"),  // テレポートするかどうか
                    cooldownTime: getDataID.floatData("cooldownTime"),  // クールダウン時間
                    animationName: getDataID.textData("animationName"), // アニメーション名
                },
                // スペルカードで行使される弾の情報
                ProjectileData: {
                    // ----- 移動関連 -----
                    power: getDataID.intData("power"), // 威力
                    acceleration: getDataID.floatData("acceleration"), // 加速度
                    maxSpeed: getDataID.floatData("maxSpeed"), // 最大速度
                    maxRange: getDataID.floatData("maxRange"), // 最大射程

                    // ----- 弾の強度関連 -----
                    strength: getDataID.floatData("strength"), // 強度
                    strengthReduction: getDataID.floatData("strengthReduction"), // 強度減衰

                    // ----- 当たり判定関連 -----
                    radius: getDataID.floatData("radius"), // 半径
                    expansion: getDataID.floatData("expansion"), // 拡大率

                    // ----- 未分類 -----
                    activeDuration: getDataID.floatData("activeDuration"), // 有効時間
                    initialSpawnDelay: getDataID.floatData("initialSpawnDelay"), // 初期生成遅延
                    isProjectileKnockback: getDataID.checkBoxData("isProjectileKnockback"), // 弾がノックバックするかどうか
                    opponentStaggerLevel: getDataID.intData("opponentStaggerLevel"), // 相手の怯み度

                    // ----- 追尾判定位置関連 -----
                    distanceRatio: getDataID.floatData("distanceRatio"), // 距離比率
                    maxDistance: getDataID.floatData("maxDistance"), // 最大距離
                    attempts: getDataID.intData("attempts"), // 試行回数
                    attemptsInterval: getDataID.floatData("attemptsInterval"), // 試行間隔
                    pauseDuration: getDataID.floatData("pauseDuration"), // 一時停止時間
                    pauseEffectiveAttempts: getDataID.intData("pauseEffectiveAttempts"), // 一時停止有効試行回数
                }
            }
        };

        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.get('englishName')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('loadJson').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                if (!jsonData.SpellCard || !jsonData.SpellCard.BasicData || !jsonData.SpellCard.ProjectileData) {
                    throw new Error('Invalid JSON structure');
                }

                const form = document.getElementById('spellCardForm');
                Object.keys(jsonData.SpellCard.BasicData).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = jsonData.SpellCard.BasicData[key];
                            input.nextElementSibling.textContent = jsonData.SpellCard.BasicData[key] ? 'true' : 'false';
                        } else if (input.tagName === 'SELECT') {
                            input.value = jsonData.SpellCard.BasicData[key];
                        } else {
                            input.value = jsonData.SpellCard.BasicData[key];
                        }
                    }
                });

                Object.keys(jsonData.SpellCard.ProjectileData).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = jsonData.SpellCard.ProjectileData[key];
                            input.nextElementSibling.textContent = jsonData.SpellCard.ProjectileData[key] ? 'true' : 'false';
                        } else {
                            input.value = jsonData.SpellCard.ProjectileData[key];
                        }
                    }
                });

            } catch (error) {
                alert('無効なJSONファイルです。正しいファイルを選択してください。');
            }
        };
        reader.readAsText(file);
    });
});