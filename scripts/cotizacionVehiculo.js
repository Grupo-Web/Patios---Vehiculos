import { autos } from "../data/datos.js";

// Elementos del DOM
const imagenContainer = document.querySelector(".imagen-container");
const selectVehiculo = document.getElementById("select-vehiculo");
const autoImagen = document.getElementById("auto-imagen");
const inputMarca = document.getElementById("input-marca");
const inputModelo = document.getElementById("input-modelo");
const inputAnio = document.getElementById("input-anio");
const inputPrecioBase = document.getElementById("input-precio-base");
const precioVehiculo = document.getElementById("precio-vehiculo");
const costoMatriculacion = document.getElementById("costo-matriculacion");
const costoSeguro = document.getElementById("costo-seguro");
const costoTramites = document.getElementById("costo-tramites");
const costoAccesorios = document.getElementById("costo-accesorios");
const subtotalAdicionales = document.getElementById("subtotal-adicionales");
const valorTotalContado = document.getElementById("valor-total-contado");

imagenContainer.style.display = "none";
autoImagen.style.display = "none";
// Costos adicionales base 
const costosBase = {
    matriculacion: 450,
    seguro: 680,
    tramites: 250,
    accesorios: 320
};

// Función para formatear números como moneda
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

// Función para calcular costos adicionales según el precio del vehículo
function calcularCostosAdicionales(precioBase) {
 
    const seguro = Math.round(precioBase * 0.025); 
    const matriculacion = precioBase > 40000 ? 550 : 450; 
    const tramites = 250; 
    const accesorios = precioBase > 40000 ? 450 : 320; 
    
    return {
        matriculacion,
        seguro,
        tramites,
        accesorios
    };
}

// Función para cargar vehículos en el selector
function cargarVehiculos() {
    autos.forEach(auto => {
        const option = document.createElement('option');
        option.value = auto.id;
        option.textContent = `${auto.marca} ${auto.modelo} ${auto.año} - $${formatearMoneda(auto.precio)}`;
        selectVehiculo.appendChild(option);
    });
}

// Función para actualizar la información del vehículo seleccionado
function actualizarVehiculo(vehiculoId) {
    const vehiculo = autos.find(a => a.id === parseInt(vehiculoId));
    
   if (!vehiculo) {
    inputMarca.value = "";
    inputModelo.value = "";
    inputAnio.value = "";
    inputPrecioBase.value = "";
    precioVehiculo.textContent = "$0,00";
    
    autoImagen.src = "";
    autoImagen.style.display = "none";

    imagenContainer.style.display = "none";

    actualizarCostos(0);
    return;
    }

    // Actualizar campos del vehículo
    inputMarca.value = vehiculo.marca;
    inputModelo.value = vehiculo.modelo;
    inputAnio.value = vehiculo.año;
    inputPrecioBase.value = formatearMoneda(vehiculo.precio);
    precioVehiculo.textContent = `$${formatearMoneda(vehiculo.precio)}`;

    // Mostrar imagen del vehículo
    if (vehiculo.imagen) {
    autoImagen.src = vehiculo.imagen;
    autoImagen.style.display = "block";

    imagenContainer.style.display = "flex";
    }

    else {
    autoImagen.style.display = "none";
    imagenContainer.style.display = "none";
    }

    // Calcular y actualizar costos adicionales
    const costos = calcularCostosAdicionales(vehiculo.precio);
    actualizarCostos(vehiculo.precio, costos);
}

// Función para actualizar los costos adicionales y el total
function actualizarCostos(precioBase, costos = null) {
    if (!costos) {
        costos = calcularCostosAdicionales(precioBase);
    }

    // Actualizar valores de costos
    costoMatriculacion.textContent = `$${formatearMoneda(costos.matriculacion)}`;
    costoSeguro.textContent = `$${formatearMoneda(costos.seguro)}`;
    costoTramites.textContent = `$${formatearMoneda(costos.tramites)}`;
    costoAccesorios.textContent = `$${formatearMoneda(costos.accesorios)}`;

    // Calcular subtotal de adicionales
    const subtotal = costos.matriculacion + costos.seguro + costos.tramites + costos.accesorios;
    subtotalAdicionales.textContent = `$${formatearMoneda(subtotal)}`;

    // Calcular total al contado (precio base + costos adicionales)
    const total = precioBase + subtotal;
    valorTotalContado.textContent = `$${formatearMoneda(total)}`;
}

// Event listener para el selector de vehículos
selectVehiculo.addEventListener('change', (e) => {
    const vehiculoId = e.target.value;
    actualizarVehiculo(vehiculoId);
});

// Verificar si hay un vehículo en la URL 
function verificarVehiculoURL() {
    const params = new URLSearchParams(window.location.search);
    const vehiculoId = params.get('id');
    
    if (vehiculoId) {
        const vehiculo = autos.find(a => a.id === parseInt(vehiculoId));
        if (vehiculo) {
            selectVehiculo.value = vehiculoId;
            actualizarVehiculo(vehiculoId);
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();
    verificarVehiculoURL();
});
