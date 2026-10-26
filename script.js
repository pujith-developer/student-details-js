
//  1. saved data

let students = JSON.parse(localStorage.getItem("students")) || [];
let payments = JSON.parse(localStorage.getItem("payments")) || [];


//  2. to Save data

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("payments", JSON.stringify(payments));
}


// 3. Add new student details

function addStudent() {
    let name = document.getElementById("name").value.trim();
    let roll = document.getElementById("roll").value.trim();
    let cls = document.getElementById("className").value.trim();
    let parent = document.getElementById("fathermother").value.trim();
    let feeText = document.getElementById("fee").value;
    let fee = Number(feeText);

    if (!name || !roll || !cls || !parent || feeText === "" || fee < 0) {
        alert("Please enter all details correctly!");
        return;
    }

    if (students.some(s => s.roll.toLowerCase() === roll.toLowerCase())) {
        alert("Roll number already exists!");
        return;
    }

    students.push({
        id: Date.now(),
        name: name,
        roll: roll,
        cls: cls,
        parent: parent,
        fee: fee
    });

    saveData();

    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("className").value = "";
    document.getElementById("fathermother").value = "";
    document.getElementById("fee").value = "";

    showStudents();
}


// 4. Display student details

function showStudents() {
    let list = document.getElementById("studentList");
    let select = document.getElementById("studentSelect");
    let search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";
    select.innerHTML = '<option value="">Select Student</option>';

    students.forEach(s => {
        let paid = payments
            .filter(p => p.studentId === s.id)
            .reduce((sum, p) => sum + p.amount, 0);

        let balance = s.fee - paid;

        select.innerHTML += `
            <option value="${s.id}">${s.name} - ${s.roll}</option>`;

        if ((s.name + s.roll + s.cls + s.parent).toLowerCase().includes(search)) {
            list.innerHTML += `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.roll}</td>
                    <td>${s.cls}</td>
                    <td>${s.parent}</td>
                    <td>₹${s.fee}</td>
                    <td>₹${paid}</td>
                    <td>₹${balance}</td>
                    <td><button onclick="deleteStudent(${s.id})">Delete</button></td>
                </tr>`;
        }
    });

    updateDashboard();
}


// 5. Update student details

function updateDashboard() {
    document.getElementById("totalStudents").textContent = students.length;

    let total = payments.reduce((sum, p) => sum + p.amount, 0);

    document.getElementById("totalFees").textContent = "₹" + total;
}


// 6. Collect student fees

function collectFees() {
    let id = Number(document.getElementById("studentSelect").value);
    let input = document.getElementById("amount");
    let amount = Number(input.value);
    let student = students.find(s => s.id === id);

    if (!student || input.value === "" || amount <= 0) {
        alert("Select student and enter a valid amount!");
        return;
    }

    let paid = payments
        .filter(p => p.studentId === id)
        .reduce((sum, p) => sum + p.amount, 0);

    if (amount > student.fee - paid) {
        alert("Payment exceeds the remaining balance!");
        return;
    }

    payments.push({
        studentId: id,
        name: student.name,
        amount: amount,
        date: new Date().toLocaleDateString()
    });

    saveData();
    input.value = "";

    showStudents();
    showHistory();

    alert("Fees collected successfully!");
}


// 7. Delete student

function deleteStudent(id) {
    if (confirm("Delete this student and their fee history?")) {
        students = students.filter(s => s.id !== id);
        payments = payments.filter(p => p.studentId !== id);

        saveData();
        showStudents();
        showHistory();
    }
}


// 8. Display fee history

function showHistory() {
    let history = document.getElementById("feeHistory");
    let search = document.getElementById("historySearch").value.toLowerCase();

    history.innerHTML = "";

    payments.slice().reverse().filter(p =>
        p.name.toLowerCase().includes(search)
    ).forEach(p => {
        history.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>₹${p.amount}</td>
                <td>${p.date}</td>
            </tr>`;
    });
}

// 
showStudents();
showHistory();
