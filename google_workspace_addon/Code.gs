const FIREBASE_URL = 'https://si-ora-cun-default-rtdb.firebaseio.com/'; // Reemplaza con tu URL de Firebase

function onHomepage(e) {
  return buildLiveDashboardCard();
}

/**
 * Muestra el panel principal con los proyectos y campo para registrar cambios detallados.
 */
function buildLiveDashboardCard() {
  const card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle('SI-ORA - Proyectos Colaborativos'));

  const section = CardService.newCardSection();
  section.addWidget(CardService.newTextParagraph()
    .setText('📋 **Proyectos en Firebase:**\nSelecciona un proyecto para ver su historial o registra un nuevo cambio.'));

  section.addWidget(CardService.newTextInput()
    .setFieldName('projectName')
    .setTitle('Nombre del Proyecto')
    .setHint('Ej. Proyecto ORA 2026'));

  // Campo para describir el detalle del cambio realizado (Historial detallado)
  section.addWidget(CardService.newTextInput()
    .setFieldName('changeDescription')
    .setTitle('¿Qué cambio o ajuste realizaste?')
    .setHint('Ej. Se ajustó la formulación de la pregunta problema.'));

  section.addWidget(CardService.newTextButton()
    .setText('Validar y Guardar Cambios')
    .setOnClickAction(CardService.newAction().setFunctionName('saveProject')));

  // Consultar proyectos en Firebase en tiempo real
  const url = `${FIREBASE_URL}/projects.json`;
  const options = { 
    method: 'get', 
    muteHttpExceptions: true,
    headers: { 'Cache-Control': 'no-cache, no-store' }
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (data && typeof data === 'object') {
      let found = false;
      for (const key in data) {
        const project = data[key];
        if (project && project.projectName) {
          found = true;
          const lastMod = project.lastUpdated ? new Date(project.lastUpdated).toLocaleString() : 'Reciente';
          const author = project.savedBy || 'Equipo';
          const lastChange = project.changeDescription || 'Sin descripción registrada';
          
          section.addWidget(CardService.newKeyValue()
            .setTopLabel(project.projectName)
            .setContent(`Última mod: ${lastMod}\nPor: ${author}\n📝 Cambio: "${lastChange}"`)
            .setButton(CardService.newTextButton()
              .setText('Ver Historial')
              .setOnClickAction(CardService.newAction().setFunctionName('openProject')
                .setParameters({ projectKey: key }))));
        }
      }
      if (!found) {
        section.addWidget(CardService.newTextParagraph().setText('No hay proyectos registrados aún.'));
      }
    } else {
      section.addWidget(CardService.newTextParagraph().setText('No hay registros activos en Firebase.'));
    }
  } catch (error) {
    section.addWidget(CardService.newTextParagraph().setText(`⚠️ Error al conectar con Firebase: ${error.message}`));
  }

  section.addWidget(CardService.newTextButton()
    .setText('🔄 Forzar Recarga Completa')
    .setOnClickAction(CardService.newAction().setFunctionName('onHomepage')));

  card.addSection(section);
  return card.build();
}

/**
 * Valida si hubo cambios previos en Firebase antes de guardar el nuevo estado.
 * Si detecta conflicto, muestra una tarjeta de confirmación (Popup).
 */
function saveProject(e) {
  const formInputs = e && e.commonEventObject && e.commonEventObject.formInputs;
  const projectName = getFieldValue(formInputs, 'projectName') || 'Proyecto ORA';
  const changeDescription = getFieldValue(formInputs, 'changeDescription') || 'Actualización general del proyecto';
  const userEmail = Session.getActiveUser().getEmail();

  const safeKey = projectName.replace(/[^a-zA-Z0-9]/g, '_');
  const url = `${FIREBASE_URL}/projects/${safeKey}.json`;

  try {
    // 1. Consultar estado actual en Firebase para detectar cambios de compañeros
    const getOptions = { method: 'get', muteHttpExceptions: true };
    const getResponse = UrlFetchApp.fetch(url, getOptions);
    const remoteData = JSON.parse(getResponse.getContentText());

    // Si ya existe el proyecto, validamos si alguien más lo modificó recientemente
    // (Por ejemplo, comparando si el autor anterior es distinto o si hay registros previos)
    if (remoteData && remoteData.savedBy && remoteData.savedBy !== userEmail) {
      // CONFLICTO DETECTADO: Mostramos la tarjeta de confirmación (Popup)
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(buildConflictPopupCard(
          safeKey,
          projectName,
          changeDescription,
          remoteData.savedBy,
          remoteData.lastUpdated,
          remoteData.changeDescription
        )))
        .build();
    }

    // 2. Si no hay conflictos de otros usuarios, procedemos a guardar normalmente
    return executeSaveToFirebase(safeKey, projectName, changeDescription, userEmail);

  } catch (error) {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(buildResultCard(
          `Error en la validación: ${error.message}`
        )))
        .build();
  }
}

/**
 * Ejecuta la escritura final en Firebase con el detalle del cambio.
 */
function executeSaveToFirebase(safeKey, projectName, changeDescription, userEmail) {
  const url = `${FIREBASE_URL}/projects/${safeKey}.json`;
  const newTimestamp = new Date().toISOString();

  const payload = {
    projectName: projectName,
    savedBy: userEmail,
    lastUpdated: newTimestamp,
    changeDescription: changeDescription,
    note: 'Proyecto sincronizado con historial detallado.'
  };

  const putOptions = {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const putResponse = UrlFetchApp.fetch(url, putOptions);

  if (putResponse.getResponseCode() === 200) {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(buildResultCard(
          `¡Cambios guardados con éxito!\n📝 Detalle: "${changeDescription}"`
        )))
        .build();
  } else {
    throw new Error(`No se pudo guardar en Firebase: ${putResponse.getContentText()}`);
  }
}

/**
 * Acción ejecutada si el usuario decide FORZAR sus cambios a pesar del aviso de otro compañero.
 */
function forceSaveProject(e) {
  const params = e && e.parameters;
  const safeKey = params.safeKey;
  const projectName = params.projectName;
  const changeDescription = params.changeDescription;
  const userEmail = Session.getActiveUser().getEmail();

  try {
    return executeSaveToFirebase(safeKey, projectName, changeDescription, userEmail);
  } catch (error) {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(buildResultCard(
          `Error al forzar guardado: ${error.message}`
        )))
        .build();
  }
}

/**
 * Muestra el cuadro de diálogo (Popup) de conflicto con el detalle de lo que hizo el compañero.
 */
function buildConflictPopupCard(safeKey, projectName, myChangeDesc, remoteUser, remoteTime, remoteChangeDesc) {
  const card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle('⚠️ Conflicto: Cambios Detectados'));

  const section = CardService.newCardSection();
  section.addWidget(CardService.newTextParagraph()
    .setText(`**${remoteUser}** realizó modificaciones recientes en este proyecto el **${new Date(remoteTime).toLocaleString()}**.`));
  
  section.addWidget(CardService.newTextParagraph()
    .setText(`**Cambio registrado por tu compañero:**\n> *"${remoteChangeDesc || 'Sin descripción'}"*`));

  section.addWidget(CardService.newTextParagraph()
    .setText('¿Qué deseas hacer con tus modificaciones actuales?'));

  // Opción 1: Mantener lo del compañero (Cargar su versión)
  section.addWidget(CardService.newTextButton()
    .setText('Mantener versión del compañero (Cancelar mis cambios)')
    .setOnClickAction(CardService.newAction().setFunctionName('openProject')
      .setParameters({ projectKey: safeKey })));

  // Opción 2: Sobrescribir con mis cambios (Forzar guardado)
  section.addWidget(CardService.newTextButton()
    .setText('Sobrescribir y Guardar mis cambios de todos modos')
    .setOnClickAction(CardService.newAction().setFunctionName('forceSaveProject')
      .setParameters({ 
        safeKey: safeKey, 
        projectName: projectName, 
        changeDescription: myChangeDesc 
      })));

  section.addWidget(CardService.newTextButton()
    .setText('Volver al inicio')
    .setOnClickAction(CardService.newAction().setFunctionName('onHomepage')));

  card.addSection(section);
  return card.build();
}

/**
 * Abre el proyecto mostrando el historial detallado de los cambios realizados.
 */
function openProject(e) {
  const projectKey = e && e.parameters && e.parameters.projectKey;
  if (!projectKey) {
    return buildResultCard('No se encontró el proyecto seleccionado.');
  }

  const url = `${FIREBASE_URL}/projects/${projectKey}.json`;
  const options = { method: 'get', muteHttpExceptions: true };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const project = JSON.parse(response.getContentText());

    if (project) {
      const jsonContent = JSON.stringify(project, null, 2);
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(buildProjectCard(project, jsonContent)))
        .build();
    } else {
      return buildResultCard('El proyecto ya no existe en la base de datos.');
    }
  } catch (error) {
    return buildResultCard(`Error al abrir el proyecto: ${error.message}`);
  }
}

function buildProjectCard(project, jsonContent) {
  const card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle(project.projectName));

  const section = CardService.newCardSection();
  const lastMod = project.lastUpdated ? new Date(project.lastUpdated).toLocaleString() : 'N/A';
  
  section.addWidget(CardService.newTextParagraph()
    .setText(`**Último autor:** ${project.savedBy || 'Anónimo'}\n**Fecha del cambio:** ${lastMod}\n**Detalle del cambio:** \n> *"${project.changeDescription || 'Sin descripción'}"*`));
  
  section.addWidget(CardService.newTextParagraph().setText('**Estructura completa en JSON:**'));
  section.addWidget(CardService.newTextParagraph().setText('```json\n' + jsonContent + '\n```'));

  section.addWidget(CardService.newTextButton()
    .setText('Volver al Listado')
    .setOnClickAction(CardService.newAction().setFunctionName('onHomepage')));

  card.addSection(section);
  return card.build();
}

function buildResultCard(message) {
  const card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle('SI-ORA')); 
  const section = CardService.newCardSection();
  section.addWidget(CardService.newTextParagraph().setText(message));
  section.addWidget(CardService.newTextButton()
    .setText('Volver al inicio')
    .setOnClickAction(CardService.newAction().setFunctionName('onHomepage')));
  card.addSection(section);
  return card.build();
}

function getFieldValue(formInputs, fieldName) {
  if (!formInputs || !formInputs[fieldName]) return null;
  const input = formInputs[fieldName];
  if (input.textInputs && input.textInputs.value && input.textInputs.value.length > 0) {
    return input.textInputs.value[0];
  }
  if (input.stringInputs && input.stringInputs.value && input.stringInputs.value.length > 0) {
    return input.stringInputs.value[0];
  }
  return null;
}