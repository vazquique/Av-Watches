/* ==========================================================================
   AV WATCHES · El reloj de perfil
   --------------------------------------------------------------------------
   La vista de canto, dibujada a escala con las medidas reales de la ficha.
   El grosor es el dato que decide si un reloj entra bajo el puño de una
   camisa, y casi ninguna tienda lo enseña.
   Una unidad del viewBox = un milímetro, así que dos relojes distintos se
   pueden comparar sin más cuentas.
   ========================================================================== */
(function (global) {
  'use strict';
  const n = v => Math.round(v * 100) / 100;

  function svgPerfil(spec, opts) {
    opts = opts || {};
    const uid = 'p' + Math.random().toString(36).slice(2, 8);
    const met = AV.METALES[spec.caja.metal];
    const cor = AV.CORREAS[opts.correa || spec.correa];

    const D = spec.caja.diametro;                 /* mm de ancho  */
    const H = spec.caja.altura;                   /* mm de alto   */
    const abombado = /abombad/i.test(spec.caja.cristal);
    const margen = 9, correaLargo = 22;
    const W = D + correaLargo * 2 + margen * 2;
    const VH = H + margen * 2 + 6;
    const cx = W / 2, base = margen + H;          /* base = fondo de la caja */

    /* Reparto del alto: fondo, cuerpo, bisel y cristal. */
    const hFondo = H * 0.16, hCuerpo = H * 0.50, hBisel = H * 0.14;
    const hCristal = H - hFondo - hCuerpo - hBisel;
    const yBisel = margen + hCristal;
    const yCuerpo = yBisel + hBisel;
    const yFondo = yCuerpo + hCuerpo;

    let s = `<svg class="av-perfil" viewBox="0 0 ${n(W)} ${n(VH)}" role="img"
      aria-label="${spec.marca} ${spec.modelo} de perfil: ${D} milímetros de ancho por ${H} de alto"
      preserveAspectRatio="xMidYMid meet">`;
    s += `<defs>
      <linearGradient id="pm${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${met.brillo}"/><stop offset="38%" stop-color="${met.cuerpo}"/>
        <stop offset="62%" stop-color="${met.sombra}"/><stop offset="100%" stop-color="${met.cuerpo}"/>
      </linearGradient>
      <linearGradient id="pc${uid}" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,.42)"/><stop offset="60%" stop-color="rgba(255,255,255,.08)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,.02)"/>
      </linearGradient>
    </defs>`;

    /* Correa: sale de las asas y cae a los lados. */
    const grosorCorrea = Math.max(2.2, H * 0.26);
    const yAsa = yCuerpo + hCuerpo * 0.42;
    [-1, 1].forEach(lado => {
      const x0 = cx + lado * D / 2;
      s += `<path d="M ${n(x0)} ${n(yAsa)}
                     C ${n(x0 + lado * 12)} ${n(yAsa + 0.6)} ${n(x0 + lado * 19)} ${n(yAsa + 2.6)} ${n(x0 + lado * correaLargo)} ${n(yAsa + 6.5)}
                     L ${n(x0 + lado * correaLargo)} ${n(yAsa + 6.5 + grosorCorrea)}
                     C ${n(x0 + lado * 19)} ${n(yAsa + 2.6 + grosorCorrea)} ${n(x0 + lado * 12)} ${n(yAsa + 0.6 + grosorCorrea)} ${n(x0)} ${n(yAsa + grosorCorrea)} Z"
                   fill="${cor.cuerpo}" stroke="${cor.costura}" stroke-width=".3" opacity=".95"/>`;
      if (cor.tipo === 'metal') {
        for (let k = 1; k <= 4; k++) {
          const t = k / 5, xe = x0 + lado * correaLargo * t, ye = yAsa + 6.5 * t * t;
          s += `<line x1="${n(xe)}" y1="${n(ye)}" x2="${n(xe)}" y2="${n(ye + grosorCorrea)}" stroke="${cor.costura}" stroke-width=".35" opacity=".8"/>`;
        }
      }
    });

    /* Asas: los cuernos que sujetan la correa, vistos de canto. */
    [-1, 1].forEach(lado => {
      const x0 = cx + lado * D / 2;
      s += `<path d="M ${n(x0 - lado * D * 0.06)} ${n(yCuerpo)}
                     C ${n(x0 + lado * 3)} ${n(yCuerpo + hCuerpo * 0.2)} ${n(x0 + lado * 4)} ${n(yAsa - 1)} ${n(x0 + lado * 2)} ${n(yAsa + grosorCorrea)}
                     L ${n(x0 - lado * D * 0.02)} ${n(yAsa + grosorCorrea)}
                     C ${n(x0 - lado * D * 0.01)} ${n(yAsa - 2)} ${n(x0 - lado * D * 0.04)} ${n(yCuerpo + 1)} ${n(x0 - lado * D * 0.10)} ${n(yCuerpo)} Z"
                   fill="url(#pm${uid})"/>`;
    });

    /* Corona (y pulsadores si lleva cronógrafo), a la derecha. */
    const rCorona = H * 0.30, xCorona = cx + D / 2;
    s += `<rect x="${n(xCorona)}" y="${n(yCuerpo + hCuerpo / 2 - rCorona / 2)}" width="${n(H * 0.34)}" height="${n(rCorona)}" rx="${n(rCorona * 0.18)}" fill="url(#pm${uid})"/>`;
    if (spec.complicaciones.includes('cronografo')) {
      [-1, 1].forEach(d => {
        const yp = yCuerpo + hCuerpo / 2 + d * rCorona * 1.25;
        s += `<rect x="${n(xCorona)}" y="${n(yp - rCorona * 0.22)}" width="${n(H * 0.26)}" height="${n(rCorona * 0.44)}" fill="url(#pm${uid})"/>`;
      });
    }

    /* Fondo de caja: ligeramente abombado hacia abajo. */
    s += `<path d="M ${n(cx - D / 2 + 1)} ${n(yFondo)}
                   Q ${n(cx)} ${n(yFondo + hFondo * 1.7)} ${n(cx + D / 2 - 1)} ${n(yFondo)} Z"
                 fill="url(#pm${uid})"/>`;

    /* Cuerpo de la caja: el flanco, apenas cónico. */
    s += `<path d="M ${n(cx - D / 2)} ${n(yCuerpo)} L ${n(cx + D / 2)} ${n(yCuerpo)}
                   L ${n(cx + D / 2 - D * 0.012)} ${n(yFondo)} L ${n(cx - D / 2 + D * 0.012)} ${n(yFondo)} Z"
                 fill="url(#pm${uid})"/>`;

    /* Bisel. */
    const dBisel = D - D * 0.02;
    s += `<path d="M ${n(cx - dBisel / 2)} ${n(yBisel)} L ${n(cx + dBisel / 2)} ${n(yBisel)}
                   L ${n(cx + D / 2)} ${n(yCuerpo)} L ${n(cx - D / 2)} ${n(yCuerpo)} Z"
                 fill="url(#pm${uid})"/>`;

    /* Cristal: abombado o plano, según lo que diga la ficha. El dial se pinta
       primero para que se vea a través de él, no encima. */
    const dCristal = dBisel - D * 0.10;
    s += `<line x1="${n(cx - dCristal / 2 + 0.6)}" y1="${n(yBisel - 0.3)}" x2="${n(cx + dCristal / 2 - 0.6)}" y2="${n(yBisel - 0.3)}"
                stroke="${spec.dial.base}" stroke-width="${n(Math.max(.7, H * 0.05))}" opacity=".9"/>`;
    if (abombado) {
      s += `<path d="M ${n(cx - dCristal / 2)} ${n(yBisel)}
                     Q ${n(cx)} ${n(margen - hCristal * 0.55)} ${n(cx + dCristal / 2)} ${n(yBisel)} Z"
                   fill="url(#pc${uid})" stroke="rgba(255,255,255,.42)" stroke-width=".35"/>`;
    } else {
      s += `<path d="M ${n(cx - dCristal / 2)} ${n(yBisel)} L ${n(cx - dCristal / 2)} ${n(margen + hCristal * 0.15)}
                     L ${n(cx + dCristal / 2)} ${n(margen + hCristal * 0.15)} L ${n(cx + dCristal / 2)} ${n(yBisel)} Z"
                   fill="url(#pc${uid})" stroke="rgba(255,255,255,.42)" stroke-width=".35"/>`;
    }

    /* Cotas, como en un plano: el alto a la izquierda, el ancho abajo. */
    if (opts.cotas !== false) {
      const xc = margen + correaLargo - 7, tam = Math.max(2.4, H * 0.30);
      s += `<g stroke="var(--laton)" stroke-width=".28" fill="none" opacity=".85">
        <line x1="${n(xc)}" y1="${n(margen)}" x2="${n(xc)}" y2="${n(base)}"/>
        <line x1="${n(xc - 1.6)}" y1="${n(margen)}" x2="${n(xc + 1.6)}" y2="${n(margen)}"/>
        <line x1="${n(xc - 1.6)}" y1="${n(base)}" x2="${n(xc + 1.6)}" y2="${n(base)}"/>
      </g>`;
      s += `<text x="${n(xc - 2.4)}" y="${n(margen + H / 2)}" text-anchor="end" dominant-baseline="central"
              font-family="'IBM Plex Mono',monospace" font-size="${n(tam)}" fill="var(--laton)">${H} mm</text>`;
      const yw = base + hFondo * 1.7 + 5;
      s += `<g stroke="rgba(150,150,160,.55)" stroke-width=".28" fill="none">
        <line x1="${n(cx - D / 2)}" y1="${n(yw)}" x2="${n(cx + D / 2)}" y2="${n(yw)}"/>
        <line x1="${n(cx - D / 2)}" y1="${n(yw - 1.6)}" x2="${n(cx - D / 2)}" y2="${n(yw + 1.6)}"/>
        <line x1="${n(cx + D / 2)}" y1="${n(yw - 1.6)}" x2="${n(cx + D / 2)}" y2="${n(yw + 1.6)}"/>
      </g>`;
      s += `<text x="${n(cx)}" y="${n(yw + tam + 1)}" text-anchor="middle"
              font-family="'IBM Plex Mono',monospace" font-size="${n(tam)}" fill="rgba(150,150,160,.75)">${D} mm</text>`;
    }
    return s + '</svg>';
  }

  /* ¿Qué tan bien pasa bajo un puño? El grosor manda más que el diámetro. */
  function veredictoGrosor(mm) {
    if (mm <= 9.5)  return { nivel: 'fino',   txt: 'Extraplano: entra bajo cualquier puño sin sentirlo.' };
    if (mm <= 11.5) return { nivel: 'normal', txt: 'Delgado: pasa bajo el puño de una camisa sin pelear.' };
    if (mm <= 13.5) return { nivel: 'normal', txt: 'Grosor de diario. Con camisa holgada, sin problema.' };
    if (mm <= 15)   return { nivel: 'grueso', txt: 'Se nota bajo la manga. Es un reloj para traer a la vista.' };
    return { nivel: 'grueso', txt: 'Grueso de verdad: olvídate del puño de vestir.' };
  }

  global.AVPerfil = { svgPerfil, veredictoGrosor };
})(window);
