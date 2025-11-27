import { autos } from '../data/catalogo_autos.js';
import { integrantes } from '../data/db_asesores.js';
import { planes } from '../data/db_planes.js';

// ========== VARIABLES GLOBALES ==========
let cotizaciones = [];
let charts = {};

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    cargarCotizaciones();
    actualizarDashboard();
    
    // Event listeners
    document.getElementById('btn-generar-prueba').addEventListener('click', generarDatosPrueba);
    document.getElementById('btn-exportar').addEventListener('click', exportarCSV);
    document.getElementById('btn-limpiar').addEventListener('click', limpiarDatos);
});

// ========== CARGAR COTIZACIONES ==========
function cargarCotizaciones() {
    cotizaciones = JSON.parse(localStorage.getItem('cotizaciones')) || [];
}

// ========== ACTUALIZAR TODO EL DASHBOARD ==========
function actualizarDashboard() {
    actualizarKPIs();
    actualizarGraficos();
    actualizarTablaRanking();
}

// ========== ACTUALIZAR KPIs ==========
function actualizarKPIs() {
    const totalCotizaciones = cotizaciones.length;
    const montoTotal = cotizaciones.reduce((sum, c) => sum + c.totalAPagar, 0);
    
    // Top asesor
    const cotizacionesPorAsesor = {};
    cotizaciones.forEach(c => {
        cotizacionesPorAsesor[c.asesorNombre] = (cotizacionesPorAsesor[c.asesorNombre] || 0) + 1;
    });
    const topAsesor = Object.entries(cotizacionesPorAsesor)
        .sort((a, b) => b[1] - a[1])[0];
    
    // Top vehículo
    const cotizacionesPorVehiculo = {};
    cotizaciones.forEach(c => {
        cotizacionesPorVehiculo[c.vehiculoNombre] = (cotizacionesPorVehiculo[c.vehiculoNombre] || 0) + 1;
    });
    const topVehiculo = Object.entries(cotizacionesPorVehiculo)
        .sort((a, b) => b[1] - a[1])[0];
    
    // Actualizar DOM
    document.getElementById('total-cotizaciones').textContent = totalCotizaciones;
    document.getElementById('monto-total').textContent = `$${montoTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
    document.getElementById('top-asesor').textContent = topAsesor ? topAsesor[0] : '-';
    document.getElementById('top-vehiculo').textContent = topVehiculo ? topVehiculo[0] : '-';
}

// ========== ACTUALIZAR GRÁFICOS ==========
function actualizarGraficos() {
    generarGraficoAsesores();
    generarGraficoVehiculos();
    generarGraficoPlanes();
    generarGraficoMensual();
}

function generarGraficoAsesores() {
    const ctx = document.getElementById('chart-asesores');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (charts.asesores) charts.asesores.destroy();
    
    // Contar cotizaciones por asesor
    const datos = {};
    cotizaciones.forEach(c => {
        datos[c.asesorNombre] = (datos[c.asesorNombre] || 0) + 1;
    });
    
    const labels = Object.keys(datos);
    const values = Object.values(datos);
    
    charts.asesores = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cotizaciones',
                data: values,
                backgroundColor: 'rgba(239, 54, 32, 0.8)',
                borderColor: 'rgba(220, 46, 3, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function generarGraficoVehiculos() {
    const ctx = document.getElementById('chart-vehiculos');
    if (!ctx) return;
    
    if (charts.vehiculos) charts.vehiculos.destroy();
    
    const datos = {};
    cotizaciones.forEach(c => {
        datos[c.vehiculoNombre] = (datos[c.vehiculoNombre] || 0) + 1;
    });
    
    const labels = Object.keys(datos);
    const values = Object.values(datos);
    
    charts.vehiculos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(239, 54, 32, 0.8)',
                    'rgba(220, 46, 3, 0.8)',
                    'rgba(200, 40, 3, 0.8)',
                    'rgba(180, 35, 3, 0.8)',
                    'rgba(160, 30, 3, 0.8)',
                    'rgba(140, 25, 3, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function generarGraficoPlanes() {
    const ctx = document.getElementById('chart-planes');
    if (!ctx) return;
    
    if (charts.planes) charts.planes.destroy();
    
    const datos = {};
    cotizaciones.forEach(c => {
        datos[c.planNombre] = (datos[c.planNombre] || 0) + 1;
    });
    
    const labels = Object.keys(datos);
    const values = Object.values(datos);
    
    charts.planes = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(239, 54, 32, 0.8)',
                    'rgba(220, 46, 3, 0.8)',
                    'rgba(200, 40, 3, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function generarGraficoMensual() {
    const ctx = document.getElementById('chart-mensual');
    if (!ctx) return;
    
    if (charts.mensual) charts.mensual.destroy();
    
    // Agrupar por mes
    const porMes = {};
    cotizaciones.forEach(c => {
        const fecha = new Date(c.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        porMes[mes] = (porMes[mes] || 0) + 1;
    });
    
    const labels = Object.keys(porMes).sort();
    const values = labels.map(l => porMes[l]);
    
    charts.mensual = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cotizaciones por Mes',
                data: values,
                borderColor: 'rgba(220, 46, 3, 1)',
                backgroundColor: 'rgba(239, 54, 32, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// ========== TABLA DE RANKING ==========
function actualizarTablaRanking() {
    const tbody = document.getElementById('tbody-asesores');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Contar cotizaciones por asesor
    const rankingData = {};
    cotizaciones.forEach(c => {
        if (!rankingData[c.asesorNombre]) {
            rankingData[c.asesorNombre] = 0;
        }
        rankingData[c.asesorNombre]++;
    });
    
    // Convertir a array y ordenar
    const ranking = Object.entries(rankingData)
        .sort((a, b) => b[1] - a[1]);
    
    // Generar filas
    ranking.forEach((item, index) => {
        const fila = document.createElement('tr');
        
        let badgeClass = 'badge-normal';
        let posicion = `#${index + 1}`;
        
        if (index === 0) {
            badgeClass = 'badge-oro';
            posicion = '🥇';
        } else if (index === 1) {
            badgeClass = 'badge-plata';
            posicion = '🥈';
        } else if (index === 2) {
            badgeClass = 'badge-bronce';
            posicion = '🥉';
        }
        
        fila.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${item[0]}</td>
            <td><strong>${item[1]}</strong></td>
            <td><span class="badge-ranking ${badgeClass}">${posicion}</span></td>
        `;
        
        tbody.appendChild(fila);
    });
}

// ========== GENERAR DATOS DE PRUEBA ==========
function generarDatosPrueba() {
    const confirmar = confirm('¿Deseas generar 50 cotizaciones de prueba? Esto se agregará a los datos existentes.');
    if (!confirmar) return;
    
    const nuevasCotizaciones = [];
    
    for (let i = 0; i < 50; i++) {
        const vehiculo = autos[Math.floor(Math.random() * autos.length)];
        const plan = planes[Math.floor(Math.random() * planes.length)];
        const asesor = integrantes[Math.floor(Math.random() * integrantes.length)];
        
        // Cálculos financieros
        const precioVehiculo = vehiculo.precio;
        const cuotaInicial = precioVehiculo * (plan.cuotaInicial / 100);
        const montoFinanciar = precioVehiculo - cuotaInicial;
        const tasaMensual = plan.tasaInteres / 100 / 12;
        const numeroCuotas = plan.plazo;
        
        const cuotaMensual = montoFinanciar * 
            (tasaMensual * Math.pow(1 + tasaMensual, numeroCuotas)) / 
            (Math.pow(1 + tasaMensual, numeroCuotas) - 1);
        
        const totalAPagar = cuotaMensual * numeroCuotas;
        const totalIntereses = totalAPagar - montoFinanciar;
        
        // Fecha aleatoria en los últimos 3 meses
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 90));
        
        nuevasCotizaciones.push({
            id: Date.now() + i,
            vehiculoId: vehiculo.id,
            vehiculoNombre: `${vehiculo.marca} ${vehiculo.modelo}`,
            planId: plan.id,
            planNombre: plan.nombre,
            asesorId: asesor.id,
            asesorNombre: asesor.nombre,
            precioVehiculo: precioVehiculo,
            cuotaInicial: cuotaInicial,
            montoFinanciar: montoFinanciar,
            cuotaMensual: cuotaMensual,
            plazo: plan.plazo,
            tasaInteres: plan.tasaInteres,
            totalAPagar: totalAPagar,
            totalIntereses: totalIntereses,
            fecha: fecha.toISOString()
        });
    }
    
    // Guardar en localStorage
    cotizaciones = [...cotizaciones, ...nuevasCotizaciones];
    localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));
    
    // Actualizar dashboard
    actualizarDashboard();
    
    mostrarToast('✅ 50 cotizaciones de prueba generadas exitosamente');
}

// ========== EXPORTAR A CSV ==========
function exportarCSV() {
    if (cotizaciones.length === 0) {
        mostrarToast('❌ No hay cotizaciones para exportar', 'error');
        return;
    }
    
    // Encabezados
    let csv = 'ID,Fecha,Vehículo,Plan,Asesor,Precio,Cuota Inicial,Monto Financiar,Cuota Mensual,Plazo,Tasa,Total a Pagar,Total Intereses\n';
    
    // Datos
    cotizaciones.forEach(c => {
        const fecha = new Date(c.fecha).toLocaleDateString();
        csv += `${c.id},${fecha},"${c.vehiculoNombre}","${c.planNombre}","${c.asesorNombre}",${c.precioVehiculo},${c.cuotaInicial},${c.montoFinanciar},${c.cuotaMensual},${c.plazo},${c.tasaInteres}%,${c.totalAPagar},${c.totalIntereses}\n`;
    });
    
    // Descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizaciones_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    mostrarToast('✅ Archivo CSV descargado exitosamente');
}

// ========== LIMPIAR DATOS ==========
function limpiarDatos() {
    const confirmar = confirm('⚠️ ¿Estás seguro de eliminar TODAS las cotizaciones? Esta acción no se puede deshacer.');
    if (!confirmar) return;
    
    localStorage.removeItem('cotizaciones');
    cotizaciones = [];
    
    actualizarDashboard();
    
    mostrarToast('🗑️ Todas las cotizaciones han sido eliminadas');
}

// ========== NOTIFICACIONES TOAST ==========
function mostrarToast(mensaje, tipo = 'success') {
    const toastHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${tipo === 'error' ? 'linear-gradient(145deg, #f44336, #ef5350)' : 'linear-gradient(145deg, #4caf50, #66bb6a)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: ToyotaType;
            animation: slideIn 0.4s ease;
        ">
            ${mensaje}
        </div>
    `;
    
    const toast = document.createRange().createContextualFragment(toastHTML).firstElementChild;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);