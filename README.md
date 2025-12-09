# 💣 Buscaminas (MineSweeper) - DAW

Este proyecto es una recreación del clásico juego **Buscaminas**, desarrollado como Trabajo Práctico Final para la materia **Desarrollo y Arquitecturas Web (DAW)**.

🔗 **[Para Jugar, dirigirse a GitHub Pages)](https://agus-aguero.github.io/Aguero-DAW-MineSweeper/)**

## Funcionalidades Principales

###  Mecánica del Juego
* **Tablero Dinámico:** Generación de la matriz de juego mediante JavaScript.
* **Controles Clásicos:**
    *  **Clic Izquierdo:** Descubrir celda.
    *  **Clic Derecho:** Colocar/Quitar bandera (🚩).
* **Sistema de Dificultad:** Selección mediante menú modal.
    *  Fácil (8x8 - 10 minas)
    *  Medio (12x12 - 25 minas)
    *  Difícil (16x16 - 40 minas)
* **Temporizador y Contador:** Monitoreo de tiempo y minas restantes en tiempo real.
* **Efectos de Sonido:** Audio para ganar, perder, clic y banderas.

###  Características Técnicas
* **Modo Oscuro / Claro:** Implementado con Variables CSS
* **Validación de Usuario:** Ingreso obligatorio de nombre de jugador (mínimo 3 caracteres) antes de iniciar.
* **Sistema de Modales:** Desarrollo de una arquitectura de ventanas modales desde cero. Aplicando manipulación del DOM y separación de responsabilidades.
* **Formulario de Contacto:**
    * Validaciones estrictas con **Expresiones Regulares (Regex)** para nombre (alfanumérico) y email.
    * Integración con cliente de correo predeterminado (`mailto`).

## Tecnologías Utilizadas

* **HTML:** Estructura semántica.
* **CSS:**
    * Diseño maquetado integramente con **Flexbox**.
    * Uso de **Variables CSS (Custom Properties)** para la gestión de temas.
    * Estilos normalizados (`reset.css`).
* **JavaScript:**
    * Cumplimiento estricto del estándar **ES5**.
    * Modo estricto (`'use strict'`).
    * Manejo de eventos mediante `addEventListener`.
    * Código modularizado y ordenado (Bottom-Up).

## 📂 Estructura del Proyecto

El proyecto tiene la siguiente estructura:

```text
/
├── index.html          # Página principal del juego
├── contacto.html       # Página del formulario de contacto
├── README.md           # Documentación
│
├── /Scripts
│   ├── script.js             # Lógica principal del juego y eventos globales
│   ├── contacto.js           # Validaciones y envío de mail
│   └── modales.js            # Logica de los modales
│
├── /Styles
│   ├── style.css             # Estilos generales y tema oscuro
│   ├── style-contacto.css    # Estilos para pagina contactos
│   ├── style-modal.css       #Estilos para los modeales
│   └── reset.css             # Normalización de estilos
│
└── /Sonidos                  # Carpeta con todos los archivos de sonido
