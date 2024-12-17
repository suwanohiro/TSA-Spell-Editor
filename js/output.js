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
            if (!formData.get(field.id)) {
                missingFields.push(field.name);
            }
        });

        if (missingFields.length > 0) {
            alert('以下の項目が未入力です:\n' + missingFields.join('\n'));
            return;
        }

        const jsonData = {
            SpellCard: {
                BasicData: {
                    name: formData.get('name'),
                    englishName: formData.get('englishName'),
                    ModelID: parseInt(formData.get('modelID')),
                    CooldownTime: parseFloat(formData.get('cooldownTime')),
                    AnimationName: formData.get('animationName'),
                    InitialPosition: {
                        x: parseFloat(formData.get('initialPositionX')),
                        y: parseFloat(formData.get('initialPositionY')),
                        z: parseFloat(formData.get('initialPositionZ'))
                    },
                    StopMovement: parseInt(formData.get('stopMovement'))
                },
                ProjectileData: {
                    Power: parseInt(formData.get('power')),
                    Acceleration: parseFloat(formData.get('acceleration')),
                    MaxSpeed: parseFloat(formData.get('maxSpeed')),
                    InitialVelocity: {
                        x: parseFloat(formData.get('initialVelocityX')),
                        y: parseFloat(formData.get('initialVelocityY')),
                        z: parseFloat(formData.get('initialVelocityZ'))
                    },
                    IsProjectileKnockback: formData.get('isProjectileKnockback') === 'on',
                    OpponentStaggerLevel: formData.get('opponentStaggerLevel'),
                    DistanceRatio: parseFloat(formData.get('distanceRatio')),
                    MaxDistance: parseFloat(formData.get('maxDistance'))
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