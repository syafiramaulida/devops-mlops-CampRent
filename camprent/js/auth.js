/* ==========================================
   MENAMPILKAN FORM LOGIN
========================================== */

function showLogin() {

    document.getElementById("loginForm").style.display = "block";

    document.getElementById("registerForm").style.display = "none";

}


/* ==========================================
   MENAMPILKAN FORM REGISTER
========================================== */

function showRegister() {

    document.getElementById("loginForm").style.display = "none";

    document.getElementById("registerForm").style.display = "block";

}


/* ==========================================
   LOGIN
========================================== */

function login(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const users =
        JSON.parse(
            localStorage.getItem("camprent_users")
        ) || [];


    const user = users.find(function(item) {

        return (
            item.email === email &&
            item.password === password
        );

    });


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

    } else {

        window.location.href = "user/index.html";

    }

}


/* ==========================================
   REGISTER USER
========================================== */

function register(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const phone =
        document.getElementById("registerPhone").value.trim();


    let users =
        JSON.parse(
            localStorage.getItem("camprent_users")
        ) || [];


    const emailExists = users.some(function(user) {

        return user.email === email;

    });


    if (emailExists) {

        alert("Email sudah terdaftar.");

        return;

    }


    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password,

        phone: phone,

        role: "user"

    };


    users.push(newUser);


    localStorage.setItem(
        "camprent_users",
        JSON.stringify(users)
    );


    alert("Registrasi berhasil. Silakan login.");


    showLogin();

}