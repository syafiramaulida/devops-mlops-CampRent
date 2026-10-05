/* ==========================================
   CEK LOGIN ADMIN
========================================== */

const adminUser =
    JSON.parse(
        sessionStorage.getItem(
            "camprent_current_user"
        )
    );


if (!adminUser) {

    window.location.href =
        "../index.html";

}


if (
    adminUser &&
    adminUser.role !== "admin"
) {

    window.location.href =
        "../user/index.html";

}


/* ==========================================
   ELEMENT ADMIN
========================================== */

const adminName =
    document.getElementById(
        "adminName"
    );


/* ==========================================
   TAMPILKAN NAMA ADMIN
========================================== */

if (adminName && adminUser) {

    adminName.textContent =
        adminUser.name;

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
   STATUS CLASS
========================================== */

function getStatusClass(status) {

    const statusClass = {

        "Menunggu":
            "status-menunggu",

        "Dikonfirmasi":
            "status-dikonfirmasi",

        "Diproses":
            "status-diproses",

        "Selesai":
            "status-selesai",

        "Dibatalkan":
            "status-dibatalkan"

    };


    return (
        statusClass[status] ||
        "status-menunggu"
    );

}


/* ==========================================
   LOAD STATISTIK
========================================== */

function loadStatistics() {

    const bookings =
        JSON.parse(
            localStorage.getItem(
                "camprent_bookings"
            )
        ) || [];


    const total =
        bookings.length;


    const waiting =
        bookings.filter(
            function(item) {

                return (
                    item.status ===
                    "Menunggu"
                );

            }
        ).length;


    const completed =
        bookings.filter(
            function(item) {

                return (
                    item.status ===
                    "Selesai"
                );

            }
        ).length;


    const revenue =
        bookings
            .filter(
                function(item) {

                    return (
                        item.status !==
                        "Dibatalkan"
                    );

                }
            )
            .reduce(
                function(total, item) {

                    return (
                        total +
                        Number(item.total)
                    );

                },
                0
            );


    document.getElementById(
        "totalBooking"
    ).textContent = total;


    document.getElementById(
        "waitingBooking"
    ).textContent = waiting;


    document.getElementById(
        "completedBooking"
    ).textContent = completed;


    document.getElementById(
        "totalRevenue"
    ).textContent =
        formatRupiah(revenue);

}


/* ==========================================
   LOAD BOOKING
========================================== */

function loadBookings() {

    const table =
        document.getElementById(
            "bookingTable"
        );


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "camprent_bookings"
            )
        ) || [];


    table.innerHTML = "";


    if (bookings.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#777;
                    "
                >

                    Belum ada booking.

                </td>

            </tr>

        `;

        loadStatistics();

        return;

    }


    bookings
        .slice()
        .reverse()
        .forEach(
            function(booking) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <strong>
                            ${booking.bookingCode}
                        </strong>

                    </td>


                    <td>

                        ${booking.userName}

                        <br>

                        <small>
                            ${booking.userPhone}
                        </small>

                    </td>


                    <td>

                        ${booking.packageName}

                    </td>


                    <td>

                        ${booking.bookingDate}

                    </td>


                    <td>

                        ${booking.duration}
                        malam

                    </td>


                    <td>

                        ${formatRupiah(
                            booking.total
                        )}

                    </td>


                    <td>

                        <span
                            class="status
                            ${getStatusClass(
                                booking.status
                            )}"
                        >

                            ${booking.status}

                        </span>

                    </td>


                    <td>

                        <select
                            class="action-select"
                            onchange="
                                updateBookingStatus(
                                    ${booking.id},
                                    this.value
                                )
                            "
                        >

                            <option value="">
                                Ubah Status
                            </option>

                            <option
                                value="Menunggu"
                                ${booking.status === "Menunggu"
                                    ? "selected"
                                    : ""}
                            >
                                Menunggu
                            </option>

                            <option
                                value="Dikonfirmasi"
                                ${booking.status === "Dikonfirmasi"
                                    ? "selected"
                                    : ""}
                            >
                                Dikonfirmasi
                            </option>

                            <option
                                value="Diproses"
                                ${booking.status === "Diproses"
                                    ? "selected"
                                    : ""}
                            >
                                Diproses
                            </option>

                            <option
                                value="Selesai"
                                ${booking.status === "Selesai"
                                    ? "selected"
                                    : ""}
                            >
                                Selesai
                            </option>

                            <option
                                value="Dibatalkan"
                                ${booking.status === "Dibatalkan"
                                    ? "selected"
                                    : ""}
                            >
                                Dibatalkan
                            </option>

                        </select>


                        <button
                            class="btn-delete"
                            onclick="
                                deleteBooking(
                                    ${booking.id}
                                )
                            "
                        >
                            Hapus
                        </button>

                    </td>

                `;


                table.appendChild(row);

            }
        );


    loadStatistics();

}


/* ==========================================
   UPDATE STATUS BOOKING
========================================== */

function updateBookingStatus(
    bookingId,
    newStatus
) {

    if (!newStatus) {

        return;

    }


    let bookings =
        JSON.parse(
            localStorage.getItem(
                "camprent_bookings"
            )
        ) || [];


    const booking =
        bookings.find(
            function(item) {

                return (
                    item.id ===
                    bookingId
                );

            }
        );


    if (!booking) {

        alert(
            "Booking tidak ditemukan."
        );

        return;

    }


    booking.status =
        newStatus;


    localStorage.setItem(
        "camprent_bookings",
        JSON.stringify(bookings)
    );


    loadBookings();


    alert(
        "Status booking berhasil diperbarui."
    );

}


/* ==========================================
   DELETE BOOKING
========================================== */

function deleteBooking(bookingId) {

    const confirmation =
        confirm(
            "Apakah kamu yakin ingin menghapus booking ini?"
        );


    if (!confirmation) {

        return;

    }


    let bookings =
        JSON.parse(
            localStorage.getItem(
                "camprent_bookings"
            )
        ) || [];


    bookings =
        bookings.filter(
            function(item) {

                return (
                    item.id !==
                    bookingId
                );

            }
        );


    localStorage.setItem(
        "camprent_bookings",
        JSON.stringify(bookings)
    );


    loadBookings();

}


/* ==========================================
   TAMPILKAN FORM PAKET
========================================== */

function showPackageForm() {

    document.getElementById(
        "packageFormContainer"
    ).style.display = "block";


    document.getElementById(
        "packageFormTitle"
    ).textContent =
        "Tambah Paket";


    document.getElementById(
        "packageForm"
    ).reset();


    document.getElementById(
        "editPackageId"
    ).value = "";

}


/* ==========================================
   SEMBUNYIKAN FORM
========================================== */

function hidePackageForm() {

    document.getElementById(
        "packageFormContainer"
    ).style.display = "none";

}


/* ==========================================
   SIMPAN PAKET
========================================== */

function savePackage(event) {

    event.preventDefault();


    let packages =
        JSON.parse(
            localStorage.getItem(
                "camprent_packages"
            )
        ) || [];


    const editId =
        document.getElementById(
            "editPackageId"
        ).value;


    const name =
        document.getElementById(
            "packageName"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "packagePrice"
            ).value
        );


    const capacity =
        Number(
            document.getElementById(
                "packageCapacity"
            ).value
        );


    const image =
        document.getElementById(
            "packageImage"
        ).value.trim();


    const description =
        document.getElementById(
            "packageDescription"
        ).value.trim();


    if (editId) {

        const packageData =
            packages.find(
                function(item) {

                    return (
                        item.id ===
                        Number(editId)
                    );

                }
            );


        if (packageData) {

            packageData.name =
                name;

            packageData.price =
                price;

            packageData.capacity =
                capacity;

            packageData.image =
                image;

            packageData.description =
                description;

        }

    } else {

        const newPackage = {

            id: Date.now(),

            name: name,

            price: price,

            capacity: capacity,

            image: image,

            description: description,

            status: "active"

        };


        packages.push(
            newPackage
        );

    }


    localStorage.setItem(
        "camprent_packages",
        JSON.stringify(packages)
    );


    hidePackageForm();


    loadPackages();


    alert(
        "Data paket berhasil disimpan."
    );

}


/* ==========================================
   LOAD PAKET ADMIN
========================================== */

function loadPackages() {

    const container =
        document.getElementById(
            "adminPackageList"
        );


    const packages =
        JSON.parse(
            localStorage.getItem(
                "camprent_packages"
            )
        ) || [];


    container.innerHTML = "";


    packages.forEach(
        function(item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-package-card";


            card.innerHTML = `

                <img
                    src="../${item.image}"
                    alt="${item.name}"
                >


                <div
                    class="admin-package-content"
                >

                    <h3>
                        ${item.name}
                    </h3>


                    <p>
                        ${item.description}
                    </p>


                    <p>

                        <strong>
                            ${formatRupiah(
                                item.price
                            )}
                        </strong>
                        / malam

                    </p>


                    <p>

                        Kapasitas:
                        ${item.capacity}
                        orang

                    </p>


                    <p>

                        Status:
                        <strong>
                            ${
                                item.status ===
                                "active"
                                    ? "Aktif"
                                    : "Nonaktif"
                            }
                        </strong>

                    </p>


                    <div
                        class="package-actions"
                    >

                        <button
                            class="btn-edit"
                            onclick="
                                editPackage(
                                    ${item.id}
                                )
                            "
                        >
                            Edit
                        </button>


                        <button
                            class="btn-toggle"
                            onclick="
                                togglePackage(
                                    ${item.id}
                                )
                            "
                        >

                            ${
                                item.status ===
                                "active"
                                    ? "Nonaktifkan"
                                    : "Aktifkan"
                            }

                        </button>

                    </div>

                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* ==========================================
   EDIT PAKET
========================================== */

function editPackage(packageId) {

    const packages =
        JSON.parse(
            localStorage.getItem(
                "camprent_packages"
            )
        ) || [];


    const item =
        packages.find(
            function(packageData) {

                return (
                    packageData.id ===
                    packageId
                );

            }
        );


    if (!item) {

        return;

    }


    document.getElementById(
        "packageFormContainer"
    ).style.display = "block";


    document.getElementById(
        "packageFormTitle"
    ).textContent =
        "Edit Paket";


    document.getElementById(
        "editPackageId"
    ).value =
        item.id;


    document.getElementById(
        "packageName"
    ).value =
        item.name;


    document.getElementById(
        "packagePrice"
    ).value =
        item.price;


    document.getElementById(
        "packageCapacity"
    ).value =
        item.capacity;


    document.getElementById(
        "packageImage"
    ).value =
        item.image;


    document.getElementById(
        "packageDescription"
    ).value =
        item.description;


    window.scrollTo({

        top: document.getElementById(
            "packageFormContainer"
        ).offsetTop - 30,

        behavior: "smooth"

    });

}


/* ==========================================
   AKTIF / NONAKTIF PAKET
========================================== */

function togglePackage(packageId) {

    let packages =
        JSON.parse(
            localStorage.getItem(
                "camprent_packages"
            )
        ) || [];


    const item =
        packages.find(
            function(packageData) {

                return (
                    packageData.id ===
                    packageId
                );

            }
        );


    if (!item) {

        return;

    }


    item.status =
        item.status === "active"
            ? "inactive"
            : "active";


    localStorage.setItem(
        "camprent_packages",
        JSON.stringify(packages)
    );


    loadPackages();

}


/* ==========================================
   LOGOUT ADMIN
========================================== */

function logoutAdmin() {

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
   INITIALIZE ADMIN
========================================== */

loadStatistics();

loadBookings();

loadPackages();