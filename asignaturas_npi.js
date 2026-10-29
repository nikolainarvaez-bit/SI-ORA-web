const PROGRAMAS_ACADEMICOS = [
  "Ingeniería Industrial",
  "Ingeniería Electrónica",
  "Ingeniería Sistemas",
  "Producción de Medios Audiovisuales",
  "Comunicación Social",
  "Diseño Modas",
  "Diseño Gráfico",
  "Mercadeo y Publicidad",
  "Administración de Empresas",
  "Contabilidad Pública",
  "Administración de Empresas Agropecuarias",
  "Administración Deportiva",
  "Seguridad Social",
  "Administración de Servicios de la Salud",
  "Administración Pública",
  "Derecho"
];

const CODIGOS_ASIGNATURAS = [
  "50123",
  "54578",
  "54582",
  "54584",
  "54586",
  "54571*",
  "53322*",
  "53328*",
  "53330*",
  "53332*",
  "Opción de Grado",
  "Docente / otro usuario"
];

const ASIGNATURAS_NPI = {
  "Ingeniería Industrial": [
    "Sistemas de Registro de Procesos",
    "Métodos y tiempos",
    "Logística interna",
    "Gestión de procesos productivos y administrativos",
    "Control de procesos productivos y administrativos",
    "Simulación de procesos",
    "Planeación y control de la producción",
    "Investigación de operaciones"
  ],
  "Ingeniería Electrónica": [
    "Algoritmos de programación",
    "Taller de aplicaciones electrónicas",
    "Análisis y síntesis de circuitos",
    "Instrumentación virtual y laboratorio",
    "Control analógico",
    "Control digital"
  ],
  "Ingeniería Sistemas": [
    "Arquitectura y mantenimiento de computadores",
    "Mantenimiento de sistemas operativos",
    "Cableado estructurado",
    "Instrumentación virtual y laboratorio",
    "Requisitos de software",
    "Diseño de software",
    "Gestión de bases de datos",
    "Calidad de software",
    "Inteligencia de negocios",
    "Gerencia de proyectos informaticos"
  ],
  "Producción de Medios Audiovisuales": [
    "Realización Audiovisual",
    "Documental",
    "Cortometraje",
    "Dirección audiovisual",
    "Realización de televisión",
    "Estrategias de Contenidos de Nuevos Medios",
    "Realización documental en narrativas transmedia",
    "Generos Cinematográficos",
    "Dirección General"
  ],
  "Comunicación Social": [
    "Lenguaje visual y sonoro",
    "Generos periodísticos",
    "Periodismo digital",
    "Producción de radio y televisión",
    "Gestión de Comunicación Interna",
    "Comunicación alternativa y comunitaria",
    "Gestión de Comunicación Externa",
    "Periodismo investigativo",
    "Periodismo documental"
  ],
  "Diseño Modas": [
    "Fundamentos textiles",
    "Ilustración de moda",
    "Creación Básica",
    "Taller Creativo"
  ],
  "Diseño Gráfico": [
    "Creación Básica y color",
    "Diseño y Composición Tipográfica",
    "Maquetación, Editorial y Publicaciones",
    "Diseño de Identidad Corporativa y Señalética",
    "Diseño de Información Aplicada",
    "Diseño y gestión de productos publicitarios",
    "Proyectos gráficos, generación y estructura",
    "Producción de Arte y Comunicación Gráfica",
    "Gerencia de Diseño y Portafolio"
  ],
  "Mercadeo y Publicidad": [
    "Fundamentos de Publicidad",
    "Programación Básica Brief y estrategia creativa",
    "Servicio al cliente",
    "Diseño publicitario",
    "Diseño de Información Aplicada",
    "Campañas Publicitarias",
    "Estrategia de Marca (branding)",
    "Plan de Mercadeo",
    "Gerencia de Publicidad"
  ],
  "Administración de Empresas": [
    "Proceso administrativo",
    "Procesos de la producción y operacionales",
    "Planeación estratégica",
    "Administración de la producción y operacionales",
    "Innovación y modelos gerenciales",
    "Planeación Prospectiva",
    "Responsabilidad social empresarial"
  ],
  "Contabilidad Pública": [
    "Procesos contables",
    "Procedimiento tributario",
    "Impuestos Departamentales y Municipales",
    "Auditoría General",
    "Auditoría Tributaria",
    "Auditoría de Gestión y Ambiental",
    "Auditoría Financiera",
    "Planeación tributaria"
  ],
  "Administración de Empresas Agropecuarias": [
    "Sistema de Producción Agrícola",
    "Sistema de Producción Pecuaria",
    "Agrocadenas Productivas",
    "Agroturismo",
    "Gestión de procesos Agroindustriales",
    "Gerencia de Procesos Agroindustriales",
    "Desarrollo Rural",
    "Plan de Mercadeo",
    "Modelos de Desarrollo Sostenible"
  ],
  "Administración Deportiva": [
    "Proceso Administrativo",
    "Logística de eventos deportivos",
    "Clasificación y contexto administrativo de los deportes",
    "Gestión de Espacios Deportivos",
    "Gestión de Operaciones Deportivas",
    "Innovación y Modelos Gerenciales",
    "Dirección de entidades deportivas",
    "Gestión de Grandes Eventos y Escenarios Deportivos"
  ],
  "Seguridad Social": [
    "Atención al Usuario",
    "Herramientas Financieras",
    "Gerencia del Capital Social",
    "Comunicación Organizacional",
    "Planeación Estratégica",
    "Sistemas de Información de Seguridad Social",
    "Auditoría en Interventoría en Procesos de Calidad",
    "Administración Financiera de Recurso del Sistema"
  ],
  "Administración de Servicios de la Salud": [
    "Administración Pública de Servicios de Salud",
    "Análisis de la Salud",
    "Gestión de Empresas de Salud",
    "Epidemiología en la Gestión Administrativa",
    "Demografía y Salud",
    "Gerencia de la Calidad en Servicios de Salud",
    "Interventoría en Empresas de Salud",
    "Evaluación en proyectos en Salud"
  ],
  "Administración Pública": [
    "Auditoría Pública",
    "Diseño e implementación de Proyectos de Desarrollo",
    "Derecho administrativo",
    "Administración de Bienes",
    "Presupuesto Municipal",
    "Planeación y Gestión del Desarrollo Social Territorial",
    "Administración de la Calidad y Control",
    "Contabilidad gubernamental"
  ],
  "Derecho": [
    "Público",
    "Privado",
    "Penal"
  ]
};

Object.freeze(PROGRAMAS_ACADEMICOS);
Object.freeze(CODIGOS_ASIGNATURAS);
Object.freeze(ASIGNATURAS_NPI);
Object.keys(ASIGNATURAS_NPI).forEach((k) => Object.freeze(ASIGNATURAS_NPI[k]));

window.PROGRAMAS_ACADEMICOS = PROGRAMAS_ACADEMICOS;
window.CODIGOS_ASIGNATURAS = CODIGOS_ASIGNATURAS;
window.ASIGNATURAS_NPI = ASIGNATURAS_NPI;