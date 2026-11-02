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

let bookingPackages = [];


const bookingBBQ =
    JSON.parse(
        localStorage.getItem(
            "camprent_bbq"
        )
    ) || [];


const bookingLocation = "Gunung Bromo, Jawa Timur";



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


const durationGroup =
    document.getElementById(
        "durationGroup"
    );


const bbqGroup =
    document.getElementById(
        "bbqGroup"
    );


const bbqPriceRow =
    document.getElementById(
        "bbqPriceRow"
    );

const bookingStartDateInput =
    document.getElementById("bookingStartDate");

const bookingEndDateInput =
    document.getElementById("bookingEndDate");

const transactionPanel =
    document.getElementById("transactionPanel");

const bookingForm =
    document.getElementById("bookingForm");


function formatBookingDate(dateValue) {
    if (!dateValue) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(`${dateValue}T00:00:00`));
}


function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}


function getBookingNights() {
    if (!bookingStartDateInput.value || !bookingEndDateInput.value) {
        return 0;
    }

    const start = Date.parse(`${bookingStartDateInput.value}T00:00:00Z`);
    const end = Date.parse(`${bookingEndDateInput.value}T00:00:00Z`);
    const nights = (end - start) / 86400000;

    return Number.isInteger(nights) && nights > 0 ? nights : 0;
}


function updateBookingDateRange() {
    const startDate = bookingStartDateInput.value;

    if (startDate) {
        const earliestEndDate = new Date(`${startDate}T00:00:00`);
        earliestEndDate.setDate(earliestEndDate.getDate() + 1);
        bookingEndDateInput.min = formatDateInput(earliestEndDate);

        if (
            bookingEndDateInput.value &&
            bookingEndDateInput.value < bookingEndDateInput.min
        ) {
            bookingEndDateInput.value = "";
        }
    }

    durationInput.value = String(getBookingNights() || 1);
    calculateTotal();
}


/* ==========================================
   TAMPILKAN PAKET
========================================== */

async function loadPackages() {
    try {
        const response = await fetch("../api/packages.php");
        const packages = await response.json();

        if (!response.ok) {
            throw new Error(packages.error || "Gagal memuat paket.");
        }

        if (!Array.isArray(packages)) {
            throw new Error("Format data paket dari server tidak valid.");
        }

        bookingPackages = packages;

        bookingPackages.forEach(function(item) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent =
                item.name +
                " - " +
                formatRupiah(item.price) +
                " / " +
                (item.billingUnit === "trip" ? "perjalanan" : "malam");
            packageSelect.appendChild(option);
        });

        const selectedPackage =
            localStorage.getItem(
                "camprent_selected_package"
            );

        if (selectedPackage) {

            packageSelect.value =
                selectedPackage;

        }
    } catch (error) {
        console.error("Gagal memuat paket dari database:", error);
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Paket tidak dapat dimuat";
        packageSelect.appendChild(option);
        packageSelect.disabled = true;
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
                ) +
                " / " +
                (item.billingUnit === "trip" ? "perjalanan" : "malam");


            bbqSelect.appendChild(
                option
            );

        }
    );

}


/* ==========================================
   DETAIL PAKET TERPILIH
========================================== */

function getSelectedPackage() {

    const selectedPackageId =
        Number(
            packageSelect.value
        );

    return bookingPackages.find(
        function(item) {

            return item.id === selectedPackageId;

        }
    );

}


function updatePackageFields() {

    const selectedPackage = getSelectedPackage();
    const isTripPackage =
        selectedPackage && selectedPackage.billingUnit === "trip";

    durationGroup.hidden = Boolean(isTripPackage);
    durationInput.required = !isTripPackage;
    bbqGroup.hidden = Boolean(isTripPackage);
    bbqPriceRow.hidden = Boolean(isTripPackage);

    if (isTripPackage) {

        bbqSelect.value = "0";

    }

    updateSummaryLabels();

    calculateTotal();

}


function updateSummaryLabels() {
    const selectedPackage = getSelectedPackage();
    const isTripPackage =
        selectedPackage && selectedPackage.billingUnit === "trip";
    const nights = getBookingNights();

    document.getElementById("campPriceLabel").textContent = isTripPackage
        ? "Harga Jeep (perjalanan)"
        : `Harga Paket (${nights || 0} malam)`;

    document.getElementById("summaryDateRange").textContent =
        bookingStartDateInput.value && bookingEndDateInput.value
            ? `${formatBookingDate(bookingStartDateInput.value)} – ${formatBookingDate(bookingEndDateInput.value)}`
            : "Pilih tanggal";
}


function generateBookingCode(bookings) {
    const datePart = formatDateInput(new Date()).replace(/-/g, "");

    for (let attempt = 0; attempt < 10; attempt += 1) {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        const randomPart = randomValues[0].toString(36).toUpperCase().padStart(7, "0").slice(-7);
        const bookingCode = `CR-${datePart}-${randomPart}`;

        if (!bookings.some(booking => booking.bookingCode === bookingCode)) {
            return bookingCode;
        }
    }

    throw new Error("Kode booking unik gagal dibuat. Silakan coba kembali.");
}


/* ==========================================
   HITUNG TOTAL
========================================== */

function calculateTotal() {

    const duration = getBookingNights();


    const selectedBBQId =
        Number(
            bbqSelect.value
        );


    const selectedPackage = getSelectedPackage();
    const isTripPackage =
        selectedPackage && selectedPackage.billingUnit === "trip";


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
            (isTripPackage ? 1 : duration);

    }


    if (selectedBBQ && !isTripPackage) {

        bbqPrice =
            selectedBBQ.price;

    }


    const total =
        campPrice +
        bbqPrice;

    updateSummaryLabels();

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


    let duration =
        Number(
            durationInput.value
        ) || 1;


    const bookingDateStart = bookingStartDateInput.value;
    const bookingDateEnd = bookingEndDateInput.value;


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

    const nights = getBookingNights();

    if (!bookingDateStart || !bookingDateEnd || nights < 1) {
        alert("Tanggal selesai harus minimal satu hari setelah tanggal mulai.");
        return;
    }

    const isTripPackage =
        selectedPackage.billingUnit === "trip";

    duration = isTripPackage ? 1 : nights;


    let campPrice =
        selectedPackage.price *
        duration;


    let bbqPrice =
        selectedBBQ && !isTripPackage
            ? selectedBBQ.price
            : 0;


    const total =
        campPrice +
        bbqPrice;


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "camprent_bookings"
            )
        ) || [];

    let bookingCode;

    try {
        bookingCode = generateBookingCode(bookings);
    } catch (error) {
        console.error("Gagal membuat kode booking:", error);
        alert(error.message);
        return;
    }


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

        location:

            bookingLocation,

        bookingDate:

            bookingDateStart,

        bookingDateStart:

            bookingDateStart,

        bookingDateEnd:

            bookingDateEnd,

        duration:

            duration,

        durationUnit:

            isTripPackage ? "perjalanan" : "malam",

        billingUnit:

            isTripPackage ? "trip" : "night",

        bbq:

            selectedBBQ && !isTripPackage
                ? selectedBBQ.name
                : "Tidak ada",

        campPrice:

            campPrice,

        bbqPrice:

            bbqPrice,

        total:

            total,

        paymentMethod:

            document.querySelector('input[name="paymentMethod"]:checked').value,

        paymentStatus:

            "Menunggu Pembayaran",

        notes:

            notes,

        status:

            "Menunggu",

        createdAt:

            new Date().toISOString()

    };


    bookings.push(booking);


    localStorage.setItem(
        "camprent_bookings",
        JSON.stringify(bookings)
    );


    localStorage.removeItem("camprent_selected_package");
    renderTransaction(booking);

}


function renderTransaction(booking) {
    bookingForm.hidden = true;
    bookingForm.closest(".booking-page").classList.add("has-transaction");
    transactionPanel.hidden = false;

    document.getElementById("transactionBookingCode").textContent = booking.bookingCode;
    document.getElementById("transactionCustomer").textContent = booking.userName;
    document.getElementById("transactionPackage").textContent = booking.packageName;
    document.getElementById("transactionDates").textContent =
        `${formatBookingDate(booking.bookingDateStart)} – ${formatBookingDate(booking.bookingDateEnd)}`;
    document.getElementById("transactionDuration").textContent =
        `${booking.duration} ${booking.durationUnit}`;
    document.getElementById("transactionBbq").textContent = booking.bbq;
    document.getElementById("transactionMethod").textContent = booking.paymentMethod;
    document.getElementById("transactionNotes").textContent = booking.notes || "Tidak ada";
    document.getElementById("transactionPackagePrice").textContent = formatRupiah(booking.campPrice);
    document.getElementById("transactionBbqPrice").textContent = formatRupiah(booking.bbqPrice);
    document.getElementById("transactionTotal").textContent = formatRupiah(booking.total);
    const status = document.getElementById("transactionPaymentStatus");
    status.textContent = booking.paymentStatus || "Menunggu Pembayaran";
    status.classList.toggle("is-paid", booking.paymentStatus === "Lunas");

    document.getElementById("paymentAmount").textContent = formatRupiah(booking.total);
    const instructionTag = document.getElementById("paymentInstructionTag");
    const instructionTitle = document.getElementById("paymentInstructionTitle");
    const instructionText = document.getElementById("paymentInstructionText");

    instructionTag.textContent = booking.paymentMethod.toUpperCase();

    if (booking.paymentMethod === "Cash di Lokasi") {
        instructionTitle.textContent = "Bayar saat check-in";
        instructionText.textContent =
            "Silakan lakukan pembayaran tunai kepada petugas CampRent di lokasi saat check-in. Tunjukkan kode booking ini. Status akan diperbarui setelah pembayaran diterima petugas.";
    } else if (booking.paymentMethod === "Transfer Bank") {
        instructionTitle.textContent = "Menunggu instruksi rekening";
        instructionText.textContent =
            "Admin CampRent akan mengirimkan nama bank, nomor rekening, dan nama penerima untuk pesanan ini. Jangan transfer ke rekening yang tidak dikonfirmasi oleh admin. Setelah transfer, kirim bukti pembayaran kepada admin dengan mencantumkan kode booking.";
    } else {
        instructionTitle.textContent = "Menunggu QRIS resmi";
        instructionText.textContent =
            "Admin CampRent akan mengirimkan kode QRIS resmi dan nominal pembayaran untuk pesanan ini. Jangan memindai QR dari sumber lain. Setelah pembayaran, kirim bukti kepada admin dengan mencantumkan kode booking.";
    }

    transactionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
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
    updatePackageFields
);

bookingStartDateInput.addEventListener(
    "change",
    updateBookingDateRange
);

bookingEndDateInput.addEventListener(
    "change",
    updateBookingDateRange
);

bbqSelect.addEventListener(
    "change",
    calculateTotal
);


/* ==========================================
   INIT
========================================== */

loadBBQ();

const today = new Date();
const defaultStartDate = new Date(today);
defaultStartDate.setDate(defaultStartDate.getDate() + 1);
const defaultEndDate = new Date(defaultStartDate);
defaultEndDate.setDate(defaultEndDate.getDate() + 1);
bookingStartDateInput.min = formatDateInput(today);
bookingStartDateInput.value = formatDateInput(defaultStartDate);
bookingEndDateInput.value = formatDateInput(defaultEndDate);
updateBookingDateRange();
loadPackages().then(updatePackageFields);