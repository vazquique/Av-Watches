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

/* ==========================================================================
   AV WATCHES · El reloj en tu muñeca
   --------------------------------------------------------------------------
   Dos vistas a escala, en milímetros: desde arriba se ve si la caja se come
   la muñeca, y de canto cuánto sobresale. Una muñeca no es un cilindro: es
   una elipse de proporción 1.35 a 1, así que la circunferencia que mide la
   gente se convierte a ancho y alto con la fórmula de Ramanujan.
   ========================================================================== */
(function (global) {
  'use strict';
  const n = v => Math.round(v * 100) / 100;
  const RAZON = 1.35;                 /* ancho / alto de una muñeca típica */

  /* De circunferencia (cm) a ancho y alto reales (mm). */
  function medidas(cm) {
    const P = cm * 10;
    /* Perímetro de la elipse ≈ π[3(a+b) − √((3a+b)(a+3b))], con a = 1.35 b. */
    const k = Math.PI * (3 * (RAZON + 1) - Math.sqrt((3 * RAZON + 1) * (RAZON + 3)));
    const b = P / k;                  /* semieje menor */
    return { ancho: n(2 * b * RAZON), alto: n(2 * b) };
  }

  function svgMuneca(spec, cm) {
    const m = medidas(cm);
    const D = spec.caja.diametro, H = spec.caja.altura;
    const met = AV.METALES[spec.caja.metal];
    const cor = AV.CORREAS[spec.correa];
    const piel = 'color-mix(in oklab, var(--tinta) 17%, transparent)';
    const pielBorde = 'color-mix(in oklab, var(--tinta) 34%, transparent)';
    const uid = 'w' + Math.random().toString(36).slice(2, 7);

    /* ---- Desde arriba ---- */
    const W = Math.max(m.ancho * 1.9, D * 1.7), VH = 104;
    const cx = W / 2, cy = VH * 0.52;
    const aMun = m.ancho / 2, aMano = aMun * 0.86, aBrazo = aMun * 1.22;
    let sup = `<svg viewBox="0 0 ${n(W)} ${VH}" role="img"
      aria-label="El reloj visto desde arriba sobre una muñeca de ${cm} centímetros">
      <defs><clipPath id="br${uid}">
        <path d="M ${n(cx - aMano)} 0 C ${n(cx - aMun * 1.02)} 26 ${n(cx - aMun)} ${n(cy - 14)} ${n(cx - aMun)} ${n(cy)}
                 C ${n(cx - aMun)} ${n(cy + 18)} ${n(cx - aBrazo)} ${n(VH - 22)} ${n(cx - aBrazo)} ${VH}
                 L ${n(cx + aBrazo)} ${VH} C ${n(cx + aBrazo)} ${n(VH - 22)} ${n(cx + aMun)} ${n(cy + 18)} ${n(cx + aMun)} ${n(cy)}
                 C ${n(cx + aMun)} ${n(cy - 14)} ${n(cx + aMun * 1.02)} 26 ${n(cx + aMano)} 0 Z"/>
      </clipPath></defs>`;
    sup += `<g clip-path="url(#br${uid})"><rect width="${n(W)}" height="${VH}" fill="${piel}"/></g>`;
    sup += `<path d="M ${n(cx - aMano)} 0 C ${n(cx - aMun * 1.02)} 26 ${n(cx - aMun)} ${n(cy - 14)} ${n(cx - aMun)} ${n(cy)}
                 C ${n(cx - aMun)} ${n(cy + 18)} ${n(cx - aBrazo)} ${n(VH - 22)} ${n(cx - aBrazo)} ${VH}
                 M ${n(cx + aMano)} 0 C ${n(cx + aMun * 1.02)} 26 ${n(cx + aMun)} ${n(cy - 14)} ${n(cx + aMun)} ${n(cy)}
                 C ${n(cx + aMun)} ${n(cy + 18)} ${n(cx + aBrazo)} ${n(VH - 22)} ${n(cx + aBrazo)} ${VH}"
            fill="none" stroke="${pielBorde}" stroke-width=".7"/>`;
    /* La correa abraza la muñeca y se pierde por debajo. */
    const anchoCorrea = D * 0.44;
    sup += `<path d="M ${n(cx - anchoCorrea / 2)} ${n(cy - aMun * 1.15)} L ${n(cx + anchoCorrea / 2)} ${n(cy - aMun * 1.15)}
                    L ${n(cx + anchoCorrea / 2)} ${n(cy + aMun * 1.15)} L ${n(cx - anchoCorrea / 2)} ${n(cy + aMun * 1.15)} Z"
            fill="${cor.cuerpo}" opacity=".92"/>`;
    sup += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(D / 2)}" fill="${met.brillo}" stroke="${met.sombra}" stroke-width=".9"/>`;
    sup += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(D / 2 * 0.86)}" fill="${met.cuerpo}"/>`;
    sup += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(D / 2 * 0.76)}" fill="${spec.dial.base}" stroke="${met.sombra}" stroke-width=".5"/>`;
    /* Dos agujas para que se lea como reloj y no como una moneda. */
    sup += `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(cx)}" y2="${n(cy - D * 0.22)}" stroke="${spec.manecillas.color}" stroke-width="${n(D * 0.035)}" stroke-linecap="round"/>`;
    sup += `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(cx + D * 0.28)}" y2="${n(cy + D * 0.10)}" stroke="${spec.manecillas.color}" stroke-width="${n(D * 0.025)}" stroke-linecap="round"/>`;
    /* Cotas: el ancho de la muñeca y el de la caja, uno junto al otro. */
    sup += `<g font-family="'IBM Plex Mono',monospace" font-size="4" letter-spacing=".3">
      <line x1="${n(cx - aMun)}" y1="${n(VH - 8)}" x2="${n(cx + aMun)}" y2="${n(VH - 8)}" stroke="${pielBorde}" stroke-width=".5"/>
      <text x="${n(cx)}" y="${n(VH - 2)}" text-anchor="middle" fill="var(--tinta-tenue)">muñeca ${m.ancho} mm</text>
      <line x1="${n(cx - D / 2)}" y1="${n(cy - aMun - 6)}" x2="${n(cx + D / 2)}" y2="${n(cy - aMun - 6)}" stroke="var(--laton)" stroke-width=".5"/>
      <text x="${n(cx)}" y="${n(cy - aMun - 9)}" text-anchor="middle" fill="var(--laton)">caja ${D} mm</text>
    </g></svg>`;

    /* ---- De canto: cuánto sobresale ---- */
    const LW = Math.max(m.ancho * 1.7, D + 46), LH = m.alto + H + 26;
    const lx = LW / 2, ly = LH - 12;
    let lat = `<svg viewBox="0 0 ${n(LW)} ${n(LH)}" role="img" aria-label="Cuánto sobresale el reloj de la muñeca">`;
    lat += `<ellipse cx="${n(lx)}" cy="${n(ly - m.alto / 2)}" rx="${n(m.ancho / 2)}" ry="${n(m.alto / 2)}"
             fill="${piel}" stroke="${pielBorde}" stroke-width=".7"/>`;
    const yTop = ly - m.alto;
    lat += `<rect x="${n(lx - D / 2)}" y="${n(yTop - H)}" width="${n(D)}" height="${n(H)}" rx="${n(H * 0.28)}"
             fill="${met.cuerpo}" stroke="${met.sombra}" stroke-width=".7"/>`;
    lat += `<rect x="${n(lx - D / 2 + D * 0.06)}" y="${n(yTop - H + H * 0.10)}" width="${n(D * 0.88)}" height="${n(H * 0.22)}"
             fill="${spec.dial.base}" opacity=".9"/>`;
    lat += `<g font-family="'IBM Plex Mono',monospace" font-size="4" letter-spacing=".3">
      <line x1="${n(lx + D / 2 + 5)}" y1="${n(yTop - H)}" x2="${n(lx + D / 2 + 5)}" y2="${n(yTop)}" stroke="var(--laton)" stroke-width=".5"/>
      <text x="${n(lx + D / 2 + 8)}" y="${n(yTop - H / 2 + 1.5)}" fill="var(--laton)">sobresale ${H} mm</text>
    </g></svg>`;

    return { sup, lat, medidas: m };
  }

  /* Veredicto por la proporción entre la caja y el ancho de la muñeca.
     Los cortes salen de lo que se considera bien puesto: alrededor de dos
     tercios del ancho de la muñeca es la proporción clásica.            */
  function veredictoTalla(diametro, anchoMuneca) {
    const r = diametro / anchoMuneca;
    if (r < 0.575) return { txt: 'Se te va a ver discreto. Elegante, pero chico.', nivel: 'chico' };
    if (r <= 0.68)  return { txt: '<b>Proporción justa.</b> Así se ve un reloj bien puesto.', nivel: 'bien' };
    if (r <= 0.76)  return { txt: 'Va a llenarte la muñeca. Si te gusta que se note, adelante.', nivel: 'lleno' };
    return { txt: 'Te queda grande: la caja se sale de tu muñeca.', nivel: 'grande' };
  }

  global.AVPerfil.svgMuneca = svgMuneca;
  global.AVPerfil.medidasMuneca = medidas;
  global.AVPerfil.veredictoTalla = veredictoTalla;
})(window);
