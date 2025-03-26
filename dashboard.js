document.addEventListener("DOMContentLoaded", function() {
    // 로컬 스토리지에서 복서 이름 가져오기
    var boxerName = localStorage.getItem("boxerName") || "Unknown Boxer";
    document.getElementById("dashboardTitle").innerText = boxerName + "의 대시보드";
    
    // 복서의 기본 스탯 (예시 값)
    var boxerStats = {
      attack: 50,
      defense: 40,
      experience: 0,
      level: 1
    };
  
    // 스탯 정보를 텍스트로 표시
    document.getElementById("statInfo").innerText = 
      "공격력: " + boxerStats.attack + ", 방어력: " + boxerStats.defense + 
      ", 경험치: " + boxerStats.experience + ", 레벨: " + boxerStats.level;
  
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
          y: { beginAtZero: true }
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
  
    // 함수: 상대 데이터를 받아 테이블 생성
    function renderOpponents(opponents, containerId) {
      var container = document.getElementById(containerId);
      var html = '<table class="table table-dark table-striped opponent-table">';
      html += '<thead><tr><th>이름</th><th>공격력</th><th>방어력</th></tr></thead><tbody>';
      opponents.forEach(function(opp) {
        html += '<tr><td>' + opp.name + '</td><td>' + opp.attack + '</td><td>' + opp.defense + '</td></tr>';
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }
  
    // 각 난이도별 상대 렌더링
    renderOpponents(easyOpponents, "easyOpponents");
    renderOpponents(mediumOpponents, "mediumOpponents");
    renderOpponents(hardOpponents, "hardOpponents");
  });
  