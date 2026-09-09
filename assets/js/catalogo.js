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
    campo: 'De campo', deportivo: 'Deportivo', complicacion: 'Con complicación'
  };
  const CONDICIONES = { nuevo: 'Nuevo, sellado', seminuevo: 'Seminuevo' };
  const MECANICAS = { 'automático': 'Automático', 'cuerda manual': 'Cuerda manual', 'cuarzo': 'Cuarzo', 'cuarzo solar': 'Cuarzo solar' };
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
    if (campo === 'marca') return r.marca === valor;
    if (campo === 'condicion') return r.condicion === valor;
    if (campo === 'mecanica') return r.calibre.tipo === valor;
    if (campo === 'estilo') return r.estilo === valor;
    if (campo === 'comp') return r.complicaciones.includes(valor);
    return true;
  }

  casillas('f-coleccion', 'coleccion', AV.COLECCIONES.map(c => c.id));
  casillas('f-marca', 'marca', AV.MARCAS);
  casillas('f-condicion', 'condicion', Object.keys(CONDICIONES), o => CONDICIONES[o]);
  casillas('f-mecanica', 'mecanica', Object.keys(MECANICAS).filter(m => AV.RELOJES.some(r => r.calibre.tipo === m)), o => MECANICAS[o]);
  casillas('f-estilo', 'estilo', Object.keys(ESTILOS).filter(e => AV.RELOJES.some(r => r.estilo === e)), o => ESTILOS[o]);
  casillas('f-comp', 'comp', Object.keys(COMPS).filter(c => AV.RELOJES.some(r => r.complicaciones.includes(c))), o => COMPS[o]);

  const form = document.getElementById('filtros');
  const rPrecio = document.getElementById('f-precio'), rDiam = document.getElementById('f-diam');
  const orden = document.getElementById('orden');
  if (params.get('orden')) orden.value = params.get('orden');
  if (params.get('precio')) rPrecio.value = params.get('precio');
  if (params.get('diam')) rDiam.value = params.get('diam');

  const marcados = campo => Array.from(form.querySelectorAll(`input[name="${campo}"]:checked`)).map(i => i.value);

  function aplicar(actualizarUrl) {
    const sel = {
      coleccion: marcados('coleccion'), marca: marcados('marca'), condicion: marcados('condicion'),
      mecanica: marcados('mecanica'), estilo: marcados('estilo'), comp: marcados('comp')
    };
    const tope = +rPrecio.value, diamMax = +rDiam.value;

    let lista = AV.RELOJES.filter(r =>
      (!sel.coleccion.length || sel.coleccion.includes(r.coleccion)) &&
      (!sel.marca.length || sel.marca.includes(r.marca)) &&
      (!sel.condicion.length || sel.condicion.includes(r.condicion)) &&
      (!sel.mecanica.length || sel.mecanica.includes(r.calibre.tipo)) &&
      (!sel.estilo.length || sel.estilo.includes(r.estilo)) &&
      (!sel.comp.length || sel.comp.every(c => r.complicaciones.includes(c))) &&
      r.precio <= tope && r.caja.diametro <= diamMax
    );

    const ordenar = {
      'precio-asc': (a, b) => a.precio - b.precio,
      'precio-desc': (a, b) => b.precio - a.precio,
      'nuevo': (a, b) => b.anio - a.anio || b.precio - a.precio,
      'tamano': (a, b) => a.caja.diametro - b.caja.diametro,
      'stock': (a, b) => a.stock - b.stock,
      'destacado': (a, b) => AV.RELOJES.indexOf(a) - AV.RELOJES.indexOf(b)
    }[orden.value];
    lista = lista.slice().sort(ordenar);

    conteo.textContent = lista.length === 1 ? '1 reloj' : `${lista.length} relojes`;
    document.getElementById('f-precio-val').textContent = tope >= 160000 ? 'Sin tope' : AV.precioMXN(tope);
    document.getElementById('f-diam-val').textContent = diamMax + ' mm';
    AVComp.pintarVitrina(vitrina, lista);

    if (actualizarUrl !== false) {
      const p = new URLSearchParams();
      Object.entries(sel).forEach(([k, v]) => v.length && p.set(k, v.join(',')));
      if (tope < 160000) p.set('precio', tope);
      if (diamMax < 45) p.set('diam', diamMax);
      if (orden.value !== 'destacado') p.set('orden', orden.value);
      history.replaceState(null, '', p.toString() ? '?' + p : location.pathname);
    }
  }

  form.addEventListener('change', () => aplicar());
  form.addEventListener('input', () => aplicar());
  orden.addEventListener('change', () => aplicar());
  document.getElementById('f-limpiar').onclick = () => {
    form.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
    rPrecio.value = 160000; rDiam.value = 45; orden.value = 'destacado';
    aplicar();
  };

  aplicar(false);

  /* ----------------------------------------------------------------------
     En móvil los filtros viven detrás de un botón: ocupaban media pantalla
     antes de dejar ver un reloj.
     ---------------------------------------------------------------------- */
  const abrir = document.getElementById('filtros-abrir');
  const cuenta = document.getElementById('filtros-cuenta');
  const cerrarFiltros = () => {
    document.body.classList.remove('av-filtros-abiertos', 'av-bloqueado');
    abrir.setAttribute('aria-expanded', 'false');
  };
  abrir.onclick = () => {
    document.body.classList.add('av-filtros-abiertos', 'av-bloqueado');
    abrir.setAttribute('aria-expanded', 'true');
  };
  document.getElementById('filtros-cerrar').onclick = cerrarFiltros;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarFiltros(); });

  /* El botón dice cuántos filtros hay puestos. */
  function contarFiltros() {
    const n = form.querySelectorAll('input[type="checkbox"]:checked').length
            + (+rPrecio.value < 160000 ? 1 : 0) + (+rDiam.value < 45 ? 1 : 0);
    cuenta.textContent = n ? `${n} activo${n > 1 ? 's' : ''}` : '';
  }
  form.addEventListener('change', contarFiltros);
  form.addEventListener('input', contarFiltros);
  contarFiltros();

  /* En móvil el selector de orden se muda dentro del panel: el botón dice
     "filtrar y ordenar" y tiene que cumplir las dos cosas. */
  const orden_caja = document.querySelector('.av-orden');
  const cabecera = orden_caja.parentNode;
  const acomodarOrden = () => {
    const movil = matchMedia('(max-width: 980px)').matches;
    if (movil && orden_caja.parentNode !== form) form.insertBefore(orden_caja, form.querySelector('.av-filtro'));
    else if (!movil && orden_caja.parentNode === form) cabecera.appendChild(orden_caja);
  };
  acomodarOrden();
  addEventListener('resize', acomodarOrden);

  /* Si se llega con un filtro en la dirección, se muestra ya aplicado. */
  if (location.hash === '#filtros' && matchMedia('(max-width: 980px)').matches) abrir.click();
});
