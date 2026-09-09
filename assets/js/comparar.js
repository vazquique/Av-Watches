/* ==========================================================================
   AV WATCHES · Comparador
   Marca en rojo el mejor valor de cada fila: más reserva, más delgado,
   más resistente. Comparar sin ayudar no sirve de nada.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const cont = document.getElementById('banco');

  const FILAS = [
    { eti: 'Marca',             v: p => p.marca },
    { eti: 'Referencia',        v: p => p.refFab },
    { eti: 'Condición',         v: p => p.condicion === 'nuevo' ? 'Nuevo, sellado' : 'Seminuevo · ' + p.anio },
    { eti: 'Precio',            v: p => AV.precioMXN(p.precio), n: p => p.precio, mejor: 'min' },
    { eti: 'Diámetro',          v: p => p.caja.diametro + ' mm', n: p => p.caja.diametro },
    { eti: 'Altura',            v: p => p.caja.altura + ' mm', n: p => p.caja.altura, mejor: 'min' },
    { eti: 'Material',          v: p => AV.METALES[p.caja.metal].nombre },
    { eti: 'Movimiento',        v: p => p.calibre.nombre },
    { eti: 'Tipo',              v: p => p.calibre.tipo },
    { eti: 'Reserva / autonomía', v: p => p.calibre.reserva >= 8760 ? '~' + Math.round(p.calibre.reserva / 8760) + ' años' : p.calibre.reserva >= 720 ? '~' + Math.round(p.calibre.reserva / 730) + ' meses' : p.calibre.reserva + ' h', n: p => p.calibre.reserva, mejor: 'max' },
    { eti: 'Al agua',           v: p => p.caja.agua + ' m', n: p => p.caja.agua, mejor: 'max' },
    { eti: 'Complicaciones',    v: p => p.complicaciones.length ? p.complicaciones.join(' · ') : '—' },
    { eti: 'Qué incluye',       v: p => p.incluye },
    { eti: 'En existencia',     v: p => p.stock + (p.stock === 1 ? ' pieza' : ' piezas'), n: p => p.stock }
  ];

  /* ----------------------------------------------------------------------
     Siluetas superpuestas: la diferencia de tamaño de un vistazo.
     Todo en milímetros, así que la comparación es literal.
     ---------------------------------------------------------------------- */
  const TONOS = ['var(--acento)', 'rgba(160,180,220,.9)', 'rgba(200,110,80,.9)'];

  function siluetas(piezas) {
    const maxD = Math.max(...piezas.map(p => p.caja.diametro));
    const maxH = Math.max(...piezas.map(p => p.caja.altura));
    const M = 16, W = maxD + M * 2, H = maxD + M * 2;

    /* Vista de frente: círculos concéntricos con el diámetro real. */
    let frente = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diámetros comparados">`;
    frente += `<line x1="${M}" y1="${H / 2}" x2="${W - M}" y2="${H / 2}" stroke="var(--linea)" stroke-width=".4" stroke-dasharray="2 3"/>`;
    piezas.forEach((p, i) => {
      const r = p.caja.diametro / 2;
      frente += `<circle cx="${W / 2}" cy="${H / 2}" r="${r}" fill="none" stroke="${TONOS[i]}" stroke-width="${i === 0 ? .9 : .7}"
                  stroke-dasharray="${i ? '3 2' : ''}"/>`;
      /* La cota de cada uno, escalonada para que no se encimen. */
      const y = H / 2 - r;
      frente += `<line x1="${W / 2}" y1="${y}" x2="${W / 2 + 6 + i * 3}" y2="${y - 4 - i * 5}" stroke="${TONOS[i]}" stroke-width=".35"/>`;
      frente += `<text x="${W / 2 + 8 + i * 3}" y="${y - 4 - i * 5}" font-family="Archivo,sans-serif" font-size="3.6"
                  fill="${TONOS[i]}">${p.caja.diametro} mm</text>`;
    });
    frente += '</svg>';

    /* Vista de canto: los grosores apilados sobre la misma línea de apoyo. */
    const HW = maxD + M * 2, HH = maxH * 3.4 + M;
    let canto = `<svg viewBox="0 0 ${HW} ${HH}" role="img" aria-label="Grosores comparados">`;
    piezas.forEach((p, i) => {
      const y = HH - M / 2 - i * (maxH * 1.05 + 3);
      const x = HW / 2 - p.caja.diametro / 2;
      canto += `<rect x="${x}" y="${(y - p.caja.altura).toFixed(2)}" width="${p.caja.diametro}" height="${p.caja.altura}"
                 rx="${(p.caja.altura * 0.30).toFixed(2)}" fill="none" stroke="${TONOS[i]}" stroke-width=".7"/>`;
      canto += `<text x="${HW / 2 + p.caja.diametro / 2 + 3}" y="${(y - p.caja.altura / 2 + 1.3).toFixed(2)}"
                 font-family="Archivo,sans-serif" font-size="3.6" fill="${TONOS[i]}">${p.caja.altura} mm</text>`;
    });
    canto += '</svg>';

    return `<section class="av-siluetas">
      <div class="av-siluetas__cab">
        <h2 class="av-t-eyebrow">A escala, una encima de otra</h2>
        <p class="av-mono av-tenue">Milímetros reales · ${piezas.map((p, i) =>
          `<span style="color:${TONOS[i]}">■</span> ${p.modelo}`).join(' &nbsp; ')}</p>
      </div>
      <div class="av-siluetas__par">
        <figure><figcaption class="av-mono">Diámetro</figcaption>${frente}</figure>
        <figure><figcaption class="av-mono">Grosor</figcaption>${canto}</figure>
      </div>
    </section>`;
  }

  function pintar() {
    const ids = AVTienda.estado.comparador;
    const piezas = ids.map(AV.porId).filter(Boolean);

    if (!piezas.length) {
      cont.innerHTML = `<div class="av-vacio" style="border:var(--filo)">
        <p class="av-t-lead">No has puesto nada a comparar.</p>
        <p>Manda relojes aquí desde el catálogo con el botón de las tres barras. Caben tres.</p>
        <a class="av-btn av-btn--acento" href="catalogo.html">Ver el catálogo</a></div>`;
      return;
    }

    const th = piezas.map(p => `<td class="av-banco__pieza">
        <div data-reloj="${p.id}" data-dibujo></div>
        <p class="av-mono av-acento" style="font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;margin:.6rem 0 .2rem">${p.marca}</p>
        <h2 class="av-t-titulo" style="font-size:1.25rem"><a href="reloj.html?id=${p.id}">${p.modelo}</a></h2>
        <p class="av-pieza__lema" style="min-height:0;font-size:.85rem">${p.lema}</p>
        <div style="display:flex;gap:.4rem;justify-content:center;margin-top:.6rem">
          <a class="av-btn av-btn--bajo" href="reloj.html?id=${p.id}">Ver ficha</a>
          <button type="button" class="av-btn av-btn--bajo" data-quitar="${p.id}">Quitar</button>
        </div>
      </td>`).join('');

    const filas = FILAS.map(f => {
      let ganadores = [];
      if (f.mejor && piezas.length > 1) {
        const vals = piezas.map(f.n);
        const meta = f.mejor === 'max' ? Math.max(...vals) : Math.min(...vals);
        ganadores = vals.map(v => v === meta);
      }
      return `<tr><th scope="row">${f.eti}</th>${piezas.map((p, i) =>
        `<td class="${ganadores[i] ? 'ganador' : ''}">${f.v(p)}</td>`).join('')}</tr>`;
    }).join('');

    cont.innerHTML = (piezas.length > 1 ? siluetas(piezas) : '') + `<div class="av-banco"><table>
      <thead><tr><td></td>${th}</tr></thead>
      <tbody>${filas}</tbody>
    </table></div>
    <p class="av-mono av-tenue" style="margin-top:1.2rem">En rojo, el mejor dato de cada renglón. Ojo: un número mejor no siempre hace un mejor reloj.</p>`;

    AVMotor.montarTodos(cont);
    cont.querySelectorAll('[data-quitar]').forEach(b => b.onclick = () => { AVTienda.comparar(b.dataset.quitar); pintar(); });
  }

  document.getElementById('vaciar-banco').onclick = () => {
    AVTienda.estado.comparador.slice().forEach(AVTienda.comparar);
    pintar();
  };
  pintar();
});
