/* ===========================================================
   Trayecto — lógica
   Un objeto `estado`, una función render(). Cada acción toca
   el estado y vuelve a renderizar. Persistencia: localStorage.
   =========================================================== */

const CLAVE = 'trayecto.v2';

const AREAS = ['Tecnología', 'Datos', 'Diseño', 'Marketing', 'Comunicación', 'Administración', 'Legales', 'Producto'];

const COLUMNAS = [
  { id: 'guardada', nombre: 'Guardadas' },
  { id: 'postulada', nombre: 'Postulado' },
  { id: 'entrevista', nombre: 'Entrevista' },
  { id: 'cerrada', nombre: 'Cerradas' }
];

const NIVELES = [
  { min: 0, nombre: 'Ingresante' },
  { min: 70, nombre: 'Cursante' },
  { min: 150, nombre: 'Avanzado' },
  { min: 260, nombre: 'Tesista' },
  { min: 400, nombre: 'Graduado' }
];

/* Avisos de ejemplo. Las empresas son ficticias. */
const OPORTUNIDADES = [
  { id: 'o1', empresa: 'Nube Austral', puesto: 'Pasantía en desarrollo frontend', area: 'Tecnología', modalidad: 'Híbrido', ciudad: 'CABA', tipo: 'Pasantía', horas: 20, pago: '$ 520.000 / mes', dias: 2, skills: ['JavaScript', 'HTML/CSS', 'Git', 'React'], requisito: 'Alumno regular de Sistemas o afines, 40% de materias aprobadas.', desc: 'Sumate al equipo que mantiene el portal de clientes. Arrancás con bugs chicos y terminás publicando pantallas propias.' },
  { id: 'o2', empresa: 'Vera Analytics', puesto: 'Pasantía en análisis de datos', area: 'Datos', modalidad: 'Remoto', ciudad: 'Remoto (AR)', tipo: 'Pasantía', horas: 20, pago: '$ 480.000 / mes', dias: 1, skills: ['SQL', 'Excel', 'Power BI', 'Estadística'], requisito: 'Estadística, Economía, Visualización de Datos o Sistemas. Desde 3.º año.', desc: 'Armás reportes para clientes de retail: limpieza de datos, tableros y una reunión semanal donde contás qué encontraste.' },
  { id: 'o3', empresa: 'Estudio Caldén', puesto: 'Pasantía en derecho corporativo', area: 'Legales', modalidad: 'Presencial', ciudad: 'CABA', tipo: 'Pasantía', horas: 20, pago: '$ 450.000 / mes', dias: 4, skills: ['Redacción jurídica', 'Investigación', 'Word', 'Inglés'], requisito: 'Derecho con Contratos y Societario aprobadas. Certificado de alumno regular.', desc: 'Búsqueda de jurisprudencia, borradores de contratos y seguimiento de expedientes junto a dos asociados.' },
  { id: 'o4', empresa: 'Taller Rivas', puesto: 'Pasantía en diseño gráfico', area: 'Diseño', modalidad: 'Híbrido', ciudad: 'Rosario', tipo: 'Pasantía', horas: 20, pago: '$ 430.000 / mes', dias: 6, skills: ['Figma', 'Illustrator', 'Branding', 'Tipografía'], requisito: 'Diseño Gráfico o Comunicación Visual, desde 2.º año. Pedimos portfolio, no CV.', desc: 'Identidad visual para marcas chicas: piezas de marca, sistemas tipográficos y mucha corrección en conjunto.' },
  { id: 'o5', empresa: 'Mercado Pampa', puesto: 'Trainee de marketing digital', area: 'Marketing', modalidad: 'Híbrido', ciudad: 'CABA', tipo: 'Trainee', horas: 30, pago: '$ 720.000 / mes', dias: 3, skills: ['Google Analytics', 'SEO', 'Meta Ads', 'Redacción'], requisito: 'Últimos años o recién recibido. Programa de 12 meses.', desc: 'Campañas de adquisición para el canal propio. Medís, escribís y proponés.' },
  { id: 'o6', empresa: 'Fundación Semilla', puesto: 'Voluntariado en comunicación', area: 'Comunicación', modalidad: 'Remoto', ciudad: 'Remoto (AR)', tipo: 'Voluntariado', horas: 8, pago: 'Ad honorem + certificado', dias: 9, skills: ['Redes sociales', 'Canva', 'Redacción'], requisito: 'Cualquier carrera. Ideal para una primera experiencia y una carta de recomendación.', desc: 'Contás lo que hacen los programas educativos de la fundación en redes y en el newsletter mensual.' },
  { id: 'o7', empresa: 'Andina Pagos', puesto: 'Pasantía en QA / testing', area: 'Tecnología', modalidad: 'Remoto', ciudad: 'Remoto (AR)', tipo: 'Pasantía', horas: 20, pago: '$ 500.000 / mes', dias: 5, skills: ['Testing manual', 'Jira', 'SQL', 'Inglés'], requisito: 'Sistemas o afines desde 2.º año. Entrenamiento inicial pago de dos semanas.', desc: 'Probás cada release del checkout antes de que salga: casos de prueba, reportes de bugs y regresión.' },
  { id: 'o8', empresa: 'Cooperativa Sur', puesto: 'Pasantía administrativa', area: 'Administración', modalidad: 'Presencial', ciudad: 'La Plata', tipo: 'Pasantía', horas: 20, pago: '$ 410.000 / mes', dias: 8, skills: ['Excel', 'Facturación', 'Organización'], requisito: 'Administración, Contador o Economía. Desde 1.º año.', desc: 'Carga de facturas, conciliaciones simples y armado del reporte mensual para la comisión directiva.' },
  { id: 'o9', empresa: 'Delta Studio', puesto: 'Pasantía en UX/UI', area: 'Diseño', modalidad: 'Remoto', ciudad: 'Remoto (AR)', tipo: 'Pasantía', horas: 20, pago: '$ 490.000 / mes', dias: 1, skills: ['Figma', 'Research', 'Prototipado', 'Accesibilidad'], requisito: 'Diseño, Multimedia o afines. Se evalúa un ejercicio corto, no el promedio.', desc: 'Entrevistás usuarios, prototipás y testeás flujos de una app de salud. Cada sprint cierra con una demo tuya.' },
  { id: 'o10', empresa: 'Grupo Litoral', puesto: 'Beca estímulo en investigación', area: 'Datos', modalidad: 'Híbrido', ciudad: 'Córdoba', tipo: 'Beca estímulo', horas: 16, pago: '$ 380.000 / mes', dias: 12, skills: ['Estadística', 'R', 'Redacción académica', 'Excel'], requisito: 'Promedio mínimo 7 y 60% de materias aprobadas. Beca de 12 meses renovable.', desc: 'Trabajás con un equipo de investigación en modelos de rendimiento agrícola y firmás como coautor del informe.' },
  { id: 'o11', empresa: 'Kiosco Digital', puesto: 'Community manager part-time', area: 'Comunicación', modalidad: 'Remoto', ciudad: 'Remoto (AR)', tipo: 'Part-time', horas: 15, pago: '$ 350.000 / mes', dias: 2, skills: ['Instagram', 'Canva', 'Copywriting', 'Edición de video'], requisito: 'Sin experiencia previa. Pedimos tres ejemplos de contenido propio.', desc: 'Manejás las redes de tres marcas gastronómicas: calendario, piezas y respuesta a mensajes.' },
  { id: 'o12', empresa: 'Sistemas Ñandú', puesto: 'Pasantía en soporte IT', area: 'Tecnología', modalidad: 'Presencial', ciudad: 'CABA', tipo: 'Pasantía', horas: 24, pago: '$ 460.000 / mes', dias: 7, skills: ['Redes', 'Windows', 'Atención al usuario', 'Hardware'], requisito: 'Sistemas o tecnicatura afín. Turno mañana fijo.', desc: 'Primera línea de soporte para 200 puestos de trabajo: tickets, instalaciones y documentación interna.' },
  { id: 'o13', empresa: 'Bruma Agencia', puesto: 'Pasantía en producción audiovisual', area: 'Comunicación', modalidad: 'Presencial', ciudad: 'CABA', tipo: 'Pasantía', horas: 20, pago: '$ 440.000 / mes', dias: 10, skills: ['Premiere', 'Fotografía', 'Producción', 'Edición de video'], requisito: 'Comunicación, Cine o Diseño Multimedia. Rodajes ocasionales de fin de semana.', desc: 'Asistís en rodajes publicitarios y editás los cortes cortos para redes.' },
  { id: 'o14', empresa: 'Vialtec', puesto: 'Trainee de producto', area: 'Producto', modalidad: 'Híbrido', ciudad: 'CABA', tipo: 'Trainee', horas: 30, pago: '$ 690.000 / mes', dias: 3, skills: ['Análisis', 'Notion', 'Comunicación', 'SQL'], requisito: 'Últimos años de cualquier carrera. Buscamos criterio, no experiencia.', desc: 'Acompañás a un product manager: entrevistas con usuarios, métricas de uso y redacción de requerimientos.' },
  { id: 'o15', empresa: 'Estudio Belgrano', puesto: 'Pasantía en compliance', area: 'Legales', modalidad: 'Híbrido', ciudad: 'CABA', tipo: 'Pasantía', horas: 20, pago: '$ 470.000 / mes', dias: 6, skills: ['Normativa', 'Excel', 'Inglés', 'Investigación'], requisito: 'Derecho o Administración desde 3.º año. Inglés intermedio excluyente.', desc: 'Revisión de proveedores, matrices de riesgo y armado de informes para el área de cumplimiento.' },
  { id: 'o16', empresa: 'Raíz Alimentos', puesto: 'Pasantía comercial', area: 'Administración', modalidad: 'Presencial', ciudad: 'Mendoza', tipo: 'Pasantía', horas: 20, pago: '$ 420.000 / mes', dias: 11, skills: ['Negociación', 'Excel', 'CRM', 'Comunicación'], requisito: 'Administración, Comercialización o Agronomía. Se valora manejo de auto.', desc: 'Acompañás al equipo comercial en visitas a distribuidores y mantenés al día la cartera en el CRM.' }
];

const PERFIL_EJEMPLO = {
  nombre: 'Marcos',
  universidad: 'Universidad de Palermo',
  carrera: 'Visualización de Datos',
  anio: '3',
  avance: 45,
  horas: 20,
  modalidad: 'Híbrido',
  ciudad: 'CABA',
  bio: 'Estudio Visualización de Datos y Derecho. Armo tableros en Power BI para trabajos de cursada y hago identidad visual para proyectos chicos.',
  cv: '',
  areas: ['Datos', 'Diseño', 'Legales'],
  skills: ['Power BI', 'Excel', 'Estadística', 'Figma'],
  proyectos: [
    'Dashboard de ventas de una librería en Power BI (TP grupal, UP)',
    'Identidad visual para un emprendimiento de café de especialidad'
  ]
};

/* ---------------------- estado ---------------------- */

const estado = {
  vista: 'oportunidades',
  perfil: clonar(PERFIL_EJEMPLO),
  filtros: { texto: '', area: 'Todas', soloMatch: false, soloHoras: false },
  postulaciones: {},
  objetivos: [],
  racha: { dias: 1, ultima: hoy() },
  altaObjetivo: false,
  confirmar: null
};

function clonar(o) { return JSON.parse(JSON.stringify(o)); }
function hoy() { return new Date().toISOString().slice(0, 10); }

/* ---------------------- persistencia ---------------------- */

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({
      perfil: estado.perfil,
      postulaciones: estado.postulaciones,
      objetivos: estado.objetivos,
      racha: estado.racha
    }));
  } catch (e) { /* el navegador puede bloquear el storage: seguimos en memoria */ }
}

function cargar() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return;
    const d = JSON.parse(crudo);
    if (d.perfil) estado.perfil = Object.assign(clonar(PERFIL_EJEMPLO), d.perfil);
    if (d.postulaciones) estado.postulaciones = d.postulaciones;
    if (Array.isArray(d.objetivos)) estado.objetivos = d.objetivos;
    if (d.racha) estado.racha = d.racha;
  } catch (e) { /* datos corruptos: arrancamos de cero */ }
}

// La racha cuenta días distintos con actividad, no sesiones.
function actualizarRacha() {
  const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (estado.racha.ultima === hoy()) return;
  estado.racha.dias = estado.racha.ultima === ayer ? estado.racha.dias + 1 : 1;
  estado.racha.ultima = hoy();
  guardar();
}

/* ---------------------- cálculos ---------------------- */

function normalizar(t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
function tieneSkill(s) { return estado.perfil.skills.some(x => normalizar(x) === normalizar(s)); }

// Desglose del match: 55 skills + 25 área + 12 modalidad + 8 horas.
function desglosar(op) {
  const coinciden = op.skills.filter(tieneSkill);
  const faltan = op.skills.filter(s => !tieneSkill(s));
  const pSkills = op.skills.length ? Math.round((coinciden.length / op.skills.length) * 55) : 0;

  const areaOk = estado.perfil.areas.includes(op.area);
  const pArea = areaOk ? 25 : 0;

  const pref = estado.perfil.modalidad;
  let pModalidad = 0;
  if (pref === 'Indistinto') pModalidad = 8;
  else if (pref === op.modalidad) pModalidad = 12;
  else if (pref !== 'Presencial' && op.modalidad !== 'Presencial') pModalidad = 6;

  const horasOk = Number(estado.perfil.horas) >= op.horas;
  const pHoras = horasOk ? 8 : 0;

  return {
    total: Math.min(100, pSkills + pArea + pModalidad + pHoras),
    coinciden, faltan, areaOk, horasOk,
    modalidadOk: pModalidad >= 8,
    pSkills, pArea, pModalidad, pHoras
  };
}

function conMatch() {
  return OPORTUNIDADES.map(op => {
    const d = desglosar(op);
    return Object.assign({}, op, { match: d.total, d: d });
  }).sort((a, b) => b.match - a.match || a.dias - b.dias);
}

function contarMatchAlto() { return conMatch().filter(o => o.match >= 70).length; }

function filtradas() {
  const f = estado.filtros;
  const texto = normalizar(f.texto);
  return conMatch().filter(op => {
    if (f.area !== 'Todas' && op.area !== f.area) return false;
    if (f.soloMatch && op.match < 70) return false;
    if (f.soloHoras && Number(estado.perfil.horas) < op.horas) return false;
    if (!texto) return true;
    return normalizar(op.puesto + ' ' + op.empresa + ' ' + op.area + ' ' + op.ciudad + ' ' + op.skills.join(' ')).includes(texto);
  });
}

function brechas() {
  const relevantes = conMatch().filter(o => o.match >= 40).slice(0, 10);
  const conteo = {};
  relevantes.forEach(op => op.d.faltan.forEach(s => { conteo[s] = (conteo[s] || 0) + 1; }));
  const total = relevantes.length || 1;
  return Object.keys(conteo)
    .map(s => ({ skill: s, veces: conteo[s], total: relevantes.length, pct: Math.round((conteo[s] / total) * 100) }))
    .sort((a, b) => b.veces - a.veces)
    .slice(0, 5);
}

const CAMPOS_PERFIL = ['nombre', 'universidad', 'carrera', 'ciudad', 'bio', 'anio', 'horas', 'avance'];

function camposCompletos() {
  return CAMPOS_PERFIL.filter(c => String(estado.perfil[c] || '').trim().length > 0).length;
}

function pasosHechos() { return estado.objetivos.reduce((n, o) => n + o.pasos.filter(p => p.hecho).length, 0); }
function totalPasos() { return estado.objetivos.reduce((n, o) => n + o.pasos.length, 0); }
function postuladas() { return Object.values(estado.postulaciones).filter(e => e === 'postulada' || e === 'entrevista').length; }

// Los puntos se derivan del estado: nada es un contador inventado.
function puntos() {
  const p = estado.perfil;
  let n = 0;
  n += p.skills.length * 6;
  n += p.proyectos.length * 12;
  n += camposCompletos() * 8;
  n += estado.objetivos.length * 5;
  n += pasosHechos() * 8;
  Object.values(estado.postulaciones).forEach(e => {
    n += e === 'entrevista' ? 30 : e === 'postulada' ? 15 : e === 'cerrada' ? 5 : 3;
  });
  if (String(p.cv || '').trim()) n += 10;
  return n;
}

function nivelDe(pts) {
  let i = 0;
  NIVELES.forEach((n, k) => { if (pts >= n.min) i = k; });
  return i;
}

/* ---------------------- misiones ---------------------- */

function misiones() {
  return [
    { t: 'Llegá a 6 skills cargadas', hecho: estado.perfil.skills.length >= 6, prog: Math.min(estado.perfil.skills.length, 6) + '/6' },
    { t: 'Sumá un proyecto o evidencia más', hecho: estado.perfil.proyectos.length >= 3, prog: Math.min(estado.perfil.proyectos.length, 3) + '/3' },
    { t: 'Postulate a 2 búsquedas', hecho: postuladas() >= 2, prog: Math.min(postuladas(), 2) + '/2' },
    { t: 'Completá 3 pasos de tus objetivos', hecho: pasosHechos() >= 3, prog: Math.min(pasosHechos(), 3) + '/3' },
    { t: 'Escribí tu presentación (80+ caracteres)', hecho: (estado.perfil.bio || '').length >= 80, prog: Math.min((estado.perfil.bio || '').length, 80) + '/80' }
  ];
}

/* ---------------------- próximo paso ---------------------- */

function proximoPaso() {
  const b = brechas();
  const faltantes = CAMPOS_PERFIL.filter(c => !String(estado.perfil[c] || '').trim());

  if (faltantes.length) {
    return { micro: 'Empezá por acá', titulo: 'Completá tu perfil', texto: 'Te faltan ' + faltantes.length + ' datos de cursada. Cada uno suma 8 puntos y afina el match.', boton: 'Ir al perfil', accion: 'ir-perfil' };
  }
  if (estado.perfil.skills.length < 6 && b.length) {
    return { micro: 'La que más te mueve la aguja', titulo: 'Sumá ' + b[0].skill, texto: 'La piden ' + b[0].veces + ' de las búsquedas que mejor matchean con vos. Si ya la usaste en la facultad, cargala.', boton: 'Sumar ' + b[0].skill, accion: 'sumar-skill-directo', id: b[0].skill };
  }
  if (!estado.objetivos.length && b.length) {
    return { micro: 'Para que el match suba solo', titulo: 'Abrí un objetivo con ' + b[0].skill, texto: 'Cuatro pasos concretos para pasar de "no la tengo" a "la puedo mostrar".', boton: 'Crear objetivo', accion: 'sumar-brecha', id: b[0].skill };
  }
  if (postuladas() === 0) {
    const mejor = conMatch()[0];
    return { micro: 'Ya estás en condiciones', titulo: 'Postulate a ' + mejor.puesto, texto: mejor.empresa + ' · ' + mejor.match + '% de match. Es la búsqueda que mejor encaja con tu perfil hoy.', boton: 'Ver la búsqueda', accion: 'ir-oportunidades' };
  }
  const pendiente = estado.objetivos.flatMap(o => o.pasos).find(p => !p.hecho);
  if (pendiente) {
    return { micro: 'Lo tenés a mano', titulo: 'Tachá un paso', texto: '"' + pendiente.t + '". Son 8 puntos y te acerca al próximo nivel.', boton: 'Bajar a mis objetivos', accion: 'nada' };
  }
  return { micro: 'Vas bien', titulo: 'Sumá una evidencia nueva', texto: 'Un TP, un freelance o un voluntariado que todavía no esté cargado. Cada uno suma 12 puntos.', boton: 'Ir al perfil', accion: 'ir-perfil' };
}

/* ---------------------- DOM ---------------------- */

const $ = s => document.querySelector(s);

function crear(tag, clase, texto) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function boton(texto, accion, id, clase) {
  const b = crear('button', 'btn btn-chico ' + (clase || 'btn-fantasma'), texto);
  b.type = 'button';
  b.dataset.accion = accion;
  if (id !== undefined) b.dataset.id = id;
  return b;
}

function vaciar(n) { while (n.firstChild) n.removeChild(n.firstChild); }
function vacio(t) { return crear('p', 'vacio', t); }

/* ---------------------- avisos ---------------------- */

function toast(texto, premio) {
  const el = crear('div', 'toast' + (premio ? ' toast-premio' : ''), texto);
  $('#avisos').appendChild(el);
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 3200);
}

/* ---------------------- render ---------------------- */

let puntosPrevios = null;

function render() {
  renderNav();
  renderCabecera();
  renderOportunidades();
  renderTrayecto();
  renderTablero();
  renderPerfil();
}

function renderNav() {
  document.querySelectorAll('.nav-btn').forEach(b => {
    const activa = b.dataset.vista === estado.vista;
    b.setAttribute('aria-current', activa ? 'true' : 'false');
    $('#vista-' + b.dataset.vista).hidden = !activa;
  });
  $('#punto-post').hidden = postuladas() === 0;
}

function renderCabecera() {
  const pts = puntos();
  const i = nivelDe(pts);
  const nivel = NIVELES[i];
  const siguiente = NIVELES[i + 1];

  const elPuntos = $('#puntos');
  elPuntos.textContent = pts;
  if (puntosPrevios !== null && pts !== puntosPrevios) {
    elPuntos.classList.remove('pop');
    void elPuntos.offsetWidth;
    elPuntos.classList.add('pop');
  }
  puntosPrevios = pts;

  $('#linea-nivel').textContent = nivel.nombre + (estado.perfil.nombre ? ' · ' + estado.perfil.nombre : '');
  $('#racha').textContent = estado.racha.dias;
  $('#racha-txt').textContent = estado.racha.dias === 1 ? 'día' : 'días';

  const base = nivel.min;
  const techo = siguiente ? siguiente.min : nivel.min;
  const pct = siguiente ? Math.round(((pts - base) / (techo - base)) * 100) : 100;
  $('#barra-nivel').style.width = Math.max(0, Math.min(100, pct)) + '%';
  $('#nivel-falta').textContent = siguiente
    ? 'Te faltan ' + (techo - pts) + ' puntos para ' + siguiente.nombre
    : 'Nivel máximo: Graduado';
}

function renderOportunidades() {
  // chips de área
  const chips = $('#chips-area');
  vaciar(chips);
  ['Todas'].concat(AREAS).forEach(a => {
    const activa = estado.filtros.area === a;
    const b = crear('button', 'chip chip-boton' + (activa ? ' chip-activo' : ''), a);
    b.type = 'button';
    b.dataset.accion = 'filtrar-area';
    b.dataset.id = a;
    chips.appendChild(b);
  });

  const lista = $('#lista-oportunidades');
  vaciar(lista);
  const res = filtradas();
  $('#conteo').textContent = res.length + ' de ' + OPORTUNIDADES.length + ' búsquedas · ordenadas por match';

  if (!res.length) {
    lista.appendChild(vacio('Ninguna búsqueda entra en esos filtros. Probá sacar "solo match alto" o elegir otra área.'));
    return;
  }

  res.forEach(op => {
    const clase = op.match >= 70 ? 'm-alto' : op.match >= 45 ? 'm-medio' : 'm-bajo';
    const art = crear('article', 'oferta ' + clase);

    const tope = crear('div', 'oferta-tope');
    const izq = crear('div');
    izq.appendChild(crear('span', 'empresa', op.empresa));
    izq.appendChild(crear('h3', null, op.puesto));
    const meta = crear('div', 'meta');
    [op.tipo, op.modalidad, op.ciudad, op.horas + ' hs', 'hace ' + op.dias + ' d'].forEach(m => meta.appendChild(crear('span', null, m)));
    izq.appendChild(meta);
    tope.appendChild(izq);

    const anillo = crear('div', 'anillo');
    anillo.style.setProperty('--v', op.match);
    anillo.appendChild(crear('b', null, op.match + '%'));
    anillo.setAttribute('role', 'img');
    anillo.setAttribute('aria-label', op.match + ' por ciento de match');
    tope.appendChild(anillo);
    art.appendChild(tope);

    art.appendChild(crear('p', 'sub', op.desc));

    // desglose: por qué ese número
    const dg = crear('div', 'desglose');
    dg.appendChild(fila(op.d.coinciden.length === op.skills.length,
      'Skills', op.d.coinciden.length + ' de ' + op.skills.length + ' que piden', op.d.pSkills));
    dg.appendChild(fila(op.d.areaOk, 'Área', op.area + (op.d.areaOk ? ' está en tus intereses' : ' no está en tus intereses'), op.d.pArea));
    dg.appendChild(fila(op.d.modalidadOk, 'Modalidad', op.modalidad + ' vs. tu preferencia ' + estado.perfil.modalidad, op.d.pModalidad));
    dg.appendChild(fila(op.d.horasOk, 'Horas', 'pide ' + op.horas + ' hs, tenés ' + estado.perfil.horas + ' hs', op.d.pHoras));
    art.appendChild(dg);

    if (op.d.faltan.length) {
      const falta = crear('div', 'acciones');
      falta.appendChild(crear('span', 'brecha-dato', 'Te falta: ' + op.d.faltan.join(', ')));
      falta.appendChild(boton('Sumar ' + op.d.faltan[0], 'sumar-skill-directo', op.d.faltan[0]));
      art.appendChild(falta);
    }

    const sk = crear('div', 'oferta-skills');
    op.skills.forEach(s => sk.appendChild(crear('span', 'chip' + (tieneSkill(s) ? ' chip-tenes' : ''), tieneSkill(s) ? s + ' ✓' : s)));
    art.appendChild(sk);

    art.appendChild(crear('p', 'sub', op.requisito));

    const pie = crear('div', 'oferta-pie');
    pie.appendChild(crear('span', 'pago', op.pago));
    const acc = crear('div', 'acciones');
    const est = estado.postulaciones[op.id];
    if (est) {
      acc.appendChild(crear('span', 'chip chip-activo', COLUMNAS.find(c => c.id === est).nombre));
      acc.appendChild(boton('Ver tablero', 'ir-tablero'));
    } else {
      acc.appendChild(boton('Guardar', 'guardar-oferta', op.id));
      acc.appendChild(boton('Postularme', 'postular-oferta', op.id, 'btn-lleno'));
    }
    pie.appendChild(acc);
    art.appendChild(pie);

    lista.appendChild(art);
  });
}

function fila(ok, titulo, texto, pts) {
  const d = crear('div', 'dg' + (ok ? ' dg-si' : ''));
  d.appendChild(crear('i', null, ok ? '✓' : '+'));
  const b = crear('b', null, titulo + ': ');
  d.appendChild(b);
  d.appendChild(crear('span', null, texto + ' (+' + pts + ')'));
  return d;
}

function renderTrayecto() {
  // próximo paso
  const paso = proximoPaso();
  const cont = $('#paso-siguiente');
  vaciar(cont);
  cont.appendChild(crear('span', 'micro', paso.micro));
  cont.appendChild(crear('h2', null, paso.titulo));
  cont.appendChild(crear('p', null, paso.texto));
  const b = crear('button', 'btn-marcador', paso.boton);
  b.type = 'button';
  b.dataset.accion = paso.accion;
  if (paso.id) b.dataset.id = paso.id;
  cont.appendChild(b);

  // nivel
  const pts = puntos();
  const i = nivelDe(pts);
  $('#nivel-nombre').textContent = NIVELES[i].nombre;
  const esc = $('#escalera');
  vaciar(esc);
  NIVELES.forEach((n, k) => {
    const e = crear('div', 'escalon ' + (k < i ? 'escalon-hecho' : k === i ? 'escalon-actual' : ''));
    e.appendChild(crear('b', null, n.nombre));
    e.appendChild(crear('span', null, n.min + ' pts'));
    esc.appendChild(e);
  });
  $('#nivel-detalle').textContent = 'Los puntos salen de lo que hacés: ' + estado.perfil.skills.length + ' skills, ' +
    estado.perfil.proyectos.length + ' proyectos, ' + postuladas() + ' postulaciones y ' + pasosHechos() + ' pasos completados.';

  // misiones
  const ms = misiones();
  $('#misiones-contador').textContent = ms.filter(m => m.hecho).length + '/' + ms.length;
  const ul = $('#misiones');
  vaciar(ul);
  ms.forEach(m => {
    const li = crear('li', 'mision' + (m.hecho ? ' mision-hecha' : ''));
    li.appendChild(crear('span', 'tilde', m.hecho ? '✓' : ''));
    li.appendChild(crear('span', 'mision-txt', m.t));
    li.appendChild(crear('span', 'mision-pts', m.prog));
    ul.appendChild(li);
  });

  // brechas
  const cb = $('#brechas');
  vaciar(cb);
  const bs = brechas();
  if (!bs.length) {
    cb.appendChild(vacio('No hay brechas: tu perfil cubre las skills de las búsquedas que mejor matchean. Sumá más áreas de interés para ver otras.'));
  } else {
    bs.forEach(x => {
      const div = crear('div', 'brecha');
      const f = crear('div', 'brecha-fila');
      f.appendChild(crear('span', 'brecha-nombre', x.skill));
      f.appendChild(crear('span', 'brecha-dato', x.veces + ' de ' + x.total + ' búsquedas afines'));
      div.appendChild(f);
      const barra = crear('div', 'barra barra-fina barra-marcador');
      const r = crear('span');
      barra.appendChild(r);
      div.appendChild(barra);
      requestAnimationFrame(() => { r.style.width = x.pct + '%'; });
      const acc = crear('div', 'acciones');
      if (estado.objetivos.some(o => o.skill === x.skill)) {
        acc.appendChild(crear('span', 'chip chip-tenes', 'en tu trayecto'));
      } else {
        acc.appendChild(boton('Crear objetivo', 'sumar-brecha', x.skill, 'btn-lleno'));
        acc.appendChild(boton('Ya la tengo', 'sumar-skill-directo', x.skill));
      }
      div.appendChild(acc);
      cb.appendChild(div);
    });
  }

  // objetivos
  $('#alta-objetivo').hidden = !estado.altaObjetivo;
  const lo = $('#objetivos');
  vaciar(lo);
  if (!estado.objetivos.length) {
    lo.appendChild(vacio('Sin objetivos. Creá uno desde una skill de arriba: son cuatro pasos y cada uno suma 8 puntos.'));
  }
  estado.objetivos.forEach(obj => {
    const hechos = obj.pasos.filter(p => p.hecho).length;
    const art = crear('article', 'objetivo');
    const cab = crear('div', 'objetivo-cab');
    cab.appendChild(crear('h3', null, obj.titulo));
    cab.appendChild(crear('span', 'brecha-dato', hechos + '/' + obj.pasos.length));
    art.appendChild(cab);

    const barra = crear('div', 'barra barra-fina');
    const r = crear('span');
    barra.appendChild(r);
    art.appendChild(barra);
    requestAnimationFrame(() => { r.style.width = Math.round((hechos / obj.pasos.length) * 100) + '%'; });

    const ul2 = crear('ul', 'pasos');
    obj.pasos.forEach((p, k) => {
      const li = crear('li', 'paso');
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = p.hecho;
      chk.id = 'paso-' + obj.id + '-' + k;
      chk.dataset.accion = 'toggle-paso';
      chk.dataset.id = obj.id;
      chk.dataset.indice = String(k);
      const lbl = document.createElement('label');
      lbl.setAttribute('for', chk.id);
      lbl.textContent = p.t;
      if (p.hecho) lbl.className = 'paso-hecho';
      li.appendChild(chk);
      li.appendChild(lbl);
      ul2.appendChild(li);
    });
    art.appendChild(ul2);

    if (confirmando('objetivo', obj.id)) {
      art.appendChild(cajaConfirmar('¿Borrar este objetivo?', 'borrar-objetivo', obj.id));
    } else {
      const acc = crear('div', 'acciones');
      acc.appendChild(boton('Eliminar', 'pedir-borrar-objetivo', obj.id));
      art.appendChild(acc);
    }
    lo.appendChild(art);
  });
}

function confirmando(tipo, id) {
  return estado.confirmar && estado.confirmar.tipo === tipo && estado.confirmar.id === id;
}

function cajaConfirmar(texto, accion, id) {
  const c = crear('div', 'confirmar');
  c.appendChild(crear('span', null, texto));
  c.appendChild(boton('Sí, borrar', accion, id, 'btn-peligro'));
  c.appendChild(boton('Cancelar', 'cancelar-confirmar'));
  return c;
}

function renderTablero() {
  const cont = $('#tablero');
  vaciar(cont);
  const porId = {};
  OPORTUNIDADES.forEach(o => { porId[o.id] = o; });

  COLUMNAS.forEach((col, idx) => {
    const ids = Object.keys(estado.postulaciones).filter(id => estado.postulaciones[id] === col.id);
    const div = crear('div', 'columna');
    const cab = crear('div', 'columna-cab');
    cab.appendChild(crear('span', null, col.nombre));
    cab.appendChild(crear('b', null, String(ids.length)));
    div.appendChild(cab);

    if (!ids.length) {
      div.appendChild(vacio(idx === 0 ? 'Guardá búsquedas desde Buscar y aparecen acá.' : 'Nada en esta etapa.'));
    }

    ids.forEach(id => {
      const op = porId[id];
      if (!op) return;
      const f = crear('div', 'ficha f-' + col.id);
      f.appendChild(crear('div', 'ficha-titulo', op.puesto));
      f.appendChild(crear('div', 'ficha-empresa', op.empresa + ' · ' + op.modalidad));
      if (confirmando('postulacion', id)) {
        f.appendChild(cajaConfirmar('¿Sacarla del tablero?', 'borrar-postulacion', id));
      } else {
        const acc = crear('div', 'ficha-acciones');
        if (idx > 0) acc.appendChild(boton('◀', 'mover-atras', id));
        if (idx < COLUMNAS.length - 1) acc.appendChild(boton('▶', 'mover-adelante', id));
        acc.appendChild(boton('Quitar', 'pedir-borrar-postulacion', id));
        f.appendChild(acc);
      }
      div.appendChild(f);
    });
    cont.appendChild(div);
  });
}

function renderPerfil() {
  const p = estado.perfil;
  [['#p-nombre', 'nombre'], ['#p-universidad', 'universidad'], ['#p-carrera', 'carrera'],
   ['#p-anio', 'anio'], ['#p-avance', 'avance'], ['#p-horas', 'horas'],
   ['#p-modalidad', 'modalidad'], ['#p-ciudad', 'ciudad'], ['#p-bio', 'bio'], ['#p-cv', 'cv']
  ].forEach(([sel, campo]) => {
    const el = $(sel);
    if (el && el !== document.activeElement) el.value = p[campo];
  });

  const areas = $('#areas-perfil');
  vaciar(areas);
  AREAS.forEach(a => {
    const on = p.areas.includes(a);
    const b = crear('button', 'chip chip-boton' + (on ? ' chip-activo' : ''), a + (on ? ' ✓' : ''));
    b.type = 'button';
    b.dataset.accion = 'toggle-area';
    b.dataset.id = a;
    areas.appendChild(b);
  });

  const sk = $('#skills-perfil');
  vaciar(sk);
  if (!p.skills.length) sk.appendChild(vacio('Sin skills. Cargá al menos cuatro para que el match tenga sentido.'));
  p.skills.forEach(s => {
    if (confirmando('skill', s)) {
      const c = crear('span', 'chip chip-confirma');
      c.appendChild(crear('span', null, '¿Quitar ' + s + '?'));
      c.appendChild(boton('Sí', 'borrar-skill', s, 'btn-peligro'));
      c.appendChild(boton('No', 'cancelar-confirmar'));
      sk.appendChild(c);
      return;
    }
    const c = crear('span', 'chip chip-tenes');
    c.appendChild(crear('span', null, s));
    const x = crear('button', 'chip-x', '×');
    x.type = 'button';
    x.dataset.accion = 'pedir-borrar-skill';
    x.dataset.id = s;
    x.setAttribute('aria-label', 'Quitar ' + s);
    c.appendChild(x);
    sk.appendChild(c);
  });

  const pr = $('#proyectos');
  vaciar(pr);
  if (!p.proyectos.length) pr.appendChild(vacio('Sin proyectos. Un TP grupal ya cuenta.'));
  p.proyectos.forEach((x, i) => {
    const li = crear('li', 'proyecto');
    li.appendChild(crear('span', null, x));
    if (confirmando('proyecto', String(i))) li.appendChild(cajaConfirmar('¿Borrarlo?', 'borrar-proyecto', String(i)));
    else li.appendChild(boton('Quitar', 'pedir-borrar-proyecto', String(i)));
    pr.appendChild(li);
  });

  const z = $('#zona-reset');
  vaciar(z);
  if (confirmando('reset', 'todo')) z.appendChild(cajaConfirmar('Se borra todo y vuelve el perfil de ejemplo.', 'reset', 'todo'));
  else z.appendChild(boton('Borrar mis datos', 'pedir-reset', 'todo', 'btn-peligro'));
}

/* ---------------------- acciones ---------------------- */

function pasosPara(skill) {
  return [
    { t: 'Hacer un curso base de ' + skill, hecho: false },
    { t: 'Aplicarlo en un proyecto propio o de la facultad', hecho: false },
    { t: 'Subir la evidencia al perfil (link, repo o PDF)', hecho: false },
    { t: 'Pedir una devolución a un docente o mentor', hecho: false }
  ];
}

function agregarSkill(skill) {
  if (!skill || tieneSkill(skill)) return false;
  const altoAntes = contarMatchAlto();
  estado.perfil.skills.push(skill);
  const nuevos = contarMatchAlto() - altoAntes;
  if (nuevos > 0) toast('Se te abrieron ' + nuevos + ' búsqueda' + (nuevos > 1 ? 's' : '') + ' con match alto', true);
  return true;
}

const ACCIONES = {
  'nada': () => {},
  'ir-perfil': () => { estado.vista = 'perfil'; },
  'ir-oportunidades': () => { estado.vista = 'oportunidades'; },
  'ir-tablero': () => { estado.vista = 'postulaciones'; },

  'filtrar-area': a => { estado.filtros.area = a; },
  'limpiar-filtros': () => {
    estado.filtros = { texto: '', area: 'Todas', soloMatch: false, soloHoras: false };
    $('#f-texto').value = '';
    $('#f-match').checked = false;
    $('#f-horas').checked = false;
  },

  'guardar-oferta': id => { estado.postulaciones[id] = 'guardada'; toast('Guardada en tu tablero'); },
  'postular-oferta': id => { estado.postulaciones[id] = 'postulada'; toast('Postulación registrada'); },

  'mover-adelante': id => {
    const i = COLUMNAS.findIndex(c => c.id === estado.postulaciones[id]);
    if (i < COLUMNAS.length - 1) {
      estado.postulaciones[id] = COLUMNAS[i + 1].id;
      if (COLUMNAS[i + 1].id === 'entrevista') toast('¡Entrevista! +30 puntos', true);
    }
  },
  'mover-atras': id => {
    const i = COLUMNAS.findIndex(c => c.id === estado.postulaciones[id]);
    if (i > 0) estado.postulaciones[id] = COLUMNAS[i - 1].id;
  },

  'pedir-borrar-postulacion': id => { estado.confirmar = { tipo: 'postulacion', id }; },
  'borrar-postulacion': id => { delete estado.postulaciones[id]; estado.confirmar = null; },

  'toggle-area': a => {
    const i = estado.perfil.areas.indexOf(a);
    if (i >= 0) estado.perfil.areas.splice(i, 1);
    else estado.perfil.areas.push(a);
  },

  'sumar-skill-directo': s => { agregarSkill(s); },

  'pedir-borrar-skill': s => { estado.confirmar = { tipo: 'skill', id: s }; },
  'borrar-skill': s => { estado.perfil.skills = estado.perfil.skills.filter(x => x !== s); estado.confirmar = null; },

  'pedir-borrar-proyecto': i => { estado.confirmar = { tipo: 'proyecto', id: i }; },
  'borrar-proyecto': i => { estado.perfil.proyectos.splice(Number(i), 1); estado.confirmar = null; },

  'nuevo-objetivo': () => { estado.altaObjetivo = true; },
  'cancelar-objetivo': () => { estado.altaObjetivo = false; },

  'sumar-brecha': skill => {
    if (estado.objetivos.some(o => o.skill === skill)) return;
    estado.objetivos.push({ id: 'obj' + Date.now(), titulo: 'Aprender ' + skill, skill: skill, pasos: pasosPara(skill) });
    estado.vista = 'trayecto';
    toast('Objetivo creado: ' + skill);
  },

  'pedir-borrar-objetivo': id => { estado.confirmar = { tipo: 'objetivo', id }; },
  'borrar-objetivo': id => { estado.objetivos = estado.objetivos.filter(o => o.id !== id); estado.confirmar = null; },

  'cancelar-confirmar': () => { estado.confirmar = null; },

  'pedir-reset': () => { estado.confirmar = { tipo: 'reset', id: 'todo' }; },
  'reset': () => {
    estado.perfil = clonar(PERFIL_EJEMPLO);
    estado.postulaciones = {};
    estado.objetivos = [];
    estado.confirmar = null;
    try { localStorage.removeItem(CLAVE); } catch (e) { /* storage bloqueado */ }
    toast('Volviste al perfil de ejemplo');
  }
};

// Envuelve cada acción: guarda, avisa los puntos ganados y el cambio de nivel.
function ejecutar(nombre, id) {
  const fn = ACCIONES[nombre];
  if (!fn) return;
  const antes = puntos();
  const nivelAntes = nivelDe(antes);
  fn(id);
  const despues = puntos();
  if (despues > antes) toast('+' + (despues - antes) + ' puntos', true);
  const nivelDespues = nivelDe(despues);
  if (nivelDespues > nivelAntes) toast('Subiste a ' + NIVELES[nivelDespues].nombre, true);
  guardar();
  render();
}

/* ---------------------- eventos ---------------------- */

document.addEventListener('click', e => {
  const el = e.target.closest('[data-accion]');
  if (!el || el.type === 'checkbox') return;
  ejecutar(el.dataset.accion, el.dataset.id);
});

document.addEventListener('change', e => {
  const el = e.target;
  if (!el.dataset || el.dataset.accion !== 'toggle-paso') return;
  const obj = estado.objetivos.find(o => o.id === el.dataset.id);
  if (!obj) return;
  const antes = puntos();
  const nivelAntes = nivelDe(antes);
  obj.pasos[Number(el.dataset.indice)].hecho = el.checked;
  const despues = puntos();
  if (despues > antes) toast('+' + (despues - antes) + ' puntos', true);
  if (obj.pasos.every(p => p.hecho)) toast('Objetivo completo: ' + obj.titulo, true);
  if (nivelDe(despues) > nivelAntes) toast('Subiste a ' + NIVELES[nivelDe(despues)].nombre, true);
  guardar();
  render();
});

document.querySelectorAll('.nav-btn').forEach(b => {
  b.addEventListener('click', () => {
    estado.vista = b.dataset.vista;
    estado.confirmar = null;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

$('#f-texto').addEventListener('input', e => { estado.filtros.texto = e.target.value; renderOportunidades(); });
$('#f-match').addEventListener('change', e => { estado.filtros.soloMatch = e.target.checked; renderOportunidades(); });
$('#f-horas').addEventListener('change', e => { estado.filtros.soloHoras = e.target.checked; renderOportunidades(); });

$('#form-perfil').addEventListener('input', e => {
  const mapa = {
    'p-nombre': 'nombre', 'p-universidad': 'universidad', 'p-carrera': 'carrera', 'p-anio': 'anio',
    'p-avance': 'avance', 'p-horas': 'horas', 'p-modalidad': 'modalidad', 'p-ciudad': 'ciudad',
    'p-bio': 'bio', 'p-cv': 'cv'
  };
  const campo = mapa[e.target.id];
  if (!campo) return;
  estado.perfil[campo] = e.target.value;
  guardar();
  renderCabecera();
  renderOportunidades();
  renderTrayecto();
});

$('#form-perfil').addEventListener('submit', e => e.preventDefault());

$('#alta-skill').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#skill-nueva');
  const v = input.value.trim();
  if (!v) { toast('Escribí una skill antes de agregarla'); return; }
  if (tieneSkill(v)) { toast('Esa skill ya está en tu perfil'); return; }
  const antes = puntos();
  agregarSkill(v);
  input.value = '';
  toast('+' + (puntos() - antes) + ' puntos', true);
  guardar();
  render();
  input.focus();
});

$('#alta-proyecto').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#proyecto-nuevo');
  const v = input.value.trim();
  if (!v) { toast('Contá en una línea qué hiciste'); return; }
  estado.perfil.proyectos.push(v);
  input.value = '';
  toast('+12 puntos', true);
  guardar();
  render();
  input.focus();
});

$('#alta-objetivo').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#objetivo-titulo');
  const v = input.value.trim();
  if (!v) { toast('Poné un título para el objetivo'); return; }
  estado.objetivos.push({ id: 'obj' + Date.now(), titulo: v, skill: v, pasos: pasosPara(v) });
  input.value = '';
  estado.altaObjetivo = false;
  toast('Objetivo creado', true);
  guardar();
  render();
});

/* ---------------------- arranque ---------------------- */

cargar();
actualizarRacha();
render();
