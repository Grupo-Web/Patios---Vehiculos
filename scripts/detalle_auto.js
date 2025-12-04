import { autos } from "../data/catalogo_autos.js"; // AJUSTA LA RUTA SI ES NECESARIO

// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Buscar auto por ID
const auto = autos.find(a => a.id === id);

if (!auto) {
    document.body.innerHTML = "<h2>Auto no encontrado</h2>";
} else {

    // ============================
    // IMAGEN PRINCIPAL
    // ============================
    const imagenPrincipal = document.getElementById("auto-imagen");
    imagenPrincipal.src = auto.imagen;

    // ============================
    // MINIATURAS — CAMBIAR IMAGEN
    // ============================

    const miniaturas = document.querySelectorAll(".miniatura");

    if (auto.imagenes && auto.imagenes.length >= 4) {

        miniaturas.forEach((thumb, index) => {
            thumb.src = auto.imagenes[index];

            thumb.addEventListener("click", () => {
                imagenPrincipal.src = auto.imagenes[index];
            });
        });

    } else {
        console.warn(`El vehículo con ID ${auto.id} no tiene suficientes miniaturas.`);
    }

    // ============================
    // INFORMACIÓN DEL VEHÍCULO
    // ============================

    document.getElementById("auto-nombre").textContent =
        `${auto.marca} ${auto.modelo} ${auto.año}`;

    document.getElementById("auto-marca").textContent = auto.marca;
    document.getElementById("auto-modelo").textContent = auto.modelo;
    document.getElementById("auto-anio").textContent = auto.año;
    document.getElementById("auto-tipo").textContent = auto.tipo;
    document.getElementById("auto-motor").textContent = auto.motor;
    document.getElementById("auto-transmision").textContent = auto.transmision;
    document.getElementById("auto-precio").textContent =
        auto.precio.toLocaleString();

    // ============================
    // COLORES DISPONIBLES
    // ============================

    const coloresContainer = document.getElementById("auto-colores");
    coloresContainer.innerHTML = "";

    auto.colores.forEach(color => {
        const tag = document.createElement("span");
        tag.classList.add("color-tag");
        tag.textContent = color;
        coloresContainer.appendChild(tag);
    });

    // ============================
    // SISTEMA DE NOTIFICACIONES
    // ============================

    function showToast(mensaje) {
        const container = document.getElementById("toast-container");

        const toast = document.createElement("div");
        toast.classList.add("toast");
        toast.textContent = mensaje;

        container.appendChild(toast);

        // Mostrar animación
        setTimeout(() => toast.classList.add("show"), 50);

        // Ocultar luego de 3 segundos
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ============================
    // BOTONES Y ACCIONES
    // ============================

    // Agendar Test Drive
    const btnTestDrive = document.getElementById("btn-testdrive");
    if (btnTestDrive) {
        btnTestDrive.addEventListener("click", () => {
            showToast(`Test Drive solicitado para el ${auto.marca} ${auto.modelo}.`);
        });
    }

    // Actualizar enlace de cotización con ID del auto
    const btnCotizarLink = document.getElementById("btn-cotizar-link");
    if (btnCotizarLink) {
        btnCotizarLink.href = `cotizacion.html?id=${auto.id}`;
    }

    // Guardar en favoritos
    const btnFav = document.getElementById("btn-fav");
    if (btnFav) {
        btnFav.addEventListener("click", () => {

            let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

            if (!favoritos.includes(auto.id)) {
                favoritos.push(auto.id);
                localStorage.setItem("favoritos", JSON.stringify(favoritos));

                showToast("Añadido a favoritos.");
            } else {
                showToast("Este auto ya está en favoritos.");
            }
        });
    }
}
