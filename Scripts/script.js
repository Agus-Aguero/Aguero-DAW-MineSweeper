'use strict'

// 1. VARIABLES GLOBALES

var segundos = 0
var intervaloTiempo = null
var filas = 8
var columnas = 8
var lado = 30
var nombreJugador = 'Jugador'
var marcas = 0
var minas = 10
var tablero = []

var enJuego = true
var juegoIniciado = false

var sonido_ganador = new Audio('Sonidos/sonido_ganador.ogg')
var sonido_win = new Audio('Sonidos/sonido_win.ogg')
var sonido_perdedor = new Audio('Sonidos/sonido_perdedor.ogg')
var sonido_gameover = new Audio('Sonidos/sonido_gameover.ogg')
var sonido_descubrir = new Audio('Sonidos/sonido_descubrir.ogg')
var sonido_juegonuevo = new Audio('Sonidos/sonido_nuevojuego.ogg')
var sonido_abrirarea = new Audio('Sonidos/sonido_abrirarea.ogg')
var sonido_marca = new Audio('Sonidos/sonido_marca.ogg')

// 2. FUNCIONES AUXILIARES

function actualizarTemporizadorDOM() {
    var contadorHTML = document.getElementById('temporizador')
    var tiempoFormateado = segundos.toString().padStart(3, '0')
    contadorHTML.innerHTML = tiempoFormateado
}

function aumentarTiempo() {
    segundos++
    actualizarTemporizadorDOM()
}

function iniciarTiempo() {
    if (!intervaloTiempo) {
        intervaloTiempo = setInterval(aumentarTiempo, 1000)
    }
}

function actualizarPanelMinas() {
    var panel = document.getElementById('minas')
    panel.innerHTML = minas - marcas
}

function vaciarTablero() {
    tablero = []
    for (let c = 0; c < columnas; c++) {
        tablero.push([])
    }
}

function procesarRespuestaModal(result) {
    if (result.isConfirmed) {
        nuevoJuego()
    }
}

// 3. LÓGICA DE DATOS (Tablero y Minas)

function ponerMinas() {
    for (let i = 0; i < minas; i++) {
        let c
        let f
        do {
            c = Math.floor(Math.random() * columnas)
            f = Math.floor(Math.random() * filas)
        } while (tablero[c][f]);
        
        tablero[c][f] = { valor: -1 }
    }
}

function contadoresMinas() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (!tablero[c][f]) {
                let contador = 0
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) { continue }
                        try {
                            if (tablero[c + i][f + j].valor === -1) {
                                contador++
                            }
                        } catch (e) {}
                    }
                }
                tablero[c][f] = { valor: contador }
            }
        }
    }
}

function generarTableroJuego() {
    vaciarTablero()
    ponerMinas()
    contadoresMinas()
}

// 4. LÓGICA DEL JUEGO (Ganar, Perder, Abrir Áreas)

function verificarGanador() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[c][f].estado !== 'descubierto') {
                if (tablero[c][f].valor === -1) { continue } else { return }
            }
        }
    }
    
    var tableroHTML = document.getElementById("tablero")
    tableroHTML.style.background = "green"
    enJuego = false
    clearInterval(intervaloTiempo)
    sonido_ganador.play()
    sonido_win.play()

    var mensaje = '¡Felicitaciones ' + nombreJugador + '!\nTu tiempo fue de ' + segundos + ' segundos.'
    lanzarModal('¡Ganaste! 🏆', mensaje, false, function() {
        cerrarModalSistema()
        nuevoJuego()
    })
}

function verificarPerdedor() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[c][f].valor === -1) {
                if (tablero[c][f].estado === 'descubierto') {
                    var tableroHTML = document.getElementById('tablero')
                    tableroHTML.style.background = 'red'
                    enJuego = false
                    clearInterval(intervaloTiempo)
                    sonido_perdedor.play()
                    sonido_gameover.play()

                    var mensaje = 'Has perdido, pisaste una mina.'
                    lanzarModal('¡BOOM! 💣', mensaje, false, function() {
                        cerrarModalSistema()
                        nuevoJuego()
                    })
                }
            }
        }
    }

    if (enJuego) { return }

    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[c][f].valor === -1) {
                let celda = document.getElementById('celda-' + c + '-' + f)
                celda.innerHTML = '💣'
                celda.style.color = 'black'
            }
        }
    }
}

function abrirArea(c, f) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) { continue }
            try {
                if (tablero[c + i][f + j].estado !== 'descubierto') {
                    if (tablero[c + i][f + j].estado !== 'marcado') {
                        tablero[c + i][f + j].estado = 'descubierto'
                        sonido_abrirarea.play()
                        if (tablero[c + i][f + j].valor === 0) {
                            abrirArea(c + i, f + j)
                        }
                    }
                }
            } catch (e) {}
        }
    }
}

// 5. DIBUJO DEL TABLERO

function generarTableroHTML() {
    var html = ''
    var tableroHTML = document.getElementById('tablero')
    
    for (let f = 0; f < filas; f++) {
        html += '<tr>'
        for (let c = 0; c < columnas; c++) {
            html += '<td id="celda-' + c + '-' + f + '" style="width:' + lado + 'px;height:' + lado + 'px">'
            html += '</td>'
        }
        html += '</tr>'
    }
    
    tableroHTML.innerHTML = html
    tableroHTML.style.width = (columnas * lado) + 'px'
    tableroHTML.style.height = (filas * lado) + 'px'
    tableroHTML.style.background = 'slategray'
}

function refrescarTablero() {
    var celda
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            celda = document.getElementById('celda-' + c + '-' + f)
            
            if (tablero[c][f].estado === 'descubierto') {
                celda.style.boxShadow = 'none'
                switch (tablero[c][f].valor) {
                    case -1:
                        celda.innerHTML = '💣'
                        celda.style.color = 'black'
                        celda.style.background = 'white'
                        break
                    case 0:
                        break
                    default:
                        celda.innerHTML = tablero[c][f].valor
                        break
                }
            }
            if (tablero[c][f].estado === 'marcado') {
                celda.innerHTML = '🚩'
                celda.style.background = 'cadetblue'
            }
            if (tablero[c][f].estado === undefined) {
                celda.innerHTML = ''
                celda.style.background = ''
            }
        }
    }
    verificarGanador()
    verificarPerdedor()
    actualizarPanelMinas()
}

// 6. MANEJADORES DE EVENTOS

function dobleClic(celda, c, f, me) {
    if (!enJuego) { return }
    abrirArea(c, f)
    refrescarTablero()
}

function clicSimple(celda, c, f, me) {
    if (!enJuego) { return }
    if (tablero[c][f].estado === 'descubierto') { return }

    switch (me.button) {
        case 0:
            if (tablero[c][f].estado === 'marcado') { break }
            while (!juegoIniciado && tablero[c][f].valor === -1) {
                generarTableroJuego()
            }
            tablero[c][f].estado = 'descubierto'
            sonido_descubrir.play()
            if (juegoIniciado === false) {
                iniciarTiempo()
            }
            juegoIniciado = true
            if (tablero[c][f].valor === 0) {
                abrirArea(c, f)
            }
            break
        case 1:
            break
        case 2:
            if (tablero[c][f].estado === 'marcado') {
                tablero[c][f].estado = undefined
                marcas--
                sonido_marca.play()
            } else {
                tablero[c][f].estado = 'marcado'
                marcas++
                sonido_marca.play()
            }
            break
        default:
            break
    }
    refrescarTablero()
}

function añadirEventos() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            var celda = document.getElementById('celda-' + c + '-' + f)
            celda.addEventListener('dblclick', dobleClic.bind(null, celda, c, f))
            celda.addEventListener('mouseup', clicSimple.bind(null, celda, c, f))
        }
    }
}

// 7. CONTROL DEL JUEGO (Lógica Principal)

function reiniciarVariables() {
    marcas = 0
    enJuego = true
    juegoIniciado = false
    segundos = 0

    clearInterval(intervaloTiempo)
    intervaloTiempo = null
    actualizarTemporizadorDOM()
}

function nuevoJuego() {
    sonido_juegonuevo.play()
    reiniciarVariables()
    generarTableroHTML()
    generarTableroJuego()
    añadirEventos()
    refrescarTablero()
}

// 8. INTERFAZ Y CONFIGURACIÓN (Inputs, Ajustes, Inicio)

function aplicarAjustes(result) {
    var nivel = result.value
    if (!nivel) { return }

    switch (nivel) {
        case 'facil':
            filas = 8; columnas = 8; minas = 10; break;
        case 'medio':
            filas = 12; columnas = 12; minas = 25; break;
        case 'dificil':
            filas = 16; columnas = 16; minas = 40; break;
    }
    nuevoJuego()
}

function ajustes() {
    var contenidoHTML = document.getElementById('tpl-ajustes').innerHTML

    lanzarModal('Configuración', contenidoHTML, true, function() {
        var select = document.getElementById('select-dificultad-dinamico')
        
        if (!select) return 

        var nivel = select.value

        switch (nivel) {
            case 'facil':
                filas = 8; columnas = 8; minas = 10; break;
            case 'medio':
                filas = 12; columnas = 12; minas = 25; break;
            case 'dificil':
                filas = 16; columnas = 16; minas = 40; break;
        }

        cerrarModalSistema()
        nuevoJuego()
    })
}

function iniciarJuegoConNombre(result) {
    var nombre = result.value
    nombreJugador = nombre
    document.getElementById('nombre-jugador').innerHTML = nombreJugador
    nuevoJuego()
}

function pedirNombre() {
    var contenidoHTML = document.getElementById('tpl-pedir-nombre').innerHTML

    lanzarModal('Bienvenido', contenidoHTML, false, function() {
        var input = document.getElementById('input-jugador-dinamico')
        var error = document.getElementById('error-modal-dinamico')
        var valor = input.value.trim()

        if (valor.length < 3) {
            error.classList.remove('oculto')
            input.style.borderColor = 'red'
            error.textContent = '¡El nombre debe tener al menos 3 letras!'
        } else {
            nombreJugador = valor
            document.getElementById("nombre-jugador").innerHTML = nombreJugador
            cerrarModalSistema()
            nuevoJuego()
        }
    })
}

function iniciarEventosGlobales() {
    var btnNuevo = document.getElementById('juego-nuevo')
    var btnAjustes = document.getElementById('ajustes')
    var btnContacto = document.getElementById('btn-ir-contacto')
    var btnTema = document.getElementById('tema')
    
    btnNuevo.addEventListener('click', nuevoJuego)
    btnAjustes.addEventListener('click', ajustes)

    if (btnContacto) {
        btnContacto.addEventListener('click', function() {
            window.location.href = 'contacto.html'
        })
    }

    if (btnTema) {
        btnTema.addEventListener('click', cambiarTema)
    }
    
    document.body.addEventListener('contextmenu', function(event) {
        event.preventDefault()
        return false
    })
}

function cambiarTema() {
    var cuerpo = document.body
    var btnTema = document.getElementById('tema')
    
    cuerpo.classList.toggle('modo-oscuro')

    if (cuerpo.classList.contains('modo-oscuro')) {
        btnTema.innerHTML = '☀️' 
        localStorage.setItem('tema', 'oscuro')
    } else {
        btnTema.innerHTML = '🌙'
        localStorage.setItem('tema', 'claro')
    }
}

// 9. INICIO DEL JUEGO
iniciarEventosGlobales()
pedirNombre()