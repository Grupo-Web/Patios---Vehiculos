import { autos } from "../data/catalogo_autos"; // AJUSTA LA RUTA SI FUERA NECESARIO

// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Buscar auto por ID
const auto = autos.find(a => a.id === id);

if (!auto) {
    document.body.innerHTML = "<h2>Auto no encontrado</h2>";
} else {
    // Imagen
    document.getElementById("auto-imagen").src = auto.imagen;

    // Título grande
    document.getElementById("auto-nombre").textContent =
        `${auto.marca} ${auto.modelo} ${auto.año}`;

    // Datos generales
    document.getElementById("auto-marca").textContent = auto.marca;
    document.getElementById("auto-modelo").textContent = auto.modelo;
    document.getElementById("auto-anio").textContent = auto.año;
    document.getElementById("auto-tipo").textContent = auto.tipo;
    document.getElementById("auto-motor").textContent = auto.motor;
    document.getElementById("auto-transmision").textContent = auto.transmision;
    document.getElementById("auto-precio").textContent =
        auto.precio.toLocaleString();

    // Colores
    const coloresContainer = document.getElementById("auto-colores");
    coloresContainer.innerHTML = ""; // limpiar antes

    auto.colores.forEach(color => {
        const tag = document.createElement("span");
        tag.classList.add("color-tag");
        tag.textContent = color;
        coloresContainer.appendChild(tag);
    });
}
