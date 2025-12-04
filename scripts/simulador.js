import { autos } from '../data/datos.js';
import { integrantes } from '../data/db_asesores.js';
import { planes } from '../data/datos.js';

const selectVehiculo = document.getElementById('select-vehiculo');
const selectPlan = document.getElementById('select-plan');
const selectAsesor = document.getElementById('select-asesor');
const btnSimular = document.getElementById('btn-simular');
const resultadoSimulador = document.getElementById('resultado-simulador');
const seccionAmortizacion = document.getElementById('seccion-amortizacion');
const tbodyAmortizacion = document.getElementById('tbody-amortizacion');
const btnGuardar = document.getElementById('btn-guardar-cotizacion');

// Variables globales
let simulacionActual = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();
    cargarPlanes();
    cargarAsesores();
    
    btnSimular.addEventListener('click', simularFinanciamiento);
    btnGuardar.addEventListener('click', guardarCotizacion);
});

function cargarVehiculos() {
    autos.forEach(auto => {
        const option = document.createElement('option');
        option.value = auto.id;
        option.textContent = `${auto.marca} ${auto.modelo} ${auto.año} - $${auto.precio.toLocaleString()}`;
        selectVehiculo.appendChild(option);
    });
}

function cargarPlanes() {
    planes.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.id;
        option.textContent = `${plan.nombre} (${plan.plazo} meses) - Inicial ${plan.cuotaInicial}% - Tasa ${plan.tasaInteres}%`;
        selectPlan.appendChild(option);
    });
}

function cargarAsesores() {
    integrantes.forEach(asesor => {
        const option = document.createElement('option');
        option.value = asesor.id;
        option.textContent = `${asesor.nombre} - ${asesor.rol}`;
        selectAsesor.appendChild(option);
    });
}

// ========== CÁLCULO DE FINANCIAMIENTO ==========
function simularFinanciamiento() {
    const vehiculoId = parseInt(selectVehiculo.value);
    const planId = parseInt(selectPlan.value);
    const asesorId = parseInt(selectAsesor.value);

    if (!vehiculoId || !planId || !asesorId) {
        mostrarToast('Por favor completa todos los campos', 'error');
        return;
    }

    const vehiculo = autos.find(a => a.id === vehiculoId);
    const plan = planes.find(p => p.id === planId);
    const asesor = integrantes.find(i => i.id === asesorId);

    // Cálculos financieros
    const precioVehiculo = vehiculo.precio;
    const cuotaInicial = precioVehiculo * (plan.cuotaInicial / 100);
    const montoFinanciar = precioVehiculo - cuotaInicial;
    const tasaMensual = plan.tasaInteres / 100 / 12;
    const numeroCuotas = plan.plazo;

    // Fórmula de cuota mensual: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const cuotaMensual = montoFinanciar * 
        (tasaMensual * Math.pow(1 + tasaMensual, numeroCuotas)) / 
        (Math.pow(1 + tasaMensual, numeroCuotas) - 1);

    const totalAPagar = cuotaMensual * numeroCuotas;
    const totalIntereses = totalAPagar - montoFinanciar;

    // Guardar simulación actual
    simulacionActual = {
        vehiculo,
        plan,
        asesor,
        precioVehiculo,
        cuotaInicial,
        montoFinanciar,
        cuotaMensual,
        totalAPagar,
        totalIntereses,
        fecha: new Date().toISOString()
    };

    mostrarResultado(simulacionActual);
    generarTablaAmortizacion(montoFinanciar, cuotaMensual, tasaMensual, numeroCuotas);
    seccionAmortizacion.style.display = 'block';
    
    mostrarToast('Simulación calculada exitosamente', 'success');
}

// ========== MOSTRAR RESULTADO ==========
function mostrarResultado(sim) {
    const resumenContenido = resultadoSimulador.querySelector('.resumen-contenido');
    
    resumenContenido.innerHTML = `
        <div class="dato-resumen">
            <strong>🚗 Vehículo:</strong>
            <span>${sim.vehiculo.marca} ${sim.vehiculo.modelo}</span>
        </div>
        <div class="dato-resumen">
            <strong>💰 Precio:</strong>
            <span>$${sim.precioVehiculo.toLocaleString()}</span>
        </div>
        <div class="dato-resumen">
            <strong>📋 Plan:</strong>
            <span>${sim.plan.nombre}</span>
        </div>
        <div class="dato-resumen">
            <strong>📅 Plazo:</strong>
            <span>${sim.plan.plazo} meses</span>
        </div>
        <div class="dato-resumen">
            <strong>💵 Cuota Inicial (${sim.plan.cuotaInicial}%):</strong>
            <span>$${sim.cuotaInicial.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div class="dato-resumen">
            <strong>📊 Monto a Financiar:</strong>
            <span>$${sim.montoFinanciar.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div class="dato-resumen">
            <strong>🏦 Total a Pagar:</strong>
            <span>$${sim.totalAPagar.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div class="dato-resumen">
            <strong>📈 Total Intereses:</strong>
            <span>$${sim.totalIntereses.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div class="cuota-destacada">
            <p>💳 Cuota Mensual:</p>
            <div class="monto-cuota">$${sim.cuotaMensual.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
        </div>
        <div class="dato-resumen">
            <strong>👤 Asesor:</strong>
            <span>${sim.asesor.nombre}</span>
        </div>
    `;
}

// ========== TABLA DE AMORTIZACIÓN ==========
function generarTablaAmortizacion(capital, cuota, tasaMensual, numeroCuotas) {
    tbodyAmortizacion.innerHTML = '';
    let saldo = capital;

    for (let i = 1; i <= numeroCuotas; i++) {
        const interes = saldo * tasaMensual;
        const capitalPagado = cuota - interes;
        saldo -= capitalPagado;

        // Ajuste en la última cuota por redondeo
        if (i === numeroCuotas && Math.abs(saldo) < 1) {
            saldo = 0;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${i}</td>
            <td>$${cuota.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            <td>$${capitalPagado.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            <td>$${interes.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            <td>$${Math.max(0, saldo).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
        `;
        tbodyAmortizacion.appendChild(fila);
    }
}

// ========== GUARDAR COTIZACIÓN ==========
function guardarCotizacion() {
    if (!simulacionActual) {
        mostrarToast('No hay simulación para guardar', 'error');
        return;
    }

    // Obtener cotizaciones existentes
    let cotizaciones = JSON.parse(localStorage.getItem('cotizaciones')) || [];

    // Crear objeto de cotización
    const cotizacion = {
        id: Date.now(),
        vehiculoId: simulacionActual.vehiculo.id,
        vehiculoNombre: `${simulacionActual.vehiculo.marca} ${simulacionActual.vehiculo.modelo}`,
        planId: simulacionActual.plan.id,
        planNombre: simulacionActual.plan.nombre,
        asesorId: simulacionActual.asesor.id,
        asesorNombre: simulacionActual.asesor.nombre,
        precioVehiculo: simulacionActual.precioVehiculo,
        cuotaInicial: simulacionActual.cuotaInicial,
        montoFinanciar: simulacionActual.montoFinanciar,
        cuotaMensual: simulacionActual.cuotaMensual,
        plazo: simulacionActual.plan.plazo,
        tasaInteres: simulacionActual.plan.tasaInteres,
        totalAPagar: simulacionActual.totalAPagar,
        totalIntereses: simulacionActual.totalIntereses,
        fecha: simulacionActual.fecha
    };

    // Guardar en localStorage
    cotizaciones.push(cotizacion);
    localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));

    mostrarToast('¡Cotización guardada exitosamente!', 'success');
}

// ========== NOTIFICACIONES TOAST ==========
function mostrarToast(mensaje, tipo = 'success') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.classList.add('toast', tipo);
    toast.textContent = mensaje;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 50);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}