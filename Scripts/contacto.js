document.getElementById('form-suscripcion').addEventListener('submit', function(event) {
    event.preventDefault(); // Detenemos el envío automático para verificar primero

    var nombreInput = document.getElementById('nombre');
    var emailInput = document.getElementById('email');
    var mensajeInput = document.getElementById('id-comentario');
    var apellidoInput = document.getElementById('apellido');

    limpiarErrores();

    let esValido = true; 

    // --- Validacion del nombre ---
    // Explicación Regex: ^ (inicio), [a-zA-Z0-9\s] (letras, números y espacios), + (uno o más), $ (fin)
    var regexAlfanumerico = /^[a-zA-Z0-9\s]+$/;
    
    if (nombreInput.value.trim() === "") {
        mostrarError('error-nombre', 'El nombre es obligatorio.');
        esValido = false;
    } else if (!regexAlfanumerico.test(nombreInput.value)) {
        mostrarError('error-nombre', 'El nombre solo puede contener letras y números.');
        esValido = false;
    }

    // --- Validacion del MAIL  ---
    // Esta regex verifica texto + @ + texto + . + texto
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regexEmail.test(emailInput.value.trim())) {
        mostrarError('error-email', 'Por favor, ingresa un correo electrónico válido.');
        esValido = false;
    }

    // --- Validacion mensaje mayor a 5 caracteres ---
    if (mensajeInput.value.trim().length <= 5) {
        mostrarError('error-comentario', 'El mensaje debe tener más de 5 caracteres.');
        esValido = false;
    }

    if (!esValido) {
        return;
    }

    enviarPorMailto(nombreInput.value, apellidoInput.value, emailInput.value, mensajeInput.value);
});

function mostrarError(idElemento, mensaje) {
    var elementoError = document.getElementById(idElemento);
    elementoError.textContent = mensaje;
}

function limpiarErrores() {
    var mensajesError = document.querySelectorAll('.error-message');
    mensajesError.forEach(small => {
        small.textContent = '';
    });
}

function enviarPorMailto(nombre, apellido, email, mensaje) {
    var destinatario = "agustin.aguero@alumnos.uai.edu.ar";
    var asunto = `Consulta de Contacto - ${nombre} ${apellido}`;
    var cuerpoCorreo = `Hola, soy ${nombre} ${apellido}.\n\nMensaje:\n${mensaje}`;

    var mailtoLink = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoCorreo)}`;
    
    window.location.href = mailtoLink;
    
    mostrarModal("Validación exitosa. Abriendo cliente de correo...");
}

function mostrarModal(mensaje) {
    var modal = document.getElementById('modal');
    var textoModal = document.getElementById('modal-mensaje');
    var cerrarBtn = document.getElementById('cerrar-modal');

    textoModal.textContent = mensaje;
    modal.classList.remove('oculto');
    cerrarBtn.onclick = () => modal.classList.add('oculto');
    window.onclick = (event) => {
        if (event.target == modal) modal.classList.add('oculto');
    }
}