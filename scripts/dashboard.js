// scripts/dashboard.js
import { gestorCotizaciones } from './cotizaciones.js';

// Variables globales para los gráficos
let chartAsesores, chartVehiculos, chartPlanes, chartMensual;

// Colores del tema Pride Autosales
const coloresTema = {
    rojo: '#ef3620',
    negro: '#000000',
    gris: '#666666',
    blanco: '#ffffff'
};

const coloresGraficos = [
    '#ef3620', '#ff6b54', '#ff9580', '#000000', '#333333',
    '#666666', '#999999', '#ff4444', '#cc0000', '#880000'
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarDashboard();
    configurarEventos();
});

// Cargar todos los datos del dashboard
function cargarDashboard() {
    const estadisticas = gestorCotizaciones.obtenerEstadisticas();
    
    actualizarTarjetasResumen(estadisticas);
    crearGraficoAsesores(estadisticas.porAsesor);
    crearGraficoVehiculos(estadisticas.porVehiculo);
    crearGraficoPlanes(estadisticas.porPlan);
    crearGraficoMensual(estadisticas.porMes);
    actualizarTablaRanking(estadisticas.porAsesor);
}

// Actualizar tarjetas de resumen
function actualizarTarjetasResumen(stats) {
    document.getElementById('total-cotizaciones').textContent = stats.total;
    document.getElementById('monto-total').textContent = 
        `$${stats.montoTotal.toLocaleString('es-EC', { maximumFractionDigits: 0 })}`;
    
    // Top asesor
    const asesores = Object.entries(stats.porAsesor);
    if (asesores.length > 0) {
        const topAsesor = asesores.reduce((max, current) => 
            current[1] > max[1] ? current : max
        );
        document.getElementById('top-asesor').textContent = topAsesor[0];
    }
    
    // Top vehículo
    const vehiculos = Object.entries(stats.porVehiculo);
    if (vehiculos.length > 0) {
        const topVehiculo = vehiculos.reduce((max, current) => 
            current[1] > max[1] ? current : max
        );
        document.getElementById('top-vehiculo').textContent = topVehiculo[0];
    }
}

// Gráfico de cotizaciones por asesor
function crearGraficoAsesores(datosAsesores) {
    const ctx = document.getElementById('chart-asesores');
    
    if (chartAsesores) {
        chartAsesores.destroy();
    }

    const labels = Object.keys(datosAsesores);
    const datos = Object.values(datosAsesores);

    chartAsesores = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cotizaciones',
                data: datos,
                backgroundColor: coloresGraficos.slice(0, labels.length),
                borderColor: coloresTema.negro,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Gráfico de vehículos más cotizados
function crearGraficoVehiculos(datosVehiculos) {
    const ctx = document.getElementById('chart-vehiculos');
    
    if (chartVehiculos) {
        chartVehiculos.destroy();
    }

    const labels = Object.keys(datosVehiculos);
    const datos = Object.values(datosVehiculos);

    chartVehiculos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: datos,
                backgroundColor: coloresGraficos.slice(0, labels.length),
                borderColor: coloresTema.blanco,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de planes de financiamiento
function crearGraficoPlanes(datosPlanes) {
    const ctx = document.getElementById('chart-planes');
    
    if (chartPlanes) {
        chartPlanes.destroy();
    }

    const labels = Object.keys(datosPlanes);
    const datos = Object.values(datosPlanes);

    chartPlanes = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: datos,
                backgroundColor: coloresGraficos.slice(0, labels.length),
                borderColor: coloresTema.blanco,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de evolución mensual
function crearGraficoMensual(datosMensual) {
    const ctx = document.getElementById('chart-mensual');
    
    if (chartMensual) {
        chartMensual.destroy();
    }

    const labels = Object.keys(datosMensual);
    const datos = Object.values(datosMensual);

    chartMensual = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cotizaciones',
                data: datos,
                borderColor: coloresTema.rojo,
                backgroundColor: 'rgba(239, 54, 32, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Actualizar tabla de ranking
function actualizarTablaRanking(datosAsesores) {
    const tbody = document.getElementById('tbody-asesores');
    tbody.innerHTML = '';

    const asesoresOrdenados = Object.entries(datosAsesores)
        .sort((a, b) => b[1] - a[1]);

    asesoresOrdenados.forEach(([nombre, cantidad], index) => {
        const fila = document.createElement('tr');
        
        let badge = '';
        let badgeClass = 'badge-normal';
        
        if (index === 0) {
            badge = '🥇 1°';
            badgeClass = 'badge-oro';
        } else if (index === 1) {
            badge = '🥈 2°';
            badgeClass = 'badge-plata';
        } else if (index === 2) {
            badge = '🥉 3°';
            badgeClass = 'badge-bronce';
        } else {
            badge = `${index + 1}°`;
        }

        fila.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${nombre}</td>
            <td><strong>${cantidad}</strong></td>
            <td><span class="badge-ranking ${badgeClass}">${badge}</span></td>
        `;
        
        tbody.appendChild(fila);
    });
}

// Configurar eventos de los botones
function configurarEventos() {
    document.getElementById('btn-generar-prueba').addEventListener('click', () => {
        if (confirm('¿Generar 50 cotizaciones de prueba? Esto agregará datos ficticios.')) {
            gestorCotizaciones.generarDatosPrueba();
            cargarDashboard();
            alert('✅ Datos de prueba generados exitosamente');
        }
    });

    document.getElementById('btn-limpiar').addEventListener('click', () => {
        if (confirm('⚠️ ¿Está seguro de eliminar TODAS las cotizaciones? Esta acción no se puede deshacer.')) {
            gestorCotizaciones.limpiarTodo();
            cargarDashboard();
            alert('✅ Todos los datos han sido eliminados');
        }
    });

    document.getElementById('btn-exportar').addEventListener('click', () => {
        exportarCSV();
    });
}

// Exportar datos a CSV
function exportarCSV() {
    const cotizaciones = gestorCotizaciones.obtenerTodas();
    
    if (cotizaciones.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    let csv = 'ID,Fecha,Asesor,Vehículo,Plan,Entrada,Monto Financiar,Monto Total,Cliente,Email\n';
    
    cotizaciones.forEach(c => {
        const fecha = new Date(c.fecha).toLocaleDateString('es-EC');
        csv += `${c.id},"${fecha}","${c.asesorNombre}","${c.vehiculoMarca} ${c.vehiculoModelo}","${c.planNombre}",${c.entrada},${c.montoFinanciar},${c.montoTotal},"${c.clienteNombre}","${c.clienteEmail}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `cotizaciones_pride_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('✅ Archivo CSV descargado exitosamente');
}