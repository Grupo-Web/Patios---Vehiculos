import { autos } from "../data/datos.js";

// ELEMENTOS DEL DOM
const contenedorCatalogo = document.querySelector(".catalogo-autos");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");

// ===============================
// MOSTRAR AUTOS EN EL HTML
// ===============================
function mostrarCatalogo(listaAutos) {
    contenedorCatalogo.innerHTML = "";

    for (let i = 0; i < listaAutos.length; i += 3) {
        const fila = document.createElement("section");
        fila.classList.add("fila-autos");

        const grupo = listaAutos.slice(i, i + 3);

        grupo.forEach(auto => {
            const card = document.createElement("div");
            card.classList.add("auto-card");

            card.innerHTML = `
                <img src="${auto.imagen}" alt="${auto.marca} ${auto.modelo}">
                <h3>${auto.marca} ${auto.modelo}</h3>
                <p>Año: ${auto.año} • Motor: ${auto.motor}</p>
                <a href="detalle_auto.html?id=${auto.id}">Ver más</a>
            `;

            fila.appendChild(card);
        });

        contenedorCatalogo.appendChild(fila);
    }
}

// Mostrar catálogo inicial
mostrarCatalogo(autos);

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
        auto.año.toString().includes(texto) ||
        auto.tipo.toLowerCase().includes(texto)
    );

    mostrarCatalogo(filtrados);
});
