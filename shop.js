document.addEventListener("DOMContentLoaded", function() {
    // 로컬 스토리지에서 복서 스탯 가져오기
    var boxerStats = JSON.parse(localStorage.getItem("boxerStats")) || {
        attack: 50,
        defense: 40,
        experience: 0,
        level: 1,
        gold: 0,
        inventory: []
    };

    // 상점 아이템 데이터
    const shopItems = {
        potion: [
            {
                id: 'attack_potion',
                name: '공격력 포션',
                price: 100,
                description: '공격력이 5 영구 증가합니다.',
                effect: () => {
                    boxerStats.attack += 5;
                    addMatchLog('공격력이 5 증가했습니다!', 'log-levelup');
                }
            },
            {
                id: 'defense_potion',
                name: '방어력 포션',
                price: 100,
                description: '방어력이 5 영구 증가합니다.',
                effect: () => {
                    boxerStats.defense += 5;
                    addMatchLog('방어력이 5 증가했습니다!', 'log-levelup');
                }
            }
        ],
        buff: [
            {
                id: 'exp_boost',
                name: '경험치 부스트',
                price: 50,
                description: '다음 경기에서 획득하는 경험치가 2배가 됩니다.',
                effect: () => {
                    boxerStats.expBoost = true;
                    addMatchLog('경험치 부스트가 적용되었습니다!', 'log-exp');
                }
            },
            {
                id: 'gold_boost',
                name: '골드 부스트',
                price: 50,
                description: '다음 경기에서 획득하는 골드가 2배가 됩니다.',
                effect: () => {
                    boxerStats.goldBoost = true;
                    addMatchLog('골드 부스트가 적용되었습니다!', 'log-exp');
                }
            }
        ],
        cosmetic: [
            {
                id: 'champion_title',
                name: '챔피언 칭호',
                price: 500,
                description: '당신의 이름 앞에 "챔피언" 칭호가 붙습니다.',
                effect: () => {
                    boxerStats.title = '챔피언';
                    addMatchLog('챔피언 칭호를 획득했습니다!', 'log-levelup');
                }
            }
        ]
    };

    // 로그 추가 함수
    function addMatchLog(message, type = '') {
        var matchLogs = JSON.parse(localStorage.getItem("matchLogs") || "[]");
        matchLogs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
        if (matchLogs.length > 20) {
            matchLogs.pop();
        }
        localStorage.setItem("matchLogs", JSON.stringify(matchLogs));
    }

    // 스탯 저장 함수
    function saveStats() {
        localStorage.setItem("boxerStats", JSON.stringify(boxerStats));
    }

    // 골드 표시 업데이트
    function updateGoldDisplay() {
        document.getElementById('goldAmount').textContent = boxerStats.gold;
    }

    // 상점 아이템 렌더링
    function renderShopItems(category) {
        const items = shopItems[category];
        const container = document.getElementById('shopItems');
        container.innerHTML = items.map(item => `
            <div class="shop-item">
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-price">${item.price} 골드</div>
                <div class="shop-item-description">${item.description}</div>
                <button class="btn btn-buy" onclick="purchaseItem('${item.id}')"
                        ${boxerStats.gold < item.price ? 'disabled' : ''}>
                    구매
                </button>
            </div>
        `).join('');
    }

    // 카테고리 버튼 이벤트 리스너
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderShopItems(button.dataset.category);
        });
    });

    // 아이템 구매 함수
    window.purchaseItem = function(itemId) {
        let item;
        for (const category in shopItems) {
            item = shopItems[category].find(i => i.id === itemId);
            if (item) break;
        }

        if (item && boxerStats.gold >= item.price) {
            if (confirm(`${item.name}을(를) ${item.price}골드에 구매하시겠습니까?`)) {
                boxerStats.gold -= item.price;
                item.effect();
                saveStats();
                updateGoldDisplay();
                renderShopItems(document.querySelector('.category-btn.active').dataset.category);
            }
        }
    };

    // 초기화
    updateGoldDisplay();
    renderShopItems('potion');
}); 