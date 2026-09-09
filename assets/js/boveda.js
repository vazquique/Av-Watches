/* ==========================================================================
   AV WATCHES · Tu bóveda
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const cont = document.getElementById('vitrina-boveda');
  const conteo = document.getElementById('conteo-boveda');

  function pintar() {
    const piezas = AVTienda.estado.boveda.map(AV.porId).filter(Boolean);
    conteo.textContent = piezas.length ? `${piezas.length} pieza${piezas.length > 1 ? 's' : ''} · ${AV.precioMXN(piezas.reduce((s, p) => s + p.precio, 0))} en total` : '';
    if (!piezas.length) {
      cont.style.border = '0';
      cont.innerHTML = `<div class="av-vacio" style="border:var(--filo)">
        <p class="av-t-lead">La bóveda está vacía.</p>
        <p>Guarda aquí las piezas que te traen dando vueltas. Se quedan en este navegador, nadie más las ve.</p>
        <a class="av-btn av-btn--laton" href="catalogo.html">Ver la colección</a></div>`;
      return;
    }
    cont.style.border = '';
    AVComp.pintarVitrina(cont, piezas);
  }

  document.addEventListener('av:cambio', pintar);
  pintar();
});
