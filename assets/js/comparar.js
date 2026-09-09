/* ==========================================================================
   AV WATCHES · Banco de trabajo (comparador)
   Marca en latón el mejor valor de cada fila: el que más reserva, el más
   ligero, el más resistente. Comparar sin ayudar no sirve de nada.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const cont = document.getElementById('banco');

  const FILAS = [
    { eti: 'Referencia',        v: p => p.ref },
    { eti: 'Colección',         v: p => p.coleccion },
    { eti: 'Precio',            v: p => AV.precioMXN(p.precio), n: p => p.precio, mejor: 'min' },
    { eti: 'Diámetro',          v: p => p.caja.diametro + ' mm', n: p => p.caja.diametro },
    { eti: 'Altura',            v: p => p.caja.altura + ' mm', n: p => p.caja.altura, mejor: 'min' },
    { eti: 'Material',          v: p => AV.METALES[p.caja.metal].nombre },
    { eti: 'Calibre',           v: p => p.calibre.nombre },
    { eti: 'Cuerda',            v: p => p.calibre.tipo },
    { eti: 'Reserva de marcha', v: p => p.calibre.reserva + ' h', n: p => p.calibre.reserva, mejor: 'max' },
    { eti: 'Rubíes',            v: p => p.calibre.rubies, n: p => p.calibre.rubies, mejor: 'max' },
    { eti: 'Al agua',           v: p => p.caja.agua + ' m', n: p => p.caja.agua, mejor: 'max' },
    { eti: 'Complicaciones',    v: p => p.complicaciones.length ? p.complicaciones.join(' · ') : '—' },
    { eti: 'Producción',        v: p => p.piezas ? p.piezas + ' piezas' : 'Continua', n: p => p.piezas || 9999, mejor: 'min' },
    { eti: 'En el taller',      v: p => p.stock + (p.stock === 1 ? ' pieza' : ' piezas'), n: p => p.stock }
  ];

  function pintar() {
    const ids = AVTienda.estado.comparador;
    const piezas = ids.map(AV.porId).filter(Boolean);

    if (!piezas.length) {
      cont.innerHTML = `<div class="av-vacio" style="border:var(--filo)">
        <p class="av-t-lead">El banco está limpio.</p>
        <p>Manda piezas aquí desde la colección con el botón de las tres barras. Caben tres.</p>
        <a class="av-btn av-btn--laton" href="catalogo.html">Ir a la colección</a></div>`;
      return;
    }

    const th = piezas.map(p => `<td class="av-banco__pieza">
        <div data-reloj="${p.id}"></div>
        <h2 class="av-t-titulo" style="font-size:1.3rem;margin-top:.6rem"><a href="reloj.html?id=${p.id}">${p.nombre}</a></h2>
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

    cont.innerHTML = `<div class="av-banco"><table>
      <thead><tr><td></td>${th}</tr></thead>
      <tbody>${filas}</tbody>
    </table></div>
    <p class="av-mono av-tenue" style="margin-top:1.2rem">En latón, el mejor dato de cada renglón. Un número mejor no siempre hace un mejor reloj.</p>`;

    AVMotor.montarTodos(cont);
    cont.querySelectorAll('[data-quitar]').forEach(b => b.onclick = () => { AVTienda.comparar(b.dataset.quitar); pintar(); });
  }

  document.getElementById('vaciar-banco').onclick = () => {
    AVTienda.estado.comparador.slice().forEach(AVTienda.comparar);
    pintar();
  };
  pintar();
});
