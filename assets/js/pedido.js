/* ==========================================================================
   AV WATCHES · Cierre del pedido
   Demostración: no se cobra nada ni se manda nada a ningún servidor.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const cont = document.getElementById('pedido');
  const ENTREGAS = [
    { id: 'taller', nom: 'Recoger en el taller', det: 'Río Lerma 232, colonia Juárez · con cita', costo: 0 },
    { id: 'mensajeria', nom: 'Mensajería asegurada', det: 'Toda la República · 5 a 8 días hábiles', costo: 0 },
    { id: 'mano', nom: 'Entrega en mano', det: 'Zona metropolitana del Valle de México · un relojero te la lleva', costo: 1200 }
  ];

  function pintar() {
    const carrito = AVTienda.estado.carrito;
    if (!carrito.length) {
      cont.innerHTML = `<div class="av-vacio" style="grid-column:1/-1;border:var(--filo)">
        <p class="av-t-lead">No hay nada que cobrar.</p>
        <p>Tu bolsa está vacía. Date una vuelta por la colección.</p>
        <a class="av-btn av-btn--laton" href="catalogo.html">Ver la colección</a></div>`;
      return;
    }

    cont.innerHTML = `
      <form id="form-pedido" novalidate>
        <fieldset style="border:0;padding:0;margin:0 0 2.5rem">
          <legend class="av-t-eyebrow" style="margin-bottom:1.2rem">01 · Quién eres</legend>
          <div class="av-campos-dos">
            <div class="av-campo"><label for="nombre">Nombre</label><input id="nombre" name="nombre" autocomplete="given-name" required></div>
            <div class="av-campo"><label for="apellido">Apellidos</label><input id="apellido" name="apellido" autocomplete="family-name" required></div>
          </div>
          <div class="av-campo"><label for="correo">Correo</label><input type="email" id="correo" name="correo" autocomplete="email" required></div>
          <div class="av-campo"><label for="tel">Teléfono</label><input type="tel" id="tel" name="tel" autocomplete="tel" placeholder="55 0000 0000"></div>
        </fieldset>

        <fieldset style="border:0;padding:0;margin:0 0 2.5rem">
          <legend class="av-t-eyebrow" style="margin-bottom:1.2rem">02 · Cómo te la hacemos llegar</legend>
          <div class="av-entrega">
            ${ENTREGAS.map((e, i) => `<label>
              <input type="radio" name="entrega" value="${e.id}" data-costo="${e.costo}" ${i === 1 ? 'checked' : ''}>
              <span>${e.nom}<small>${e.det}</small></span>
              <b class="av-mono">${e.costo ? AV.precioMXN(e.costo) : 'Sin costo'}</b>
            </label>`).join('')}
          </div>
          <div class="av-campo" style="margin-top:1.2rem"><label for="dir">Dirección de entrega</label><textarea id="dir" name="dir" rows="3" placeholder="Calle, número, colonia, código postal, ciudad"></textarea></div>
        </fieldset>

        <fieldset style="border:0;padding:0">
          <legend class="av-t-eyebrow" style="margin-bottom:1.2rem">03 · Cómo pagas</legend>
          <div class="av-entrega">
            <label><input type="radio" name="pago" value="tarjeta" checked><span>Tarjeta de crédito o débito<small>Hasta 12 meses sin intereses</small></span><b class="av-mono">—</b></label>
            <label><input type="radio" name="pago" value="transfer"><span>Transferencia SPEI<small>Te mandamos la CLABE por correo</small></span><b class="av-mono">−3%</b></label>
            <label><input type="radio" name="pago" value="taller"><span>En el taller<small>Efectivo o terminal, el día que la recoges</small></span><b class="av-mono">—</b></label>
          </div>
          <p class="av-mono av-tenue" style="margin-top:1rem;font-size:.68rem">Esta tienda es una demostración: no se procesa ningún cobro ni se envía información a ningún servidor.</p>
        </fieldset>
      </form>

      <aside class="av-resumen">
        <h2 class="av-t-eyebrow" style="padding-bottom:1rem;border-bottom:var(--filo)">Tu pedido</h2>
        <div id="resumen-lineas"></div>
        <div id="resumen-totales"></div>
        <button type="submit" form="form-pedido" class="av-btn av-btn--solido av-bloque" style="margin-top:1.4rem">Confirmar el pedido</button>
        <p class="av-bolsa__nota">Cinco años de garantía. Treinta días para devolverlo completo.</p>
      </aside>`;

    /* --- Resumen ---------------------------------------------------------- */
    function totales() {
      const entrega = cont.querySelector('input[name="entrega"]:checked');
      const pago = cont.querySelector('input[name="pago"]:checked');
      const envio = +(entrega ? entrega.dataset.costo : 0);
      const sub = AVTienda.total();
      const desc = pago && pago.value === 'transfer' ? Math.round(sub * 0.03) : 0;
      document.getElementById('resumen-lineas').innerHTML = carrito.map(l => {
        const p = AV.porId(l.id);
        const d = p.variantesDial.find(v => v.id === l.dial) || p.variantesDial[0];
        return `<div class="av-bolsa__linea" style="align-items:flex-start;padding:.8rem 0;border-bottom:var(--filo)">
          <span style="max-width:70%"><b style="font-family:var(--display);font-size:1.05rem">${p.nombre}</b>
          <small style="display:block;color:var(--tinta-fantasma);font-size:.68rem">${d.nombre} · ${AV.CORREAS[l.correa].nombre}${l.cant > 1 ? ` · ×${l.cant}` : ''}</small>
          ${l.grabado ? `<small style="display:block;color:var(--laton);font-family:var(--display);font-style:italic">«${l.grabado}»</small>` : ''}</span>
          <b class="av-mono">${AV.precioMXN(l.precio * l.cant)}</b></div>`;
      }).join('');
      document.getElementById('resumen-totales').innerHTML = `
        <div class="av-bolsa__linea" style="margin-top:1rem"><span>Subtotal</span><b class="av-mono">${AV.precioMXN(sub)}</b></div>
        <div class="av-bolsa__linea av-tenue"><span>Entrega</span><b class="av-mono">${envio ? AV.precioMXN(envio) : 'Sin costo'}</b></div>
        ${desc ? `<div class="av-bolsa__linea" style="color:var(--laton)"><span>Descuento por transferencia</span><b class="av-mono">−${AV.precioMXN(desc)}</b></div>` : ''}
        <div class="av-bolsa__linea" style="border-top:var(--filo);margin-top:.6rem;padding-top:.8rem"><span>Total</span><b class="av-mono" style="font-size:1.3rem">${AV.precioMXN(sub + envio - desc)}</b></div>`;
    }
    cont.addEventListener('change', totales);
    totales();

    /* --- Confirmación ----------------------------------------------------- */
    document.getElementById('form-pedido').onsubmit = e => {
      e.preventDefault();
      const f = e.target;
      const faltan = ['nombre', 'apellido', 'correo'].filter(n => !f[n].value.trim());
      if (faltan.length) { AVTienda.aviso('Nos falta tu ' + faltan[0] + '.'); f[faltan[0]].focus(); return; }

      const folio = 'AV-' + Date.now().toString(36).toUpperCase().slice(-6);
      const primera = AV.porId(carrito[0].id);
      document.querySelector('main').innerHTML = `<section class="av-marco av-gracias">
        <p class="av-t-eyebrow">Pedido ${folio}</p>
        <h1 class="av-t-display" style="margin:1rem 0">Gracias, ${f.nombre.value.trim()}.</h1>
        <p class="av-t-lead">Tu pieza entra hoy al banco de regulación.<br>Quince días de pruebas y sale con su carta de marcha firmada.</p>
        <div data-reloj="${primera.id}" data-correa="${carrito[0].correa}"></div>
        <p class="av-mono av-tenue" style="max-width:44ch;margin:0 auto 2rem">Te mandamos el detalle a ${f.correo.value.trim()}. Cualquier cosa, contesta ese correo: lo leemos nosotros, no un robot.</p>
        <a class="av-btn av-btn--laton" href="index.html">Volver al inicio</a>
      </section>`;
      AVTienda.estado.carrito.length = 0; AVTienda.guardar();
      AVMotor.montarTodos();
      scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  pintar();
});
