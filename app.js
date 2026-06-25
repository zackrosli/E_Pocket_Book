const profileForm = document.querySelector("#profile-form");
const photoInput = document.querySelector("#photo-input");
const avatarPreview = document.querySelector("#avatar-preview");
const avatarPlaceholder = document.querySelector("#avatar-placeholder");
const toast = document.querySelector("#toast");
const profilePage = document.querySelector("#profile-page");
const pocketPage = document.querySelector("#pocket-page");
const notePage = document.querySelector("#note-page");
const recordsPage = document.querySelector("#records-page");
const supervisorsPage = document.querySelector("#supervisors-page");
const noteText = document.querySelector("#note-text");
const noteForm = document.querySelector("#note-form");
const malaysiaTimeZone = "Asia/Kuala_Lumpur";
let selectedNoteDate = new Date();

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

photoInput.addEventListener("change", () => {
  const [file] = photoInput.files;
  if (!file) return;

  avatarPreview.src = URL.createObjectURL(file);
  avatarPreview.hidden = false;
  avatarPlaceholder.hidden = true;
  showToast("Gambar profil telah dikemas kini.");
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(profileForm));
  localStorage.setItem("memberProfile", JSON.stringify(data));
  showToast("Maklumat berjaya disimpan.");
});

document.querySelector("#pocket-button").addEventListener("click", () => {
  showPage("pocket");
});

document.querySelector("#phone-button").addEventListener("click", () => {
  showToast("Fungsi kemas kini nombor telefon akan ditambah seterusnya.");
});

document.querySelector("#logout-button").addEventListener("click", () => {
  showToast("Anda telah log keluar.");
});

function showPage(page, updateHistory = true) {
  const showPocket = page === "pocket";
  const showNote = page === "note";
  const showRecords = page === "records";
  const showSupervisors = page === "supervisors";
  profilePage.hidden = showPocket || showNote || showRecords || showSupervisors;
  pocketPage.hidden = !showPocket;
  notePage.hidden = !showNote;
  recordsPage.hidden = !showRecords;
  supervisorsPage.hidden = !showSupervisors;
  document.title = showSupervisors
    ? "Penyelia | e-Pocket Book"
    : showRecords
    ? "Rekod Catatan | e-Pocket Book"
    : showNote
      ? "Catatan | e-Pocket Book"
      : showPocket
        ? "e-Pocket Book"
        : "Profil Anggota";
  window.scrollTo(0, 0);
  if (showRecords) renderRecords();

  if (updateHistory) {
    const hash = showSupervisors
      ? "#penyelia"
      : showRecords
        ? "#rekod-catatan"
        : showNote
          ? "#catatan"
          : showPocket
            ? "#e-pocket-book"
            : "#profil";
    history.pushState({ page }, "", hash);
  }
}

document.querySelector("#back-button").addEventListener("click", () => showPage("profile"));
document.querySelector("#bottom-back-button").addEventListener("click", () => showPage("profile"));

document.querySelectorAll("[data-menu]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.menu === "Catatan") {
      showPage("note");
      return;
    }
    if (button.dataset.menu === "Rekod Catatan") {
      showPage("records");
      return;
    }
    if (button.dataset.menu === "Penyelia") {
      showPage("supervisors");
      return;
    }
    showToast(`Menu ${button.dataset.menu} dipilih.`);
  });
});

window.addEventListener("popstate", () => {
  const page = location.hash === "#penyelia"
    ? "supervisors"
    : location.hash === "#rekod-catatan"
    ? "records"
    : location.hash === "#catatan"
      ? "note"
      : location.hash === "#e-pocket-book"
        ? "pocket"
        : "profile";
  showPage(page, false);
});

document.querySelector("#note-back-button").addEventListener("click", () => showPage("pocket"));
document.querySelector("#records-back-button").addEventListener("click", () => showPage("pocket"));
document.querySelector("#records-bottom-back").addEventListener("click", () => showPage("pocket"));
document.querySelector("#supervisors-back-button").addEventListener("click", () => showPage("pocket"));
document.querySelector("#supervisors-bottom-back").addEventListener("click", () => showPage("pocket"));

document.querySelectorAll(".open-member").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#selected-member-name").textContent = button.dataset.member;
    document.querySelector("#selected-member").hidden = false;
  });
});

document.querySelector("#view-member-records").addEventListener("click", () => {
  showPage("records");
});

function updateNoteDate() {
  document.querySelector("#note-day").textContent = new Intl.DateTimeFormat("ms-MY", {
    weekday: "long",
    timeZone: malaysiaTimeZone
  }).format(selectedNoteDate);
  document.querySelector("#note-date").textContent = new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: malaysiaTimeZone
  }).format(selectedNoteDate);
}

function updateLiveTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: malaysiaTimeZone
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  document.querySelector("#note-time").textContent =
    `${values.hour}${values.minute} HRS`;
}

document.querySelector("#previous-day").addEventListener("click", () => {
  selectedNoteDate.setDate(selectedNoteDate.getDate() - 1);
  updateNoteDate();
});

document.querySelector("#next-day").addEventListener("click", () => {
  selectedNoteDate.setDate(selectedNoteDate.getDate() + 1);
  updateNoteDate();
});

document.querySelector("#supervisor-search").addEventListener("click", () => {
  const supervisor = document.querySelector("#supervisor-input").value.trim();
  if (!supervisor) {
    showToast("Masukkan nama atau no. badan penyelia.");
    return;
  }
  document.querySelector("#supervisor-result").hidden = false;
});

noteText.addEventListener("input", () => {
  if (noteText.value.length > 1000) noteText.value = noteText.value.slice(0, 1000);
  document.querySelector("#character-count").textContent = noteText.value.length;
});

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const existingNotes = JSON.parse(localStorage.getItem("pocketNotes") || "[]");
  const note = {
    id: Date.now(),
    bil: existingNotes.length + 1,
    tarikh: selectedNoteDate.toISOString(),
    masa: document.querySelector("#note-time").textContent,
    penyelia: document.querySelector("#supervisor-input").value.trim(),
    catatan: noteText.value.trim()
  };
  existingNotes.push(note);
  localStorage.setItem("pocketNotes", JSON.stringify(existingNotes));
  localStorage.setItem("latestPocketNote", JSON.stringify(note));
  noteText.value = "";
  document.querySelector("#character-count").textContent = "0";
  document.querySelector("#note-number").textContent = existingNotes.length + 1;
  showPage("records");
  showToast("Catatan berjaya disimpan.");
});

function getStoredNotes() {
  const notes = JSON.parse(localStorage.getItem("pocketNotes") || "[]");
  return Array.isArray(notes) ? notes : [];
}

function formatRecordDate(dateString) {
  return new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(dateString));
}

function renderRecords() {
  const fromValue = document.querySelector("#date-from").value;
  const toValue = document.querySelector("#date-to").value;
  const recordsList = document.querySelector("#records-list");
  const emptyRecords = document.querySelector("#empty-records");
  let notes = getStoredNotes();

  if (fromValue) {
    const from = new Date(`${fromValue}T00:00:00`);
    notes = notes.filter((note) => new Date(note.tarikh) >= from);
  }
  if (toValue) {
    const to = new Date(`${toValue}T23:59:59`);
    notes = notes.filter((note) => new Date(note.tarikh) <= to);
  }

  notes.sort((a, b) => new Date(a.tarikh) - new Date(b.tarikh) || a.id - b.id);
  document.querySelector("#records-count").textContent = notes.length;
  recordsList.replaceChildren();
  emptyRecords.hidden = notes.length > 0;

  const groupedNotes = new Map();
  notes.forEach((note) => {
    const dateLabel = formatRecordDate(note.tarikh);
    if (!groupedNotes.has(dateLabel)) groupedNotes.set(dateLabel, []);
    groupedNotes.get(dateLabel).push(note);
  });

  groupedNotes.forEach((dayNotes, dateLabel) => {
    const card = document.createElement("article");
    card.className = "record-card";

    const header = document.createElement("div");
    header.className = "record-card-header";
    const date = document.createElement("strong");
    date.textContent = dateLabel;
    const total = document.createElement("span");
    total.className = "record-day-total";
    total.textContent = `${dayNotes.length} catatan`;
    header.append(date, total);
    card.append(header);

    const columnHeader = document.createElement("div");
    columnHeader.className = "record-column-header";
    ["Bil.", "Masa", "Perkara"].forEach((label) => {
      const heading = document.createElement("span");
      heading.textContent = label;
      columnHeader.append(heading);
    });
    card.append(columnHeader);

    dayNotes.forEach((note) => {
      const body = document.createElement("div");
      body.className = "record-body";
      const number = document.createElement("div");
      number.className = "record-bil";
      number.textContent = String(note.bil).padStart(3, "0");
      const time = document.createElement("div");
      time.className = "record-time";
      time.textContent = note.masa;
      const detail = document.createElement("div");
      detail.className = "record-detail";
      const text = document.createElement("p");
      text.textContent = note.catatan;
      const supervisor = document.createElement("small");
      supervisor.textContent = `Penyelia: ${note.penyelia || "Tidak dinyatakan"}`;
      detail.append(text, supervisor);
      body.append(number, time, detail);
      card.append(body);
    });

    recordsList.append(card);
  });
}

document.querySelector("#records-filter").addEventListener("submit", (event) => {
  event.preventDefault();
  renderRecords();
});

document.querySelector("#reset-filter").addEventListener("click", () => {
  document.querySelector("#records-filter").reset();
  renderRecords();
});

updateNoteDate();
updateLiveTime();
setInterval(updateLiveTime, 1000);

if (location.hash === "#penyelia") {
  showPage("supervisors", false);
} else if (location.hash === "#rekod-catatan") {
  showPage("records", false);
} else if (location.hash === "#catatan") {
  showPage("note", false);
} else if (location.hash === "#e-pocket-book") {
  showPage("pocket", false);
}

const savedProfile = JSON.parse(localStorage.getItem("memberProfile") || "null");
if (savedProfile) {
  Object.entries(savedProfile).forEach(([name, value]) => {
    const field = profileForm.elements.namedItem(name);
    if (field) field.value = value;
  });
}
