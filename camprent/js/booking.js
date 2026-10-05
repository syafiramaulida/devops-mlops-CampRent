/* ==========================================
   CEK USER LOGIN
========================================== */

const bookingUser =
    JSON.parse(
        sessionStorage.getItem(
            "camprent_current_user"
        )
    );


if (!bookingUser) {

    window.location.href =
        "../index.html";

}


/* ==========================================
   DATA
========================================== */

const bookingPackages =
    JSON.parse(
        localStorage.getItem(
            "camprent_packages"
        )
    ) || [];


const bookingBBQ =
    JSON.parse(
        localStorage.getItem(
            "camprent_bbq"
        )
    ) || [];



/* ==========================================
   ELEMENT
========================================== */

const packageSelect =
    document.getElementById(
        "packageSelect"
    );


const bbqSelect =
    document.getElementById(
        "bbqSelect"
    );


const durationInput =
    document.getElementById(
        "duration"
    );


/* ==========================================
   TAMPILKAN PAKET
========================================== */

function loadPackages() {

    bookingPackages
        .filter(function(item) {

            return item.status === "active";

        })
        .forEach(function(item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                item.name +
                " - " +
                formatRupiah(item.price);


            packageSelect.appendChild(
                option
            );

        });


    const selectedPackage =
        localStorage.getItem(
            "camprent_selected_package"
        );


    if (selectedPackage) {

        packageSelect.value =
            selectedPackage;

    }

}


/* ==========================================
   TAMPILKAN BBQ
========================================== */

function loadBBQ() {

    bookingBBQ.forEach(
        function(item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                item.name +
                " - " +
                formatRupiah(
                    item.price
                );


            bbqSelect.appendChild(
                option
            );

        }
    );

}


/* ==========================================
   HITUNG TOTAL
========================================== */

function calculateTotal() {

    const selectedPackageId =
        Number(
            packageSelect.value
        );


    const duration =
        Number(
            durationInput.value
        ) || 1;


    const selectedBBQId =
        Number(
            bbqSelect.value
        );


    const selectedPackage =
        bookingPackages.find(
            function(item) {

                return (
                    item.id ===
                    selectedPackageId
                );

            }
        );


    const selectedBBQ =
        bookingBBQ.find(
            function(item) {

                return (
                    item.id ===
                    selectedBBQId
                );

            }
        );


    let campPrice = 0;

    let bbqPrice = 0;


    if (selectedPackage) {

        campPrice =
            selectedPackage.price *
            duration;

    }


    if (selectedBBQ) {

        bbqPrice =
            selectedBBQ.price;

    }


    const total =
        campPrice +
        bbqPrice;


    document.getElementById(
        "campPrice"
    ).textContent =
        formatRupiah(campPrice);


    document.getElementById(
        "bbqPrice"
    ).textContent =
        formatRupiah(bbqPrice);


    document.getElementById(
        "totalPrice"
    ).textContent =
        formatRupiah(total);

}


/* ==========================================
   SUBMIT BOOKING
========================================== */

function submitBooking(event) {

    event.preventDefault();


    const selectedPackageId =
        Number(
            packageSelect.value
        );


    const duration =
        Number(
            durationInput.value
        );


    const bookingDate =
        document.getElementById(
            "bookingDate"
        ).value;


    const selectedBBQId =
        Number(
            bbqSelect.value
        );


    const notes =
        document.getElementById(
            "notes"
        ).value;


    const selectedPackage =
        bookingPackages.find(
            function(item) {

                return (
                    item.id ===
                    selectedPackageId
                );

            }
        );


    const selectedBBQ =
        bookingBBQ.find(
            function(item) {

                return (
                    item.id ===
                    selectedBBQId
                );

            }
        );


    if (!selectedPackage) {

        alert(
            "Silakan pilih paket camping."
        );

        return;

    }


    let campPrice =
        selectedPackage.price *
        duration;


    let bbqPrice =
        selectedBBQ
            ? selectedBBQ.price
            : 0;


    const total =
        campPrice +
        bbqPrice;


    const bookingCode =
        "CR-" +
        Date.now()
            .toString()
            .slice(-6);


    const booking = {

        id: Date.now(),

        bookingCode:

            bookingCode,

        userId:

            bookingUser.id,

        userName:

            bookingUser.name,

        userEmail:

            bookingUser.email,

        userPhone:

            bookingUser.phone,

        packageId:

            selectedPackage.id,

        packageName:

            selectedPackage.name,

        bookingDate:

            bookingDate,

        duration:

            duration,

        bbq:

            selectedBBQ
                ? selectedBBQ.name
                : "Tidak ada",

        campPrice:

            campPrice,

        bbqPrice:

            bbqPrice,

        total:

            total,

        notes:

            notes,

        status:

            "Menunggu",

        createdAt:

            new Date().toISOString()

    };


    let bookings =
        JSON.parse(
            localStorage.getItem(
                "camprent_bookings"
            )
        ) || [];


    bookings.push(booking);


    localStorage.setItem(
        "camprent_bookings",
        JSON.stringify(bookings)
    );


    localStorage.removeItem(
        "camprent_selected_package"
    );


    alert(
        "Booking berhasil dibuat!\n\n" +
        "Kode Booking: " +
        bookingCode
    );


    window.location.href =
        "history.html";

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
   EVENT
========================================== */

packageSelect.addEventListener(
    "change",
    calculateTotal
);


bbqSelect.addEventListener(
    "change",
    calculateTotal
);


durationInput.addEventListener(
    "input",
    calculateTotal
);


/* ==========================================
   INIT
========================================== */

loadPackages();

loadBBQ();

calculateTotal();