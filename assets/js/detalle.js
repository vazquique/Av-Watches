/* ==========================================================================
   AV WATCHES · Ficha del reloj
   --------------------------------------------------------------------------
   Lo que hace falta para decidir la compra queda a la vista: qué es, cuánto
   cuesta y cómo se ve. Todo lo demás (ficha técnica, talla, notas) vive en
   secciones plegadas, para que la página no abrume de entrada.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  const p = AV.porId(id) || AV.RELOJES[0];
  AVTienda.registrarVisto(p.id);

  document.title = `${p.marca} ${p.modelo} · AV Watches`;
  document.getElementById('miga-nom').textContent = `${p.marca} ${p.modelo}`;

  const nuevo = p.condicion === 'nuevo';
  const met = AV.METALES[p.caja.metal];
  const est = { dial: p.variantes[0], correa: p.correa, nota: '', lume: false, vista: AV.tieneFotos(p) ? 'fotos' : 'frente', real: false, horas: 0, foto: 0 };
  const extraCorrea = c => c === p.correa ? 0 : AV.CORREAS[c].tipo === 'metal' ? 2900 : 890;
  const precio = () => p.precio + est.dial.extra + extraCorrea(est.correa);
  const chip = hex => `<i style="background:${hex}"></i>`;
  const COMPL = { fecha: 'Fecha', gmt: 'Segundo huso', cronografo: 'Cronógrafo', 'fase-lunar': 'Fase lunar',
                  reserva: 'Reserva de marcha', 'segundero-pequeno': 'Segundero pequeño', mundo: 'Hora mundial' };

  /* ======================================================================
     Armado
     ====================================================================== */
  document.getElementById('ficha').innerHTML = `
    <div class="av-escaparate" id="escaparate">
      <div class="av-escaparate__lienzo" id="lienzo">
        <div id="pieza"></div>
        <div class="av-lupa" id="lupa" aria-hidden="true"><div class="av-lupa__int" id="lupa-int"></div></div>
      </div>

      <div class="av-vistas" role="tablist" aria-label="Cómo ver la pieza">
        ${AV.tieneFotos(p) ? '<button type="button" class="av-vista" data-vista="fotos" role="tab" aria-selected="true">Fotos</button>' : ''}
        <button type="button" class="av-vista" data-vista="frente" role="tab" aria-selected="${!AV.tieneFotos(p)}">${AV.tieneFotos(p) ? 'Dibujo' : 'Frente'}</button>
        <button type="button" class="av-vista" data-vista="perfil" role="tab" aria-selected="false">Perfil</button>
        <button type="button" class="av-vista" data-vista="muneca" role="tab" aria-selected="false">En tu muñeca</button>
      </div>

      <div class="av-herramientas">
        <button type="button" class="av-util" id="btn-real" aria-pressed="false">Tamaño real</button>
        <button type="button" class="av-util" id="btn-lume" aria-pressed="false">Apagar la luz</button>
        <button type="button" class="av-util" id="btn-tiempo" aria-pressed="false">Mover el tiempo</button>
      </div>
      <div id="panel-extra"></div>
    </div>

    <div>
      <header class="av-ficha__cab">
        <div class="av-ficha__ref">
          <b>${p.marca}</b>
          <span class="av-condicion ${nuevo ? '' : 'usado'}">${nuevo ? 'Nuevo' : 'Seminuevo'}</span>
          <span>${p.refFab}</span>
        </div>
        <h1 class="av-t-display">${p.modelo}</h1>
        <div class="av-ficha__precio">
          <b id="precio">${AV.precioMXN(precio())}</b>
          ${p.precioLista > p.precio ? `<s class="av-mono">${AV.precioMXN(p.precioLista)}</s>` : ''}
        </div>
        <p class="av-disponible ${p.stock <= 2 ? 'poco' : ''}"><i></i>
          ${p.stock === 1 ? 'Solo queda una' : `${p.stock} disponibles`} · envío gratis · ${p.incluye.toLowerCase()}</p>
      </header>

      <div class="av-config">
        <div class="av-config__grupo">
          <div class="av-config__cab"><h3>Color</h3><span id="dial-nom">${est.dial.nombre}</span></div>
          <div class="av-opciones" id="op-dial">
            ${p.variantes.map((v, i) => `<button type="button" class="av-opcion" data-dial="${i}" aria-pressed="${i === 0}"
              title="${v.nombre}">${chip(v.base)} ${v.nombre.split(' (')[0]}${v.extra ? ` <em>+${AV.precioMXN(v.extra)}</em>` : ''}</button>`).join('')}
          </div>
        </div>
        <div class="av-config__grupo">
          <div class="av-config__cab"><h3>Correa</h3><span id="correa-nom">${AV.CORREAS[p.correa].nombre}</span></div>
          <div class="av-opciones" id="op-correa">
            ${p.correasExtra.map(c => `<button type="button" class="av-opcion" data-correa="${c}" aria-pressed="${c === p.correa}">
              ${chip(AV.CORREAS[c].cuerpo)} ${AV.CORREAS[c].nombre}${c === p.correa ? '' : extraCorrea(c) ? ` <em>+${AV.precioMXN(extraCorrea(c))}</em>` : ''}</button>`).join('')}
          </div>
        </div>
      </div>

      <div class="av-comprar">
        <button type="button" class="av-btn av-btn--solido" id="btn-bolsa">A la bolsa · <span id="precio-btn">${AV.precioMXN(precio())}</span></button>
        <button type="button" class="av-icono-grande" id="btn-boveda" aria-pressed="${AVTienda.enBoveda(p.id)}" aria-label="Guardar en tu bóveda">${AVComp.ICONO.corazon}</button>
        <button type="button" class="av-icono-grande" id="btn-banco" aria-pressed="${AVTienda.enComparador(p.id)}" aria-label="Comparar">${AVComp.ICONO.banco}</button>
      </div>

      ${p.estado ? `<div class="av-estado"><h2 class="av-t-eyebrow">Estado de esta pieza</h2><p>${p.estado}</p></div>` : ''}

      <!-- Todo lo demás, plegado -->
      <div class="av-detalles">
        <details>
          <summary>Ficha técnica</summary>
          <table class="av-specs-tabla">
            <tbody>
              <tr><th>Movimiento</th><td>${p.calibre.nombre} · ${p.calibre.tipo}</td></tr>
              <tr><th>Caja</th><td>${met.nombre}, ${p.caja.diametro} × ${p.caja.altura} mm</td></tr>
              <tr><th>Cristal</th><td>${p.caja.cristal}</td></tr>
              <tr><th>Al agua</th><td>${p.caja.agua} metros</td></tr>
              <tr><th>${/cuarzo/.test(p.calibre.tipo) ? 'Autonomía' : 'Reserva'}</th><td>${
                p.calibre.reserva >= 8760 ? '~' + Math.round(p.calibre.reserva / 8760) + ' años por pila'
                : p.calibre.reserva >= 720 ? '~' + Math.round(p.calibre.reserva / 730) + ' meses a oscuras'
                : p.calibre.reserva + ' horas'}</td></tr>
              ${p.complicaciones.length ? `<tr><th>Complicaciones</th><td>${p.complicaciones.map(c => COMPL[c] || c).join(' · ')}</td></tr>` : ''}
              <tr><th>Incluye</th><td>${p.incluye}</td></tr>
              <tr><th>Garantía</th><td>${nuevo ? 'De la marca' : '6 meses sobre el movimiento'}</td></tr>
            </tbody>
          </table>
        </details>

        <details>
          <summary>Qué tiene de bueno</summary>
          <ul class="av-notas">${p.notas.map(n => `<li>${n}</li>`).join('')}</ul>
        </details>

        <details>
          <summary>¿Cómo te va a quedar?</summary>
          <div class="av-talla">
            <div class="av-talla__cab">
              <span class="av-mono" id="muneca-cm">17 cm de muñeca</span>
              <span class="av-mono av-tenue">${p.caja.diametro} × ${p.caja.altura} mm</span>
            </div>
            <input type="range" id="muneca" min="14" max="21" step="0.5" value="17" aria-label="Circunferencia de tu muñeca">
            <div class="av-muneca__regla av-mono"><span>14 cm</span><span>21 cm</span></div>
            <p class="av-muneca__veredicto" id="veredicto"></p>
            <a class="av-enlace" href="aprende-talla.html">Cómo medir tu muñeca →</a>
          </div>
        </details>
      </div>
    </div>`;

  /* ======================================================================
     Nodos, todos de una vez
     ====================================================================== */
  const $ = i => document.getElementById(i);
  const cont = $('pieza'), lupaInt = $('lupa-int'), escaparate = $('escaparate'),
        lienzo = $('lienzo'), lupa = $('lupa'), panelExtra = $('panel-extra'),
        btnReal = $('btn-real'), btnLume = $('btn-lume'), btnTiempo = $('btn-tiempo');

  /* ======================================================================
     Dibujo
     ====================================================================== */
  function dibujar() {
    const svg = AVMotor.svgReloj(p, { dial: est.dial, correa: est.correa });
    if (est.vista === 'fotos') {
      const fotos = AV.fotosDe(p);
      cont.innerHTML = `<figure class="av-galeria">
        <img src="${fotos[est.foto]}" alt="${p.marca} ${p.modelo}, foto ${est.foto + 1} de ${fotos.length}"
             width="1600" height="1600" loading="eager" decoding="async">
        ${fotos.length > 1 ? `<div class="av-galeria__minis">${fotos.map((f, i) =>
          `<button type="button" data-foto="${i}" aria-current="${i === est.foto}" aria-label="Foto ${i + 1}">
             <img src="${f}" alt="" width="160" height="160" loading="lazy" decoding="async"></button>`).join('')}</div>` : ''}
      </figure>`;
      cont.querySelectorAll('[data-foto]').forEach(bt => bt.onclick = () => { est.foto = +bt.dataset.foto; dibujar(); });
      /* Si una foto no carga, se cae al dibujo en vez de dejar el hueco. */
      const img = cont.querySelector('img');
      img.onerror = () => { est.vista = 'frente'; marcarVista(); dibujar(); };
      lupaInt.innerHTML = svg;
      AVMotor.refrescar();
      return;
    }
    if (est.vista === 'perfil') {
      cont.innerHTML = AVPerfil.svgPerfil(p, { correa: est.correa });
    } else if (est.vista === 'muneca') {
      cont.innerHTML = AVPerfil.svgMuneca(p, +($('muneca') || { value: 17 }).value).sup;
    } else {
      cont.innerHTML = svg;
      if (est.lume) cont.querySelector('svg').classList.add('lume');
    }
    lupaInt.innerHTML = svg;
    AVMotor.refrescar();
    aplicarEscala();
    aplicarTiempo();
    $('precio').textContent = AV.precioMXN(precio());
    $('precio-btn').textContent = AV.precioMXN(precio());
  }

  /* Tamaño real: el ancho en píxeles que corresponde a los milímetros de la
     pieza en ESTA pantalla, ya medida por quien mira. */
  function aplicarEscala() {
    const svgEl = cont.querySelector('svg');
    if (!svgEl) return;
    escaparate.classList.toggle('real', est.real);
    if (!est.real || est.vista === 'muneca') { svgEl.style.removeProperty('width'); svgEl.style.removeProperty('max-width'); return; }
    svgEl.style.width = (est.vista === 'perfil' ? AVEscala.anchoPerfil(p) : AVEscala.anchoFrente(p)) + 'px';
    svgEl.style.maxWidth = 'none';
  }

  function aplicarTiempo() {
    const svgEl = cont.querySelector('svg'), copia = lupaInt.querySelector('svg');
    const d = est.horas ? new Date(Date.now() + est.horas * 3600000) : null;
    [svgEl, copia].forEach(e => { if (!e) return; if (d) e.dataset.forzado = d.getTime(); else delete e.dataset.forzado; });
    AVMotor.pintar();
  }

  /* ======================================================================
     Controles
     ====================================================================== */
  function marcarVista() {
    document.querySelectorAll('[data-vista]').forEach(o => o.setAttribute('aria-selected', o.dataset.vista === est.vista));
    lienzo.classList.toggle('sin-lupa', est.vista !== 'frente');
    /* Lume, tiempo y tamaño real solo tienen sentido sobre el dibujo. */
    btnLume.disabled = btnTiempo.disabled = est.vista !== 'frente';
    btnReal.disabled = est.vista === 'fotos' || est.vista === 'muneca';
  }
  document.querySelectorAll('[data-vista]').forEach(b => b.onclick = () => {
    est.vista = b.dataset.vista;
    marcarVista();
    dibujar();
  });
  marcarVista();

  $('op-dial').onclick = e => {
    const b = e.target.closest('[data-dial]'); if (!b) return;
    est.dial = p.variantes[+b.dataset.dial];
    b.parentNode.querySelectorAll('.av-opcion').forEach(o => o.setAttribute('aria-pressed', o === b));
    $('dial-nom').textContent = est.dial.nombre;
    dibujar();
  };
  $('op-correa').onclick = e => {
    const b = e.target.closest('[data-correa]'); if (!b) return;
    est.correa = b.dataset.correa;
    b.parentNode.querySelectorAll('.av-opcion').forEach(o => o.setAttribute('aria-pressed', o === b));
    $('correa-nom').textContent = AV.CORREAS[est.correa].nombre;
    dibujar();
  };

  btnLume.onclick = () => {
    est.lume = !est.lume;
    btnLume.setAttribute('aria-pressed', est.lume);
    btnLume.textContent = est.lume ? 'Encender la luz' : 'Apagar la luz';
    escaparate.classList.toggle('lume', est.lume);
    const s = cont.querySelector('svg'); if (s) s.classList.toggle('lume', est.lume);
    if (est.lume && !p.dial.lume) AVTienda.aviso('Este modelo no trae luminiscencia.');
  };

  btnReal.onclick = () => {
    if (!AVEscala.estaCalibrada()) { AVEscala.abrir(ok => { est.real = !!ok; pintarPaneles(); dibujar(); }); return; }
    est.real = !est.real; pintarPaneles(); dibujar();
  };

  btnTiempo.onclick = () => {
    btnTiempo.dataset.abierto = btnTiempo.dataset.abierto ? '' : '1';
    btnTiempo.setAttribute('aria-pressed', !!btnTiempo.dataset.abierto);
    if (!btnTiempo.dataset.abierto) { est.horas = 0; aplicarTiempo(); }
    pintarPaneles();
  };

  /* Los paneles bajo el reloj solo aparecen cuando se piden. */
  function pintarPaneles() {
    btnReal.setAttribute('aria-pressed', est.real);
    let html = '';
    if (est.real) html += `<p class="av-real-aviso">A tamaño físico · ${p.caja.diametro} × ${p.caja.altura} mm
      <button type="button" id="recalibrar">volver a medir</button></p>`;
    if (btnTiempo.dataset.abierto) html += `<div class="av-tiempo">
      <div class="av-tiempo__cab"><span class="av-mono av-tenue">Adelanta o atrasa</span><b class="av-mono" id="tiempo-lectura"></b></div>
      <input type="range" id="tiempo-rango" min="-360" max="360" step="1" value="${est.horas}" aria-label="Horas de desfase">
      <div class="av-tiempo__pie av-mono"><span>−15 d</span><button type="button" id="tiempo-ahora">ahora</button><span>+15 d</span></div>
    </div>`;
    panelExtra.innerHTML = html;

    const rc = $('recalibrar');
    if (rc) rc.onclick = () => AVEscala.abrir(() => { pintarPaneles(); dibujar(); });
    const rango = $('tiempo-rango');
    if (rango) {
      const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
      const leer = () => {
        est.horas = +rango.value;
        const l = $('tiempo-lectura');
        if (!est.horas) l.textContent = 'ahora';
        else {
          const d = new Date(Date.now() + est.horas * 3600000);
          l.textContent = `${DIAS[d.getDay()]} ${d.getDate()} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }
        aplicarTiempo();
      };
      rango.oninput = leer;
      $('tiempo-ahora').onclick = () => { rango.value = 0; leer(); };
      leer();
    }
    aplicarEscala();
  }

  $('btn-boveda').onclick = e => e.currentTarget.setAttribute('aria-pressed', AVTienda.boveda(p.id));
  $('btn-banco').onclick = e => e.currentTarget.setAttribute('aria-pressed', AVTienda.comparar(p.id));
  $('btn-bolsa').onclick = () => AVTienda.agregar({
    id: p.id, dial: est.dial.id, correa: est.correa, grabado: est.nota, precio: precio()
  });

  /* --- Talla ------------------------------------------------------------- */
  const slider = $('muneca'), veredicto = $('veredicto');
  function talla() {
    const cm = +slider.value;
    const m = AVPerfil.medidasMuneca(cm);
    $('muneca-cm').textContent = cm + ' cm de muñeca';
    const v = AVPerfil.veredictoTalla(p.caja.diametro, m.ancho);
    veredicto.innerHTML = v.txt;
    veredicto.dataset.nivel = v.nivel;
    if (est.vista === 'muneca') dibujar();
  }
  slider.oninput = talla; talla();

  /* --- Lupa, solo sobre el dial ------------------------------------------ */
  const ZOOM = 2.6, R = 75;
  lienzo.addEventListener('pointermove', e => {
    if (est.vista !== 'frente' || e.pointerType === 'touch' || matchMedia('(hover: none)').matches) return;
    const r = lienzo.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    lupa.classList.add('viva');
    lupa.style.left = (x - R) + 'px'; lupa.style.top = (y - R) + 'px';
    lupaInt.style.width = r.width + 'px';
    lupaInt.style.transform = `translate(${R - x * ZOOM}px, ${R - y * ZOOM}px) scale(${ZOOM})`;
  });
  lienzo.addEventListener('pointerleave', () => lupa.classList.remove('viva'));

  dibujar();
  pintarPaneles();

  /* --- Parecidos --------------------------------------------------------- */
  const cerca = AV.RELOJES.filter(r => r.id !== p.id)
    .map(r => ({ r, d: (r.coleccion === p.coleccion ? 0 : 3) + (r.estilo === p.estilo ? 0 : 2) + Math.abs(Math.log(r.precio) - Math.log(p.precio)) * 2 }))
    .sort((a, b) => a.d - b.d).slice(0, 4).map(x => x.r);
  AVComp.pintarVitrina(document.getElementById('relacionadas'), cerca);
});
