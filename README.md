# 🏫 강의실 예약 시스템

## 📄 프로젝트 소개
이 프로젝트는 **웹 기반 강의실 예약 시스템**으로, 사용자가 캠퍼스 내 다양한 건물의 강의실을 예약할 수 있도록 지원합니다.  
사용자는 건물과 강의실을 동적으로 선택할 수 있으며, 실시간으로 시간표를 확인하고 예약할 수 있습니다.  
또한 **예약 충돌 방지**, **예약 제한 조건 처리**, **로컬 스토리지를 활용한 데이터 저장**과 같은 기능을 포함하여 최적화된 사용자 경험을 제공합니다.

---

## 📂 파일 구조

root/
├── index.html              # Main HTML file containing the UI
├── style.css               # CSS for styling the UI
└── script.js               # JavaScript logic for reservation management


### **1. `index.html`**
- 사용자 인터페이스를 구성하는 주요 HTML 구조를 포함합니다.
  - **건물 선택**, **강의실 선택**, **요일 및 시간 선택**, **학번 입력**, **목적 입력** 등의 요소로 구성된 폼이 포함되어 있습니다.
  - 예약 확인 및 시간표 표시를 위한 섹션이 포함되어 있습니다.

### **2. `style.css`**
- 폼, 드롭다운 메뉴, 시간표 등의 UI 요소를 스타일링합니다.
- 예약된 시간 슬롯에 대해 **시각적 구분**(예: 배경색 변경)을 제공합니다.

### **3. `script.js`**
- 강의실 예약 시스템의 전체 로직이 구현된 JavaScript 파일입니다.
- 주요 기능:
  - **건물 및 강의실 선택 옵션 동적 생성**
  - **실시간 시간표 생성**
  - **예약 데이터 저장 및 불러오기**
  - **예약 충돌 및 예외 처리**

---

## 🚀 주요 기능 설명

### **1. 건물 및 강의실 선택**
- `buildings` 배열에 모든 건물과 강의실 정보를 JSON 형식으로 저장하고, 이를 바탕으로 드롭다운 메뉴를 동적으로 생성합니다.
- 사용자가 건물을 선택하면 해당 건물에 포함된 강의실 옵션이 자동으로 갱신됩니다.

```javascript
function populateBuildingOptions() {
    const buildingSelect = document.getElementById("buildingSelect");
    buildings.forEach(building => {
        const option = document.createElement("option");
        option.value = building.buildingName;
        option.textContent = building.buildingName;
        buildingSelect.appendChild(option);
    });
}

2. 실시간 시간표 생성
선택된 건물과 강의실에 대해 시간표를 실시간으로 생성하여 예약 상태를 시각적으로 표시합니다.
예약이 있는 경우 **예약 정보(학번, 목적)**를 표시하며, 빈 시간 슬롯은 "비어 있음"으로 표시됩니다.
javascript
function generateTimetable() {
    const roomKey = `${buildingName}-${roomId}`;
    const roomReservations = reservations[roomKey] || [];
    
    for (let hour = 9; hour <= 17; hour++) {
        const reservation = roomReservations.find((r) => r.day === day && r.timeSlot === hour);
        if (reservation) {
            cell.innerHTML = `<strong>학번: ${reservation.userId}</strong><br>목적: ${reservation.purpose}`;
        } else {
            cell.textContent = "비어 있음";
        }
    }
}

3. 예약 기능
사용자가 선택한 건물, 강의실, 요일, 시간, 학번, 목적을 입력하면 예약 데이터를 추가합니다.
예약 시 다음 예외 사항을 고려하여 처리합니다:
동일한 시간에 중복 예약 방지
이미 해당 시간에 다른 사용자가 예약한 경우 오류 메시지를 출력하고 예약을 차단합니다.
동일한 날 4시간 이상 예약 방지
동일한 사용자가 동일한 날에 4시간 이상 예약하는 것을 방지합니다.
학번 형식 검증
학번은 9자리 숫자여야 하며, 이를 만족하지 않으면 예약을 차단합니다.
javascript
function makeReservation() {
    if (timeSlotOccupied) {
        alert("이미 해당 시간에 예약이 되어 있습니다.");
        return;
    }

    if (sameDayReservations.length >= 4) {
        alert("동일한 날짜에 4시간 이상 예약할 수 없습니다.");
        return;
    }

    if (!/^\d{9}$/.test(userId)) {
        alert("학번은 9자리 정수여야 합니다.");
        return;
    }
    
    reservations[roomKey].push({ day, timeSlot, userId, additionalIds, purpose });
    alert("예약이 완료되었습니다.");
    saveReservations();
    generateTimetable();
}

4. 예약 데이터 저장 및 불러오기
**localStorage**를 활용하여 예약 데이터를 브라우저에 저장하고, 프로그램 초기화 시 데이터를 불러와 지속적인 관리가 가능합니다.
javascript
function saveReservations() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

function loadReservations() {
    const savedData = localStorage.getItem("reservations");
    if (savedData) {
        reservations = JSON.parse(savedData);
    }
}

🛠️ 기존 시스템 대비 발전된 점
1. 동적 UI 구성
기존 시스템에서는 사용자가 직접 강의실을 입력해야 했지만, 본 시스템은 드롭다운 메뉴를 통해 편리하게 선택할 수 있습니다.
2. 예약 제한 기능 추가
동일한 시간 중복 예약 방지 및 하루 최대 예약 시간 제한 기능을 추가하여 공정한 예약 환경을 보장합니다.
3. 데이터 지속성 제공
기존 시스템은 새로고침 시 데이터가 초기화되었으나, 본 시스템은 로컬 스토리지를 활용하여 데이터 지속성을 제공합니다.
4. 예외 처리 강화
입력 데이터(학번, 시간, 목적 등)에 대한 유효성 검사 및 오류 처리를 강화하여 안정성을 높였습니다.
🔧 사용 방법
프로그램 실행

브라우저에서 index.html 파일을 열어 실행합니다.
건물 및 강의실 선택

원하는 건물과 강의실을 드롭다운 메뉴에서 선택합니다.
예약 입력

요일, 시간, 학번, 목적을 입력한 후 예약 버튼을 클릭하여 예약을 완료합니다.
예약 확인

선택한 강의실의 예약 현황을 시간표에서 실시간으로 확인할 수 있습니다.
데이터 저장 및 불러오기

프로그램을 종료한 후 다시 실행하면 이전 예약 데이터가 자동으로 불러와집니다.
📌 참고 사항
본 시스템은 Chrome, Firefox와 같은 최신 브라우저에서 최적의 성능을 보장합니다.
각 강의실은 9시~17시까지 예약할 수 있으며, 시간 단위로 예약이 가능합니다.
코드 복사





