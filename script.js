const { ipcRenderer } = require('electron');

// ✅ Function to Navigate Between Pages (Works for Electron)
function navigateTo(page) {
    window.location.href = `./${page}.html`; // Ensure paths are correct
}

// ✅ Function to Save Prayer Tracking Details
function saveDetails() {
    const nameField = document.getElementById("child-name");
    const prayerTimesField = document.getElementById("prayer-times");
    const hijriDateField = document.getElementById("hijri-date");

    if (!nameField || !prayerTimesField || !hijriDateField) {
        alert("❌ Error: Form elements not found.");
        return;
    }

    const name = nameField.value.trim();
    const prayerTimesInput = prayerTimesField.value.trim();
    const hijriDate = hijriDateField.value.trim();

    if (!name || !prayerTimesInput || !hijriDate) {
        alert("⚠️ Please fill in all fields before saving.");
        return;
    }

    // ✅ Ensure prayer times are properly formatted
    const prayerTimes = prayerTimesInput
        .split(",")
        .map(time => time.trim())
        .filter(time => time !== "");

    if (prayerTimes.length === 0) {
        alert("⚠️ Please enter valid prayer times.");
        return;
    }

    // ✅ Fetch and Save Structured Data to localStorage
    let records = JSON.parse(localStorage.getItem("prayerRecords")) || [];
    records.push({ name, prayerTimes, hijriDate });
    localStorage.setItem("prayerRecords", JSON.stringify(records));

    alert("✅ Prayer details saved successfully!");

    // ✅ Refresh the reports page dynamically
    if (document.getElementById("report-container")) {
        loadReports();
    }
}

// ✅ Function to Load Prayer Reports Dynamically
function loadReports() {
    const reportContainer = document.getElementById("report-container");

    if (!reportContainer) {
        console.warn("⚠️ Report container not found.");
        return;
    }

    let records = JSON.parse(localStorage.getItem("prayerRecords")) || [];
    reportContainer.innerHTML = ""; // Clear previous content

    if (records.length === 0) {
        reportContainer.innerHTML = "<p class='text-danger text-center'>⚠️ No prayer records found.</p>";
        return;
    }

    // ✅ Create a table dynamically
    let table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-striped", "mt-3");

    let thead = document.createElement("thead");
    thead.classList.add("table-dark");
    thead.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Prayer Times</th>
            <th>Hijri Date</th>
            <th>Actions</th>
        </tr>`;
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    records.forEach((record, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.prayerTimes.join(", ")}</td> 
            <td>${record.hijriDate}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteRecord(${index})">🗑 Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    reportContainer.appendChild(table);
}

// ✅ Function to Delete a Prayer Record
function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem("prayerRecords")) || [];

    if (index < 0 || index >= records.length) {
        alert("❌ Invalid record selected for deletion.");
        return;
    }

    if (confirm("⚠️ Are you sure you want to delete this record?")) {
        records.splice(index, 1);
        localStorage.setItem("prayerRecords", JSON.stringify(records));
        loadReports(); // Refresh the table
    }
}

// ✅ Ensure Reports Load Properly When Page Loads
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("reports.html")) {
        loadReports();
    }
});
