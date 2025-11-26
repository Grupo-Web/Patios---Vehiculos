export class GestorCotizaciones {
    constructor() {
        this.storageKey = 'cotizaciones_pride';
    }

    // Obtener todas las cotizaciones
    obtenerTodas() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Guardar nueva cotización
    guardarCotizacion(cotizacion) {
        const cotizaciones = this.obtenerTodas();
        
        const nuevaCotizacion = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            ...cotizacion
        };

        cotizaciones.push(nuevaCotizacion);
        localStorage.setItem(this.storageKey, JSON.stringify(cotizaciones));
        
        // Actualizar contador del asesor
        this.actualizarContadorAsesor(cotizacion.asesorId);
        
        return nuevaCotizacion;
    }

    // Actualizar contador de asesor
    actualizarContadorAsesor(asesorId) {
        const contadores = JSON.parse(localStorage.getItem('contadores_asesores')) || {};
        contadores[asesorId] = (contadores[asesorId] || 0) + 1;
        localStorage.setItem('contadores_asesores', JSON.stringify(contadores));
    }

    // Obtener cotizaciones por asesor
    obtenerPorAsesor(asesorId) {
        return this.obtenerTodas().filter(c => c.asesorId === asesorId);
    }

    // Obtener cotizaciones por vehículo
    obtenerPorVehiculo(vehiculoId) {
        return this.obtenerTodas().filter(c => c.vehiculoId === vehiculoId);
    }

    // Obtener cotizaciones por plan
    obtenerPorPlan(planId) {
        return this.obtenerTodas().filter(c => c.planId === planId);
    }

    // Estadísticas generales
    obtenerEstadisticas() {
        const cotizaciones = this.obtenerTodas();
        
        return {
            total: cotizaciones.length,
            porAsesor: this.agruparPorAsesor(cotizaciones),
            porVehiculo: this.agruparPorVehiculo(cotizaciones),
            porPlan: this.agruparPorPlan(cotizaciones),
            porMes: this.agruparPorMes(cotizaciones),
            montoTotal: this.calcularMontoTotal(cotizaciones)
        };
    }

    agruparPorAsesor(cotizaciones) {
        const agrupado = {};
        cotizaciones.forEach(c => {
            if (!agrupado[c.asesorNombre]) {
                agrupado[c.asesorNombre] = 0;
            }
            agrupado[c.asesorNombre]++;
        });
        return agrupado;
    }

    agruparPorVehiculo(cotizaciones) {
        const agrupado = {};
        cotizaciones.forEach(c => {
            const key = `${c.vehiculoMarca} ${c.vehiculoModelo}`;
            if (!agrupado[key]) {
                agrupado[key] = 0;
            }
            agrupado[key]++;
        });
        return agrupado;
    }

    agruparPorPlan(cotizaciones) {
        const agrupado = {};
        cotizaciones.forEach(c => {
            if (!agrupado[c.planNombre]) {
                agrupado[c.planNombre] = 0;
            }
            agrupado[c.planNombre]++;
        });
        return agrupado;
    }

    agruparPorMes(cotizaciones) {
        const agrupado = {};
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        cotizaciones.forEach(c => {
            const fecha = new Date(c.fecha);
            const mesKey = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
            
            if (!agrupado[mesKey]) {
                agrupado[mesKey] = 0;
            }
            agrupado[mesKey]++;
        });
        return agrupado;
    }

    calcularMontoTotal(cotizaciones) {
        return cotizaciones.reduce((total, c) => total + (c.montoTotal || 0), 0);
    }

    // Limpiar todas las cotizaciones (solo para desarrollo/pruebas)
    limpiarTodo() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem('contadores_asesores');
    }

    // Generar cotizaciones de prueba
    generarDatosPrueba() {
        const asesores = [
            { id: 1, nombre: "Aquiles Vallejo" },
            { id: 2, nombre: "Allison Vinueza" },
            { id: 3, nombre: "Maelo Zurita" },
            { id: 4, nombre: "Isaac Andrade" },
            { id: 5, nombre: "Arelis Cevallos" }
        ];

        const vehiculos = [
            { id: 1, marca: "Toyota", modelo: "Corolla", precio: 23000 },
            { id: 2, marca: "Honda", modelo: "Civic", precio: 25000 },
            { id: 3, marca: "Mazda", modelo: "CX-5", precio: 32000 },
            { id: 4, marca: "Hyundai", modelo: "Tucson", precio: 30000 },
            { id: 5, marca: "Ford", modelo: "Mustang", precio: 55000 },
            { id: 6, marca: "Chevrolet", modelo: "Camaro", precio: 60000 }
        ];

        const planes = [
            { id: 1, nombre: "12 meses", tasa: 5 },
            { id: 2, nombre: "24 meses", tasa: 7 },
            { id: 3, nombre: "36 meses", tasa: 9 },
            { id: 4, nombre: "48 meses", tasa: 11 },
            { id: 5, nombre: "60 meses", tasa: 13 }
        ];

        // Generar 50 cotizaciones aleatorias
        for (let i = 0; i < 50; i++) {
            const asesor = asesores[Math.floor(Math.random() * asesores.length)];
            const vehiculo = vehiculos[Math.floor(Math.random() * vehiculos.length)];
            const plan = planes[Math.floor(Math.random() * planes.length)];
            const entrada = vehiculo.precio * (0.1 + Math.random() * 0.2); // 10-30% entrada

            this.guardarCotizacion({
                asesorId: asesor.id,
                asesorNombre: asesor.nombre,
                vehiculoId: vehiculo.id,
                vehiculoMarca: vehiculo.marca,
                vehiculoModelo: vehiculo.modelo,
                vehiculoPrecio: vehiculo.precio,
                planId: plan.id,
                planNombre: plan.nombre,
                planMeses: parseInt(plan.nombre),
                entrada: entrada,
                montoFinanciar: vehiculo.precio - entrada,
                montoTotal: vehiculo.precio,
                clienteNombre: `Cliente ${i + 1}`,
                clienteEmail: `cliente${i + 1}@email.com`
            });
        }

        console.log('✅ Datos de prueba generados exitosamente');
    }
}

// Instancia global
export const gestorCotizaciones = new GestorCotizaciones();