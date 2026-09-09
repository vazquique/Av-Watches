/* ==========================================================================
   AV WATCHES · Ficha de la pieza
   Configurador que redibuja el reloj en vivo, lupa de relojero, modo lume
   y prueba de talla en muñeca a escala real de milímetros.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  const p = AV.porId(id) || AV.RELOJES[0];
  AVTienda.registrarVisto(p.id);

  document.title = `${p.marca} ${p.modelo} · AV Watches`;
  document.getElementById('miga-nom').textContent = `${p.marca} ${p.modelo}`;

  /* Estado del configurador. */
  const est = { dial: p.variantes[0], correa: p.correa, grabado: '', lume: false, vista: 'frente', real: false };
  /* Cambiar la correa que trae de fábrica se cobra como accesorio. */
  const extraCorrea = c => c === p.correa ? 0 : AV.CORREAS[c].tipo === 'metal' ? 2900 : 890;
  const precio = () => p.precio + est.dial.extra + extraCorrea(est.correa);
  const nuevo = p.condicion === 'nuevo';

  const metal = AV.METALES[p.caja.metal];
  const chip = hex => `<i style="background:${hex}"></i>`;

  /* ----------------------------------------------------------------------
     Armado de la página
     ---------------------------------------------------------------------- */
  document.getElementById('ficha').innerHTML = `
    <div class="av-escaparate" id="escaparate">
      <div class="av-escaparate__lienzo" id="lienzo">
        <div id="pieza"></div>
        <div class="av-lupa" id="lupa" aria-hidden="true"><div class="av-lupa__int" id="lupa-int"></div></div>
      </div>
      <div class="av-vistas" role="tablist" aria-label="Cómo ver la pieza">
        <button type="button" class="av-vista" data-vista="frente" role="tab" aria-selected="true">De frente</button>
        <button type="button" class="av-vista" data-vista="perfil" role="tab" aria-selected="false">De perfil</button>
      </div>
      <div class="av-escaparate__util">
        <button type="button" class="av-util" id="btn-real" aria-pressed="false"><i></i> Tamaño real</button>
        <button type="button" class="av-util" id="btn-lume" aria-pressed="false"><i></i> Apagar la luz</button>
        <button type="button" class="av-util" id="btn-boveda" aria-pressed="${AVTienda.enBoveda(p.id)}"><i></i> Guardar en bóveda</button>
        <button type="button" class="av-util" id="btn-banco" aria-pressed="${AVTienda.enComparador(p.id)}"><i></i> Comparar</button>
      </div>
      <div id="real-aviso"></div>

      <!-- Mover el tiempo: para ver la fase lunar, la fecha, el segundo huso
           y cómo se ve la pieza de noche. -->
      <div class="av-tiempo" id="tiempo">
        <div class="av-tiempo__cab">
          <h3 class="av-t-eyebrow">Mueve el tiempo</h3>
          <b class="av-mono" id="tiempo-lectura"></b>
        </div>
        <input type="range" id="tiempo-rango" min="-360" max="360" step="1" value="0"
               aria-label="Adelantar o atrasar el reloj, en horas">
        <div class="av-tiempo__pie">
          <span class="av-mono">−15 días</span>
          <button type="button" class="av-tiempo__ahora" id="tiempo-ahora">volver a ahora</button>
          <span class="av-mono">+15 días</span>
        </div>
        <p class="av-tiempo__nota av-mono" id="tiempo-nota"></p>
      </div>
      <p class="av-mono av-tenue" style="text-align:center;margin:.9rem 0 0;font-size:.62rem">
        Ilustración a escala del modelo · marca la hora real de tu equipo · pasa el cursor para la lupa
      </p>
    </div>

    <div>
      <header class="av-ficha__cab">
        <div class="av-ficha__ref">
          <b>${p.marca}</b>
          <span class="av-condicion ${nuevo ? '' : 'usado'}">${nuevo ? 'Nuevo · sellado' : 'Seminuevo'}</span>
          <span>Ref. ${p.refFab}</span>
        </div>
        <h1 class="av-t-display">${p.modelo}</h1>
        <p class="av-t-lead" style="margin-top:.8rem">${p.lema}</p>
        <div class="av-ficha__precio">
          <b id="precio">${AV.precioMXN(precio())}</b>
          ${p.precioLista > p.precio ? `<s class="av-mono">${AV.precioMXN(p.precioLista)}</s>` : ''}
          <span>MXN · envío asegurado incluido</span>
        </div>
        <p class="av-disponible ${p.stock <= 2 ? 'poco' : ''}"><i></i>
          ${p.stock === 1 ? 'Solo tengo una' : `${p.stock} disponibles`} ·
          sale al día siguiente hábil · ${p.incluye}</p>
        ${p.estado ? `<div class="av-estado"><h2 class="av-t-eyebrow">Estado de esta pieza</h2><p>${p.estado}</p></div>` : ''}
      </header>

      <div class="av-config">
        <div class="av-config__grupo">
          <div class="av-config__cab"><h3>Color · referencia</h3><span id="dial-nom">${est.dial.nombre}</span></div>
          <div class="av-opciones" id="op-dial">
            ${p.variantes.map((v, i) => `<button type="button" class="av-opcion" data-dial="${i}" aria-pressed="${i === 0}">
              ${chip(v.base)} ${v.nombre}${v.extra ? ` <em>+${AV.precioMXN(v.extra)}</em>` : ''}</button>`).join('')}
          </div>
          <p class="av-config__nota">Son referencias distintas del mismo modelo. Si la que quieres no está en existencia, la consigo en unos días.</p>
        </div>

        <div class="av-config__grupo">
          <div class="av-config__cab"><h3>Correa</h3><span id="correa-nom">${AV.CORREAS[p.correa].nombre}</span></div>
          <div class="av-opciones" id="op-correa">
            ${p.correasExtra.map(c => `<button type="button" class="av-opcion" data-correa="${c}" aria-pressed="${c === p.correa}">
              ${chip(AV.CORREAS[c].cuerpo)} ${AV.CORREAS[c].nombre}${c === p.correa ? ' <em>de fábrica</em>' : extraCorrea(c) ? ` <em>+${AV.precioMXN(extraCorrea(c))}</em>` : ''}</button>`).join('')}
          </div>
          <p class="av-config__nota">Viene con la correa de fábrica. Si eliges otra, te la monto antes de enviártelo y la original va en la caja.</p>
        </div>

        <div class="av-config__grupo av-grabado">
          <div class="av-config__cab"><h3>¿Algo que deba saber?</h3><span>Opcional</span></div>
          <input type="text" id="grabado" maxlength="80" placeholder="Talla de muñeca, si es regalo, cuándo lo necesitas…">
          <div class="av-grabado__pie"><span>Lo leo yo antes de preparar el envío</span><span><b id="grabado-n">0</b>/80</span></div>
        </div>
      </div>

      <div class="av-comprar">
        <button type="button" class="av-btn av-btn--solido" id="btn-bolsa">Agregar a la bolsa · <span id="precio-btn">${AV.precioMXN(precio())}</span></button>
        <a class="av-btn" href="servicio.html#gdl">Verlo en persona</a>
      </div>

      <!-- Prueba de talla -->
      <section class="av-muneca">
        <div class="av-config__cab"><h3 style="font-family:var(--mono);font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;color:var(--laton)">¿Cómo te va a quedar?</h3>
          <span id="muneca-cm">17 cm de muñeca</span></div>
        <div class="av-muneca__vista">
          <div class="av-muneca__brazo" id="brazo"></div>
          <div class="av-muneca__caja" id="caja-vista"><span>${p.caja.diametro} mm</span></div>
        </div>
        <input type="range" id="muneca" min="14" max="21" step="0.5" value="17" aria-label="Circunferencia de tu muñeca en centímetros" style="width:100%">
        <div class="av-muneca__regla"><span>14 cm</span><span>17.5 cm</span><span>21 cm</span></div>
        <p class="av-muneca__veredicto" id="veredicto" style="margin:.8rem 0 0"></p>
      </section>

      <!-- Hoja de especificaciones -->
      <section class="av-specs">
        <table>
          <caption>Ficha técnica · ${p.marca} ${p.refFab}</caption>
          <tbody>
            <tr><th scope="row">Marca y modelo</th><td>${p.marca} ${p.modelo}</td></tr>
            <tr><th scope="row">Condición</th><td>${nuevo ? 'Nuevo, sin uso' : 'Seminuevo · ' + p.anio}</td></tr>
            <tr><th scope="row">Movimiento</th><td>${p.calibre.nombre} · ${p.calibre.tipo}</td></tr>
            <tr><th scope="row">Frecuencia</th><td>${p.calibre.frecuencia}</td></tr>
            ${p.calibre.rubies ? `<tr><th scope="row">Rubíes</th><td>${p.calibre.rubies}</td></tr>` : ''}
            <tr><th scope="row">${/cuarzo/.test(p.calibre.tipo) ? 'Autonomía' : 'Reserva de marcha'}</th><td>${p.calibre.reserva >= 8760 ? Math.round(p.calibre.reserva / 8760) + ' años por pila (aprox.)' : p.calibre.reserva >= 720 ? Math.round(p.calibre.reserva / 730) + ' meses a oscuras' : p.calibre.reserva + ' horas'}</td></tr>
            <tr><th scope="row">Caja</th><td>${metal.nombre}, ${p.caja.diametro} × ${p.caja.altura} mm</td></tr>
            <tr><th scope="row">Cristal</th><td>${p.caja.cristal}</td></tr>
            <tr><th scope="row">Resistencia al agua</th><td>${p.caja.agua} metros</td></tr>
            <tr><th scope="row">Complicaciones</th><td>${p.complicaciones.length ? p.complicaciones.map(c => ({ fecha: 'Fecha', gmt: 'Segundo huso horario', cronografo: 'Cronógrafo', 'fase-lunar': 'Fase lunar', reserva: 'Reserva de marcha', 'segundero-pequeno': 'Segundero pequeño', mundo: 'Hora mundial' }[c] || c)).join(' · ') : 'Ninguna, a propósito'}</td></tr>
            <tr><th scope="row">Qué incluye</th><td>${p.incluye}</td></tr>
            <tr><th scope="row">Garantía</th><td>${nuevo ? 'De la marca, según lo que incluye' : '6 meses de mi parte sobre el movimiento'}</td></tr>
          </tbody>
        </table>
        <div class="av-grosor" id="perfil-nota" hidden>
          <h3 class="av-t-eyebrow">Sobre el grosor</h3>
          <p>${AVPerfil.veredictoGrosor(p.caja.altura).txt}</p>
          <p class="av-mono av-tenue">${p.caja.altura} mm de alto · cristal ${p.caja.cristal.toLowerCase()}</p>
        </div>
        <ol class="av-notas">${p.notas.map(n => `<li>${n}</li>`).join('')}</ol>
      </section>
    </div>`;

  /* ----------------------------------------------------------------------
     Dibujo y redibujo de la pieza
     ---------------------------------------------------------------------- */
  /* Todos los nodos de una vez, antes de cualquier función que los toque. */
  const $ = id => document.getElementById(id);
  const cont = $('pieza'), lupaInt = $('lupa-int'), escaparate = $('escaparate'),
        lienzo = $('lienzo'), lupa = $('lupa'),
        btnReal = $('btn-real'), avisoReal = $('real-aviso'), btnLume = $('btn-lume'),
        rango = $('tiempo-rango'), lectura = $('tiempo-lectura'), notaT = $('tiempo-nota'),
        panelTiempo = $('tiempo');

  function dibujar() {
    const svg = AVMotor.svgReloj(p, { dial: est.dial, correa: est.correa });
    if (est.vista === 'perfil') {
      cont.innerHTML = AVPerfil.svgPerfil(p, { correa: est.correa });
    } else {
      cont.innerHTML = svg;
      if (est.lume) cont.querySelector('svg').classList.add('lume');
    }
    lupaInt.innerHTML = svg;   /* la copia de la lupa también corre: si no, las
                                  agujas magnificadas marcarían otra hora */
    AVMotor.refrescar();
    aplicarEscala();
    if (rango) moverTiempo();
    document.getElementById('precio').textContent = AV.precioMXN(precio());
    document.getElementById('precio-btn').textContent = AV.precioMXN(precio());
  }

  /* Tamaño real: se fija el ancho en píxeles que corresponde a los
     milímetros de la pieza en ESTA pantalla, ya medida por el visitante. */
  function aplicarEscala() {
    const svgEl = cont.querySelector('svg');
    if (!svgEl) return;
    escaparate.classList.toggle('real', est.real);
    if (!est.real) { svgEl.style.removeProperty('width'); svgEl.style.removeProperty('max-width'); return; }
    const ancho = est.vista === 'perfil' ? AVEscala.anchoPerfil(p) : AVEscala.anchoFrente(p);
    svgEl.style.width = ancho + 'px';
    svgEl.style.maxWidth = 'none';
  }

  dibujar();

  /* --- Configurador ------------------------------------------------------ */
  document.getElementById('op-dial').onclick = e => {
    const b = e.target.closest('[data-dial]'); if (!b) return;
    est.dial = p.variantes[+b.dataset.dial];
    b.parentNode.querySelectorAll('.av-opcion').forEach(o => o.setAttribute('aria-pressed', o === b));
    document.getElementById('dial-nom').textContent = est.dial.nombre;
    dibujar();
  };
  document.getElementById('op-correa').onclick = e => {
    const b = e.target.closest('[data-correa]'); if (!b) return;
    est.correa = b.dataset.correa;
    b.parentNode.querySelectorAll('.av-opcion').forEach(o => o.setAttribute('aria-pressed', o === b));
    document.getElementById('correa-nom').textContent = AV.CORREAS[est.correa].nombre;
    dibujar();
  };

  const gr = document.getElementById('grabado');
  gr.oninput = () => { est.grabado = gr.value.trim(); document.getElementById('grabado-n').textContent = gr.value.length; };

  /* --- Modo lume: se apaga la luz del cuarto ----------------------------- */
  btnLume.onclick = () => {
    est.lume = !est.lume;
    btnLume.setAttribute('aria-pressed', est.lume);
    btnLume.innerHTML = `<i></i> ${est.lume ? 'Encender la luz' : 'Apagar la luz'}`;
    escaparate.classList.toggle('lume', est.lume);
    cont.querySelector('svg').classList.toggle('lume', est.lume);
    if (est.lume && !p.dial.lume) AVTienda.aviso('Este modelo no trae luminiscencia: es un reloj de vestir.');
  };

  /* --- Cambiar entre frente y perfil ------------------------------------- */
  document.querySelectorAll('[data-vista]').forEach(b => b.onclick = () => {
    est.vista = b.dataset.vista;
    document.querySelectorAll('[data-vista]').forEach(o => o.setAttribute('aria-selected', o === b));
    /* La lupa solo tiene sentido sobre el dial. */
    lienzo.classList.toggle('sin-lupa', est.vista === 'perfil');
    dibujar();
    pintarAvisoPerfil();
  });

  function pintarAvisoPerfil() {
    const zona = document.getElementById('perfil-nota');
    if (!zona) return;
    zona.hidden = est.vista !== 'perfil';
  }

  /* --- Tamaño real ------------------------------------------------------- */
  function pintarReal() {
    btnReal.setAttribute('aria-pressed', est.real);
    avisoReal.innerHTML = est.real
      ? `<p class="av-real-aviso">A tamaño físico en tu pantalla · ${p.caja.diametro} × ${p.caja.altura} mm
         <button type="button" id="recalibrar">volver a medir</button></p>`
      : '';
    const rc = document.getElementById('recalibrar');
    if (rc) rc.onclick = () => AVEscala.abrir(() => { pintarReal(); dibujar(); });
    aplicarEscala();
  }
  btnReal.onclick = () => {
    if (!AVEscala.estaCalibrada()) {
      AVEscala.abrir(ok => { est.real = !!ok; pintarReal(); dibujar(); });
      return;
    }
    est.real = !est.real; pintarReal(); dibujar();
  };

  /* --- Mover el tiempo ---------------------------------------------------
     El reloj sigue caminando, pero desde la hora que el visitante elija.
     Así se ve la fase lunar a lo largo del mes, el salto de fecha a
     medianoche y cómo queda la pieza de noche.                          */
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function moverTiempo() {
    const horas = +rango.value;
    const svgEl = cont.querySelector('svg');
    const copia = lupaInt.querySelector('svg');
    if (!horas) {
      [svgEl, copia].forEach(e => e && delete e.dataset.forzado);
      lectura.textContent = 'ahora';
      notaT.textContent = 'El reloj marca la hora real de tu equipo.';
      panelTiempo.classList.remove('movido');
    } else {
      const d = new Date(Date.now() + horas * 3600000);
      [svgEl, copia].forEach(e => { if (e) e.dataset.forzado = d.getTime(); });
      const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
      lectura.textContent = `${DIAS[d.getDay()]} ${d.getDate()} · ${hh}:${mm}`;
      const dias = Math.round(horas / 24);
      notaT.textContent = (horas > 0 ? '+' : '') + (Math.abs(horas) >= 24 ? `${dias} día${Math.abs(dias) === 1 ? '' : 's'}` : `${horas} h`) +
        (p.complicaciones.includes('fase-lunar') ? ' · mira cómo cambia la luna' :
         p.complicaciones.includes('fecha') ? ' · la fecha salta a medianoche' : '');
      panelTiempo.classList.add('movido');
      /* De noche, ofrecer el lume sin imponerlo. */
      const h = d.getHours();
      if (p.dial.lume && (h >= 20 || h < 6) && !est.lume) notaT.textContent += ' · prueba apagar la luz';
    }
    AVMotor.pintar();
  }
  rango.addEventListener('input', moverTiempo);
  document.getElementById('tiempo-ahora').onclick = () => { rango.value = 0; moverTiempo(); };
  moverTiempo();

  /* --- Bóveda y banco ---------------------------------------------------- */
  document.getElementById('btn-boveda').onclick = e => e.currentTarget.setAttribute('aria-pressed', AVTienda.boveda(p.id));
  document.getElementById('btn-banco').onclick = e => e.currentTarget.setAttribute('aria-pressed', AVTienda.comparar(p.id));

  /* --- Lupa de relojero -------------------------------------------------- */
  const ZOOM = 2.6, R = 75;   /* R = mitad del diámetro de .av-lupa */
  lienzo.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || matchMedia('(hover: none)').matches) return;
    if (est.vista === 'perfil') return;
    const r = lienzo.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    lupa.classList.add('viva');
    lupa.style.left = (x - R) + 'px';
    lupa.style.top = (y - R) + 'px';
    lupaInt.style.width = r.width + 'px';
    lupaInt.style.transform = `translate(${R - x * ZOOM}px, ${R - y * ZOOM}px) scale(${ZOOM})`;
  });
  lienzo.addEventListener('pointerleave', () => lupa.classList.remove('viva'));

  /* --- Prueba de talla: milímetros de verdad sobre la muñeca ------------- */
  const slider = document.getElementById('muneca'), brazo = document.getElementById('brazo');
  const cajaVista = document.getElementById('caja-vista'), veredicto = document.getElementById('veredicto');
  const PX_MM = 2.4;
  function talla() {
    const cm = +slider.value;
    const anchoMuneca = cm * 10 / Math.PI;          /* de circunferencia a diámetro */
    brazo.style.width = (anchoMuneca * PX_MM) + 'px';
    cajaVista.style.width = cajaVista.style.height = (p.caja.diametro * PX_MM) + 'px';
    document.getElementById('muneca-cm').textContent = cm + ' cm de muñeca';
    const razon = p.caja.diametro / anchoMuneca;
    veredicto.innerHTML = razon < 0.62 ? 'Se te va a ver discreto. Elegante, pero discreto.'
      : razon <= 0.78 ? '<span class="av-laton">Proporción justa.</span> Así se ve un reloj bien puesto.'
      : razon <= 0.88 ? 'Va a llenarte la muñeca. Si te gusta que se note, adelante.'
      : 'Te queda grande. Mira una caja de 38 o 39 mm.';
  }
  slider.oninput = talla; talla();

  /* --- A la bolsa -------------------------------------------------------- */
  document.getElementById('btn-bolsa').onclick = () => AVTienda.agregar({
    id: p.id, dial: est.dial.id, correa: est.correa, grabado: est.grabado, precio: precio()
  });

  /* --- Del mismo taller -------------------------------------------------- */
  const cerca = AV.RELOJES
    .filter(r => r.id !== p.id)
    .map(r => ({ r, d: (r.coleccion === p.coleccion ? 0 : 3) + (r.estilo === p.estilo ? 0 : 2) + Math.abs(Math.log(r.precio) - Math.log(p.precio)) * 2 }))
    .sort((a, b) => a.d - b.d).slice(0, 4).map(x => x.r);
  AVComp.pintarVitrina(document.getElementById('relacionadas'), cerca);
});
