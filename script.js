// 복서 선택 버튼 클릭 시 동작 처리
document.getElementById("selectBoxer").addEventListener("click", function() {
    var name = document.getElementById("boxerName").value.trim();
    if (name === "") {
      alert("복서 이름을 입력해주세요!");
      return;
    }
    // 입력한 이름을 로컬 스토리지에 저장 후 대시보드로 이동
    localStorage.setItem("boxerName", name);
    window.location.href = "dashboard.html";
  });
  