// 보스 데이터 정의
const bosses = [
    {
        id: 'iron_fist',
        name: '철의 주먹',
        story: '한때 전설이었던 복서. 그의 주먹은 강철처럼 단단하며, 그의 방어는 요새와도 같다.',
        attack: 150,
        defense: 120,
        health: 200,
        special: '철갑 방어',
        goldReward: 1000,
        expReward: 500,
        specialReward: '철의 주먹의 인장'
    },
    {
        id: 'shadow_boxer',
        name: '그림자 복서',
        story: '빠르고 민첩한 그의 움직임은 마치 그림자처럼 보이지 않는다. 그의 펀치는 예측할 수 없다.',
        attack: 180,
        defense: 80,
        health: 150,
        special: '그림자 회피',
        goldReward: 1200,
        expReward: 600,
        specialReward: '그림자의 망토'
    },
    {
        id: 'thunder_fist',
        name: '번개의 주먹',
        story: '그의 펀치는 번개처럼 빠르고 강력하다. 그의 특수 기술은 상대를 기절시킬 수 있다.',
        attack: 200,
        defense: 90,
        health: 180,
        special: '번개 펀치',
        goldReward: 1500,
        expReward: 700,
        specialReward: '번개의 장갑'
    }
];

// 보스전 상태 관리
let currentBoss = null;
let lastBossTime = null;

// 보스전 초기화
function initializeBossFight() {
    // 복서 스탯 가져오기
    var boxerStats = JSON.parse(localStorage.getItem("boxerStats")) || {
        bossFights: {}
    };

    // 보스전 기록이 없으면 초기화
    if (!boxerStats.bossFights) {
        boxerStats.bossFights = {};
    }

    // 현재 시간 확인
    const now = new Date();
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // 주말이 아니면 다음 주말까지 타이머 표시
    if (!isWeekend) {
        const nextWeekend = new Date(now);
        nextWeekend.setDate(now.getDate() + (6 - dayOfWeek));
        nextWeekend.setHours(0, 0, 0, 0);
        updateTimer(nextWeekend);
        disableBossCard();
        return;
    }

    // 주말이면 보스 생성
    generateBoss();
}

// 보스 생성
function generateBoss() {
    // 마지막 보스 시간 확인
    const lastBossTimeStr = localStorage.getItem('lastBossTime');
    if (lastBossTimeStr) {
        lastBossTime = new Date(lastBossTimeStr);
        const now = new Date();
        const timeDiff = now - lastBossTime;

        // 24시간이 지나지 않았다면 같은 보스 유지
        if (timeDiff < 24 * 60 * 60 * 1000) {
            currentBoss = JSON.parse(localStorage.getItem('currentBoss'));
        } else {
            // 새로운 보스 생성
            currentBoss = bosses[Math.floor(Math.random() * bosses.length)];
            localStorage.setItem('currentBoss', JSON.stringify(currentBoss));
            localStorage.setItem('lastBossTime', now.toISOString());
        }
    } else {
        // 첫 보스 생성
        currentBoss = bosses[Math.floor(Math.random() * bosses.length)];
        localStorage.setItem('currentBoss', JSON.stringify(currentBoss));
        localStorage.setItem('lastBossTime', new Date().toISOString());
    }

    // 보스 정보 표시
    displayBossInfo();
}

// 보스 정보 표시
function displayBossInfo() {
    document.getElementById('bossName').textContent = currentBoss.name;
    document.getElementById('bossStory').textContent = currentBoss.story;
    document.getElementById('bossAttack').textContent = currentBoss.attack;
    document.getElementById('bossDefense').textContent = currentBoss.defense;
    document.getElementById('bossHealth').textContent = currentBoss.health;
    document.getElementById('bossSpecial').textContent = currentBoss.special;
    document.getElementById('goldReward').textContent = currentBoss.goldReward + ' 골드';
    document.getElementById('expReward').textContent = currentBoss.expReward + ' 경험치';
    document.getElementById('specialReward').textContent = currentBoss.specialReward;
}

// 보스전 도전
function challengeBoss() {
    if (!currentBoss) return;

    var boxerStats = JSON.parse(localStorage.getItem("boxerStats")) || {};
    
    // 보스전 기록 확인
    if (boxerStats.bossFights && boxerStats.bossFights[currentBoss.id]) {
        alert('이미 이 보스와 싸웠습니다. 다음 주말에 다시 도전해주세요!');
        return;
    }

    // 승리 확률 계산 (플레이어의 능력치에 기반)
    const playerPower = (boxerStats.attack + boxerStats.defense) / 2;
    const bossPower = (currentBoss.attack + currentBoss.defense) / 2;
    const winChance = Math.min(playerPower / bossPower, 0.8); // 최대 80% 승리 확률

    if (Math.random() < winChance) {
        // 승리
        boxerStats.gold = (boxerStats.gold || 0) + currentBoss.goldReward;
        boxerStats.experience = (boxerStats.experience || 0) + currentBoss.expReward;
        
        // 보스전 기록 저장
        if (!boxerStats.bossFights) boxerStats.bossFights = {};
        boxerStats.bossFights[currentBoss.id] = {
            defeated: true,
            date: new Date().toISOString()
        };

        // 특별 보상 저장
        if (!boxerStats.inventory) boxerStats.inventory = [];
        boxerStats.inventory.push(currentBoss.specialReward);

        localStorage.setItem("boxerStats", JSON.stringify(boxerStats));
        
        alert(`축하합니다! ${currentBoss.name}을(를) 물리쳤습니다!\n\n획득한 보상:\n- ${currentBoss.goldReward} 골드\n- ${currentBoss.expReward} 경험치\n- ${currentBoss.specialReward}`);
    } else {
        // 패배
        alert(`${currentBoss.name}에게 패배했습니다. 더 강해져서 다시 도전해보세요!`);
    }
}

// 타이머 업데이트
function updateTimer(targetDate) {
    const timerElement = document.getElementById('timer');
    
    function update() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            timerElement.textContent = '보스가 곧 등장합니다!';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    update();
    setInterval(update, 1000);
}

// 보스 카드 비활성화
function disableBossCard() {
    document.getElementById('bossCard').style.opacity = '0.5';
    document.getElementById('challengeButton').disabled = true;
    document.getElementById('bossName').textContent = '주말에만 보스가 등장합니다';
    document.getElementById('bossStory').textContent = '다음 주말에 새로운 보스가 등장할 예정입니다.';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeBossFight); 