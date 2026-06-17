// 1. Control del Modal de Información Nutricional (Corregido para leer Ingredientes)
const modal = document.getElementById("nutricion-modal");
const btnCerrar = document.getElementById("cerrar-modal");

document.querySelectorAll('.btn-info').forEach(boton => {
    boton.addEventListener('click', function() {
        // Buscamos el contenedor '.producto-info' de esta tarjeta específica
        const contenedorInfo = this.closest('.producto-info');
        // Buscamos el bloque oculto que contiene la tabla y los ingredientes
        const bloqueDatos = contenedorInfo.querySelector(".datos-nutricionales");

        if (bloqueDatos) {
            // Inyectamos todo el contenido oculto dentro del cuerpo del modal
            document.getElementById("modal-body").innerHTML = bloqueDatos.innerHTML;
            // Mostramos el modal en la pantalla
            modal.style.display = "flex";
        }
    });
});
// Función para cerrar el modal de forma limpia
function ocultarModal() {
    modal.style.display = "none";
}

// Evento para cerrar al hacer clic en la 'X'
if (btnCerrar) {
    btnCerrar.addEventListener('click', ocultarModal);
}

// Evento para cerrar si hacen clic fuera de la caja blanca del modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        ocultarModal();
    }
});


// 2. Sistema de Filtro en Tiempo Real del Buscador
const buscador = document.getElementById('buscador');
if (buscador) {
    buscador.addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        const productos = document.querySelectorAll('.producto');

        productos.forEach(producto => {
            const nombre = producto.querySelector('h2').innerText.toLowerCase();
            producto.style.display = nombre.includes(filtro) ? 'flex' : 'none';
        });
    });
}
// 3. Botón de Regresar (Historial de navegación)
const btnRegresar = document.getElementById('btn-regresar');
if (btnRegresar) {
    btnRegresar.addEventListener('click', () => {
        window.history.back();
    });
}


// 4. Botón Top (Scroll automático hacia arriba)
const btnTop = document.getElementById('btn-top');
if (btnTop) {
    btnTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}