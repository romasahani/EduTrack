// config.js
const BASE_URL = "https://edutrack-w7uz.onrender.com";
const API_STUDENTS   = `${BASE_URL}/students`;
const API_TEACHERS   = `${BASE_URL}/teachers`;
const API_CLASSES    = `${BASE_URL}/classes`;
const API_ATTENDANCE = `${BASE_URL}/attendance`;

let allStudents = [], allTeachers = [], allClasses = [], allAttendance = [];

// ───── TOAST ─────
function showToast(msg, type = "info") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove("show"), 3000);
}

// ───── SECTION NAVIGATION ─────
function showSection(name) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    document.getElementById(`section-${name}`).classList.add("active");
    document.querySelector(`[data-section="${name}"]`).classList.add("active");

    const titles = {
        students: ["Students", "Manage enrolled students"],
        teachers: ["Teachers", "Manage faculty members"],
        classes:  ["Classes", "View and schedule classes"],
        attendance: ["Attendance", "Track student attendance"]
    };
    document.getElementById("pageTitle").textContent = titles[name][0];
    document.getElementById("pageSubtitle").textContent = titles[name][1];
}

// ───── COUNTS ─────
async function loadCounts() {
    try {
        const [s, t, c, a] = await Promise.all([
            fetch(API_STUDENTS).then(r => r.json()),
            fetch(API_TEACHERS).then(r => r.json()),
            fetch(API_CLASSES).then(r => r.json()),
            fetch(API_ATTENDANCE).then(r => r.json())
        ]);
        document.getElementById("totalStudents").textContent = s.length;
        document.getElementById("totalTeachers").textContent = t.length;
        document.getElementById("totalClasses").textContent  = c.length;
        document.getElementById("totalAttendance").textContent = a.length;
    } catch(e) {
        console.error("Count load failed:", e);
    }
}

// ───── STUDENTS ─────
function addStudent() {
    const name       = document.getElementById("name").value.trim();
    const department = document.getElementById("dept").value.trim();
    const year       = document.getElementById("year").value;
    if (!name || !department || !year) return showToast("Please fill all fields", "error");

    fetch(API_STUDENTS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, department, year })
    }).then(r => {
        if (!r.ok) throw new Error();
        document.getElementById("name").value = "";
        document.getElementById("dept").value = "";
        document.getElementById("year").value = "";
        showToast(`Student "${name}" added`, "success");
        loadStudents();
        loadCounts();
    }).catch(() => showToast("Failed to add student", "error"));
}

function loadStudents() {
    fetch(API_STUDENTS).then(r => r.json()).then(data => {
        allStudents = data;
        renderStudents(data);
    }).catch(() => showToast("Could not load students", "error"));
}

function renderStudents(data) {
    const tbody = document.getElementById("studentTable");
    const empty = document.getElementById("emptyStudents");
    tbody.innerHTML = "";
    if (!data.length) { empty.classList.add("visible"); return; }
    empty.classList.remove("visible");
    data.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${s.id}</td>
            <td><span class="name">${esc(s.name)}</span></td>
            <td>${esc(s.department)}</td>
            <td><span class="year-chip">${s.year}</span></td>
            <td><div class="actions-cell">
                <button class="btn-icon" title="Edit" onclick="openEditStudent(${s.id},'${esc(s.name)}','${esc(s.department)}',${s.year})">✎</button>
                <button class="btn-icon del" title="Delete" onclick="deleteStudent(${s.id})">✕</button>
            </div></td>`;
        tbody.appendChild(tr);
    });
}

function filterStudents() {
    const q = document.getElementById("searchStudents").value.toLowerCase();
    renderStudents(allStudents.filter(s =>
        s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q)
    ));
}

function openEditStudent(id, name, dept, year) {
    document.getElementById("modalTitle").textContent = "Edit Student";
    document.getElementById("modalBody").innerHTML = `
        <div class="field-group"><label>Full Name</label><input id="m_name" value="${name}"></div>
        <div class="field-group"><label>Department</label><input id="m_dept" value="${dept}"></div>
        <div class="field-group"><label>Year</label><input type="number" id="m_year" value="${year}" min="1" max="4"></div>`;
    document.getElementById("modalSaveBtn").onclick = () => {
        const n = document.getElementById("m_name").value.trim();
        const d = document.getElementById("m_dept").value.trim();
        const y = document.getElementById("m_year").value;
        if (!n || !d || !y) return showToast("Fill all fields", "error");
        fetch(`${API_STUDENTS}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: n, department: d, year: y })
        }).then(() => { closeModal(); showToast("Student updated", "success"); loadStudents(); loadCounts(); })
          .catch(() => showToast("Update failed", "error"));
    };
    openModal();
}

function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    fetch(`${API_STUDENTS}/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            return res.text();
        })
        .then(() => {
            showToast("Student deleted", "info");
            loadStudents();
            loadCounts();
        })
        .catch(() => showToast("Delete failed", "error"));
}

// ───── TEACHERS ─────
function addTeacher() {
    const name       = document.getElementById("tname").value.trim();
    const department = document.getElementById("tdept").value.trim();
    if (!name || !department) return showToast("Please fill all fields", "error");

    fetch(API_TEACHERS, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, department })
    }).then(() => {
        document.getElementById("tname").value = "";
        document.getElementById("tdept").value = "";
        showToast(`Teacher "${name}" added`, "success");
        loadTeachers(); loadCounts();
    }).catch(() => showToast("Failed to add teacher", "error"));
}

function loadTeachers() {
    fetch(API_TEACHERS).then(r => r.json()).then(data => {
        allTeachers = data;
        renderTeachers(data);
    });
}

function renderTeachers(data) {
    const tbody = document.getElementById("teacherTable");
    const empty = document.getElementById("emptyTeachers");
    tbody.innerHTML = "";
    if (!data.length) { empty.classList.add("visible"); return; }
    empty.classList.remove("visible");
    data.forEach(t => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${t.id}</td>
            <td><span class="name">${esc(t.name)}</span></td>
            <td>${esc(t.department)}</td>
            <td><div class="actions-cell">
                <button class="btn-icon" onclick="openEditTeacher(${t.id},'${esc(t.name)}','${esc(t.department)}')">✎</button>
                <button class="btn-icon del" onclick="deleteTeacher(${t.id})">✕</button>
            </div></td>`;
        tbody.appendChild(tr);
    });
}

function filterTeachers() {
    const q = document.getElementById("searchTeachers").value.toLowerCase();
    renderTeachers(allTeachers.filter(t =>
        t.name.toLowerCase().includes(q) || t.department.toLowerCase().includes(q)
    ));
}

function openEditTeacher(id, name, dept) {
    document.getElementById("modalTitle").textContent = "Edit Teacher";
    document.getElementById("modalBody").innerHTML = `
        <div class="field-group"><label>Full Name</label><input id="m_tname" value="${name}"></div>
        <div class="field-group"><label>Department</label><input id="m_tdept" value="${dept}"></div>`;
    document.getElementById("modalSaveBtn").onclick = () => {
        const n = document.getElementById("m_tname").value.trim();
        const d = document.getElementById("m_tdept").value.trim();
        if (!n || !d) return showToast("Fill all fields", "error");
        fetch(`${API_TEACHERS}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: n, department: d })
        }).then(() => { closeModal(); showToast("Teacher updated", "success"); loadTeachers(); loadCounts(); });
    };
    openModal();
}

function deleteTeacher(id) {
    if (!confirm("Delete this teacher?")) return;

    fetch(`${API_TEACHERS}/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            showToast("Teacher deleted", "info");
            loadTeachers();
            loadCounts();
        })
        .catch(() => showToast("Delete failed", "error"));
}

// ───── CLASSES ─────
function addClass() {
    const subject    = document.getElementById("subject").value.trim();
    const date       = document.getElementById("date").value;
    const teacher_id = document.getElementById("teacher_id").value;
    if (!subject || !date || !teacher_id) return showToast("Please fill all fields", "error");

    fetch(API_CLASSES, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ subject, date, teacher_id })
    }).then(() => {
        document.getElementById("subject").value = "";
        document.getElementById("date").value = "";
        document.getElementById("teacher_id").value = "";
        showToast(`Class "${subject}" scheduled`, "success");
        loadClasses(); loadCounts();
    }).catch(() => showToast("Failed to add class", "error"));
}

function loadClasses() {
    fetch(API_CLASSES).then(r => r.json()).then(data => {
        allClasses = data;
        const tbody = document.getElementById("classTable");
        const empty = document.getElementById("emptyClasses");
        tbody.innerHTML = "";
        if (!data.length) { empty.classList.add("visible"); return; }
        empty.classList.remove("visible");
        data.forEach(c => {
            const tr = document.createElement("tr");
            const formatted = c.date ? new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : c.date;
            tr.innerHTML = `
                <td>#${c.id}</td>
                <td><span class="name">${esc(c.subject)}</span></td>
                <td>${formatted}</td>
                <td>#${c.teacher_id}</td>
                <td><div class="actions-cell">
                    <button class="btn-icon" onclick="openEditClass(${c.id},'${esc(c.subject)}','${c.date}',${c.teacher_id})">✎</button>
                    <button class="btn-icon del" onclick="deleteClass(${c.id})">✕</button>
                </div></td>`;
            tbody.appendChild(tr);
        });
    });
}

function openEditClass(id, subject, date, teacher_id) {
    document.getElementById("modalTitle").textContent = "Edit Class";
    document.getElementById("modalBody").innerHTML = `
        <div class="field-group"><label>Subject</label><input id="m_subject" value="${subject}"></div>
        <div class="field-group"><label>Date</label><input type="date" id="m_date" value="${date}"></div>
        <div class="field-group"><label>Teacher ID</label><input type="number" id="m_tid" value="${teacher_id}"></div>`;
    document.getElementById("modalSaveBtn").onclick = () => {
        const s = document.getElementById("m_subject").value.trim();
        const d = document.getElementById("m_date").value;
        const t = document.getElementById("m_tid").value;
        if (!s || !d || !t) return showToast("Fill all fields", "error");
        fetch(`${API_CLASSES}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ subject: s, date: d, teacher_id: t })
        }).then(() => { closeModal(); showToast("Class updated", "success"); loadClasses(); loadCounts(); });
    };
    openModal();
}

function deleteClass(id) {
    if (!confirm("Delete this class?")) return;

    fetch(`${API_CLASSES}/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            showToast("Class deleted", "info");
            loadClasses();
            loadCounts();
        })
        .catch(() => showToast("Delete failed", "error"));
}

// ───── ATTENDANCE ─────
function addAttendance() {
    const student_id = document.getElementById("student_id").value;
    const class_id   = document.getElementById("class_id").value;
    const status     = document.getElementById("status").value;
    if (!student_id || !class_id) return showToast("Please fill all fields", "error");

    fetch(API_ATTENDANCE, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ student_id, class_id, status })
    }).then(() => {
        document.getElementById("student_id").value = "";
        document.getElementById("class_id").value = "";
        showToast(`Attendance marked: ${status}`, "success");
        loadAttendance(); loadCounts();
    }).catch(() => showToast("Failed to mark attendance", "error"));
}

function loadAttendance() {
    fetch(API_ATTENDANCE).then(r => r.json()).then(data => {
        allAttendance = data;
        const tbody = document.getElementById("attendanceTable");
        const empty = document.getElementById("emptyAttendance");
        tbody.innerHTML = "";

        // Stats
        const present = data.filter(a => a.status === "Present").length;
        const absent  = data.filter(a => a.status === "Absent").length;
        const rate    = data.length ? Math.round((present / data.length) * 100) : 0;
        document.getElementById("attendanceStats").innerHTML = `
            <div class="att-stat-card">
                <div class="att-stat-label">Present</div>
                <div class="att-stat-value green">${present}</div>
            </div>
            <div class="att-stat-card">
                <div class="att-stat-label">Absent</div>
                <div class="att-stat-value rose">${absent}</div>
            </div>
            <div class="att-stat-card">
                <div class="att-stat-label">Attendance Rate</div>
                <div class="att-stat-value blue">${rate}%</div>
            </div>`;

        if (!data.length) { empty.classList.add("visible"); return; }
        empty.classList.remove("visible");
        data.forEach(a => {
            const tr = document.createElement("tr");
            const badge = a.status === "Present"
                ? `<span class="badge badge-present">✓ Present</span>`
                : `<span class="badge badge-absent">✗ Absent</span>`;
            tr.innerHTML = `
                <td>#${a.id}</td>
                <td>#${a.student_id}</td>
                <td>#${a.class_id}</td>
                <td>${badge}</td>
                <td><div class="actions-cell">
                    <button class="btn-icon" onclick="openEditAttendance(${a.id},${a.student_id},${a.class_id},'${a.status}')">✎</button>
                    <button class="btn-icon del" onclick="deleteAttendance(${a.id})">✕</button>
                </div></td>`;
            tbody.appendChild(tr);
        });
    });
}

function openEditAttendance(id, student_id, class_id, status) {
    document.getElementById("modalTitle").textContent = "Edit Attendance";
    document.getElementById("modalBody").innerHTML = `
        <div class="field-group"><label>Status</label>
        <select id="m_status">
            <option value="Present" ${status === 'Present' ? 'selected' : ''}>Present</option>
            <option value="Absent"  ${status === 'Absent'  ? 'selected' : ''}>Absent</option>
        </select></div>`;
    document.getElementById("modalSaveBtn").onclick = () => {
        const s = document.getElementById("m_status").value;
        fetch(`${API_ATTENDANCE}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ student_id, class_id, status: s })
        }).then(() => { closeModal(); showToast("Attendance updated", "success"); loadAttendance(); loadCounts(); });
    };
    openModal();
}

function deleteAttendance(id) {
    if (!confirm("Delete this record?")) return;

    fetch(`${API_ATTENDANCE}/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            showToast("Record deleted", "info");
            loadAttendance();
            loadCounts();
        })
        .catch(() => showToast("Delete failed", "error"));
}

// ───── MODAL ─────
function openModal()  { document.getElementById("modalOverlay").classList.add("open"); }
function closeModal() { document.getElementById("modalOverlay").classList.remove("open"); }

// ───── UTILS ─────
function esc(str) {
    return String(str)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;")
        .replace(/'/g,"&#39;");
}

// ───── INIT ─────
loadStudents();
loadTeachers();
loadClasses();
loadAttendance();
loadCounts();
