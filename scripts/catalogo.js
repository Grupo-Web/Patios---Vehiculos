import { autos } from "../data/datos.js";

// ===============================
// ELEMENTOS DEL DOM
// ===============================
const contenedorCatalogo = document.querySelector(".catalogo-autos");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");
const filtroPrecio = document.getElementById("filtro-precio");
const filtroAnio = document.getElementById("filtro-anio");

// ===============================
// MOSTRAR AUTOS EN EL HTML
// ===============================
function mostrarCatalogo(listaAutos) {
    contenedorCatalogo.innerHTML = "";

    // Si no hay resultados, mostrar mensaje
    if (listaAutos.length === 0) {
        contenedorCatalogo.innerHTML = `
            <div style="text-align: center; padding: 40px; width: 100%; grid-column: 1/-1;">
                <h2>No se encontraron vehículos</h2>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    // Crear filas de 3 autos
    for (let i = 0; i < listaAutos.length; i += 3) {
        const fila = document.createElement("section");
        fila.classList.add("fila-autos");

        const grupo = listaAutos.slice(i, i + 3);

        grupo.forEach(auto => {
            const card = document.createElement("div");
            card.classList.add("auto-card");

            // Formatear precio si existe
            const precioFormateado = auto.precio 
                ? `$${auto.precio.toLocaleString('es-EC')}` 
                : 'Precio a consultar';

            card.innerHTML = `
                <img src="${auto.imagen}" alt="${auto.marca} ${auto.modelo}">
                <h3>${auto.marca} ${auto.modelo} ${auto.año}</h3>
                <p class="descripcion-auto">${auto.descripcion || `Motor: ${auto.motor} • Tipo: ${auto.tipo}`}</p>
                <p class="precio-auto">${precioFormateado}</p>
                <a href="detalle_auto.html?id=${auto.id}" class="btn-ver-mas">Ver más</a>
            `;

            fila.appendChild(card);
        });

        contenedorCatalogo.appendChild(fila);
    }
}

// ===============================
// FUNCIÓN DE FILTRADO COMPLETA
// ===============================
function aplicarFiltros() {
    const textoBusqueda = inputBusqueda.value.toLowerCase().trim();
    const rangoPrecio = filtroPrecio.value;
    const anioSeleccionado = filtroAnio.value;

    let autosFiltrados = [...autos];

    // Filtro por texto de búsqueda
    if (textoBusqueda !== "") {
        autosFiltrados = autosFiltrados.filter(auto =>
            auto.marca.toLowerCase().includes(textoBusqueda) ||
            auto.modelo.toLowerCase().includes(textoBusqueda) ||
            auto.año.toString().includes(textoBusqueda) ||
            auto.tipo.toLowerCase().includes(textoBusqueda) ||
            (auto.descripcion && auto.descripcion.toLowerCase().includes(textoBusqueda))
        );
    }

    // Filtro por rango de precio
    if (rangoPrecio !== "") {
        const [precioMin, precioMax] = rangoPrecio.split("-").map(Number);
        autosFiltrados = autosFiltrados.filter(auto => {
            if (!auto.precio) return false;
            return auto.precio >= precioMin && auto.precio <= precioMax;
        });
    }

    // Filtro por año
    if (anioSeleccionado !== "") {
        autosFiltrados = autosFiltrados.filter(auto => 
            auto.año.toString() === anioSeleccionado
        );
    }

    mostrarCatalogo(autosFiltrados);
}

// ===============================
// EVENT LISTENERS
// ===============================

// Evento de envío del formulario
formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    aplicarFiltros();
});

// Aplicar filtros en tiempo real cuando cambian los selectores
filtroPrecio.addEventListener("change", aplicarFiltros);
filtroAnio.addEventListener("change", aplicarFiltros);

// Búsqueda en tiempo real mientras se escribe (opcional)
inputBusqueda.addEventListener("input", () => {
    // Aplicar filtros después de un pequeño delay para mejor rendimiento
    clearTimeout(window.busquedaTimeout);
    window.busquedaTimeout = setTimeout(aplicarFiltros, 300);
});

// ===============================
// LIMPIAR FILTROS
// ===============================
function limpiarFiltros() {
    inputBusqueda.value = "";
    filtroPrecio.value = "";
    filtroAnio.value = "";
    mostrarCatalogo(autos);
}

// Botón para limpiar filtros (opcional, puedes agregarlo al HTML)
const btnLimpiar = document.getElementById("btn-limpiar");
if (btnLimpiar) {
    btnLimpiar.addEventListener("click", limpiarFiltros);
}

// ===============================
// INICIALIZACIÓN
// ===============================
// Mostrar catálogo completo al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarCatalogo(autos);
});
