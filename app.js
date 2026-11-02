// app.js - Extensiones de experiencia de uso para SI-ORA
console.log("SI-ORA app.js cargado correctamente");

window.guardarProyecto = async function(event) {
  event?.preventDefault();
  console.log("--> Ejecutando guardado de proyecto...");
  const button = document.getElementById('btn-save-project');
  const originalButtonContent = button?.innerHTML;
  const firebaseUser = window.firebase?.apps?.length
    ? window.firebase.auth().currentUser
    : null;
  if (!firebaseUser?.email || !/^[^\s@]+@cun\.edu\.co$/i.test(firebaseUser.email)) {
    window.sioraSetSaveStatus?.('unsaved');
    window.alert('Debes iniciar sesión con tu cuenta institucional @cun.edu.co para guardar en línea.');
    return false;
  }

  if (button) button.disabled = true;
  window.sioraSetSaveStatus?.('saving');

  try {
    if (typeof window.guardarProyectoUnificado !== 'function') {
      throw new Error('La función de guardado del proyecto todavía no está disponible');
    }
    if (button) {
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Guardando...</span>';
    }
    const result = await window.guardarProyectoUnificado();
    if (!result) window.sioraSetSaveStatus?.('unsaved');
    return result;
  } catch (error) {
    console.error('Error al guardar el proyecto:', error);
    window.sioraSetSaveStatus?.('unsaved');
    window.alert(`No se pudo guardar el proyecto: ${error.message || 'Error desconocido'}`);
    return false;
  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML = originalButtonContent || '<i class="fa-solid fa-floppy-disk"></i><span>Guardar Cambios</span>';
    }
  }
};

window.guardarProyectoSIORA = async function(event) {
  event?.preventDefault();
  console.log("--> [SI-ORA] Iniciando proceso de guardado...");

  const fileNameInput = document.getElementById('file-name-input');
  if (!String(fileNameInput?.value || '').trim()) {
    if (typeof window.abrirModalConfiguracion === 'function') {
      window.abrirModalConfiguracion(true);
      document.getElementById('config-project-name')?.focus();
    } else {
      window.alert("Por favor, ingrese un nombre para el archivo antes de guardar.");
    }
    return false;
  }

  try {
    if (typeof window.guardarProyecto !== 'function') {
      throw new Error('La función de guardado de SI-ORA no está disponible');
    }
    return await window.guardarProyecto(event);
  } catch (error) {
    console.error("--> [SI-ORA] Error al guardar el proyecto:", error);
    window.alert('Ocurrió un error al guardar el proyecto. Verifique la consola para más detalles.');
    return false;
  }
};

window.iniciarSesionGoogle = async function() {
  console.log("--> Clic en Iniciar Sesión detectado correctamente");
  if (!window.firebase || !window.firebase.apps || !window.firebase.apps.length) {
    console.error('Firebase no está inicializado para autenticación');
    window.alert('No se pudo conectar con el inicio de sesión. Recarga la página e inténtalo de nuevo.');
    return;
  }

  const auth = window.firebase.auth();
  if (auth.currentUser) {
    const button = document.getElementById('btnAuth');
    const menu = document.getElementById('user-profile-menu');
    if (button && menu) {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
    }
    return;
  }

  const provider = new window.firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account', hd: 'cun.edu.co' });
  try {
    await auth.signInWithPopup(provider);
  } catch (error) {
    console.warn('Popup bloqueado, utilizando redirección...', error);
    try {
      await auth.signInWithRedirect(provider);
    } catch (redirectError) {
      console.error('Error al iniciar sesión con Google:', redirectError);
      window.alert(`Error al iniciar sesión: ${redirectError.message}`);
    }
  }
};

window.cerrarSesionGoogle = async function() {
  if (!window.firebase?.apps?.length) {
    window.alert('Firebase no está disponible para cerrar sesión.');
    return;
  }
  try {
    await window.firebase.auth().signOut();
    window.location.reload();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    window.alert(`Error al cerrar sesión: ${error.message}`);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const NOMENCLATURA_SIORA = {
  // Integrantes
  "IDN_INT_1_Nombre": "Gerente - Nombres",
  "IDN_INT_1_Apellido": "Gerente - Apellidos",
  "IDN_INT_1_Programa": "Gerente - Programa",
  "IDN_INT_1_Asignatura": "Gerente - Código Asignatura",
  "IDN_INT_1_Correo": "Gerente - Correo Institucional",
  "IDN_INT_1_Participacion": "Gerente - % Participación",
  "IDN_INT_2_Nombre": "Integrante 2 - Nombres",
  "IDN_INT_2_Apellido": "Integrante 2 - Apellidos",
  "IDN_INT_2_Correo": "Integrante 2 - Correo",

  // Variables y Título
  "VAR_OBJ": "Variable Objeto de Estudio",
  "VAR_PRO_NIP": "Variable Propósito Disciplinar (NPI)",
  "VAR_AUD": "Variable Audiencia",
  "IDN_PROY_Titulo": "Título del Proyecto",
  "VAR_DEF_OBJ": "Definición Objeto de Estudio",
  "VAR_DEF_PRO": "Definición Propósito Disciplinar",
  "VAR_DEF_AUD": "Definición Audiencia",
  "VAR_REF_OBJ": "Referencia APA - Objeto",
  "VAR_REF_PRO": "Referencia APA - Propósito",
  "VAR_REF_AUD": "Referencia APA - Audiencia",

  // Pregunta, Supuesto y Objetivos
  "PREG_COMPLEMENTO": "Pregunta Problema",
  "SUP_EXITO_TEXTO": "Supuesto de Éxito",
  "OBJ_GEN_VERBO": "Objetivo General - Verbo",
  "OBJ_GEN_TEXTO": "Objetivo General - Redacción",

  // Indicadores Objeto
  "VAR_OBJ_IND_a": "Indicador Objeto (a)",
  "VAR_OBJ_IND_b": "Indicador Objeto (b)",
  "VAR_OBJ_IND_c": "Indicador Objeto (c)",
  "VAR_OBJ_IND_d": "Indicador Objeto (d)",
  "VAR_OBJ_IND_e": "Indicador Objeto (e)",
  "VAR_OBJ_IND_f": "Indicador Objeto (f)",

  // Indicadores Propósito
  "VAR_PRO_IND_a": "Indicador Propósito (a)",
  "VAR_PRO_IND_b": "Indicador Propósito (b)",
  "VAR_PRO_IND_c": "Indicador Propósito (c)",

  // Indicadores Audiencia
  "VAR_AUD_IND_a": "Indicador Audiencia (a)",
  "VAR_AUD_IND_b": "Indicador Audiencia (b)",

  // Metodología y Muestreo
  "MET_ENF_TIPO": "Enfoque de la Investigación",
  "MUE_PARAM_POBLACION": "Muestreo - Población",
  "MUE_PARAM_CONFIANZA": "Muestreo - Nivel de Confianza",
  "MUE_PARAM_MARGEN": "Muestreo - Margen de Error",
  "MUE_RES_TOTAL": "Muestreo - Muestra Resultante",
  "MUE_TEC_REC": "Técnica de Recolección",
  "MUE_LINK_INS": "Link del Instrumento"
};
  const STORAGE_KEY = "siora_form_v1";
  const PROJECT_ID_STORAGE_KEY = "siora_active_project_v1";
  const UNPERSISTED_PROJECT_ID_KEY = "siora_unpersisted_project_v1";
  const createProjectId = () => `project_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  let currentProjectId = '';
  let isUnpersistedProject = false;
  window.sioraDatosCargados = false;
  window.currentProjectId = currentProjectId;

  const saveBtn = document.getElementById('btn-save-project');
  const exportProjectButton = document.getElementById('btn-save-as');
  if (exportProjectButton) exportProjectButton.style.display = 'none';
  if (saveBtn) {
    saveBtn.type = 'button';
    saveBtn.onclick = (event) => window.guardarProyectoSIORA(event);
  }

  function syncProjectIdUrl(projectId = currentProjectId) {
    if (!projectId) return;
    const targetUrl = new URL(window.location.href);
    targetUrl.searchParams.set('project', String(projectId).trim());
    targetUrl.searchParams.delete('projectId');
    targetUrl.searchParams.delete('id');
    const nextPath = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
    if (window.location.pathname + window.location.search + window.location.hash !== nextPath) {
      window.history.replaceState({}, '', nextPath);
    }
  }

  function resolveCurrentProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlProjectId = (urlParams.get('project')
      || urlParams.get('projectId')
      || urlParams.get('id'))?.trim();
    const hasValidUrlProjectId = !!urlProjectId && urlProjectId !== 'default';
    const storedProjectId = (sessionStorage.getItem(PROJECT_ID_STORAGE_KEY)
      || localStorage.getItem(PROJECT_ID_STORAGE_KEY) || '').trim();
    let projectId = hasValidUrlProjectId
      ? urlProjectId
      : storedProjectId && storedProjectId !== 'default'
        ? storedProjectId
        : createProjectId();
    isUnpersistedProject = localStorage.getItem(UNPERSISTED_PROJECT_ID_KEY) === projectId
      || (!hasValidUrlProjectId && projectId !== storedProjectId);
    if (isUnpersistedProject) {
      localStorage.setItem(UNPERSISTED_PROJECT_ID_KEY, projectId);
    }

    currentProjectId = projectId.trim();
    window.currentProjectId = currentProjectId;
    sessionStorage.setItem(PROJECT_ID_STORAGE_KEY, currentProjectId);
    localStorage.setItem(PROJECT_ID_STORAGE_KEY, currentProjectId);
    return currentProjectId;
  }

  resolveCurrentProjectId();
  syncProjectIdUrl();
  const DATA = window.ASIGNATURAS_NPI || {};
  const TEAM_SIZE = 5;
  const CODIGOS_ESTUDIANTILES = new Set([
    "54571",
    "53322",
    "53328",
    "53330",
    "53332",
    "Opción de Grado"
  ]);
  const firebaseConfig = {
    apiKey: "AIzaSyDnJd1u3XjVADxe7-8RLVlI0EKF987M-u4",
    authDomain: "si-ora-cun.firebaseapp.com",
    databaseURL: "https://si-ora-cun-default-rtdb.firebaseio.com",
    projectId: "si-ora-cun",
    storageBucket: "si-ora-cun.firebasestorage.app",
    messagingSenderId: "146314528386",
    appId: "1:146314528386:web:1172b22a3ffcb216ca569b",
    measurementId: "G-W4JZBB9W69"
  };

  if (window.firebase && !window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }

  let firebaseApp = null;
  let firebaseDb = null;
  let firebaseAuth = null;
  let currentUser = null;
  let firebasePresenceRef = null;
  let firebasePresenceListRef = null;
  let firebaseDocumentRef = null;
  let firebaseDocumentProjectId = '';
  let firebaseConnectionRef = null;
  let firebaseMembersRef = null;
  let firebaseRequestsRef = null;
  let firebasePresenceAuthInitialized = false;
  let isApplyingRemoteDocument = false;
  let isProjectLeader = false;
  const APP_URL = "https://si-ora.web.app/";
  let projectFileHandle = null;
  let projectDirectoryHandle = null;
  let isSyncingPendingEvidences = false;
  let hasUnsavedChanges = false;
  let lastLocalUpdate = 0;
  let lastRealtimeSaveAt = 0;
  let isFirebaseConnected = null;
  let localRecoveryNotified = false;
  let isRealtimeSaveInProgress = false;
  let pendingRealtimeDynamicSync = false;
  let currentDocumentName = "";
  let pendingFormFields = null;
  let analysisLevelState = {};
  let previousAnalysisEssences = null;
  let rosterSyncTimer = null;
  let realtimeAutoSaveTimer = null;
  let teamMemberAccessSyncTimer = null;
  let pendingRealtimeFields = {};
  let pendingRemoteFieldValues = {};
  let lastRealtimeFields = null;
  let lastRealtimeDynamicSections = null;
  let lastRealtimeAnalysisLevels = null;
  let lastRealtimeProject = null;
  let projectAccessMode = null;
  let projectAccessObserver = null;
  let pendingRemoteDynamicSections = null;
  let membershipVerificationProjectId = '';

  function getAuthButton() {
    return document.getElementById('btnAuth');
  }

  function syncFileNameDisplay() {
    const input = document.getElementById('file-name-input');
    if (!input) return;

    const baseName = currentDocumentName || "";
    input.value = hasUnsavedChanges && baseName ? `* ${baseName}` : baseName;
    input.readOnly = true;
    input.title = baseName ? `Documento actual: ${baseName}` : 'Documento sin nombre';
  }

  function syncWindowTitle() {
    const projectName = currentDocumentName
      .replace(/\.siora\.html?$/i, '')
      .trim();
    document.title = projectName ? `SI-ORA "${projectName}"` : 'SI-ORA';
  }

  function setCurrentDocumentName(name) {
    currentDocumentName = (name || '').replace(/^\*\s*/, '').trim();
    syncFileNameDisplay();
    syncWindowTitle();
  }

  function markFileDirty() {
    hasUnsavedChanges = true;
    lastLocalUpdate = Date.now();
    setSaveStatus('unsaved');
    syncFileNameDisplay();
  }

  function markFileSaved(name) {
    currentDocumentName = (name || '').replace(/^\*\s*/, '').trim();
    hasUnsavedChanges = false;
    lastRealtimeSaveAt = Date.now();
    setSaveStatus('saved');
    syncFileNameDisplay();
    syncWindowTitle();
  }

  function resetDirtyState(name = '') {
    currentDocumentName = (name || '').replace(/^\*\s*/, '').trim();
    hasUnsavedChanges = false;
    lastLocalUpdate = 0;
    lastRealtimeSaveAt = 0;
    setSaveStatus('saved');
    syncFileNameDisplay();
    syncWindowTitle();
  }

  function setSaveStatus(status) {
    const indicator = document.getElementById('save-status-indicator');
    if (!indicator) return;
    indicator.style.display = 'inline-flex';
    indicator.style.alignItems = 'center';
    indicator.style.gap = '4px';
    indicator.style.fontSize = '11px';
    indicator.style.fontWeight = '600';
    indicator.style.whiteSpace = 'nowrap';
    const icon = indicator.querySelector('i');
    const label = indicator.querySelector('span');
    const states = {
      saved: {
        text: 'Guardado',
        icon: 'fa-solid fa-circle-check',
        color: '#16a34a'
      },
      saving: {
        text: 'Guardando...',
        icon: 'fa-solid fa-spinner fa-spin',
        color: '#2563eb'
      },
      unsaved: {
        text: 'Cambios no guardados',
        icon: 'fa-solid fa-asterisk',
        color: '#ca8a04'
      }
    };
    const state = states[status] || states.unsaved;
    if (icon) icon.className = state.icon;
    if (label) label.textContent = state.text;
    indicator.style.color = state.color;
    indicator.setAttribute('aria-label', state.text);
    indicator.title = state.text;
    indicator.dataset.saveState = status;
  }

  window.sioraSetSaveStatus = setSaveStatus;

  function getProjectStorageKey() {
    return `${STORAGE_KEY}_${currentProjectId}`;
  }

  function getStoredFormState() {
    try {
      const raw = localStorage.getItem(getProjectStorageKey()) || (
        currentProjectId === "default" ? localStorage.getItem(STORAGE_KEY) : null
      );
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.warn("No fue posible leer el estado guardado", error);
      return null;
    }
  }

  function hasProjectContent(fields = {}, dynamicSections = {}) {
    const hasFields = Object.values(fields || {}).some((value) =>
      typeof value === 'boolean'
        ? value
        : typeof value !== 'object' && String(value || '').trim() !== ''
    );
    const hasDynamicSections = Object.values(dynamicSections || {}).some((items) =>
      Array.isArray(items) && items.length > 0
    );
    return hasFields || hasDynamicSections;
  }

  function ensureFirebase() {
    if (!window.firebase) return null;
    if (!firebaseApp) {
      try {
        firebaseApp = window.firebase.apps.length
          ? window.firebase.app()
          : window.firebase.initializeApp(firebaseConfig);
      } catch (error) {
        console.warn('No fue posible inicializar Firebase:', error);
        return null;
      }
    }
    if (!firebaseDb) firebaseDb = firebaseApp.database();
    if (!firebaseAuth) firebaseAuth = firebaseApp.auth();
    return { firebaseApp, firebaseDb, firebaseAuth };
  }

  function getConnectedUsersText(users = {}) {
    return Object.values(users)
      .filter(Boolean)
      .map((user) => user.displayName || user.email || 'Usuario conectado')
      .slice(0, 5)
      .join(', ');
  }

  function updateConnectedUsers(users = {}) {
    const container = document.getElementById('usuarios-conectados-lista');
    if (!container) return;

    const list = Object.values(users).filter((user) => user && user.online === true);
    if (!list.length) {
      container.innerHTML = '<span class="connected-avatar-empty" title="Sin usuarios conectados"><i class="fa-solid fa-user"></i></span>';
      return;
    }

    const visibleUsers = list.slice(0, 6);
    const avatars = visibleUsers.map((user) => {
      const name = user.displayName || user.email || 'Usuario conectado';
      const escapedName = escapeHtml(name);
      const photoURL = /^https:\/\//i.test(String(user.photoURL || '')) ? escapeHtml(user.photoURL) : '';
      return `<span class="connected-avatar" title="${escapedName}">
        ${photoURL
          ? `<img src="${photoURL}" alt="" class="connected-avatar-image">`
          : ''}
        <span class="connected-avatar-initial" ${photoURL ? 'hidden' : ''}>${escapeHtml(name.charAt(0).toUpperCase())}</span>
      </span>`;
    }).join('');
    const overflowCount = list.length > visibleUsers.length
      ? `<span class="connected-avatar-count" title="${list.length} usuarios conectados">+${list.length - visibleUsers.length}</span>`
      : '';
    container.innerHTML = `${avatars}${overflowCount}`;
    container.querySelectorAll('.connected-avatar-image').forEach((image) => {
      image.addEventListener('error', () => {
        image.hidden = true;
        image.nextElementSibling.hidden = false;
      }, { once: true });
    });
  }

  function renderConnectedUsers(users = {}) {
    updateConnectedUsers(users);
  }

  function getProjectPresenceRef() {
    return firebaseDb ? firebaseDb.ref(`projects/${currentProjectId}/presences`) : null;
  }

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function getEmailDatabaseKey(email) {
    return encodeURIComponent(normalizeEmail(email)).replace(/\./g, '%2E');
  }

  function normalizeProjectMembers(members) {
    const memberMap = {};
    const entries = Array.isArray(members)
      ? members.map((member) => [null, member])
      : Object.entries(members || {});
    entries.forEach(([key, value]) => {
      let email = normalizeEmail(typeof value === 'string' ? value : value?.email);
      if (!email && key) {
        try {
          email = normalizeEmail(decodeURIComponent(key));
        } catch (error) {
          console.warn('No se pudo interpretar la clave de un miembro existente:', error);
        }
      }
      if (!email) return;
      const member = typeof value === 'object' && value !== null ? value : {};
      memberMap[getEmailDatabaseKey(email)] = {
        ...member,
        email,
        role: String(member.role || 'editor').toLowerCase()
      };
    });
    return memberMap;
  }

  async function updateProjectMember(email, updateMember) {
    const normalizedEmail = normalizeEmail(email);
    const projectOwnerEmail = getProjectOwnerEmail(lastRealtimeProject || {});
    const projectFacilitatorEmail = getProjectFacilitatorEmail(lastRealtimeProject || {});
    const isProtectedMember = normalizedEmail === projectOwnerEmail || normalizedEmail === projectFacilitatorEmail;
    const memberKey = getEmailDatabaseKey(normalizedEmail);
    const membersRef = firebaseDb.ref(`projects/${currentProjectId}/members`);
    let protectedMutation = false;
    const result = await membersRef.transaction((members) => {
      const memberMap = normalizeProjectMembers(members);
      const currentMember = memberMap[memberKey];
      if (!currentMember) return;
      let updatedMember = updateMember(currentMember);
      if (isProtectedMember && (!updatedMember
        || (updatedMember.role !== currentMember.role
          && String(updatedMember.role || '').toLowerCase() !== 'editor'))) {
        protectedMutation = true;
        return;
      }
      if (isProtectedMember) {
        updatedMember = {
          ...updatedMember,
          role: 'editor',
          protectedRole: normalizedEmail === projectOwnerEmail ? 'owner' : 'facilitator'
        };
      }
      if (updatedMember) memberMap[memberKey] = updatedMember;
      else delete memberMap[memberKey];
      return memberMap;
    });
    if (protectedMutation) throw new Error('El propietario y el facilitador no se pueden eliminar ni cambiar de rol');
    if (!result.committed) throw new Error('No se pudo actualizar el integrante en Firebase');
  }

  function isCurrentUserProjectOwner(projectData) {
    const email = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
    if (!email) return false;
    if (email === getProjectOwnerEmail(projectData)) return true;
    const member = Object.values(normalizeProjectMembers(projectData.members))
      .find((entry) => entry.email === email);
    return String(member?.role || '').toLowerCase() === 'propietario';
  }

  function getProjectOwnerEmail(projectData = {}) {
    const explicitOwner = normalizeEmail(projectData.ownerEmail || projectData.config?.authorEmail);
    if (explicitOwner) return explicitOwner;

    const teamMembers = Array.isArray(projectData.teamMembers) ? projectData.teamMembers : [];
    const rosterMembers = Object.values(projectData.rosterMemberEmails || {}).map((email) => ({ email }));
    const firstRosterEmail = [...teamMembers, ...rosterMembers]
      .map((member) => normalizeEmail(typeof member === 'string' ? member : member?.email))
      .find(isInstitutionalEmail);
    if (firstRosterEmail) return firstRosterEmail;

    return Array.from({ length: 5 }, (_, index) =>
      normalizeEmail(projectData.fields?.[`correo_integrante_${index + 1}`])
    ).find(isInstitutionalEmail) || '';
  }

  function getProjectFacilitatorEmail(projectData = {}) {
    return normalizeEmail(
      projectData.facilitatorEmail
      || projectData.config?.facilitatorEmail
      || projectData.fields?.correo_facilitador
    );
  }

  function canCurrentUserEditProject(projectData) {
    const email = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
    if (!email) return false;
    if (email === getProjectOwnerEmail(projectData)
      || email === getProjectFacilitatorEmail(projectData)) return true;
    const members = normalizeProjectMembers(projectData.members);
    const member = members[getEmailDatabaseKey(email)];
    return !!member && String(member.role || 'editor').toLowerCase() !== 'lector';
  }

  function applyProjectAccessMode(projectData) {
    if (!projectData && !isUnpersistedProject) return;
    projectData = projectData || {};
    if (!projectAccessObserver && document.body) {
      projectAccessObserver = new MutationObserver(() => {
        if (lastRealtimeProject) applyProjectAccessMode(lastRealtimeProject);
      });
      projectAccessObserver.observe(document.body, { childList: true, subtree: true });
    }
    const email = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
    const ownerEmail = getProjectOwnerEmail(projectData);
    const facilitatorEmail = getProjectFacilitatorEmail(projectData);
    const members = normalizeProjectMembers(projectData.members);
    const member = members[getEmailDatabaseKey(email)];
    console.log("Verificando permisos para:", currentUser?.email, "Propietario actual:", projectData?.ownerEmail);
    const hasAccess = isUnpersistedProject
      || (!!email && (email === ownerEmail || email === facilitatorEmail || !!member));
    const canEdit = isUnpersistedProject || (hasAccess && (email === ownerEmail
      || email === facilitatorEmail
      || String(member?.role || 'editor').toLowerCase() !== 'lector'));
    const mode = canEdit ? 'editor' : 'reader';
    window.readOnly = mode === 'reader';
    projectAccessMode = mode;
    renderProjectPermissions(projectData);

    let notice = document.getElementById('project-readonly-notice');
    if (mode === 'reader') {
      if (!notice) {
        notice = document.createElement('div');
        notice.id = 'project-readonly-notice';
        notice.setAttribute('role', 'status');
        const message = document.createElement('span');
        message.textContent = 'Modo Solo Lectura: Solicita acceso al líder del proyecto';
        const requestButton = document.createElement('button');
        requestButton.type = 'button';
        requestButton.textContent = 'Solicitar acceso';
        requestButton.addEventListener('click', requestProjectAccess);
        notice.append(message, requestButton);
        Object.assign(notice.style, {
          position: 'sticky',
          top: '0',
          zIndex: '10001',
          padding: '10px 16px',
          background: '#fff7ed',
          color: '#9a3412',
          borderBottom: '1px solid #fed7aa',
          textAlign: 'center',
          fontWeight: '600'
        });
        Object.assign(requestButton.style, {
          marginLeft: '12px',
          padding: '5px 10px',
          border: '1px solid currentColor',
          borderRadius: '5px',
          background: '#fff',
          color: 'inherit',
          cursor: 'pointer'
        });
        document.getElementById('app-header')?.insertAdjacentElement('afterend', notice)
          || document.body.prepend(notice);
      }
      notice.hidden = false;
    } else if (notice) {
      notice.hidden = true;
    }

    document.querySelectorAll('input, textarea, select, [contenteditable="true"], [data-project-access-disabled]').forEach((control) => {
      if (control.closest('#modal-compartir, #modalHistorial, #modalConfiguracion')) return;
      if (mode === 'reader') {
        if (control.readOnly && !control.hasAttribute('data-project-access-disabled')) return;
        if (!control.hasAttribute('data-project-access-disabled')) {
          control.dataset.projectAccessDisabled = control.disabled ? 'true' : 'false';
          control.dataset.projectAccessReadonly = control.readOnly ? 'true' : 'false';
        }
        if ('disabled' in control) control.disabled = true;
        if ('readOnly' in control) control.readOnly = true;
        if (control.isContentEditable) control.setAttribute('contenteditable', 'false');
      } else if (control.hasAttribute('data-project-access-disabled')) {
        control.disabled = control.dataset.projectAccessDisabled === 'true';
        if ('readOnly' in control) control.readOnly = control.dataset.projectAccessReadonly === 'true';
        if (control.hasAttribute('contenteditable')) control.setAttribute('contenteditable', 'true');
        delete control.dataset.projectAccessDisabled;
        delete control.dataset.projectAccessReadonly;
      }
    });
    const saveButton = document.getElementById('btn-save-project');
    if (saveButton) {
      if (mode === 'reader') {
        if (!saveButton.hasAttribute('data-project-access-disabled')) {
          saveButton.dataset.projectAccessDisabled = saveButton.disabled ? 'true' : 'false';
        }
        saveButton.disabled = true;
      } else if (saveButton.hasAttribute('data-project-access-disabled')) {
        saveButton.disabled = saveButton.dataset.projectAccessDisabled === 'true';
        delete saveButton.dataset.projectAccessDisabled;
      }
    }
  }

  function renderProjectPermissions(projectData) {
    const userEmail = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
    const ownerEmail = normalizeEmail(projectData?.ownerEmail);
    const exportButton = document.getElementById('btn-save-as');
    if (exportButton) exportButton.style.display = userEmail && userEmail === ownerEmail ? 'inline-flex' : 'none';
    if (exportButton) exportButton.disabled = !userEmail || userEmail !== ownerEmail;
  }

  function resetProjectAccessMode() {
    projectAccessMode = null;
    window.readOnly = false;
    renderProjectPermissions(null);
    document.getElementById('project-readonly-notice')?.remove();
    document.querySelectorAll('[data-project-access-disabled]').forEach((control) => {
      control.disabled = control.dataset.projectAccessDisabled === 'true';
      if ('readOnly' in control) control.readOnly = control.dataset.projectAccessReadonly === 'true';
      if (control.hasAttribute('contenteditable')) control.setAttribute('contenteditable', 'true');
      delete control.dataset.projectAccessDisabled;
      delete control.dataset.projectAccessReadonly;
    });
  }

  function isAuthenticatedProjectOwner(projectData = lastRealtimeProject) {
    const email = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
    const ownerEmail = normalizeEmail(projectData?.ownerEmail);
    return !!email && email === ownerEmail;
  }

  async function syncAuthenticatedMemberPhoto(user) {
    const email = normalizeEmail(user?.email);
    const photoURL = String(user?.photoURL || '').trim();
    if (!email || !photoURL || !firebaseDb) return;
    try {
      const projectRef = firebaseDb.ref(`projects/${currentProjectId}`);
      const snapshot = await projectRef.once('value');
      const project = snapshot.val() || {};
      const member = Object.values(normalizeProjectMembers(project.members))
        .find((entry) => entry.email === email);
      const isOwner = normalizeEmail(project.ownerEmail || project.config?.authorEmail) === email;
      if (!isOwner && !member) return;
      if (isOwner && !member) {
        await ensureProtectedProjectMembers(email, getProjectFacilitatorEmail(project));
        return;
      }
      if (member.photoURL === photoURL) return;
      await updateProjectMember(email, (currentMember) => ({
        ...currentMember,
        email,
        photoURL
      }));
    } catch (error) {
      console.error('No se pudo guardar la foto del integrante:', error);
    }
  }

  function isLeaderForProject(projectData, email) {
    const normalizedEmail = normalizeEmail(email);
    const member = Object.values(projectData.members || {}).find((entry) =>
      normalizeEmail(typeof entry === 'string' ? entry : entry?.email) === normalizedEmail
    );
    return normalizeEmail(projectData.ownerEmail || projectData.leaderEmail || projectData.createdByEmail) === normalizedEmail
      || normalizeEmail(projectData.owner) === normalizedEmail
      || (Array.isArray(projectData.admins)
        && projectData.admins.some((admin) => normalizeEmail(typeof admin === 'string' ? admin : admin?.email) === normalizedEmail))
      || member?.isLeader === true
      || String(member?.role || '').toLowerCase() === 'líder'
      || String(member?.role || '').toLowerCase() === 'lider';
  }

  function configureRealtimeRequests() {
    const notifications = document.getElementById('project-access-notifications');
    if (!firebaseDb || !isProjectLeader) {
      if (firebaseRequestsRef) {
        firebaseRequestsRef.off('value');
        firebaseRequestsRef = null;
      }
      if (notifications) notifications.hidden = true;
      return;
    }

    if (firebaseRequestsRef) firebaseRequestsRef.off('value');
    const listeningProjectId = currentProjectId;
    firebaseRequestsRef = firebaseDb.ref(`projects/${listeningProjectId}/requests`);
    firebaseRequestsRef.on('value', (snapshot) => {
      if (listeningProjectId !== currentProjectId || !isProjectLeader) return;
      const pending = Object.values(snapshot.val() || {}).filter((request) =>
        request && ['pendiente', 'pending'].includes(String(request.status || '').toLowerCase())
      );
      if (notifications) {
        notifications.hidden = pending.length === 0;
        const count = notifications.querySelector('[data-request-count]');
        if (count) count.textContent = String(pending.length);
        notifications.setAttribute('aria-label', `${pending.length} solicitudes de acceso pendientes`);
      }
      const requestsList = document.getElementById('access-requests-list');
      if (requestsList && isProjectLeader) renderPendingRequests(pending, requestsList);
    }, (error) => {
      console.error('No se pudieron escuchar las solicitudes de acceso:', error);
      showToast('No se pudieron cargar las solicitudes de acceso');
    });
  }

  function renderPendingRequests(requests, requestsList) {
    if (!requests.length) {
      requestsList.innerHTML = '<li><span>No hay solicitudes pendientes.</span></li>';
      return;
    }
    requestsList.innerHTML = requests.map((request) => `
      <li class="access-request-item">
        <span>${escapeHtml(request.displayName || request.email || 'Usuario')}</span>
        <span>${escapeHtml(request.email || '')}</span>
        <button type="button" data-access-request="approve" data-email="${escapeHtml(request.email || '')}">Aceptar</button>
        <button type="button" data-access-request="reject" data-email="${escapeHtml(request.email || '')}">Rechazar</button>
      </li>
    `).join('');
  }

  async function addProjectMember(email, role = 'editor') {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) throw new Error('El correo del miembro es obligatorio');
    if (!normalizedEmail.endsWith('@cun.edu.co')) {
      throw new Error('Los colaboradores deben usar un correo institucional @cun.edu.co');
    }
    const isProtectedMember = normalizedEmail === getProjectOwnerEmail(lastRealtimeProject || {})
      || normalizedEmail === getProjectFacilitatorEmail(lastRealtimeProject || {});
    const normalizedRole = isProtectedMember || String(role).toLowerCase() !== 'lector'
      ? 'editor'
      : 'lector';
    const membersRef = firebaseDb.ref(`projects/${currentProjectId}/members`);
    const result = await membersRef.transaction((members) => {
      const memberMap = normalizeProjectMembers(members);
      const existingMember = memberMap[getEmailDatabaseKey(normalizedEmail)] || {};
      memberMap[getEmailDatabaseKey(normalizedEmail)] = {
        ...existingMember,
        email: normalizedEmail,
        role: existingMember.role === 'propietario' ? 'propietario' : normalizedRole,
        sharedMember: true,
        ...(normalizeEmail(currentUser?.email) === normalizedEmail && currentUser?.photoURL
          ? { photoURL: currentUser.photoURL }
          : {})
      };
      return memberMap;
    });
    if (!result.committed) throw new Error('No se pudo guardar el miembro en Firebase');
  }

  async function ensureProtectedProjectMembers(ownerEmail, facilitatorEmail) {
    const protectedEmails = Array.from(new Set(
      [ownerEmail, facilitatorEmail].map(normalizeEmail).filter(isInstitutionalEmail)
    ));
    const membersRef = firebaseDb.ref(`projects/${currentProjectId}/members`);
    const result = await membersRef.transaction((members) => {
      const memberMap = normalizeProjectMembers(members);
      protectedEmails.forEach((email) => {
        const key = getEmailDatabaseKey(email);
        const existing = memberMap[key] || {};
        memberMap[key] = {
          ...existing,
          email,
          role: 'editor',
          protectedRole: email === normalizeEmail(ownerEmail) ? 'owner' : 'facilitator'
        };
      });
      return memberMap;
    });
    if (!result.committed) throw new Error('No se pudieron sincronizar los permisos protegidos del proyecto');
  }

  async function assignCurrentUserAsProjectOwner(projectId, user, allowNewProjectClaim = false) {
    const email = normalizeEmail(user?.email);
    if (!firebaseDb || !projectId || !isInstitutionalEmail(email)) return false;
    const projectRef = firebaseDb.ref(`projects/${projectId}`);
    const ownerKey = getEmailDatabaseKey(email);
    const result = await projectRef.transaction((project) => {
      const projectData = project || {};
      const explicitOwner = normalizeEmail(projectData.ownerEmail || projectData.config?.authorEmail);
      const inferredOwner = getProjectOwnerEmail(projectData);
      const memberMap = normalizeProjectMembers(projectData.members);
      const isAlreadyOwner = explicitOwner === email || inferredOwner === email;
      const isEmptyNewProject = allowNewProjectClaim
        && !explicitOwner
        && !inferredOwner
        && !Object.keys(memberMap).length
        && !Object.keys(projectData.fields || {}).length
        && !Object.keys(projectData.teamMembers || {}).length;
      if ((explicitOwner && explicitOwner !== email)
        || (inferredOwner && inferredOwner !== email)
        || (!isAlreadyOwner && !isEmptyNewProject)) {
        return;
      }

      const existingOwner = memberMap[ownerKey] || {};
      projectData.ownerEmail = email;
      projectData.members = {
        ...memberMap,
        [ownerKey]: {
          ...existingOwner,
          email,
          role: 'editor',
          protectedRole: 'owner',
          ...(user.photoURL ? { photoURL: user.photoURL } : {})
        }
      };
      projectData.createdAt = projectData.createdAt || Date.now();
      return projectData;
    });
    if (!result.committed) return false;
    if (projectId === currentProjectId) {
      isUnpersistedProject = false;
      if (localStorage.getItem(UNPERSISTED_PROJECT_ID_KEY) === projectId) {
        localStorage.removeItem(UNPERSISTED_PROJECT_ID_KEY);
      }
      lastRealtimeProject = result.snapshot.val() || lastRealtimeProject;
      applyProjectAccessMode(lastRealtimeProject);
    }
    return true;
  }

  function collectTeamMembers() {
    return Array.from({ length: 5 }, (_, index) => {
      const slot = index + 1;
      const value = (id) => document.getElementById(`${id}_${slot}`)?.value?.trim() || '';
      return {
        slot,
        firstName: value('nombre'),
        lastName: value('apellido'),
        academicProgram: value('programa'),
        courseCode: value('codigo'),
        email: normalizeEmail(document.getElementById(`correo_integrante_${slot}`)?.value)
      };
    });
  }

  function isInstitutionalEmail(email) {
    return /^[^\s@]+@cun\.edu\.co$/i.test(normalizeEmail(email));
  }

  async function syncTeamMemberAccess(
    teamMembers = collectTeamMembers(),
    previousProject = null,
    nextFacilitatorEmail = getProjectFacilitatorEmail(previousProject || lastRealtimeProject || {})
  ) {
    if (!firebaseDb || !currentProjectId) return;

    const projectRef = firebaseDb.ref(`projects/${currentProjectId}`);
    let project = previousProject;
    if (!project) {
      const snapshot = await projectRef.once('value');
      if (!snapshot.exists()) return;
      project = snapshot.val() || {};
    }
    const savedTeamMembers = Array.isArray(project.teamMembers)
      ? project.teamMembers
      : Array.from({ length: 5 }, (_, index) => ({
        slot: index + 1,
        email: project.fields?.[`correo_integrante_${index + 1}`]
      }));
    const oldRosterEmails = project.rosterMemberEmails && typeof project.rosterMemberEmails === 'object'
      ? { ...project.rosterMemberEmails }
      : Object.fromEntries(savedTeamMembers
        .filter((member) => member?.slot && isInstitutionalEmail(member.email))
        .map((member) => [String(member.slot), normalizeEmail(member.email)]));
    const ownerEmail = getProjectOwnerEmail(project);
    const previousFacilitatorEmail = getProjectFacilitatorEmail(project);
    const facilitatorEmail = normalizeEmail(nextFacilitatorEmail);
    const rosterEmails = { ...oldRosterEmails };

    teamMembers.forEach((member) => {
      const slot = String(member.slot);
      if (isInstitutionalEmail(member.email)) {
        rosterEmails[slot] = normalizeEmail(member.email);
      } else {
        delete rosterEmails[slot];
      }
    });

    const nextRosterEmails = new Set(Object.values(rosterEmails).map(normalizeEmail));
    const previousRosterEmails = new Set(Object.values(oldRosterEmails).map(normalizeEmail));
    const membersRef = firebaseDb.ref(`projects/${currentProjectId}/members`);
    const result = await membersRef.transaction((members) => {
      const memberMap = normalizeProjectMembers(members);
      previousRosterEmails.forEach((email) => {
        if (nextRosterEmails.has(email) || email === ownerEmail || email === facilitatorEmail) return;
        const key = getEmailDatabaseKey(email);
        delete memberMap[key];
      });
      if (previousFacilitatorEmail && previousFacilitatorEmail !== facilitatorEmail
        && previousFacilitatorEmail !== ownerEmail && !nextRosterEmails.has(previousFacilitatorEmail)) {
        const previousFacilitatorKey = getEmailDatabaseKey(previousFacilitatorEmail);
        if (memberMap[previousFacilitatorKey]?.protectedRole === 'facilitator') {
          delete memberMap[previousFacilitatorKey];
        }
      }

      nextRosterEmails.forEach((email) => {
        const key = getEmailDatabaseKey(email);
        const existing = memberMap[key] || {};
        memberMap[key] = {
          ...existing,
          email,
          role: existing.role === 'propietario' ? 'propietario' : 'editor',
          teamMember: true,
          sharedMember: existing.teamMember ? !!existing.sharedMember : !!existing.email,
          ...(normalizeEmail(currentUser?.email) === email && currentUser?.photoURL
            ? { photoURL: currentUser.photoURL }
            : {})
        };
      });
      [ownerEmail, facilitatorEmail].filter(isInstitutionalEmail).forEach((email) => {
        const key = getEmailDatabaseKey(email);
        const existing = memberMap[key] || {};
        memberMap[key] = {
          ...existing,
          email,
          role: 'editor',
          protectedRole: email === ownerEmail ? 'owner' : 'facilitator'
        };
      });
      return memberMap;
    });
    if (!result.committed) throw new Error('No se pudieron sincronizar los integrantes con Firebase');

    const updatedAt = Date.now();
    await projectRef.update({
      teamMembers,
      facilitatorEmail,
      rosterMemberEmails: rosterEmails,
      updatedAt,
      lastModifiedAt: updatedAt,
      lastModifiedByUid: (firebaseAuth?.currentUser || currentUser)?.uid || ''
    });
  }

  async function guardarHistorialCambio(
  projectId, 
  datosProyecto, 
  changeDescription = 'Actualización general del proyecto', 
  fieldId = 'general', 
  addedText = ''
) {
  const user = firebaseAuth?.currentUser || currentUser;
  if (!firebaseDb || !projectId) throw new Error('Firebase no está disponible para guardar el historial');
  if (!user?.email) throw new Error('Debes iniciar sesión para guardar el historial');

  const timestamp = Date.now();
  const fecha = new Date(timestamp).toISOString();

  // Normalización y fallbacks para datos del usuario
  const userEmail = (user.email || '').trim().toLowerCase();
  const userName = (user.displayName || userEmail || 'Usuario').trim();

  // Comparar campos actuales contra el estado previo en memoria (lastRealtimeFields)
  const nuevosCampos = datosProyecto?.fields || (typeof collectFormState === 'function' ? collectFormState() : {});
  const camposAnteriores = typeof lastRealtimeFields !== 'undefined' ? lastRealtimeFields : {};
  const cambiosDetectados = [];

  if (nuevosCampos && typeof nuevosCampos === 'object') {
    Object.entries(nuevosCampos).forEach(([clave, valorNuevo]) => {
      const valorAnterior = camposAnteriores[clave];
      // Evitar registrar campos auxiliares de autoría o sin cambios
      if (clave.endsWith('_author') || clave === 'fileName') return;

      if (JSON.stringify(valorAnterior) !== JSON.stringify(valorNuevo)) {
        const etiqueta = (typeof NOMENCLATURA_SIORA !== 'undefined' && NOMENCLATURA_SIORA[clave]) || clave;
        cambiosDetectados.push({
          clave,
          etiqueta,
          valorAnterior: valorAnterior ?? "",
          valorNuevo: valorNuevo ?? ""
        });
      }
    });
  }

  // Fallback inteligente para addedText si no fue provisto
  const textoAgregadoFinal = (addedText || '').trim() || 
    (cambiosDetectados.length > 0 
      ? cambiosDetectados.map(c => `${c.etiqueta}: ${c.valorNuevo}`).join(' | ') 
      : 'Actualización realizada');

  // Construcción del objeto de historial sanitizado
  const historialEntry = {
    timestamp,
    fecha,
    userEmail,
    userName,
    fieldId: (fieldId || 'general').trim(),
    addedText: textoAgregadoFinal,
    changeDescription: (changeDescription || 'Actualización general del proyecto').trim(),
    cambios: cambiosDetectados // Conserva el desglose si existe
  };

  try {
    // Guardar en Realtime Database
    const historyRef = firebaseDb.ref(`projects/${projectId}/history`);
    await historyRef.push(historialEntry);
    console.log("Historial de cambio guardado exitosamente:", historialEntry);
    return historialEntry;
  } catch (error) {
    console.error("Error al guardar el historial de cambio:", error);
    throw error;
  }
}

  async function syncChangedTeamMemberEmail(event) {
    if (event?.target?.dataset.firebaseRemoteSync === 'true' || isApplyingRemoteDocument) return;
    const email = normalizeEmail(event.target?.value);
    if (!isInstitutionalEmail(email) || !currentProjectId) return;
    const firebase = ensureFirebase();
    if (!firebase || !firebaseDb || !(firebaseAuth?.currentUser || currentUser)) return;

    try {
      const snapshot = await firebaseDb.ref(`projects/${currentProjectId}`).once('value');
      if (!snapshot.exists()) return;
      const project = snapshot.val() || {};
      if (!canCurrentUserEditProject(project)) {
        showToast('No tienes permisos para agregar integrantes al proyecto');
        return;
      }
      await addProjectMember(email, 'Editor');
    } catch (error) {
      console.error('No se pudo sincronizar el correo del integrante:', error);
      showToast(String(error?.code || '').toLowerCase().includes('permission')
        ? 'No tienes permisos para agregar integrantes al proyecto'
        : 'No se pudo agregar el correo del integrante');
    }
  }

  async function saveProjectToFirebase(config = loadStoredConfig()) {
    const firebase = ensureFirebase();
    if (!firebase || !firebaseDb) throw new Error('Firebase no está disponible para guardar el proyecto');

    const title = String(config.projectName || '').trim();
    if (!title) throw new Error('El nombre del proyecto es obligatorio');
    const projectRef = firebaseDb.ref(`projects/${currentProjectId}`);
    const existingSnapshot = await projectRef.once('value');
    const existingProject = existingSnapshot.val() || {};
    const sessionEmail = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
    const teamMembers = collectTeamMembers();
    const leaderEmail = teamMembers.find((member) => member.slot === 1 && isInstitutionalEmail(member.email))?.email || '';
    const facilitatorEmail = normalizeEmail(
      config.facilitatorEmail || document.getElementById('correo_facilitador')?.value
    );
    if (facilitatorEmail && !isInstitutionalEmail(facilitatorEmail)) {
      throw new Error('El correo del facilitador debe pertenecer al dominio @cun.edu.co');
    }
    const ownerEmail = normalizeEmail(
      existingProject.ownerEmail
      || (isUnpersistedProject ? sessionEmail : '')
      || leaderEmail
      || sessionEmail
      || existingProject.config?.authorEmail
    );
    if (!ownerEmail) throw new Error('No se pudo identificar al propietario del proyecto');
    if (existingSnapshot.exists() && !canCurrentUserEditProject(existingProject)) {
      const error = new Error('No tienes permisos para modificar este proyecto');
      error.code = 'permission-denied';
      throw error;
    }
    const memberEmails = Array.from(new Set([
      ...teamMembers.map((member) => member.email).filter(isInstitutionalEmail),
      ...(isInstitutionalEmail(facilitatorEmail) ? [facilitatorEmail] : []),
      ...(isInstitutionalEmail(ownerEmail) ? [ownerEmail] : []),
      ...(isInstitutionalEmail(sessionEmail) ? [sessionEmail] : [])
    ]));
    const projectConfig = {
      ...(existingProject.config || {}),
      ...config,
      authorEmail: ownerEmail,
      facilitatorEmail: isInstitutionalEmail(facilitatorEmail) ? facilitatorEmail : ''
    };
    const payload = {
      ...collectProjectPayload(),
      teamMembers,
      dynamicSections: window.obtenerEstadoFichasDinamicas?.() || getPersistedDynamicSections(),
      config: projectConfig,
      projectId: currentProjectId,
      fileName: String(document.getElementById('file-name-input')?.value || ''),
      projectName: title,
      title,
      ownerEmail,
      facilitatorEmail: isInstitutionalEmail(facilitatorEmail) ? facilitatorEmail : '',
      localPath: String(config.saveFolder || ''),
      wordUrl: String(config.wordUrl || ''),
      excelUrl: String(config.excelUrl || ''),
      folderUrl: String(
        config.folderUrl
        ?? existingProject.folderUrl
        ?? existingProject.config?.folderUrl
        ?? ''
      ),
      updatedAt: Date.now(),
      lastModifiedAt: Date.now()
    };
    const savingUser = firebaseAuth?.currentUser || currentUser;
    if (savingUser) {
      payload.lastModifiedByUid = savingUser.uid || '';
      payload.lastModifiedBy = normalizeEmail(savingUser.email);
    }
    if (!existingSnapshot.exists()) payload.createdAt = Date.now();
    const projectData = {
      ...payload,
      fields: {
        ...(existingProject.fields || {}),
        ...(payload.fields || {})
      }
    };
    console.log("Datos capturados antes de guardar:", projectData);
    const projectUpdates = { ...payload };
    delete projectUpdates.fields;
    delete projectUpdates.config;
    delete projectUpdates.dynamicSections;
    Object.entries(payload.fields || {}).forEach(([fieldKey, value]) => {
      projectUpdates[`fields/${fieldKey}`] = value;
    });
    Object.entries(projectConfig).forEach(([configKey, value]) => {
      if (value !== undefined) projectUpdates[`config/${configKey}`] = value;
    });
    Object.entries(payload.dynamicSections || {}).forEach(([section, items]) => {
      projectUpdates[`dynamicSections/${section}`] = Array.isArray(items) && items.length
        ? items
        : { __empty: true };
    });
    await projectRef.update(projectUpdates);
    await ensureProtectedProjectMembers(ownerEmail, facilitatorEmail);
    await syncTeamMemberAccess(payload.teamMembers, { ...existingProject, ownerEmail }, facilitatorEmail);
    const teamEmails = new Set(teamMembers
      .map((member) => normalizeEmail(member.email))
      .filter(isInstitutionalEmail));
    const membersRef = firebaseDb.ref(`projects/${currentProjectId}/members`);
    const membersResult = await membersRef.transaction((members) => {
      const memberMap = normalizeProjectMembers(members);
      memberEmails.forEach((email) => {
        const key = getEmailDatabaseKey(email);
        const existingMember = memberMap[key] || {};
        memberMap[key] = {
          ...existingMember,
          email,
          role: existingMember.role || 'editor',
          ...(teamEmails.has(email) ? { teamMember: true } : {})
        };
      });
      return memberMap;
    });
    if (!membersResult.committed) throw new Error('No se pudieron fusionar los integrantes del proyecto');
    isUnpersistedProject = false;
    if (localStorage.getItem(UNPERSISTED_PROJECT_ID_KEY) === currentProjectId) {
      localStorage.removeItem(UNPERSISTED_PROJECT_ID_KEY);
    }
    lastRealtimeProject = { ...projectData, members: normalizeProjectMembers(existingProject.members) };
    applyProjectAccessMode(lastRealtimeProject);
    let historySaved = true;
    try {
      await guardarHistorialCambio(currentProjectId, payload);
    } catch (error) {
      console.error('El proyecto se guardó, pero no se pudo registrar el historial:', error);
      historySaved = false;
    }
    markFileSaved(title);
    payload.historySaved = historySaved;
    return payload;
  }

  function configureRealtimePresence() {
    const firebase = ensureFirebase();
    if (!firebase || !firebaseAuth || !firebaseDb) return;

    if (!firebasePresenceAuthInitialized) {
      firebasePresenceAuthInitialized = true;
      firebaseAuth.onAuthStateChanged((user) => {
        currentUser = user;
        membershipVerificationProjectId = '';
        const permissionProject = lastRealtimeProject || (isUnpersistedProject ? {} : null);
        if (permissionProject) applyProjectAccessMode(permissionProject);
        else renderProjectPermissions(null);
        if (user && isUnpersistedProject) {
          const leaderEmailInput = document.getElementById('correo_integrante_1');
          if (leaderEmailInput && !leaderEmailInput.value) {
            leaderEmailInput.value = normalizeEmail(user.email);
            saveFormState();
          }
          assignCurrentUserAsProjectOwner(currentProjectId, user, true).catch((error) => {
            console.error('No se pudo asignar el propietario del proyecto nuevo:', error);
            showToast('No se pudo inicializar el acceso del proyecto nuevo');
          });
        }
        if (user) syncAuthenticatedMemberPhoto(user);
        const authorEmailInput = document.getElementById('inputCorreoAutor');
        if (authorEmailInput && !authorEmailInput.value && user?.email) {
          authorEmailInput.value = normalizeEmail(user.email);
        }
        const loginButton = getAuthButton();
        if (loginButton) {
          const avatar = loginButton.querySelector('.user-avatar-circle');
          const fallback = loginButton.querySelector('.user-avatar-fallback');
          const profileName = document.getElementById('user-profile-name');
          const signOutButton = document.getElementById('btnSignOut');
          if (user) {
            loginButton.classList.add('logged-in');
            const displayName = user.displayName || user.email || 'Usuario';
            const profileLabel = user.email
              ? `${displayName} (${user.email})`
              : displayName;
            const photoURL = /^https:\/\//i.test(String(user.photoURL || '')) ? user.photoURL : '';
            if (avatar) {
              avatar.src = photoURL;
              avatar.hidden = !photoURL;
              avatar.onerror = () => {
                avatar.hidden = true;
                if (fallback) fallback.hidden = false;
              };
            }
            if (fallback) {
              fallback.textContent = displayName.charAt(0).toUpperCase();
              fallback.hidden = !!photoURL;
            }
            if (profileName) profileName.textContent = profileLabel;
            if (signOutButton) signOutButton.hidden = false;
            loginButton.title = `Perfil de ${displayName}`;
            loginButton.setAttribute('aria-label', `Abrir perfil de ${displayName}`);
          } else {
            loginButton.classList.remove('logged-in');
            if (avatar) {
              avatar.removeAttribute('src');
              avatar.hidden = true;
              avatar.onerror = null;
            }
            if (fallback) {
              fallback.textContent = 'G';
              fallback.hidden = false;
            }
            if (profileName) profileName.textContent = 'No has iniciado sesión';
            if (signOutButton) signOutButton.hidden = true;
            loginButton.setAttribute('aria-expanded', 'false');
            const profileMenu = document.getElementById('user-profile-menu');
            if (profileMenu) profileMenu.hidden = true;
            loginButton.title = 'Iniciar sesión con Google Workspace @cun.edu.co';
            loginButton.setAttribute('aria-label', 'Iniciar sesión con Google Workspace');
          }
        }

        configureRealtimePresence();
        configureRealtimeDocumentSync();
      });
      return;
    }

    if (firebasePresenceListRef) firebasePresenceListRef.off('value');
    firebasePresenceListRef = getProjectPresenceRef();
    if (currentUser) {
      if (firebasePresenceRef) {
        firebasePresenceRef.onDisconnect().cancel();
        firebasePresenceRef.remove()
          .catch((error) => console.warn('No se pudo limpiar la presencia anterior:', error));
      }
      firebasePresenceRef = firebaseDb.ref(`projects/${currentProjectId}/presences/${currentUser.uid}`);
      const activePresenceRef = firebasePresenceRef;
      const presenceData = {
        uid: currentUser.uid,
        displayName: currentUser.displayName || 'Usuario SI-ORA',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || '',
        online: true,
        lastSeen: Date.now()
      };
      activePresenceRef.onDisconnect().remove()
        .then(() => activePresenceRef.set(presenceData))
        .catch((error) => console.error('No se pudo activar la presencia del usuario:', error));
    } else if (firebasePresenceRef) {
      firebasePresenceRef.onDisconnect().cancel();
      firebasePresenceRef.remove()
        .catch((error) => console.warn('No se pudo limpiar la presencia al cerrar sesión:', error));
      firebasePresenceRef = null;
    }

    firebasePresenceListRef.on('value', (snapshot) => {
      const users = snapshot.val() || {};
      renderConnectedUsers(users);
    }, (error) => {
      console.error('No se pudo escuchar la presencia del proyecto:', error);
    });
  }

  async function verifyCurrentUserProjectMembership(projectId, projectData) {
    const user = firebaseAuth?.currentUser || currentUser;
    const email = normalizeEmail(user?.email);
    if (!email || membershipVerificationProjectId === projectId) return;

    const members = normalizeProjectMembers(projectData.members);
    const rosterEmails = [
      ...(Array.isArray(projectData.teamMembers) ? projectData.teamMembers : []),
      ...Object.values(projectData.rosterMemberEmails || {}).map((memberEmail) => ({ email: memberEmail })),
      ...Array.from({ length: 5 }, (_, index) => ({
        email: projectData.fields?.[`correo_integrante_${index + 1}`]
      }))
    ].map((member) => normalizeEmail(typeof member === 'string' ? member : member?.email));
    const ownerEmail = normalizeEmail(projectData.ownerEmail || projectData.config?.authorEmail);
    const facilitatorEmail = getProjectFacilitatorEmail(projectData);
    if (email !== ownerEmail && email !== facilitatorEmail
      && !members[getEmailDatabaseKey(email)] && !rosterEmails.includes(email)) {
      return;
    }

    membershipVerificationProjectId = projectId;
    try {
      if (email === ownerEmail) {
        await ensureProtectedProjectMembers(ownerEmail, facilitatorEmail);
      }
      else if (email === facilitatorEmail && !members[getEmailDatabaseKey(email)] && isInstitutionalEmail(email)) {
        await addProjectMember(email, 'Editor');
      }
      else if (!members[getEmailDatabaseKey(email)] && isInstitutionalEmail(email)) {
        await addProjectMember(email, 'Editor');
      }
    } catch (error) {
      membershipVerificationProjectId = '';
      console.error('No se pudo verificar la membresía del usuario:', error);
      showToast(String(error?.code || '').toLowerCase().includes('permission')
        ? 'No tienes permisos para acceder al proyecto'
        : 'No se pudo verificar tu acceso al proyecto');
    }
  }

  function normalizeRealtimeDynamicSections(dynamicSections) {
    const normalizeSection = (items) => {
      if (Array.isArray(items)) return items;
      if (!items || typeof items !== 'object') return [];
      return Object.entries(items)
        .filter(([key]) => /^\d+$/.test(key))
        .sort(([left], [right]) => Number(left) - Number(right))
        .map(([, item]) => item);
    };

    return {
      planteamiento: normalizeSection(dynamicSections?.planteamiento),
      justificacion: normalizeSection(dynamicSections?.justificacion)
    };
  }

  function applyRemoteProjectDocument(documentData) {
    if (!documentData || typeof documentData !== 'object') return;

    const hasDynamicSections = documentData.dynamicSections !== undefined
      || lastRealtimeDynamicSections !== null;
    const remoteDynamicSections = normalizeRealtimeDynamicSections(
      documentData.dynamicSections !== undefined
        ? documentData.dynamicSections
        : lastRealtimeDynamicSections
    );
    const fields = documentData.fields && typeof documentData.fields === 'object'
      ? documentData.fields
      : {};
    const hasFields = Object.keys(fields).length > 0;
    const hasAnalysisLevels = documentData.analysisLevels
      && typeof documentData.analysisLevels === 'object'
      && Object.keys(documentData.analysisLevels).length > 0;
    const hasConfig = documentData.config
      && typeof documentData.config === 'object'
      && Object.keys(documentData.config).length > 0;
    if (!hasFields && !hasAnalysisLevels && !hasDynamicSections && !hasConfig
      && lastRealtimeFields === null && lastRealtimeAnalysisLevels === null) return;

    const changedFields = {};
    Object.entries(fields).forEach(([fieldKey, value]) => {
      if (lastRealtimeFields === null
        || JSON.stringify(lastRealtimeFields[fieldKey]) !== JSON.stringify(value)) {
        changedFields[fieldKey] = value;
      }
    });
    const removedFieldKeys = lastRealtimeFields
      ? Object.keys(lastRealtimeFields).filter((fieldKey) =>
        !Object.prototype.hasOwnProperty.call(fields, fieldKey))
      : [];

    isApplyingRemoteDocument = true;
    try {
      const remoteAnalysisLevels = documentData.analysisLevels || {};
      if (JSON.stringify(remoteAnalysisLevels) !== JSON.stringify(lastRealtimeAnalysisLevels || {})) {
        analysisLevelState = remoteAnalysisLevels;
      }

      const dynamicSectionsChanged = hasDynamicSections
        && JSON.stringify(remoteDynamicSections) !== JSON.stringify(lastRealtimeDynamicSections);
      if (dynamicSectionsChanged && window.restaurarFichasDinamicas) {
        if (esCampoDinamico(document.activeElement)) {
          pendingRemoteDynamicSections = remoteDynamicSections;
        } else {
          applyRemoteDynamicSections(remoteDynamicSections);
        }
      }

      prepararClavesCampos();
      Object.entries(changedFields).forEach(([fieldKey, value]) => applyRemoteFieldValue(fieldKey, value));
      removedFieldKeys.forEach((fieldKey) => applyRemoteFieldValue(fieldKey, null));
      lastRealtimeAnalysisLevels = Object.keys(remoteAnalysisLevels).length ? remoteAnalysisLevels : null;
      lastRealtimeDynamicSections = hasDynamicSections ? remoteDynamicSections : null;
      lastRealtimeFields = { ...fields };
    } finally {
      isApplyingRemoteDocument = false;
    }

    if (typeof window.sincronizarReplicasIniciales === 'function') {
      window.sincronizarReplicasIniciales();
    }
  }

  function applyRemoteDynamicSections(sections) {
    if (!window.restaurarFichasDinamicas) return;
    const currentSections = window.obtenerEstadoFichasDinamicas?.();
    if (JSON.stringify(currentSections) !== JSON.stringify(sections)) {
      const wasApplyingRemoteDocument = isApplyingRemoteDocument;
      isApplyingRemoteDocument = true;
      try {
        window.restaurarFichasDinamicas(sections);
      } finally {
        isApplyingRemoteDocument = wasApplyingRemoteDocument;
      }
    }
  }

  function configureRealtimeDocumentSync() {
    const firebase = ensureFirebase();
    if (!firebase || !firebaseDb) return;

    if (firebaseConnectionRef) firebaseConnectionRef.off('value');
    firebaseConnectionRef = firebaseDb.ref('.info/connected');
    firebaseConnectionRef.on('value', (snapshot) => {
      isFirebaseConnected = snapshot.val() === true;
      if (!isFirebaseConnected) {
        if (!localRecoveryNotified && getStoredFormState()) {
          const recovered = window.restaurarEstadoPersistido?.();
          if (recovered) {
            localRecoveryNotified = true;
            setSaveStatus('unsaved');
            showToast('Datos recuperados del almacenamiento local');
          }
        }
        return;
      }
      localRecoveryNotified = false;
      if (Object.keys(pendingRealtimeFields).length || pendingRealtimeDynamicSync) {
        scheduleRealtimeAutoSave();
      }
    }, (error) => {
      console.error('No se pudo verificar la conexión con Firebase:', error);
    });

    const listeningProjectId = currentProjectId;
    const isSameProjectListener = firebaseDocumentRef && firebaseDocumentProjectId === listeningProjectId;
    if (firebaseDocumentRef) firebaseDocumentRef.off('value');
    let isInitialSnapshot = !isSameProjectListener;
    firebaseDocumentRef = firebaseDb.ref(`projects/${listeningProjectId}`);
    firebaseDocumentProjectId = listeningProjectId;
    if (!isSameProjectListener) {
      lastRealtimeFields = null;
      lastRealtimeDynamicSections = null;
      lastRealtimeAnalysisLevels = null;
      pendingRemoteFieldValues = {};
      pendingRemoteDynamicSections = null;
      pendingRealtimeFields = {};
      pendingRealtimeDynamicSync = false;
      window.clearTimeout(realtimeAutoSaveTimer);
      realtimeAutoSaveTimer = null;
    }
    console.log("Sincronización en tiempo real activa para el proyecto:", listeningProjectId);
    firebaseDocumentRef.on('value', (snapshot) => {
      if (listeningProjectId !== currentProjectId) return;
      if (!snapshot.exists()) {
        isInitialSnapshot = false;
        window.sioraDatosCargados = true;
        renderEvidenceList({});
        if (isUnpersistedProject) {
          lastRealtimeProject = {};
          applyProjectAccessMode(lastRealtimeProject);
          const user = firebaseAuth?.currentUser || currentUser;
          if (user) {
            assignCurrentUserAsProjectOwner(listeningProjectId, user, true).catch((error) => {
              console.error('No se pudo asignar el propietario del proyecto nuevo:', error);
              showToast('No se pudo inicializar el acceso del proyecto nuevo');
            });
          }
        }
        return;
      }
      isUnpersistedProject = false;
      if (localStorage.getItem(UNPERSISTED_PROJECT_ID_KEY) === listeningProjectId) {
        localStorage.removeItem(UNPERSISTED_PROJECT_ID_KEY);
      }
      const documentData = snapshot.val();
      if (!documentData || typeof documentData !== 'object') return;
      const previousProjectData = lastRealtimeProject;
      const currentUid = firebaseAuth?.currentUser?.uid || currentUser?.uid;
      const remoteModifiedAt = Number(documentData.lastModifiedAt || documentData.updatedAt || 0);
      const recentOwnUpdate = !isInitialSnapshot
        && !!currentUid
        && documentData.lastModifiedByUid === currentUid
        && remoteModifiedAt > 0
        && Date.now() - remoteModifiedAt >= 0
        && Date.now() - remoteModifiedAt < 3000;
      if (recentOwnUpdate) {
        lastRealtimeProject = documentData;
        lastRealtimeFields = documentData.fields && typeof documentData.fields === 'object'
          ? { ...documentData.fields }
          : {};
        lastRealtimeDynamicSections = documentData.dynamicSections === undefined
          ? lastRealtimeDynamicSections
          : normalizeRealtimeDynamicSections(documentData.dynamicSections);
        lastRealtimeAnalysisLevels = documentData.analysisLevels || null;
        return;
      }
      lastRealtimeProject = documentData;
      renderEvidenceList(documentData.evidences || {});
      syncPendingEvidenceItems().catch((error) => {
        console.error('No se pudieron sincronizar las evidencias pendientes:', error);
      });
      applyProjectAccessMode(documentData);
      const authenticatedUser = firebaseAuth?.currentUser || currentUser;
      const authenticatedEmail = normalizeEmail(authenticatedUser?.email);
      const inferredOwnerEmail = getProjectOwnerEmail(documentData);
      if (authenticatedEmail && inferredOwnerEmail === authenticatedEmail
        && !normalizeEmail(documentData.ownerEmail)) {
        assignCurrentUserAsProjectOwner(listeningProjectId, authenticatedUser).catch((error) => {
          console.error('No se pudo registrar el propietario inferido del proyecto:', error);
          showToast('No se pudo registrar al propietario del proyecto');
        });
      }
      const isExternalUpdate = !currentUid || documentData.lastModifiedByUid !== currentUid;
      if (isExternalUpdate && (!previousProjectData
        || JSON.stringify(previousProjectData) !== JSON.stringify(documentData))) {
        console.log("Actualización remota recibida para el proyecto:", listeningProjectId, documentData);
      }
      verifyCurrentUserProjectMembership(listeningProjectId, documentData);
      if (isInitialSnapshot) {
        isInitialSnapshot = false;
        let localState = getStoredFormState();
        if (hasUnsavedChanges && !localState) {
          saveFormState();
          localState = getStoredFormState();
        }
        const localFields = localState?.fields || localState || {};
        const localDynamicSections = localState?.dynamicSections || {};
        const hasLocalContent = hasProjectContent(localFields, localDynamicSections);
        const remoteFields = documentData.fields || {};
        const remoteDynamicSections = documentData.dynamicSections || {};
        const remoteHasContent = hasProjectContent(remoteFields, remoteDynamicSections);
        const localStateIsNewer = Number(localState?.savedAt || 0)
          > Number(documentData.updatedAt || 0);
        if (hasUnsavedChanges || (hasLocalContent && (!remoteHasContent || localStateIsNewer))) {
          if (hasUnsavedChanges) saveFormState();
          loadFormState();
          window.restaurarEstadoPersistido?.();
          applyRemoteProjectMetadata(documentData);
          lastRealtimeFields = collectFormState();
          const restoredDynamicSections = window.obtenerEstadoFichasDinamicas?.() || {};
          lastRealtimeDynamicSections = normalizeRealtimeDynamicSections(restoredDynamicSections);
          lastRealtimeAnalysisLevels = analysisLevelState;
          window.sioraDatosCargados = true;
          const rescueLocalState = async () => {
            const user = firebaseAuth?.currentUser || currentUser;
            if (!getProjectOwnerEmail(documentData) && user) {
              const ownerAssigned = await assignCurrentUserAsProjectOwner(
                listeningProjectId,
                user,
                true
              );
              if (!ownerAssigned) {
                throw new Error('No se pudo confirmar el propietario para rescatar los datos locales');
              }
            }
            await saveProjectToFirebase();
          };
          rescueLocalState().catch((error) => {
            console.error('No se pudo rescatar el estado local en Firebase:', error);
            showToast('Los cambios siguen guardados localmente, pero no se pudieron rescatar en Firebase');
          });
          return;
        }
      }
      applyRemoteProjectMetadata(documentData);
      applyRemoteProjectDocument(documentData);
      actualizarBotonCarpetaEvidencias();
      if (isInitialSnapshot === false) window.sioraDatosCargados = true;
    }, (error) => {
      console.error('No se pudo escuchar el proyecto en tiempo real:', error);
      showToast('No se pudo activar la sincronización del proyecto');
    });
  }

  function applyRemoteProjectMetadata(projectData) {
    const projectName = String(projectData.projectName || projectData.config?.projectName || projectData.name || '').trim();
    const config = {
      ...loadStoredConfig(),
      ...(projectData.config || {}),
      projectName: projectName || loadStoredConfig().projectName || '',
      authorEmail: normalizeEmail(projectData.ownerEmail || projectData.config?.authorEmail || loadStoredConfig().authorEmail || ''),
      facilitatorEmail: getProjectFacilitatorEmail(projectData),
      saveFolder: String(projectData.localPath || projectData.config?.saveFolder || loadStoredConfig().saveFolder || ''),
      wordUrl: String(projectData.wordUrl || projectData.config?.wordUrl || loadStoredConfig().wordUrl || ''),
      excelUrl: String(projectData.excelUrl || projectData.config?.excelUrl || loadStoredConfig().excelUrl || ''),
      folderUrl: String(
        projectData.folderUrl
        ?? projectData.config?.folderUrl
        ?? loadStoredConfig().folderUrl
        ?? ''
      )
    };
    if (projectName) setCurrentDocumentName(projectName);
    saveStoredConfig(config);
    applyStoredConfig();
    actualizarBotonCarpetaEvidencias();
    const facilitatorInput = document.getElementById('correo_facilitador');
    if (facilitatorInput && document.activeElement !== facilitatorInput) {
      facilitatorInput.value = config.facilitatorEmail;
    }
  }

  function applyRemoteFieldValue(fieldKey, value) {
    if (fieldKey.endsWith('_author')) {
      const authorField = document.getElementById(fieldKey.slice(0, -7)) || buscarCampoGuardado(fieldKey.slice(0, -7));
      if (!authorField) return;
      if (document.activeElement === authorField) {
        pendingRemoteFieldValues[fieldKey] = value;
        return;
      }
      if (value == null || value === '') delete authorField.dataset.author;
      else authorField.dataset.author = String(value);
      updateParticipationFieldLabel(authorField);
      delete pendingRemoteFieldValues[fieldKey];
      return;
    }
    const el = document.getElementById(fieldKey) || buscarCampoGuardado(fieldKey);
    if (!el || esCampoDinamico(el)) return;
    if (document.activeElement === el) {
      pendingRemoteFieldValues[fieldKey] = value;
      return;
    }
    const lockUntil = Number(el.dataset.firebaseLockUntil || 0);
    if (Date.now() < lockUntil) return;
    delete pendingRemoteFieldValues[fieldKey];

    el.dataset.firebaseRemoteSync = 'true';
    try {
      if (el.type === 'checkbox') {
        el.checked = !!value;
      } else {
        el.value = value == null ? '' : String(value);
      }

      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } finally {
      delete el.dataset.firebaseRemoteSync;
    }
  }

  function bindFirebaseCollaboration() {
    configureRealtimePresence();
  }

  async function reloadActiveProjectData() {
    const firebase = ensureFirebase();
    const projectId = currentProjectId;
    if (!firebase || !firebaseDb || !projectId) return;
    const snapshot = await firebaseDb.ref(`projects/${projectId}`).once('value');
    if (projectId !== currentProjectId || !snapshot.exists()) return;
    const projectData = snapshot.val();
    if (!projectData || typeof projectData !== 'object') return;
    applyRemoteProjectMetadata(projectData);
    applyRemoteProjectDocument(projectData);
    configureRealtimeDocumentSync();
  }

  function getPersistedDynamicSections() {
    try {
      const raw = localStorage.getItem(getProjectStorageKey());
      return raw ? JSON.parse(raw)?.dynamicSections || null : null;
    } catch (error) {
      console.warn("No fue posible leer las fichas guardadas", error);
      return null;
    }
  }

  function activateProject(projectId, name = '', isNewProject = false) {
    if (firebaseMembersRef) {
      firebaseMembersRef.off('value');
      firebaseMembersRef = null;
    }
    if (firebaseRequestsRef) {
      firebaseRequestsRef.off('value');
      firebaseRequestsRef = null;
    }
    currentProjectId = !projectId || projectId === 'default' ? createProjectId() : projectId;
    isUnpersistedProject = isNewProject;
    window.sioraDatosCargados = false;
    if (isNewProject) localStorage.setItem(UNPERSISTED_PROJECT_ID_KEY, currentProjectId);
    else if (localStorage.getItem(UNPERSISTED_PROJECT_ID_KEY) === currentProjectId) {
      localStorage.removeItem(UNPERSISTED_PROJECT_ID_KEY);
    }
    window.currentProjectId = currentProjectId;
    actualizarBotonCarpetaEvidencias();
    membershipVerificationProjectId = '';
    lastRealtimeProject = null;
    resetProjectAccessMode();
    pendingRealtimeFields = {};
    pendingRealtimeDynamicSync = false;
    window.clearTimeout(realtimeAutoSaveTimer);
    realtimeAutoSaveTimer = null;
    isProjectLeader = false;
    sessionStorage.setItem(PROJECT_ID_STORAGE_KEY, currentProjectId);
    localStorage.setItem(PROJECT_ID_STORAGE_KEY, currentProjectId);
    syncProjectIdUrl(currentProjectId);
    configureRealtimePresence();
    configureRealtimeDocumentSync();
    configureRealtimeRequests();
    resetDirtyState(name);
  }

  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
  const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY_HERE";
  const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
  let googleDriveTokenClient = null;
  let googleDriveInitialized = false;
  let googleDriveAccessToken = null;

  window.addEventListener('load', () => {
    if (isGoogleDriveConfigured()) {
      initGoogleDrive().catch((error) => console.warn('Google Drive no quedó inicializado:', error));
    }
  }, { once: true });

  initSelectProgramasAcademicos();
  initSelectNPI();
  initSelectCodigosAsignatura();
  initVariableProposito();
  initProgramaAsignaturaPorIntegrante();
  setupParticipationTracking();
  setupAnalysisCauseFields();
  setupResearchApproachVisibility();
  initTopActions();
  initChangeTracking();
  bindFirebaseCollaboration();
  setSaveStatus('saved');
  loadFormState();
  window.restaurarEstadoPersistido = restaurarEstadoPersistido;
  window.restaurarEstadoPersistido();
  configureRealtimeDocumentSync();
    loadProjectHashData();
  updateResearchApproachVisibility();
  applyStoredConfig();
  renderProjectSummary();

  function initSelectProgramasAcademicos() {
    const programas = window.PROGRAMAS_ACADEMICOS || [];
    const selects = Array.from(document.querySelectorAll('[id^="programa_"]'));

    selects.forEach((select) => {
      if (select.dataset.programasInicializados === "true") return;
      select.dataset.programasInicializados = "true";
      select.innerHTML = "";

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Seleccionar programa...";
      select.appendChild(placeholder);

      programas.forEach((programa) => {
        const option = document.createElement("option");
        option.value = programa;
        option.textContent = programa;
        select.appendChild(option);
      });
    });
  }

  function setupResearchApproachVisibility() {
    const selector = document.querySelector('.enfoque-general-select');
    if (!selector) return;
    window.actualizarEsenciasPorEnfoque = updateResearchApproachVisibility;
    selector.addEventListener('change', updateResearchApproachVisibility);
    document.querySelectorAll('.variable-enfoque-box input[type="radio"]').forEach((radio) => {
      radio.addEventListener('change', updateResearchApproachVisibility);
    });
    document.querySelectorAll('.esencia-select:not([data-participation-attached])').forEach((essenceSelect) => {
      essenceSelect.addEventListener('change', updateAnalysisCards);
    });
    document.addEventListener('change', (event) => {
      if (event.target.matches('.variable-enfoque-box input[type="radio"]')) {
        updateResearchApproachVisibility();
      }
    });
  }

  function setupAnalysisCauseFields() {
    document.querySelectorAll('.card-analysis').forEach((card) => {
      if (card.querySelector('.analysis-cause-fields')) return;
      const detailsColumn = card.querySelector('.grid-2-mini > div:first-child');
      if (!detailsColumn) return;

      const causeFields = document.createElement('div');
      causeFields.className = 'analysis-cause-fields';
      causeFields.innerHTML = `
        <div class="analysis-cause-column">
          <div class="analysis-cause-field">
            <div class="header-title" style="font-size: 9px;">CAUSA DEL INDICADOR</div>
            <textarea class="input-red analysis-cause-input" rows="3" placeholder="Causa del indicador..."></textarea>
          </div>
          <div class="analysis-cause-field analysis-cause-definition-field">
            <div class="header-title analysis-cause-definition-label" style="font-size: 9px;">DEFINICIÓN DE LA CAUSA DEL INDICADOR</div>
            <textarea class="input-red analysis-cause-definition-input" rows="3" placeholder="Definición de la causa..."></textarea>
          </div>
        </div>
      `;
      const indicatorTarget = card.querySelector('.ind-head-row textarea');
      card.dataset.essenceGroup = indicatorTarget?.className.includes('ind-obj-') ? '0' : '1';
      card.dataset.analysisLevelKey = indicatorTarget?.className.match(/ind-[^-]+-[a-f]-target/)?.[0] || `card_${card.dataset.essenceGroup}`;
      card.appendChild(causeFields);
      causeFields.querySelectorAll('textarea').forEach((field) => {
        field.dataset.sioraStorageKey = `siora_analysis_${card.dataset.analysisLevelKey}_${field.className}`;
      });
    });
    updateAnalysisCards();
  }

  function normalizeEssenceValue(value) {
    const normalized = (value || '').trim().toLowerCase();
    if (normalized === 'explorar' || normalized === 'explora') return 'explorar';
    return normalized;
  }

  function updateAnalysisCards() {
    const showCauseEssences = new Set([
      'explicar',
      'predecir',
      'evaluar',
      'verificar',
      'interpretar',
      'reflexionar'
    ]);
    const selectedEssences = Array.from(document.querySelectorAll('.esencia-select:not([data-participation-attached])'))
      .map((select) => normalizeEssenceValue(select.value));

    const captureFields = (fields) => Object.fromEntries(
      Array.from(fields.querySelectorAll('textarea')).map((field) => [field.className, field.value])
    );
    const restoreFields = (fields, values = {}) => {
      fields.querySelectorAll('textarea').forEach((field) => {
        field.value = values[field.className] || '';
      });
    };

    if (previousAnalysisEssences) {
      document.querySelectorAll('.card-analysis').forEach((card) => {
        const fields = card.querySelector('.analysis-cause-fields');
        const key = card.dataset.analysisLevelKey;
        const previousEssence = previousAnalysisEssences[Number(card.dataset.essenceGroup || 0)];
        if (!fields || !key || !previousEssence) return;
        analysisLevelState[key] ||= {};
        analysisLevelState[key][previousEssence] = captureFields(fields);
      });
    }

    document.querySelectorAll('.card-analysis').forEach((card) => {
      const fields = card.querySelector('.analysis-cause-fields');
      if (!fields) return;

      const groupIndex = Number(card.dataset.essenceGroup || 0);
      const essence = selectedEssences[groupIndex];
      const previousEssence = previousAnalysisEssences?.[groupIndex];
      const levelChanged = Boolean(previousEssence && previousEssence !== essence);
      const savedFields = analysisLevelState[card.dataset.analysisLevelKey]?.[essence];
      if (levelChanged) restoreFields(fields, savedFields);

      const showCauseFields = showCauseEssences.has(essence);
      const setVisibility = (element, visible) => {
        if (!element) return;
        element.hidden = !visible;
        if (visible) element.removeAttribute('hidden');
        else element.setAttribute('hidden', '');
      };

      setVisibility(fields, showCauseFields);
      setVisibility(fields.querySelector('.analysis-cause-definition-field'), showCauseFields);
      setVisibility(fields.querySelector('.analysis-cause-definition-label'), showCauseFields);
      setVisibility(fields.querySelector('.analysis-cause-definition-input'), showCauseFields);
      fields.hidden = !showCauseFields;
    });

    if (selectedEssences.some(Boolean) || previousAnalysisEssences) {
      previousAnalysisEssences = selectedEssences;
    }
  }

  function updateResearchApproachVisibility() {
    const selector = document.querySelector('.enfoque-general-select');
    const approach = selector?.value || '';
    const showVariableApproach = approach === 'mixta';
    const essenceOptions = {
      mixta: [
        ['explora', 'Explorar'],
        ['describir', 'Describir'],
        ['explicar', 'Explicar'],
        ['predecir', 'Predecir'],
        ['evaluar', 'Evaluar'],
        ['verificar', 'Verificar'],
        ['comprender', 'Comprender'],
        ['interpretar', 'Interpretar'],
        ['reflexionar', 'Reflexionar']
      ],
      cuantitativa: [
        ['explora', 'Explorar'],
        ['describir', 'Describir'],
        ['explicar', 'Explicar'],
        ['predecir', 'Predecir'],
        ['evaluar', 'Evaluar'],
        ['verificar', 'Verificar']
      ],
      cualitativa: [
        ['comprender', 'Comprender'],
        ['interpretar', 'Interpretar'],
        ['reflexionar', 'Reflexionar']
      ]
    };
    const generalOptions = essenceOptions[approach] || [];
    const variableApproaches = ['enfoque_vi', 'enfoque_vd1'].map((name) => (
      document.querySelector(`input[name="${name}"]:checked`)?.value || ''
    ));

    document.querySelectorAll('.esencia-select:not([data-participation-attached])').forEach((essenceSelect, index) => {
      const selectedVariableApproach = showVariableApproach
        ? ({ cuantitativo: 'cuantitativa', cualitativo: 'cualitativa' }[variableApproaches[index]] || '')
        : approach;
      const options = showVariableApproach
        ? (essenceOptions[selectedVariableApproach] || [])
        : generalOptions;
      const previousValue = essenceSelect.value;
      essenceSelect.replaceChildren(new Option(
        showVariableApproach && !selectedVariableApproach
          ? 'Especifique enfoque'
          : selectedVariableApproach
            ? 'Seleccione esencia...'
            : 'Botón desplegable esencia',
        '',
        true,
        false
      ));
      options.forEach(([value, label]) => {
        essenceSelect.add(new Option(label, value));
      });
      essenceSelect.value = options.some(([value]) => value === previousValue) ? previousValue : '';
    });
    updateAnalysisCards();

    document.querySelectorAll('.variable-enfoque-box').forEach((box) => {
      box.hidden = !showVariableApproach;
    });
  }

  function initSelectNPI() {
    const selectNPI = document.getElementById("select_asignaturas_npi");
    if (!selectNPI) return;

    if (selectNPI.querySelectorAll("optgroup").length > 0) return;

    for (const [programa, asignaturas] of Object.entries(DATA)) {
      const optGroup = document.createElement("optgroup");
      optGroup.label = programa;

      asignaturas.forEach((asignatura) => {
        const option = document.createElement("option");
        option.value = asignatura;
        option.textContent = asignatura;
        optGroup.appendChild(option);
      });

      selectNPI.appendChild(optGroup);
    }
  }

  function initSelectCodigosAsignatura() {
    const codigos = window.CODIGOS_ASIGNATURAS || [];
    const selects = Array.from(document.querySelectorAll('[id^="codigo_"]'));

    selects.forEach((select) => {
      if (select.dataset.codigosInicializados === "true") return;
      select.dataset.codigosInicializados = "true";
      select.innerHTML = "";

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Seleccionar código...";
      select.appendChild(placeholder);

      codigos.forEach((codigo) => {
        const option = document.createElement("option");
        option.value = codigo;
        option.textContent = codigo;
        select.appendChild(option);
      });
    });
  }

  function initVariableProposito() {
    const selectNPI = document.getElementById("select_asignaturas_npi");
    const variableAlternativa = document.getElementById("variable_proposito_alternativa");
    if (!selectNPI || !variableAlternativa) return;

    const actualizarCampo = () => {
      const esCodigoEstudiantil = Array.from(document.querySelectorAll('[id^="codigo_"]'))
        .some((select) => CODIGOS_ESTUDIANTILES.has(select.value));
      const permitirAlternativa = !esCodigoEstudiantil;
      variableAlternativa.style.display = permitirAlternativa ? "block" : "none";
      variableAlternativa.disabled = !permitirAlternativa;
    };

    const actualizarReplicas = () => {
      const valor = selectNPI.value || variableAlternativa.value;
      document.querySelectorAll(".var-proposito-target").forEach((target) => {
        if (target.classList.contains("def-proposito-origen")
          || target.classList.contains("def-proposito-target")
          || target.closest("#contenedor-planteamiento, #contenedor-justificacion")) return;
        if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
          target.value = valor;
        } else {
          target.textContent = valor;
        }
      });
      console.log("Propósito disciplinar actualizado sin alterar definiciones.");
    };

    document.querySelectorAll('[id^="codigo_"]').forEach((select) => {
      select.addEventListener("change", actualizarCampo);
    });
    selectNPI.addEventListener("change", () => {
      variableAlternativa.value = selectNPI.value;
      actualizarReplicas();
    });
    variableAlternativa.addEventListener("input", () => {
      if (variableAlternativa.value.trim()) selectNPI.value = "";
      actualizarReplicas();
    });
    actualizarCampo();
    actualizarReplicas();
  }

  function validarPropositoDisciplinar() {
    const selectNPI = document.getElementById("select_asignaturas_npi");
    const variableAlternativa = document.getElementById("variable_proposito_alternativa");
    const codigos = Array.from(document.querySelectorAll('[id^="codigo_"]'))
      .map((select) => select.value)
      .filter(Boolean);
    const hayCodigoEstudiantil = codigos.some((codigo) => CODIGOS_ESTUDIANTILES.has(codigo));
    const hayProposito = Boolean(selectNPI?.value.trim() || variableAlternativa?.value.trim());

    if (hayCodigoEstudiantil && !selectNPI?.value.trim()) {
      alert("Para los códigos de asignatura estudiantiles debe seleccionar una asignatura NIP.");
      selectNPI?.focus();
      return false;
    }

    if (!hayCodigoEstudiantil && !hayProposito) {
      alert("Seleccione una asignatura NIP o escriba una variable alternativa.");
      selectNPI?.focus();
      return false;
    }

    return true;
  }

  function fillCodigosAsignatura(selectElement) {
    const codigos = window.CODIGOS_ASIGNATURAS || [];
    const previousValue = selectElement.value;
    selectElement.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Seleccionar código...";
    selectElement.appendChild(placeholder);

    codigos.forEach((codigo) => {
      const option = document.createElement("option");
      option.value = codigo;
      option.textContent = codigo;
      selectElement.appendChild(option);
    });

    if (codigos.includes(previousValue)) {
      selectElement.value = previousValue;
    }
  }

  function initProgramaAsignaturaPorIntegrante() {
    for (let i = 1; i <= TEAM_SIZE; i++) {
      const programaSelect = document.getElementById(`programa_${i}`);
      const codigoSelect = document.getElementById(`codigo_${i}`);

      if (!programaSelect || !codigoSelect) continue;

      programaSelect.addEventListener("change", () => {
        recalculateParticipation();
        renderProjectSummary();
      });

      ["input", "change"].forEach((eventName) => {
        codigoSelect.addEventListener(eventName, () => {
          renderProjectSummary();
        });
      });

      const nombre = document.getElementById(`nombre_${i}`);
      const apellido = document.getElementById(`apellido_${i}`);
      [nombre, apellido].forEach((field) => {
        if (!field) return;
        field.addEventListener("input", () => {
          recalculateParticipation();
          renderProjectSummary();
        });
      });
    }
  }

  function getParticipantDisplayName(index) {
    const nombre = (document.getElementById(`nombre_${index}`)?.value || "").trim();
    const apellido = (document.getElementById(`apellido_${index}`)?.value || "").trim();
    if (nombre || apellido) {
      return `${nombre} ${apellido}`.trim();
    }
    return `Integrante ${index}`;
  }

  function buildAuthorPopup(field) {
    const popup = document.createElement("div");
    popup.className = "participation-author-popup";
    popup.dataset.fieldId = field.id;

    const list = document.createElement("ul");
    list.className = "participation-author-list";
    popup.appendChild(list);

    const renderItems = () => {
      list.innerHTML = "";
      for (let i = 1; i <= TEAM_SIZE; i++) {
        const item = document.createElement("li");
        item.className = "participation-author-item";
        item.dataset.author = `${i}`;
        item.textContent = getParticipantDisplayName(i);
        if (field.dataset.author === `${i}`) item.classList.add("selected");
        item.addEventListener("click", (event) => {
          event.stopPropagation();
          field.dataset.author = item.dataset.author;
          updateParticipationFieldLabel(field);
          recalculateParticipation();
          markFileDirty();
          saveFormState();
          renderProjectSummary();
          popup.classList.remove("visible");
        });
        list.appendChild(item);
      }
    };

    renderItems();
    popup.addEventListener("click", (event) => event.stopPropagation());
    return popup;
  }

  function refreshAuthorPopup(popup) {
    const field = document.getElementById(popup.dataset.fieldId);
    if (!field) return;
    popup.querySelectorAll(".participation-author-item").forEach((item) => {
      const index = Number(item.dataset.author);
      item.textContent = getParticipantDisplayName(index);
      item.classList.toggle("selected", field.dataset.author === item.dataset.author);
    });
  }

  function closeAuthorPopups() {
    document.querySelectorAll(".participation-author-popup.visible").forEach((popup) => {
      popup.classList.remove("visible");
    });
  }

  function isParticipationField(el) {
    if (!el || el.readOnly || el.disabled) return false;
    if (!el.classList.contains('input-red')) return false;
    if (el.closest('.team-dashboard-container')) return false;
    if (el.classList.contains('input-black-replica')) return false;
    if (el.classList.contains('select-dashboard-red')) return false;
    const id = el.id || '';
    if (['var_objeto_origen', 'var_audiencia_origen'].includes(id)) return false;
    if (/^(nombre_|apellido_|programa_|codigo_|part_)/.test(id)) return false;
    return true;
  }

  function setupParticipationTracking() {
    let counter = 1;

    function attachParticipationButton(field) {
      if (!isParticipationField(field)) return;
      if (field.dataset.participationAttached) return;
      field.dataset.participationAttached = 'true';

      if (!field.id) {
        field.id = `participation_field_${counter++}`;
      }

      const row = field.closest('.q-item-row');
      const container = row || field.parentNode;
      container.classList.add('participation-author-container');

      let button = container.querySelector('.participation-author-button');
      let popup = container.querySelector('.participation-author-popup');

      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'participation-author-button';
        button.textContent = '+';

        const cardHeader = field.closest('.card-item-dinamico')?.querySelector('.card-header-actions');
        if (cardHeader) {
          const removeBtn = cardHeader.querySelector('.btn-remove-card');
          cardHeader.insertBefore(button, removeBtn || null);
        } else if (row) {
          row.appendChild(button);
        } else {
          if (field.nextSibling) container.insertBefore(button, field.nextSibling);
          else container.appendChild(button);
        }

        popup = buildAuthorPopup(field);
        if (cardHeader) {
          container.appendChild(popup);
        } else if (button.nextSibling) {
          container.insertBefore(popup, button.nextSibling);
        } else {
          container.appendChild(popup);
        }

        button.addEventListener('click', (event) => {
          event.stopPropagation();
          refreshAuthorPopup(popup);
          closeAuthorPopups();
          popup.classList.toggle('visible');
        });
      }

      updateParticipationFieldLabel(field, button);

      field.addEventListener('input', () => {
        handleParticipationFieldUpdate(field);
      });
      field.addEventListener('change', () => {
        handleParticipationFieldUpdate(field);
      });
    }

    document.addEventListener('click', closeAuthorPopups);

    const initialFields = Array.from(document.querySelectorAll('.input-red'));
    initialFields.forEach(attachParticipationButton);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches && node.matches('.input-red')) {
            attachParticipationButton(node);
          }
          node.querySelectorAll && node.querySelectorAll('.input-red').forEach(attachParticipationButton);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function handleParticipationFieldUpdate(field) {
    const value = (field.value || "").trim();
    if (!value) {
      delete field.dataset.author;
    }
    updateParticipationFieldLabel(field);
    recalculateParticipation();
    markFileDirty();
    renderProjectSummary();
  }

  function updateParticipationFieldLabel(field, button) {
    const container = field.closest(".q-item-row") || field.parentNode;
    button = button || container?.querySelector(".participation-author-button");
    if (!button) return;
    const authorIndex = field.dataset.author;
    const value = (field.value || "").trim();
    if (authorIndex) {
      button.title = `Diligenciado por: ${getParticipantDisplayName(authorIndex)} — click para cambiar`;
    } else if (value) {
      button.title = "Haga clic para seleccionar quién diligenció";
    } else {
      button.title = "Haga clic para asignar autor";
    }
  }

  function fillAsignaturasByPrograma(selectElement, programa) {
    const previousValue = selectElement.value;
    const asignaturas = DATA[programa] || [];

    selectElement.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Seleccionar asignatura...";
    selectElement.appendChild(placeholder);

    asignaturas.forEach((asignatura) => {
      const option = document.createElement("option");
      option.value = asignatura;
      option.textContent = asignatura;
      selectElement.appendChild(option);
    });

    if (asignaturas.includes(previousValue)) {
      selectElement.value = previousValue;
    }
  }

  function recalculateParticipation() {
    const participationFields = Array.from(document.querySelectorAll('.input-red')).filter((el) => {
      if (!el || el.readOnly || el.disabled) return false;
      if (el.closest('.team-dashboard-container')) return false;
      if (el.classList.contains('input-black-replica')) return false;
      if (el.classList.contains('select-dashboard-red')) return false;
      const id = el.id || '';
      if (['var_objeto_origen', 'var_audiencia_origen'].includes(id)) return false;
      if (/^(nombre_|apellido_|programa_|codigo_|part_)/.test(id)) return false;
      return true;
    });
    const counts = { total: 0, byIndex: {} };
    for (let i = 1; i <= TEAM_SIZE; i++) counts.byIndex[i] = 0;

    participationFields.forEach((field) => {
      const value = (field.value || '').trim();
      const author = field.dataset.author;
      if (!value || !author) return;
      const index = Number(author);
      if (!Number.isInteger(index) || index < 1 || index > TEAM_SIZE) return;
      counts.total += 1;
      counts.byIndex[index] += 1;
    });

    if (counts.total > 0) {
      for (let i = 1; i <= TEAM_SIZE; i++) {
        const part = document.getElementById(`part_${i}`);
        if (!part) continue;
        const percentage = counts.byIndex[i] > 0 ? ((counts.byIndex[i] / counts.total) * 100).toFixed(1) : "0.0";
        part.value = `${percentage}%`;
      }
      return;
    }

    const integrantesActivos = [];
    for (let i = 1; i <= TEAM_SIZE; i++) {
      const nombre = (document.getElementById(`nombre_${i}`)?.value || "").trim();
      const apellido = (document.getElementById(`apellido_${i}`)?.value || "").trim();
      if (nombre || apellido) integrantesActivos.push(i);
    }

    const porcentaje = integrantesActivos.length > 0
      ? (100 / integrantesActivos.length).toFixed(2)
      : "0.00";

    for (let i = 1; i <= TEAM_SIZE; i++) {
      const part = document.getElementById(`part_${i}`);
      if (!part) continue;
      part.value = integrantesActivos.includes(i) ? `${porcentaje}%` : "0%";
    }
  }

  function getProjectShareLink() {
    const shareUrl = new URL(APP_URL);
    shareUrl.searchParams.set('project', currentProjectId);
    return shareUrl.href;
  }

  async function requestProjectAccess() {
    const user = firebaseAuth?.currentUser || currentUser;
    const email = normalizeEmail(user?.email);
    if (!isInstitutionalEmail(email)) {
      showToast('Inicia sesión con tu correo institucional para solicitar acceso');
      return;
    }
    try {
      const requestRef = firebaseDb.ref(`projects/${currentProjectId}/requests/${getEmailDatabaseKey(email)}`);
      await requestRef.set({
        email,
        displayName: String(user.displayName || ''),
        status: 'pendiente',
        requestedAt: Date.now()
      });
      showToast('Solicitud de acceso enviada al líder del proyecto');
    } catch (error) {
      console.error('No se pudo enviar la solicitud de acceso:', error);
      showToast('No se pudo enviar la solicitud de acceso');
    }
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function renderShareCollaboratorsList() {
    const list = document.getElementById('share-collaborators-list');
    const requestPanel = document.getElementById('access-requests-panel');
    const requestsList = document.getElementById('access-requests-list');
    if (!list) return;

    const firebase = ensureFirebase();
    if (!firebase || !firebaseDb) {
      list.innerHTML = '<li><span>No hay conexión a Firebase.</span></li>';
      return;
    }

    if (list.dataset.permissionHandlersAttached !== 'true') {
      list.dataset.permissionHandlersAttached = 'true';
      list.addEventListener('change', async (event) => {
        const selector = event.target.closest('[data-member-role]');
        if (!selector) return;
        try {
          const projectSnapshot = await firebaseDb.ref(`projects/${currentProjectId}`).once('value');
          const project = projectSnapshot.val() || {};
          if (!isCurrentUserProjectOwner(project)) {
            showToast('Solo el propietario puede cambiar permisos');
            return;
          }
          const email = normalizeEmail(selector.dataset.memberRole);
          const projectOwnerEmail = normalizeEmail(project.ownerEmail || project.config?.authorEmail);
          const projectFacilitatorEmail = getProjectFacilitatorEmail(project);
          const targetMember = normalizeProjectMembers(project.members)[getEmailDatabaseKey(email)];
          if (!targetMember || targetMember.role === 'propietario'
            || email === projectOwnerEmail || email === projectFacilitatorEmail) {
            showToast('No se pueden cambiar los permisos del propietario o facilitador');
            return;
          }
          await updateProjectMember(email, (member) => ({
            ...member,
            role: selector.value === 'lector' ? 'lector' : 'editor'
          }));
        } catch (error) {
          console.error('No se pudo cambiar el rol del integrante:', error);
          showToast('No se pudo actualizar el permiso del integrante');
        }
      });
      list.addEventListener('click', async (event) => {
        const removeButton = event.target.closest('[data-remove-member]');
        if (!removeButton) return;
        const email = normalizeEmail(removeButton.dataset.removeMember);
        try {
          const projectSnapshot = await firebaseDb.ref(`projects/${currentProjectId}`).once('value');
          const project = projectSnapshot.val() || {};
          if (!isCurrentUserProjectOwner(project)) {
            showToast('Solo el propietario puede eliminar integrantes');
            return;
          }
          const projectOwnerEmail = normalizeEmail(project.ownerEmail || project.config?.authorEmail);
          const projectFacilitatorEmail = getProjectFacilitatorEmail(project);
          const targetMember = normalizeProjectMembers(project.members)[getEmailDatabaseKey(email)];
          if (!targetMember || targetMember.role === 'propietario'
            || email === projectOwnerEmail || email === projectFacilitatorEmail) {
            showToast('No se puede eliminar al propietario o facilitador');
            return;
          }
          if (!window.confirm(`¿Eliminar a ${email} del proyecto?`)) return;
          await updateProjectMember(email, () => null);
          showToast('Integrante eliminado del proyecto');
        } catch (error) {
          console.error('No se pudo eliminar al integrante:', error);
          showToast('No se pudo eliminar al integrante');
        }
      });
    }

    if (firebaseMembersRef) firebaseMembersRef.off('value');
    const listeningProjectId = currentProjectId;
    firebaseMembersRef = firebaseDb.ref(`projects/${listeningProjectId}/members`);
    const listeningMembersRef = firebaseMembersRef;
    listeningMembersRef.on('value', (snapshot) => {
      const members = snapshot.val() || {};
      firebaseDb.ref(`projects/${listeningProjectId}`).once('value')
        .then(async (projectSnapshot) => {
          if (listeningProjectId !== currentProjectId || firebaseMembersRef !== listeningMembersRef) return;
          const project = projectSnapshot.val() || {};
          let ownerEmail = getProjectOwnerEmail(project);
          const normalizedMembers = normalizeProjectMembers(project.members || members);
          const currentEmail = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
          if (!ownerEmail && currentEmail && !Object.keys(normalizedMembers).length) {
            ownerEmail = currentEmail;
          }
          if (ownerEmail && ownerEmail === currentEmail && !project.ownerEmail) {
            firebaseDb.ref(`projects/${listeningProjectId}`).update({ ownerEmail })
              .then(() => ensureProtectedProjectMembers(ownerEmail, getProjectFacilitatorEmail(project)))
              .catch((error) => {
                console.error('No se pudo registrar al propietario del proyecto:', error);
                showToast('No se pudo registrar el propietario del proyecto');
              });
          }
          const memberMap = new Map(Object.values(normalizedMembers).map((member) => [
            member.email,
            {
              email: member.email,
              role: String(member.role || 'editor').toLowerCase(),
              photoURL: String(member.photoURL || '')
            }
          ]));
          const rosterMembers = [
            ...(Array.isArray(project.teamMembers) ? project.teamMembers : []),
            ...Array.from({ length: 5 }, (_, index) => ({
              email: project.fields?.[`correo_integrante_${index + 1}`]
            })),
            ...Object.values(project.rosterMemberEmails || {}).map((email) => ({ email }))
          ];
          rosterMembers.forEach((member) => {
            const email = normalizeEmail(typeof member === 'string' ? member : member?.email);
            if (!isInstitutionalEmail(email)) return;
            const existingMember = memberMap.get(email) || {};
            memberMap.set(email, {
              ...existingMember,
              email,
              role: existingMember.role || 'editor',
              photoURL: existingMember.photoURL || ''
            });
          });

          const facilitatorEmail = getProjectFacilitatorEmail(project);
          if (isInstitutionalEmail(facilitatorEmail)) {
            const existingFacilitator = memberMap.get(facilitatorEmail) || {};
            memberMap.set(facilitatorEmail, {
              ...existingFacilitator,
              email: facilitatorEmail,
              role: 'editor',
              photoURL: existingFacilitator.photoURL || ''
            });
          }

          if (ownerEmail) {
            const existingOwner = memberMap.get(ownerEmail) || {};
            memberMap.set(ownerEmail, {
              ...existingOwner,
              email: ownerEmail,
              role: 'propietario',
              photoURL: existingOwner.photoURL || ''
            });
          }
          if (currentEmail && (currentEmail === ownerEmail || normalizedMembers[getEmailDatabaseKey(currentEmail)])) {
            syncAuthenticatedMemberPhoto(currentUser);
          }
          const isOwner = isCurrentUserProjectOwner({ ...project, ownerEmail, members: normalizedMembers });
          const protectedAccessNeedsSync = [ownerEmail, facilitatorEmail].some((email) => {
            if (!isInstitutionalEmail(email)) return false;
            const member = normalizedMembers[getEmailDatabaseKey(email)];
            return !member || member.role !== 'editor';
          });
          if (isOwner && protectedAccessNeedsSync) {
            await ensureProtectedProjectMembers(ownerEmail, facilitatorEmail);
          }
          document.querySelectorAll('#modal-compartir [data-owner-only]').forEach((control) => {
            control.disabled = !isOwner;
          });
          const orderedMembers = [...memberMap.values()].sort((first, second) => {
            if (first.email === ownerEmail) return -1;
            if (second.email === ownerEmail) return 1;
            if (first.email === facilitatorEmail) return -1;
            if (second.email === facilitatorEmail) return 1;
            return first.email.localeCompare(second.email);
          });
          if (!orderedMembers.length) {
            list.innerHTML = '<li><span>No hay miembros agregados.</span></li>';
            return;
          }
          list.innerHTML = orderedMembers.map((member) => {
            const photoURL = /^https:\/\//i.test(member.photoURL) ? member.photoURL : '';
            const isProjectOwnerMember = member.email === ownerEmail || member.role === 'propietario';
            const isProjectFacilitatorMember = member.email === facilitatorEmail;
            const roleLabel = isProjectOwnerMember
              ? 'Propietario'
              : isProjectFacilitatorMember
                ? 'Editor'
                : member.role === 'lector'
                  ? 'Lector'
                  : 'Editor';
            const controls = isOwner && !isProjectOwnerMember
              && !isProjectFacilitatorMember && member.email !== currentEmail
              ? `<div class="member-permission-controls">
                  <select data-member-role="${escapeHtml(member.email)}" aria-label="Permiso de ${escapeHtml(member.email)}">
                    <option value="editor" ${member.role === 'lector' ? '' : 'selected'}>Editor</option>
                    <option value="lector" ${member.role === 'lector' ? 'selected' : ''}>Lector</option>
                  </select>
                  <button type="button" class="member-remove-btn" data-remove-member="${escapeHtml(member.email)}" aria-label="Eliminar ${escapeHtml(member.email)}" title="Eliminar integrante">🗑️</button>
                </div>`
              : `<span class="member-role-label">${roleLabel}</span>`;
            return `
              <li class="share-member-item">
                <div class="share-member-identity">
                  <span class="user-avatar-wrap" aria-hidden="true">
                    <span class="user-avatar-initial" ${photoURL ? 'hidden' : ''}>${escapeHtml(member.email.charAt(0).toUpperCase())}</span>
                    ${photoURL ? `<img class="user-avatar-sm" src="${escapeHtml(photoURL)}" alt="" data-avatar-photo>` : ''}
                  </span>
                  <span class="share-member-email">${escapeHtml(member.email)}</span>
                </div>
                ${controls}
              </li>
            `;
          }).join('');
          list.querySelectorAll('[data-avatar-photo]').forEach((image) => {
            image.addEventListener('error', () => {
              image.hidden = true;
              image.parentElement.querySelector('.user-avatar-initial').hidden = false;
            }, { once: true });
          });
        })
        .catch((error) => {
          console.error('No se pudo leer el propietario del proyecto:', error);
          showToast('No se pudo cargar la lista de acceso del proyecto');
        });
    }, (error) => {
      console.error('No se pudo escuchar la lista de integrantes:', error);
      showToast('No se pudo cargar la lista de integrantes');
    });

    if (!requestPanel || !requestsList) return;
    if (!isProjectLeader) {
      requestPanel.classList.add('hidden');
      return;
    }

    requestPanel.classList.remove('hidden');
    configureRealtimeRequests();
  }

  function openShareProjectModal() {
    const modal = document.getElementById('modal-compartir');
    if (!modal) return;
    modal.classList.remove('hidden');
    renderShareCollaboratorsList();
  }

  async function openProjectHistoryModal() {
  const modal = document.getElementById('modalHistorial');
  const list = document.getElementById('listaHistorial');
  if (!modal || !list) return;
  modal.classList.remove('hidden');
  list.innerHTML = '<li><span>Cargando historial...</span></li>';

  try {
    const snapshot = await firebaseDb.ref(`projects/${currentProjectId}/history`).once('value');
    const entries = Object.values(snapshot.val() || {})
      .filter((entry) => entry && typeof entry === 'object')
      .sort((first, second) => Number(second.timestamp || 0) - Number(first.timestamp || 0));

    if (!entries.length) {
      list.innerHTML = '<li><span>No hay cambios guardados en el historial.</span></li>';
      return;
    }

    list.innerHTML = entries.map((entry) => {
      const timestamp = Number(entry.timestamp);
      const date = Number.isFinite(timestamp) && timestamp > 0
        ? new Date(timestamp).toLocaleString('es-CO')
        : String(entry.fecha || '');
      
      const addedText = escapeHtml(entry.addedText || '');
      
      // Obtenemos el identificador general del campo. Si está vacío, indicará PENDIENTE para su ajuste futuro.
      let rawFieldId = (entry.fieldId || '').trim();
      if (!rawFieldId || rawFieldId === 'general') {
        // Intenta buscar si el cambio traía una clave específica registrada
        rawFieldId = entry.cambios?.[0]?.clave || 'PENDIENTE_ASIGNAR_ID';
      }
      const fieldId = escapeHtml(rawFieldId);

      const description = escapeHtml(entry.changeDescription || 'Actualización del proyecto');
      const userName = escapeHtml(entry.userName || entry.userEmail || 'Usuario');
      const userEmail = escapeHtml(entry.userEmail || '');
      const cambios = entry.cambios || entry.cambiosCuadriculas || [];

      const detalleCambiosHtml = cambios.length > 0
        ? `<ul style="margin-top: 6px; padding-left: 15px; font-size: 0.85em; color: #334155;">
            ${cambios.map(c => `
              <li>
                <span style="background: #e2e8f0; font-weight: bold; padding: 1px 4px; border-radius: 3px; color: #1e293b;">
                  [${escapeHtml(c.clave || c.fieldId || 'PENDIENTE_ID')}]
                </span> 
                <strong>${escapeHtml(c.etiqueta || '')}:</strong> 
                <span style="color: #64748b; text-decoration: line-through;">"${escapeHtml(String(c.valorAnterior || ''))}"</span> ➔ 
                <span style="color: #16a34a; font-weight: 500;">"${escapeHtml(String(c.valorNuevo || ''))}"</span>
              </li>
            `).join('')}
          </ul>`
        : '';

      return `
        <li class="history-entry" style="padding: 14px 0; border-bottom: 1px solid #cbd5e1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
            
            <!-- Columna Izquierda -->
            <div style="flex: 1; min-width: 0;">
              ${addedText ? `<div style="font-weight: bold; color: #0f172a; margin-bottom: 4px; font-size: 0.95em;">${addedText}</div>` : ''}
              
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px;">
                <span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 0.75em; font-weight: 600; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                  <i class="fa-solid fa-code"></i> ID Campo: ${fieldId}
                </span>
              </div>

              <div style="font-size: 0.9em; color: #2563eb; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-pen-to-square"></i> <span>${description}</span>
              </div>
            </div>

            <!-- Columna Derecha -->
            <div style="text-align: right; flex-shrink: 0;">
              <small style="color: #64748b; font-size: 0.8em; display: block; margin-bottom: 4px;">${date}</small>
              <div style="font-size: 0.85em; color: #475569; display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                <i class="fa-solid fa-user" style="color: #2563eb;"></i> 
                <span style="font-weight: 600; color: #2563eb;">${userName}</span> 
                <span style="color: #64748b;">&lt;${userEmail}&gt;</span>
              </div>
            </div>

          </div>
          ${detalleCambiosHtml}
        </li>
      `;
    }).join('');
  } catch (error) {
    console.error('No se pudo cargar el historial del proyecto:', error);
    list.innerHTML = '<li><span>No se pudo cargar el historial de cambios.</span></li>';
    showToast('No se pudo cargar el historial de cambios');
  }
}

  function closeShareProjectModal() {
    const modal = document.getElementById('modal-compartir');
    if (modal) modal.classList.add('hidden');
    if (firebaseMembersRef) {
      firebaseMembersRef.off('value');
      firebaseMembersRef = null;
    }
    if (firebaseRequestsRef) {
      firebaseRequestsRef.off('value');
      firebaseRequestsRef = null;
    }
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.setAttribute('readonly', '');
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      return document.execCommand('copy');
    } catch (error) {
      console.warn('No se pudo copiar el enlace con el método alternativo:', error);
      return false;
    } finally {
      tempInput.remove();
    }
  }

  async function copiarEnlaceProyecto() {
    const link = getProjectShareLink();
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(link);
        return true;
      } catch (error) {
        console.warn('No se pudo copiar con Clipboard API:', error);
      }
    }
    return fallbackCopyText(link);
  }

  async function enviarInvitacionColaborador() {
    const shareEmailInput = document.getElementById('share-email');
    const shareRoleSelect = document.getElementById('share-role');
    const email = normalizeEmail(shareEmailInput?.value);
    const role = shareRoleSelect?.value || 'Integrante';
    const firebase = ensureFirebase();

    if (!/^[^\s@]+@cun\.edu\.co$/.test(email)) {
      showToast('Ingresa un correo institucional válido terminado en @cun.edu.co');
      return;
    }

    if (!firebase || !firebaseDb) {
      showToast('Firebase no está disponible para guardar colaboradores');
      return;
    }
    if (!(firebaseAuth?.currentUser?.email || currentUser?.email)) {
      showToast('Inicia sesión para agregar miembros al proyecto');
      return;
    }
    try {
      const projectSnapshot = await firebaseDb.ref(`projects/${currentProjectId}`).once('value');
      const project = projectSnapshot.val() || {};
      let ownerEmail = getProjectOwnerEmail(project);
      const sessionEmail = normalizeEmail(firebaseAuth?.currentUser?.email || currentUser?.email);
      if (!ownerEmail && projectSnapshot.exists()) ownerEmail = sessionEmail;
      if (ownerEmail !== sessionEmail && !isCurrentUserProjectOwner(project)) {
        showToast('Solo el propietario puede agregar colaboradores');
        return;
      }
      if (!project.ownerEmail && ownerEmail) {
        await firebaseDb.ref(`projects/${currentProjectId}`).update({ ownerEmail });
      }
      if (ownerEmail) await ensureProtectedProjectMembers(ownerEmail, getProjectFacilitatorEmail(project));
      await addProjectMember(email, role);
      console.log("Colaborador agregado correctamente");
      if (!await copiarEnlaceProyecto()) {
        showToast('Correo añadido, pero no se pudo copiar el enlace');
        return;
      }

      if (shareEmailInput) shareEmailInput.value = '';
      showToast('Correo añadido y enlace copiado al portapapeles');
      renderShareCollaboratorsList();
    } catch (error) {
      console.error('No se pudo agregar el miembro al proyecto:', error);
      showToast(String(error?.code || '').toLowerCase().includes('permission')
        ? 'No tienes permisos para agregar colaboradores'
        : error.message || 'No se pudo agregar al miembro. Inténtalo de nuevo.');
    }
  }

  async function decideAccessRequest(email, decision) {
    if (!isProjectLeader || !email) {
      showToast('Solo el líder del proyecto puede gestionar solicitudes');
      return;
    }
    try {
      const requestKey = getEmailDatabaseKey(email);
      const requestRef = firebaseDb.ref(`projects/${currentProjectId}/requests/${requestKey}`);
      const requestSnapshot = await requestRef.once('value');
      const request = requestSnapshot.val();
      if (!request || !['pendiente', 'pending'].includes(String(request.status || '').toLowerCase())) {
        showToast('La solicitud ya no está pendiente');
        return;
      }

      if (decision === 'approve') {
        const emailToApprove = normalizeEmail(request.email || email);
        await addProjectMember(emailToApprove);
        await requestRef.update({
          status: 'aprobada',
          decidedAt: Date.now(),
          decidedBy: normalizeEmail(currentUser?.email)
        });
        showToast('Miembro aprobado');
      } else {
        await requestRef.update({
          status: 'rechazada',
          decidedAt: Date.now(),
          decidedBy: normalizeEmail(currentUser?.email)
        });
        showToast('Solicitud rechazada');
      }
    } catch (error) {
      console.error('No se pudo gestionar la solicitud de acceso:', error);
      showToast('No se pudo actualizar la solicitud');
    }
  }

  function initTopActions() {
    const appHeader = document.getElementById('app-header');
    const collapseHeaderButton = document.getElementById('btnToggleMenu');
    const moreToolsButton = document.getElementById('btnMoreTools');
    const moreToolsDropdown = document.getElementById('more-tools-dropdown');
    const profileButton = document.getElementById('btnAuth');
    const profileMenu = document.getElementById('user-profile-menu');
    const signOutButton = document.getElementById('btnSignOut');
    const historyButton = document.getElementById('btn-historial');
    const historyModal = document.getElementById('modalHistorial');
    const driveFolderButton = document.getElementById('btn-carpeta_seguimiento');
    const evidenceModalButton = document.getElementById('btn-carpeta-evidencias');
    const evidenceModal = document.getElementById('modalEvidencias');
    const closeEvidenceButton = document.getElementById('btnCloseEvidencias');
    const addEvidenceButton = document.getElementById('btnGuardarEvidencia');

    collapseHeaderButton?.addEventListener('click', () => {
      const collapsed = appHeader?.classList.toggle('is-collapsed') || false;
      collapseHeaderButton.setAttribute('aria-expanded', String(!collapsed));
      collapseHeaderButton.setAttribute('aria-label', collapsed ? 'Desplegar barra superior' : 'Contraer barra superior');
      collapseHeaderButton.title = collapsed ? 'Desplegar barra superior' : 'Contraer barra superior';
      collapseHeaderButton.innerHTML = `<i class="fa-solid fa-chevron-${collapsed ? 'down' : 'up'}"></i>`;
    });

    moreToolsButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      const expanded = moreToolsButton.getAttribute('aria-expanded') === 'true';
      moreToolsButton.setAttribute('aria-expanded', String(!expanded));
      moreToolsDropdown?.classList.toggle('is-open', !expanded);
    });

    profileButton?.addEventListener('click', (event) => {
      if (!currentUser) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const expanded = profileButton.getAttribute('aria-expanded') === 'true';
      profileButton.setAttribute('aria-expanded', String(!expanded));
      if (profileMenu) profileMenu.hidden = expanded;
    }, true);

    signOutButton?.addEventListener('click', () => window.cerrarSesionGoogle());
    if (historyButton && historyButton.dataset.handlerAttached !== 'true') {
      historyButton.dataset.handlerAttached = 'true';
      historyButton.addEventListener('click', openProjectHistoryModal);
    }
    historyModal?.querySelector('[data-close-history-modal]')?.addEventListener('click', () => {
      historyModal.classList.add('hidden');
    });
    historyModal?.addEventListener('click', (event) => {
      if (event.target === historyModal) historyModal.classList.add('hidden');
    });
    driveFolderButton && (driveFolderButton.onclick = (event) => {
      event.preventDefault();
      const cfg = loadStoredConfig();
      const folderUrl = [cfg.saveFolder, cfg.folderUrl]
        .find((candidate) => isValidEvidenceFolderUrl(candidate)) || '';
      if (folderUrl) {
        window.open(folderUrl.trim(), '_blank', 'noopener,noreferrer');
        showToast('Abriendo carpeta de evidencias en Google Drive');
      } else {
        showConfigRequiredModal('La carpeta de evidencias no está configurada o no es un enlace válido de Google Drive. Abre la configuración para asignarla.');
      }
    });
    evidenceModalButton?.addEventListener('click', () => {
      renderEvidenceList(lastRealtimeProject?.evidences || {});
      evidenceModal?.classList.remove('hidden');
      document.getElementById('evidenciaTitulo')?.focus();
    });
    closeEvidenceButton?.addEventListener('click', () => {
      evidenceModal?.classList.add('hidden');
    });
    evidenceModal?.addEventListener('click', (event) => {
      if (event.target === evidenceModal) evidenceModal.classList.add('hidden');
    });
    addEvidenceButton?.addEventListener('click', addProjectEvidence);
    renderEvidenceList(lastRealtimeProject?.evidences || {});

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.more-tools-wrap')) {
        moreToolsButton?.setAttribute('aria-expanded', 'false');
        moreToolsDropdown?.classList.remove('is-open');
      }
      if (!event.target.closest('.user-profile')) {
        profileButton?.setAttribute('aria-expanded', 'false');
        if (profileMenu) profileMenu.hidden = true;
      }
    });

    const btnSaveAs = document.getElementById("btn-save-as");
    const btnSaveProject = document.getElementById("btn-save-project");
    const btnCompartir = document.getElementById("btn-compartir");
    const btnExcel = document.getElementById("btn-excel");
    const btnWord = document.getElementById("btn-word");
    const btnConfig = document.getElementById("btn-config");
    const btnOpen = document.getElementById("btn-open");
    const btnNewProject = document.getElementById("btn-new-project");
    const btnUndo = document.getElementById("btn-undo");
    const btnRedo = document.getElementById("btn-redo");
    const btnCopy = document.getElementById("btn-copy");
    const btnPaste = document.getElementById("btn-paste");
    const btnToggleSummary = document.getElementById("btn-toggle-summary");
    const fileNameInput = document.getElementById("file-name-input");
    const fileOpenInput = document.getElementById("file-open-input");

    const btnAgregarColaborador = document.getElementById('btn-agregar-colaborador');
    const btnCopiarEnlace = document.getElementById('btn-copiar-enlace');
    const shareEmailInput = document.getElementById('share-email');
    const shareRoleSelect = document.getElementById('share-role');
    const closeShareButton = document.querySelector('[data-close-share-modal]');
    const accessNotifications = document.getElementById('project-access-notifications');
    document.querySelectorAll('.input-correo-integrante, #correo_facilitador').forEach((input) => {
      if (input.dataset.memberEmailHandlerAttached === 'true') return;
      input.dataset.memberEmailHandlerAttached = 'true';
      input.addEventListener('input', (event) => {
        window.clearTimeout(teamMemberAccessSyncTimer);
        teamMemberAccessSyncTimer = window.setTimeout(() => syncChangedTeamMemberEmail(event), 300);
      });
      input.addEventListener('change', (event) => {
        window.clearTimeout(teamMemberAccessSyncTimer);
        syncChangedTeamMemberEmail(event);
      });
    });

    if (btnCompartir) {
      btnCompartir.addEventListener('click', openShareProjectModal);
    }

    accessNotifications?.addEventListener('click', openShareProjectModal);
    document.getElementById('access-requests-list')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-access-request]');
      if (!button) return;
      decideAccessRequest(button.dataset.email, button.dataset.accessRequest);
    });

    if (closeShareButton) {
      closeShareButton.addEventListener('click', closeShareProjectModal);
    }

    if (document.getElementById('modal-compartir')) {
      document.getElementById('modal-compartir').addEventListener('click', (event) => {
        if (event.target && event.target.id === 'modal-compartir') {
          closeShareProjectModal();
        }
      });
    }

    if (btnAgregarColaborador && btnAgregarColaborador.dataset.handlerAttached !== 'true') {
      btnAgregarColaborador.dataset.handlerAttached = 'true';
      btnAgregarColaborador.addEventListener('click', enviarInvitacionColaborador);
    }

    if (btnCopiarEnlace) {
      btnCopiarEnlace.addEventListener('click', copiarEnlaceProyecto);
    }

    const normalizeFileName = (name) => {
      const trimmed = (name || "").replace(/^\*\s*/, "").trim();
      if (!trimmed) {
        return `si_ora_proyecto_${new Date().toISOString().slice(0, 10)}.siora.html`;
      }

      const lower = trimmed.toLowerCase();
      if (lower.endsWith(".siora.html")) {
        return trimmed;
      }

      if (lower.endsWith(".html") || lower.endsWith(".htm")) {
        return trimmed.replace(/\.html?$/i, ".siora.html");
      }

      if (lower.endsWith(".siora.json") || lower.endsWith(".json")) {
        return `${trimmed.slice(0, trimmed.lastIndexOf('.'))}.siora.html`;
      }

      return `${trimmed}.siora.html`;
    };

    const getFileName = () => normalizeFileName(fileNameInput?.value || "");

    const hayInformacionEnProyecto = () => {
      const campos = Array.from(document.querySelectorAll("input, textarea, select"));
      return campos.some((campo) => {
        if (campo.readOnly || campo.disabled || campo.id === "file-name-input") return false;
        if (campo.classList.contains("select-card-type")) return false;
        if (campo.type === "checkbox") return campo.checked;
        return String(campo.value || "").trim() !== "";
      });
    };

    if (fileNameInput) {
      fileNameInput.readOnly = true;
      syncFileNameDisplay();
    }

    const requestSavePermission = (fileName) => new Promise((resolve) => {
      const existingModal = document.getElementById("save-permission-modal");
      if (existingModal) existingModal.remove();

      const modal = document.createElement("div");
      modal.id = "save-permission-modal";
      modal.className = "ora-modal-backdrop";
      modal.innerHTML = `
        <div class="ora-modal" role="dialog" aria-modal="true" aria-labelledby="save-permission-title">
          <h3 id="save-permission-title">Permitir guardar cambios</h3>
          <p>Se guardará el documento <strong class="save-permission-name"></strong> con la información actual.</p>
          <div class="ora-modal-actions">
            <button type="button" class="ora-modal-cancel">Cancelar</button>
            <button type="button" class="ora-modal-confirm">Guardar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector(".save-permission-name").textContent = fileName;

      const finish = (allowed) => {
        modal.remove();
        resolve(allowed);
      };

      modal.querySelector(".ora-modal-cancel").addEventListener("click", () => finish(false));
      modal.querySelector(".ora-modal-confirm").addEventListener("click", () => finish(true));
      modal.addEventListener("click", (event) => {
        if (event.target === modal) finish(false);
      });
    });

    const getProjectContent = () => {
      if (!validarPropositoDisciplinar()) return null;
      saveFormState();
      renderProjectSummary();
      return buildProjectHtml(collectProjectPayload());
    };

    const guardarProyectoUnificado = async () => {
      const localConfig = loadStoredConfig();
      const localProjectTitle = String(currentDocumentName || localConfig.projectName || '').trim();
      if (!localProjectTitle) {
        saveFormState();
        openConfigModal(true);
        return false;
      }

      const firebase = ensureFirebase();
      if (!firebase || !firebaseDb) {
        showToast("No hay conexión con Firebase para guardar el proyecto");
        return false;
      }

      try {
        saveFormState();
        const projectRef = firebaseDb.ref(`projects/${currentProjectId}`);
        const existingSnapshot = await projectRef.once('value');
        const existingProject = existingSnapshot.val() || {};
        const firebaseProjectTitle = String(
          existingProject.projectName || existingProject.config?.projectName || existingProject.name || ''
        ).trim();
        if (!firebaseProjectTitle) {
          const config = {
            ...localConfig,
            ...(existingProject.config || {}),
            projectName: existingProject.projectName || existingProject.config?.projectName || existingProject.name || localProjectTitle,
            authorEmail: existingProject.ownerEmail || existingProject.config?.authorEmail || localConfig.authorEmail || currentUser?.email || '',
            saveFolder: existingProject.localPath || existingProject.config?.saveFolder || localConfig.saveFolder || '',
            wordUrl: existingProject.wordUrl || existingProject.config?.wordUrl || localConfig.wordUrl || '',
            excelUrl: existingProject.excelUrl || existingProject.config?.excelUrl || localConfig.excelUrl || ''
          };
          saveStoredConfig(config);
          openConfigModal(true);
          return false;
        }
        const config = {
          ...localConfig,
          ...(existingProject.config || {}),
          projectName: firebaseProjectTitle,
          authorEmail: existingProject.ownerEmail || existingProject.config?.authorEmail || localConfig.authorEmail || currentUser?.email || '',
          saveFolder: existingProject.localPath
            || existingProject.config?.saveFolder
            || localConfig.saveFolder
            || '',
          wordUrl: existingProject.wordUrl
            || existingProject.config?.wordUrl
            || localConfig.wordUrl
            || '',
          excelUrl: existingProject.excelUrl
            || existingProject.config?.excelUrl
            || localConfig.excelUrl
            || ''
        };
        if (!config.projectName) {
          openConfigModal(true);
          return false;
        }
        saveStoredConfig(config);
        const savedProject = await saveProjectToFirebase(config);
        showToast(savedProject.historySaved === false
          ? 'Proyecto guardado, pero no se pudo guardar el historial de cambios'
          : "¡Cambios guardados con éxito!");
        return savedProject;
      } catch (error) {
        console.error("No se pudo guardar el proyecto en Firebase:", error);
        showToast(String(error?.code || '').toLowerCase().includes('permission')
          ? 'No tienes permisos para modificar este proyecto'
          : "No se pudo guardar el proyecto. Inténtalo de nuevo.");
        return false;
      }
    };
    window.guardarProyectoUnificado = guardarProyectoUnificado;

    const trySaveToCurrentLocation = async (fileName, content) => {
      if (projectFileHandle) {
        try {
          const writable = await projectFileHandle.createWritable();
          await writable.write(content);
          await writable.close();
          await saveProjectBrandIcon(null, projectFileHandle);
          markFileSaved(fileName);
          showToast("Proyecto actualizado");
          return true;
        } catch (error) {
          console.warn("No se pudo actualizar el archivo actual:", error);
          projectFileHandle = null;
        }
      }

      if (projectDirectoryHandle) {
        try {
          const handle = await projectDirectoryHandle.getFileHandle(fileName, { create: true });
          const writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
          await saveProjectBrandIcon(projectDirectoryHandle, null);
          markFileSaved(fileName);
          showToast(`Proyecto guardado en ${projectDirectoryHandle.name || 'la carpeta seleccionada'}`);
          return true;
        } catch (error) {
          console.warn("No se pudo guardar en la carpeta actual:", error);
          projectDirectoryHandle = null;
        }
      }

      return false;
    };

    if (btnSaveAs) {
      btnSaveAs.addEventListener("click", () => {
        if (!isAuthenticatedProjectOwner()) {
          showToast('Únicamente el líder del proyecto puede exportar la versión HTML');
          return;
        }
        const content = getProjectContent();
        if (!content) return;
        const fileName = getFileName();
        downloadTextFile(fileName, content, "text/html;charset=utf-8");
        markFileSaved(fileName);
        showToast("Proyecto descargado. Súbelo manualmente a Google Drive.");
      });
    }

    const showDriveSaveModal = (fileName, downloadUrl) => {
      let modal = document.getElementById('drive-save-modal');
      if (modal) modal.remove();
      modal = document.createElement('div');
      modal.id = 'drive-save-modal';
      modal.style.position = 'fixed';
      modal.style.left = '50%';
      modal.style.top = '10%';
      modal.style.transform = 'translateX(-50%)';
      modal.style.zIndex = '10001';
      modal.style.minWidth = '340px';
      modal.style.maxWidth = '92%';
      modal.style.padding = '18px';
      modal.style.borderRadius = '12px';
      modal.style.boxShadow = '0 16px 40px rgba(0,0,0,0.18)';
      modal.style.background = '#ffffff';
      modal.style.color = '#0f172a';
      modal.style.fontFamily = 'Arial, Helvetica, sans-serif';
      modal.innerHTML = `
        <strong>Guardar proyecto en Google Drive</strong>
        <p style="margin: 12px 0 0; color: #334155; line-height: 1.5;">Se abrió Google Drive en una nueva pestaña. Para guardar el proyecto, sube el archivo descargado a tu cuenta de Drive.</p>
        <p style="margin: 12px 0 0; color: #334155;">Archivo preparado: <strong>${fileName}</strong></p>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:16px; justify-content:flex-end;">
          <a id="drive-save-download" href="${downloadUrl}" download="${fileName}" style="padding:8px 12px; background:#2563eb; color:white; border-radius:8px; text-decoration:none;">Descargar archivo</a>
          <button id="drive-save-close" style="padding:8px 12px; background:#e2e8f0; color:#0f172a; border:none; border-radius:8px; cursor:pointer;">Cerrar</button>
        </div>
        <p style="margin: 12px 0 0; font-size:0.92rem; color:#475569;">Después, abre Drive y usa la opción "Subir archivos" o arrastra el archivo al área de Drive.</p>
      `;
      document.body.appendChild(modal);
      document.getElementById('drive-save-close').addEventListener('click', () => modal.remove());
    };

    const guardarProyecto = async () => {
      if (!await requestSavePermission(getFileName())) return false;
        const content = getProjectContent();
      if (!content) return false;
        let fileName = getFileName();

        if (!fileNameInput?.value && !currentDocumentName) {
          fileName = getFileName();
          if (fileNameInput) {
            fileNameInput.value = fileName;
          }
          currentDocumentName = fileName.replace(/\.siora\.html$/i, "");
        }

        const saved = await trySaveToCurrentLocation(fileName, content);
        if (saved) return true;

        if (!window.showSaveFilePicker && !window.showDirectoryPicker) {
          downloadTextFile(fileName, content, "text/html;charset=utf-8");
          markFileSaved(fileName);
          showToast("Proyecto descargado");
          return true;
        }

        if (window.showDirectoryPicker && !projectDirectoryHandle && !projectFileHandle) {
          const chosen = await pickLocalProjectFolder();
          if (!chosen) {
            showToast("Selecciona una carpeta para guardar el proyecto");
            return false;
          }
          const handle = await chosen.getFileHandle(fileName, { create: true });
          const writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
          projectFileHandle = handle;
          projectDirectoryHandle = chosen;
          markFileSaved(fileName);
          showToast(`Proyecto guardado en ${chosen.name || 'la carpeta seleccionada'}`);
          return true;
        }

        return await saveProjectAs(fileName, content);
    };

    const mostrarDialogoNuevoProyecto = () => new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "ora-modal-backdrop";
      modal.innerHTML = `
        <div class="ora-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
          <h3 id="new-project-title">Crear nuevo proyecto</h3>
          <p>El proyecto actual contiene información. Guárdela antes de comenzar uno nuevo para evitar perderla.</p>
          <div class="ora-modal-actions">
            <button type="button" class="ora-modal-cancel">Cancelar</button>
            <button type="button" class="ora-modal-discard">Crear sin guardar</button>
            <button type="button" class="ora-modal-confirm">Guardar y crear</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const cerrar = (decision) => {
        modal.remove();
        resolve(decision);
      };
      modal.querySelector(".ora-modal-cancel").addEventListener("click", () => cerrar("cancelar"));
      modal.querySelector(".ora-modal-discard").addEventListener("click", () => cerrar("descartar"));
      modal.querySelector(".ora-modal-confirm").addEventListener("click", () => cerrar("guardar"));
      modal.addEventListener("click", (event) => {
        if (event.target === modal) cerrar("cancelar");
      });
    });

    const crearNuevoProyecto = async () => {
      const authenticatedUser = window.firebase?.apps?.length
        ? window.firebase.auth().currentUser
        : null;
      if (!authenticatedUser?.email || !isInstitutionalEmail(authenticatedUser.email)) {
        window.alert('Debes iniciar sesión con tu cuenta institucional @cun.edu.co para crear un proyecto.');
        return;
      }

      if (hasUnsavedChanges || hayInformacionEnProyecto()) {
        const decision = await mostrarDialogoNuevoProyecto();
        if (decision === "cancelar") return;
        if (decision === "guardar") {
          const guardado = await guardarProyecto();
          if (!guardado) return;
        }
      }

      const previousProjectId = currentProjectId;
      const newProjectId = createProjectId();
      const previousWasUnpersisted = isUnpersistedProject;
      if (btnNewProject) btnNewProject.disabled = true;

      activateProject(newProjectId, '', true);
      try {
        if (!ensureFirebase() || !firebaseDb) {
          throw new Error('Firebase no está disponible para inicializar el proyecto');
        }
        clearFormState(false);
        window.reiniciarFichasDinamicas?.();
        pendingFormFields = null;
        projectFileHandle = null;
        projectDirectoryHandle = null;
        const leaderEmailInput = document.getElementById('correo_integrante_1');
        if (leaderEmailInput) {
          leaderEmailInput.value = normalizeEmail(authenticatedUser.email);
          leaderEmailInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const ownerInitialized = await assignCurrentUserAsProjectOwner(
          newProjectId,
          authenticatedUser,
          true
        );
        if (!ownerInitialized) {
          const ownerSnapshot = await firebaseDb.ref(`projects/${newProjectId}`).once('value');
          const initializedOwner = normalizeEmail(ownerSnapshot.val()?.ownerEmail);
          if (initializedOwner !== normalizeEmail(authenticatedUser.email)) {
            throw new Error('No se pudo asignar el propietario del proyecto nuevo');
          }
        }
        await firebaseDb.ref(`projects/${newProjectId}`).update({
          'fields/correo_integrante_1': normalizeEmail(authenticatedUser.email),
          teamMembers: collectTeamMembers()
        });
        lastRealtimeProject = (await firebaseDb.ref(`projects/${newProjectId}`).once('value')).val() || {};
        applyProjectAccessMode(lastRealtimeProject);
        saveFormState();
        resetDirtyState();
        openConfigModal(true);
        showToast("Completa la configuración del proyecto para guardarlo");
      } catch (error) {
        console.error("No se pudo preparar el nuevo proyecto:", error);
        activateProject(previousProjectId, '', previousWasUnpersisted);
        loadFormState();
        window.restaurarEstadoPersistido?.();
        showToast("No se pudo preparar el nuevo proyecto. Inténtalo de nuevo.");
      } finally {
        if (btnNewProject) btnNewProject.disabled = false;
      }
    };

    if (btnNewProject) btnNewProject.addEventListener("click", crearNuevoProyecto);

    const openProjectFile = async (fileHandle) => {
      try {
        const file = await fileHandle.getFile();
        const text = await file.text();
        const data = parseProjectDataFromText(text);
        if (!data?.fields) {
          showToast("El archivo seleccionado no es un proyecto válido");
          return;
        }

        const baseName = file.name.replace(/\.siora\.json$/i, "").replace(/\.json$/i, "").replace(/\.html?$/i, "");
        const fileProjectId = String(data.projectId || '').trim() || createProjectId();
        activateProject(fileProjectId, baseName, !data.projectId);
        clearFormState(false);
        window.reiniciarFichasDinamicas?.();
        pendingFormFields = null;
        populateFormState(data.fields, data.analysisLevels);
        window.restaurarFichasDinamicas?.(data.dynamicSections);
        saveStoredConfig(data.config || {});
        applyStoredConfig();
        saveFormState();
        renderProjectSummary();
        window.sincronizarReplicasIniciales?.();

        projectFileHandle = fileHandle;
        projectDirectoryHandle = null;

        if (fileNameInput) {
          resetDirtyState(baseName);
        }

        showToast(`Archivo cargado: ${file.name}`);
      } catch (error) {
        showToast("No se pudo abrir el archivo");
        console.warn(error);
      }
    };

    if (btnOpen && btnOpen.dataset.openHandlerAttached !== 'true') {
      btnOpen.dataset.openHandlerAttached = 'true';
      btnOpen.addEventListener('click', () => {
        document.getElementById('file-open-input')?.click();
      });
    }

    if (fileOpenInput && fileOpenInput.dataset.changeHandlerAttached !== 'true') {
      fileOpenInput.dataset.changeHandlerAttached = 'true';
      fileOpenInput.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          const data = parseProjectDataFromText(text);
          if (!data?.fields) {
            showToast("El archivo seleccionado no es un proyecto SI-ORA válido");
            return;
          }
          const baseName = file.name.replace(/\.siora\.json$/i, "").replace(/\.json$/i, "").replace(/\.html?$/i, "");
          const fileProjectId = String(data.projectId || '').trim() || createProjectId();
          activateProject(fileProjectId, baseName, !data.projectId);
          clearFormState(false);
          window.reiniciarFichasDinamicas?.();
          pendingFormFields = null;
          populateFormState(data.fields, data.analysisLevels);
          window.restaurarFichasDinamicas?.(data.dynamicSections);
          saveStoredConfig(data.config || {});
          applyStoredConfig();
          saveFormState();
          renderProjectSummary();
          window.sincronizarReplicasIniciales?.();
          projectFileHandle = null;
          projectDirectoryHandle = null;
          if (fileNameInput) {
            resetDirtyState(baseName);
          }
          showToast(`Archivo cargado: ${file.name}`);
        } catch (error) {
          showToast("No se pudo abrir el archivo");
          console.warn(error);
        } finally {
          event.target.value = "";
        }
      });
    }

    if (btnToggleSummary) {
      btnToggleSummary.addEventListener("click", () => {
        const panel = document.getElementById("quick-summary-panel");
        if (panel) {
          panel.classList.toggle("visible");
        } else {
          renderProjectSummary();
          document.getElementById("quick-summary-panel")?.classList.add("visible");
        }
      });
    }

    if (btnCompartir) {
      btnCompartir.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openShareProjectModal();
      });
    }

    if (btnExcel) {
      btnExcel.addEventListener("click", () => {
        const cfg = loadStoredConfig();
        if (cfg && cfg.excelUrl) {
          try {
            window.open(cfg.excelUrl, '_blank');
            showToast('Abriendo seguimiento en Google Sheets');
          } catch (e) {
            showToast('No se pudo abrir el enlace');
          }
        } else {
          showConfigRequiredModal('El enlace de seguimiento (Google Sheets) no está configurado. Abra la configuración para agregarlo.');
        }
      });
    }

    if (btnWord) {
      btnWord.addEventListener("click", () => {
        const cfg = loadStoredConfig();
        if (cfg && cfg.wordUrl) {
          try {
            window.open(cfg.wordUrl, '_blank');
            showToast('Abriendo documento en Google Docs');
          } catch (e) {
            showToast('No se pudo abrir el enlace');
          }
        } else {
          showConfigRequiredModal('El enlace de documento (Word/Google Docs) no está configurado. Abra la configuración para agregarlo.');
        }
      });
    }

    if (btnConfig) {
      btnConfig.addEventListener("click", () => {
        openConfigModal();
      });
    }

    if (btnUndo) {
      btnUndo.addEventListener("click", () => {
        document.execCommand("undo");
        showToast("Deshacer");
      });
    }

    if (btnRedo) {
      btnRedo.addEventListener("click", () => {
        document.execCommand("redo");
        showToast("Rehacer");
      });
    }

    if (btnCopy) {
      btnCopy.addEventListener("click", async () => {
        const active = document.activeElement;
        const text = active?.value || window.getSelection()?.toString() || "";
        if (!text) {
          showToast("Seleccione texto para copiar");
          return;
        }
        try {
          await navigator.clipboard.writeText(text);
          showToast("Texto copiado");
        } catch (error) {
          document.execCommand("copy");
          showToast("Texto copiado");
        }
      });
    }

    if (btnPaste) {
      btnPaste.addEventListener("click", async () => {
        const active = document.activeElement;
        if (!active || !(active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
          showToast("Seleccione un campo para pegar");
          return;
        }
        try {
          const clipboardText = await navigator.clipboard.readText();
          const start = active.selectionStart || 0;
          const end = active.selectionEnd || start;
          const value = active.value || "";
          active.value = `${value.slice(0, start)}${clipboardText}${value.slice(end)}`;
          active.dispatchEvent(new Event("input", { bubbles: true }));
          showToast("Texto pegado");
        } catch (error) {
          showToast("No se pudo pegar desde el portapapeles");
        }
      });
    }
  }

  function populateFormState(fields, savedAnalysisLevelState = null) {
    pendingFormFields = fields;
    if (savedAnalysisLevelState) analysisLevelState = savedAnalysisLevelState;
    aplicarCamposPendientes();
  }

  function aplicarCamposPendientes() {
    try {
      if (!pendingFormFields) {
        const raw = localStorage.getItem(getProjectStorageKey()) || (
          currentProjectId === "default" ? localStorage.getItem(STORAGE_KEY) : null
        );
        if (raw) {
          const parsed = JSON.parse(raw);
          analysisLevelState = parsed?.analysisLevels || {};
          lastLocalUpdate = Number(parsed?.lastLocalUpdate || parsed?.savedAt || lastLocalUpdate);
          pendingFormFields = parsed?.fields || parsed;
        }
      }
    } catch (error) {
      console.warn("No fue posible leer el último estado guardado", error);
    }
    if (!pendingFormFields) return;

    prepararClavesCampos();
    const fields = pendingFormFields;
    Object.entries(fields).forEach(([id, value]) => {
      const el = buscarCampoGuardado(id);
      if (!el || esCampoDinamico(el)) return;
      if (el.type === "checkbox") {
        el.checked = !!value;
      } else {
        el.value = value;
      }
    });

    const pendingAuthors = {};
    Object.entries(fields).forEach(([id, value]) => {
      if (id.endsWith("_author")) {
        pendingAuthors[id.slice(0, -7)] = value;
      }
    });
    Object.entries(pendingAuthors).forEach(([baseId, author]) => {
      const field = document.getElementById(baseId);
      if (!field || esCampoDinamico(field)) return;
      field.dataset.author = author;
      updateParticipationFieldLabel(field);
    });

    recalculateParticipation();
  }

  window.aplicarCamposPendientes = aplicarCamposPendientes;

  function restaurarEstadoPersistido() {
    try {
      const raw = localStorage.getItem(getProjectStorageKey());
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const fields = parsed?.fields || parsed;
      if (!fields || typeof fields !== "object") return false;

      lastLocalUpdate = Number(parsed?.lastLocalUpdate || parsed?.savedAt || lastLocalUpdate);
      pendingFormFields = fields;
      aplicarCamposPendientes();
      window.sioraDatosCargados = true;
      return true;
    } catch (error) {
      console.warn("No fue posible restaurar los campos dinámicos", error);
      return false;
    }
  }

  window.restaurarEstadoPersistido = restaurarEstadoPersistido;

  window.registrarCambioProyecto = () => {
    if (isApplyingRemoteDocument) return;
    markFileDirty();
    saveFormState();
    renderProjectSummary();
    queueRealtimeDynamicSync();
  };

  function obtenerClaveCampo(elemento) {
  if (elemento.dataset.sioraId) return elemento.dataset.sioraId;
  if (elemento.dataset.sioraStorageKey) return elemento.dataset.sioraStorageKey;
  if (elemento.id) return elemento.id;

  const clave = obtenerClaveRutaCampo(elemento);
  elemento.dataset.sioraStorageKey = clave;
  return clave;
}

  function obtenerClaveRutaCampo(elemento) {
    const partes = [];
    let actual = elemento;
    while (actual && actual !== document.body) {
      const padre = actual.parentElement;
      const posicion = padre ? Array.from(padre.children).indexOf(actual) : 0;
      partes.unshift(`${actual.tagName.toLowerCase()}-${posicion}`);
      if (actual.id) {
        partes.unshift(actual.id);
        break;
      }
      actual = padre;
    }

    return `siora_path_${partes.join("_")}`;
  }

  function prepararClavesCampos() {
    const clavesDefinicion = [
      { clase: "def-objeto-origen", clave: "def_objeto_origen" },
      { clase: "def-objeto-target", clave: "def_objeto_target" },
      { clase: "def-proposito-origen", clave: "def_proposito_origen" },
      { clase: "def-proposito-target", clave: "def_proposito_target" },
      { clase: "def-audiencia-origen", clave: "def_audiencia_origen" },
      { clase: "def-audiencia-target", clave: "def_audiencia_target" }
    ];
    clavesDefinicion.forEach(({ clase, clave }) => {
      document.querySelectorAll(`textarea.${clase}`).forEach((elemento, index) => {
        if (!elemento.dataset.sioraStorageKey) {
          elemento.dataset.sioraStorageKey = index === 0 ? clave : `${clave}_${index + 1}`;
        }
      });
    });

    document.querySelectorAll(".card-item-dinamico textarea, .connector-block textarea").forEach((elemento) => {
      if (elemento.dataset.sioraStorageKey) return;
      const contenedor = elemento.closest(".card-item-dinamico, .connector-block");
      const seccion = contenedor?.closest("#contenedor-planteamiento")
        ? "planteamiento"
        : "justificacion";
      const indiceCampo = Array.from(contenedor?.querySelectorAll("textarea") || []).indexOf(elemento);
      const tipoCampo = contenedor?.classList.contains("connector-block") ? "conector" : "ficha";
      if (contenedor && !contenedor.dataset.sioraStorageId) {
        contenedor.dataset.sioraStorageId = `${seccion}_${tipoCampo}_${contenedor.id || obtenerClaveRutaCampo(contenedor)}`;
      }
      const identificador = contenedor?.dataset.sioraStorageId || obtenerClaveRutaCampo(elemento);
      elemento.dataset.sioraStorageKey = `dynamic_${seccion}_${tipoCampo}_${identificador}_${indiceCampo}`;
    });

    document.querySelectorAll("input, textarea, select").forEach((elemento) => {
      const esDefinicion = clavesDefinicion.some(({ clase }) => elemento.matches(`textarea.${clase}`));
      const esCampoDinamico = elemento.matches(".card-item-dinamico textarea, .connector-block textarea");
      if (esDefinicion || esCampoDinamico
        || (!elemento.readOnly && !elemento.disabled && !elemento.classList.contains("input-black-replica"))) {
        obtenerClaveCampo(elemento);
      }
    });
    asegurarClavesCamposUnicas();
  }

  window.prepararClavesCampos = prepararClavesCampos;

  function asegurarClavesCamposUnicas() {
    const clavesUsadas = new Set();
    document.querySelectorAll("[data-siora-storage-key]").forEach((elemento) => {
      const clave = elemento.dataset.sioraStorageKey;
      if (!clavesUsadas.has(clave)) {
        clavesUsadas.add(clave);
        return;
      }
      const base = clave || "definicion";
      let sufijo = 2;
      let claveUnica = `${base}_${sufijo}`;
      while (clavesUsadas.has(claveUnica)) {
        sufijo += 1;
        claveUnica = `${base}_${sufijo}`;
      }
      elemento.dataset.sioraStorageKey = claveUnica;
      clavesUsadas.add(claveUnica);
    });
  }

  function buscarCampoGuardado(clave) {
    const campoPorId = document.getElementById(clave);
    if (campoPorId) return campoPorId;
    const claveDefinicion = /^def[-_](objeto|proposito|audiencia)[-_](origen|target)$/.exec(clave);
    if (claveDefinicion) {
      const campoDefinicion = document.querySelector(
        `textarea.def-${claveDefinicion[1]}-${claveDefinicion[2]}`
      );
      if (campoDefinicion) return campoDefinicion;
    }
    const campos = Array.from(document.querySelectorAll("input, textarea, select"));
    return campos.find((campo) => campo.dataset.sioraStorageKey === clave)
      || campos.find((campo) => obtenerClaveRutaCampo(campo) === clave);
  }

  function esCampoDinamico(elemento) {
    return elemento?.closest(".card-item-dinamico, .connector-block");
  }

  function scheduleRealtimeAutoSave() {
    window.clearTimeout(realtimeAutoSaveTimer);
    realtimeAutoSaveTimer = window.setTimeout(flushRealtimeAutoSave, 2000);
  }

  async function flushRealtimeAutoSave() {
    realtimeAutoSaveTimer = null;
    setSaveStatus('saving');
    if (Object.keys(pendingRealtimeFields).length) await flushRealtimeFieldSync();
    if (pendingRealtimeDynamicSync) await flushRealtimeDynamicSync();
    updateRealtimeSaveStatus();
  }

  async function ensureRealtimeProjectWriteAccess(projectId, projectRef) {
    let snapshot = await projectRef.once('value');
    let projectData = snapshot.val() || {};
    if (!snapshot.exists()) {
      const user = firebaseAuth?.currentUser || currentUser;
      const claimed = await assignCurrentUserAsProjectOwner(projectId, user, true);
      if (!claimed) {
        showToast('No se pudo inicializar el acceso de escritura del proyecto');
        return null;
      }
      snapshot = await projectRef.once('value');
      projectData = snapshot.val() || {};
    }

    await verifyCurrentUserProjectMembership(projectId, projectData);
    snapshot = await projectRef.once('value');
    projectData = snapshot.val() || {};
    if (!canCurrentUserEditProject(projectData)) {
      showToast('No tienes permisos para editar este proyecto');
      return null;
    }
    return projectData;
  }

  function queueRealtimeFieldSync(field) {
    if (!field || isApplyingRemoteDocument || field.dataset.firebaseRemoteSync === 'true') return;
    saveFormState();
    if (esCampoDinamico(field)) {
      queueRealtimeDynamicSync();
      return;
    }

    const fieldKey = obtenerClaveCampo(field);
    const value = field.type === 'checkbox' ? !!field.checked : String(field.value || '');
    pendingRealtimeFields[fieldKey] = value === '' ? null : value;
    const claveDefinicion = /^def_(objeto|proposito|audiencia)_(origen|target)$/.exec(fieldKey);
    if (claveDefinicion) {
      pendingRealtimeFields[`def-${claveDefinicion[1]}-${claveDefinicion[2]}`] = value === '' ? null : value;
    }
    if (field.dataset.author) {
      pendingRealtimeFields[`${fieldKey}_author`] = field.dataset.author;
    } else if (fieldKey.endsWith('_author')) {
      pendingRealtimeFields[fieldKey] = null;
    }
    scheduleRealtimeAutoSave();
  }

  async function flushRealtimeFieldSync() {
    const projectId = currentProjectId;
    const updates = pendingRealtimeFields;
    pendingRealtimeFields = {};
    if (!projectId || projectId !== currentProjectId || !Object.keys(updates).length) return [];
    if (!firebaseDb || !(firebaseAuth?.currentUser?.email || currentUser?.email) || isFirebaseConnected === false) {
      pendingRealtimeFields = { ...updates, ...pendingRealtimeFields };
      setSaveStatus('unsaved');
      return [];
    }
    isRealtimeSaveInProgress = true;
    setSaveStatus('saving');
    try {
      const projectRef = firebaseDb.ref(`projects/${projectId}`);
      const projectData = await ensureRealtimeProjectWriteAccess(projectId, projectRef);
      if (projectId !== currentProjectId || !projectData) {
        pendingRealtimeFields = { ...updates, ...pendingRealtimeFields };
        setSaveStatus('unsaved');
        return [];
      }
      const timestamp = Date.now();
      const projectUpdates = {
        updatedAt: timestamp,
        lastModifiedAt: timestamp,
        lastModifiedByUid: (firebaseAuth?.currentUser || currentUser)?.uid || ''
      };
      Object.entries(updates).forEach(([fieldKey, value]) => {
        projectUpdates[`fields/${fieldKey}`] = value;
      });
      await projectRef.update(projectUpdates);
      lastRealtimeSaveAt = timestamp;
      Object.keys(updates).forEach((fieldKey) => delete pendingRemoteFieldValues[fieldKey]);
      updateRealtimeSaveStatus();
      return Object.keys(updates);
    } catch (error) {
      if (projectId === currentProjectId) pendingRealtimeFields = { ...updates, ...pendingRealtimeFields };
      console.error('No se pudieron sincronizar los cambios en tiempo real:', error);
      showToast(String(error?.code || '').toLowerCase().includes('permission')
        ? 'No tienes permisos para editar este proyecto'
        : 'No se pudieron sincronizar los cambios en tiempo real');
      setSaveStatus('unsaved');
      return [];
    } finally {
      isRealtimeSaveInProgress = false;
      updateRealtimeSaveStatus();
    }
  }

  function queueRealtimeDynamicSync() {
    if (isApplyingRemoteDocument) return;
    saveFormState();
    pendingRealtimeDynamicSync = true;
    scheduleRealtimeAutoSave();
  }

  async function flushRealtimeDynamicSync() {
    const projectId = currentProjectId;
    if (!projectId || !pendingRealtimeDynamicSync) return false;
    if (!firebaseDb || !(firebaseAuth?.currentUser?.email || currentUser?.email) || isFirebaseConnected === false) {
      setSaveStatus('unsaved');
      return false;
    }
    isRealtimeSaveInProgress = true;
    setSaveStatus('saving');
    try {
      const projectRef = firebaseDb.ref(`projects/${projectId}`);
      const projectData = await ensureRealtimeProjectWriteAccess(projectId, projectRef);
      if (projectId !== currentProjectId || !projectData) return false;
      const sections = window.obtenerEstadoFichasDinamicas?.() || {};
      const timestamp = Date.now();
      const projectUpdates = {
        updatedAt: timestamp,
        lastModifiedAt: timestamp,
        lastModifiedByUid: (firebaseAuth?.currentUser || currentUser)?.uid || ''
      };
      ['planteamiento', 'justificacion'].forEach((section) => {
        const items = Array.isArray(sections[section]) ? sections[section] : [];
        projectUpdates[`dynamicSections/${section}`] = items.length ? items : { __empty: true };
      });
      await projectRef.update(projectUpdates);
      lastRealtimeSaveAt = timestamp;
      pendingRealtimeDynamicSync = false;
      pendingRemoteDynamicSections = null;
      updateRealtimeSaveStatus();
      return true;
    } catch (error) {
      console.error('No se pudieron sincronizar las fichas en tiempo real:', error);
      showToast(String(error?.code || '').toLowerCase().includes('permission')
        ? 'No tienes permisos para editar este proyecto'
        : 'No se pudieron sincronizar las fichas en tiempo real');
      setSaveStatus('unsaved');
      return false;
    } finally {
      isRealtimeSaveInProgress = false;
      updateRealtimeSaveStatus();
    }
  }

  function updateRealtimeSaveStatus() {
    if (isRealtimeSaveInProgress) return;
    if (Object.keys(pendingRealtimeFields).length || pendingRealtimeDynamicSync
      || realtimeAutoSaveTimer !== null) {
      setSaveStatus('unsaved');
      return;
    }
    if (lastLocalUpdate <= lastRealtimeSaveAt) {
      hasUnsavedChanges = false;
      syncFileNameDisplay();
      setSaveStatus('saved');
    } else {
      setSaveStatus('unsaved');
    }
  }

  function initChangeTracking() {
    prepararClavesCampos();

    const programarSyncCorreoIntegrante = (campo) => {
      if (!campo.classList.contains('input-correo-integrante')) return;
      window.clearTimeout(rosterSyncTimer);
      rosterSyncTimer = window.setTimeout(async () => {
        try {
          await syncTeamMemberAccess();
        } catch (error) {
          console.error('No se pudieron sincronizar los correos de integrantes:', error);
          showToast('No se pudieron actualizar los permisos de integrantes');
        }
      }, 500);
    };

    const registrarCambio = (event) => {
      const campo = event.target;
      if (!(campo instanceof HTMLInputElement)
        && !(campo instanceof HTMLTextAreaElement)
        && !(campo instanceof HTMLSelectElement)) return;
      if (campo.readOnly || campo.disabled) return;
      if (campo.dataset.firebaseRemoteSync === 'true') return;
      prepararClavesCampos();
      markFileDirty();
      queueRealtimeFieldSync(campo);
      programarSyncCorreoIntegrante(campo);
    };

    document.addEventListener("input", (event) => {
      const campo = event.target;
      if (!(campo instanceof HTMLTextAreaElement || campo instanceof HTMLInputElement)) return;
      if (campo.readOnly || campo.disabled || campo.dataset.firebaseRemoteSync === 'true') return;
      prepararClavesCampos();
      markFileDirty();
      queueRealtimeFieldSync(campo);
      programarSyncCorreoIntegrante(campo);
    });
    document.addEventListener("change", registrarCambio);
    document.addEventListener('focusout', () => {
      window.setTimeout(() => {
        Object.entries(pendingRemoteFieldValues).forEach(([fieldKey, value]) => {
          const targetKey = fieldKey.endsWith('_author') ? fieldKey.slice(0, -7) : fieldKey;
          if (!Object.prototype.hasOwnProperty.call(pendingRealtimeFields, targetKey)
            && document.activeElement !== (document.getElementById(targetKey) || buscarCampoGuardado(targetKey))) {
            applyRemoteFieldValue(fieldKey, value);
            delete pendingRemoteFieldValues[fieldKey];
          }
        });
        if (pendingRemoteDynamicSections !== null
          && !pendingRealtimeDynamicSync
          && !esCampoDinamico(document.activeElement)) {
          applyRemoteDynamicSections(pendingRemoteDynamicSections);
          lastRealtimeDynamicSections = pendingRemoteDynamicSections;
          pendingRemoteDynamicSections = null;
        }
      }, 0);
    }, true);
  }

  window.addEventListener("beforeunload", (event) => {
    if (!hasUnsavedChanges) return;
    event.preventDefault();
    event.returnValue = "Tiene cambios sin guardar. ¿Desea guardar el documento antes de cerrarlo?";
  });

  function collectFormState() {
    prepararClavesCampos();
    const fields = {};
    const elements = document.querySelectorAll("input, textarea, select");
    elements.forEach((el) => {
      if (el.disabled || el.type === "file" || el.id === "file-name-input") return;
      if (el.closest(".card-item-dinamico, .connector-block")) return;
      const clave = obtenerClaveCampo(el);
      if (el.type === "checkbox") {
        fields[clave] = !!el.checked;
      } else {
        fields[clave] = el.value;
      }
      if (el.dataset.author) {
        fields[`${clave}_author`] = el.dataset.author;
      }
    });
    fields.fileName = String(document.getElementById('file-name-input')?.value || '');
    return fields;
  }

  function collectProjectPayload() {
    return {
      projectId: currentProjectId,
      timestamp: new Date().toISOString(),
      fields: collectFormState(),
      teamMembers: collectTeamMembers(),
      analysisLevels: analysisLevelState,
      config: loadStoredConfig(),
      dynamicSections: window.obtenerEstadoFichasDinamicas?.() || null
    };
  }

  window.obtenerFichasDinamicasPersistidas = getPersistedDynamicSections;

  function saveFormState() {
    try {
      const payload = collectFormState();
      const dynamicSections = window.obtenerEstadoFichasDinamicas?.() || getPersistedDynamicSections();
      localStorage.setItem(getProjectStorageKey(), JSON.stringify({
        fields: payload,
        analysisLevels: analysisLevelState,
        dynamicSections,
        lastLocalUpdate,
        savedAt: Date.now()
      }));

    } catch (err) {
      console.warn('No se pudo guardar el estado del formulario', err);
    }
  }

  window.guardarEstadoProyecto = saveFormState;

  function loadFormState() {
    try {
      const parsed = getStoredFormState();
      if (!parsed) return false;
      lastLocalUpdate = Number(parsed?.lastLocalUpdate || parsed?.savedAt || lastLocalUpdate);
      analysisLevelState = parsed?.analysisLevels || {};
      const savedFields = parsed?.fields || parsed;
      if (!savedFields || typeof savedFields !== "object") return false;
      pendingFormFields = savedFields;

      if (parsed.dynamicSections) {
        if (window.restaurarFichasDinamicas) {
          window.restaurarFichasDinamicas(parsed.dynamicSections);
        } else {
          window.sioraDynamicSectionsPendientes = parsed.dynamicSections;
        }
      }

      prepararClavesCampos();
      const pendingAuthors = {};
      Object.entries(savedFields).forEach(([id, value]) => {
        if (id.endsWith("_author")) {
          pendingAuthors[id.slice(0, -7)] = value;
          return;
        }

        const el = buscarCampoGuardado(id);
        if (!el || esCampoDinamico(el)) return;

        if (el.type === "checkbox") {
          el.checked = !!value;
        } else {
          el.value = value;
        }
      });

      Object.entries(pendingAuthors).forEach(([baseId, author]) => {
        const field = document.getElementById(baseId);
        if (!field || esCampoDinamico(field)) return;
        field.dataset.author = author;
        updateParticipationFieldLabel(field);
      });

      for (let i = 1; i <= TEAM_SIZE; i++) {
        const programaSelect = document.getElementById(`programa_${i}`);
        const codigoSelect = document.getElementById(`codigo_${i}`);
        if (programaSelect && codigoSelect) {
          fillCodigosAsignatura(codigoSelect);
          const savedValue = savedFields[`codigo_${i}`];
          if (typeof savedValue === "string") {
            codigoSelect.value = savedValue;
          }
        }
      }

      recalculateParticipation();
      aplicarCamposPendientes();
      window.sioraDatosCargados = true;
      return true;
    } catch (error) {
      console.warn("No fue posible cargar el estado guardado", error);
      return false;
    }
  }

  function clearFormState(removeStorage = true) {
    if (removeStorage) localStorage.removeItem(getProjectStorageKey());
    analysisLevelState = {};
    previousAnalysisEssences = null;
    const fields = document.querySelectorAll("input, textarea, select");
    fields.forEach((el) => {
      if (el.type === "file" || el.id === "file-name-input") return;
      if (el.type === "checkbox") {
        el.checked = false;
      } else {
        el.value = "";
      }
      delete el.dataset.author;
    });
    recalculateParticipation();
    window.sincronizarReplicasIniciales?.();
    renderProjectSummary();
  }

  async function saveHtmlFile(fileName, content, successMessage = "Proyecto guardado como HTML portable") {
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: 'Archivo HTML SI-ORA', accept: { 'text/html': ['.html', '.htm'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        showSaveLocation(handle.name || fileName, handle.kind ? handle : null, successMessage);
        return;
      } catch (error) {
        console.warn('No se guardó con showSaveFilePicker:', error);
      }
    }

    downloadTextFile(fileName, content, 'text/html;charset=utf-8');
    showSaveLocation(fileName, null, successMessage);
  }

  function downloadTextFile(fileName, content, contentType = "text/plain;charset=utf-8") {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadBlob(fileName, blob, contentType = "application/octet-stream") {
    const objectUrl = URL.createObjectURL(new Blob([blob], { type: contentType }));
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function buildProjectZip(zipName, htmlContent) {
    if (typeof JSZip === "undefined") {
      throw new Error("JSZip no está disponible. Asegúrate de cargar la librería JSZip.");
    }
    const zip = new JSZip();
    const htmlName = zipName.replace(/\.siora\.zip$/i, ".siora.html");
    zip.file(htmlName, htmlContent);
    return await zip.generateAsync({ type: "blob" });
  }

  async function saveProjectBrandIcon(folderHandle = null, fileHandle = null) {
    try {
      const iconResponse = await fetch("images/log.jpg");
      if (!iconResponse.ok) return;

      const iconBlob = await iconResponse.blob();
      let targetFolder = folderHandle;

      if (!targetFolder && fileHandle) {
        try {
          targetFolder = await fileHandle.getParent();
        } catch (error) {
          console.warn("No fue posible obtener la carpeta del archivo:", error);
        }
      }

      if (!targetFolder) return;

      const iconHandle = await targetFolder.getFileHandle("log.jpg", { create: true });
      const writable = await iconHandle.createWritable();
      await writable.write(iconBlob);
      await writable.close();
    } catch (error) {
      console.warn("No se pudo guardar el icono del proyecto:", error);
    }
  }

  async function saveProjectAs(fileName, content) {
    // "Guardar como" debe producir una sola descarga HTML, sin crear archivos adjuntos ni accesos directos.
    if (!window.showSaveFilePicker) {
      downloadTextFile(fileName, content, "text/html;charset=utf-8");
      markFileSaved(fileName);
      showToast("Proyecto descargado");
      return true;
    }

    try {
      projectFileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: "Proyecto SI-ORA", accept: { "text/html": [".html", ".htm"] } }]
      });
      const writable = await projectFileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      await saveProjectBrandIcon(null, projectFileHandle);
      markFileSaved(fileName);
      showToast("Proyecto guardado como nuevo archivo");
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("No se pudo guardar el proyecto:", error);
        showToast("No se pudo guardar el proyecto");
      }
      return false;
    }
  }

  function isGoogleDriveConfigured() {
    return GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE" && GOOGLE_API_KEY && GOOGLE_API_KEY !== "YOUR_GOOGLE_API_KEY_HERE";
  }

  async function initGoogleDrive() {
    if (googleDriveInitialized) return;
    if (typeof gapi === "undefined") {
      throw new Error("Google API no está cargada.");
    }

    await new Promise((resolve, reject) => {
      gapi.load("client", {
        callback: resolve,
        onerror: () => reject(new Error("No se pudo cargar gapi.client"))
      });
    });

    await gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      discoveryDocs: DISCOVERY_DOCS
    });

    googleDriveTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error) {
          console.warn("Error de OAuth:", response);
          return;
        }
        googleDriveAccessToken = response.access_token;
        gapi.client.setToken({ access_token: googleDriveAccessToken });
      }
    });

    googleDriveInitialized = true;
  }

  function requestGoogleDriveAccessToken() {
    return new Promise((resolve, reject) => {
      if (!googleDriveTokenClient) {
        reject(new Error("Token client no inicializado"));
        return;
      }

      if (googleDriveAccessToken) {
        resolve(googleDriveAccessToken);
        return;
      }

      googleDriveTokenClient.requestAccessToken({ prompt: "consent" });

      const checkToken = setInterval(() => {
        if (googleDriveAccessToken) {
          clearInterval(checkToken);
          resolve(googleDriveAccessToken);
        }
      }, 200);

      setTimeout(() => {
        clearInterval(checkToken);
        reject(new Error("No se obtuvo token de acceso de Drive"));
      }, 60000);
    });
  }

  async function uploadProjectToDrive(content, fileName) {
    const token = await requestGoogleDriveAccessToken();
    if (!token) {
      throw new Error("No se obtuvo token de acceso");
    }

    gapi.client.setToken({ access_token: token });
    const response = await gapi.client.drive.files.create({
      resource: {
        name: fileName,
        mimeType: "text/html"
      },
      media: {
        mimeType: "text/html",
        body: content
      },
      fields: "id,name,webViewLink"
    });

    return response.result;
  }

  function showShareResult(message) {
    let modal = document.getElementById("share-result-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "share-result-modal";
      modal.style.position = "fixed";
      modal.style.left = "50%";
      modal.style.top = "20%";
      modal.style.transform = "translateX(-50%)";
      modal.style.zIndex = "9999";
      modal.style.minWidth = "320px";
      modal.style.padding = "18px";
      modal.style.borderRadius = "14px";
      modal.style.boxShadow = "0 12px 40px rgba(0,0,0,0.18)";
      modal.style.background = "#ffffff";
      modal.style.color = "#0f172a";
      modal.style.fontFamily = "Arial, Helvetica, sans-serif";
      modal.style.lineHeight = "1.5";
      modal.innerHTML = `
        <strong>Compartir / sincronización</strong>
        <p id="share-result-text" style="margin: 10px 0 0; font-size: 0.95rem; color: #334155;"></p>
        <button id="close-share-result" style="margin-top: 12px; padding: 8px 12px; border: none; background: #2563eb; color: white; border-radius: 8px; cursor: pointer;">Cerrar</button>
      `;
      document.body.appendChild(modal);
      document.getElementById("close-share-result").addEventListener("click", () => {
        modal.remove();
      });
    }

    document.getElementById("share-result-text").textContent = message;
  }

  function showConfigRequiredModal(message) {
    let modal = document.getElementById('ora-config-required-modal');
    if (modal) return; // already shown
    modal = document.createElement('div');
    modal.id = 'ora-config-required-modal';
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '20%';
    modal.style.transform = 'translateX(-50%)';
    modal.style.zIndex = '10001';
    modal.style.minWidth = '320px';
    modal.style.padding = '18px';
    modal.style.borderRadius = '12px';
    modal.style.boxShadow = '0 12px 40px rgba(0,0,0,0.18)';
    modal.style.background = '#fff';
    modal.style.color = '#0f172a';
    modal.style.fontFamily = 'Arial, Helvetica, sans-serif';
    modal.innerHTML = `
      <strong>Configuración requerida</strong>
      <p id="ora-config-required-text" style="margin:10px 0 0; color:#334155">${message}</p>
      <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px">
        <button id="ora-config-required-open" style="padding:8px 10px; background:#2563eb; color:white; border-radius:8px; border:none; cursor:pointer">Abrir configuración</button>
        <button id="ora-config-required-close" style="padding:8px 10px; background:#e2e8f0; border-radius:8px; border:none; cursor:pointer">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('ora-config-required-close').addEventListener('click', () => modal.remove());
    document.getElementById('ora-config-required-open').addEventListener('click', () => {
      modal.remove();
      openConfigModal();
    });
  }

  function showSaveLocation(fileName, fileHandle, message = 'Archivo guardado') {
    let modal = document.getElementById('save-location-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'save-location-modal';
      modal.style.position = 'fixed';
      modal.style.left = '50%';
      modal.style.top = '20%';
      modal.style.transform = 'translateX(-50%)';
      modal.style.zIndex = '9999';
      modal.style.minWidth = '320px';
      modal.style.padding = '18px';
      modal.style.borderRadius = '14px';
      modal.style.boxShadow = '0 12px 40px rgba(0,0,0,0.18)';
      modal.style.background = '#ffffff';
      modal.style.color = '#0f172a';
      modal.style.fontFamily = 'Arial, Helvetica, sans-serif';
      modal.style.lineHeight = '1.5';
      modal.innerHTML = `
        <strong>${message}</strong>
        <p id="save-location-text" style="margin: 10px 0 0; font-size: 0.95rem; color: #334155;"></p>
        <button id="close-save-location" style="margin-top: 12px; padding: 8px 12px; border: none; background: #2563eb; color: white; border-radius: 8px; cursor: pointer;">Cerrar</button>
      `;
      document.body.appendChild(modal);
      document.getElementById('close-save-location').addEventListener('click', () => {
        modal.remove();
      });
    }

    const textEl = document.getElementById('save-location-text');
    const locationText = fileHandle ? `Se guardó como: ${fileName}` : `Archivo descargado: ${fileName}`;
    textEl.textContent = locationText;
  }

  /* ----- Configuración del entorno (modal) ----- */
  function CONFIG_STORAGE_KEY() { return `siora_config_v1_${currentProjectId}`; }

  function loadStoredConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY()) || (
        currentProjectId === "default" ? localStorage.getItem('siora_config_v1') : null
      );
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      console.warn('No se pudo leer configuración guardada', e);
      return {};
    }
  }

  function saveStoredConfig(cfg) {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY(), JSON.stringify(cfg));
    } catch (e) {
      console.warn('No se pudo guardar configuración', e);
    }
  }

  function applyStoredConfig() {
    const fileNameInput = document.getElementById('file-name-input');
    const cfg = loadStoredConfig();
    if (!currentDocumentName && cfg.projectName) {
      currentDocumentName = cfg.projectName.replace(/\.siora\.html?$/i, "").trim();
    }
    if (fileNameInput) syncFileNameDisplay();
    const facilitatorInput = document.getElementById('correo_facilitador');
    if (facilitatorInput && !facilitatorInput.value && cfg.facilitatorEmail) {
      facilitatorInput.value = cfg.facilitatorEmail;
    }
    actualizarBotonCarpetaEvidencias();
    syncWindowTitle();
  }

  function isValidEvidenceFolderUrl(folderUrl) {
    if (typeof folderUrl !== 'string' || !folderUrl.trim()) return false;
    try {
      const parsedUrl = new URL(folderUrl.trim());
      return ['http:', 'https:'].includes(parsedUrl.protocol)
        && parsedUrl.hostname.toLowerCase() === 'drive.google.com';
    } catch (error) {
      return false;
    }
  }

  function actualizarBotonCarpetaEvidencias() {
    const button = document.getElementById('btn-carpeta_seguimiento');
    const driveLink = document.getElementById('evidence-drive-link');
    const cfg = loadStoredConfig();
    const folderUrl = [cfg.saveFolder, cfg.folderUrl]
      .find((candidate) => isValidEvidenceFolderUrl(candidate)) || '';
    if (button) {
      const isValid = !!folderUrl;
      button.hidden = false;
      button.disabled = false;
      button.style.display = 'inline-flex';
      button.removeAttribute('aria-disabled');
      button.classList.toggle('is-unconfigured', !isValid);
      button.title = isValid
        ? 'Abrir carpeta de evidencias (Google Drive)'
        : 'Carpeta de evidencias no configurada';
    }
    if (driveLink) {
      driveLink.hidden = !folderUrl;
      if (folderUrl) driveLink.href = folderUrl;
    }
  }

  function getLocalEvidenceStorageKey(projectId = currentProjectId) {
    return `siora_evidences_v1_${projectId}`;
  }

  function loadLocalEvidenceItems(projectId = currentProjectId) {
    try {
      const raw = localStorage.getItem(getLocalEvidenceStorageKey(projectId));
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('No se pudieron leer las evidencias locales:', error);
      return [];
    }
  }

  function saveLocalEvidenceItems(items, projectId = currentProjectId) {
    try {
      localStorage.setItem(getLocalEvidenceStorageKey(projectId), JSON.stringify(items));
    } catch (error) {
      console.error('No se pudieron guardar las evidencias localmente:', error);
      showToast('No se pudieron guardar las evidencias en este dispositivo');
    }
  }

  function renderEvidenceList(remoteItems = {}) {
    const list = document.getElementById('listaEvidencias');
    if (!list) return;
    const remoteEntries = Array.isArray(remoteItems)
      ? remoteItems.map((item, index) => [String(index), item])
      : Object.entries(remoteItems || {});
    const itemsById = new Map(remoteEntries
      .filter(([, item]) => item && typeof item === 'object')
      .map(([id, item]) => [id, { ...item, id }]));
    const localItems = loadLocalEvidenceItems();
    localItems.filter((item) => item?.id).forEach((item) => {
      if (!itemsById.has(item.id)) itemsById.set(item.id, item);
    });
    const evidenceItems = Array.from(itemsById.values())
      .sort((left, right) => Number(right.createdAt || 0) - Number(left.createdAt || 0));
    saveLocalEvidenceItems(evidenceItems.map((item) => ({ ...item, pending: !!item.pending })));

    list.replaceChildren();
    if (!evidenceItems.length) {
      const emptyItem = document.createElement('li');
      const message = document.createElement('span');
      message.textContent = 'Aún no se han agregado artículos ni documentos.';
      emptyItem.appendChild(message);
      list.appendChild(emptyItem);
      return;
    }

    evidenceItems.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.className = 'evidence-list-item';
      const content = document.createElement('div');
      content.className = 'evidence-list-content';
      const title = document.createElement('strong');
      title.textContent = item.title || 'Evidencia sin título';
      content.appendChild(title);
      if (item.description) {
        const description = document.createElement('p');
        description.textContent = item.description;
        content.appendChild(description);
      }
      const metadata = document.createElement('small');
      const author = typeof item.author === 'string' ? item.author : 'Participante';
      const date = Number(item.createdAt)
        ? new Date(Number(item.createdAt)).toLocaleDateString('es-CO')
        : '';
      metadata.textContent = [author, date, item.pending ? 'Guardada localmente' : ''].filter(Boolean).join(' · ');
      content.appendChild(metadata);
      listItem.appendChild(content);
      try {
        const evidenceUrl = new URL(String(item.url || ''));
        if (['http:', 'https:'].includes(evidenceUrl.protocol)) {
          const link = document.createElement('a');
          link.href = evidenceUrl.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Abrir documento';
          link.setAttribute('aria-label', `Abrir evidencia: ${item.title || 'Documento'}`);
          listItem.appendChild(link);
        }
      } catch (error) {
        console.warn('Se omitió un enlace de evidencia no válido:', error);
      }
      list.appendChild(listItem);
    });
  }

  async function syncPendingEvidenceItems() {
    const projectId = currentProjectId;
    if (isSyncingPendingEvidences || !firebaseDb || !projectId
      || !canCurrentUserEditProject(lastRealtimeProject || {})) return;
    const pendingItems = loadLocalEvidenceItems(projectId)
      .filter((item) => item?.pending === true && item.id);
    if (!pendingItems.length) return;

    isSyncingPendingEvidences = true;
    try {
      for (const evidence of pendingItems) {
        if (projectId !== currentProjectId) return;
        const remoteEvidence = { ...evidence };
        delete remoteEvidence.id;
        delete remoteEvidence.pending;
        await firebaseDb.ref(`projects/${projectId}/evidences/${evidence.id}`).set(remoteEvidence);
        const remainingItems = loadLocalEvidenceItems(projectId)
          .filter((item) => item.id !== evidence.id);
        saveLocalEvidenceItems(remainingItems, projectId);
      }
      if (projectId === currentProjectId) {
        renderEvidenceList(lastRealtimeProject?.evidences || {});
        showToast('Las evidencias pendientes se compartieron con el proyecto');
      }
    } finally {
      isSyncingPendingEvidences = false;
    }
  }

  async function addProjectEvidence() {
    const titleInput = document.getElementById('evidenciaTitulo');
    const linkInput = document.getElementById('evidenciaLink');
    const descriptionInput = document.getElementById('evidenciaDescripcion');
    const title = String(titleInput?.value || '').trim();
    const rawUrl = String(linkInput?.value || '').trim();
    let url;
    try {
      url = new URL(rawUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    } catch (error) {
      showToast('Ingresa un enlace válido para la evidencia');
      linkInput?.focus();
      return;
    }
    if (!title) {
      showToast('Ingresa el título del artículo o documento');
      titleInput?.focus();
      return;
    }

    const projectId = currentProjectId;
    const key = firebaseDb?.ref(`projects/${projectId}/evidences`).push().key
      || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const evidence = {
      id: key,
      title,
      url: url.href,
      description: String(descriptionInput?.value || '').trim(),
      author: normalizeEmail(currentUser?.email) || 'Participante',
      createdAt: Date.now(),
      pending: true
    };
    const localItems = loadLocalEvidenceItems(projectId).filter((item) => item.id !== key);
    localItems.push(evidence);
    saveLocalEvidenceItems(localItems, projectId);
    renderEvidenceList(lastRealtimeProject?.evidences || {});
    if (titleInput) titleInput.value = '';
    if (linkInput) linkInput.value = '';
    if (descriptionInput) descriptionInput.value = '';

    try {
      if (!firebaseDb) throw new Error('Firebase no está disponible');
      const remoteEvidence = { ...evidence };
      delete remoteEvidence.id;
      delete remoteEvidence.pending;
      await firebaseDb.ref(`projects/${projectId}/evidences/${key}`).set(remoteEvidence);
      const syncedItems = loadLocalEvidenceItems(projectId)
        .filter((item) => item.id !== key);
      saveLocalEvidenceItems(syncedItems, projectId);
      showToast('Evidencia compartida con el proyecto');
    } catch (error) {
      console.error('No se pudo sincronizar la evidencia con Firebase:', error);
      showToast('La evidencia quedó guardada localmente y no se pudo compartir en Firebase');
    }
  }

  async function pickLocalProjectFolder() {
    if (!window.showDirectoryPicker) {
      showToast('La selección de carpeta local no está disponible en este navegador.');
      return null;
    }

    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      projectDirectoryHandle = handle;
      const folderName = handle.name || 'Carpeta local';
      const folderInput = document.getElementById('config-save-folder');
      if (folderInput) folderInput.value = folderName;
      const folderStatus = document.getElementById('config-local-folder-status');
      if (folderStatus) folderStatus.textContent = `Ubicación actual: ${folderName}`;
      return handle;
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.warn('No se pudo seleccionar la carpeta local:', error);
        showToast('No se pudo seleccionar la carpeta local');
      }
      return null;
    }
  }

  function openConfigModal(requireProjectFolder = false) {
    let modal = document.getElementById('modalConfiguracion');
    if (modal) {
      if (requireProjectFolder) modal.dataset.requireProjectFolder = 'true';
      modal.hidden = false;
      return;
    }

    const cfg = loadStoredConfig();
    const projectName = currentDocumentName || cfg.projectName || "";
    const authorEmail = normalizeEmail(cfg.authorEmail || currentUser?.email || '');
    const facilitatorEmail = normalizeEmail(
      cfg.facilitatorEmail
      || getProjectFacilitatorEmail(lastRealtimeProject || {})
      || document.getElementById('correo_facilitador')?.value
    );

    modal = document.createElement('div');
    modal.id = 'modalConfiguracion';
    modal.className = 'config-environment-modal';
    modal.dataset.requireProjectFolder = String(requireProjectFolder);
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '10%';
    modal.style.transform = 'translateX(-50%)';
    modal.style.zIndex = '10000';
    modal.style.width = 'min(560px, 92vw)';
    modal.style.minWidth = '0';
    modal.style.maxHeight = '85vh';
    modal.style.overflowY = 'auto';
    modal.style.boxSizing = 'border-box';
    modal.style.padding = '0';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0 20px 60px rgba(2,6,23,0.4)';
    modal.style.background = '#fff';
    modal.style.color = '#0f172a';
    modal.style.fontFamily = 'Arial, Helvetica, sans-serif';

    modal.innerHTML = `
      <div style="padding:18px 18px 8px">
        <h3 style="margin:0 0 8px 0">Configuración del entorno</h3>
        <div style="font-size:0.95rem; color:#334155; margin-bottom:12px">Ajusta el nombre del proyecto, la ubicación local del archivo y los enlaces de seguimiento.</div>
        <label style="display:block; margin-top:8px; font-weight:600">Nombre del proyecto</label>
        <input id="config-project-name" style="width:100%; box-sizing:border-box; padding:8px; margin-top:6px; border-radius:6px; border:1px solid #cbd5e1" placeholder="Nombre del proyecto" value="${escapeHtml(projectName)}">

        <label for="inputCorreoAutor" style="display:block; margin-top:10px; font-weight:600">Autor del proyecto (Correo institucional)</label>
        <input type="email" id="inputCorreoAutor" placeholder="usuario@cun.edu.co" class="form-control" style="width:100%; box-sizing:border-box; padding:8px; margin-top:6px; border-radius:6px; border:1px solid #cbd5e1" value="${escapeHtml(authorEmail)}">

        <label for="inputCorreoFacilitador" style="display:block; margin-top:10px; font-weight:600">Facilitador / Docente (Correo institucional)</label>
        <input type="email" id="inputCorreoFacilitador" placeholder="docente@cun.edu.co" class="form-control" style="width:100%; box-sizing:border-box; padding:8px; margin-top:6px; border-radius:6px; border:1px solid #cbd5e1" value="${escapeHtml(facilitatorEmail)}">

        <label style="display:block; margin-top:10px; font-weight:600">Ubicación local del proyecto</label>
        <div style="display:flex; gap:8px; margin-top:6px; align-items:center">
          <input id="config-save-folder" readonly style="flex:1; min-width:0; padding:8px; border-radius:6px; border:1px solid #cbd5e1; background:#f8fafc" placeholder="Selecciona la carpeta donde se guardará el proyecto" value="${escapeHtml(cfg.saveFolder || '')}">
          <button id="config-pick-folder" type="button" style="flex-shrink:0; padding:8px 12px; background:#0f172a; color:white; border:none; border-radius:8px; cursor:pointer">Buscar carpeta</button>
        </div>
        <div id="config-local-folder-status" style="margin-top:6px; font-size:0.85rem; color:#475569;">${cfg.saveFolder ? `Ubicación actual: ${escapeHtml(cfg.saveFolder)}` : 'Sin carpeta seleccionada'}</div>

        <label style="display:block; margin-top:10px; font-weight:600">Documento Word</label>
        <input id="config-word-url" style="width:100%; box-sizing:border-box; padding:8px; margin-top:6px; border-radius:6px; border:1px solid #cbd5e1" placeholder="URL de Google Docs o Word" value="${escapeHtml(cfg.wordUrl || '')}">

        <label style="display:block; margin-top:10px; font-weight:600">Link de Excel de seguimiento</label>
        <input id="config-excel-url" style="width:100%; box-sizing:border-box; padding:8px; margin-top:6px; border-radius:6px; border:1px solid #cbd5e1" placeholder="URL de Google Sheets" value="${escapeHtml(cfg.excelUrl || '')}">

        <label for="config-folder-url" style="display:block; margin-top:10px; font-weight:600">Carpeta de evidencias (Google Drive)</label>
        <input type="url" id="config-folder-url" placeholder="https://drive.google.com/drive/folders/..." class="form-control" style="width:100%; box-sizing:border-box; padding:8px; margin-top:6px; border-radius:6px; border:1px solid #cbd5e1" value="${escapeHtml(cfg.folderUrl || '')}">
      </div>

      <div class="config-modal-actions modal-actions" style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px; padding:12px 18px 18px; border-top:1px solid #e2e8f0; box-shadow:0 -4px 12px rgba(15,23,42,0.06)">
        <button id="config-cancel" style="padding:8px 12px; background:#e2e8f0; border:none; border-radius:8px; cursor:pointer">Cancelar</button>
        <button id="config-save" class="config-save-btn" type="button" style="padding:8px 12px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer" onclick="guardarConfiguracionProyecto(event)">Guardar</button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('config-pick-folder').addEventListener('click', async () => {
      await pickLocalProjectFolder();
    });

    document.getElementById('config-cancel').addEventListener('click', () => {
      modal.remove();
    });

    window.guardarConfiguracionProyecto = async (event) => {
      event?.preventDefault();
      const saveButton = document.getElementById('config-save');
      const newCfg = {
        projectName: document.getElementById('config-project-name')?.value.trim() || '',
        authorEmail: normalizeEmail(document.getElementById('inputCorreoAutor')?.value),
        facilitatorEmail: normalizeEmail(document.getElementById('inputCorreoFacilitador')?.value),
        saveFolder: document.getElementById('config-save-folder')?.value.trim() || '',
        wordUrl: document.getElementById('config-word-url')?.value.trim() || '',
        excelUrl: document.getElementById('config-excel-url')?.value.trim() || '',
        folderUrl: document.getElementById('config-folder-url')?.value.trim() || ''
      };
      if (!newCfg.projectName) {
        showToast('Ingresa el nombre del proyecto');
        document.getElementById('config-project-name').focus();
        return;
      }
      const authorEmailInput = document.getElementById('inputCorreoAutor');
      if (!newCfg.authorEmail || !authorEmailInput.checkValidity()) {
        showToast('Ingresa un correo válido para el autor del proyecto');
        authorEmailInput.focus();
        return false;
      }
      const facilitatorInput = document.getElementById('inputCorreoFacilitador');
      if (newCfg.facilitatorEmail && (!isInstitutionalEmail(newCfg.facilitatorEmail) || !facilitatorInput.checkValidity())) {
        showToast('Ingresa un correo institucional válido para el facilitador');
        facilitatorInput.focus();
        return false;
      }
      try {
        const firebase = ensureFirebase();
        if (!firebase || !firebaseDb) {
          throw new Error('Firebase no está disponible para guardar el proyecto');
        }
        const existingSnapshot = await firebaseDb.ref(`projects/${currentProjectId}`).once('value');
        const existingProject = existingSnapshot.val() || {};
        const firebaseProjectTitle = String(
          existingProject.projectName || existingProject.config?.projectName || existingProject.name || ''
        ).trim();
        const isFirstSave = modal.dataset.requireProjectFolder === 'true' || !firebaseProjectTitle;
        if (isFirstSave && !newCfg.saveFolder) {
          showToast('Selecciona la carpeta del proyecto');
          document.getElementById('config-pick-folder').focus();
          return false;
        }
        if (saveButton) saveButton.disabled = true;
        const projectFacilitatorInput = document.getElementById('correo_facilitador');
        if (projectFacilitatorInput) projectFacilitatorInput.value = newCfg.facilitatorEmail;
        saveStoredConfig(newCfg);
        const savedProject = await saveProjectToFirebase(newCfg);
        if (!savedProject) throw new Error('Firebase no confirmó el guardado de la configuración');
        actualizarBotonCarpetaEvidencias();
        const fileNameInput = document.getElementById('file-name-input');
        if (fileNameInput) fileNameInput.value = newCfg.projectName;
        setCurrentDocumentName(newCfg.projectName);
        modal.remove();
        console.log("-> Configuración del proyecto guardada exitosamente");
        showToast(savedProject.historySaved === false
          ? 'Proyecto guardado, pero no se pudo guardar el historial de cambios'
          : 'Configuración guardada con éxito');
        return savedProject;
      } catch (error) {
        console.error('No se pudo guardar la configuración del proyecto en Firebase:', error);
        showToast(String(error?.code || '').toLowerCase().includes('permission')
          ? 'No tienes permisos para modificar este proyecto'
          : error.message || 'No se pudo guardar la configuración. Inténtalo de nuevo.');
        return false;
      } finally {
        if (saveButton?.isConnected) saveButton.disabled = false;
      }
    };
    document.getElementById('config-save').onclick = (event) => window.guardarConfiguracionProyecto(event);
  }
  window.abrirModalConfiguracion = openConfigModal;

  function buildProjectHtml(payload) {
    const embeddedJson = JSON.stringify(payload).replace(/</g, "\\u003c");
    const projectUrl = new URL(APP_URL);
    projectUrl.searchParams.set('project', currentProjectId);
    const openUrl = projectUrl.href;
    const pageHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/jpeg" href="images/favicon.jpg">
  <meta name="siora-project-url" content="${openUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">
  <meta http-equiv="refresh" content="0; url=${openUrl}">
  <title>SI-ORA Proyecto Portable</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; margin: 24px; line-height: 1.5; }
    code, pre { white-space: pre-wrap; word-break: break-word; background: #f8f8f8; padding: 12px; border-radius: 6px; }
    .alert { background: #f3f4f6; padding: 16px; border-left: 4px solid #2563eb; margin-bottom: 16px; }
    .btn { display: inline-block; margin: 6px 6px 0 0; padding: 10px 16px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; }
    .info { margin-top: 16px; padding: 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; }
  </style>
</head>
<body>
  <h1>SI-ORA Proyecto Portable</h1>
  <div class="alert">
    Este archivo contiene todos los datos guardados del proyecto.
    La aplicación está abriendo automáticamente la versión web con esta información.
  </div>
  <section>
    <h2>Resumen rápido</h2>
    <p><strong>Título:</strong> ${payload.fields?.titulo_origen || "(sin definir)"}</p>
    <p><strong>Fecha exportación:</strong> ${new Date(payload.timestamp).toLocaleString()}</p>
  </section>
  <a class="btn" href="${openUrl}">Abrir en SI-ORA</a>
  <a class="btn" id="load-data">Mostrar datos del proyecto</a>
  <a class="btn" id="download-json">Descargar JSON del proyecto</a>
  <div class="info">
    <p><strong>Nota:</strong> Si el botón "Abrir en SI-ORA" no funciona, abre el archivo <code>index.html</code> de la aplicación e importa el JSON descargado.</p>
  </div>
  <pre id="raw-json"></pre>
  <script>
    const projectData = ${embeddedJson};
    const targetUrl = ${JSON.stringify(openUrl)};
    if (window.location.href.indexOf('https://si-ora.web.app/') === -1) {
      window.location.replace(targetUrl);
    }
    document.getElementById('load-data').addEventListener('click', () => {
      const text = JSON.stringify(projectData, null, 2);
      document.getElementById('raw-json').textContent = text;
      alert('Datos listos. Si necesitas, descarga el JSON y úsalo en la app SI-ORA.');
    });
    document.getElementById('download-json').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'si_ora_proyecto_exportado.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  </script>
</body>
</html>`;
    return pageHtml;
  }

  function parseProjectDataFromText(text) {
    try {
      const json = JSON.parse(text);
      if (json?.fields) return json;
    } catch (ignored) {
      const regex = /const projectData = (\{[\s\S]*?\});/;
      const match = text.match(regex);
      if (match) {
        try {
          return JSON.parse(match[1]);
        } catch (parseError) {
          console.warn('Error parseando JSON embebido del HTML:', parseError);
        }
      }
    }
    return null;
  }

  function loadProjectHashData() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('project') || urlParams.has('projectId') || urlParams.has('id')) return;
    const hash = window.location.hash || "";
    const prefix = "#projectData=";
    if (!hash.startsWith(prefix)) return;

    const encoded = hash.slice(prefix.length);
    try {
      const decoded = decodeURIComponent(Array.prototype.map.call(atob(encoded), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const data = JSON.parse(decoded);
      if (data?.fields) {
        activateProject(data.projectId || createProjectId(), data.fields.titulo_origen || "");
        window.sioraDynamicSectionsPendientes = data.dynamicSections || null;
        clearFormState(false);
        window.reiniciarFichasDinamicas?.();
        pendingFormFields = null;
        populateFormState(data.fields, data.analysisLevels);
        window.restaurarFichasDinamicas?.(data.dynamicSections);
        saveFormState();
        renderProjectSummary();
        window.sincronizarReplicasIniciales?.();
        if (document.getElementById('file-name-input') && data.fields.titulo_origen) {
          resetDirtyState(data.fields.titulo_origen);
          document.getElementById('file-name-input').value = document.getElementById('file-name-input').value;
        }
      }
      if (data?.config) {
        saveStoredConfig(data.config);
        applyStoredConfig();
      }
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (error) {
      console.warn('No se pudo cargar projectData desde hash', error);
    }
  }

  function buildShareText(asArticle = false) {
    const titulo = (document.getElementById("titulo_origen")?.value || "").trim();
    const pregunta = (document.querySelector(".pregunta-problema-origen")?.value || "").trim();
    const integrantes = [];

    for (let i = 1; i <= TEAM_SIZE; i++) {
      const nombre = (document.getElementById(`nombre_${i}`)?.value || "").trim();
      const apellido = (document.getElementById(`apellido_${i}`)?.value || "").trim();
      const programa = (document.getElementById(`programa_${i}`)?.value || "").trim();
      const asignatura = (document.getElementById(`codigo_${i}`)?.value || "").trim();
      const part = (document.getElementById(`part_${i}`)?.value || "").trim();

      if (!(nombre || apellido || programa || asignatura)) continue;
      integrantes.push(`${i}. ${nombre} ${apellido} | ${programa} | ${asignatura} | ${part}`.trim());
    }

    if (asArticle) {
      return [
        "SI-ORA - BORRADOR BASE",
        "",
        `Titulo del proyecto: ${titulo || "(sin definir)"}`,
        "",
        "Equipo de trabajo:",
        integrantes.length ? integrantes.join("\n") : "Sin integrantes registrados.",
        "",
        "Pregunta problema:",
        pregunta || "(sin definir)",
        "",
        `Fecha de exportacion: ${new Date().toLocaleString()}`
      ].join("\n");
    }

    return [
      "Resumen SI-ORA",
      `Titulo: ${titulo || "(sin definir)"}`,
      `Pregunta: ${pregunta || "(sin definir)"}`,
      "Equipo:",
      integrantes.length ? integrantes.join("\n") : "Sin integrantes registrados."
    ].join("\n");
  }

  function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const offset = target.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }

  window.scrollToSection = scrollToSection;

  function renderProjectSummary() {
    let panel = document.getElementById("quick-summary-panel");
    if (!panel) {
      panel = document.createElement("aside");
      panel.id = "quick-summary-panel";
      panel.className = "quick-summary-panel";
      document.body.appendChild(panel);
    }

    const titulo = (document.getElementById("titulo_origen")?.value || "").trim();
    const pregunta = (document.querySelector(".pregunta-problema-origen")?.value || "").trim();
    const activos = countActiveMembers();
    const cfg = loadStoredConfig();
    const saveFolder = cfg.saveFolder || "";

    panel.innerHTML = `
      <div class="summary-header">
        <h4>Resumen rápido</h4>
        <button type="button" class="summary-close-btn" aria-label="Cerrar resumen rápido">×</button>
      </div>
      <div class="summary-actions">
        <button type="button" class="btn-nav-item btn-nav-variables summary-action-btn summary-variables-btn" onclick="scrollToSection('variables-titulo')">Variables / Título</button>
        <div class="summary-section">
          <button type="button" class="summary-action-btn summary-parent-btn summary-observation-btn" data-target="seccion-observacion">Observación</button>
          <div class="summary-subactions">
            <button type="button" class="summary-action-btn" data-target="seccion_introduccion">Introducción</button>
            <button type="button" class="summary-action-btn" data-target="seccion_objetivos">Objetivos</button>
          </div>
        </div>
        <div class="summary-section">
          <button type="button" class="summary-action-btn summary-parent-btn summary-reflection-btn" data-target="seccion-reflexion">Reflexión</button>
          <div class="summary-subactions">
            <button type="button" class="summary-action-btn" data-target="seccion_metodologia">Metodología</button>
            <button type="button" class="summary-action-btn" data-target="seccion_resultados">Análisis de resultados</button>
          </div>
        </div>
        <div class="summary-section">
          <button type="button" class="summary-action-btn summary-parent-btn summary-application-btn" data-target="seccion-aplicacion">Aplicación</button>
          <div class="summary-subactions">
            <button type="button" class="summary-action-btn" data-target="seccion_conclusiones">Conclusiones</button>
            <button type="button" class="summary-action-btn" data-target="seccion_referentes">Referentes</button>
          </div>
        </div>
      </div>
      <hr class="summary-divider">
      <div class="summary-metadata">
        <p><strong>Integrantes activos:</strong> ${activos}/${TEAM_SIZE}</p>
        <p><strong>Título:</strong> ${titulo ? truncateText(titulo, 90) : "Sin definir"}</p>
        <p><strong>Pregunta:</strong> ${pregunta ? truncateText(pregunta, 90) : "Sin definir"}</p>
        ${saveFolder ? `<p><strong>Carpeta del proyecto:</strong> <span class="summary-folder-link">${saveFolder}</span></p>` : ""}
        ${cfg.wordUrl ? `<p><strong>Word:</strong> <a class="summary-link" href="${cfg.wordUrl}" target="_blank">Abrir documento</a></p>` : ""}
        ${cfg.excelUrl ? `<p><strong>Excel:</strong> <a class="summary-link" href="${cfg.excelUrl}" target="_blank">Abrir seguimiento</a></p>` : ""}
      </div>
    `;

    panel.querySelectorAll(".summary-action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        scrollToSection(targetId);
      });
    });

    const closeBtn = panel.querySelector('.summary-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.classList.remove('visible');
      });
    }
  }

  function countActiveMembers() {
    let active = 0;
    for (let i = 1; i <= TEAM_SIZE; i++) {
      const nombre = (document.getElementById(`nombre_${i}`)?.value || "").trim();
      const apellido = (document.getElementById(`apellido_${i}`)?.value || "").trim();
      if (nombre || apellido) active++;
    }
    return active;
  }

  function truncateText(text, maxLen) {
    if (text.length <= maxLen) return text;
    return `${text.slice(0, maxLen - 1)}...`;
  }

  function showToast(message) {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "app-toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }
});

console.log("SI-ORA: Módulo de autenticación y eventos inicializado correctamente.");