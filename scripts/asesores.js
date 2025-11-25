document.addEventListener('DOMContentLoaded', async () => {
    await cargarAsesores();
    await cargarDashboard();
});

async function cargarAsesores() {
    try {
        const response = await fetch('../scripts/asesores.json');
        const asesores = await response.json();
        mostrarAsesores(asesores);
    } catch (error) {
        console.error('Error al cargar asesores:', error);
    }
}

function mostrarAsesores(asesores) {
    const container = document.getElementById('asesores-container');
    
    if (!asesores || asesores.length === 0) {
        container.innerHTML = '<p style="color: white;">No hay asesores disponibles</p>';
        return;
    }

    container.innerHTML = '';

    asesores.forEach(asesor => {
        const card = crearTarjetaAsesor(asesor);
        container.appendChild(card);
    });
}

function crearTarjetaAsesor(asesor) {
    const card = document.createElement('div');
    card.className = 'asesor-card';
    
    card.innerHTML = `
        <img src="${asesor.foto}" alt="${asesor.nombre}">
        <h3>${asesor.nombre}</h3>
        <p class="especialidad">${asesor.especialidad}</p>
        <p class="descripcion">${asesor.descripcion}</p>
    `;
    
    return card;
}

async function cargarDashboard() {
    try {
        const [responseCotizaciones, responseAsesores] = await Promise.all([
            fetch('../scripts/cotizaciones.json'),
            fetch('../scripts/asesores.json')
        ]);

        const cotizaciones = await responseCotizaciones.json();
        const asesores = await responseAsesores.json();

        const rendimiento = calcularRendimiento(asesores, cotizaciones);
        mostrarDashboard(rendimiento);
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
    }
}

function calcularRendimiento(asesores, cotizaciones) {
    const rendimiento = [];
    
    asesores.forEach(asesor => {
        const cotizacionesAsesor = cotizaciones.filter(cot => cot.asesorId === asesor.id);
        
        rendimiento.push({
            asesor: asesor.nombre,
            cotizaciones: cotizacionesAsesor.length
        });
    });
    
    return rendimiento.sort((a, b) => b.cotizaciones - a.cotizaciones);
}

function mostrarDashboard(rendimiento) {
    const container = document.getElementById('dashboard-container');
    
    if (!rendimiento || rendimiento.length === 0) {
        container.innerHTML = '<p style="color: white;">No hay datos disponibles</p>';
        return;
    }

    container.innerHTML = '';

    const maxCotizaciones = Math.max(...rendimiento.map(r => r.cotizaciones));

    rendimiento.forEach(dato => {
        const card = crearTarjetaDashboard(dato, maxCotizaciones);
        container.appendChild(card);
    });
}

function crearTarjetaDashboard(dato, maxCotizaciones) {
    const card = document.createElement('div');
    card.className = 'dashboard-card';
    
    const porcentaje = (dato.cotizaciones / maxCotizaciones) * 100;
    
    card.innerHTML = `
        <h3>${dato.asesor}</h3>
        <div class="cotizaciones-count">${dato.cotizaciones}</div>
        <p class="label">Cotizaciones generadas</p>
        <div class="barra-progreso">
            <div class="barra-fill" style="width: ${porcentaje}%"></div>
        </div>
    `;
    
    return card;
}
