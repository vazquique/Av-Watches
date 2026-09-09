/* ==========================================================================
   AV WATCHES · La colección (filtros y orden)
   Los filtros viven en la URL: así una búsqueda se puede compartir.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const vitrina = document.getElementById('vitrina');
  const conteo = document.getElementById('conteo');
  const params = new URLSearchParams(location.search);

  const ESTILOS = {
    buceo: 'Buceo', cronografo: 'Cronógrafo', viajero: 'Viajero', vestir: 'De vestir',
    campo: 'De campo', deportivo: 'Deportivo', complicacion: 'Alta complicación'
  };
  const COMPS = {
    fecha: 'Fecha', gmt: 'Segundo huso', cronografo: 'Cronógrafo',
    'fase-lunar': 'Fase lunar', reserva: 'Reserva de marcha',
    'segundero-pequeno': 'Segundero pequeño', mundo: 'Hora mundial'
  };

  /* --- Construcción de las casillas, con su conteo real -------------------- */
  function casillas(cont, campo, opciones, etiquetar) {
    document.getElementById(cont).innerHTML = opciones.map(o => {
      const n = AV.RELOJES.filter(r => coincide(r, campo, o)).length;
      const marcado = (params.get(campo) || '').split(',').includes(o);
      return `<label class="av-check">
        <input type="checkbox" name="${campo}" value="${o}" ${marcado ? 'checked' : ''}>
        <span>${etiquetar ? etiquetar(o) : o}</span><span class="cuenta">${n}</span>
      </label>`;
    }).join('');
  }

  function coincide(r, campo, valor) {
    if (campo === 'coleccion') return r.coleccion === valor;
    if (campo === 'estilo') return r.estilo === valor;
    if (campo === 'metal') return r.caja.metal === valor;
    if (campo === 'comp') return r.complicaciones.includes(valor);
    return true;
  }

  casillas('f-coleccion', 'coleccion', AV.COLECCIONES.map(c => c.id));
  casillas('f-estilo', 'estilo', Object.keys(ESTILOS).filter(e => AV.RELOJES.some(r => r.estilo === e)), o => ESTILOS[o]);
  casillas('f-metal', 'metal', Object.keys(AV.METALES).filter(m => AV.RELOJES.some(r => r.caja.metal === m)), o => AV.METALES[o].nombre.replace(/ (316L|grado 5|18k|CuSn8|950|negro)/, ''));
  casillas('f-comp', 'comp', Object.keys(COMPS).filter(c => AV.RELOJES.some(r => r.complicaciones.includes(c))), o => COMPS[o]);

  const form = document.getElementById('filtros');
  const rPrecio = document.getElementById('f-precio'), rDiam = document.getElementById('f-diam');
  const orden = document.getElementById('orden');
  if (params.get('orden')) orden.value = params.get('orden');
  if (params.get('precio')) rPrecio.value = params.get('precio');
  if (params.get('diam')) rDiam.value = params.get('diam');

  const marcados = campo => Array.from(form.querySelectorAll(`input[name="${campo}"]:checked`)).map(i => i.value);

  function aplicar(actualizarUrl) {
    const sel = { coleccion: marcados('coleccion'), estilo: marcados('estilo'), metal: marcados('metal'), comp: marcados('comp') };
    const tope = +rPrecio.value, diamMax = +rDiam.value;

    let lista = AV.RELOJES.filter(r =>
      (!sel.coleccion.length || sel.coleccion.includes(r.coleccion)) &&
      (!sel.estilo.length || sel.estilo.includes(r.estilo)) &&
      (!sel.metal.length || sel.metal.includes(r.caja.metal)) &&
      (!sel.comp.length || sel.comp.every(c => r.complicaciones.includes(c))) &&
      r.precio <= tope && r.caja.diametro <= diamMax
    );

    const ordenar = {
      'precio-asc': (a, b) => a.precio - b.precio,
      'precio-desc': (a, b) => b.precio - a.precio,
      'nuevo': (a, b) => b.anio - a.anio || b.precio - a.precio,
      'tamano': (a, b) => a.caja.diametro - b.caja.diametro,
      'raro': (a, b) => (a.piezas || 9999) - (b.piezas || 9999),
      'destacado': (a, b) => AV.RELOJES.indexOf(a) - AV.RELOJES.indexOf(b)
    }[orden.value];
    lista = lista.slice().sort(ordenar);

    conteo.textContent = lista.length === 1 ? '1 pieza' : `${lista.length} piezas`;
    document.getElementById('f-precio-val').textContent = tope >= 100000 ? 'Sin tope' : AV.precioMXN(tope);
    document.getElementById('f-diam-val').textContent = diamMax + ' mm';
    AVComp.pintarVitrina(vitrina, lista);

    if (actualizarUrl !== false) {
      const p = new URLSearchParams();
      Object.entries(sel).forEach(([k, v]) => v.length && p.set(k, v.join(',')));
      if (tope < 100000) p.set('precio', tope);
      if (diamMax < 43) p.set('diam', diamMax);
      if (orden.value !== 'destacado') p.set('orden', orden.value);
      history.replaceState(null, '', p.toString() ? '?' + p : location.pathname);
    }
  }

  form.addEventListener('change', () => aplicar());
  form.addEventListener('input', () => aplicar());
  orden.addEventListener('change', () => aplicar());
  document.getElementById('f-limpiar').onclick = () => {
    form.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
    rPrecio.value = 100000; rDiam.value = 43; orden.value = 'destacado';
    aplicar();
  };

  aplicar(false);
});
