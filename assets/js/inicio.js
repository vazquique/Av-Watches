/* ==========================================================================
   AV WATCHES · Portada
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Marquesina: se duplica el contenido para que el bucle no salte. --- */
  const frases = [
    'Nuevos y <b>seminuevos</b>', 'Envío asegurado <b>sin costo</b>',
    'Entrega en mano en <b>Guadalajara</b>', '7 días para devolverlo',
    'Cada pieza <b>revisada</b> antes de publicarse', 'Con caja y papeles',
    'Meses sin intereses', 'Consigo modelos <b>por encargo</b>'
  ];
  const tira = frases.map(f => `<span>${f} <b>✦</b></span>`).join('');
  document.getElementById('marquesina').innerHTML = tira + tira;

  /* ----------------------------------------------------------------------
     EL ESCAPARATE
     Una pieza por curaduría, para que se vea todo el rango de la tienda.
     Va rotando sola, y se detiene en cuanto alguien la toca.
     ---------------------------------------------------------------------- */
  const TURNO = 7000;
  const enVitrina = AV.COLECCIONES
    .map(c => AV.RELOJES.filter(r => r.coleccion === c.id).sort((a, b) => b.anio - a.anio || b.precio - a.precio)[0])
    .filter(Boolean);

  const escPieza = document.getElementById('esc-pieza');
  const escLista = document.getElementById('esc-lista');
  let escActual = -1, escTemporizador = null, escDetenido = false;

  escLista.innerHTML = enVitrina.map((p, i) => `
    <li><button type="button" data-esc="${i}" aria-current="false">
      <span class="n">0${i + 1}</span>
      <span class="m">${p.modelo}<em>${p.marca} · ${p.condicion === 'nuevo' ? 'Nuevo' : 'Seminuevo'}</em></span>
      <span class="p">${AV.precioMXN(p.precio)}</span>
    </button></li>`).join('');

  function mostrarEnVitrina(i, porGusto) {
    if (i === escActual) return;
    const p = enVitrina[i];
    escActual = i;

    /* Sale la anterior, entra la nueva. */
    escPieza.classList.add('cambiando');
    setTimeout(() => {
      escPieza.innerHTML = AVMotor.svgReloj(p, {});
      AVMotor.refrescar();
      escPieza.classList.remove('cambiando');
    }, 220);

    document.getElementById('esc-marca').textContent = p.marca;
    document.getElementById('esc-modelo').textContent = p.modelo;
    document.getElementById('esc-lema').textContent = p.lema;
    document.getElementById('esc-pie').textContent = `${p.coleccion} · ref. ${p.refFab}`;
    document.getElementById('esc-precio').innerHTML = AV.precioMXN(p.precio) +
      (p.precioLista > p.precio ? `<s>${AV.precioMXN(p.precioLista)}</s>` : '');
    document.getElementById('esc-ir').href = 'reloj.html?id=' + p.id;
    document.getElementById('esc-datos').innerHTML = `
      <div><dt>Caja</dt><dd>${p.caja.diametro}<small> mm</small></dd></div>
      <div><dt>Alto</dt><dd>${p.caja.altura}<small> mm</small></dd></div>
      <div><dt>${/cuarzo/.test(p.calibre.tipo) ? 'Pila' : 'Reserva'}</dt><dd>${
        p.calibre.reserva >= 8760 ? Math.round(p.calibre.reserva / 8760) + '<small> años</small>'
        : p.calibre.reserva >= 720 ? Math.round(p.calibre.reserva / 730) + '<small> meses</small>'
        : p.calibre.reserva + '<small> h</small>'}</dd></div>`;

    escLista.querySelectorAll('[data-esc]').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      if (k === i) { b.style.removeProperty('--turno'); void b.offsetWidth; b.style.setProperty('--turno', (escDetenido || porGusto ? 0 : TURNO) + 'ms'); }
    });

    clearTimeout(escTemporizador);
    if (!escDetenido) escTemporizador = setTimeout(() => mostrarEnVitrina((i + 1) % enVitrina.length), TURNO);
  }

  escLista.addEventListener('click', e => {
    const b = e.target.closest('[data-esc]'); if (!b) return;
    escDetenido = true;                     /* si eligen a mano, deja de rotar */
    clearTimeout(escTemporizador);
    mostrarEnVitrina(+b.dataset.esc, true);
  });

  /* Mientras no se vea en pantalla, no gasta turnos. */
  const ioEsc = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) { clearTimeout(escTemporizador); }
    else if (!escDetenido && escActual >= 0) escTemporizador = setTimeout(() => mostrarEnVitrina((escActual + 1) % enVitrina.length), TURNO);
  }), { threshold: 0.25 });
  ioEsc.observe(document.querySelector('.av-esc'));

  mostrarEnVitrina(0);

  /* --- Colecciones ------------------------------------------------------- */
  document.getElementById('lista-colecciones').innerHTML = AV.COLECCIONES.map((c, i) => {
    const dentro = AV.RELOJES.filter(r => r.coleccion === c.id);
    const n = dentro.length;
    const desde = Math.min(...dentro.map(r => r.precio));
    return `<article class="av-col" data-revelar data-retraso="${i}">
      <span class="av-col__num">${c.numero}</span>
      <div>
        <h3 class="av-col__nom"><a href="catalogo.html?coleccion=${encodeURIComponent(c.id)}">${c.id}</a></h3>
        <p class="av-col__desc">${c.desc}</p>
      </div>
      <span class="av-col__flecha">${n} relojes · desde ${AV.precioMXN(desde)}</span>
    </article>`;
  }).join('');

  /* --- Calibre ----------------------------------------------------------- */
  document.getElementById('mecanismo').innerHTML = AVComp.mecanismoSVG();

  /* --- Hora en el mundo: cuatro piezas viajeras en su huso -------------- */
  /* Cuatro relojes del catálogo, cada uno puesto en su ciudad. */
  const viajeras = ['omega-seamaster-300m', 'tissot-prx-powermatic', 'seiko-5-srpd55', 'hamilton-khaki-field'];
  document.getElementById('husos').innerHTML = AV.HUSOS.map((h, i) => `
    <article class="av-huso" data-revelar data-retraso="${i}">
      <div data-reloj="${viajeras[i]}" data-tz="${h.zona}"></div>
      <p class="av-huso__ciudad">${h.ciudad}</p>
      <p class="av-huso__hora" data-hora-tz="${h.zona}">--:--</p>
      <p class="av-huso__cod">${h.codigo}</p>
    </article>`).join('');

  const relojesTexto = document.querySelectorAll('[data-hora-tz]');
  const refrescarHoras = () => relojesTexto.forEach(el => {
    el.textContent = new Intl.DateTimeFormat('es-MX', { timeZone: el.dataset.horaTz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  });
  refrescarHoras(); setInterval(refrescarHoras, 5000);

  /* --- Hero: la pieza en vitrina, con sus datos reales ------------------- */
  const p = AV.porId('tissot-prx-powermatic');
  document.getElementById('hero-ref').textContent = `${p.marca} ${p.modelo}`;
  document.getElementById('hero-cal').textContent = `${p.calibre.nombre} · ${p.calibre.reserva} h`;
  document.getElementById('hero-precio').textContent = AV.precioMXN(p.precio);
  const heroPieza = document.getElementById('hero-pieza');
  const irAFicha = () => location.href = 'reloj.html?id=' + p.id;
  heroPieza.addEventListener('click', irAFicha);
  heroPieza.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); irAFicha(); } });

  AVMotor.montarTodos();
  document.querySelectorAll('[data-revelar]').forEach(el => AVTienda.observar && AVTienda.observar(el));
});
