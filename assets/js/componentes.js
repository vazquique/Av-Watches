/* ==========================================================================
   AV WATCHES · Piezas de interfaz reutilizables
   ========================================================================== */
(function (global) {
  'use strict';
  const r = () => AVTienda.rutaBase;

  const ICONO = {
    corazon: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17S2.5 12.4 2.5 7.4A3.9 3.9 0 0 1 10 5.6a3.9 3.9 0 0 1 7.5 1.8C17.5 12.4 10 17 10 17Z"/></svg>',
    banco:   '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 16V7M10 16V4M17 16v-6"/><path d="M1 18h18"/></svg>'
  };

  /* Sellos de vitrina: lo que hay que saber antes de leer la ficha. */
  function sello(p) {
    if (p.stock === 1) return '<span class="av-sello av-sello--ultima">Última pieza</span>';
    if (p.condicion === 'seminuevo') return '<span class="av-sello av-sello--serie">Seminuevo</span>';
    if (p.stock <= 2) return `<span class="av-sello av-sello--ultima">Quedan ${p.stock}</span>`;
    return '';
  }

  /* Precio con el de lista tachado cuando hay diferencia real. */
  function precio(p) {
    const ahorro = p.precioLista && p.precioLista > p.precio;
    return `<span class="av-pieza__precio">${AV.precioMXN(p.precio)}` +
      (ahorro ? `<s>${AV.precioMXN(p.precioLista)}</s>` : '') + `</span>`;
  }

  /* Tarjeta de vitrina. La tarjeta entera es el enlace a la ficha. */
  function tarjeta(p, retraso) {
    return `<article class="av-pieza" data-revelar ${retraso ? `data-retraso="${retraso % 6}"` : ''} data-pieza="${p.id}">
      <div class="av-pieza__cab"><b>${p.marca}</b><span>${p.coleccion}</span></div>
      ${sello(p)}
      <div class="av-pieza__lienzo" data-reloj="${p.id}"></div>
      <h3 class="av-pieza__nom"><a href="${r()}reloj.html?id=${p.id}">${p.modelo}</a></h3>
      <p class="av-pieza__specs av-mono">${p.caja.diametro} mm · ${p.calibre.tipo} · ${p.condicion === 'nuevo' ? 'nuevo' : 'seminuevo'}</p>
      <div class="av-pieza__pie">
        ${precio(p)}
        <div class="av-pieza__actos">
          <button type="button" class="av-pieza__acto boveda" data-boveda="${p.id}" aria-pressed="${AVTienda.enBoveda(p.id)}" aria-label="Guardar ${p.marca} ${p.modelo} en tu bóveda">${ICONO.corazon}</button>
          <button type="button" class="av-pieza__acto comparar" data-comparar="${p.id}" aria-pressed="${AVTienda.enComparador(p.id)}" aria-label="Comparar ${p.marca} ${p.modelo}">${ICONO.banco}</button>
        </div>
      </div>
    </article>`;
  }

  /* Enciende los botones de bóveda y banco dentro de un contenedor. */
  function conectarTarjetas(raiz) {
    (raiz || document).querySelectorAll('[data-boveda]').forEach(b => {
      if (b.dataset.listo) return; b.dataset.listo = '1';
      b.onclick = e => { e.preventDefault(); e.stopPropagation(); b.setAttribute('aria-pressed', AVTienda.boveda(b.dataset.boveda)); };
    });
    (raiz || document).querySelectorAll('[data-comparar]').forEach(b => {
      if (b.dataset.listo) return; b.dataset.listo = '1';
      b.onclick = e => { e.preventDefault(); e.stopPropagation(); b.setAttribute('aria-pressed', AVTienda.comparar(b.dataset.comparar)); };
    });
  }

  /* Pinta una lista de piezas en un contenedor y las deja vivas. */
  function pintarVitrina(cont, lista) {
    if (!lista.length) {
      cont.innerHTML = `<div class="av-sin-resultados">
        <p class="av-t-lead">Ninguna pieza cumple con eso.</p>
        <p class="av-tenue">Afloja un filtro, o escríbeme qué buscas: consigo piezas por encargo.</p>
      </div>`;
      return;
    }
    cont.innerHTML = lista.map((p, i) => tarjeta(p, i)).join('');
    AVMotor.montarTodos(cont);
    conectarTarjetas(cont);
    if (AVTienda.observar) cont.querySelectorAll('[data-revelar]').forEach(AVTienda.observar);
    else cont.querySelectorAll('[data-revelar]').forEach(el => el.classList.add('visible'));
  }

  /* El esquema del movimiento vive en mecanismo.js, que sabe de engranajes. */
  const mecanismoSVG = () => (global.AVMecanismo || {}).mecanismoSVG ? global.AVMecanismo.mecanismoSVG() : '';

  global.AVComp = { tarjeta, conectarTarjetas, pintarVitrina, mecanismoSVG, sello, precio, ICONO };
})(window);
