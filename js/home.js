/* =====================================
   FORMAT HARGA RUPIAH
===================================== */

function formatHomeRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(price);
}


/* =====================================
   TAMPILKAN PAKET UNTUK PENGUNJUNG
===================================== */

async function displayPublicPackages() {
    const packageList = document.getElementById("packageList");
    packageList.replaceChildren();

    try {
        const response = await fetch("api/packages.php");
        const packages = await response.json();

        if (!response.ok) {
            throw new Error(packages.error || "Gagal memuat paket camping.");
        }

        if (!Array.isArray(packages)) {
            throw new Error("Format data paket dari server tidak valid.");
        }

        if (packages.length === 0) {
            packageList.textContent = "Belum ada paket camping yang tersedia.";
            return;
        }

        packages.forEach(item => {
            const card = document.createElement("article");
            card.className = "package-card";

            const image = document.createElement("img");
            image.className = "package-image";
            image.src = item.image;
            image.alt = item.name;

            image.onerror = function () {
                this.style.display = "none";
            };

            const content = document.createElement("div");
            content.className = "package-content";

            const title = document.createElement("h3");
            title.textContent = item.name;

            const description = document.createElement("p");
            description.className = "package-description";
            description.textContent = item.description;

            const capacity = document.createElement("p");
            capacity.className = "package-capacity";
            capacity.textContent = `Kapasitas: ${item.capacity} orang`;

            const price = document.createElement("p");
            price.className = "package-price";
            const priceUnit = item.billingUnit === "trip" ? "perjalanan" : "malam";
            price.textContent = `${formatHomeRupiah(item.price)} / ${priceUnit}`;

            const button = document.createElement("button");
            button.className = "btn-book";
            button.type = "button";
            button.textContent = "Booking Sekarang";

            button.addEventListener("click", function () {
                startBooking(item.id);
            });

            content.append(title, description, capacity, price, button);
            card.append(image, content);
            packageList.appendChild(card);
        });
    } catch (error) {
        console.error("Gagal memuat paket dari database:", error);
        packageList.textContent =
            "Paket camping tidak dapat dimuat. Pastikan server dan koneksi database aktif.";
    }
}


/* =====================================
   MULAI BOOKING
===================================== */

function startBooking(packageId) {
    localStorage.setItem(
        "camprent_selected_package",
        String(packageId)
    );

    const currentUser = JSON.parse(
        sessionStorage.getItem("camprent_current_user")
    );

    if (!currentUser) {
        sessionStorage.setItem(
            "camprent_after_login",
            "booking"
        );

        openAuth("register");
        return;
    }

    if (currentUser.role !== "user") {
        alert("Silakan gunakan akun User untuk melakukan booking.");
        return;
    }

    window.location.href = "user/booking.html";
}


/* =====================================
   JALANKAN HALAMAN HOME
===================================== */

displayPublicPackages();