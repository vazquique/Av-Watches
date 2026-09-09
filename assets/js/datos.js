/* ==========================================================================
   AV WATCHES · Catálogo
   --------------------------------------------------------------------------
   Tienda multimarca: relojes nuevos y seminuevos de marcas existentes.
   Cada entrada es la ficha técnica real del modelo; el motor de dibujo
   (motor-reloj.js) la convierte en un reloj vectorial vivo.

   ⚠ PRECIOS Y EXISTENCIAS SON DE EJEMPLO. Ajústalos a tu inventario real
     antes de publicar. Las especificaciones siguen a los modelos de
     fábrica, pero conviene verificarlas contra la referencia que tengas.
   ========================================================================== */

const AV = {};

/* --- Materiales de caja: sombra, cuerpo y brillo para el degradado ------- */
AV.METALES = {
  acero:    { nombre: 'Acero inoxidable',  sombra: '#5c6066', cuerpo: '#b9bec6', brillo: '#f2f4f7' },
  titanio:  { nombre: 'Titanio',           sombra: '#4e5155', cuerpo: '#9a9ea3', brillo: '#d6d9dc' },
  oroRosa:  { nombre: 'Acero con oro rosa',sombra: '#8a4f32', cuerpo: '#d99b74', brillo: '#f7d9c2' },
  oroAmar:  { nombre: 'Acero dorado',      sombra: '#8a6a1c', cuerpo: '#d9ae45', brillo: '#f6e3a8' },
  bronce:   { nombre: 'Bronce',            sombra: '#6b4a1f', cuerpo: '#b08a4a', brillo: '#e0c58b' },
  dlc:      { nombre: 'Acero con PVD negro',sombra: '#0d0d0f', cuerpo: '#2a2b2f', brillo: '#54565c' },
  resina:   { nombre: 'Resina reforzada',  sombra: '#1a1c20', cuerpo: '#3a3d44', brillo: '#666a73' }
};

/* --- Correas -------------------------------------------------------------- */
AV.CORREAS = {
  pielNegra:   { nombre: 'Piel negra',              tipo: 'piel',   cuerpo: '#1c1a18', costura: '#3a352f' },
  pielCafe:    { nombre: 'Piel café',               tipo: 'piel',   cuerpo: '#5a3a24', costura: '#c9a24a' },
  pielCognac:  { nombre: 'Piel cognac',             tipo: 'piel',   cuerpo: '#8a4f28', costura: '#e0c08a' },
  pielAzul:    { nombre: 'Piel azul',               tipo: 'piel',   cuerpo: '#1e2a44', costura: '#4a5f8a' },
  acero:       { nombre: 'Brazalete de acero',      tipo: 'metal',  cuerpo: '#b9bec6', costura: '#6e737a' },
  aceroIntegr: { nombre: 'Brazalete integrado',     tipo: 'metal',  cuerpo: '#c2c7ce', costura: '#787d84' },
  oroAmar:     { nombre: 'Brazalete bicolor',       tipo: 'metal',  cuerpo: '#d9ae45', costura: '#8a6a1c' },
  cauchoNegro: { nombre: 'Caucho negro',            tipo: 'caucho', cuerpo: '#141416', costura: '#2e3034' },
  cauchoAzul:  { nombre: 'Caucho azul',             tipo: 'caucho', cuerpo: '#16223a', costura: '#31456e' },
  natoOliva:   { nombre: 'NATO oliva',              tipo: 'nato',   cuerpo: '#3f4630', costura: '#8f9678' },
  natoNegro:   { nombre: 'NATO negro',              tipo: 'nato',   cuerpo: '#26282c', costura: '#6e7178' },
  natoGris:    { nombre: 'NATO gris',               tipo: 'nato',   cuerpo: '#3a3c40', costura: '#83868c' }
};

/* --- El inventario -------------------------------------------------------
   condicion: 'nuevo' | 'seminuevo'
   dialLinea: la segunda línea del dial (la familia del modelo)
   variantes: colores que el modelo tiene de fábrica, cada uno su referencia
   ------------------------------------------------------------------------ */
AV.RELOJES = [
  {
    id: 'casio-duro-mdv106',
    marca: 'Casio', modelo: 'Duro MDV-106', dialLinea: 'DIVER',
    refFab: 'MDV-106B-1A2V',
    coleccion: 'Para empezar', condicion: 'nuevo',
    incluye: 'Caja Casio, instructivo y garantía de 2 años',
    lema: 'El diver de doscientos metros que cuesta menos que unos tenis.',
    precio: 1890, precioLista: 2400, anio: 2024, stock: 6, estilo: 'buceo',
    caja: { metal: 'acero', diametro: 44, altura: 12.0, agua: 200, cristal: 'Mineral' },
    calibre: { nombre: 'Casio 2784', tipo: 'cuarzo', frecuencia: '32,768 Hz', rubies: 0, reserva: 26280 },
    dial: { base: '#12294a', textura: 'sunburst', indices: 'puntos', tinta: '#f0ece2', lume: true },
    bisel: { tipo: 'buceo', colorDia: '#0f2038', colorNoche: null },
    manecillas: { tipo: 'espada', color: '#f0ece2' },
    complicaciones: ['fecha'], correa: 'cauchoNegro',
    variantes: [
      { id: 'azul',  nombre: 'Azul (MDV-106B-1A2V)',  base: '#12294a', tinta: '#f0ece2', extra: 0 },
      { id: 'negro', nombre: 'Negro (MDV-106-1AV)',   base: '#101113', tinta: '#f0ece2', extra: 0 }
    ],
    correasExtra: ['cauchoNegro', 'natoNegro', 'natoGris', 'acero'],
    notas: [
      'Bisel unidireccional de 120 clics y 200 metros reales de resistencia.',
      'El movimiento de cuarzo aguanta unos tres años por pila.',
      'Es el reloj que más recomiendo para empezar sin gastar.'
    ]
  },
  {
    id: 'timex-marlin',
    marca: 'Timex', modelo: 'Marlin Hand-Wound', dialLinea: 'MARLIN',
    refFab: 'TW2T18000',
    coleccion: 'Para empezar', condicion: 'nuevo',
    incluye: 'Caja Timex, papeles y garantía de 1 año',
    lema: 'Cuerda manual de 34 milímetros. Se le da vuelta cada mañana.',
    precio: 4290, precioLista: 4990, anio: 2024, stock: 3, estilo: 'vestir',
    caja: { metal: 'acero', diametro: 34, altura: 10.5, agua: 30, cristal: 'Acrílico abombado' },
    calibre: { nombre: 'Timex de cuerda', tipo: 'cuerda manual', frecuencia: '21,600 alt/h', rubies: 17, reserva: 40 },
    dial: { base: '#e8e4d8', textura: 'mate', indices: 'baton', tinta: '#26241f', lume: false },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'dauphine', color: '#33302a' },
    complicaciones: [], correa: 'pielCafe',
    variantes: [
      { id: 'plata', nombre: 'Dial plata (TW2T18000)', base: '#e8e4d8', tinta: '#26241f', extra: 0 },
      { id: 'negro', nombre: 'Dial negro (TW2T22800)', base: '#191a1d', tinta: '#e8e4d8', extra: 0 }
    ],
    correasExtra: ['pielCafe', 'pielNegra', 'natoGris'],
    notas: [
      'Reedición del Marlin de 1960, con el cristal acrílico abombado original.',
      'Treinta y cuatro milímetros: chico según hoy, exacto según los sesenta.',
      'Sin fecha y sin segundero corrido: hay que darle cuerda para que camine.'
    ]
  },
  {
    id: 'seiko-5-srpd55',
    marca: 'Seiko', modelo: '5 Sports SRPD55', dialLinea: 'AUTOMATIC',
    refFab: 'SRPD55K1',
    coleccion: 'Para empezar', condicion: 'nuevo',
    incluye: 'Caja Seiko, papeles y garantía de 2 años',
    lema: 'El automático que todo mundo recomienda, y con razón.',
    precio: 5400, precioLista: 6900, anio: 2024, stock: 4, estilo: 'deportivo',
    caja: { metal: 'acero', diametro: 40.5, altura: 13.4, agua: 100, cristal: 'Hardlex' },
    calibre: { nombre: 'Seiko 4R36', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 24, reserva: 41 },
    dial: { base: '#141518', textura: 'mate', indices: 'puntos', tinta: '#eae6dc', lume: true },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'espada', color: '#eae6dc' },
    complicaciones: ['fecha'], correa: 'acero',
    variantes: [
      { id: 'negro', nombre: 'Negro (SRPD55K1)', base: '#141518', tinta: '#eae6dc', extra: 0 },
      { id: 'azul',  nombre: 'Azul (SRPD51K1)',  base: '#152a46', tinta: '#eae6dc', extra: 0 },
      { id: 'verde', nombre: 'Verde (SRPD63K1)', base: '#16291f', tinta: '#e6e6da', extra: 0 }
    ],
    correasExtra: ['acero', 'natoNegro', 'natoOliva', 'pielNegra'],
    notas: [
      'Calibre 4R36 con cuerda manual y segundero detenible, cosa rara en este precio.',
      'Se le puede dar cuerda a mano si lleva días parado.',
      'Cien metros: aguanta alberca y regaderazo sin pensarlo.'
    ]
  },
  {
    id: 'orient-bambino-v4',
    marca: 'Orient', modelo: 'Bambino Versión 4', dialLinea: 'AUTOMATIC',
    refFab: 'RA-AC0M03S',
    coleccion: 'Para empezar', condicion: 'nuevo',
    incluye: 'Caja Orient, papeles y garantía de 2 años',
    lema: 'Un reloj de vestir de verdad, por lo que cuesta una cena.',
    precio: 5900, precioLista: 7200, anio: 2023, stock: 2, estilo: 'vestir',
    caja: { metal: 'acero', diametro: 40.5, altura: 11.8, agua: 30, cristal: 'Mineral abombado' },
    calibre: { nombre: 'Orient F6724', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 22, reserva: 40 },
    dial: { base: '#efe9dc', textura: 'sunburst', indices: 'baton', tinta: '#2e2a23', lume: false },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'dauphine', color: '#3a352c' },
    complicaciones: ['fecha'], correa: 'pielCafe',
    variantes: [
      { id: 'blanco', nombre: 'Blanco (RA-AC0M03S)', base: '#efe9dc', tinta: '#2e2a23', extra: 0 },
      { id: 'azul',   nombre: 'Azul (RA-AC0M04L)',   base: '#1b2c4a', tinta: '#e8e4d8', extra: 0 },
      { id: 'negro',  nombre: 'Negro (RA-AC0M02B)',  base: '#171719', tinta: '#e8e4d8', extra: 0 }
    ],
    correasExtra: ['pielCafe', 'pielNegra', 'pielCognac'],
    notas: [
      'Cristal abombado que deforma la luz en las orillas: ahí está media la gracia.',
      'La Versión 4 trae el dial más limpio de toda la familia Bambino.',
      'Treinta metros: no es para nadar, es para traerlo con camisa.'
    ]
  },
  {
    id: 'citizen-promaster-diver',
    marca: 'Citizen', modelo: 'Promaster Diver', dialLinea: 'ECO-DRIVE',
    refFab: 'BN0150-28E',
    coleccion: 'De todos los días', condicion: 'nuevo',
    incluye: 'Caja Citizen, papeles y garantía de 5 años',
    lema: 'Nunca le vas a cambiar la pila. Se carga con la luz.',
    precio: 8200, precioLista: 9900, anio: 2024, stock: 3, estilo: 'buceo',
    caja: { metal: 'acero', diametro: 44, altura: 12.5, agua: 200, cristal: 'Mineral' },
    calibre: { nombre: 'Citizen E168 Eco-Drive', tipo: 'cuarzo solar', frecuencia: '32,768 Hz', rubies: 0, reserva: 4380 },
    dial: { base: '#101215', textura: 'mate', indices: 'puntos', tinta: '#f0ece2', lume: true },
    bisel: { tipo: 'buceo', colorDia: '#16181c', colorNoche: null },
    manecillas: { tipo: 'espada', color: '#f0ece2' },
    complicaciones: ['fecha'], correa: 'cauchoNegro',
    variantes: [
      { id: 'negro',   nombre: 'Negro (BN0150-28E)',   base: '#101215', tinta: '#f0ece2', extra: 0 },
      { id: 'azul',    nombre: 'Azul (BN0151-09L)',    base: '#132a4c', tinta: '#f0ece2', extra: 0 }
    ],
    correasExtra: ['cauchoNegro', 'acero', 'natoNegro'],
    notas: [
      'Certificado ISO 6425 de buceo: no es un “estilo diver”, es un diver.',
      'Seis meses de reserva a oscuras con la carga llena.',
      'Cinco años de garantía Citizen, la más larga de este rango.'
    ]
  },
  {
    id: 'seiko-turtle-srpe93',
    marca: 'Seiko', modelo: 'Prospex "Turtle"', dialLinea: 'PROSPEX',
    refFab: 'SRPE93K1',
    coleccion: 'Bajo el agua', condicion: 'nuevo',
    incluye: 'Caja Prospex, papeles y garantía de 2 años',
    lema: 'La caja de tortuga que lleva cincuenta años sin cambiar de forma.',
    precio: 11900, precioLista: 14500, anio: 2024, stock: 2, estilo: 'buceo',
    caja: { metal: 'acero', diametro: 45, altura: 13.2, agua: 200, cristal: 'Hardlex' },
    calibre: { nombre: 'Seiko 4R36', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 24, reserva: 41 },
    dial: { base: '#121316', textura: 'sunburst', indices: 'puntos', tinta: '#f2eee4', lume: true },
    bisel: { tipo: 'buceo', colorDia: '#17191d', colorNoche: null },
    manecillas: { tipo: 'espada', color: '#f2eee4' },
    complicaciones: ['fecha'], correa: 'cauchoNegro',
    variantes: [
      { id: 'negro', nombre: 'Negro (SRPE93K1)', base: '#121316', tinta: '#f2eee4', extra: 0 },
      { id: 'azul',  nombre: 'Azul (SRPE95K1)',  base: '#14294a', tinta: '#f2eee4', extra: 0 }
    ],
    correasExtra: ['cauchoNegro', 'acero', 'natoNegro', 'natoOliva'],
    notas: [
      'Cuarenta y cinco milímetros de ancho pero 44 de asa a asa: se pone más chico de lo que suena.',
      'Corona a las cuatro para que no se te entierre en la mano.',
      'El lume Seiko es de los mejores que existen a cualquier precio.'
    ]
  },
  {
    id: 'hamilton-khaki-field',
    marca: 'Hamilton', modelo: 'Khaki Field Mechanical', dialLinea: 'KHAKI FIELD',
    refFab: 'H69439931',
    coleccion: 'De todos los días', condicion: 'nuevo',
    incluye: 'Caja Hamilton, papeles y garantía internacional de 2 años',
    lema: 'Copia fiel del reloj de campaña del ejército. Sin adornos.',
    precio: 14500, precioLista: 16900, anio: 2024, stock: 2, estilo: 'campo',
    caja: { metal: 'acero', diametro: 38, altura: 9.5, agua: 50, cristal: 'Zafiro' },
    calibre: { nombre: 'Hamilton H-50', tipo: 'cuerda manual', frecuencia: '21,600 alt/h', rubies: 17, reserva: 80 },
    dial: { base: '#141517', textura: 'mate', indices: 'arabigo', tinta: '#e2dcc8', lume: true },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'baton', color: '#e2dcc8' },
    complicaciones: [], correa: 'natoOliva',
    variantes: [
      { id: 'negro', nombre: 'Dial negro (H69439931)', base: '#141517', tinta: '#e2dcc8', extra: 0 },
      { id: 'khaki', nombre: 'Dial caqui (H69439363)', base: '#3a3524', tinta: '#e6ddc4', extra: 600 }
    ],
    correasExtra: ['natoOliva', 'natoNegro', 'pielCafe', 'acero'],
    notas: [
      'Ochenta horas de reserva con un solo barrilete: le das cuerda el viernes y llega al lunes.',
      'Zafiro y treinta y ocho milímetros: proporción de reloj militar de verdad.',
      'Sin fecha, sin segundero pequeño, sin nada de más.'
    ]
  },
  {
    id: 'tissot-prx-powermatic',
    marca: 'Tissot', modelo: 'PRX Powermatic 80', dialLinea: 'POWERMATIC 80',
    refFab: 'T137.407.11.041.00',
    coleccion: 'De todos los días', condicion: 'nuevo',
    incluye: 'Caja Tissot, papeles y garantía internacional de 2 años',
    lema: 'Brazalete integrado de los setenta con mecánica de ahora.',
    precio: 18900, precioLista: 21500, anio: 2024, stock: 2, estilo: 'deportivo',
    caja: { metal: 'acero', diametro: 40, altura: 10.9, agua: 100, cristal: 'Zafiro' },
    calibre: { nombre: 'Powermatic 80', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 23, reserva: 80 },
    dial: { base: '#17335c', textura: 'guilloche', indices: 'baton', tinta: '#eceff4', lume: true },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'baton', color: '#eceff4' },
    complicaciones: ['fecha'], correa: 'aceroIntegr',
    variantes: [
      { id: 'azul',  nombre: 'Azul (T137.407.11.041.00)',  base: '#17335c', tinta: '#eceff4', extra: 0 },
      { id: 'negro', nombre: 'Negro (T137.407.11.051.00)', base: '#151619', tinta: '#eceff4', extra: 0 },
      { id: 'plata', nombre: 'Plata (T137.407.11.031.00)', base: '#c8cad0', tinta: '#26272b', extra: 0 }
    ],
    correasExtra: ['aceroIntegr', 'cauchoNegro', 'cauchoAzul'],
    notas: [
      'Ochenta horas de reserva: lo dejas el viernes y sigue caminando el lunes en la mañana.',
      'El dial lleva el grabado en cuadrícula que le dicen “waffle”, hecho a máquina.',
      'La caja es de diez punto nueve milímetros: entra bajo el puño sin pelear.'
    ]
  },
  {
    id: 'oris-aquis-date',
    marca: 'Oris', modelo: 'Aquis Date 41.5', dialLinea: 'AQUIS',
    refFab: '01 733 7766 4135',
    coleccion: 'Bajo el agua', condicion: 'seminuevo',
    incluye: 'Caja y papeles completos · eslabones extra',
    estado: 'Excelente. Micro rayas de uso en el brazalete, caja y bisel sin golpes. Revisado y con marcha dentro de especificación.',
    lema: 'Trescientos metros de suizo, sin pagar el nombre de moda.',
    precio: 29900, precioLista: 46000, anio: 2022, stock: 1, estilo: 'buceo',
    caja: { metal: 'acero', diametro: 41.5, altura: 13.1, agua: 300, cristal: 'Zafiro abombado' },
    calibre: { nombre: 'Oris 733 (base Sellita SW200-1)', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 26, reserva: 38 },
    dial: { base: '#123456', textura: 'sunburst', indices: 'baton', tinta: '#f0f2f6', lume: true },
    bisel: { tipo: 'buceo', colorDia: '#0e2740', colorNoche: null },
    manecillas: { tipo: 'espada', color: '#f0f2f6' },
    complicaciones: ['fecha'], correa: 'acero',
    variantes: [
      { id: 'azul',  nombre: 'Azul degradado', base: '#123456', tinta: '#f0f2f6', extra: 0 },
      { id: 'negro', nombre: 'Negro',          base: '#131417', tinta: '#f0f2f6', extra: 0 }
    ],
    correasExtra: ['acero', 'cauchoNegro', 'cauchoAzul'],
    notas: [
      'Bisel de cerámica: se raya muchísimo menos que el aluminio.',
      'Trescientos metros con válvula de escape de helio.',
      'Marca independiente suiza, de las pocas que quedan sin dueño corporativo.'
    ]
  },
  {
    id: 'longines-master-moonphase',
    marca: 'Longines', modelo: 'Master Collection Moonphase', dialLinea: 'MASTER',
    refFab: 'L2.909.4.78.3',
    coleccion: 'Piezas serias', condicion: 'seminuevo',
    incluye: 'Caja y papeles · correa original de piel',
    estado: 'Como nuevo. Sin rayas visibles en caja ni cristal. Servicio hecho en 2024, con nota.',
    lema: 'Fase lunar y números romanos. El más elegante del cajón.',
    precio: 54000, precioLista: 78000, anio: 2021, stock: 1, estilo: 'complicacion',
    caja: { metal: 'acero', diametro: 40, altura: 12.5, agua: 30, cristal: 'Zafiro con antirreflejante' },
    calibre: { nombre: 'Longines L899 (base ETA A31.L91)', tipo: 'automático', frecuencia: '25,200 alt/h', rubies: 30, reserva: 64 },
    dial: { base: '#e9e5d8', textura: 'guilloche', indices: 'romano', tinta: '#2b2721', lume: false },
    bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
    manecillas: { tipo: 'dauphine', color: '#3a3a44' },
    complicaciones: ['fase-lunar', 'segundero-pequeno'], correa: 'pielNegra',
    variantes: [
      { id: 'plata', nombre: 'Dial plata barleycorn', base: '#e9e5d8', tinta: '#2b2721', extra: 0 },
      { id: 'azul',  nombre: 'Dial azul',             base: '#1c2f4e', tinta: '#e6e9f0', extra: 2500 }
    ],
    correasExtra: ['pielNegra', 'pielCafe', 'acero'],
    notas: [
      'Espiral de silicio: aguanta campos magnéticos que descomponen a otros.',
      'La fase lunar se ajusta con un pulsador escondido en el flanco de la caja.',
      'Cuarenta milímetros que se sienten más chicos por lo delgado del bisel.'
    ]
  },
  {
    id: 'tag-heuer-carrera-chrono',
    marca: 'TAG Heuer', modelo: 'Carrera Chronograph', dialLinea: 'CARRERA',
    refFab: 'CBN2A1B',
    coleccion: 'Piezas serias', condicion: 'seminuevo',
    incluye: 'Caja y papeles · brazalete original',
    estado: 'Muy bueno. Marcas de uso normales en el brazalete, cristal impecable. Cronógrafo probado y funcionando en los tres contadores.',
    lema: 'El cronógrafo de las carreras. Arranca sin que el segundero brinque.',
    precio: 59000, precioLista: 98000, anio: 2021, stock: 1, estilo: 'cronografo',
    caja: { metal: 'acero', diametro: 44, altura: 15.0, agua: 100, cristal: 'Zafiro abombado' },
    calibre: { nombre: 'TAG Heuer Calibre Heuer 02', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 33, reserva: 80 },
    dial: { base: '#141518', textura: 'sunburst', indices: 'baton', tinta: '#eeeae0', lume: true },
    bisel: { tipo: 'taquimetro', colorDia: '#17181b', colorNoche: null },
    manecillas: { tipo: 'baton', color: '#eeeae0' },
    complicaciones: ['cronografo', 'fecha'], correa: 'acero',
    variantes: [
      { id: 'negro', nombre: 'Dial negro',  base: '#141518', tinta: '#eeeae0', extra: 0 },
      { id: 'panda', nombre: 'Dial panda',  base: '#e9e5da', tinta: '#1b1c1f', extra: 3000 }
    ],
    correasExtra: ['acero', 'pielNegra', 'cauchoNegro'],
    notas: [
      'Rueda de columnas y embrague vertical: el segundero no tiembla al arrancar.',
      'Ochenta horas de reserva, cosa rara en un cronógrafo.',
      'Cuarenta y cuatro milímetros: es un reloj grande, revisa la prueba de talla.'
    ]
  },
  {
    id: 'tudor-black-bay-58',
    marca: 'Tudor', modelo: 'Black Bay Fifty-Eight', dialLinea: 'BLACK BAY',
    refFab: 'M79030B-0001',
    coleccion: 'Bajo el agua', condicion: 'seminuevo',
    incluye: 'Caja y papeles completos · correa de tela extra',
    estado: 'Excelente. Brazalete con micro rayas, bisel sin marcas. Certificado COSC vigente, marcha revisada.',
    lema: 'Treinta y nueve milímetros de proporción perfecta. El azul es el bueno.',
    precio: 98000, precioLista: 132000, anio: 2022, stock: 1, estilo: 'buceo',
    caja: { metal: 'acero', diametro: 39, altura: 11.9, agua: 200, cristal: 'Zafiro' },
    calibre: { nombre: 'Tudor MT5402 (COSC)', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 27, reserva: 70 },
    dial: { base: '#152a4c', textura: 'sunburst', indices: 'puntos', tinta: '#efe9d8', lume: true },
    bisel: { tipo: 'buceo', colorDia: '#152a4c', colorNoche: null },
    manecillas: { tipo: 'espada', color: '#efe9d8' },
    complicaciones: [], correa: 'acero',
    variantes: [
      { id: 'azul',  nombre: 'Azul (M79030B)', base: '#152a4c', tinta: '#efe9d8', extra: 0 },
      { id: 'negro', nombre: 'Negro (M79030N)', base: '#131417', tinta: '#efe9d8', extra: 0 }
    ],
    correasExtra: ['acero', 'natoNegro', 'pielCafe'],
    notas: [
      'Certificado COSC: entre −4 y +6 segundos por día, verificado por instituto suizo.',
      'Setenta horas de reserva y once punto nueve milímetros de alto.',
      'Las medidas del Submariner de 1958, que es de donde viene el nombre.'
    ]
  },
  {
    id: 'omega-seamaster-300m',
    marca: 'Omega', modelo: 'Seamaster Diver 300M', dialLinea: 'CO-AXIAL',
    refFab: '210.30.42.20.03.001',
    coleccion: 'Piezas serias', condicion: 'seminuevo',
    incluye: 'Caja completa, papeles y tarjeta de garantía sellada',
    estado: 'Excelente. Brazalete con uso ligero, cerámica del bisel sin marcas. Certificado METAS vigente.',
    lema: 'El dial de olas grabadas en cerámica. Se ve distinto en cada luz.',
    precio: 152000, precioLista: 198000, anio: 2022, stock: 1, estilo: 'buceo',
    caja: { metal: 'acero', diametro: 42, altura: 13.5, agua: 300, cristal: 'Zafiro abombado antirreflejante' },
    calibre: { nombre: 'Omega 8800 Co-Axial Master Chronometer', tipo: 'automático', frecuencia: '25,200 alt/h', rubies: 35, reserva: 55 },
    dial: { base: '#123a63', textura: 'guilloche', indices: 'puntos', tinta: '#f2f4f8', lume: true },
    bisel: { tipo: 'buceo', colorDia: '#0e2c4c', colorNoche: null },
    manecillas: { tipo: 'espada', color: '#f2f4f8' },
    complicaciones: ['fecha'], correa: 'acero',
    variantes: [
      { id: 'azul',  nombre: 'Azul (210.30.42.20.03.001)',  base: '#123a63', tinta: '#f2f4f8', extra: 0 },
      { id: 'negro', nombre: 'Negro (210.30.42.20.01.001)', base: '#111214', tinta: '#f2f4f8', extra: 0 }
    ],
    correasExtra: ['acero', 'cauchoNegro', 'cauchoAzul'],
    notas: [
      'Master Chronometer certificado METAS: aguanta 15,000 gauss de magnetismo.',
      'Escape Co-Axial: menos fricción, servicios más espaciados.',
      'Válvula de escape de helio a las diez, funcional.'
    ]
  }
];

/* --- Curadurías del catálogo --------------------------------------------- */
AV.COLECCIONES = [
  { id: 'Para empezar',      numero: '01', desc: 'Tu primer reloj en serio, sin gastar de más. Aquí es donde casi todos deberían empezar.' },
  { id: 'De todos los días', numero: '02', desc: 'Los que aguantan oficina, fin de semana y regaderazo sin que los andes cuidando.' },
  { id: 'Bajo el agua',      numero: '03', desc: 'Divers de verdad: bisel unidireccional, doscientos metros para arriba y lume que se lee.' },
  { id: 'Piezas serias',     numero: '04', desc: 'Cuando ya sabes lo que quieres. Suizos, con papeles y con historia detrás.' }
];

/* --- Husos horarios de la sección "Hora en el mundo" ---------------------- */
AV.HUSOS = [
  { ciudad: 'Guadalajara', zona: 'America/Mexico_City', codigo: 'GDL' },
  { ciudad: 'Ginebra',     zona: 'Europe/Zurich',       codigo: 'GVA' },
  { ciudad: 'Tokio',       zona: 'Asia/Tokyo',          codigo: 'TYO' },
  { ciudad: 'Nueva York',  zona: 'America/New_York',    codigo: 'NYC' }
];

/* --- Fotos ----------------------------------------------------------------
   Cada reloj puede traer un arreglo `fotos` con los nombres de archivo que
   estén en assets/fotos/. Mientras no lo traiga, la tienda dibuja la pieza.
   Ver assets/fotos/LEEME.md.                                              */
AV.RUTA_FOTOS = 'assets/fotos/';
AV.fotosDe = r => (r.fotos || []).map(n =>
  ((window.AVTienda || {}).rutaBase || '') + AV.RUTA_FOTOS + n);
AV.tieneFotos = r => !!(r.fotos && r.fotos.length);

/* --- Utilidades ----------------------------------------------------------- */
AV.porId = id => AV.RELOJES.find(r => r.id === id) || null;
AV.precioMXN = n => '$' + Math.round(n).toLocaleString('es-MX');
AV.nombreCompleto = r => `${r.marca} ${r.modelo}`;
AV.MARCAS = [...new Set(AV.RELOJES.map(r => r.marca))].sort();

window.AV = AV;
