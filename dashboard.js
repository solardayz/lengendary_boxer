document.addEventListener("DOMContentLoaded", function() {
    // 로컬 스토리지에서 복서 이름 가져오기
    var boxerName = localStorage.getItem("boxerName") || "Unknown Boxer";
    document.getElementById("dashboardTitle").innerText = boxerName + "의 대시보드";
    
    // 로컬 스토리지에서 복서 스탯 가져오기
    var boxerStats = JSON.parse(localStorage.getItem("boxerStats")) || {
      attack: 50,
      defense: 40,
      experience: 0,
      level: 1
    };

    // 스탯 저장 함수
    function saveStats() {
      localStorage.setItem("boxerStats", JSON.stringify(boxerStats));
    }

    // 레벨별 필요 경험치 계산 함수
    function getRequiredExp(level) {
      return level * 10; // 1렙: 10, 2렙: 20, 3렙: 30, ...
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
      document.getElementById("statInfo").innerText = 
        "공격력: " + boxerStats.attack + " (" + getStatRange(boxerStats.attack) + "), " +
        "방어력: " + boxerStats.defense + " (" + getStatRange(boxerStats.defense) + "), " +
        "경험치: " + boxerStats.experience + "/" + nextLevelExp + ", 레벨: " + boxerStats.level;
    }

    // 초기 스탯 표시
    updateStatDisplay();
  
    // Chart.js로 스탯 그래프 그리기 (바 차트)
    var ctx = document.getElementById('statsChart').getContext('2d');
    var statsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['공격력', '방어력', '경험치', '레벨'],
        datasets: [{
          label: '스탯',
          data: [boxerStats.attack, boxerStats.defense, boxerStats.experience, boxerStats.level],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
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
    function addMatchLog(message) {
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
      
      logContainer.innerHTML = matchLogs.map(log => `<div>${log}</div>`).join("");
    }

    // 초기 로그 불러오기
    loadMatchLogs();

    // 로그 초기 표시
    var logContainer = document.getElementById("matchLogs");
    if (logContainer) {
      logContainer.innerHTML = matchLogs.map(log => `<div>${log}</div>`).join("");
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

    // 경기 결과 계산 함수
    function calculateMatchResult(playerStats, opponentStats) {
      var playerScore = (playerStats.attack * 0.6 + playerStats.defense * 0.4);
      var opponentScore = (opponentStats.attack * 0.6 + opponentStats.defense * 0.4);
      
      // 승리 확률 계산 (플레이어 점수가 높을수록 승리 확률이 높아짐)
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
  
    // 레벨업 함수
    function checkLevelUp() {
      var nextLevelExp = boxerStats.level * 100;
      if (boxerStats.experience >= nextLevelExp) {
        boxerStats.level += 1;
        boxerStats.attack += 5;
        boxerStats.defense += 5;
        var levelUpMessage = `레벨업! 공격력과 방어력이 5씩 증가했습니다! (${boxerStats.level-1} → ${boxerStats.level})`;
        addMatchLog(levelUpMessage);
        
        // 스탯 정보 업데이트
        updateStatDisplay();
        
        // 차트 업데이트
        statsChart.data.datasets[0].data = [boxerStats.attack, boxerStats.defense, boxerStats.experience, boxerStats.level];
        statsChart.update();

        // 스탯 저장
        saveStats();
      }
    }
  
    // 난이도별 경험치 계산 함수
    function calculateExpGain(opponentAttack, opponentDefense, difficulty) {
      var baseExp;
      switch(difficulty) {
        case 'easy':
          baseExp = 5;
          break;
        case 'medium':
          baseExp = 10;
          break;
        case 'hard':
          baseExp = 15;
          break;
        default:
          baseExp = 5;
      }
      var difficultyBonus = Math.floor((opponentAttack + opponentDefense) / 20);
      return baseExp + difficultyBonus;
    }
  
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
  
    // 전역 스코프에서 경기 시작 함수 정의
    window.startMatch = function(opponentName, opponentAttack, opponentDefense, difficulty) {
      if (!checkDifficultyAccess(difficulty)) {
        return;
      }

      if (confirm(opponentName + "와(과) 경기를 하시겠습니까?")) {
        // 경기 진행 로직
        var result = calculateMatchResult(boxerStats, {attack: opponentAttack, defense: opponentDefense});
        
        // 경기 로그 추가
        var logMessage = `[${new Date().toLocaleTimeString()}] ${opponentName}와(과)의 경기: ${result.message} (점수: ${result.score})`;
        addMatchLog(logMessage);
        
        // 경험치 획득
        if (result.won) {
          var expGain = calculateExpGain(opponentAttack, opponentDefense, difficulty);
          boxerStats.experience += expGain;
          difficultyWins[difficulty]++;
          saveDifficultyWins();
          
          addMatchLog(`경험치 ${expGain} 획득! (난이도: ${difficulty})`);
          
          // 스탯 정보 업데이트
          updateStatDisplay();
          
          // 차트 업데이트
          statsChart.data.datasets[0].data = [boxerStats.attack, boxerStats.defense, boxerStats.experience, boxerStats.level];
          statsChart.update();

          // 스탯 저장
          saveStats();
          
          // 레벨업 체크
          checkLevelUp();
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
  });
  