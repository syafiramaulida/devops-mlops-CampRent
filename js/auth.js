/* =====================================
   MODAL LOGIN / REGISTER
===================================== */

function openAuth(mode = "login") {
    const modal = document.getElementById("authModal");

    modal.hidden = false;
    modal.classList.add("show");

    if (mode === "register") {
        showRegister();
    } else {
        showLogin();
    }
}

function closeAuth() {
    const modal = document.getElementById("authModal");
    modal.classList.remove("show");
    modal.hidden = true;
}

function showLogin() {
    document.getElementById("loginForm").hidden = false;
    document.getElementById("registerForm").hidden = true;
}

function showRegister() {
    document.getElementById("loginForm").hidden = true;
    document.getElementById("registerForm").hidden = false;
}


/* =====================================
   LOGIN
===================================== */

function login(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(
        localStorage.getItem("camprent_users")
    ) || [];

    const user = users.find(item =>
        item.email.toLowerCase() === email &&
        item.password === password
    );

    if (!user) {
        alert("Email atau password salah.");
        return;
    }

    sessionStorage.setItem(
        "camprent_current_user",
        JSON.stringify(user)
    );

    if (user.role === "admin") {
        window.location.href = "admin/index.html";
        return;
    }

    const nextAction = sessionStorage.getItem("camprent_after_login");

    sessionStorage.removeItem("camprent_after_login");

    if (nextAction === "booking") {
        window.location.href = "user/booking.html";
    } else {
        window.location.href = "user/index.html";
    }
}


/* =====================================
   REGISTER
===================================== */

function register(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const phone = document.getElementById("registerPhone").value.trim();

    let users = JSON.parse(
        localStorage.getItem("camprent_users")
    ) || [];

    if (users.some(user => user.email.toLowerCase() === email)) {
        alert("Email sudah terdaftar. Silakan login.");
        showLogin();
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        role: "user"
    };

    users.push(newUser);

    localStorage.setItem(
        "camprent_users",
        JSON.stringify(users)
    );

    alert("Registrasi berhasil. Silakan login untuk melanjutkan.");

    document.getElementById("loginEmail").value = email;
    document.getElementById("loginPassword").value = "";

    showLogin();
}


/* =====================================
   TUTUP MODAL DENGAN KLIK LATAR
===================================== */

document.addEventListener("click", function (event) {
    const modal = document.getElementById("authModal");

    if (modal && event.target === modal) {
        closeAuth();
    }
});


/* =====================================
   TOMBOL ESC UNTUK MENUTUP MODAL
===================================== */

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        const modal = document.getElementById("authModal");

        if (modal && !modal.hidden) {
            closeAuth();
        }
    }
});
