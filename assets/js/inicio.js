/* ==========================================================================
   AV WATCHES · Portada
   Corta a propósito: atajos, cuatro piezas y salida hacia el catálogo.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Atajos: cada curaduría con su cuenta y su precio de entrada ------- */
  document.getElementById('atajos').innerHTML = AV.COLECCIONES.map(c => {
    const dentro = AV.RELOJES.filter(r => r.coleccion === c.id);
    const desde = Math.min(...dentro.map(r => r.precio));
    return `<a class="av-atajo" href="catalogo.html?coleccion=${encodeURIComponent(c.id)}">
      <b>${c.id}</b>
      <span class="av-mono">${dentro.length} piezas · desde ${AV.precioMXN(desde)}</span>
    </a>`;
  }).join('');

  /* --- Recién llegados: uno por curaduría, para que se vea el rango ------ */
  const destacadas = AV.COLECCIONES
    .map(c => AV.RELOJES.filter(r => r.coleccion === c.id).sort((a, b) => b.anio - a.anio || b.precio - a.precio)[0])
    .filter(Boolean);
  AVComp.pintarVitrina(document.getElementById('vitrina-destacadas'), destacadas);

  /* --- La pieza del encabezado lleva a su ficha ------------------------- */
  const pieza = document.getElementById('hero-pieza');
  const ir = () => location.href = 'reloj.html?id=' + pieza.dataset.reloj;
  pieza.addEventListener('click', ir);
  pieza.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ir(); } });

  AVMotor.montarTodos();
});
