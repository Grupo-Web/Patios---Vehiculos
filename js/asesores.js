import { integrantes } from "../data/db_asesores.js"

const principal = document.querySelector(".principal");

function cargarAsesores(array, main) {

    array.forEach((integrante,index) => {
        const tarjeta = document.createElement("section");
        tarjeta.classList.add("tarjeta-asesor", `asesor-${index}`);

        const nombre = document.createElement("h1");
        nombre.classList.add("nombre-asesor");
        nombre.textContent = integrante.nombre;

        const foto=document.createElement("img")
        foto.classList.add("foto-asesor")
        foto.src= integrante.foto

        const rol= document.createElement("h2");
        rol.classList.add("rol-asesor")
        rol.textContent = integrante.rol;

        const experiencia= document.createElement("h3");
        experiencia.classList.add("experiencia-asesor")
        experiencia.textContent=  integrante.experiencia + " de experiencia";

        const descripcion = document.createElement("p");
        descripcion.classList.add("descripcion-asesor")
        descripcion.textContent= integrante.descripcion;

        const cotizaciones = document.createElement("h3")
        cotizaciones.classList.add("cotizaciones-asesor")
        cotizaciones.textContent =  integrante.cotizaciones +" cotizaciones"


        tarjeta.appendChild(nombre);
        tarjeta.appendChild(foto);
        tarjeta.appendChild(rol);
        tarjeta.appendChild(experiencia);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(cotizaciones)
        main.appendChild(tarjeta);

    });
}

cargarAsesores(integrantes, principal);


// console.log("SCRIPT CARGADO");
// console.log(integrantes);