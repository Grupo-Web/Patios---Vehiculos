import { autos } from "../data/catalogo_autos.js";

// ===============================
// CARGAR JSON DE AUTOS
// ===============================

let autos = [];
const contenedorCatalogo = document.querySelector(".catalogo-autos");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");

// Cargar archivo JSON
async function cargarAutos() {
    try {
        const respuesta = await fetch("catalogo_autos.json");
        autos = await respuesta.json();
        mostrarCatalogo(autos);
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
    }
}

// ===============================
// MOSTRAR AUTOS EN EL HTML
// ===============================

function mostrarCatalogo(listaAutos) {
    contenedorCatalogo.innerHTML = ""; // Limpiar antes de renderizar

    // Crear filas de 3 autos
    for (let i = 0; i < listaAutos.length; i += 3) {

        const fila = document.createElement("section");
        fila.classList.add("fila-autos");

        const grupo = listaAutos.slice(i, i + 3);

        grupo.forEach(auto => {
            const card = document.createElement("div");
            card.classList.add("auto-card");

            card.innerHTML = `
                <img src="imagenes_autos/${auto.id}.jpg" alt="${auto.marca} ${auto.modelo}">
                <h3>${auto.marca} ${auto.modelo}</h3>
                <p>Año: ${auto.año} • Motor: ${auto.motor}</p>
                <a href="detalles/auto_${auto.id}.html">Ver más</a>
            `;

            fila.appendChild(card);
        });

        contenedorCatalogo.appendChild(fila);
    }
}

// ===============================
// BUSCADOR
// ===============================

formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();

    const texto = inputBusqueda.value.toLowerCase().trim();

    if (texto === "") {
        mostrarCatalogo(autos);
        return;
    }

    const filtrados = autos.filter(auto =>
        auto.marca.toLowerCase().includes(texto) ||
        auto.modelo.toLowerCase().includes(texto) ||
        auto.año.toString().includes(texto)
    );

    mostrarCatalogo(filtrados);
});

// Inicializar
cargarAutos();
