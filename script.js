// 인트로 페이지 로딩 시 로컬 스토리지에 복서 이름이 있으면 바로 대시보드로 이동
if(localStorage.getItem("boxerName")){
  window.location.href = "dashboard.html";
}

// 복서 선택 버튼 클릭 시 동작 처리
document.getElementById("selectBoxer").addEventListener("click", function() {
  var name = document.getElementById("boxerName").value.trim();
  if(name === ""){
    alert("복서 이름을 입력해주세요!");
    return;
  }
  
  // 기존 스탯 불러오기
  var existingStats = localStorage.getItem("boxerStats");
  var boxerStats;
  
  if (existingStats) {
    boxerStats = JSON.parse(existingStats);
  } else {
    // 새로운 복서인 경우 기본 스탯 설정
    boxerStats = {
      attack: 50,
      defense: 40,
      experience: 0,
      level: 1
    };
  }
  
  // 복서 이름 저장
  localStorage.setItem("boxerName", name);
  localStorage.setItem("boxerStats", JSON.stringify(boxerStats));
  
  // 대시보드 페이지로 이동
  window.location.href = "dashboard.html";
});
