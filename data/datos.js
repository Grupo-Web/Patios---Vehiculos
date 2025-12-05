const users = [
    {
        id: 1,
        username: "Admin",
        password: "Car123Password",
        role: "admin"
    },
    {
        id: 2,
        username: "Jose Caicedo",
        password: "Ug_Desarrollo_Web",
        role: "user"
    },
    {
        id: 3,
        username: "usuario01",
        password: "clave456",
        role: "user"
    },
    {
        id: 4,
        username: "invitado",
        password: "guest",
        role: "user"
    }
];

export default users;


export const planes = [
    {
        "id": 1,
        "nombre": "Plan 3 años",
        "plazo": 36,
        "cuotaInicial": 25,
        "tasaInteres": 14,
        "descripcion": "Plan a corto plazo con cuota inicial del 25% y tasa de interés del 14%"
    },
    {
        "id": 2,
        "nombre": "Plan 4 años",
        "plazo": 48,
        "cuotaInicial": 20,
        "tasaInteres": 16,
        "descripcion": "Plan intermedio con cuota inicial del 20% y tasa de interés del 16%"
    },
    {
        "id": 3,
        "nombre": "Plan 5 años",
        "plazo": 60,
        "cuotaInicial": 15,
        "tasaInteres": 18,
        "descripcion": "Plan a largo plazo con cuota inicial del 15% y tasa de interés del 18%"
    }
];


export const autos = [
    {
        id: 1,
        marca: "Toyota",
        modelo: "Corolla",
        año: 2022,
        tipo: "Sedán",
        motor: "1.8L",
        transmision: "Automática",
        precio: 23000,
        colores: ["Blanco", "Gris", "Negro"],
        imagen: "../img/autos/Toyota_corolla_sedan.png",
        imagenes: [
            "/img/autos/Toyota_corolla/Toyota_corolls_frontal.png",
            "/img/autos/Toyota_corolla/Toyota_corolla_interno.png",
            "/img/autos/Toyota_corolla/Toyota_corolla_lateral.png",
            "/img/autos/Toyota_corolla/Toyota_corolla_trasera.png"
        ]
    },
    {
        id: 2,
        marca: "Honda",
        modelo: "Civic",
        año: 2023,
        tipo: "Sedán",
        motor: "2.0L",
        transmision: "Manual",
        precio: 25000,
        colores: ["Rojo", "Azul", "Negro"],
        imagen: "../img/autos/honda-civic.jpg",
        imagenes: [
            "/img/autos/Honda_civic/Honda_civic_frontal.png",
            "/img/autos/Honda_civic/Honda_civic_interno.png",
            "/img/autos/Honda_civic/Honda_civic_lateral.png",
            "/img/autos/Honda_civic/Honda_civic_trasera.png"
        ]
    },
    {
        id: 3,
        marca: "Mazda",
        modelo: "CX-5",
        año: 2021,
        tipo: "SUV",
        motor: "2.5L",
        transmision: "Automática",
        precio: 32000,
        colores: ["Blanco", "Plateado"],
        imagen: "../img/autos/mazda_cx5.jpg",
        imagenes: [
            "/img/autos/Mazda_cx5/Mazda_cx5_frontal.png",
            "/img/autos/Mazda_cx5/Mazda_cx5_interno.png",
            "/img/autos/Mazda_cx5/Mazda_cx5_lateral.png",
            "/img/autos/Mazda_cx5/Mazda_cx5_lateral.png"
        ]
    },
    {
        id: 4,
        marca: "Hyundai",
        modelo: "Tucson",
        año: 2022,
        tipo: "SUV",
        motor: "2.0L",
        transmision: "Automática",
        precio: 30000,
        colores: ["Azul", "Negro", "Gris"],
        imagen: "../img/autos/hyundai_tucson.png",
        imagenes: [
            "/img/autos/Hyundai_tucson/Hyundai_tucson_frontal.png",
            "/img/autos/Hyundai_tucson/Hyundai_tucson_interno.png",
            "/img/autos/Hyundai_tucson/Hyundai_tucson_lateral.png",
            "/img/autos/Hyundai_tucson/Hyundai_tucson_trasera.png"
        ]
    },
    {
        id: 5,
        marca: "Ford",
        modelo: "Mustang",
        año: 2023,
        tipo: "Deportivo",
        motor: "5.0L V8",
        transmision: "Manual",
        precio: 55000,
        colores: ["Amarillo", "Negro", "Rojo"],
        imagen: "../img/autos/ford-Mustang.png",
        imagenes: [
            "/img/autos/Ford_mustang/Ford_mustang_frontal.png",
            "/img/autos/Ford_mustang/Ford_mustang_interno.png",
            "/img/autos/Ford_mustang/Ford_mustang_lateral.png",
            "/img/autos/Ford_mustang/Ford_mustang_trasera.png"
        ]
    },
    {
        id: 6,
        marca: "Chevrolet",
        modelo: "Camaro",
        año: 2022,
        tipo: "Deportivo",
        motor: "6.2L V8",
        transmision: "Automática",
        precio: 60000,
        colores: ["Rojo", "Blanco", "Negro"],
        imagen: "../img/autos/Chevrolet_Camaro.jpg",
        imagenes: [
            "/img/autos/Chevrolet_camaro/Chevrolet_camaro_frontal.png",
            "/img/autos/Chevrolet_camaro/Chevrolet_camaro_interno.png",
            "/img/autos/Chevrolet_camaro/Chevrolet_camaro_lateral.png",
            "/img/autos/Chevrolet_camaro/Chevrolet_camaro_trasera.png"
        ]
    }
];

