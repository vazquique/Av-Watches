/* ==========================================================================
   AV WATCHES · Archivo maestro de piezas
   --------------------------------------------------------------------------
   Cada reloj no es una fotografía: es una ficha técnica. El motor de dibujo
   (motor-reloj.js) lee estos objetos y construye la pieza en SVG, viva y
   dando la hora real. Cambiar un valor aquí cambia el reloj en toda la tienda.
   ========================================================================== */

const AV = {};

/* --- Paletas de materiales -------------------------------------------------
   Cada metal define tres tonos: sombra, cuerpo y brillo. El motor los usa
   para armar el degradado de la caja y simular el pulido.                   */
AV.METALES = {
  acero:    { nombre: 'Acero 316L',        sombra: '#5c6066', cuerpo: '#b9bec6', brillo: '#f2f4f7' },
  titanio:  { nombre: 'Titanio grado 5',   sombra: '#4e5155', cuerpo: '#9a9ea3', brillo: '#d6d9dc' },
  oroRosa:  { nombre: 'Oro rosa 18k',      sombra: '#8a4f32', cuerpo: '#d99b74', brillo: '#f7d9c2' },
  oroAmar:  { nombre: 'Oro amarillo 18k',  sombra: '#8a6a1c', cuerpo: '#d9ae45', brillo: '#f6e3a8' },
  bronce:   { nombre: 'Bronce CuSn8',      sombra: '#6b4a1f', cuerpo: '#b08a4a', brillo: '#e0c58b' },
  dlc:      { nombre: 'Acero DLC negro',   sombra: '#0d0d0f', cuerpo: '#2a2b2f', brillo: '#54565c' },
  platino:  { nombre: 'Platino 950',       sombra: '#63666b', cuerpo: '#c4c7cc', brillo: '#eff1f4' }
};

/* --- Correas: color de cuerpo, costura y tipo de textura ------------------ */
AV.CORREAS = {
  pielNegra:   { nombre: 'Piel de becerro negra',   tipo: 'piel',   cuerpo: '#1c1a18', costura: '#3a352f' },
  pielCafe:    { nombre: 'Piel curtida café',       tipo: 'piel',   cuerpo: '#5a3a24', costura: '#c9a24a' },
  pielCognac:  { nombre: 'Piel cognac',             tipo: 'piel',   cuerpo: '#8a4f28', costura: '#e0c08a' },
  pielAzul:    { nombre: 'Piel azul noche',         tipo: 'piel',   cuerpo: '#1e2a44', costura: '#4a5f8a' },
  acero:       { nombre: 'Brazalete de acero',      tipo: 'metal',  cuerpo: '#b9bec6', costura: '#6e737a' },
  titanio:     { nombre: 'Brazalete de titanio',    tipo: 'metal',  cuerpo: '#9a9ea3', costura: '#5c5f63' },
  oroAmar:     { nombre: 'Brazalete de oro',        tipo: 'metal',  cuerpo: '#d9ae45', costura: '#8a6a1c' },
  cauchoNegro: { nombre: 'Caucho vulcanizado',      tipo: 'caucho', cuerpo: '#141416', costura: '#2e3034' },
  cauchoOxido: { nombre: 'Caucho óxido',            tipo: 'caucho', cuerpo: '#6e2a1c', costura: '#a8543c' },
  natoOliva:   { nombre: 'NATO oliva',              tipo: 'nato',   cuerpo: '#3f4630', costura: '#8f9678' },
  natoGris:    { nombre: 'NATO gris pizarra',       tipo: 'nato',   cuerpo: '#3a3c40', costura: '#83868c' },
  natoBandera: { nombre: 'NATO tricolor',           tipo: 'nato',   cuerpo: '#243244', costura: '#c9a24a' }
};

/* --- El catálogo ---------------------------------------------------------- */
AV.RELOJES = [
  {
    id: 'obsidiana-gmt',
    ref: 'AV·01',
    nombre: 'Obsidiana GMT',
    coleccion: 'Nocturno',
    lema: 'Dos husos horarios para quien nunca está del todo aquí.',
    precio: 38900,
    anio: 2023,
    piezas: 180,
    stock: 7,
    estilo: 'viajero',
    caja: { metal: 'acero', diametro: 40, altura: 11.8, agua: 100, cristal: 'Zafiro abombado con antirreflejante' },
    calibre: { nombre: 'AV-24 GMT', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 27, reserva: 62 },
    dial: { base: '#0c1016', textura: 'sunburst', indices: 'baton', tinta: '#e8e3d9', lume: true },
    bisel: { tipo: 'gmt', colorDia: '#1e4d7b', colorNoche: '#101418' },
    manecillas: { tipo: 'mercedes', color: '#e8e3d9', gmt: '#c9502d' },
    complicaciones: ['fecha', 'gmt'],
    correa: 'acero',
    variantesDial: [
      { id: 'obsidiana', nombre: 'Obsidiana',    base: '#0c1016', tinta: '#e8e3d9', extra: 0 },
      { id: 'tinta',     nombre: 'Azul tinta',   base: '#12233d', tinta: '#e8e3d9', extra: 1400 },
      { id: 'nopal',     nombre: 'Verde nopal',  base: '#122a20', tinta: '#e3e0d2', extra: 1400 }
    ],
    variantesCorrea: ['acero', 'natoBandera', 'pielAzul', 'cauchoNegro'],
    notas: [
      'Aguja GMT independiente de 24 horas, saltos de hora sin detener el segundero.',
      'Bisel bidireccional de 24 divisiones en cerámica bicolor.',
      'Cierre desplegable con microajuste de 5 mm sin herramienta.'
    ]
  },
  {
    id: 'amanecer-sonora',
    ref: 'AV·02',
    nombre: 'Amanecer Sonora',
    coleccion: 'Herencia',
    lema: 'El color exacto del desierto a las seis y cuarto de la mañana.',
    precio: 52400,
    anio: 2022,
    piezas: 90,
    stock: 3,
    estilo: 'vestir',
    caja: { metal: 'oroRosa', diametro: 36, altura: 8.9, agua: 30, cristal: 'Zafiro plano doble antirreflejante' },
    calibre: { nombre: 'AV-01 Extraplano', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 21, reserva: 72 },
    dial: { base: '#e8a07a', textura: 'sunburst', indices: 'baton', tinta: '#4a2418', lume: false },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'dauphine', color: '#5a2e1c' },
    complicaciones: ['segundero-pequeno'],
    correa: 'pielCognac',
    variantesDial: [
      { id: 'salmon',  nombre: 'Salmón Sonora',  base: '#e8a07a', tinta: '#4a2418', extra: 0 },
      { id: 'marfil',  nombre: 'Marfil',         base: '#efe8da', tinta: '#3b3229', extra: 0 },
      { id: 'chocolate', nombre: 'Chocolate',    base: '#432a1e', tinta: '#e0cdb8', extra: 2200 }
    ],
    variantesCorrea: ['pielCognac', 'pielCafe', 'pielNegra'],
    notas: [
      'Caja de 8.9 mm: pasa bajo el puño de una camisa sin pelear.',
      'Segundero pequeño a las seis con guilloché en caracol.',
      'Solo 90 piezas, numeradas en el fondo de caja de zafiro.'
    ]
  },
  {
    id: 'buzo-cortes',
    ref: 'AV·03',
    nombre: 'Buzo Cortés',
    coleccion: 'Expedición',
    lema: 'Trescientos metros bajo el Mar de Cortés, y sigue caminando.',
    precio: 29800,
    anio: 2024,
    piezas: null,
    stock: 14,
    estilo: 'buceo',
    caja: { metal: 'acero', diametro: 42, altura: 13.2, agua: 300, cristal: 'Zafiro abombado de 3 mm' },
    calibre: { nombre: 'AV-30 Marino', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 25, reserva: 56 },
    dial: { base: '#0f2f56', textura: 'sunburst', indices: 'puntos', tinta: '#f0ece2', lume: true },
    bisel: { tipo: 'buceo', colorDia: '#0a2340', colorNoche: null },
    manecillas: { tipo: 'espada', color: '#f0ece2' },
    complicaciones: ['fecha'],
    correa: 'cauchoNegro',
    variantesDial: [
      { id: 'abismo',  nombre: 'Azul abismo',   base: '#0f2f56', tinta: '#f0ece2', extra: 0 },
      { id: 'carbon',  nombre: 'Negro carbón',  base: '#101113', tinta: '#f0ece2', extra: 0 },
      { id: 'kelp',    nombre: 'Verde kelp',    base: '#123028', tinta: '#eef0e6', extra: 900 }
    ],
    variantesCorrea: ['cauchoNegro', 'acero', 'natoOliva', 'natoGris'],
    notas: [
      'Bisel unidireccional de 120 clics con inserto de cerámica y pip luminoso.',
      'Válvula de escape de helio a las nueve.',
      'Lume de grado A: cinco horas de lectura tras un minuto de sol.'
    ]
  },
  {
    id: 'cronos-mezcal',
    ref: 'AV·04',
    nombre: 'Cronos Mezcal',
    coleccion: 'Taller',
    lema: 'Mide lo que dura una conversación que valga la pena.',
    precio: 61200,
    anio: 2023,
    piezas: 120,
    stock: 5,
    estilo: 'cronografo',
    caja: { metal: 'acero', diametro: 41, altura: 13.9, agua: 50, cristal: 'Zafiro en caja y fondo' },
    calibre: { nombre: 'AV-72 Columna', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 31, reserva: 60 },
    dial: { base: '#1a3a2a', textura: 'guilloche', indices: 'baton', tinta: '#efe9db', lume: true },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'baton', color: '#efe9db' },
    complicaciones: ['cronografo', 'fecha'],
    correa: 'pielNegra',
    variantesDial: [
      { id: 'agave',  nombre: 'Verde agave',  base: '#1a3a2a', tinta: '#efe9db', extra: 0 },
      { id: 'panda',  nombre: 'Panda',        base: '#eae5da', tinta: '#1b1b1d', extra: 0 },
      { id: 'humo',   nombre: 'Humo',         base: '#2b2c30', tinta: '#e6e2d8', extra: 1800 }
    ],
    variantesCorrea: ['pielNegra', 'pielCafe', 'acero'],
    notas: [
      'Rueda de columnas y embrague vertical: el segundero no tiembla al arrancar.',
      'Contadores de 30 minutos y 12 horas con guilloché en caracol.',
      'Pulsadores de bomba torneados en una sola pieza.'
    ]
  },
  {
    id: 'luna-nueva',
    ref: 'AV·05',
    nombre: 'Luna Nueva',
    coleccion: 'Taller',
    lema: 'Se equivoca un día cada ciento veintidós años. Nadie es perfecto.',
    precio: 88000,
    anio: 2021,
    piezas: 45,
    stock: 2,
    estilo: 'complicacion',
    caja: { metal: 'platino', diametro: 38, altura: 10.4, agua: 30, cristal: 'Zafiro plano antirreflejante' },
    calibre: { nombre: 'AV-88 Astral', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 34, reserva: 70 },
    dial: { base: '#0a1430', textura: 'aventurina', indices: 'baton', tinta: '#e6e8f2', lume: false },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'dauphine', color: '#e6e8f2' },
    complicaciones: ['fase-lunar'],
    correa: 'pielAzul',
    variantesDial: [
      { id: 'aventurina', nombre: 'Aventurina',    base: '#0a1430', tinta: '#e6e8f2', extra: 0 },
      { id: 'onix',       nombre: 'Ónix',          base: '#0b0b0d', tinta: '#e6e2d8', extra: 4000 }
    ],
    variantesCorrea: ['pielAzul', 'pielNegra'],
    notas: [
      'Disco lunar de aventurina cortado a mano, dos lunas en nácar.',
      'Precisión de la fase: un día de desviación cada 122 años y 46 días.',
      'Cuarenta y cinco piezas. No habrá una segunda serie.'
    ]
  },
  {
    id: 'milpa-esqueleto',
    ref: 'AV·06',
    nombre: 'Milpa Esqueleto',
    coleccion: 'Taller',
    lema: 'Le quitamos todo lo que no era necesario. Quedó el tiempo.',
    precio: 74500,
    anio: 2024,
    piezas: 60,
    stock: 4,
    estilo: 'complicacion',
    caja: { metal: 'titanio', diametro: 40, altura: 10.9, agua: 50, cristal: 'Zafiro en caja y fondo' },
    calibre: { nombre: 'AV-06 Abierto', tipo: 'cuerda manual', frecuencia: '21,600 alt/h', rubies: 19, reserva: 90 },
    dial: { base: '#17181b', textura: 'esqueleto', indices: 'baton', tinta: '#d8d4c8', lume: true },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'espada', color: '#c9a24a' },
    complicaciones: [],
    correa: 'titanio',
    variantesDial: [
      { id: 'grafito', nombre: 'Puentes grafito', base: '#17181b', tinta: '#d8d4c8', extra: 0 },
      { id: 'laton',   nombre: 'Puentes latón',   base: '#241d12', tinta: '#e3d3ac', extra: 3200 }
    ],
    variantesCorrea: ['titanio', 'pielNegra', 'cauchoNegro'],
    notas: [
      'Puentes calados y biselados a mano: 42 horas de trabajo por pieza.',
      'Noventa horas de reserva con un solo barrilete.',
      'Se le da cuerda. Es parte del trato.'
    ]
  },
  {
    id: 'bruma',
    ref: 'AV·07',
    nombre: 'Bruma',
    coleccion: 'Herencia',
    lema: 'La primera pieza seria. La que se hereda.',
    precio: 22900,
    anio: 2024,
    piezas: null,
    stock: 22,
    estilo: 'vestir',
    caja: { metal: 'acero', diametro: 38, altura: 9.4, agua: 50, cristal: 'Zafiro plano' },
    calibre: { nombre: 'AV-01', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 24, reserva: 41 },
    dial: { base: '#5c6066', textura: 'mate', indices: 'baton', tinta: '#f2f0ea', lume: true },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'baton', color: '#f2f0ea' },
    complicaciones: [],
    correa: 'pielNegra',
    variantesDial: [
      { id: 'niebla', nombre: 'Gris niebla', base: '#5c6066', tinta: '#f2f0ea', extra: 0 },
      { id: 'hueso',  nombre: 'Hueso',       base: '#e8e2d4', tinta: '#26241f', extra: 0 },
      { id: 'noche',  nombre: 'Noche',       base: '#121316', tinta: '#eeeae0', extra: 0 }
    ],
    variantesCorrea: ['pielNegra', 'pielCafe', 'acero', 'natoGris'],
    notas: [
      'Cero fecha, cero texto de más: solo doce índices y tres agujas.',
      'Nueve milímetros de alto, la medida de un reloj que se olvida en la muñeca.',
      'La puerta de entrada a la casa, sin concesiones en el acabado.'
    ]
  },
  {
    id: 'cantera-bronce',
    ref: 'AV·08',
    nombre: 'Cantera Bronce',
    coleccion: 'Expedición',
    lema: 'Se oxida a propósito. Igual que tú.',
    precio: 34700,
    anio: 2023,
    piezas: 150,
    stock: 9,
    estilo: 'campo',
    caja: { metal: 'bronce', diametro: 43, altura: 12.6, agua: 200, cristal: 'Zafiro abombado' },
    calibre: { nombre: 'AV-30 Marino', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 25, reserva: 56 },
    dial: { base: '#2c3324', textura: 'mate', indices: 'arabigo', tinta: '#e6dcc2', lume: true },
    bisel: { tipo: 'canelado', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'espada', color: '#e6dcc2' },
    complicaciones: ['fecha'],
    correa: 'natoOliva',
    variantesDial: [
      { id: 'patina', nombre: 'Verde pátina', base: '#2c3324', tinta: '#e6dcc2', extra: 0 },
      { id: 'arena',  nombre: 'Arena',        base: '#8a7550', tinta: '#241f16', extra: 0 },
      { id: 'tierra', nombre: 'Tierra',       base: '#3a2a1e', tinta: '#e6d3b2', extra: 800 }
    ],
    variantesCorrea: ['natoOliva', 'pielCafe', 'cauchoOxido'],
    notas: [
      'El bronce toma su pátina con tu sudor: ningún ejemplar envejece igual.',
      'Fondo de titanio para que la caja no toque la piel.',
      'Números arábigos de gran tamaño, legibles de reojo.'
    ]
  },
  {
    id: 'chapopote',
    ref: 'AV·09',
    nombre: 'Chapopote',
    coleccion: 'Nocturno',
    lema: 'Negro sobre negro. Se lee solo cuando lo volteas a ver.',
    precio: 45600,
    anio: 2025,
    piezas: 100,
    stock: 6,
    estilo: 'deportivo',
    caja: { metal: 'dlc', diametro: 39, altura: 10.8, agua: 100, cristal: 'Zafiro con tratamiento mate' },
    calibre: { nombre: 'AV-01', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 24, reserva: 41 },
    dial: { base: '#0e0e10', textura: 'guilloche', indices: 'baton', tinta: '#4a4c52', lume: true },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'baton', color: '#6e7178' },
    complicaciones: [],
    correa: 'cauchoNegro',
    variantesDial: [
      { id: 'total',  nombre: 'Negro total',   base: '#0e0e10', tinta: '#4a4c52', extra: 0 },
      { id: 'brasa',  nombre: 'Índices brasa', base: '#0e0e10', tinta: '#c4452d', extra: 1200 }
    ],
    variantesCorrea: ['cauchoNegro', 'pielNegra', 'natoGris'],
    notas: [
      'Recubrimiento DLC de 1,200 Vickers: raya el acero, no al revés.',
      'Contraste deliberadamente bajo. Es un reloj para el que lo trae puesto.',
      'De noche, el lume es lo único que queda.'
    ]
  },
  {
    id: 'meridiano-105',
    ref: 'AV·10',
    nombre: 'Meridiano 105',
    coleccion: 'Taller',
    lema: 'Veinticuatro ciudades. La tuya al centro.',
    precio: 96000,
    anio: 2022,
    piezas: 35,
    stock: 1,
    estilo: 'viajero',
    caja: { metal: 'oroAmar', diametro: 40, altura: 11.2, agua: 30, cristal: 'Zafiro abombado' },
    calibre: { nombre: 'AV-105 Mundo', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 36, reserva: 65 },
    dial: { base: '#1b2c3d', textura: 'guilloche', indices: 'baton', tinta: '#ecd9a8', lume: false },
    bisel: { tipo: 'canelado', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'dauphine', color: '#ecd9a8', gmt: '#c9a24a' },
    complicaciones: ['mundo', 'gmt'],
    correa: 'pielAzul',
    variantesDial: [
      { id: 'meridiano', nombre: 'Azul meridiano', base: '#1b2c3d', tinta: '#ecd9a8', extra: 0 },
      { id: 'plata',     nombre: 'Plata cepillada', base: '#c8c6bd', tinta: '#2b2a26', extra: 0 }
    ],
    variantesCorrea: ['pielAzul', 'pielCafe', 'oroAmar'],
    notas: [
      'Disco de 24 ciudades sincronizado con el anillo de 24 horas.',
      'El meridiano 105 pasa por el centro de México: por ahí empieza el disco.',
      'Treinta y cinco piezas. Una sola disponible.'
    ]
  },
  {
    id: 'reserva-charro',
    ref: 'AV·11',
    nombre: 'Reserva Charro',
    coleccion: 'Herencia',
    lema: 'Te dice cuánta cuerda te queda. Ojalá todo avisara así.',
    precio: 57300,
    anio: 2023,
    piezas: 75,
    stock: 4,
    estilo: 'vestir',
    caja: { metal: 'oroRosa', diametro: 39, altura: 10.1, agua: 30, cristal: 'Zafiro abombado' },
    calibre: { nombre: 'AV-52 Reserva', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 29, reserva: 68 },
    dial: { base: '#efe6d2', textura: 'guilloche', indices: 'romano', tinta: '#2e2417', lume: false },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'dauphine', color: '#4a3a20' },
    complicaciones: ['reserva', 'segundero-pequeno'],
    correa: 'pielCafe',
    variantesDial: [
      { id: 'marfil', nombre: 'Marfil grabado', base: '#efe6d2', tinta: '#2e2417', extra: 0 },
      { id: 'pizarra', nombre: 'Pizarra',       base: '#33363b', tinta: '#e8e3d5', extra: 1600 }
    ],
    variantesCorrea: ['pielCafe', 'pielCognac', 'pielNegra'],
    notas: [
      'Indicador de reserva en abanico, con aguja azulada al fuego.',
      'Guilloché de rayo de sol grabado en máquina de 1932.',
      'Números romanos pintados a pincel, uno por uno.'
    ]
  },
  {
    id: 'via-rapida',
    ref: 'AV·12',
    nombre: 'Vía Rápida',
    coleccion: 'Expedición',
    lema: 'Taquímetro para medir qué tan rápido se te fue el día.',
    precio: 49900,
    anio: 2025,
    piezas: 200,
    stock: 11,
    estilo: 'cronografo',
    caja: { metal: 'acero', diametro: 40, altura: 13.4, agua: 100, cristal: 'Zafiro abombado' },
    calibre: { nombre: 'AV-72 Columna', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 31, reserva: 60 },
    dial: { base: '#e9e5da', textura: 'mate', indices: 'baton', tinta: '#1b1c1f', lume: true },
    bisel: { tipo: 'taquimetro', colorDia: '#17181b', colorNoche: null },
    manecillas: { tipo: 'baton', color: '#1b1c1f' },
    complicaciones: ['cronografo'],
    correa: 'acero',
    variantesDial: [
      { id: 'panda',    nombre: 'Panda',       base: '#e9e5da', tinta: '#1b1c1f', extra: 0 },
      { id: 'invertido', nombre: 'Panda inverso', base: '#17181b', tinta: '#e9e5da', extra: 0 },
      { id: 'ladrillo', nombre: 'Ladrillo',    base: '#7a2f22', tinta: '#f0e8da', extra: 1500 }
    ],
    variantesCorrea: ['acero', 'pielNegra', 'cauchoNegro', 'natoBandera'],
    notas: [
      'Escala taquimétrica grabada y lacada en el bisel de cerámica.',
      'Contadores bicolor con acabado de caracol.',
      'Pulsadores roscados: aguanta el agua con el crono corriendo.'
    ]
  }
];

/* --- Colecciones ---------------------------------------------------------- */
AV.COLECCIONES = [
  { id: 'Nocturno',   numero: '01', desc: 'Piezas de bajo contraste, para leerse de reojo. Lume que dura toda la noche.' },
  { id: 'Herencia',   numero: '02', desc: 'La línea clásica de la casa. Proporciones que no se van a ver mal en 2050.' },
  { id: 'Expedición', numero: '03', desc: 'Hechas para mojarse, rayarse y volver. Acero, bronce, caucho y cerámica.' },
  { id: 'Taller',     numero: '04', desc: 'Alta relojería, series cortas, acabados a mano. Lo que sabemos hacer cuando nadie nos apura.' }
];

/* --- Husos horarios de la sección "Hora en el mundo" ---------------------- */
AV.HUSOS = [
  { ciudad: 'Ciudad de México', zona: 'America/Mexico_City', codigo: 'MEX' },
  { ciudad: 'Ginebra',          zona: 'Europe/Zurich',       codigo: 'GVA' },
  { ciudad: 'Tokio',            zona: 'Asia/Tokyo',          codigo: 'TYO' },
  { ciudad: 'Nueva York',       zona: 'America/New_York',    codigo: 'NYC' }
];

/* --- Utilidades de consulta ----------------------------------------------- */
AV.porId = id => AV.RELOJES.find(r => r.id === id) || null;
AV.precioMXN = n => '$' + Math.round(n).toLocaleString('es-MX');

window.AV = AV;
