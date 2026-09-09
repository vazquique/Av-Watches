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
    if (p.stock <= 3) return `<span class="av-sello av-sello--ultima">Quedan ${p.stock}</span>`;
    if (p.piezas && p.piezas <= 100) return `<span class="av-sello av-sello--serie">Serie de ${p.piezas}</span>`;
    if (p.anio >= 2025) return '<span class="av-sello av-sello--nueva">Novedad</span>';
    return '';
  }

  /* Tarjeta de vitrina. La tarjeta entera es el enlace a la ficha. */
  function tarjeta(p, retraso) {
    return `<article class="av-pieza" data-revelar ${retraso ? `data-retraso="${retraso % 6}"` : ''} data-pieza="${p.id}">
      <div class="av-pieza__cab"><b>${p.ref}</b><span>${p.coleccion}</span></div>
      ${sello(p)}
      <div class="av-pieza__lienzo" data-reloj="${p.id}"></div>
      <h3 class="av-pieza__nom"><a href="${r()}reloj.html?id=${p.id}">${p.nombre}</a></h3>
      <p class="av-pieza__lema">${p.lema}</p>
      <div class="av-pieza__cab" style="border-top:var(--filo);padding-top:.8rem">
        <span>${p.caja.diametro} mm · ${AV.METALES[p.caja.metal].nombre.split(' ')[0]}</span>
        <span>${p.calibre.tipo === 'automático' ? 'Automático' : 'Cuerda'}</span>
      </div>
      <div class="av-pieza__pie">
        <span class="av-pieza__precio">${AV.precioMXN(p.precio)}</span>
        <div class="av-pieza__actos">
          <button type="button" class="av-pieza__acto boveda" data-boveda="${p.id}" aria-pressed="${AVTienda.enBoveda(p.id)}" aria-label="Guardar ${p.nombre} en tu bóveda">${ICONO.corazon}</button>
          <button type="button" class="av-pieza__acto comparar" data-comparar="${p.id}" aria-pressed="${AVTienda.enComparador(p.id)}" aria-label="Comparar ${p.nombre}">${ICONO.banco}</button>
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
        <p class="av-tenue">Afloja un filtro o dinos qué buscas: armamos piezas por encargo.</p>
      </div>`;
      return;
    }
    cont.innerHTML = lista.map((p, i) => tarjeta(p, i)).join('');
    AVMotor.montarTodos(cont);
    conectarTarjetas(cont);
    if (AVTienda.observar) cont.querySelectorAll('[data-revelar]').forEach(AVTienda.observar);
    else cont.querySelectorAll('[data-revelar]').forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------------------
     Diagrama del calibre de la casa: un tren de rodaje que sí gira.
     ---------------------------------------------------------------------- */
  function engrane(cx, cy, radio, dientes, color, dur, sentido) {
    let d = '';
    for (let i = 0; i < dientes; i++) {
      const a = i * 360 / dientes, rad = g => (g - 90) * Math.PI / 180;
      const P = (rr, aa) => `${(cx + rr * Math.cos(rad(aa))).toFixed(1)} ${(cy + rr * Math.sin(rad(aa))).toFixed(1)}`;
      d += (i ? 'L ' : 'M ') + P(radio, a - 4) + ' L ' + P(radio * 1.13, a - 2) + ' L ' + P(radio * 1.13, a + 2) + ' L ' + P(radio, a + 4) + ' ';
    }
    let rayos = '';
    for (let s = 0; s < 5; s++) {
      const a = (s * 72 + 12 - 90) * Math.PI / 180;
      rayos += `<line x1="${cx}" y1="${cy}" x2="${(cx + radio * 0.9 * Math.cos(a)).toFixed(1)}" y2="${(cy + radio * 0.9 * Math.sin(a)).toFixed(1)}" stroke="${color}" stroke-width="1.4" opacity=".55"/>`;
    }
    return `<g class="av-engrane" style="--gx:${cx}px;--gy:${cy}px;--gd:${dur}s;--gdir:${sentido}">
      <path d="${d}Z" fill="none" stroke="${color}" stroke-width="1.6"/>${rayos}
      <circle cx="${cx}" cy="${cy}" r="${(radio * 0.22).toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.6"/>
    </g><circle cx="${cx}" cy="${cy}" r="3" fill="#C4452D"/>`;
  }

  function mecanismoSVG() {
    const l = '#C9A24A', t = 'rgba(160,160,170,.75)';
    return `<svg viewBox="0 0 420 300" role="img" aria-label="Esquema del calibre AV-01: barrilete, tren de rodaje, escape y volante">
      <g opacity=".5">
        <path d="M20 150 H400" stroke="${t}" stroke-width=".5" stroke-dasharray="2 6"/>
        <path d="M210 20 V280" stroke="${t}" stroke-width=".5" stroke-dasharray="2 6"/>
      </g>
      <!-- Puentes -->
      <path d="M40 120 Q140 60 250 96 T392 140 L380 190 Q250 150 150 190 T44 176 Z" fill="rgba(140,140,150,.07)" stroke="${t}" stroke-width="1"/>
      ${engrane(96, 150, 54, 40, l, 26, 'normal')}
      ${engrane(196, 132, 34, 26, t, 12, 'reverse')}
      ${engrane(268, 168, 26, 20, t, 7, 'normal')}
      ${engrane(330, 128, 18, 15, l, 4, 'reverse')}
      <!-- Volante: no gira, oscila -->
      <g class="av-volante" style="--vx:372px;--vy:206px">
        <circle cx="372" cy="206" r="30" fill="none" stroke="${l}" stroke-width="2"/>
        <circle cx="372" cy="206" r="22" fill="none" stroke="${l}" stroke-width="1" opacity=".5"/>
        <line x1="342" y1="206" x2="402" y2="206" stroke="${l}" stroke-width="1.6"/>
        <line x1="372" y1="176" x2="372" y2="236" stroke="${l}" stroke-width="1.6"/>
      </g>
      <circle cx="372" cy="206" r="3.5" fill="#C4452D"/>
      <!-- Rubíes -->
      ${[[96, 150], [196, 132], [268, 168], [330, 128]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#C4452D" stroke-width=".8" opacity=".6"/>`).join('')}
      <!-- Anotaciones de plano técnico -->
      <g font-family="'IBM Plex Mono',monospace" font-size="8.5" fill="${t}" letter-spacing="1.6">
        <line x1="96" y1="150" x2="96" y2="252" stroke="${t}" stroke-width=".6"/><text x="96" y="266" text-anchor="middle">BARRILETE · 41 H</text>
        <line x1="196" y1="132" x2="196" y2="52" stroke="${t}" stroke-width=".6"/><text x="196" y="44" text-anchor="middle">TREN DE RODAJE</text>
        <line x1="330" y1="128" x2="330" y2="62" stroke="${t}" stroke-width=".6"/><text x="330" y="54" text-anchor="middle">ESCAPE</text>
        <line x1="372" y1="236" x2="372" y2="262" stroke="${t}" stroke-width=".6"/><text x="372" y="276" text-anchor="end">VOLANTE · 4 HZ</text>
      </g>
    </svg>`;
  }

  global.AVComp = { tarjeta, conectarTarjetas, pintarVitrina, mecanismoSVG, sello, ICONO };
})(window);
