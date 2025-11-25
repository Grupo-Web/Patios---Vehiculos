document.addEventListener('DOMContentLoaded', async () => {
    await cargarPlanes();
});

async function cargarPlanes() {
    try {
        const response = await fetch('../scripts/planes.json');
        const planes = await response.json();
        mostrarPlanes(planes);
    } catch (error) {
        console.error('Error al cargar los planes:', error);
        mostrarError();
    }
}

function mostrarPlanes(planes) {
    const container = document.getElementById('planes-container');
    
    if (!planes || planes.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center;">No hay planes disponibles</p>';
        return;
    }

    container.innerHTML = '';

    planes.forEach(plan => {
        const card = crearTarjetaPlan(plan);
        container.appendChild(card);
    });
}

function crearTarjetaPlan(plan) {
    const card = document.createElement('div');
    card.className = 'plan-card';
    
    card.innerHTML = `
        <h3>${plan.nombre}</h3>
        <p class="descripcion">${plan.descripcion}</p>
        <div class="plan-info">
            <div class="info-item">
                <span class="info-label">Plazo:</span>
                <span class="info-value">${plan.plazo} meses</span>
            </div>
            <div class="info-item">
                <span class="info-label">Cuota Inicial:</span>
                <span class="info-value">${plan.cuotaInicial}%</span>
            </div>
            <div class="info-item">
                <span class="info-label">Tasa de Interés:</span>
                <span class="info-value">${plan.tasaInteres}%</span>
            </div>
            <div class="info-item">
                <span class="info-label">Monto a Financiar:</span>
                <span class="info-value">${100 - plan.cuotaInicial}%</span>
            </div>
        </div>
    `;
    
    return card;
}

function mostrarError() {
    const container = document.getElementById('planes-container');
    container.innerHTML = `
        <p style="color: white; text-align: center; grid-column: 1 / -1;">
            Error al cargar los planes. Por favor, intenta más tarde.
        </p>
    `;
}
