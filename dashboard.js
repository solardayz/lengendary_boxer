document.addEventListener("DOMContentLoaded", function() {
    // 초기화 버튼 이벤트 리스너
    document.getElementById("resetButton").addEventListener("click", function() {
      if (confirm("정말로 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        // 로컬 스토리지 초기화
        localStorage.removeItem("boxerName");
        localStorage.removeItem("boxerStats");
        localStorage.removeItem("matchLogs");
        localStorage.removeItem("difficultyWins");
        
        // 초기화 완료 메시지
        alert("모든 데이터가 초기화되었습니다.");
        
        // 초기 화면으로 이동
        window.location.href = "index.html";
      }
    });

    // 레벨 조정 버튼 이벤트 리스너
    document.getElementById("adjustLevelButton").addEventListener("click", function() {
      if (confirm("레벨을 30으로 조정하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        // 레벨이 30을 초과하는 경우에만 조정
        if (boxerStats.level > 30) {
          boxerStats.level = 30;
          // 스탯 저장
          saveStats();
          // 스탯 정보 업데이트
          updateStatDisplay();
          // 로그 추가
          addMatchLog("레벨이 30으로 조정되었습니다.", "log-levelup");
        } else {
          alert("현재 레벨이 30 이하이므로 조정이 필요하지 않습니다.");
        }
      }
    });

    // 로컬 스토리지에서 복서 이름 가져오기
    var boxerName = localStorage.getItem("boxerName") || "Unknown Boxer";
    document.getElementById("dashboardTitle").innerText = boxerName + "의 대시보드";
    
    // 로컬 스토리지에서 복서 스탯 가져오기
    var boxerStats = JSON.parse(localStorage.getItem("boxerStats")) || {
      attack: 50,
      defense: 40,
      experience: 0,
      level: 1,
      gold: 0,
      inventory: []
    };

    // 30레벨 초과 체크 및 조정
    if (boxerStats.level > 30) {
      if (confirm("현재 레벨이 30을 초과합니다. 레벨을 30으로 조정하시겠습니까?")) {
        boxerStats.level = 30;
        saveStats();
        addMatchLog("레벨이 30으로 조정되었습니다.", "log-levelup");
      }
    }

    // 스탯 저장 함수
    function saveStats() {
      try {
        localStorage.setItem("boxerStats", JSON.stringify(boxerStats));
        console.log("스탯 저장 완료:", boxerStats);
      } catch (error) {
        console.error("스탯 저장 실패:", error);
      }
    }

    // 레벨별 필요 경험치 계산 함수
    function getRequiredExp(level) {
      // 1-5레벨: 50씩 증가
      if (level <= 5) {
        return 50 * level;
      }
      // 6-10레벨: 100씩 증가
      else if (level <= 10) {
        return 250 + (level - 5) * 100;
      }
      // 11-15레벨: 150씩 증가
      else if (level <= 15) {
        return 750 + (level - 10) * 150;
      }
      // 16-20레벨: 200씩 증가
      else if (level <= 20) {
        return 1500 + (level - 15) * 200;
      }
      // 21-25레벨: 250씩 증가
      else if (level <= 25) {
        return 2500 + (level - 20) * 250;
      }
      // 26-30레벨: 300씩 증가
      else {
        return 3750 + (level - 25) * 300;
      }
    }

    // 레벨별 스탯 증가량 계산 함수
    function getStatIncrease(level) {
      return {
        attack: Math.floor(5 + level * 0.5),
        defense: Math.floor(4 + level * 0.4)
      };
    }
  
    // 스탯 구간 계산 함수
    function getStatRange(stat) {
      if (stat >= 90) return "S급";
      if (stat >= 80) return "A급";
      if (stat >= 70) return "B급";
      if (stat >= 60) return "C급";
      if (stat >= 50) return "D급";
      return "F급";
    }
  
    // 스탯 정보를 텍스트로 표시 (구간 포함)
    function updateStatDisplay() {
      var nextLevelExp = getRequiredExp(boxerStats.level);
      
      // 스탯 정보 업데이트
      document.getElementById("attackStat").innerText = boxerStats.attack;
      document.getElementById("attackRange").innerText = "(" + getStatRange(boxerStats.attack) + ")";
      document.getElementById("defenseStat").innerText = boxerStats.defense;
      document.getElementById("defenseRange").innerText = "(" + getStatRange(boxerStats.defense) + ")";
      document.getElementById("expStat").innerText = boxerStats.experience + "/" + nextLevelExp;
      document.getElementById("levelNumber").innerText = boxerStats.level;
      document.getElementById("goldAmount").textContent = boxerStats.gold;
      
      // 차트 업데이트
      statsChart.data.datasets[0].data = [boxerStats.attack, boxerStats.defense];
      statsChart.update();
      
      expChart.data.datasets[0].data = [boxerStats.experience, nextLevelExp];
      expChart.update();
    }

    // Chart.js로 스탯 그래프 그리기 (바 차트)
    var ctx = document.getElementById('statsChart').getContext('2d');
    var statsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['공격력', '방어력'],
        datasets: [{
          label: '스탯',
          data: [boxerStats.attack, boxerStats.defense],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              stepSize: 10
            }
          }
        }
      }
    });
  
    // 경험치 차트
    var expCtx = document.getElementById('expChart').getContext('2d');
    var expChart = new Chart(expCtx, {
      type: 'bar',
      data: {
        labels: ['현재 경험치', '다음 레벨까지'],
        datasets: [{
          label: '경험치',
          data: [boxerStats.experience, getRequiredExp(boxerStats.level)],
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              stepSize: 50
            }
          }
        }
      }
    });
  
    // 초기 스탯 표시
    updateStatDisplay();
  
    // 경기 상대 데이터 생성
    // 쉬움 난이도: 유명한 복서 3명
    var easyOpponents = [
      { name: "Muhammad Ali", attack: 60, defense: 55 },
      { name: "Mike Tyson", attack: 65, defense: 50 },
      { name: "Sugar Ray Leonard", attack: 58, defense: 52 }
    ];
  
    // 중간 난이도: 5명
    var mediumOpponents = [
      { name: "Rocky Balboa", attack: 70, defense: 60 },
      { name: "Apollo Creed", attack: 68, defense: 58 },
      { name: "Joe Frazier", attack: 66, defense: 62 },
      { name: "Lennox Lewis", attack: 72, defense: 64 },
      { name: "Evander Holyfield", attack: 69, defense: 59 }
    ];
  
    // 어려움 난이도: 7명
    var hardOpponents = [
      { name: "Floyd Mayweather", attack: 75, defense: 90 },
      { name: "Manny Pacquiao", attack: 78, defense: 85 },
      { name: "Oscar De La Hoya", attack: 76, defense: 83 },
      { name: "Roberto Durán", attack: 77, defense: 84 },
      { name: "Gene Tunney", attack: 74, defense: 80 },
      { name: "Jack Dempsey", attack: 79, defense: 82 },
      { name: "Joe Louis", attack: 80, defense: 85 }
    ];
  
    // 경기 로그를 저장할 배열
    var matchLogs = [];

    // 로그 저장 함수
    function saveMatchLogs() {
      localStorage.setItem("matchLogs", JSON.stringify(matchLogs));
    }

    // 로그 불러오기 함수
    function loadMatchLogs() {
      var saved = localStorage.getItem("matchLogs");
      if (saved) {
        matchLogs = JSON.parse(saved);
      }
    }

    // 로그 표시 함수
    function addMatchLog(message, type = '') {
      matchLogs.unshift(message); // 새로운 로그를 배열 앞에 추가
      if (matchLogs.length > 20) { // 최대 20개 로그만 보관
        matchLogs.pop();
      }
      
      // 로그 저장
      saveMatchLogs();
      
      // 로그 화면 업데이트
      var logContainer = document.getElementById("matchLogs");
      if (!logContainer) {
        // 로그 컨테이너가 없으면 생성
        var container = document.createElement("div");
        container.id = "matchLogs";
        container.className = "match-logs";
        container.style.cssText = "height: 300px; overflow-y: auto; background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px;";
        document.querySelector(".container").appendChild(container);
        logContainer = container;
      }
      
      logContainer.innerHTML = matchLogs.map(log => {
        let time = log.match(/\[(.*?)\]/);
        let timeHtml = time ? `<span class="log-time">[${time[1]}]</span> ` : '';
        let content = time ? log.replace(/\[.*?\]/, '').trim() : log;
        
        let className = '';
        if (content.includes('승리')) className = 'log-win';
        else if (content.includes('패배')) className = 'log-lose';
        else if (content.includes('레벨업')) className = 'log-levelup';
        else if (content.includes('경험치')) className = 'log-exp';
        
        return `<div class="${className}">${timeHtml}${content}</div>`;
      }).join("");
    }

    // 초기 로그 불러오기
    loadMatchLogs();

    // 로그 초기 표시
    var logContainer = document.getElementById("matchLogs");
    if (logContainer) {
      logContainer.innerHTML = matchLogs.map(log => {
        let time = log.match(/\[(.*?)\]/);
        let timeHtml = time ? `<span class="log-time">[${time[1]}]</span> ` : '';
        let content = time ? log.replace(/\[.*?\]/, '').trim() : log;
        
        let className = '';
        if (content.includes('승리')) className = 'log-win';
        else if (content.includes('패배')) className = 'log-lose';
        else if (content.includes('레벨업')) className = 'log-levelup';
        else if (content.includes('경험치')) className = 'log-exp';
        
        return `<div class="${className}">${timeHtml}${content}</div>`;
      }).join("");
    }
  
    // 난이도별 승리 횟수 추적
    var difficultyWins = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    // 난이도별 승리 횟수 저장
    function saveDifficultyWins() {
      localStorage.setItem("difficultyWins", JSON.stringify(difficultyWins));
    }

    // 난이도별 승리 횟수 불러오기
    function loadDifficultyWins() {
      var saved = localStorage.getItem("difficultyWins");
      if (saved) {
        difficultyWins = JSON.parse(saved);
      }
    }

    // 난이도별 승리 횟수 초기화
    loadDifficultyWins();

    // 레벨업 함수
    function checkLevelUp() {
      // 최고 레벨 체크
      if (boxerStats.level >= 30) {
        addMatchLog("🎉 최고 레벨(30)에 도달했습니다! 이제 당신은 진정한 전설이 되었습니다!", "log-levelup");
        return;
      }

      var nextLevelExp = getRequiredExp(boxerStats.level);
      if (boxerStats.experience >= nextLevelExp) {
        boxerStats.level += 1;
        boxerStats.attack += 5;
        boxerStats.defense += 5;
        var levelUpMessage = `레벨업! 공격력과 방어력이 5씩 증가했습니다! (${boxerStats.level-1} → ${boxerStats.level})`;
        addMatchLog(levelUpMessage, "log-levelup");
        
        // 최고 레벨 도달 체크
        if (boxerStats.level === 30) {
          addMatchLog("🎉 최고 레벨(30)에 도달했습니다! 이제 당신은 진정한 전설이 되었습니다!", "log-levelup");
        }
        
        // 스탯 정보 업데이트
        updateStatDisplay();
        
        // 스탯 저장
        saveStats();
      }
    }

    // 경험치 획득 및 레벨업 체크 함수
    function gainExperience(expAmount) {
      // 최고 레벨 체크
      if (boxerStats.level >= 30) {
        addMatchLog("최고 레벨에 도달했기 때문에 더 이상 경험치를 획득할 수 없습니다.", "log-exp");
        return;
      }

      boxerStats.experience += expAmount;
      console.log("경험치 획득:", expAmount, "현재 경험치:", boxerStats.experience);
      
      // 스탯 저장
      saveStats();
      
      // 스탯 정보 업데이트
      updateStatDisplay();
      
      // 레벨업 체크
      checkLevelUp();
    }

    // 경기 결과 계산 함수 수정
    function calculateMatchResult(playerStats, opponentStats) {
      var playerScore = (playerStats.attack * 0.6 + playerStats.defense * 0.4);
      var opponentScore = (opponentStats.attack * 0.6 + opponentStats.defense * 0.4);
      
      var winProbability = playerScore / (playerScore + opponentScore);
      var random = Math.random();
      
      if (random < winProbability) {
        return {
          won: true,
          message: "경기에서 승리했습니다!",
          score: Math.round(playerScore)
        };
      } else {
        return {
          won: false,
          message: "경기에서 패배했습니다. 더 강해져서 다시 도전하세요!",
          score: Math.round(opponentScore)
        };
      }
    }

    // 경기 시작 함수 수정
    window.startMatch = function(opponentName, opponentAttack, opponentDefense, difficulty) {
      if (!checkDifficultyAccess(difficulty)) {
        return;
      }

      if (confirm(opponentName + "와(과) 경기를 하시겠습니까?")) {
        var result = calculateMatchResult(boxerStats, {attack: opponentAttack, defense: opponentDefense});
        
        var logMessage = `[${new Date().toLocaleTimeString()}] ${opponentName}와(과)의 경기: ${result.message} (점수: ${result.score})`;
        addMatchLog(logMessage);
        
        if (result.won) {
          // 경험치 획득
          var expGain = calculateExpGain(opponentAttack, opponentDefense, difficulty);
          if (boxerStats.expBoost) {
            expGain *= 2;
            boxerStats.expBoost = false;
          }
          gainExperience(expGain);

          // 골드 획득
          var goldGain = Math.floor((opponentAttack + opponentDefense) / 10) * 10;
          if (boxerStats.goldBoost) {
            goldGain *= 2;
            boxerStats.goldBoost = false;
          }
          boxerStats.gold += goldGain;
          addMatchLog(`골드 ${goldGain} 획득!`);

          difficultyWins[difficulty]++;
          saveDifficultyWins();
        }
      }
    };

    // 함수: 상대 데이터를 받아 테이블 생성
    function renderOpponents(opponents, containerId, difficulty) {
      var container = document.getElementById(containerId);
      var html = '<table class="table table-dark table-striped opponent-table">';
      html += '<thead><tr><th>이름</th><th>공격력</th><th>방어력</th><th>선택</th></tr></thead><tbody>';
      opponents.forEach(function(opp, index) {
        html += '<tr><td>' + opp.name + '</td><td>' + opp.attack + ' (' + getStatRange(opp.attack) + ')</td><td>' + opp.defense + ' (' + getStatRange(opp.defense) + ')</td><td><button class="btn btn-primary btn-sm" onclick="startMatch(\'' + opp.name + '\', ' + opp.attack + ', ' + opp.defense + ', \'' + difficulty + '\')">선택</button></td></tr>';
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }
  
    // 각 난이도별 상대 렌더링
    renderOpponents(easyOpponents, "easyOpponents", "easy");
    renderOpponents(mediumOpponents, "mediumOpponents", "medium");
    renderOpponents(hardOpponents, "hardOpponents", "hard");

    // 난이도 체크 함수
    function checkDifficultyAccess(difficulty) {
      switch(difficulty) {
        case 'medium':
          if (difficultyWins.easy < 3) {
            alert("애송이 난이도의 복서 3명을 모두 이겨야 중급 난이도에 도전할 수 있습니다!");
            return false;
          }
          break;
        case 'hard':
          if (difficultyWins.medium < 3) {
            alert("중급 난이도의 복서 3명을 모두 이겨야 상급 난이도에 도전할 수 있습니다!");
            return false;
          }
          break;
      }
      return true;
    }

    // 난이도별 경험치 계산 함수
    function calculateExpGain(opponentAttack, opponentDefense, difficulty) {
      var baseExp;
      switch(difficulty) {
        case 'easy':
          baseExp = 15; // 애송이 난이도
          break;
        case 'medium':
          baseExp = 30; // 중급 난이도
          break;
        case 'hard':
          baseExp = 50; // 상급 난이도
          break;
        default:
          baseExp = 15;
      }
      var difficultyBonus = Math.floor((opponentAttack + opponentDefense) / 20);
      return baseExp + difficultyBonus;
    }
  });
  