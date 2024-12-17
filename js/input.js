document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const span = checkbox.nextElementSibling;
        checkbox.addEventListener('change', function () {
            span.textContent = checkbox.checked ? 'true' : 'false';
        });
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