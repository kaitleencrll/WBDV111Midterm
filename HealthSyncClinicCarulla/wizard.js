const specialties = [
  { id: "cardiology", label: "Cardiology" },
  { id: "dermatology", label: "Dermatology" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "orthopedics", label: "Orthopedics" }
];

const doctors = [
  { id: "d1", name: "Dr. Baizhu", specialtyId: "cardiology" },
  { id: "d2", name: "Dr. Dottore", specialtyId: "cardiology" },
  { id: "d3", name: "Dr. Veritas Ratio", specialtyId: "dermatology" },
  { id: "d4", name: "Dr. Shoko Ieiri", specialtyId: "dermatology" },
  { id: "d5", name: "Dr. Luuk Herssen", specialtyId: "pediatrics" },
  { id: "d6", name: "Dr. Dan Heng", specialtyId: "pediatrics" },
  { id: "d7", name: "Dr. Kafka", specialtyId: "orthopedics" },
  { id: "d8", name: "Dr. Blade", specialtyId: "orthopedics" }
];

let state = {
  step: 0,
  specialtyId: "",
  specialty: "",
  doctor: "",
  date: "",
  time: ""
};

const wizardScreen = document.getElementById("wizardScreen");
const wizardQuestion = document.getElementById("wizardQuestion");
const stepLabel = document.getElementById("stepLabel");
const progressFill = document.getElementById("progressFill");

const summarySpecialty = document.getElementById("summarySpecialty");
const summaryDoctor = document.getElementById("summaryDoctor");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");
const resumeNotice = document.getElementById("resumeNotice");

document.getElementById("nextButton").onclick = nextStep;
document.getElementById("backButton").onclick = prevStep;

function save() {
  localStorage.setItem("wizard", JSON.stringify(state));
}

function load() {
  const data = localStorage.getItem("wizard");
  if (data) state = JSON.parse(data);
}

function updateSummary() {
  summarySpecialty.textContent = state.specialty || "Not selected";
  summaryDoctor.textContent = state.doctor || "Not selected";
  summaryDate.textContent = state.date || "Not selected";
  summaryTime.textContent = state.time || "Not selected";
  resumeNotice.textContent = "Progress auto-saved.";
}

function render() {
  save();
  updateSummary();

  stepLabel.textContent = "Step " + (state.step + 1) + " of 4";
  progressFill.style.width = ((state.step + 1) / 4 * 100) + "%";

  if (state.step === 0) {
    wizardQuestion.textContent = "Select a specialty";
    wizardScreen.innerHTML = specialties.map(s => `
      <div class="choice-card ${state.specialtyId === s.id ? 'active' : ''}"
           onclick="selectSpecialty('${s.id}','${s.label}')">
        <h3>${s.label}</h3>
      </div>
    `).join("");
  }

  if (state.step === 1) {
    wizardQuestion.textContent = "Choose a doctor";
    const filtered = doctors.filter(d => d.specialtyId === state.specialtyId);

    wizardScreen.innerHTML = filtered.map(d => `
      <div class="choice-card ${state.doctor === d.name ? 'active' : ''}"
           onclick="selectDoctor('${d.name}')">
        <h3>${d.name}</h3>
      </div>
    `).join("");
  }

  if (state.step === 2) {
    wizardQuestion.textContent = "Pick a date";
    wizardScreen.innerHTML = `
      <input type="date" value="${state.date}" 
      onchange="selectDate(this.value)" 
      style="padding:10px;width:100%;">
    `;
  }

  if (state.step === 3) {
    wizardQuestion.textContent = "Pick a time";

    const times = ["09:00 AM","11:00 AM","01:00 PM","03:00 PM"];

    wizardScreen.innerHTML = times.map(t => `
      <div class="choice-card ${state.time === t ? 'active' : ''}" 
           onclick="selectTime('${t}')">
        ${t}
      </div>
    `).join("");
  }
}

function nextStep() {
  if (state.step === 0 && !state.specialtyId) return alert("Select a specialty");
  if (state.step === 1 && !state.doctor) return alert("Select a doctor");
  if (state.step === 2 && !state.date) return alert("Select a date");
  if (state.step === 3 && !state.time) return alert("Select a time");

  if (state.step < 3) {
    state.step++;
    render();
  } else {
    alert("Appointment Confirmed!");
    localStorage.removeItem("wizard");
    location.reload();
  }
}

function prevStep() {
  if (state.step > 0) {
    state.step--;
    render();
  }
}

function selectSpecialty(id,label) {
  state.specialtyId = id;
  state.specialty = label;
  state.doctor = "";
  state.date = "";
  state.time = "";
  render();
}

function selectDoctor(name) {
  state.doctor = name;
  render();
}

function selectDate(date) {
  state.date = date;
}

function selectTime(time) {
  state.time = time;
  render();
}

load();
render();