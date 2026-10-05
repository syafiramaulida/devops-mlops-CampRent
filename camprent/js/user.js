/* ==========================================
   CEK LOGIN USER
========================================== */

const currentUser =
    JSON.parse(
        sessionStorage.getItem(
            "camprent_current_user"
        )
    );


/* ==========================================
   PROTEKSI HALAMAN
========================================== */

if (!currentUser) {

    window.location.href = "../index.html";

}


/* ==========================================
   CEK ROLE
========================================== */

if (
    currentUser &&
    currentUser.role !== "user"
) {

    window.location.href = "../admin/index.html";

}


/* ==========================================
   TAMPILKAN NAMA USER
========================================== */

function displayUserName() {

    const userName =
        document.getElementById("userName");


    if (userName && currentUser) {

        userName.textContent =
            currentUser.name;

    }

}


/* ==========================================
   MENAMPILKAN PAKET
========================================== */

function displayPackages() {

    const packageList =
        document.getElementById(
            "packageList"
        );


    if (!packageList) {

        return;

    }


    const packages =
        JSON.parse(
            localStorage.getItem(
                "camprent_packages"
            )
        ) || [];


    const activePackages =
        packages.filter(function(item) {

            return item.status === "active";

        });


    if (activePackages.length === 0) {

        packageList.innerHTML = `

            <div class="empty-state">

                <h3>
                    Belum ada paket
                </h3>

                <p>
                    Saat ini belum tersedia
                    paket camping.
                </p>

            </div>

        `;

        return;

    }


    packageList.innerHTML = "";


    activePackages.forEach(function(item) {

        const card =
            document.createElement("div");


        card.className =
            "package-card";


        card.innerHTML = `

            <img
                src="../${item.image}"
                alt="${item.name}"
                class="package-image"
            >


            <div class="package-content">

                <h3>
                    ${item.name}
                </h3>


                <p class="package-description">

                    ${item.description}

                </p>


                <p class="package-capacity">

                    Kapasitas:
                    ${item.capacity}
                    orang

                </p>


                <div class="package-price">

                    ${formatRupiah(item.price)}
                    / malam

                </div>


                <button
                    class="btn-book"
                    onclick="goToBooking(${item.id})"
                >

                    Booking Sekarang

                </button>

            </div>

        `;


        packageList.appendChild(card);

    });

}


/* ==========================================
   FORMAT RUPIAH
========================================== */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* ==========================================
   KE HALAMAN BOOKING
========================================== */

function goToBooking(packageId) {

    localStorage.setItem(
        "camprent_selected_package",
        packageId
    );


    window.location.href =
        "booking.html";

}


/* ==========================================
   LOGOUT
========================================== */

function logout() {

    const confirmation =
        confirm(
            "Apakah kamu yakin ingin logout?"
        );


    if (!confirmation) {

        return;

    }


    sessionStorage.removeItem(
        "camprent_current_user"
    );


    window.location.href =
        "../index.html";

}


/* ==========================================
   JALANKAN PROGRAM
========================================== */

displayUserName();

displayPackages();