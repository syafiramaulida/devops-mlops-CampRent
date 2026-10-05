/* ==========================================
   DATA USER
========================================== */

const defaultUsers = [

    {
        id: 1,
        name: "User CampRent",
        email: "user@camprent.id",
        password: "user123",
        phone: "081234567890",
        role: "user"
    },

    {
        id: 2,
        name: "Administrator",
        email: "admin@camprent.id",
        password: "admin123",
        phone: "081234567891",
        role: "admin"
    }

];


/* ==========================================
   DATA PAKET CAMPING
========================================== */

const defaultPackages = [

    {
        id: 1,
        name: "Solo Backpacker",
        price: 95000,
        capacity: 1,
        description: "Paket camping untuk satu orang.",
        image: "img/f1.png",
        status: "active"
    },

    {
        id: 2,
        name: "Ekonomi",
        price: 150000,
        capacity: 2,
        description: "Paket camping ekonomis untuk dua orang.",
        image: "img/f3.png",
        status: "active"
    },

    {
        id: 3,
        name: "VIP Sunrise",
        price: 350000,
        capacity: 2,
        description: "Paket camping dengan pengalaman menikmati sunrise.",
        image: "img/f4.png",
        status: "active"
    },

    {
        id: 4,
        name: "Glamping Luxury",
        price: 600000,
        capacity: 4,
        description: "Camping dengan fasilitas glamping yang nyaman.",
        image: "img/OIP.jpg",
        status: "active"
    },

    {
        id: 5,
        name: "Family Ultimate",
        price: 850000,
        capacity: 6,
        description: "Paket camping keluarga dengan fasilitas lengkap.",
        image: "img/OIP (1).jpg",
        status: "active"
    }

];


/* ==========================================
   DATA BBQ
========================================== */

const bbqMenus = [

    {
        id: 1,
        name: "BBQ Chicken",
        price: 50000
    },

    {
        id: 2,
        name: "BBQ Beef",
        price: 75000
    },

    {
        id: 3,
        name: "BBQ Sausage",
        price: 40000
    },

    {
        id: 4,
        name: "BBQ Package",
        price: 150000
    }

];


/* ==========================================
   INITIALIZE LOCAL STORAGE
========================================== */

function initializeData() {

    if (!localStorage.getItem("camprent_users")) {

        localStorage.setItem(
            "camprent_users",
            JSON.stringify(defaultUsers)
        );

    }


    if (!localStorage.getItem("camprent_packages")) {

        localStorage.setItem(
            "camprent_packages",
            JSON.stringify(defaultPackages)
        );

    }


    if (!localStorage.getItem("camprent_bbq")) {

        localStorage.setItem(
            "camprent_bbq",
            JSON.stringify(bbqMenus)
        );

    }


    if (!localStorage.getItem("camprent_bookings")) {

        localStorage.setItem(
            "camprent_bookings",
            JSON.stringify([])
        );

    }

}


initializeData();