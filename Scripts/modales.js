'use strict'
// LÓGICA DEL SISTEMA DE MODALES (UI)

function cerrarModalSistema() {
    var modal = document.getElementById('modal-sistema')
    modal.classList.add('oculto')
}

function lanzarModal(titulo, htmlContenido, mostrarCancelar, callbackAceptar) {
    var modal = document.getElementById('modal-sistema')
    var tituloDOM = document.getElementById('modal-titulo')
    var cuerpoDOM = document.getElementById('modal-cuerpo')
    var btnAceptar = document.getElementById('btn-aceptar')
    var btnCancelar = document.getElementById('btn-cancelar')

    tituloDOM.textContent = titulo
    cuerpoDOM.innerHTML = htmlContenido

    modal.classList.remove('oculto')
    
    if (mostrarCancelar) {
        btnCancelar.classList.remove('oculto')
        
        var nuevoBtnCancelar = btnCancelar.cloneNode(true)
        btnCancelar.parentNode.replaceChild(nuevoBtnCancelar, btnCancelar)
        
        nuevoBtnCancelar.addEventListener('click', cerrarModalSistema)
    } else {
        btnCancelar.classList.add('oculto')
    }
    
    var nuevoBtnAceptar = btnAceptar.cloneNode(true)
    btnAceptar.parentNode.replaceChild(nuevoBtnAceptar, btnAceptar)

    nuevoBtnAceptar.addEventListener('click', function() {
        if (callbackAceptar) {
            callbackAceptar()
        }
    })
}