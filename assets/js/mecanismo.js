/* ==========================================================================
   AV WATCHES · El movimiento por dentro
   --------------------------------------------------------------------------
   Un tren de engranes que engrana de verdad. Todas las ruedas comparten el
   mismo módulo (el "tamaño de diente"), así que la distancia entre dos ejes
   es exactamente la suma de sus radios y los dientes encajan. Las
   velocidades no se inventan: salen de la razón de dientes, como en la
   mecánica real. Por eso el barrilete casi no se mueve y el volante late
   cuatro veces por segundo.
   ========================================================================== */
(function (global) {
  'use strict';

  const MODULO = 1.75;                    /* tamaño de diente, igual para todas */
  const radio = dientes => MODULO * dientes / 2;
  const rad = g => (g - 90) * Math.PI / 180;
  const n = v => Math.round(v * 100) / 100;

  /* Perfil de una rueda dentada: dientes trapezoidales entre el radio de
     raíz y el de cabeza, que es como se dibuja un engrane de verdad. */
  function perfil(cx, cy, dientes) {
    const rp = radio(dientes), rc = rp + MODULO, rr = Math.max(1, rp - 1.25 * MODULO);
    const paso = 360 / dientes;
    const P = (r, a) => `${n(cx + r * Math.cos(rad(a)))} ${n(cy + r * Math.sin(rad(a)))}`;
    let d = '';
    for (let i = 0; i < dientes; i++) {
      const a = i * paso;
      d += (i ? 'L ' : 'M ') + P(rr, a - paso * 0.30) +
           ' L ' + P(rc, a - paso * 0.16) +
           ' L ' + P(rc, a + paso * 0.16) +
           ' L ' + P(rr, a + paso * 0.30) +
           ' L ' + P(rr, a + paso * 0.50) + ' ';
    }
    return d + 'Z';
  }

  /* Una rueda completa: dentado, brazos y buje. */
  function rueda(cx, cy, dientes, color, brazos, op) {
    let s = `<path d="${perfil(cx, cy, dientes)}" fill="none" stroke="${color}" stroke-width="1.3" opacity="${op || 1}" stroke-linejoin="round"/>`;
    const rp = radio(dientes);
    if (brazos && rp > 12) {
      for (let i = 0; i < brazos; i++) {
        const a = rad(i * 360 / brazos + 10);
        s += `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(cx + rp * 0.82 * Math.cos(a))}" y2="${n(cy + rp * 0.82 * Math.sin(a))}" stroke="${color}" stroke-width="1.6" opacity=".55"/>`;
      }
      s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(rp * 0.20)}" fill="none" stroke="${color}" stroke-width="1.4" opacity=".8"/>`;
    }
    return s;
  }

  function mecanismoSVG() {
    /* Los tonos salen de variables para que el esquema aguante los dos temas:
   sobre papel claro un gris de fondo oscuro se pierde. */
    const LATON = 'var(--laton)', ACERO = 'var(--mec-acero)', RUBI = 'var(--brasa)';

    /* Cada eje recibe por su piñón y transmite por su rueda: es lo que
       multiplica la velocidad desde el barrilete hasta el escape.        */
    const ejes = [
      { id: 'barrilete', pinon: 0,  rueda: 64, color: LATON, brazos: 6, capa: .95 },
      { id: 'centro',    pinon: 12, rueda: 34, color: ACERO, brazos: 5, capa: .55 },
      { id: 'tercera',   pinon: 10, rueda: 30, color: ACERO, brazos: 5, capa: .70 },
      { id: 'cuarta',    pinon: 10, rueda: 22, color: ACERO, brazos: 4, capa: .85 },
      { id: 'escape',    pinon: 0,  rueda: 15, color: LATON, brazos: 0, capa: 1 }
    ];

    /* Colocación: la distancia entre ejes es la suma de radios, así que
       las ruedas se tocan. Solo se elige el ángulo de cada salto.        */
    const angulos = [null, -32, 26, -30, 22];
    ejes[0].x = 96; ejes[0].y = 170;
    for (let i = 1; i < ejes.length; i++) {
      const d = radio(ejes[i - 1].rueda) + radio(ejes[i].pinon || ejes[i].rueda);
      const a = rad(angulos[i] + 90);
      ejes[i].x = ejes[i - 1].x + d * Math.cos(a);
      ejes[i].y = ejes[i - 1].y + d * Math.sin(a);
    }

    /* Periodos: se fija el escape y se sube la cadena multiplicando por la
       razón de dientes de cada engranaje. Nada de números al gusto.      */
    const T = [];
    T[4] = 2;                                                   /* escape: 2 s por vuelta */
    T[3] = T[4] * (ejes[3].rueda / ejes[4].rueda);
    T[2] = T[3] * (ejes[2].rueda / ejes[3].pinon);
    T[1] = T[2] * (ejes[1].rueda / ejes[2].pinon);
    T[0] = T[1] * (ejes[0].rueda / ejes[1].pinon);
    const sentido = i => i % 2 ? 'reverse' : 'normal';           /* cada engranaje invierte el giro */

    /* El volante libera un diente por semioscilación. */
    const semi = T[4] / ejes[4].rueda;

    let s = `<svg viewBox="0 0 470 310" role="img" class="av-mec"
      aria-label="Esquema animado de un movimiento mecánico: el barrilete mueve el tren de rodaje hasta el escape y el volante">`;

    s += `<defs><radialGradient id="mecLuz" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="var(--mec-luz)"/><stop offset="100%" stop-color="transparent"/>
      </radialGradient></defs>`;
    s += `<rect width="470" height="310" fill="url(#mecLuz)"/>`;

    /* Platina: la placa donde se monta el tren. Curvas explícitas, sin
       reflexiones automáticas, para que termine en el último eje: el
       volante lleva su propio puente más allá.                          */
    const x0 = ejes[0].x - radio(ejes[0].rueda) - 14;
    const x1 = ejes[4].x + radio(ejes[4].rueda) + 22;
    s += `<path d="M ${n(x0)} 152
                   C ${n(x0 + 44)} 96 ${n(x1 - 84)} 112 ${n(x1)} 140
                   L ${n(x1 - 4)} 198
                   C ${n(x1 - 92)} 176 ${n(x0 + 60)} 224 ${n(x0 + 6)} 206 Z"
            fill="var(--mec-placa)" stroke="var(--mec-borde)" stroke-width="1" stroke-linejoin="round"/>`;

    /* Ruedas y piñones */
    ejes.forEach((e, i) => {
      s += `<g class="av-pieza-mec" data-parte="${e.id}">`;
      s += `<g class="av-rot" style="--x:${n(e.x)}px;--y:${n(e.y)}px;--dur:${n(T[i])}s;--dir:${sentido(i)};` +
           (i === 4 ? `--pasos:steps(${ejes[4].rueda})` : '--pasos:linear') + `">`;
      s += rueda(e.x, e.y, e.rueda, e.color, e.brazos, e.capa);
      if (e.pinon) s += rueda(e.x, e.y, e.pinon, e.color, 0, 1);   /* el piñón va al frente */
      s += `</g>`;
      /* Rubí del pivote: donde de verdad se apoya el eje. */
      s += `<circle cx="${n(e.x)}" cy="${n(e.y)}" r="3.4" fill="${RUBI}" opacity=".9"/>`;
      s += `<circle cx="${n(e.x)}" cy="${n(e.y)}" r="6" fill="none" stroke="${RUBI}" stroke-width=".8" opacity=".45"/>`;
      s += `</g>`;
    });

    /* Escape, áncora y volante. La geometría se calcula primero y luego se
       dibuja de atrás hacia adelante: volante, áncora, pivotes.
       El brazo del áncora apunta del pivote HACIA la rueda de escape, o sea
       hacia abajo, que es lo que la hace caer sobre los dientes.          */
    const esc = ejes[4], rEsc = radio(esc.rueda);
    const anc = { x: esc.x + rEsc * 0.15, y: esc.y - rEsc * 2.3 };
    const brazo = esc.y - anc.y;
    const vol = { x: anc.x + 104, y: anc.y - 4, r: 36 };

    /* Puente del volante: el arco que lo sujeta por encima. */
    s += `<path d="M ${n(vol.x - vol.r - 14)} ${n(vol.y + 8)}
                   Q ${n(vol.x - vol.r - 20)} ${n(vol.y - vol.r - 16)} ${n(vol.x)} ${n(vol.y - vol.r - 14)}
                   Q ${n(vol.x + vol.r + 20)} ${n(vol.y - vol.r - 12)} ${n(vol.x + vol.r + 12)} ${n(vol.y + 14)}
                   L ${n(vol.x + vol.r - 2)} ${n(vol.y + 12)}
                   Q ${n(vol.x + vol.r + 2)} ${n(vol.y - vol.r + 2)} ${n(vol.x)} ${n(vol.y - vol.r + 2)}
                   Q ${n(vol.x - vol.r - 2)} ${n(vol.y - vol.r + 2)} ${n(vol.x - vol.r + 2)} ${n(vol.y + 6)} Z"
            fill="var(--mec-placa)" stroke="var(--mec-borde)" stroke-width="1" stroke-linejoin="round"/>`;

    /* Volante: no gira, oscila. Es el que marca el ritmo del reloj. */
    s += `<g class="av-pieza-mec" data-parte="volante">
      <g class="av-volante" style="--x:${n(vol.x)}px;--y:${n(vol.y)}px;--semi:${n(semi)}s">
        <circle cx="${n(vol.x)}" cy="${n(vol.y)}" r="${vol.r}" fill="none" stroke="${LATON}" stroke-width="2.6"/>
        <circle cx="${n(vol.x)}" cy="${n(vol.y)}" r="${vol.r - 6}" fill="none" stroke="${LATON}" stroke-width="1" opacity=".35"/>`;
    for (let i = 0; i < 4; i++) {
      const a = rad(i * 90 + 45);
      s += `<line x1="${n(vol.x)}" y1="${n(vol.y)}" x2="${n(vol.x + vol.r * Math.cos(a))}" y2="${n(vol.y + vol.r * Math.sin(a))}" stroke="${LATON}" stroke-width="1.8" opacity=".7"/>`;
    }
    /* Espiral: la que devuelve el volante y le da la isocronía. */
    let esp = '';
    for (let t = 0; t <= 1080; t += 4) {
      const r = 5 + (t / 1080) * (vol.r - 14), a = rad(t);
      esp += (t ? ' L ' : 'M ') + n(vol.x + r * Math.cos(a)) + ' ' + n(vol.y + r * Math.sin(a));
    }
    s += `<path d="${esp}" fill="none" stroke="${LATON}" stroke-width=".85" opacity=".45"/>`;
    s += `</g><circle cx="${n(vol.x)}" cy="${n(vol.y)}" r="3.6" fill="${RUBI}"/></g>`;

    /* Áncora: dos paletas sobre el escape y la horquilla hacia el volante. */
    const paleta = lado => `M ${n(anc.x)} ${n(anc.y)}
      L ${n(anc.x + lado * rEsc * 1.10)} ${n(anc.y + brazo * 0.60)}
      L ${n(anc.x + lado * rEsc * 0.90)} ${n(anc.y + brazo * 0.86)}
      L ${n(anc.x + lado * rEsc * 0.22)} ${n(anc.y + brazo * 0.40)} Z`;
    s += `<g class="av-pieza-mec" data-parte="ancora">
      <g class="av-ancora" style="--x:${n(anc.x)}px;--y:${n(anc.y)}px;--semi:${n(semi)}s">
        <path d="${paleta(-1)}" fill="var(--mec-placa)" stroke="${ACERO}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="${paleta(1)}"  fill="var(--mec-placa)" stroke="${ACERO}" stroke-width="1.4" stroke-linejoin="round"/>
        <line x1="${n(anc.x)}" y1="${n(anc.y)}" x2="${n(vol.x - vol.r - 6)}" y2="${n(vol.y)}" stroke="${ACERO}" stroke-width="1.6"/>
        <path d="M ${n(vol.x - vol.r - 8)} ${n(vol.y - 6)} L ${n(vol.x - vol.r + 1)} ${n(vol.y)} L ${n(vol.x - vol.r - 8)} ${n(vol.y + 6)}"
              fill="none" stroke="${ACERO}" stroke-width="1.4" stroke-linejoin="round"/>
      </g>
      <circle cx="${n(anc.x)}" cy="${n(anc.y)}" r="3.2" fill="${RUBI}" opacity=".9"/>
    </g>`;

    /* Anotaciones de plano técnico, con la velocidad real de cada rueda. */
    const notas = [
      { e: 0, dy: 96,  txt: 'BARRILETE',     dato: `1 vuelta / ${Math.round(T[0] / 60)} min` },
      { e: 1, dy: -74, txt: 'RUEDA CENTRAL', dato: `1 / ${Math.round(T[1])} s` },
      { e: 3, dy: -46, txt: 'CUARTA',        dato: `1 / ${n(T[3])} s` },
      { e: 4, dy: 62,  txt: 'ESCAPE',        dato: `${ejes[4].rueda} pasos / vuelta` }
    ];
    s += `<g font-family="'IBM Plex Mono',monospace" font-size="8" fill="var(--tinta-tenue)" letter-spacing="1.4">`;
    notas.forEach(({ e, dy, txt, dato }) => {
      const p = ejes[e], y2 = p.y + dy;
      s += `<line x1="${n(p.x)}" y1="${n(p.y)}" x2="${n(p.x)}" y2="${n(y2)}" stroke="var(--mec-borde)" stroke-width=".6"/>`;
      s += `<text x="${n(p.x)}" y="${n(y2 + (dy > 0 ? 11 : -4))}" text-anchor="middle">${txt}</text>`;
      s += `<text x="${n(p.x)}" y="${n(y2 + (dy > 0 ? 21 : 6))}" text-anchor="middle" fill="${LATON}" opacity=".8">${dato}</text>`;
    });
    s += `<line x1="${n(vol.x)}" y1="${n(vol.y + vol.r)}" x2="${n(vol.x)}" y2="272" stroke="var(--mec-borde)" stroke-width=".6"/>`;
    s += `<text x="${n(vol.x)}" y="283" text-anchor="middle">VOLANTE</text>`;
    s += `<text x="${n(vol.x)}" y="293" text-anchor="middle" fill="${LATON}" opacity=".8">${n(1 / (semi * 2))} latidos / s</text>`;
    s += `</g></svg>`;
    return s;
  }

  global.AVMecanismo = { mecanismoSVG, radio, MODULO };
})(window);
