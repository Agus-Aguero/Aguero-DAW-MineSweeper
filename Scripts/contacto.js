/*      VALIDACIONES DEL FOMULARIO      */

document.getElementById('form-suscripcion').addEventListener('submit', function(event) {
    event.preventDefault(); // Detenemos el envío automático para verificar primero

    // 1. Obtener los elementos (inputs y lugares de error)
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const mensajeInput = document.getElementById('id-comentario');
    
    // (Opcional) Si quieres validar apellido también, agrégalo aquí
    const apellidoInput = document.getElementById('apellido');

    // 2. Limpiar errores previos (si el usuario corrige, borramos el mensaje rojo)
    limpiarErrores();

    // Variable bandera: Asumimos que todo está bien, si algo falla la cambiamos a false
    let esValido = true; 

    // --- VALIDACIÓN 1: NOMBRE ALFANUMÉRICO ---
    // Explicación Regex: ^ (inicio), [a-zA-Z0-9\s] (letras, números y espacios), + (uno o más), $ (fin)
    const regexAlfanumerico = /^[a-zA-Z0-9\s]+$/;
    
    if (nombreInput.value.trim() === "") {
        mostrarError('error-nombre', 'El nombre es obligatorio.');
        esValido = false;
    } else if (!regexAlfanumerico.test(nombreInput.value)) {
        mostrarError('error-nombre', 'El nombre solo puede contener letras y números.');
        esValido = false;
    }

    // --- VALIDACIÓN 2: MAIL VÁLIDO ---
    // Esta regex verifica texto + @ + texto + . + texto
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regexEmail.test(emailInput.value.trim())) {
        mostrarError('error-email', 'Por favor, ingresa un correo electrónico válido.');
        esValido = false;
    }

    // --- VALIDACIÓN 3: MENSAJE MAYOR A 5 CARACTERES ---
    if (mensajeInput.value.trim().length <= 5) {
        mostrarError('error-comentario', 'El mensaje debe tener más de 5 caracteres.');
        esValido = false;
    }

    // 3. SI ALGUNA VALIDACIÓN FALLÓ, PARAMOS AQUÍ
    if (!esValido) {
        return; // "return" sin nada corta la ejecución de la función. No se envía nada.
    }

    // 4. SI LLEGAMOS ACÁ, TODO ESTÁ PERFECTO -> PROCEDEMOS AL ENVÍO
    enviarPorMailto(nombreInput.value, apellidoInput.value, emailInput.value, mensajeInput.value);
});

// --- FUNCIONES AUXILIARES (Para tener el código ordenado) ---

function mostrarError(idElemento, mensaje) {
    const elementoError = document.getElementById(idElemento);
    elementoError.textContent = mensaje;
}

function limpiarErrores() {
    // Seleccionamos todos los small y los vaciamos
    const mensajesError = document.querySelectorAll('.error-message');
    mensajesError.forEach(small => {
        small.textContent = '';
    });
}

function enviarPorMailto(nombre, apellido, email, mensaje) {
    const destinatario = "tucorreo@universidad.edu.ar";
    const asunto = `Consulta de Contacto - ${nombre} ${apellido}`;
    const cuerpoCorreo = `Hola, soy ${nombre} ${apellido}.\n\nMi correo es: ${email}\n\nMensaje:\n${mensaje}`;

    const mailtoLink = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoCorreo)}`;
    
    window.location.href = mailtoLink;
    
    // Opcional: Mostrar el modal de éxito si lo deseas
    mostrarModal("Validación exitosa. Abriendo cliente de correo...");
}

// Lógica del Modal (la misma de antes)
function mostrarModal(mensaje) {
    const modal = document.getElementById('modal');
    const textoModal = document.getElementById('modal-mensaje');
    const cerrarBtn = document.getElementById('cerrar-modal');

    textoModal.textContent = mensaje;
    modal.classList.remove('oculto');
    cerrarBtn.onclick = () => modal.classList.add('oculto');
    window.onclick = (event) => {
        if (event.target == modal) modal.classList.add('oculto');
    }
}