/* ==========================================================================
   AV WATCHES · Motor de dibujo
   --------------------------------------------------------------------------
   Convierte una ficha técnica (datos.js) en una pieza vectorial completa:
   correa, caja, bisel, dial, índices, complicaciones y agujas. Las agujas
   marcan la hora real y se actualizan en un solo bucle global.
   No hay una sola fotografía en esta tienda.
   ========================================================================== */
(function (global) {
  'use strict';

  const TAU = Math.PI * 2;
  let contador = 0;

  /* Punto sobre un círculo, con 0° a las doce y giro en sentido horario. */
  function polar(cx, cy, r, grados) {
    const a = (grados - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  const n = v => Math.round(v * 100) / 100;
  function p(cx, cy, r, g) { const [x, y] = polar(cx, cy, r, g); return n(x) + ' ' + n(y); }
  /* Trazo radial entre dos radios del mismo ángulo. */
  function radial(cx, cy, r1, r2, grados, attrs) {
    const [x1, y1] = polar(cx, cy, r1, grados), [x2, y2] = polar(cx, cy, r2, grados);
    return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" ${attrs}/>`;
  }

  /* Aleatorio determinista: la misma pieza se dibuja igual en cada visita. */
  function semilla(txt) {
    let h = 2166136261;
    for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  function aclarar(hex, f) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    const m = v => Math.max(0, Math.min(255, Math.round(v + (f > 0 ? (255 - v) * f : v * f))));
    return '#' + [m(r), m(g), m(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  /* ¿El dial es claro? Define si los subdiales y ventanas van en negativo. */
  const esClaro = hex => {
    const c = hex.replace('#', '');
    const l = (parseInt(c.substr(0, 2), 16) * 0.299 + parseInt(c.substr(2, 2), 16) * 0.587 + parseInt(c.substr(4, 2), 16) * 0.114);
    return l > 140;
  };

  /* ======================================================================
     CORREA
     ====================================================================== */
  function correa(uid, correaSpec, cx, cy, R, arriba) {
    const c = correaSpec;
    const anchoBase = R * 1.24;
    const anchoPunta = c.tipo === 'nato' ? R * 1.2 : c.tipo === 'metal' ? R * 1.02 : R * 0.86;
    const yCaja = arriba ? cy - R * 0.97 : cy + R * 0.97;
    const yFin = arriba ? 4 : 576;
    const s = arriba ? -1 : 1;
    const x1 = cx - anchoBase / 2, x2 = cx + anchoBase / 2;
    const x3 = cx + anchoPunta / 2, x4 = cx - anchoPunta / 2;
    let out = '';

    /* Asas: dos cuernos que salen de la caja y sujetan la barra de resorte.
       Se dibujan antes que la correa, que luego los cubre por dentro.       */
    const yAsa = yCaja + s * R * 0.34, wAsa = R * 0.20;
    [[x1, 1], [x2, -1]].forEach(([xa, dir]) => {
      out += `<path d="M ${n(xa)} ${n(yCaja - s * R * 0.1)} L ${n(xa + dir * wAsa)} ${n(yCaja - s * R * 0.05)} L ${n(xa + dir * wAsa * 0.78)} ${n(yAsa)} Q ${n(xa + dir * wAsa * 0.34)} ${n(yAsa + s * R * 0.04)} ${n(xa + dir * 2)} ${n(yAsa - s * R * 0.02)} Z" fill="url(#met${uid})"/>`;
    });

    const cuerpo = `M ${n(x1)} ${n(yCaja)} L ${n(x2)} ${n(yCaja)} L ${n(x3)} ${n(yFin)} L ${n(x4)} ${n(yFin)} Z`;

    if (c.tipo === 'metal') {
      /* Brazalete de tres columnas: eslabón central pulido, laterales satinados. */
      out += `<path d="${cuerpo}" fill="${c.cuerpo}"/>`;
      const filas = 7;
      for (let i = 0; i < filas; i++) {
        const t0 = i / filas, t1 = (i + 0.86) / filas;
        const yA = yCaja + (yFin - yCaja) * t0, yB = yCaja + (yFin - yCaja) * t1;
        const wA = (anchoBase + (anchoPunta - anchoBase) * t0) / 2, wB = (anchoBase + (anchoPunta - anchoBase) * t1) / 2;
        out += `<path d="M ${n(cx - wA)} ${n(yA)} L ${n(cx + wA)} ${n(yA)} L ${n(cx + wB)} ${n(yB)} L ${n(cx - wB)} ${n(yB)} Z" fill="${c.cuerpo}" stroke="${c.costura}" stroke-width="1.1"/>`;
        out += `<path d="M ${n(cx - wA * 0.34)} ${n(yA)} L ${n(cx + wA * 0.34)} ${n(yA)} L ${n(cx + wB * 0.34)} ${n(yB)} L ${n(cx - wB * 0.34)} ${n(yB)} Z" fill="${aclarar(c.cuerpo, 0.28)}" stroke="${c.costura}" stroke-width="0.8"/>`;
      }
    } else if (c.tipo === 'nato') {
      /* Cincha pasante: recta, con franjas y pasadores metálicos. */
      out += `<path d="${cuerpo}" fill="${c.cuerpo}"/>`;
      out += `<path d="${cuerpo}" fill="none" stroke="${aclarar(c.cuerpo, -0.35)}" stroke-width="1.2"/>`;
      const franjas = [[-0.30, 0.10], [0.20, 0.10]];
      franjas.forEach(([off, w]) => {
        out += `<path d="M ${n(cx + anchoBase * off)} ${n(yCaja)} L ${n(cx + anchoBase * (off + w))} ${n(yCaja)} L ${n(cx + anchoPunta * (off + w))} ${n(yFin)} L ${n(cx + anchoPunta * off)} ${n(yFin)} Z" fill="${c.costura}" opacity="0.85"/>`;
      });
      for (let i = 1; i <= 2; i++) {
        const t = i / 3.2, y = yCaja + (yFin - yCaja) * t;
        const w = (anchoBase + (anchoPunta - anchoBase) * t) / 2;
        out += `<rect x="${n(cx - w - 2)}" y="${n(y - 5)}" width="${n(w * 2 + 4)}" height="10" fill="url(#met${uid})" opacity="0.9"/>`;
      }
    } else if (c.tipo === 'caucho') {
      /* Caucho vulcanizado: canales transversales. */
      out += `<path d="${cuerpo}" fill="${c.cuerpo}"/>`;
      out += `<clipPath id="cl${uid}${arriba ? 'a' : 'b'}"><path d="${cuerpo}"/></clipPath>`;
      out += `<g clip-path="url(#cl${uid}${arriba ? 'a' : 'b'})">`;
      for (let i = 0; i < 14; i++) {
        const y = yCaja + s * (10 + i * 18);
        out += `<rect x="${n(cx - anchoBase)}" y="${n(y)}" width="${n(anchoBase * 2)}" height="6" fill="${c.costura}" opacity="0.5"/>`;
      }
      out += `</g>`;
    } else {
      /* Piel: se afina, lleva costura corrida y perforaciones en el extremo. */
      out += `<path d="${cuerpo}" fill="${c.cuerpo}"/>`;
      out += `<path d="${cuerpo}" fill="none" stroke="${aclarar(c.cuerpo, 0.18)}" stroke-width="1"/>`;
      const inset = 9;
      out += `<path d="M ${n(x1 + inset)} ${n(yCaja + s * 6)} L ${n(x4 + inset * 0.8)} ${n(yFin + s * -6)}" stroke="${c.costura}" stroke-width="1.6" stroke-dasharray="5 6" fill="none" opacity="0.9"/>`;
      out += `<path d="M ${n(x2 - inset)} ${n(yCaja + s * 6)} L ${n(x3 - inset * 0.8)} ${n(yFin + s * -6)}" stroke="${c.costura}" stroke-width="1.6" stroke-dasharray="5 6" fill="none" opacity="0.9"/>`;
      if (!arriba) for (let i = 0; i < 4; i++) out += `<circle cx="${n(cx)}" cy="${n(yFin - 40 - i * 26)}" r="3.4" fill="${aclarar(c.cuerpo, -0.45)}"/>`;
      /* Hebilla: un marco con su lengüeta, no una banda maciza. */
      if (arriba) {
        const bw = anchoPunta * 1.16, bh = 34;
        out += `<rect x="${n(cx - bw / 2)}" y="60" width="${n(bw)}" height="${bh}" fill="none" stroke="url(#met${uid})" stroke-width="7"/>`;
        out += `<rect x="${n(cx - 2)}" y="60" width="4" height="${bh}" fill="url(#met${uid})"/>`;
      }
    }
    return out;
  }

  /* ======================================================================
     BISEL
     ====================================================================== */
  function bisel(uid, spec, cx, cy, R, rDial) {
    const b = spec.bisel, t = b.tipo;
    let out = `<circle cx="${cx}" cy="${cy}" r="${n(R)}" fill="url(#met${uid})"/>`;
    out += `<circle cx="${cx}" cy="${cy}" r="${n(R * 0.995)}" fill="none" stroke="${aclarar(AV.METALES[spec.caja.metal].sombra, -0.2)}" stroke-width="1.2" opacity="0.7"/>`;
    const rIn = rDial + 4;

    if (t === 'canelado') {
      /* Bisel estriado: 56 rayos que atrapan la luz. */
      for (let i = 0; i < 56; i++) {
        const a = i * 360 / 56;
        out += `<path d="M ${p(cx, cy, rIn, a)} L ${p(cx, cy, R, a - 2.2)} L ${p(cx, cy, R, a + 2.2)} Z" fill="${aclarar(AV.METALES[spec.caja.metal].brillo, 0)}" opacity="${i % 2 ? 0.55 : 0.18}"/>`;
      }
    } else if (t === 'buceo') {
      /* Inserto de cerámica, escala de 60 minutos y pip luminoso a las doce. */
      out += `<circle cx="${cx}" cy="${cy}" r="${n((R + rIn) / 2)}" fill="none" stroke="${b.colorDia}" stroke-width="${n(R - rIn)}"/>`;
      for (let i = 0; i < 60; i++) {
        const a = i * 6, may = i % 5 === 0;
        out += radial(cx, cy, rIn + 2, may ? R - 4 : R - 7, a,
          `stroke="#e8e4da" stroke-width="${may ? 2.4 : 1.2}" opacity="${may ? 0.95 : 0.6}"`);
      }
      [10, 20, 30, 40, 50].forEach(v => {
        const [x, y] = polar(cx, cy, (R + rIn) / 2, v * 6);
        out += `<text x="${n(x)}" y="${n(y + 4.5)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(R * 0.1)}" fill="#e8e4da" opacity="0.92">${v}</text>`;
      });
      const [px, py] = polar(cx, cy, (R + rIn) / 2 + 1, 0);
      out += `<circle class="av-lume" cx="${n(px)}" cy="${n(py)}" r="${n(R * 0.048)}" fill="#dfe6df"/>`;
    } else if (t === 'gmt') {
      /* Cerámica bicolor: mitad día, mitad noche, escala de 24 horas. */
      const rm = (R + rIn) / 2, gw = R - rIn;
      out += `<path d="M ${p(cx, cy, rm, 0)} A ${n(rm)} ${n(rm)} 0 0 1 ${p(cx, cy, rm, 179.9)}" fill="none" stroke="${b.colorDia}" stroke-width="${n(gw)}"/>`;
      out += `<path d="M ${p(cx, cy, rm, 180)} A ${n(rm)} ${n(rm)} 0 0 1 ${p(cx, cy, rm, 359.9)}" fill="none" stroke="${b.colorNoche}" stroke-width="${n(gw)}"/>`;
      for (let h = 0; h < 24; h++) {
        const a = h * 15, [x, y] = polar(cx, cy, rm, a);
        if (h % 2 === 0) out += `<text x="${n(x)}" y="${n(y + 4.2)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(R * 0.095)}" fill="#efece4" opacity="0.95">${h === 0 ? 24 : h}</text>`;
        else { const [x1, y1] = polar(cx, cy, rm - gw * 0.22, a), [x2, y2] = polar(cx, cy, rm + gw * 0.22, a); out += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="#efece4" stroke-width="1.1" opacity="0.55"/>`; }
      }
    } else if (t === 'taquimetro') {
      const rm = (R + rIn) / 2, gw = R - rIn;
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rm)}" fill="none" stroke="${b.colorDia}" stroke-width="${n(gw)}"/>`;
      [400, 300, 240, 200, 175, 150, 135, 120, 110, 100, 90, 80, 75, 70, 65, 60].forEach(v => {
        const a = 3600 / v * 6 % 360, [x, y] = polar(cx, cy, rm, a);
        out += `<text x="${n(x)}" y="${n(y + 3.6)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(R * 0.082)}" fill="#e9e5da" opacity="0.9">${v}</text>`;
      });
      const [tx, ty] = polar(cx, cy, rm, 33);
      out += `<text x="${n(tx)}" y="${n(ty)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(R * 0.062)}" fill="#c9a24a" letter-spacing="1">TACHY</text>`;
    } else {
      /* Liso pulido: un anillo con un filo interior marcado. */
      out += `<circle cx="${cx}" cy="${cy}" r="${n((R + rIn) / 2)}" fill="none" stroke="url(#met${uid})" stroke-width="${n(R - rIn)}"/>`;
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rIn + 1.5)}" fill="none" stroke="${AV.METALES[spec.caja.metal].sombra}" stroke-width="1.6" opacity="0.85"/>`;
    }
    return out;
  }

  /* ======================================================================
     TEXTURA DEL DIAL
     ====================================================================== */
  function textura(uid, spec, cx, cy, rd) {
    const d = spec.dial, base = d.base;
    let out = `<circle class="av-dial" cx="${cx}" cy="${cy}" r="${n(rd)}" fill="${base}"/>`;
    out += `<clipPath id="dial${uid}"><circle cx="${cx}" cy="${cy}" r="${n(rd)}"/></clipPath>`;
    out += `<g clip-path="url(#dial${uid})" class="av-textura">`;

    if (d.textura === 'sunburst') {
      /* Rayo de sol: 180 rayos finos desde el centro. */
      for (let i = 0; i < 180; i++) {
        const a = i * 2;
        out += `<path d="M ${cx} ${cy} L ${p(cx, cy, rd, a - 0.55)} L ${p(cx, cy, rd, a + 0.55)} Z" fill="${i % 2 ? aclarar(base, 0.16) : aclarar(base, -0.2)}" opacity="0.5"/>`;
      }
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rd)}" fill="url(#sun${uid})"/>`;
    } else if (d.textura === 'guilloche') {
      /* Guilloché concéntrico grabado a máquina. */
      for (let i = 1; i < 42; i++) {
        out += `<circle cx="${cx}" cy="${cy}" r="${n(rd * i / 42)}" fill="none" stroke="${aclarar(base, i % 2 ? 0.22 : -0.28)}" stroke-width="1.05" opacity="0.55"/>`;
      }
    } else if (d.textura === 'aventurina') {
      const rnd = semilla(spec.id);
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rd)}" fill="url(#sun${uid})"/>`;
      for (let i = 0; i < 190; i++) {
        const a = rnd() * 360, r = Math.sqrt(rnd()) * rd, [x, y] = polar(cx, cy, r, a);
        out += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(0.5 + rnd() * 1.5)}" fill="#dfe6ff" opacity="${n(0.3 + rnd() * 0.65)}"/>`;
      }
    } else if (d.textura === 'esqueleto') {
      /* Movimiento a la vista: barrilete, tren de rodaje, escape y volante. */
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rd)}" fill="${base}"/>`;
      const puente = aclarar(base, 0.30), filo = aclarar(base, 0.62);
      const ruedas = [[cx - rd * 0.36, cy - rd * 0.30, rd * 0.30, 44], [cx + rd * 0.34, cy - rd * 0.34, rd * 0.20, 30], [cx + rd * 0.40, cy + rd * 0.26, rd * 0.16, 24], [cx - rd * 0.30, cy + rd * 0.40, rd * 0.13, 18]];
      out += `<path d="M ${n(cx - rd * 0.8)} ${n(cy - rd * 0.12)} Q ${n(cx)} ${n(cy - rd * 0.62)} ${n(cx + rd * 0.78)} ${n(cy - rd * 0.18)} L ${n(cx + rd * 0.62)} ${n(cy + rd * 0.16)} Q ${n(cx)} ${n(cy - rd * 0.16)} ${n(cx - rd * 0.66)} ${n(cy + rd * 0.2)} Z" fill="${puente}" stroke="${filo}" stroke-width="1"/>`;
      ruedas.forEach(([gx, gy, gr, dientes], k) => {
        let dd = '';
        for (let i = 0; i < dientes; i++) {
          const a = i * 360 / dientes;
          dd += (i ? 'L' : 'M') + ' ' + p(gx, gy, gr, a - 3) + ' L ' + p(gx, gy, gr * 1.1, a - 1.5) + ' L ' + p(gx, gy, gr * 1.1, a + 1.5) + ' L ' + p(gx, gy, gr, a + 3) + ' ';
        }
        out += `<g class="av-engrane" style="--gx:${n(gx)}px;--gy:${n(gy)}px;--gd:${8 + k * 5}s;--gdir:${k % 2 ? 'reverse' : 'normal'}"><path d="${dd}Z" fill="none" stroke="${filo}" stroke-width="1.2" opacity="0.85"/><circle cx="${n(gx)}" cy="${n(gy)}" r="${n(gr * 0.3)}" fill="none" stroke="${filo}" stroke-width="1.2"/>`;
        for (let s = 0; s < 4; s++) { const a = s * 90 + 20; out += `<line x1="${n(gx)}" y1="${n(gy)}" x2="${p(gx, gy, gr * 0.94, a).split(' ')[0]}" y2="${p(gx, gy, gr * 0.94, a).split(' ')[1]}" stroke="${filo}" stroke-width="1" opacity="0.7"/>`; }
        out += `</g><circle cx="${n(gx)}" cy="${n(gy)}" r="2.6" fill="#c9452d" opacity="0.9"/>`;
      });
      out += `<circle cx="${n(cx - rd * 0.36)}" cy="${n(cy - rd * 0.30)}" r="${n(rd * 0.30)}" fill="none" stroke="${filo}" stroke-width="2" opacity="0.5"/>`;
    } else {
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rd)}" fill="url(#sun${uid})" opacity="0.5"/>`;
    }
    out += `</g>`;
    /* Sombra interior del rehaut. */
    out += `<circle cx="${cx}" cy="${cy}" r="${n(rd - 1)}" fill="none" stroke="#000" stroke-width="6" opacity="0.16"/>`;
    return out;
  }

  /* ======================================================================
     ÍNDICES
     ====================================================================== */
  function indices(spec, cx, cy, rd) {
    const d = spec.dial, tinta = d.tinta, lume = d.lume;
    const rOut = rd * 0.90, largo = rd * 0.12;
    const claseLume = lume ? 'av-lume' : '';
    let out = '';

    /* Minutería: sesenta trazos finos en el rehaut. */
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      out += radial(cx, cy, rd * 0.955, rd * 0.925, i * 6, `stroke="${tinta}" stroke-width="1" opacity="0.5"`);
    }

    if (d.indices === 'romano') {
      const rom = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
      rom.forEach((t, i) => {
        if (spec.complicaciones.includes('fecha') && i === 3) return;
        if (spec.complicaciones.includes('segundero-pequeno') && i === 6) return;
        const [x, y] = polar(cx, cy, rd * 0.80, i * 30);
        out += `<text x="${n(x)}" y="${n(y)}" text-anchor="middle" dominant-baseline="central" font-family="'Bodoni Moda',Georgia,serif" font-size="${n(rd * 0.16)}" fill="${tinta}">${t}</text>`;
      });
    } else if (d.indices === 'arabigo') {
      for (let i = 0; i < 12; i++) {
        const num = i === 0 ? 12 : i;
        if (spec.complicaciones.includes('fecha') && i === 3) continue;
        const [x, y] = polar(cx, cy, rd * 0.78, i * 30);
        out += `<text class="${claseLume}" x="${n(x)}" y="${n(y)}" text-anchor="middle" dominant-baseline="central" font-family="'IBM Plex Mono',monospace" font-weight="600" font-size="${n(rd * 0.185)}" fill="${tinta}">${num}</text>`;
      }
    } else if (d.indices === 'puntos') {
      /* Escala de buceo: triángulo a las doce, barras a 3-6-9, puntos al resto. */
      for (let i = 0; i < 12; i++) {
        const a = i * 30;
        if (spec.complicaciones.includes('fecha') && i === 3) continue;
        if (i === 0) {
          out += `<path class="${claseLume}" d="M ${p(cx, cy, rOut + largo * 0.55, 0)} L ${p(cx, cy, rOut - largo, -4.2)} L ${p(cx, cy, rOut - largo, 4.2)} Z" fill="${tinta}"/>`;
        } else if (i % 3 === 0) {
          const [x, y] = polar(cx, cy, rOut - largo * 0.45, a);
          out += `<rect class="${claseLume}" x="${n(x - rd * 0.035)}" y="${n(y - largo * 0.55)}" width="${n(rd * 0.07)}" height="${n(largo * 1.1)}" fill="${tinta}" transform="rotate(${a} ${n(x)} ${n(y)})"/>`;
        } else {
          const [x, y] = polar(cx, cy, rOut - largo * 0.45, a);
          out += `<circle class="${claseLume}" cx="${n(x)}" cy="${n(y)}" r="${n(rd * 0.043)}" fill="${tinta}"/>`;
        }
      }
    } else {
      /* Bâtons aplicados: doble a las doce. */
      for (let i = 0; i < 12; i++) {
        const a = i * 30;
        if (spec.complicaciones.includes('fecha') && i === 3) continue;
        if (spec.complicaciones.includes('segundero-pequeno') && i === 6) continue;
        if (spec.complicaciones.includes('fase-lunar') && i === 6) continue;
        if (spec.complicaciones.includes('cronografo') && (i === 3 || i === 6 || i === 9)) continue;
        if (i === 0) {
          [-1, 1].forEach(s => {
            const [x, y] = polar(cx, cy, rOut - largo * 0.5, a);
            out += `<rect class="${claseLume}" x="${n(x + s * rd * 0.045 - rd * 0.022)}" y="${n(y - largo * 0.6)}" width="${n(rd * 0.044)}" height="${n(largo * 1.2)}" fill="${tinta}"/>`;
          });
        } else {
          const [x, y] = polar(cx, cy, rOut - largo * 0.5, a);
          out += `<rect class="${claseLume}" x="${n(x - rd * 0.028)}" y="${n(y - largo * 0.5)}" width="${n(rd * 0.056)}" height="${n(largo)}" fill="${tinta}" transform="rotate(${a} ${n(x)} ${n(y)})"/>`;
        }
      }
    }
    return out;
  }

  /* ======================================================================
     COMPLICACIONES Y FIRMA
     ====================================================================== */
  function complicaciones(uid, spec, cx, cy, rd, ahora) {
    const d = spec.dial, tinta = d.tinta, comp = spec.complicaciones;
    const claro = esClaro(d.base);
    const sub = claro ? aclarar(d.base, -0.12) : aclarar(d.base, 0.14);
    const subBorde = claro ? aclarar(d.base, -0.4) : aclarar(d.base, 0.4);
    let out = '';

    const subdial = (sx, sy, sr, etiquetas) => {
      let s = `<circle cx="${n(sx)}" cy="${n(sy)}" r="${n(sr)}" fill="${sub}"/>`;
      for (let i = 1; i < 14; i++) s += `<circle cx="${n(sx)}" cy="${n(sy)}" r="${n(sr * i / 14)}" fill="none" stroke="${subBorde}" stroke-width="0.6" opacity="0.3"/>`;
      s += `<circle cx="${n(sx)}" cy="${n(sy)}" r="${n(sr)}" fill="none" stroke="${subBorde}" stroke-width="1" opacity="0.6"/>`;
      for (let i = 0; i < 12; i++) s += radial(sx, sy, sr * 0.88, sr * 0.99, i * 30, `stroke="${tinta}" stroke-width="${i % 3 === 0 ? 1.4 : 0.7}" opacity="0.75"`);
      (etiquetas || []).forEach(([t, a]) => { const [x, y] = polar(sx, sy, sr * 0.62, a); s += `<text x="${n(x)}" y="${n(y)}" text-anchor="middle" dominant-baseline="central" font-family="'IBM Plex Mono',monospace" font-size="${n(sr * 0.36)}" fill="${tinta}" opacity="0.85">${t}</text>`; });
      return s;
    };

    if (comp.includes('cronografo')) {
      const sr = rd * 0.26;
      out += subdial(cx + rd * 0.52, cy, sr, [['30', 0], ['15', 180]]);
      out += subdial(cx - rd * 0.52, cy, sr, [['60', 0], ['30', 180]]);
      out += subdial(cx, cy + rd * 0.52, sr, [['12', 0], ['6', 180]]);
      /* Agujas de los contadores, en posiciones de reposo. */
      out += `<line x1="${n(cx - rd * 0.52)}" y1="${n(cy)}" x2="${n(cx - rd * 0.52)}" y2="${n(cy - sr * 0.8)}" stroke="${tinta}" stroke-width="1.6" class="av-sub-s" style="--sx:${n(cx - rd * 0.52)}px;--sy:${n(cy)}px"/>`;
      out += `<line x1="${n(cx + rd * 0.52)}" y1="${n(cy)}" x2="${n(cx + rd * 0.52)}" y2="${n(cy - sr * 0.8)}" stroke="${tinta}" stroke-width="1.6"/>`;
      out += `<line x1="${n(cx)}" y1="${n(cy + rd * 0.52)}" x2="${n(cx)}" y2="${n(cy + rd * 0.52 - sr * 0.8)}" stroke="${tinta}" stroke-width="1.6"/>`;
    }
    if (comp.includes('segundero-pequeno') && !comp.includes('cronografo')) {
      const sr = rd * 0.24, sy = cy + rd * 0.48;
      out += subdial(cx, sy, sr, [['30', 180]]);
      out += `<g class="av-sub-s" style="--sx:${n(cx)}px;--sy:${n(sy)}px"><line x1="${n(cx)}" y1="${n(sy + sr * 0.18)}" x2="${n(cx)}" y2="${n(sy - sr * 0.85)}" stroke="${tinta}" stroke-width="1.5"/></g>`;
      out += `<circle cx="${n(cx)}" cy="${n(sy)}" r="2" fill="${tinta}"/>`;
    }
    if (comp.includes('fase-lunar')) {
      /* Ventana de arco con disco de aventurina y luna en nácar. */
      const wy = cy + rd * 0.44, ww = rd * 0.52, wh = rd * 0.30;
      const fase = ((ahora.getTime() / 86400000) % 29.53) / 29.53;
      out += `<clipPath id="luna${uid}"><path d="M ${n(cx - ww / 2)} ${n(wy + wh / 2)} A ${n(ww / 2)} ${n(wh)} 0 0 1 ${n(cx + ww / 2)} ${n(wy + wh / 2)} Z"/></clipPath>`;
      out += `<g clip-path="url(#luna${uid})"><rect x="${n(cx - ww)}" y="${n(wy - wh)}" width="${n(ww * 2)}" height="${n(wh * 2.2)}" fill="#0a1230"/>`;
      const rnd = semilla('luna' + spec.id);
      for (let i = 0; i < 40; i++) out += `<circle cx="${n(cx - ww + rnd() * ww * 2)}" cy="${n(wy - wh + rnd() * wh * 2)}" r="${n(0.4 + rnd())}" fill="#cfd8ff" opacity="${n(0.4 + rnd() * 0.6)}"/>`;
      const desp = (fase - 0.5) * ww * 1.6;
      out += `<circle cx="${n(cx + desp)}" cy="${n(wy + wh * 0.12)}" r="${n(wh * 0.44)}" fill="#efe9d8"/>`;
      out += `<circle cx="${n(cx + desp - wh * 0.14)}" cy="${n(wy + wh * 0.02)}" r="${n(wh * 0.09)}" fill="#d6cfbc"/>`;
      out += `</g>`;
      out += `<path d="M ${n(cx - ww / 2)} ${n(wy + wh / 2)} A ${n(ww / 2)} ${n(wh)} 0 0 1 ${n(cx + ww / 2)} ${n(wy + wh / 2)} Z" fill="none" stroke="${tinta}" stroke-width="1.4" opacity="0.8"/>`;
    }
    if (comp.includes('reserva')) {
      /* Indicador en abanico: cuánta cuerda queda. */
      const ry = cy - rd * 0.50, rr = rd * 0.26;
      out += `<path d="M ${p(cx, ry, rr, -55)} A ${n(rr)} ${n(rr)} 0 0 1 ${p(cx, ry, rr, 55)}" fill="none" stroke="${subBorde}" stroke-width="1.4" opacity="0.7"/>`;
      for (let i = 0; i <= 4; i++) out += radial(cx, ry, rr, rr * 0.86, -55 + i * 27.5, `stroke="${tinta}" stroke-width="${i % 4 === 0 ? 1.6 : 0.9}" opacity="0.8"`);
      out += radial(cx, ry, 0, rr * 0.8, 34, `stroke="#2a4a8a" stroke-width="1.8"`);
      out += `<text x="${n(cx)}" y="${n(ry + rr * 0.55)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(rd * 0.062)}" fill="${tinta}" opacity="0.7" letter-spacing="1">RESERVA</text>`;
    }
    if (comp.includes('mundo')) {
      /* Anillo de veinticuatro ciudades de un worldtimer. */
      const ciudades = ['MEX', 'DEN', 'LAX', 'ANC', 'HNL', 'MDY', 'AKL', 'SYD', 'TYO', 'HKG', 'BKK', 'DAC', 'KHI', 'DXB', 'MOW', 'CAI', 'PAR', 'LON', 'AZO', 'FEN', 'RIO', 'CCS', 'NYC', 'CHI'];
      const rc = rd * 0.66;
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rc + rd * 0.10)}" fill="none" stroke="${subBorde}" stroke-width="0.9" opacity="0.5"/>`;
      out += `<circle cx="${cx}" cy="${cy}" r="${n(rc - rd * 0.10)}" fill="none" stroke="${subBorde}" stroke-width="0.9" opacity="0.5"/>`;
      ciudades.forEach((c, i) => {
        const a = i * 15;
        const [x, y] = polar(cx, cy, rc, a);
        out += `<text x="${n(x)}" y="${n(y)}" text-anchor="middle" dominant-baseline="central" transform="rotate(${a} ${n(x)} ${n(y)})" font-family="'IBM Plex Mono',monospace" font-size="${n(rd * 0.062)}" fill="${tinta}" opacity="0.85">${c}</text>`;
      });
    }
    if (comp.includes('fecha')) {
      const dw = rd * 0.20, dh = rd * 0.14, dx = cx + rd * 0.68, dy = cy;
      out += `<rect x="${n(dx - dw / 2)}" y="${n(dy - dh / 2)}" width="${n(dw)}" height="${n(dh)}" fill="${claro ? '#1b1c1f' : '#f0ece2'}"/>`;
      out += `<rect x="${n(dx - dw / 2)}" y="${n(dy - dh / 2)}" width="${n(dw)}" height="${n(dh)}" fill="none" stroke="${tinta}" stroke-width="1.2" opacity="0.85"/>`;
      out += `<text class="av-fecha" x="${n(dx)}" y="${n(dy)}" text-anchor="middle" dominant-baseline="central" font-family="'IBM Plex Mono',monospace" font-size="${n(rd * 0.11)}" fill="${claro ? '#f0ece2' : '#1b1c1f'}">${ahora.getDate()}</text>`;
    }

    /* Firma del dial: la marca del reloj y su familia. Un dial cargado pierde
       la línea de abajo antes que dejar que dos textos se encimen.          */
    const marca = spec.marca || '';
    const escapa = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    /* La marca se encoge sola si es larga, para no salirse del dial. */
    const tamMarca = rd * (marca.length > 9 ? 0.088 : marca.length > 6 ? 0.105 : 0.125);
    const yFirma = comp.includes('reserva') ? cy - rd * 0.17 : cy - rd * 0.40;
    out += `<text x="${cx}" y="${n(yFirma)}" text-anchor="middle" font-family="'Bodoni Moda',Georgia,serif" font-weight="600" font-size="${n(tamMarca)}" letter-spacing="${n(rd * 0.016)}" fill="${tinta}">${escapa(marca)}</text>`;
    if (!comp.includes('reserva') && spec.dialLinea)
      out += `<text x="${cx}" y="${n(yFirma + rd * 0.125)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(rd * 0.05)}" letter-spacing="${n(rd * 0.02)}" fill="${tinta}" opacity="0.78">${escapa(spec.dialLinea)}</text>`;

    const bajoOcupado = comp.includes('cronografo') || comp.includes('fase-lunar') || comp.includes('segundero-pequeno') || comp.includes('mundo');
    if (!bajoOcupado)
      out += `<text x="${cx}" y="${n(cy + rd * 0.36)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(rd * 0.052)}" letter-spacing="${n(rd * 0.014)}" fill="${tinta}" opacity="0.62">${spec.calibre.tipo.toUpperCase()} · ${spec.caja.agua} M</text>`;
    else if (!comp.includes('mundo'))
      /* Con subdial a las seis, la firma técnica se va al costado izquierdo. */
      out += `<text x="${n(cx - rd * 0.50)}" y="${n(cy + rd * 0.30)}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${n(rd * 0.046)}" letter-spacing="${n(rd * 0.012)}" fill="${tinta}" opacity="0.5">${spec.caja.agua} M</text>`;
    return out;
  }

  /* ======================================================================
     AGUJAS
     ====================================================================== */
  function agujas(spec, cx, cy, rd) {
    const m = spec.manecillas, col = m.color, tipo = m.tipo;
    const lume = spec.dial.lume ? 'av-lume' : '';
    const rH = rd * 0.52, rM = rd * 0.80, rS = rd * 0.86;
    let out = '';

    const forma = (largo, ancho, cls) => {
      if (tipo === 'dauphine') return `<path class="${cls}" d="M ${cx} ${n(cy - largo)} L ${n(cx + ancho)} ${n(cy - largo * 0.22)} L ${cx} ${n(cy + largo * 0.13)} L ${n(cx - ancho)} ${n(cy - largo * 0.22)} Z" fill="${col}"/><path d="M ${cx} ${n(cy - largo)} L ${cx} ${n(cy + largo * 0.13)}" stroke="rgba(0,0,0,.35)" stroke-width="0.9"/>`;
      if (tipo === 'espada') return `<path class="${cls}" d="M ${cx} ${n(cy - largo)} L ${n(cx + ancho)} ${n(cy - largo * 0.62)} L ${n(cx + ancho * 0.55)} ${n(cy + largo * 0.15)} L ${n(cx - ancho * 0.55)} ${n(cy + largo * 0.15)} L ${n(cx - ancho)} ${n(cy - largo * 0.62)} Z" fill="${col}"/>`;
      if (tipo === 'mercedes') return `<rect class="${cls}" x="${n(cx - ancho * 0.62)}" y="${n(cy - largo)}" width="${n(ancho * 1.24)}" height="${n(largo * 1.13)}" fill="${col}"/>`;
      return `<rect class="${cls}" x="${n(cx - ancho * 0.55)}" y="${n(cy - largo)}" width="${n(ancho * 1.1)}" height="${n(largo * 1.12)}" fill="${col}"/>`;
    };

    /* Aguja GMT: viaja bajo las demás, con su rombo característico. */
    if (m.gmt) {
      out += `<g class="av-gmt" style="--cx:${cx}px;--cy:${cy}px">`;
      out += `<rect x="${n(cx - 1.6)}" y="${n(cy - rd * 0.70)}" width="3.2" height="${n(rd * 0.82)}" fill="${m.gmt}"/>`;
      out += `<path d="M ${cx} ${n(cy - rd * 0.86)} L ${n(cx + rd * 0.062)} ${n(cy - rd * 0.74)} L ${cx} ${n(cy - rd * 0.62)} L ${n(cx - rd * 0.062)} ${n(cy - rd * 0.74)} Z" fill="${m.gmt}" stroke="${col}" stroke-width="1"/>`;
      out += `</g>`;
    }

    out += `<g class="av-hora" style="--cx:${cx}px;--cy:${cy}px">`;
    if (tipo === 'mercedes') {
      out += forma(rH, rd * 0.036, lume);
      out += `<circle class="${lume}" cx="${cx}" cy="${n(cy - rH * 0.88)}" r="${n(rd * 0.062)}" fill="${col}"/>`;
      out += `<circle cx="${cx}" cy="${n(cy - rH * 0.88)}" r="${n(rd * 0.062)}" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="1"/>`;
      for (let i = 0; i < 3; i++) out += radial(cx, cy - rH * 0.88, 0, rd * 0.062, 90 + i * 120, `stroke="rgba(0,0,0,.4)" stroke-width="1.4"`);
    } else out += forma(rH, rd * 0.042, lume);
    out += `</g>`;

    out += `<g class="av-min" style="--cx:${cx}px;--cy:${cy}px">${forma(rM, rd * 0.030, lume)}</g>`;

    out += `<g class="av-seg" style="--cx:${cx}px;--cy:${cy}px">`;
    out += `<rect x="${n(cx - 1.05)}" y="${n(cy - rS)}" width="2.1" height="${n(rS * 1.28)}" fill="${spec.dial.lume ? '#c9452d' : col}"/>`;
    out += `<circle cx="${cx}" cy="${n(cy + rS * 0.20)}" r="${n(rd * 0.045)}" fill="${spec.dial.lume ? '#c9452d' : col}"/>`;
    out += `</g>`;

    out += `<circle cx="${cx}" cy="${cy}" r="${n(rd * 0.032)}" fill="${col}"/><circle cx="${cx}" cy="${cy}" r="${n(rd * 0.014)}" fill="rgba(0,0,0,.5)"/>`;
    return out;
  }

  /* ======================================================================
     PIEZA COMPLETA
     ====================================================================== */
  function svgReloj(spec, opts) {
    opts = opts || {};
    const uid = 'u' + (++contador);
    const met = AV.METALES[spec.caja.metal];
    const cx = 200, cy = 290;
    const R = 118 + (spec.caja.diametro - 36) * 5.2;   /* el diámetro real se ve */
    const rDial = R * (spec.bisel.tipo === 'liso' ? 0.88 : 0.80);
    const ahora = new Date();

    /* El configurador puede pisar dial y correa sin tocar la ficha original. */
    const base = opts.dial ? Object.assign({}, spec, { dial: Object.assign({}, spec.dial, { base: opts.dial.base, tinta: opts.dial.tinta }) }) : spec;
    const cor = AV.CORREAS[opts.correa || spec.correa];

    let defs = `<defs>
      <linearGradient id="met${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${met.brillo}"/><stop offset="28%" stop-color="${met.cuerpo}"/>
        <stop offset="52%" stop-color="${met.sombra}"/><stop offset="74%" stop-color="${met.cuerpo}"/>
        <stop offset="100%" stop-color="${met.brillo}"/>
      </linearGradient>
      <radialGradient id="sun${uid}" cx="42%" cy="34%" r="72%">
        <stop offset="0%" stop-color="${aclarar(base.dial.base, 0.34)}" stop-opacity="0.95"/>
        <stop offset="55%" stop-color="${base.dial.base}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="${aclarar(base.dial.base, -0.55)}" stop-opacity="0.9"/>
      </radialGradient>
      <linearGradient id="cri${uid}" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.20"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0.03"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <filter id="brillo${uid}" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="sombra${uid}" x="-30%" y="-20%" width="160%" height="150%">
        <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000" flood-opacity="0.45"/>
      </filter>
    </defs>`;

    let g = '';
    g += correa(uid, cor, cx, cy, R, true);
    g += correa(uid, cor, cx, cy, R, false);
    g += `<g filter="url(#sombra${uid})">`;
    g += `<circle cx="${cx}" cy="${cy}" r="${n(R * 1.02)}" fill="url(#met${uid})"/>`;   /* flanco de la caja */
    g += bisel(uid, base, cx, cy, R, rDial);
    g += `</g>`;
    g += textura(uid, base, cx, cy, rDial);
    g += indices(base, cx, cy, rDial);
    g += complicaciones(uid, base, cx, cy, rDial, ahora);
    g += agujas(base, cx, cy, rDial);

    /* Corona a las tres, y pulsadores si hay cronógrafo. */
    const cw = R * 0.10, ch = R * 0.17;
    g += `<rect x="${n(cx + R * 0.99)}" y="${n(cy - ch / 2)}" width="${n(cw)}" height="${n(ch)}" fill="url(#met${uid})"/>`;
    for (let i = 0; i < 6; i++) g += `<line x1="${n(cx + R * 0.99)}" y1="${n(cy - ch / 2 + i * ch / 5.5)}" x2="${n(cx + R * 0.99 + cw)}" y2="${n(cy - ch / 2 + i * ch / 5.5)}" stroke="${met.sombra}" stroke-width="1"/>`;
    if (spec.complicaciones.includes('cronografo')) {
      [-1, 1].forEach(s => { const [x, y] = polar(cx, cy, R * 1.0, 90 + s * 26); g += `<rect x="${n(x)}" y="${n(y - ch * 0.24)}" width="${n(cw * 0.85)}" height="${n(ch * 0.48)}" fill="url(#met${uid})" transform="rotate(${s * 26} ${n(x)} ${n(y)})"/>`; });
    }

    /* Reflejo del zafiro: lo último que se dibuja, como en la vida real. */
    g += `<path class="av-cristal" d="M ${n(cx - rDial * 0.94)} ${n(cy - rDial * 0.2)} A ${n(rDial)} ${n(rDial)} 0 0 1 ${n(cx + rDial * 0.42)} ${n(cy - rDial * 0.88)} L ${n(cx - rDial * 0.30)} ${n(cy + rDial * 0.55)} Z" fill="url(#cri${uid})" clip-path="url(#dial${uid})" pointer-events="none"/>`;

    const mov = /cuarzo/.test(spec.calibre.tipo) ? 'cuarzo' : spec.calibre.tipo === 'automático' ? 'auto' : 'manual';
    const clase = 'av-svg av-reloj-vivo' + (opts.clase ? ' ' + opts.clase : '');
    return `<svg class="${clase}" viewBox="0 0 400 580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${spec.marca} ${spec.modelo}, ${met.nombre}, ${spec.caja.diametro} milímetros"
      data-mov="${mov}" ${opts.tz ? `data-tz="${opts.tz}"` : ''} preserveAspectRatio="xMidYMid meet">${defs}${g}</svg>`;
  }

  /* ======================================================================
     BUCLE DE LA HORA · un solo rAF para todas las piezas del documento
     ====================================================================== */
  let vivos = [];
  function refrescar() { vivos = Array.from(document.querySelectorAll('.av-reloj-vivo')); }

  function girar(el, sel, ang) {
    const g = el.querySelector(sel);
    if (g) g.style.transform = `rotate(${ang}deg)`;
  }

  function tic() {
    const ahora = Date.now();
    for (const el of vivos) {
      let d = new Date(ahora);
      let h, m, s, ms = d.getMilliseconds();
      if (el.dataset.tz) {
        /* Hora de otra ciudad, sin librerías: el propio navegador la calcula. */
        const partes = new Intl.DateTimeFormat('es-MX', { timeZone: el.dataset.tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).formatToParts(d);
        const v = {}; partes.forEach(p => v[p.type] = parseInt(p.value, 10));
        h = v.hour % 24; m = v.minute; s = v.second;
      } else { h = d.getHours(); m = d.getMinutes(); s = d.getSeconds(); }

      /* Un automático barre, una cuerda manual barre más entrecortado y un
         cuarzo pega el salto seco de cada segundo. Se nota y es correcto. */
      const segCont = el.dataset.mov === 'cuarzo' ? s
        : el.dataset.mov === 'manual' ? s + Math.floor(ms / 125) / 8
        : s + ms / 1000;
      girar(el, '.av-seg', segCont * 6);
      girar(el, '.av-min', (m + segCont / 60) * 6);
      girar(el, '.av-hora', ((h % 12) + m / 60 + segCont / 3600) * 30);
      girar(el, '.av-gmt', (h + m / 60) * 15);
      girar(el, '.av-sub-s', segCont * 6);
    }
    requestAnimationFrame(tic);
  }

  /* Monta todo contenedor con data-reloj="id-del-modelo". */
  function montarTodos(raiz) {
    (raiz || document).querySelectorAll('[data-reloj]:not([data-montado])').forEach(el => {
      const spec = AV.porId(el.dataset.reloj);
      if (!spec) return;
      el.innerHTML = svgReloj(spec, { tz: el.dataset.tz || null, correa: el.dataset.correa || null });
      el.setAttribute('data-montado', '1');
    });
    refrescar();
  }

  global.AVMotor = { svgReloj, montarTodos, refrescar, aclarar, esClaro };
  document.addEventListener('DOMContentLoaded', () => { montarTodos(); requestAnimationFrame(tic); });
})(window);
