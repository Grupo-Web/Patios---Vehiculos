// scripts/planes.js
import { autos } from '../data/catalogo_autos.js';
import { integrantes } from '../data/db_asesores.js';
import { gestorCotizaciones } from './cotizaciones.js';

// Tasas de interés por plazo
const tasasInteres = {
    12: 0.05,  // 5%
    24: 0.07,  // 7%
    36: 0.09,  // 9%
    48: 0.11,  // 11%
    60: 0.13   // 13%
};

let vehiculoSeleccionado = null;
let simulacionActual = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();
    cargarAsesores();
    configurarEventos();
});

// Cargar vehículos en el select
function cargarVehiculos() {
    const select = document.getElementById('select-vehiculo');
    
    autos.forEach(auto => {
        const option = document.createElement('option');
        option.value = auto.id;
        option.textContent = `${auto.marca} ${auto.modelo} ${auto.año} - $${auto.precio.toLocaleString()}`;
        select.appendChild(option);
    });
}

// Cargar asesores en el select
function cargarAsesores() {
    const select = document.getElementById('select-asesor');
    
    integrantes.forEach(asesor => {
        const option = document.createElement('option');
        option.value = asesor.id;
        option.textContent = `${asesor.nombre} - ${asesor.rol}`;
        select.appendChild(option);
    });
}

// Configurar eventos
function configurarEventos() {
    // Selección de vehículo
    document.getElementById('select-vehiculo').addEventListener('change', (e) => {
        const id = parseInt(e.target.value);
        if (id) {
            vehiculoSeleccionado = autos.find(a => a.id === id);
            mostrarInfoVehiculo();
        } else {
            document.getElementById('vehiculo-info').style.display = 'none';
            vehiculoSeleccionado = null;
        }
    });

    // Botón simular
    document.getElementById('btn-simular').addEventListener('click', simularFinanciamiento);

    // Botón guardar
    document.getElementById('btn-guardar').addEventListener('click', guardarCotizacion);
}

// Mostrar información del vehículo seleccionado
function mostrarInfoVehiculo() {
    if (!vehiculoSeleccionado) return;

    const infoDiv = document.getElementById('vehiculo-info');
    infoDiv.style.display = 'flex';

    document.getElementById('vehiculo-img').src = vehiculoSeleccionado.imagen;
    document.getElementById('vehiculo-nombre').textContent = 
        `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} ${vehiculoSeleccionado.año}`;
    document.getElementById('vehiculo-detalles').textContent = 
        `${vehiculoSeleccionado.tipo} • Motor ${vehiculoSeleccionado.motor} • ${vehiculoSeleccionado.transmision}`;
    document.getElementById('vehiculo-precio').textContent = 
        vehiculoSeleccionado.precio.toLocaleString();

    // Sugerir entrada del 20%
    const entradaSugerida = Math.round(vehiculoSeleccionado.precio * 0.20);
    document.getElementById('entrada').value = entradaSugerida;
}

// Simular financiamiento
function simularFinanciamiento() {
    if (!validarFormulario()) return;

    const entrada = parseFloat(document.getElementById('entrada').value);
    const plazo = parseInt(document.getElementById('select-plazo').value);
    const precio = vehiculoSeleccionado.precio;

    // Validar entrada mínima (10%)
    const entradaMinima = precio * 0.10;
    if (entrada < entradaMinima) {
        alert(`La entrada mínima es $${entradaMinima.toFixed(2)} (10% del precio)`);
        return;
    }

    const montoFinanciar = precio - entrada;
    const tasaAnual = tasasInteres[plazo];
    const tasaMensual = tasaAnual / 12;

    // Fórmula de cuota: M = P * [i(1 + i)^n] / [(1 + i)^n - 1]
    const cuotaMensual = montoFinanciar * 
        (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
        (Math.pow(1 + tasaMensual, plazo) - 1);

    const totalPagar = entrada + (cuotaMensual * plazo);

    // Guardar simulación actual
    simulacionActual = {
        vehiculo: vehiculoSeleccionado,
        precio: precio,
        entrada: entrada,
        montoFinanciar: montoFinanciar,
        plazo: plazo,
        tasaAnual: tasaAnual * 100,
        cuotaMensual: cuotaMensual,
        totalPagar: totalPagar
    };

    mostrarResultados();
}

// Mostrar resultados de la simulación
function mostrarResultados() {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.style.display = 'block';

    document.getElementById('result-precio').textContent = 
        simulacionActual.precio.toLocaleString('es-EC', { maximumFractionDigits: 0 });
    document.getElementById('result-entrada').textContent = 
        simulacionActual.entrada.toLocaleString('es-EC', { maximumFractionDigits: 0 });
    document.getElementById('result-financiar').textContent = 
        simulacionActual.montoFinanciar.toLocaleString('es-EC', { maximumFractionDigits: 0 });
    document.getElementById('result-plazo').textContent = simulacionActual.plazo;
    document.getElementById('result-tasa').textContent = simulacionActual.tasaAnual.toFixed(0);
    document.getElementById('result-cuota').textContent = 
        simulacionActual.cuotaMensual.toLocaleString('es-EC', { maximumFractionDigits: 2 });
    document.getElementById('result-total').textContent = 
        simulacionActual.totalPagar.toLocaleString('es-EC', { maximumFractionDigits: 0 });

    // Scroll a resultados
    resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Validar formulario
function validarFormulario() {
    if (!vehiculoSeleccionado) {
        alert('Por favor selecciona un vehículo');
        return false;
    }

    const entrada = document.getElementById('entrada').value;
    if (!entrada || entrada <= 0) {
        alert('Por favor ingresa el monto de entrada');
        return false;
    }

    const plazo = document.getElementById('select-plazo').value;
    if (!plazo) {
        alert('Por favor selecciona un plazo');
        return false;
    }

    const asesor = document.getElementById('select-asesor').value;
    if (!asesor) {
        alert('Por favor selecciona un asesor');
        return false;
    }

    const nombreCliente = document.getElementById('cliente-nombre').value.trim();
    if (!nombreCliente) {
        alert('Por favor ingresa el nombre del cliente');
        return false;
    }

    const emailCliente = document.getElementById('cliente-email').value.trim();
    if (!emailCliente || !validarEmail(emailCliente)) {
        alert('Por favor ingresa un email válido');
        return false;
    }

    return true;
}

// Validar email
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Guardar cotización
function guardarCotizacion() {
    if (!simulacionActual) {
        alert('Primero debes generar una simulación');
        return;
    }

    const asesorId = parseInt(document.getElementById('select-asesor').value);
    const asesor = integrantes.find(a => a.id === asesorId);

    const cotizacion = {
        asesorId: asesor.id,
        asesorNombre: asesor.nombre,
        vehiculoId: vehiculoSeleccionado.id,
        vehiculoMarca: vehiculoSeleccionado.marca,
        vehiculoModelo: vehiculoSeleccionado.modelo,
        vehiculoPrecio: simulacionActual.precio,
        planId: simulacionActual.plazo,
        planNombre: `${simulacionActual.plazo} meses`,
        planMeses: simulacionActual.plazo,
        entrada: simulacionActual.entrada,
        montoFinanciar: simulacionActual.montoFinanciar,
        montoTotal: simulacionActual.totalPagar,
        cuotaMensual: simulacionActual.cuotaMensual,
        clienteNombre: document.getElementById('cliente-nombre').value.trim(),
        clienteEmail: document.getElementById('cliente-email').value.trim()
    };

    gestorCotizaciones.guardarCotizacion(cotizacion);

    // Mostrar mensaje de confirmación
    const mensaje = document.getElementById('mensaje-confirmacion');
    mensaje.style.display = 'block';
    mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Limpiar formulario después de 3 segundos
    setTimeout(() => {
        limpiarFormulario();
        mensaje.style.display = 'none';
    }, 3000);
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('select-vehiculo').value = '';
    document.getElementById('entrada').value = '';
    document.getElementById('select-plazo').value = '';
    document.getElementById('select-asesor').value = '';
    document.getElementById('cliente-nombre').value = '';
    document.getElementById('cliente-email').value = '';
    document.getElementById('vehiculo-info').style.display = 'none';
    document.getElementById('resultados').style.display = 'none';
    vehiculoSeleccionado = null;
    simulacionActual = null;
}