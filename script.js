// JavaScript Document - Método ORA Optimizado y Corregido

// --- 1. NAVEGACIÓN Y ACCIONES DEL SISTEMA ---
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// --- 2. DICCIONARIOS Y CONFIGURACIONES ---
const TIPOS_PLANTEAMIENTO = [
  "DESCRIPCIÓN DE LA REALIDAD",
  "OPORTUNIDAD DIAGNÓSTICO",
  "ELEMENTO DE SOLUCIÓN"
];

const TIPOS_JUSTIFICACION = [
  "MOTIVO",
  "INTERÉS",
  "BENEFICIO"
];

let contadorFichas = 0;
let fichasInicializadas = false;

// --- 3. FUNCIONES DE VALIDACIÓN Y PALABRAS ---
function limitarPalabras(elemento, maxPalabras) {
  let palabras = elemento.value.trim().split(/\s+/);
  if (palabras.length > maxPalabras && palabras[0] !== "") {
    elemento.value = palabras.slice(0, maxPalabras).join(" ");
  }
}

function validarFormatoAPA(elemento) {
  const texto = elemento.value.trim();
  if (texto === "") {
    elemento.classList.remove("apa-invalid");
    elemento.title = "";
    return;
  }

  const esSoloURL = /^https?:\/\/[^\s]+$/i.test(texto);
  const tieneAnoParentesis = /\((19|20)\d{2}\)/.test(texto);

  // Si es solo URL o no tiene año entre paréntesis, marca el borde en rojo
  if (esSoloURL || !tieneAnoParentesis) {
    elemento.classList.add("apa-invalid");
    elemento.title = "Ingrese la cita completa en formato APA (Autor, Año, Título, Fuente). No ingrese solo el link.";
  } else {
    elemento.classList.remove("apa-invalid");
    elemento.title = "";
  }
}

function obtenerCamposAPA() {
  const candidatos = document.querySelectorAll(
    ".input-apa-origen, .ref-objeto-origen, .ref-proposito-origen, .ref-audiencia-origen, textarea[placeholder*='APA'], input[placeholder*='APA']"
  );

  return Array.from(candidatos);
}

// --- 4. CONCATENACIÓN Y RÉPLICA DE TÍTULO ---
function replicarTitulo(titulo, incluirCampoOrigen = true) {
  const selector = incluirCampoOrigen
    ? ".titulo-origen, .titulo-target, .pregunta-titulo-replica, #titulo_origen, .titulo-replica-target"
    : ".titulo-origen, .titulo-target, .pregunta-titulo-replica, .titulo-replica-target";

  const camposTitulo = document.querySelectorAll(selector);
  camposTitulo.forEach(el => {
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      el.value = titulo;
    } else {
      el.textContent = titulo;
    }
  });
}

function actualizarTitulo() {
  const tituloOrigen = document.getElementById("titulo_origen");
  const tituloActual = tituloOrigen?.value || "";

  replicarTitulo(tituloActual, false);
  evaluarTitulo(tituloActual);
}

function normalizarTexto(texto) {
  return texto
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
}

function obtenerPalabrasClave(texto) {
  const palabrasIgnoradas = new Set([
    "a", "al", "con", "de", "del", "el", "en", "la", "las", "los", "para",
    "por", "que", "su", "sus", "un", "una", "y"
  ]);

  return [...new Set(normalizarTexto(texto)
    .split(/\s+/)
    .filter((palabra) => palabra.length > 2 && !palabrasIgnoradas.has(palabra)))];
}

function evaluarTitulo(titulo) {
  const evaluacion = document.getElementById("evaluacion_titulo");
  if (!evaluacion) return;

  const variables = [
    { nombre: "Objeto de estudio", campo: document.getElementById("var_objeto_origen") },
    {
      nombre: "Propósito disciplinar",
      campo: document.getElementById("select_asignaturas_npi"),
      alternativa: document.getElementById("variable_proposito_alternativa")
    },
    { nombre: "Audiencia", campo: document.getElementById("var_audiencia_origen") }
  ];
  const textoTitulo = normalizarTexto(titulo);

  if (!textoTitulo) {
    evaluacion.className = "title-evaluation";
    evaluacion.innerHTML = "Escriba un título para evaluar su relación con las tres variables.";
    return;
  }

  const resultados = variables.map((variable) => {
    const valor = variable.campo?.value?.trim() || variable.alternativa?.value?.trim() || "";
    const palabrasClave = obtenerPalabrasClave(valor);
    const palabrasIncluidas = palabrasClave.filter((palabra) => textoTitulo.includes(palabra));
    const porcentaje = palabrasClave.length
      ? palabrasIncluidas.length / palabrasClave.length
      : 0;
    return {
      nombre: variable.nombre,
      disponible: Boolean(valor),
      incluida: Boolean(palabrasClave.length && porcentaje >= 0.5),
      palabrasFaltantes: palabrasClave.filter((palabra) => !textoTitulo.includes(palabra))
    };
  });

  const faltantes = resultados.filter((resultado) => !resultado.incluida);
  const tituloBienRedactado = textoTitulo.split(/\s+/).length >= 3
    && !/[.!?]$/.test(titulo.trim())
    && /[a-záéíóúñ]/.test(titulo);
  const estadoValido = faltantes.length === 0 && tituloBienRedactado;
  const detalle = resultados.map((resultado) => {
    if (!resultado.disponible) return `${resultado.nombre}: falta definir la variable`;
    if (resultado.incluida) return `${resultado.nombre}: incluida`;
    const faltan = resultado.palabrasFaltantes.slice(0, 3).join(", ");
    return `${resultado.nombre}: revisar${faltan ? ` (considere: ${faltan})` : ""}`;
  }).join(" · ");

  evaluacion.className = `title-evaluation ${estadoValido ? "is-valid" : "is-invalid"}`;
  evaluacion.innerHTML = `<strong>${estadoValido ? "Título pertinente" : "Título por ajustar"}</strong> · ${detalle}`;
}

function evaluarObjetivoGeneral() {
  const evaluacion = document.getElementById("evaluacion_objetivo_general");
  const objetivo = document.querySelector(".objetivo-general-origen")?.value?.trim() || "";
  const verbo = document.querySelector(".objetivo-verbo-origen")?.value?.trim() || "";
  if (!evaluacion) return;

  const textoObjetivo = normalizarTexto(objetivo);
  const verboNormalizado = normalizarTexto(verbo);
  if (!textoObjetivo) {
    evaluacion.className = "title-evaluation";
    evaluacion.innerHTML = "Escriba el objetivo general para evaluar el verbo y su relación con el título del proyecto.";
    return;
  }

  const verboEnInfinitivo = /(?:ar|er|ir)$/.test(verboNormalizado) && verboNormalizado.split(/\s+/).length === 1;
  const verboIncluido = Boolean(verboNormalizado && textoObjetivo.split(/\s+/).includes(verboNormalizado));
  const palabrasFuncionales = new Set([
    "a", "al", "con", "de", "del", "el", "en", "la", "las", "los", "para", "por",
    "que", "su", "sus", "un", "una", "y", "o", "u", "como", "donde", "mediante",
    "sobre", "entre", "hacia", "desde", "hasta", "sin", "segun", "segun", "es", "son"
  ]);
  const variables = [
    { nombre: "Objeto de estudio", campo: document.getElementById("var_objeto_origen") },
    {
      nombre: "Propósito disciplinar",
      campo: document.getElementById("select_asignaturas_npi"),
      alternativa: document.getElementById("variable_proposito_alternativa")
    },
    { nombre: "Audiencia", campo: document.getElementById("var_audiencia_origen") }
  ];
  const resultados = variables.map((variable) => {
    const valor = variable.campo?.value?.trim() || variable.alternativa?.value?.trim() || "";
    const palabrasClave = obtenerPalabrasClave(valor);
    const incluidas = palabrasClave.filter((palabra) => textoObjetivo.includes(palabra));
    const porcentaje = palabrasClave.length ? incluidas.length / palabrasClave.length : 0;
    return { nombre: variable.nombre, disponible: Boolean(valor), incluida: porcentaje >= 0.5 };
  });
  const palabrasPermitidas = new Set([
    verboNormalizado,
    ...obtenerPalabrasClave(document.getElementById("titulo_origen")?.value || ""),
    ...variables.flatMap((variable) => obtenerPalabrasClave(
      variable.campo?.value?.trim() || variable.alternativa?.value?.trim() || ""
    ))
  ]);
  const elementosAdicionales = textoObjetivo
    .split(/\s+/)
    .filter((palabra) => palabra.length > 2)
    .filter((palabra) => !palabrasFuncionales.has(palabra) && !palabrasPermitidas.has(palabra));
  const variablesCompletas = resultados.every((resultado) => resultado.disponible && resultado.incluida);
  const estadoValido = verboEnInfinitivo && verboIncluido && variablesCompletas && elementosAdicionales.length === 0;
  const detalle = [
    verboEnInfinitivo ? "verbo en infinitivo" : "ingrese un verbo único terminado en -ar, -er o -ir",
    verboIncluido ? "verbo incluido" : "el objetivo debe contener el verbo",
    ...resultados.map((resultado) => `${resultado.nombre}: ${resultado.disponible && resultado.incluida ? "incluido" : "revisar"}`),
    elementosAdicionales.length === 0
      ? "redacción específica"
      : `elementos ajenos: ${[...new Set(elementosAdicionales)].join(", ")}`
  ].join(" · ");

  evaluacion.className = `title-evaluation ${estadoValido ? "is-valid" : "is-invalid"}`;
  evaluacion.innerHTML = `<strong>${estadoValido ? "Objetivo pertinente" : "Objetivo por ajustar"}</strong> · ${detalle}`;
}

function obtenerZPorConfianza(confianzaPct) {
  const tablaZ = {
    80: 1.282,
    85: 1.44,
    90: 1.645,
    95: 1.96,
    99: 2.576
  };

  const niveles = Object.keys(tablaZ).map(Number);
  const nivelMasCercano = niveles.reduce((prev, curr) => {
    return Math.abs(curr - confianzaPct) < Math.abs(prev - confianzaPct) ? curr : prev;
  });

  return tablaZ[nivelMasCercano];
}

function calcularMuestraPoblacionFinita(poblacion, confianzaPct, margenErrorPct) {
  if (!poblacion || poblacion <= 0) return null;
  if (!confianzaPct || confianzaPct <= 0) return null;
  if (!margenErrorPct || margenErrorPct <= 0) return null;

  const z = obtenerZPorConfianza(confianzaPct);
  const p = 0.5;
  const q = 1 - p;
  const e = margenErrorPct / 100;

  const n0 = (Math.pow(z, 2) * p * q) / Math.pow(e, 2);
  const n = (poblacion * n0) / (poblacion + n0 - 1);

  return Math.ceil(n);
}

function inicializarReplicasPronostico() {
  const pronosticosOrigen = Array.from(
    document.querySelectorAll("textarea.input-red[placeholder='Pronóstico...']")
  );
  const pronosticosTarget = Array.from(
    document.querySelectorAll("textarea.input-black-replica[placeholder*='Se replica Pronóstico']")
  );

  if (pronosticosOrigen.length === 0 || pronosticosTarget.length === 0) return;

  const totalPares = Math.min(pronosticosOrigen.length, pronosticosTarget.length);

  for (let i = 0; i < totalPares; i++) {
    const origen = pronosticosOrigen[i];
    const destino = pronosticosTarget[i];

    destino.setAttribute("readonly", "readonly");
    destino.value = origen.value;

    origen.addEventListener("input", () => {
      destino.value = origen.value;
    });
  }
}

// --- 5. SISTEMA DE RÉPLICAS CENTRALIZADO ---
function vincularReplica(selectorOrigen, selectorTarget, maxPalabras = null, esAPA = false) {
  const origen = document.querySelector(selectorOrigen);
  if (!origen) return;

  const esReplicaAutomatica = (destino) => destino.readOnly || destino.classList.contains("input-black-replica");
  const sincronizarDestino = (destino, valor) => {
    if (!esReplicaAutomatica(destino) && destino.value.trim()) return;
    destino.value = valor;
    destino.dataset.replicaAutofill = "true";
  };

  const evento = origen.tagName === "SELECT" ? "change" : "input";

  const sincronizar = () => {
    const valor = origen.value;
    const destinos = document.querySelectorAll(selectorTarget);

    destinos.forEach(function (destino) {
      if (destino.tagName === "TEXTAREA" || destino.tagName === "INPUT") {
        sincronizarDestino(destino, valor);
      } else {
        destino.textContent = valor;
      }
    });
  };

  origen.addEventListener(evento, function () {
    if (maxPalabras && evento === "input") {
      limitarPalabras(origen, maxPalabras);
    }

    if (esAPA && evento === "input") {
      validarFormatoAPA(origen);
      actualizarListaReferencias();
    }

    sincronizar();
  });

  document.querySelectorAll(selectorTarget).forEach((destino) => {
    if (esReplicaAutomatica(destino)) return;
    destino.addEventListener("input", () => {
      destino.dataset.replicaAutofill = "false";
    });
  });

  sincronizar();
}

function sincronizarReplicasIniciales() {
  const vinculos = [
    [".var-objeto-origen", ".var-objeto-target"],
    [".var-audiencia-origen", ".var-audiencia-target"],
    [".def-objeto-origen", ".def-objeto-target"],
    [".def-proposito-origen", ".def-proposito-target"],
    [".def-audiencia-origen", ".def-audiencia-target"],
    [".pregunta-conector-origen", ".pregunta-conector-target"],
    [".pregunta-problema-origen", ".pregunta-problema-target"],
    [".supuesto-origen", ".supuesto-target"],
      [".objetivo-general-origen", ".objetivo-general-target"]
  ];

  vinculos.forEach(([selectorOrigen, selectorTarget]) => {
    const origen = document.querySelector(selectorOrigen);
    if (!origen) return;
    const valor = origen.value || "";
    document.querySelectorAll(selectorTarget).forEach((destino) => {
      if (destino.tagName === "TEXTAREA" || destino.tagName === "INPUT") {
        if (destino.readOnly || destino.classList.contains("input-black-replica") || !destino.value.trim()) {
          destino.value = valor;
          destino.dataset.replicaAutofill = "true";
        }
      } else {
        destino.textContent = valor;
      }
    });
  });

  ["a", "b", "c", "d", "e", "f"].forEach((letra) => {
    ["obj", "pro", "aud"].forEach((grupo) => {
      const origen = document.querySelector(`.ind-${grupo}-${letra}-origen`);
      if (!origen) return;
      const valor = origen.value || "";
      document.querySelectorAll(`.ind-${grupo}-${letra}-target`).forEach((destino) => {
        if (destino.tagName === "TEXTAREA" || destino.tagName === "INPUT") {
          if (destino.readOnly || destino.classList.contains("input-black-replica") || !destino.value.trim()) {
            destino.value = valor;
            destino.dataset.replicaAutofill = "true";
          }
        } else {
          destino.textContent = valor;
        }
      });
    });
  });

  const selectProposito = document.querySelector("#select_asignaturas_npi");
  const alternativaProposito = document.querySelector("#variable_proposito_alternativa");
  const proposito = selectProposito?.value || alternativaProposito?.value || "";
  document.querySelectorAll(".var-proposito-target").forEach((destino) => {
    if (destino.tagName === "TEXTAREA" || destino.tagName === "INPUT") {
      if (destino.readOnly || destino.classList.contains("input-black-replica") || !destino.value.trim()) {
        destino.value = proposito;
        destino.dataset.replicaAutofill = "true";
      }
    } else {
      destino.textContent = proposito;
    }
  });

  actualizarTitulo();
}

function validarPreguntasPorIndicador() {
  const letras = ["a", "b", "c", "d", "e", "f"];
  const grupos = ["obj", "pro", "aud"];

  document.querySelectorAll(".grid-op-matrix").forEach((matriz) => {
    const grupo = grupos.find((nombre) => matriz.querySelector(`.ind-${nombre}-a-target`));
    if (!grupo) return;

    const preguntas = Array.from(matriz.querySelectorAll(".op-item-col .q-item-row input"));
    preguntas.forEach((pregunta, index) => {
      const indicador = matriz.querySelector(`.ind-${grupo}-${letras[index]}-target`);
      const textoIndicador = normalizarTexto(indicador?.value || "");
      const textoPregunta = normalizarTexto(pregunta.value || "");
      const esValida = Boolean(textoIndicador && textoPregunta.includes(textoIndicador));
      const fila = pregunta.closest(".q-item-row");
      if (!fila) return;

      let grupoPregunta = pregunta.parentElement;
      if (!grupoPregunta.classList.contains("question-input-group")) {
        grupoPregunta = document.createElement("div");
        grupoPregunta.className = "question-input-group";
        pregunta.replaceWith(grupoPregunta);
        grupoPregunta.appendChild(pregunta);
      }

      let mensaje = fila.querySelector(".question-validation-message");
      if (!mensaje) {
        mensaje = document.createElement("span");
        mensaje.className = "question-validation-message";
        mensaje.textContent = "Especifique indicador de éxito";
        grupoPregunta.appendChild(mensaje);
      }

      pregunta.classList.toggle("question-missing-indicator", !esValida);
      mensaje.hidden = esValida;
    });
  });
}

window.sincronizarReplicasIniciales = sincronizarReplicasIniciales;
window.validarPreguntasPorIndicador = validarPreguntasPorIndicador;

// --- 6. COMPILADOR DINÁMICO DE REFERENCIAS APA ---
function actualizarListaReferencias() {
  const contenedorLista = document.getElementById("contenedor-lista-referencias");
  if (!contenedorLista) return;

  // Compila citas APA de todos los campos relevantes del proyecto.
  const todasLasCitas = obtenerCamposAPA();
  let referenciasValidas = [];

  todasLasCitas.forEach(input => {
    const texto = input.value.trim();
    if (texto !== "") {
      referenciasValidas.push(texto);
    }
  });

  if (referenciasValidas.length === 0) {
    contenedorLista.innerHTML = `
      <p class="placeholder-referencias" style="color: #64748b; font-style: italic;">
        Las citas APA ingresadas en el proyecto se compilarán automáticamente aquí...
      </p>`;
    return;
  }

  let htmlResultante = "";
  referenciasValidas.forEach(ref => {
    htmlResultante += `<textarea class="input-black-replica" rows="2" readonly style="margin-bottom: 8px; width: 100%;">${ref}</textarea>`;
  });

  contenedorLista.innerHTML = htmlResultante;
}

// --- 7. GENERACIÓN DE FICHAS DINÁMICAS Y CONECTORES ---
function reordenarFicha(ficha, contenedor, evento) {
  const fichas = Array.from(contenedor.querySelectorAll(".card-item-dinamico"));
  const objetivo = document.elementFromPoint(evento.clientX, evento.clientY)?.closest(".card-item-dinamico");
  if (!objetivo || objetivo === ficha || !fichas.includes(objetivo)) return false;

  const rect = objetivo.getBoundingClientRect();
  const insertarAntes = evento.clientY < rect.top + rect.height / 2 ||
    (Math.abs(evento.clientY - (rect.top + rect.height / 2)) < rect.height / 2 &&
      evento.clientX < rect.left + rect.width / 2);
  const conector = ficha.previousElementSibling?.classList.contains("connector-block")
    ? ficha.previousElementSibling
    : null;
  const piezas = conector ? [conector, ficha] : [ficha];

  piezas.forEach((pieza) => pieza.remove());
  if (insertarAntes) {
    const conectorObjetivo = objetivo.previousElementSibling?.classList.contains("connector-block")
      ? objetivo.previousElementSibling
      : objetivo;
    conectorObjetivo.before(...piezas);
  } else {
    objetivo.after(...piezas);
  }

  const fichasOrdenadas = Array.from(contenedor.querySelectorAll(".card-item-dinamico"));
  const conectores = Array.from(contenedor.querySelectorAll(".connector-block"));
  fichasOrdenadas.forEach((elemento) => elemento.remove());
  conectores.forEach((elemento) => elemento.remove());
  fichasOrdenadas.forEach((elemento, indice) => {
    contenedor.appendChild(elemento);
    if (conectores[indice]) contenedor.appendChild(conectores[indice]);
  });

  contenedor.querySelectorAll(".card-item-dinamico").forEach((elemento) => {
    elemento.style.transform = "translate(0px, 0px)";
    elemento.dataset.positionX = "0";
    elemento.dataset.positionY = "0";
  });
  notificarCambioFichas();
  return true;
}

function activarArrastreFicha(ficha, contenedor, posicion = {}) {
  const encabezado = ficha.querySelector(".card-header-actions");
  if (!encabezado) return;
  const empunadura = encabezado.querySelector(".drag-handle");
  if (!empunadura) return;

  let posicionX = Number(posicion.x) || 0;
  let posicionY = Number(posicion.y) || 0;
  let inicioX = 0;
  let inicioY = 0;

  const aplicarPosicion = () => {
    ficha.style.transform = `translate(${posicionX}px, ${posicionY}px)`;
  };

  const limitarPosicion = (x, y) => ({
    x: Math.max(-ficha.offsetLeft, Math.min(x, contenedor.clientWidth - ficha.offsetLeft - ficha.offsetWidth)),
    y: Math.max(-ficha.offsetTop, Math.min(y, contenedor.clientHeight - ficha.offsetTop - ficha.offsetHeight))
  });

  const posicionInicial = limitarPosicion(posicionX, posicionY);
  posicionX = posicionInicial.x;
  posicionY = posicionInicial.y;
  aplicarPosicion();
  empunadura.addEventListener("pointerdown", (evento) => {

    inicioX = evento.clientX - posicionX;
    inicioY = evento.clientY - posicionY;
    ficha.classList.add("is-dragging");
    empunadura.setPointerCapture(evento.pointerId);
  });

  encabezado.addEventListener("pointermove", (evento) => {
    if (!ficha.classList.contains("is-dragging")) return;

    const nuevaPosicion = limitarPosicion(evento.clientX - inicioX, evento.clientY - inicioY);
    posicionX = nuevaPosicion.x;
    posicionY = nuevaPosicion.y;
    aplicarPosicion();
  });

  encabezado.addEventListener("pointerup", (evento) => {
    if (!ficha.classList.contains("is-dragging")) return;

    empunadura.releasePointerCapture(evento.pointerId);
    const fueReordenada = reordenarFicha(ficha, contenedor, evento);
    ficha.classList.remove("is-dragging");
    if (!fueReordenada) {
      ficha.dataset.positionX = posicionX;
      ficha.dataset.positionY = posicionY;
    }
    notificarCambioFichas();
  });

  encabezado.addEventListener("pointercancel", () => {
    ficha.classList.remove("is-dragging");
  });

  contenedor.classList.add("has-draggable-cards");
}

function crearFichaHTML(idUnico, seccion, tipoPorDefecto) {
  const opciones = seccion === "planteamiento" ? TIPOS_PLANTEAMIENTO : TIPOS_JUSTIFICACION;

  let selectOptions = opciones.map(tipo => 
    `<option value="${tipo}" ${tipo === tipoPorDefecto ? 'selected' : ''}>${tipo}</option>`
  ).join('');

  return `
    <div class="card-item-dinamico" id="${idUnico}">
      <div class="card-header-actions" style="display:flex; justify-content:space-between; align-items:center;">
        <span class="drag-handle" role="img" aria-label="Mover ficha" title="Presione aquí para mover la ficha"></span>
        <select class="select-card-type">
          ${selectOptions}
        </select>
        <button type="button" class="btn-remove-card" onclick="eliminarFicha('${idUnico}')" title="Eliminar ficha" style="background:#ef4444; color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer;">×</button>
      </div>

      <!-- Información Recolectada -->
      <textarea class="input-red" rows="3" placeholder="Ingrese información recolectada..."></textarea>

      <!-- Cita APA -->
      <div class="sub-caption" style="font-size: 11px; font-weight: bold; text-align: left;">Referente Bibliográfico (APA)</div>
      <textarea class="input-red input-apa-origen" rows="2" placeholder="Cita APA (Autor, Año, Título...)" oninput="validarFormatoAPA(this); actualizarListaReferencias();"></textarea>
    </div>
  `;
}

function crearConectorHTML(idConector) {
  return `
    <div class="connector-block" id="${idConector}">
      <span class="connector-arrow">&rarr;</span>
      <textarea class="input-red connector-textarea" rows="3" placeholder="Idea propia conectora..."></textarea>
    </div>
  `;
}

function agregarFicha(contenedorId, seccion, tipoPorDefecto = null) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contadorFichas++;
  const idFicha = `ficha_${contadorFichas}`;
  const idConector = `conector_${contadorFichas}`;

  if (contenedor.children.length > 0) {
    contenedor.insertAdjacentHTML('beforeend', crearConectorHTML(idConector));
  }

  const tipo = tipoPorDefecto || (seccion === "planteamiento" ? TIPOS_PLANTEAMIENTO[0] : TIPOS_JUSTIFICACION[0]);
  contenedor.insertAdjacentHTML('beforeend', crearFichaHTML(idFicha, seccion, tipo));
  activarArrastreFicha(contenedor.lastElementChild, contenedor);
  window.prepararClavesCampos?.();

  notificarCambioFichas();
  actualizarListaReferencias();
}

function eliminarFicha(idFicha) {
  const elementoFicha = document.getElementById(idFicha);
  if (!elementoFicha) return;

  const modal = document.createElement("div");
  modal.className = "ora-modal-backdrop";
  modal.innerHTML = `
    <div class="ora-modal" role="dialog" aria-modal="true" aria-labelledby="remove-card-title">
      <h3 id="remove-card-title">Quitar ficha</h3>
      <p>¿Está seguro de que desea quitar esta ficha? Esta acción se reflejará al guardar el proyecto.</p>
      <div class="ora-modal-actions">
        <button type="button" class="ora-modal-cancel">Cancelar</button>
        <button type="button" class="ora-modal-confirm">Quitar ficha</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const cerrar = () => modal.remove();
  modal.querySelector(".ora-modal-cancel").addEventListener("click", cerrar);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) cerrar();
  });
  modal.querySelector(".ora-modal-confirm").addEventListener("click", () => {
    const conectorPrevio = elementoFicha.previousElementSibling;
    if (conectorPrevio && conectorPrevio.classList.contains("connector-block")) {
      conectorPrevio.remove();
    }

    elementoFicha.remove();
    cerrar();
    notificarCambioFichas();
    actualizarListaReferencias();
  });
}

function notificarCambioFichas() {
  if (fichasInicializadas) window.registrarCambioProyecto?.();
}

function obtenerEstadoFichasDinamicas() {
  return ["planteamiento", "justificacion"].reduce((estado, seccion) => {
    const contenedor = document.getElementById(`contenedor-${seccion}`);
    if (!contenedor) return estado;

    estado[seccion] = Array.from(contenedor.children).map((elemento, index) => {
      if (elemento.classList.contains("connector-block")) {
        return {
          tipo: "conector",
          storageId: elemento.dataset.sioraStorageId || `${seccion}_conector_${index}`,
          valor: elemento.querySelector("textarea")?.value || ""
        };
      }
      if (!elemento.classList.contains("card-item-dinamico")) return null;
      const campos = elemento.querySelectorAll("textarea");
      return {
        tipo: "ficha",
        storageId: elemento.dataset.sioraStorageId || `${seccion}_ficha_${index}`,
        categoria: elemento.querySelector(".select-card-type")?.value || "",
        informacion: campos[0]?.value || "",
        referencia: campos[1]?.value || "",
        autorInformacion: campos[0]?.dataset.author || "",
        autorReferencia: campos[1]?.dataset.author || "",
        posicionX: Number(elemento.dataset.positionX) || 0,
        posicionY: Number(elemento.dataset.positionY) || 0
      };
    }).filter(Boolean);
    return estado;
  }, {});
}

function restaurarFichasDinamicas(estado) {
  if (!estado) return;

  ["planteamiento", "justificacion"].forEach((seccion) => {
    const elementos = estado[seccion];
    const contenedor = document.getElementById(`contenedor-${seccion}`);
    if (!Array.isArray(elementos) || !contenedor) return;

    contenedor.innerHTML = "";
    elementos.forEach((elemento, index) => {
      if (elemento.tipo === "conector") {
        contenedor.insertAdjacentHTML("beforeend", crearConectorHTML(`restaurado_${contadorFichas++}`));
        const conector = contenedor.lastElementChild;
        conector.dataset.sioraStorageId = elemento.storageId || `${seccion}_conector_${index}`;
        conector.querySelector("textarea").value = elemento.valor || "";
        return;
      }

      contadorFichas++;
      contenedor.insertAdjacentHTML("beforeend", crearFichaHTML(`ficha_${contadorFichas}`, seccion, elemento.categoria));
      const ficha = contenedor.lastElementChild;
      ficha.dataset.sioraStorageId = elemento.storageId || `${seccion}_ficha_${index}`;
      const campos = ficha.querySelectorAll("textarea");
      campos[0].value = elemento.informacion || "";
      campos[1].value = elemento.referencia || "";
      activarArrastreFicha(ficha, contenedor, {
        x: elemento.posicionX,
        y: elemento.posicionY
      });
      if (elemento.autorInformacion) campos[0].dataset.author = elemento.autorInformacion;
      if (elemento.autorReferencia) campos[1].dataset.author = elemento.autorReferencia;
    });
  });

  window.prepararClavesCampos?.();
  actualizarListaReferencias();
  window.setTimeout(() => window.aplicarCamposPendientes?.(), 0);
}

function reiniciarFichasDinamicas() {
  contadorFichas = 0;
  ["planteamiento", "justificacion"].forEach((seccion) => {
    const contenedor = document.getElementById(`contenedor-${seccion}`);
    if (!contenedor) return;
    contenedor.innerHTML = "";
    const tipos = seccion === "planteamiento" ? TIPOS_PLANTEAMIENTO : TIPOS_JUSTIFICACION;
    tipos.forEach((tipo) => agregarFicha(`contenedor-${seccion}`, seccion, tipo));
  });
  actualizarListaReferencias();
}

window.obtenerEstadoFichasDinamicas = obtenerEstadoFichasDinamicas;
window.restaurarFichasDinamicas = restaurarFichasDinamicas;
window.reiniciarFichasDinamicas = reiniciarFichasDinamicas;

// --- 8. INICIALIZACIÓN GLOBAL (DOM LOAD) ---
document.addEventListener("DOMContentLoaded", function () {

  // Asignar listeners de evento para concatenar el Título automáticamente
  const varObjeto = document.querySelector(".var-objeto-origen");
  const varProposito = document.querySelector("#select_asignaturas_npi");
  const varAudiencia = document.querySelector(".var-audiencia-origen");
  const tituloOrigen = document.getElementById("titulo_origen");
  const inputPoblacion = document.getElementById("muestreo_poblacion");
  const inputConfianza = document.getElementById("muestreo_confianza");
  const inputMargenError = document.getElementById("muestreo_error");
  const inputMuestra = document.getElementById("muestreo_muestra");

  if (tituloOrigen) {
    tituloOrigen.addEventListener("input", function () {
      this.dataset.manualOverride = this.value.trim() === "" ? "false" : "true";
      actualizarTitulo();
    });
    actualizarTitulo();
  }

  if (varObjeto) {
    varObjeto.addEventListener("input", function () {
      limitarPalabras(this, 6);
    });
  }
  if (varAudiencia) {
    varAudiencia.addEventListener("input", function () {
      limitarPalabras(this, 6);
      evaluarTitulo(tituloOrigen?.value || "");
    });
  }

  if (varObjeto) {
    varObjeto.addEventListener("input", function () {
      evaluarTitulo(tituloOrigen?.value || "");
    });
  }

  [varProposito, document.getElementById("variable_proposito_alternativa")].forEach((campo) => {
    campo?.addEventListener("input", () => evaluarTitulo(tituloOrigen?.value || ""));
    campo?.addEventListener("change", () => evaluarTitulo(tituloOrigen?.value || ""));
  });

  if (inputPoblacion && inputConfianza && inputMargenError && inputMuestra) {
    const recalcularMuestra = () => {
      const poblacion = Number(inputPoblacion.value);
      const confianza = Number(inputConfianza.value);
      const margenError = Number(inputMargenError.value);

      const muestra = calcularMuestraPoblacionFinita(poblacion, confianza, margenError);
      inputMuestra.value = muestra ? String(muestra) : "";
    };

    [inputPoblacion, inputConfianza, inputMargenError].forEach((input) => {
      input.addEventListener("input", recalcularMuestra);
      input.addEventListener("change", recalcularMuestra);
    });

    recalcularMuestra();
  }

  const verboObjetivo = document.querySelector(".objetivo-verbo-origen");
  const objetivoGeneral = document.querySelector(".objetivo-general-origen");
  verboObjetivo?.addEventListener("input", evaluarObjetivoGeneral);
  objetivoGeneral?.addEventListener("input", evaluarObjetivoGeneral);
  document.getElementById("var_objeto_origen")?.addEventListener("input", evaluarObjetivoGeneral);
  document.getElementById("var_audiencia_origen")?.addEventListener("input", evaluarObjetivoGeneral);
  document.getElementById("select_asignaturas_npi")?.addEventListener("change", evaluarObjetivoGeneral);
  document.getElementById("variable_proposito_alternativa")?.addEventListener("input", evaluarObjetivoGeneral);
  evaluarObjetivoGeneral();

  inicializarReplicasPronostico();

  // Vínculos de réplicas y validaciones de los 3 Referentes APA principales (Marca Rojo)
  vincularReplica(".ref-objeto-origen", ".ref-objeto-target", null, true);
  vincularReplica(".ref-proposito-origen", ".ref-proposito-target", null, true);
  vincularReplica(".ref-audiencia-origen", ".ref-audiencia-target", null, true);

  // Evaluar y escuchar todos los campos APA para mantener validación y listado sincronizados.
  const camposAPA = obtenerCamposAPA();
  camposAPA.forEach((ref) => {
    ref.addEventListener("input", function () {
      validarFormatoAPA(this);
      actualizarListaReferencias();
    });

    validarFormatoAPA(ref);
  });

  // Réplicas de Definiciones
  vincularReplica(".var-objeto-origen", ".var-objeto-target", 6);
  vincularReplica(".var-audiencia-origen", ".var-audiencia-target", 6);

  const variableObjetoOrigen = document.querySelector(".var-objeto-origen");
  const variableAudienciaOrigen = document.querySelector(".var-audiencia-origen");
  const variableObjetoTargets = document.querySelectorAll(".var-objeto-target");
  const variableAudienciaTargets = document.querySelectorAll(".var-audiencia-target");

  // Sincroniza estado inicial (ej. autoguardado cargado al abrir la página).
  if (variableObjetoOrigen && variableObjetoTargets.length > 0) {
    limitarPalabras(variableObjetoOrigen, 6);
    variableObjetoTargets.forEach((target) => {
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        target.value = variableObjetoOrigen.value;
      } else {
        target.textContent = variableObjetoOrigen.value;
      }
    });
  }

  if (variableAudienciaOrigen && variableAudienciaTargets.length > 0) {
    limitarPalabras(variableAudienciaOrigen, 6);
    variableAudienciaTargets.forEach((target) => {
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        target.value = variableAudienciaOrigen.value;
      } else {
        target.textContent = variableAudienciaOrigen.value;
      }
    });
  }

  vincularReplica(".def-objeto-origen", ".def-objeto-target");
  vincularReplica(".def-proposito-origen", ".def-proposito-target");
  vincularReplica(".def-audiencia-origen", ".def-audiencia-target");

  vincularReplica(".pregunta-conector-origen", ".pregunta-conector-target");
  vincularReplica(".pregunta-problema-origen", ".pregunta-problema-target");
  vincularReplica(".supuesto-origen", ".supuesto-target");
  vincularReplica(".objetivo-general-origen", ".objetivo-general-target");

  const preguntaOrigen = document.querySelector(".pregunta-problema-origen");
  const preguntaTargets = document.querySelectorAll(".pregunta-problema-target");
  if (preguntaOrigen && preguntaTargets.length > 0) {
    preguntaTargets.forEach((target) => {
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        target.value = preguntaOrigen.value;
      } else {
        target.textContent = preguntaOrigen.value;
      }
    });
  }

  const supuestoOrigen = document.querySelector(".supuesto-origen");
  const supuestoTargets = document.querySelectorAll(".supuesto-target");
  if (supuestoOrigen && supuestoTargets.length > 0) {
    supuestoTargets.forEach((target) => {
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        target.value = supuestoOrigen.value;
      } else {
        target.textContent = supuestoOrigen.value;
      }
    });
  }

  const objetivoGeneralOrigen = document.querySelector(".objetivo-general-origen");
  const objetivoGeneralTargets = document.querySelectorAll(".objetivo-general-target");
  if (objetivoGeneralOrigen && objetivoGeneralTargets.length > 0) {
    objetivoGeneralTargets.forEach((target) => {
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        target.value = objetivoGeneralOrigen.value;
      } else {
        target.textContent = objetivoGeneralOrigen.value;
      }
    });
  }

  // Indicadores
  [ 'a', 'b', 'c', 'd', 'e', 'f' ].forEach(l => {
    vincularReplica(`.ind-obj-${l}-origen`, `.ind-obj-${l}-target`);
    vincularReplica(`.ind-pro-${l}-origen`, `.ind-pro-${l}-target`);
    vincularReplica(`.ind-aud-${l}-origen`, `.ind-aud-${l}-target`);
  });

  document.querySelectorAll(".grid-op-matrix .q-item-row input").forEach((pregunta) => {
    pregunta.addEventListener("input", validarPreguntasPorIndicador);
    pregunta.addEventListener("change", validarPreguntasPorIndicador);
  });
  document.querySelectorAll("[class*='-origen']").forEach((campo) => {
    const esIndicador = Array.from(campo.classList)
      .some((clase) => /^ind-(obj|pro|aud)-[a-f]-origen$/.test(clase));
    if (esIndicador) {
      campo.addEventListener("input", validarPreguntasPorIndicador);
      campo.addEventListener("change", validarPreguntasPorIndicador);
    }
  });
  validarPreguntasPorIndicador();

  // Carga inicial de Fichas Dinámicas
  const contPlanteamiento = document.getElementById("contenedor-planteamiento");
  const contJustificacion = document.getElementById("contenedor-justificacion");

  if (contPlanteamiento && contPlanteamiento.children.length === 0) {
    TIPOS_PLANTEAMIENTO.forEach(tipo => agregarFicha("contenedor-planteamiento", "planteamiento", tipo));
  }

  if (contJustificacion && contJustificacion.children.length === 0) {
    TIPOS_JUSTIFICACION.forEach(tipo => agregarFicha("contenedor-justificacion", "justificacion", tipo));
  }

  const estadoDinamico = window.sioraDynamicSectionsPendientes
    || window.obtenerFichasDinamicasPersistidas?.();
  restaurarFichasDinamicas(estadoDinamico);
  if (window.sioraDynamicSectionsPendientes) {
    window.guardarEstadoProyecto?.();
  }
  window.sioraDynamicSectionsPendientes = null;
  fichasInicializadas = true;
  window.aplicarCamposPendientes?.();
  window.setTimeout(() => window.restaurarEstadoPersistido?.(), 100);
  actualizarListaReferencias();
  sincronizarReplicasIniciales();
});