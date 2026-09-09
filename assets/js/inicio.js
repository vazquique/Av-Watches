/* ==========================================================================
   AV WATCHES · Portada
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Marquesina: se duplica el contenido para que el bucle no salte. --- */
  const frases = [
    'Hecho en <b>México</b>', 'Series cortas · nunca más de 200 piezas',
    'Calibres <b>propios</b> desde 2019', '5 años de garantía de taller',
    '15 días de regulación por pieza', 'Envío asegurado <b>sin costo</b>',
    'Grabado de fondo <b>incluido</b>', '30 días para devolverlo'
  ];
  const tira = frases.map(f => `<span>${f} <b>✦</b></span>`).join('');
  document.getElementById('marquesina').innerHTML = tira + tira;

  /* --- Vitrina de la semana: una pieza por colección, la más cara. ------- */
  const destacadas = AV.COLECCIONES.map(c =>
    AV.RELOJES.filter(r => r.coleccion === c.id).sort((a, b) => b.precio - a.precio)[0]
  ).filter(Boolean);
  AVComp.pintarVitrina(document.getElementById('vitrina-destacadas'), destacadas);

  /* --- Colecciones ------------------------------------------------------- */
  document.getElementById('lista-colecciones').innerHTML = AV.COLECCIONES.map((c, i) => {
    const n = AV.RELOJES.filter(r => r.coleccion === c.id).length;
    const desde = Math.min(...AV.RELOJES.filter(r => r.coleccion === c.id).map(r => r.precio));
    return `<article class="av-col" data-revelar data-retraso="${i}">
      <span class="av-col__num">${c.numero}</span>
      <div>
        <h3 class="av-col__nom"><a href="catalogo.html?coleccion=${encodeURIComponent(c.id)}">${c.id}</a></h3>
        <p class="av-col__desc">${c.desc}</p>
      </div>
      <span class="av-col__flecha">${n} piezas · desde ${AV.precioMXN(desde)}</span>
    </article>`;
  }).join('');

  /* --- Calibre ----------------------------------------------------------- */
  document.getElementById('mecanismo').innerHTML = AVComp.mecanismoSVG();

  /* --- Hora en el mundo: cuatro piezas viajeras en su huso -------------- */
  const viajeras = ['meridiano-105', 'obsidiana-gmt', 'bruma', 'chapopote'];
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

  /* --- Encabezado del hero con datos reales de la pieza expuesta -------- */
  const p = AV.porId('obsidiana-gmt');
  document.getElementById('hero-ref').textContent = `${p.ref} ${p.nombre}`;
  document.getElementById('hero-cal').textContent = `${p.calibre.nombre} · ${p.calibre.reserva} h`;
  document.getElementById('hero-precio').textContent = AV.precioMXN(p.precio);
  const heroPieza = document.getElementById('hero-pieza');
  const irAFicha = () => location.href = 'reloj.html?id=' + p.id;
  heroPieza.addEventListener('click', irAFicha);
  heroPieza.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); irAFicha(); } });

  AVMotor.montarTodos();
  document.querySelectorAll('[data-revelar]').forEach(el => AVTienda.observar && AVTienda.observar(el));
});
