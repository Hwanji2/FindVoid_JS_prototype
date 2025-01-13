// JSON 데이터 (JavaScript 내부에 직접 선언)
const buildings = [
    { "buildingName": "행정관", "rooms": ["101", "102", "103", "104", "105"] },
    { "buildingName": "경영관", "rooms": ["201", "202", "203", "204"] },
    { "buildingName": "상허연구관", "rooms": ["301", "302", "303"] },
    { "buildingName": "교육과학관", "rooms": ["401", "402", "403", "404"] },
    { "buildingName": "예술디자인관", "rooms": ["501", "502", "503"] },
    { "buildingName": "언어교육원", "rooms": ["601", "602", "603"] },
    { "buildingName": "박물관", "rooms": ["701", "702"] },
    { "buildingName": "법학관", "rooms": ["801", "802", "803", "804"] },
    { "buildingName": "의생명과학연구관", "rooms": ["901", "902", "903"] },
    { "buildingName": "생명과학관", "rooms": ["1001", "1002", "1003"] },
    { "buildingName": "동물생명과학관", "rooms": ["1101", "1102"] },
    { "buildingName": "입학정보관", "rooms": ["1201", "1202"] },
    { "buildingName": "산학협동관", "rooms": ["1301", "1302", "1303"] },
    { "buildingName": "수의학관", "rooms": ["1401", "1402"] },
    { "buildingName": "새천년기념관", "rooms": ["1501", "1502", "1503"] },
    { "buildingName": "건축관", "rooms": ["1601", "1602", "1603"] },
    { "buildingName": "해봉부동산학관", "rooms": ["1701", "1702"] },
    { "buildingName": "인문학관", "rooms": ["1801", "1802"] },
    { "buildingName": "공학관", "rooms": ["1901", "1902", "1903"] },
    { "buildingName": "신공학관", "rooms": ["2001", "2002", "2003"] },
    { "buildingName": "과학관", "rooms": ["2101", "2102", "2103"] },
    { "buildingName": "창의관", "rooms": ["2201", "2202"] }
];

// 예약 데이터 구조 (건물과 강의실별로 관리)
let reservations = {}; // 예: { "행정관-101": [{ day: 0, timeSlot: 9, userId: "user1", purpose: "스터디" }, ...] }

// 건물 선택 옵션 채우기
function populateBuildingOptions() {
    const buildingSelect = document.getElementById("buildingSelect");
    buildings.forEach(building => {
        const option = document.createElement("option");
        option.value = building.buildingName;
        option.textContent = building.buildingName;
        buildingSelect.appendChild(option);
    });
}

// 강의실 선택 옵션 업데이트 및 시간표 표시
function updateRoomOptions() {
    const buildingSelect = document.getElementById("buildingSelect");
    const roomSelect = document.getElementById("roomSelect");
    const timetableSection = document.getElementById("timetable-section");
    
    roomSelect.innerHTML = '<option value="">강의실을 선택하세요</option>'; // 초기화
    timetableSection.style.display = 'none'; // 시간표 숨기기

    const selectedBuilding = buildings.find(b => b.buildingName === buildingSelect.value);
    if (selectedBuilding) {
        selectedBuilding.rooms.forEach(room => {
            const option = document.createElement("option");
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });
    }

    // 강의실 선택 시 시간표 표시
    roomSelect.addEventListener("change", () => {
        if (buildingSelect.value && roomSelect.value) {
            timetableSection.style.display = 'block'; // 시간표 보이기
            generateTimetable();
        }
    });
}
function generateTimetable() {
    const buildingName = document.getElementById("buildingSelect").value;
    const roomId = document.getElementById("roomSelect").value;
    const timetableBody = document.getElementById("timetableBody");

    timetableBody.innerHTML = "";

    if (!buildingName || !roomId) return;

    const roomKey = `${buildingName}-${roomId}`;
    const roomReservations = reservations[roomKey] || [];

    for (let hour = 9; hour <= 17; hour++) {
        const row = document.createElement("tr");

        const timeCell = document.createElement("td");
        timeCell.textContent = `${hour}시`;
        row.appendChild(timeCell);

        for (let day = 0; day < 7; day++) {
            const cell = document.createElement("td");
            const reservation = roomReservations.find((r) => r.day === day && r.timeSlot === hour);
            if (reservation) {
                cell.innerHTML = `
                    <strong>학번: ${reservation.userId}</strong><br>
                    목적: ${reservation.purpose}
                `;
                cell.classList.add("reserved");
            } else {
                cell.textContent = "비어 있음";
            }
            row.appendChild(cell);
        }

        timetableBody.appendChild(row);
    }
}

function makeReservation() {
    const buildingName = document.getElementById("buildingSelect").value;
    const roomId = document.getElementById("roomSelect").value;
    const day = parseInt(document.getElementById("daySelect").value);
    const timeSlot = parseInt(document.getElementById("timeSlotSelect").value);
    const userId = document.getElementById("studentId").value.trim();
    const additionalIds = document.getElementById("additionalIds").value.trim();
    const purpose = document.getElementById("purpose").value.trim();

    // 타입 검사
    if (!buildingName || !roomId || isNaN(day) || isNaN(timeSlot) || !userId || !purpose) {
        alert("모든 입력 값을 채워주세요.");
        return;
    }

    // 학번이 9자리 정수인지 검사
    if (!/^\d{9}$/.test(userId)) {
        alert("학번은 9자리 정수여야 합니다.");
        return;
    }

    const roomKey = `${buildingName}-${roomId}`;
    if (!reservations[roomKey]) reservations[roomKey] = [];

    // 1. 동일한 시간에 이미 다른 사람이 예약한 경우 방지
    const timeSlotOccupied = reservations[roomKey].some(
        (r) => r.day === day && r.timeSlot === timeSlot
    );
    if (timeSlotOccupied) {
        alert("이미 해당 시간에 예약이 되어 있습니다.");
        return;
    }

    // 2. 동일한 날짜에 4시간 이상 예약 방지
    const sameDayReservations = reservations[roomKey].filter((r) => r.day === day && r.userId === userId);
    if (sameDayReservations.length >= 4) {
        alert("동일한 날짜에 4시간 이상 예약할 수 없습니다.");
        return;
    }

    // 예약 데이터 추가
    reservations[roomKey].push({ day, timeSlot, userId, additionalIds, purpose });
    alert("예약이 완료되었습니다.");
    saveReservations();
    generateTimetable();
}




// 예약 데이터 저장
function saveReservations() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

// 예약 데이터 불러오기
function loadReservations() {
    const savedData = localStorage.getItem("reservations");
    if (savedData) {
        reservations = JSON.parse(savedData);
    }
}

// 초기 데이터 로드 및 UI 생성
populateBuildingOptions();
loadReservations();
