const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyeeMUZWITY_AgcoszYGoeqstot35Znztjhy-v84Q6DDrX1liKuTc7twH07qImfSmDp/exec";

async function searchSchool() {
  const region = document.getElementById("region").value;
  const name = document.getElementById("schoolName").value;

  const res = await fetch(
    `${SCRIPT_URL}?type=school&region=${region}&name=${name}`
  );

  const data = await res.json();

  const select = document.getElementById("schoolSelect");
  select.innerHTML = "";

  data.forEach(s => {
    const option = document.createElement("option");

    option.value = s.schoolCode;
    option.textContent = s.schoolName;

    option.dataset.region = s.regionCode;

    select.appendChild(option);
  });
}

async function loadTimetable() {
  const schoolSelect = document.getElementById("schoolSelect");

  const schoolCode = schoolSelect.value;
  const region = schoolSelect.selectedOptions[0].dataset.region;

  const grade = document.getElementById("grade").value;
  const classNm = document.getElementById("classNm").value;

  const dateInput = document.getElementById("date").value;

  const selectedDate = new Date(dateInput);
  const today = new Date();

  const diff =
    (selectedDate - today) / (1000 * 60 * 60 * 24);

  if (diff > 7) {
    alert("최대 일주일까지 조회 가능합니다.");
    return;
  }

  const date =
    dateInput.replaceAll("-", "");

  const res = await fetch(
    `${SCRIPT_URL}?type=timetable` +
    `&region=${region}` +
    `&schoolCode=${schoolCode}` +
    `&grade=${grade}` +
    `&classNm=${classNm}` +
    `&date=${date}`
  );

  const data = await res.json();

  let html = `
    <table>
      <tr>
        <th>교시</th>
        <th>과목</th>
      </tr>
  `;

  data.forEach(t => {
    html += `
      <tr>
        <td>${t.period}</td>
        <td>${t.subject}</td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("result").innerHTML = html;
}
