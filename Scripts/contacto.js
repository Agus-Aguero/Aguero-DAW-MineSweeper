'use strict'
// 1. FUNCIONES AUXILIARES

function mostrarError(idElemento, mensaje) {
    var elementoError = document.getElementById(idElemento)
    elementoError.textContent = mensaje
}

// Función auxiliar para el forEach
function limpiarTextoError(small) {
    small.textContent = ''
}

function limpiarErrores() {
    var mensajesError = document.querySelectorAll('.mensaje-error')
    mensajesError.forEach(limpiarTextoError)
}

function cerrarModal() {
    var modal = document.getElementById('modal')
    modal.classList.add('oculto')
}

function cerrarModalClickFuera(event) {
    var modal = document.getElementById('modal')
    if (event.target === modal) {
        modal.classList.add('oculto')
    }
}

function mostrarModal(mensaje) {
    var modal = document.getElementById('modal')
    var textoModal = document.getElementById('modal-mensaje')
    var cerrarBtn = document.getElementById('cerrar-modal')

    textoModal.textContent = mensaje
    modal.classList.remove('oculto')
    
    cerrarBtn.addEventListener('click', cerrarModal)
    window.addEventListener('click', cerrarModalClickFuera)
}

// 2. LÓGICA DE ENVÍO DE MAIL (Mailto)

function enviarPorMailto(nombre, apellido, email, mensaje) {
    var destinatario = 'agustin.aguero@alumnos.uai.edu.ar'
    var asunto = 'Consulta de Contacto - ' + nombre + ' ' + apellido
    var cuerpoCorreo = 'Hola, soy ' + nombre + ' ' + apellido + '.\n\nMensaje:\n' + mensaje

    var mailtoLink = 'mailto:' + destinatario + 
                     '?subject=' + encodeURIComponent(asunto) + 
                     '&body=' + encodeURIComponent(cuerpoCorreo)
    
    window.location.href = mailtoLink
    
    mostrarModal('Validación exitosa. Abriendo cliente de correo...')
}

// 3. VALIDACION DEL FORMULARIO

function manejarSubmit(event) {
    event.preventDefault() // Detiene el envío automático

    var nombreInput = document.getElementById('nombre')
    var apellidoInput = document.getElementById('apellido')
    var emailInput = document.getElementById('email')
    var mensajeInput = document.getElementById('id-comentario')
    
    var esValido = true
    var regexAlfanumerico = /^[a-zA-Z0-9\s]+$/
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    limpiarErrores()

    // --- Validacion del nombre ---
    if (nombreInput.value.trim() === '') {
        mostrarError('error-nombre', 'El nombre es obligatorio.')
        esValido = false
    } else if (!regexAlfanumerico.test(nombreInput.value)) {
        mostrarError('error-nombre', 'El nombre solo puede contener letras y números.')
        esValido = false
    }

    // --- Validacion del MAIL ---
    if (!regexEmail.test(emailInput.value.trim())) {
        mostrarError('error-email', 'Por favor, ingresa un correo electrónico válido.')
        esValido = false
    }

    // --- Validacion mensaje ---
    if (mensajeInput.value.trim().length <= 5) {
        mostrarError('error-comentario', 'El mensaje debe tener más de 5 caracteres.')
        esValido = false
    }
    if (!esValido) {
        return
    }

    enviarPorMailto(nombreInput.value, apellidoInput.value, emailInput.value, mensajeInput.value)
}

// 4. INICIALIZACIÓN DE EVENTOS

function iniciarEventosContacto() {
    var formulario = document.getElementById('form-suscripcion')
    formulario.addEventListener('submit', manejarSubmit)
}

iniciarEventosContacto()