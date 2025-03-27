document.addEventListener("DOMContentLoaded", function() {
    // 로컬 스토리지에서 복서 스탯 가져오기
    var boxerStats = JSON.parse(localStorage.getItem("boxerStats")) || {
        attack: 50,
        defense: 40,
        experience: 0,
        level: 1,
        gold: 0,
        inventory: [],
        purchasedItems: {},
        achievements: {},
        difficultyWins: {
            easy: 0,
            medium: 0,
            hard: 0
        },
        winStreak: 0,
        title: '신인 복서'
    };

    // 업적 데이터가 없는 경우 초기화
    if (!boxerStats.achievements) {
        boxerStats.achievements = {};
    }

    // winStreak가 없는 경우 초기화
    if (!boxerStats.winStreak) {
        boxerStats.winStreak = 0;
    }

    // title이 없는 경우 초기화
    if (!boxerStats.title) {
        boxerStats.title = '신인 복서';
    }

    // 업적 데이터 정의
    const achievements = {
        basic: [
            {
                id: 'first_win',
                title: '첫 승리',
                description: '첫 번째 경기에서 승리하세요.',
                icon: '🏆',
                reward: '100 골드',
                check: () => boxerStats.achievements.first_win || false,
                progress: () => boxerStats.achievements.first_win ? 100 : 0,
                rewardFunction: () => {
                    boxerStats.gold += 100;
                    addMatchLog('첫 승리 업적 달성! 100 골드를 획득했습니다.');
                }
            },
            {
                id: 'level_10',
                title: '성장하는 복서',
                description: '레벨 10에 도달하세요.',
                icon: '⭐',
                reward: '500 골드',
                check: () => boxerStats.achievements.level_10 || boxerStats.level >= 10,
                progress: () => Math.min((boxerStats.level / 10) * 100, 100),
                rewardFunction: () => {
                    boxerStats.gold += 500;
                    addMatchLog('레벨 10 달성! 500 골드를 획득했습니다.');
                }
            },
            {
                id: 'level_30',
                title: '전설의 복서',
                description: '레벨 30에 도달하세요.',
                icon: '👑',
                reward: '2000 골드',
                check: () => boxerStats.achievements.level_30 || boxerStats.level >= 30,
                progress: () => Math.min((boxerStats.level / 30) * 100, 100),
                rewardFunction: () => {
                    boxerStats.gold += 2000;
                    addMatchLog('레벨 30 달성! 2000 골드를 획득했습니다.');
                }
            },
            {
                id: 'gold_1000',
                title: '부자 복서',
                description: '1000 골드를 모으세요.',
                icon: '💰',
                reward: '특별한 칭호',
                check: () => boxerStats.achievements.gold_1000 || boxerStats.gold >= 1000,
                progress: () => Math.min((boxerStats.gold / 1000) * 100, 100),
                rewardFunction: () => {
                    boxerStats.title = '부자 복서';
                    addMatchLog('1000 골드 달성! 특별한 칭호를 획득했습니다.');
                }
            },
            {
                id: 'gold_10000',
                title: '황금 복서',
                description: '10000 골드를 모으세요.',
                icon: '💎',
                reward: '황금 칭호',
                check: () => boxerStats.achievements.gold_10000 || boxerStats.gold >= 10000,
                progress: () => Math.min((boxerStats.gold / 10000) * 100, 100),
                rewardFunction: () => {
                    boxerStats.title = '황금 복서';
                    addMatchLog('10000 골드 달성! 황금 칭호를 획득했습니다.');
                }
            }
        ],
        battle: [
            {
                id: 'easy_all',
                title: '애송이 정복자',
                description: '애송이 난이도의 모든 상대를 이기세요.',
                icon: '🥊',
                reward: '300 골드',
                check: () => boxerStats.achievements.easy_all || (boxerStats.difficultyWins && boxerStats.difficultyWins.easy >= 3),
                progress: () => Math.min(((boxerStats.difficultyWins && boxerStats.difficultyWins.easy) || 0) / 3 * 100, 100),
                rewardFunction: () => {
                    boxerStats.gold += 300;
                    addMatchLog('애송이 난이도 정복! 300 골드를 획득했습니다.');
                }
            },
            {
                id: 'medium_all',
                title: '중급 정복자',
                description: '중급 난이도의 모든 상대를 이기세요.',
                icon: '🥊',
                reward: '600 골드',
                check: () => boxerStats.achievements.medium_all || (boxerStats.difficultyWins && boxerStats.difficultyWins.medium >= 3),
                progress: () => Math.min(((boxerStats.difficultyWins && boxerStats.difficultyWins.medium) || 0) / 3 * 100, 100),
                rewardFunction: () => {
                    boxerStats.gold += 600;
                    addMatchLog('중급 난이도 정복! 600 골드를 획득했습니다.');
                }
            },
            {
                id: 'hard_all',
                title: '상급 정복자',
                description: '상급 난이도의 모든 상대를 이기세요.',
                icon: '🥊',
                reward: '1000 골드',
                check: () => boxerStats.achievements.hard_all || (boxerStats.difficultyWins && boxerStats.difficultyWins.hard >= 3),
                progress: () => Math.min(((boxerStats.difficultyWins && boxerStats.difficultyWins.hard) || 0) / 3 * 100, 100),
                rewardFunction: () => {
                    boxerStats.gold += 1000;
                    addMatchLog('상급 난이도 정복! 1000 골드를 획득했습니다.');
                }
            },
            {
                id: 'win_streak_5',
                title: '연승의 시작',
                description: '연속 5승을 달성하세요.',
                icon: '🔥',
                reward: '200 골드',
                check: () => boxerStats.achievements.win_streak_5 || (boxerStats.winStreak && boxerStats.winStreak >= 5),
                progress: () => Math.min((boxerStats.winStreak / 5) * 100, 100),
                rewardFunction: () => {
                    boxerStats.gold += 200;
                    addMatchLog('연속 5승 달성! 200 골드를 획득했습니다.');
                }
            },
            {
                id: 'win_streak_10',
                title: '무적의 복서',
                description: '연속 10승을 달성하세요.',
                icon: '⚡',
                reward: '500 골드',
                check: () => boxerStats.achievements.win_streak_10 || (boxerStats.winStreak && boxerStats.winStreak >= 10),
                progress: () => Math.min((boxerStats.winStreak / 10) * 100, 100),
                rewardFunction: () => {
                    boxerStats.gold += 500;
                    addMatchLog('연속 10승 달성! 500 골드를 획득했습니다.');
                }
            }
        ],
        item: [
            {
                id: 'first_item',
                title: '첫 구매',
                description: '첫 번째 아이템을 구매하세요.',
                icon: '🛍️',
                reward: '50 골드',
                check: () => boxerStats.achievements.first_item || (boxerStats.purchasedItems && Object.keys(boxerStats.purchasedItems).length > 0),
                progress: () => (boxerStats.purchasedItems && Object.keys(boxerStats.purchasedItems).length > 0) ? 100 : 0,
                rewardFunction: () => {
                    boxerStats.gold += 50;
                    addMatchLog('첫 아이템 구매! 50 골드를 획득했습니다.');
                }
            },
            {
                id: 'all_potions',
                title: '포션 마스터',
                description: '모든 포션을 구매하세요.',
                icon: '🧪',
                reward: '300 골드',
                check: () => boxerStats.achievements.all_potions || 
                    (boxerStats.purchasedItems && boxerStats.purchasedItems.attack_potion && boxerStats.purchasedItems.defense_potion),
                progress: () => {
                    if (!boxerStats.purchasedItems) return 0;
                    const potions = ['attack_potion', 'defense_potion'];
                    const purchased = potions.filter(id => boxerStats.purchasedItems[id]).length;
                    return (purchased / potions.length) * 100;
                },
                rewardFunction: () => {
                    boxerStats.gold += 300;
                    addMatchLog('모든 포션 구매! 300 골드를 획득했습니다.');
                }
            },
            {
                id: 'all_buffs',
                title: '버프 마스터',
                description: '모든 버프를 구매하세요.',
                icon: '⚡',
                reward: '200 골드',
                check: () => boxerStats.achievements.all_buffs || 
                    (boxerStats.purchasedItems && boxerStats.purchasedItems.exp_boost && boxerStats.purchasedItems.gold_boost),
                progress: () => {
                    if (!boxerStats.purchasedItems) return 0;
                    const buffs = ['exp_boost', 'gold_boost'];
                    const purchased = buffs.filter(id => boxerStats.purchasedItems[id]).length;
                    return (purchased / buffs.length) * 100;
                },
                rewardFunction: () => {
                    boxerStats.gold += 200;
                    addMatchLog('모든 버프 구매! 200 골드를 획득했습니다.');
                }
            },
            {
                id: 'all_titles',
                title: '칭호 수집가',
                description: '모든 칭호를 구매하세요.',
                icon: '🏆',
                reward: '1000 골드',
                check: () => boxerStats.achievements.all_titles || 
                    (boxerStats.purchasedItems && Object.keys(boxerStats.purchasedItems).filter(id => id.endsWith('_title')).length >= 10),
                progress: () => {
                    if (!boxerStats.purchasedItems) return 0;
                    const titles = Object.keys(boxerStats.purchasedItems).filter(id => id.endsWith('_title')).length;
                    return Math.min((titles / 10) * 100, 100);
                },
                rewardFunction: () => {
                    boxerStats.gold += 1000;
                    addMatchLog('모든 칭호 구매! 1000 골드를 획득했습니다.');
                }
            },
            {
                id: 'gold_boost_used',
                title: '골드 러시',
                description: '골드 부스트를 사용하세요.',
                icon: '💰',
                reward: '100 골드',
                check: () => boxerStats.achievements.gold_boost_used || false,
                progress: () => boxerStats.achievements.gold_boost_used ? 100 : 0,
                rewardFunction: () => {
                    boxerStats.gold += 100;
                    addMatchLog('골드 부스트 사용! 100 골드를 획득했습니다.');
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

    // 업적 렌더링
    function renderAchievements(category) {
        const container = document.getElementById('achievementsList');
        if (!container) return;

        const categoryAchievements = achievements[category] || [];
        container.innerHTML = categoryAchievements.map(achievement => {
            const completed = achievement.check();
            const progress = achievement.progress();
            
            return `
                <div class="achievement-card ${completed ? 'completed' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-reward">보상: ${achievement.reward}</div>
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    ${completed ? '<div class="text-success mt-2">달성 완료!</div>' : ''}
                </div>
            `;
        }).join('');
    }

    // 카테고리 버튼 이벤트 리스너
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderAchievements(button.dataset.category);
        });
    });

    // 업적 체크 및 보상 지급
    function checkAchievements() {
        for (const category in achievements) {
            achievements[category].forEach(achievement => {
                if (!boxerStats.achievements[achievement.id] && achievement.check()) {
                    boxerStats.achievements[achievement.id] = true;
                    achievement.rewardFunction();
                    saveStats();
                }
            });
        }
    }

    // 초기화
    checkAchievements();
    renderAchievements('basic');
}); 