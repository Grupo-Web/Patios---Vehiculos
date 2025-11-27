import { planes } from '../data/db_planes.js';

const contenedorPlanes = document.querySelector('.contenedor-planes');

function cargarPlanes(arrayPlanes, contenedor) {
    arrayPlanes.forEach((plan, index) => {
        const tarjeta = document.createElement('section');
        tarjeta.classList.add('tarjeta-plan', `plan-${index}`);

        const icono = document.createElement('div');
        icono.classList.add('icono-plan');
        icono.textContent = '💳';

        const nombre = document.createElement('h1');
        nombre.classList.add('nombre-plan');
        nombre.textContent = plan.nombre;

        const plazo = document.createElement('h2');
        plazo.classList.add('plazo-plan');
        plazo.textContent = `${plan.plazo} meses`;

        const cuotaInicial = document.createElement('div');
        cuotaInicial.classList.add('detalle-plan');
        cuotaInicial.innerHTML = `
            <span class="etiqueta">Cuota Inicial:</span>
            <span class="valor">${plan.cuotaInicial}%</span>
        `;

        const tasaInteres = document.createElement('div');
        tasaInteres.classList.add('detalle-plan');
        tasaInteres.innerHTML = `
            <span class="etiqueta">Tasa de Interés:</span>
            <span class="valor">${plan.tasaInteres}%</span>
        `;

        const descripcion = document.createElement('p');
        descripcion.classList.add('descripcion-plan');
        descripcion.textContent = plan.descripcion;

        const btnSimular = document.createElement('a');
        btnSimular.classList.add('btn-simular-plan');
        btnSimular.href = 'simulador.html';
        btnSimular.textContent = 'Simular con este plan';

        tarjeta.appendChild(icono);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(plazo);
        tarjeta.appendChild(cuotaInicial);
        tarjeta.appendChild(tasaInteres);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(btnSimular);
        contenedor.appendChild(tarjeta);
    });
}

// Cargar planes al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarPlanes(planes, contenedorPlanes);
});