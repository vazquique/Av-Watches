/* ==========================================================================
   AV WATCHES · Estado de la tienda y armazón común
   Carrito, bóveda de deseos, comparador, tema día/noche, buscador y el
   encabezado/pie que comparten todas las páginas.
   ========================================================================== */
(function (global) {
  'use strict';

  const LLAVE = 'av-watches-v1';
  const rutaBase = location.pathname.includes('/paginas/') ? '../' : './';

  /* --- Persistencia ------------------------------------------------------ */
  const vacio = { carrito: [], boveda: [], comparador: [], tema: null, visto: [] };
  let S = vacio;
  try { S = Object.assign({}, vacio, JSON.parse(localStorage.getItem(LLAVE) || '{}')); } catch (e) { S = Object.assign({}, vacio); }

  function guardar() {
    try { localStorage.setItem(LLAVE, JSON.stringify(S)); } catch (e) { /* modo privado: la sesión sigue viva en memoria */ }
    pintarContadores();
    document.dispatchEvent(new CustomEvent('av:cambio', { detail: S }));
  }

  /* --- Carrito ----------------------------------------------------------- */
  function lineaId(l) { return [l.id, l.dial, l.correa, l.grabado || ''].join('|'); }

  function agregar(linea) {
    const existente = S.carrito.find(l => lineaId(l) === lineaId(linea));
    if (existente) existente.cant += (linea.cant || 1);
    else S.carrito.push(Object.assign({ cant: 1 }, linea));
    guardar();
    aviso(`${AV.nombreCompleto(AV.porId(linea.id))} · en la bolsa`, 'Ver bolsa', abrirBolsa);
    abrirBolsa();
  }
  function quitar(idx) { S.carrito.splice(idx, 1); guardar(); pintarBolsa(); }
  function cantidad(idx, delta) {
    const l = S.carrito[idx]; if (!l) return;
    l.cant = Math.max(1, Math.min(5, l.cant + delta));
    guardar(); pintarBolsa();
  }
  const total = () => S.carrito.reduce((s, l) => s + l.precio * l.cant, 0);
  const piezas = () => S.carrito.reduce((s, l) => s + l.cant, 0);

  /* --- Bóveda (lista de deseos) ------------------------------------------ */
  function boveda(id) {
    const i = S.boveda.indexOf(id);
    if (i >= 0) { S.boveda.splice(i, 1); aviso('Fuera de la bóveda'); }
    else { S.boveda.push(id); aviso(`${AV.nombreCompleto(AV.porId(id))} · guardado en tu bóveda`); }
    guardar();
    return S.boveda.includes(id);
  }
  const enBoveda = id => S.boveda.includes(id);

  /* --- Comparador (hasta tres piezas) ------------------------------------ */
  function comparar(id) {
    const i = S.comparador.indexOf(id);
    if (i >= 0) { S.comparador.splice(i, 1); }
    else {
      if (S.comparador.length >= 3) { aviso('El comparador solo aguanta tres relojes'); return false; }
      S.comparador.push(id);
      aviso(`${AV.nombreCompleto(AV.porId(id))} · a comparar (${S.comparador.length}/3)`, 'Ver', () => location.href = rutaBase + 'comparar.html');
    }
    guardar();
    return S.comparador.includes(id);
  }
  const enComparador = id => S.comparador.includes(id);

  /* --- Historial de piezas vistas ---------------------------------------- */
  function registrarVisto(id) {
    S.visto = [id].concat(S.visto.filter(v => v !== id)).slice(0, 6);
    guardar();
  }

  /* --- Tema: complicación día / noche ------------------------------------ */
  function tema(valor) {
    const t = valor || S.tema || 'noche';
    document.documentElement.setAttribute('data-tema', t);
    S.tema = t; guardar();
    const b = document.getElementById('av-tema');
    if (b) b.setAttribute('aria-label', t === 'noche' ? 'Cambiar a modo día' : 'Cambiar a modo noche');
  }

  /* --- Avisos ------------------------------------------------------------ */
  let tAviso;
  function aviso(texto, accionTxt, accionFn) {
    let el = document.querySelector('.av-aviso');
    if (!el) { el = document.createElement('div'); el.className = 'av-aviso'; document.body.appendChild(el); }
    el.innerHTML = `<span class="av-aviso__punto"></span><span>${texto}</span>` +
      (accionTxt ? `<button type="button" class="av-aviso__accion">${accionTxt}</button>` : '');
    if (accionFn) el.querySelector('.av-aviso__accion').onclick = () => { accionFn(); el.classList.remove('visible'); };
    requestAnimationFrame(() => el.classList.add('visible'));
    clearTimeout(tAviso); tAviso = setTimeout(() => el.classList.remove('visible'), 4200);
  }

  /* ======================================================================
     ARMAZÓN: encabezado, bolsa lateral, buscador y pie
     ====================================================================== */
  function montarArmazon() {
    const r = rutaBase;
    const nav = [
      ['catalogo.html', 'Catálogo'],
      ['guia.html', 'Guíame'],
      ['aprende.html', 'Aprende'],
      ['servicio.html', 'Ayuda']
    ];
    const activa = p => location.pathname.endsWith(p) ? ' aria-current="page"' : '';

    document.body.insertAdjacentHTML('afterbegin', `
    <div class="av-dia-barra" aria-hidden="true"><i></i></div>
    <a class="av-saltar" href="#principal">Saltar al contenido</a>
    <header class="av-cabeza">
      <div class="av-cabeza__int">
        <a class="av-logo" href="${r}index.html" aria-label="AV Watches, inicio">
          <span class="av-logo__marca">AV</span>
          <span class="av-logo__txt">WATCHES<em>Relojes · Guadalajara</em></span>
        </a>
        <nav class="av-nav" aria-label="Principal">
          ${nav.map(([h, t]) => `<a href="${r}${h}"${activa(h)}>${t}</a>`).join('')}
        </nav>
        <div class="av-acciones">
          <time class="av-hora-local" id="av-hora" aria-label="Hora local"></time>
          <button type="button" class="av-icono av-icono--menu" id="av-menu-btn" aria-label="Abrir el menú" aria-expanded="false">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16"/></svg>
          </button>
          <button type="button" class="av-icono" id="av-buscar-btn" aria-label="Buscar en el catálogo" title="Buscar (⌘K)">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5 18 18"/></svg>
          </button>
          <button type="button" class="av-icono" id="av-tema" aria-label="Cambiar tema">
            <svg viewBox="0 0 20 20" aria-hidden="true" class="av-ico-noche"><path d="M16 12.5A7 7 0 0 1 7.5 4a7 7 0 1 0 8.5 8.5Z"/></svg>
            <svg viewBox="0 0 20 20" aria-hidden="true" class="av-ico-dia"><circle cx="10" cy="10" r="4"/><g><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.6 3.6l1.4 1.4M15 15l1.4 1.4M16.4 3.6 15 5M5 15l-1.4 1.4"/></g></svg>
          </button>
          <a class="av-icono" href="${r}comparar.html" aria-label="Comparador">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 16V7M10 16V4M17 16v-6"/><path d="M1 18h18"/></svg>
            <b class="av-cuenta" data-cuenta="comparador"></b>
          </a>
          <a class="av-icono" href="${r}boveda.html" aria-label="Tu bóveda">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17S2.5 12.4 2.5 7.4A3.9 3.9 0 0 1 10 5.6a3.9 3.9 0 0 1 7.5 1.8C17.5 12.4 10 17 10 17Z"/></svg>
            <b class="av-cuenta" data-cuenta="boveda"></b>
          </a>
          <button type="button" class="av-icono av-icono--bolsa" id="av-bolsa-btn" aria-label="Tu bolsa">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12l-1 12H5L4 6Z"/><path d="M7 6V4.5a3 3 0 0 1 6 0V6"/></svg>
            <b class="av-cuenta" data-cuenta="carrito"></b>
          </button>
        </div>
      </div>
    </header>

    <div class="av-velo" id="av-velo" hidden></div>

    <aside class="av-menu" id="av-menu" aria-hidden="true" aria-label="Menú">
      <div class="av-menu__cabeza">
        <span class="av-t-eyebrow">Menú</span>
        <button type="button" class="av-cerrar" id="av-menu-cerrar" aria-label="Cerrar el menú">Cerrar</button>
      </div>
      <div class="av-menu__cuerpo">
        <nav class="av-menu__principal" aria-label="Secciones">
          ${nav.map(([h, t]) => `<a href="${r}${h}">${t}</a>`).join('')}
        </nav>

        <div class="av-menu__grupo">
          <h3>Por dónde empezar</h3>
          ${AV.COLECCIONES.map(c => `<a href="${r}catalogo.html?coleccion=${encodeURIComponent(c.id)}">${c.id}
            <em>${AV.RELOJES.filter(x => x.coleccion === c.id).length}</em></a>`).join('')}
        </div>

        <div class="av-menu__grupo">
          <h3>Marcas</h3>
          <div class="av-menu__marcas">
            ${AV.MARCAS.map(m => `<a href="${r}catalogo.html?marca=${encodeURIComponent(m)}">${m}</a>`).join('')}
          </div>
        </div>

        <div class="av-menu__grupo">
          <h3>Lo tuyo</h3>
          <a href="${r}boveda.html">Tu bóveda <em data-cuenta="boveda"></em></a>
          <a href="${r}comparar.html">Comparar <em data-cuenta="comparador"></em></a>
          <a href="${r}casa.html">Sobre AV</a>
        </div>

        <ul class="av-menu__datos av-mono">
          <li>Envío asegurado gratis</li>
          <li>7 días para devolver</li>
          <li>Entrega en mano en Guadalajara</li>
          <li>Meses sin intereses</li>
        </ul>
      </div>
    </aside>

    <aside class="av-bolsa" id="av-bolsa" aria-hidden="true" aria-label="Tu bolsa">
      <div class="av-bolsa__cabeza">
        <h2 class="av-t-eyebrow">Tu bolsa</h2>
        <button type="button" class="av-cerrar" id="av-bolsa-cerrar" aria-label="Cerrar la bolsa">Cerrar</button>
      </div>
      <div class="av-bolsa__cuerpo" id="av-bolsa-cuerpo"></div>
      <div class="av-bolsa__pie" id="av-bolsa-pie"></div>
    </aside>

    <div class="av-buscador" id="av-buscador" hidden>
      <div class="av-buscador__caja" role="dialog" aria-modal="true" aria-label="Buscar en el catálogo">
        <input type="search" id="av-buscar-input" placeholder="Busca por marca, modelo, referencia…" autocomplete="off" spellcheck="false">
        <div class="av-buscador__res" id="av-buscar-res"></div>
        <div class="av-buscador__pie"><kbd>↑</kbd><kbd>↓</kbd> navegar · <kbd>Enter</kbd> abrir · <kbd>Esc</kbd> cerrar</div>
      </div>
    </div>`);

    document.body.insertAdjacentHTML('beforeend', `
    <footer class="av-pie">
      <div class="av-pie__marca">
        <span class="av-pie__logo">AV</span>
        <p class="av-t-lead">El tiempo tiene dueño.</p>
        <p class="av-pie__nota">Tienda de relojes nuevos y seminuevos. Envío asegurado a toda la República y entrega en persona si andas por Guadalajara. Cada pieza se revisa, se fotografía y se describe tal cual está.</p>
      </div>
      <nav class="av-pie__cols" aria-label="Pie de página">
        <div><h3>Catálogo</h3>${AV.COLECCIONES.map(c => `<a href="${r}catalogo.html?coleccion=${encodeURIComponent(c.id)}">${c.id}</a>`).join('')}<a href="${r}catalogo.html">Ver todo</a></div>
        <div><h3>Marcas</h3>${AV.MARCAS.slice(0, 5).map(m => `<a href="${r}catalogo.html?marca=${encodeURIComponent(m)}">${m}</a>`).join('')}<a href="${r}catalogo.html">Todas las marcas</a></div>
        <div><h3>Aprende</h3><a href="${r}aprende-movimientos.html">Automático o cuarzo</a><a href="${r}aprende-talla.html">Qué talla te queda</a><a href="${r}aprende-cuidados.html">Cómo cuidarlo</a><a href="${r}aprende-original.html">Si es original</a><a href="${r}aprende.html">Todas las guías</a></div><div><h3>La tienda</h3><a href="${r}casa.html">Sobre AV</a><a href="${r}servicio.html#garantia">Garantía</a><a href="${r}servicio.html#envios">Envíos y devoluciones</a><a href="${r}servicio.html#gdl">Vernos en Guadalajara</a><a href="${r}boveda.html">Tu bóveda</a></div>
      </nav>
      <div class="av-pie__base">
        <span>© ${new Date().getFullYear()} AV Watches · Guadalajara, Jalisco</span>
        <span class="av-pie__hora">Hora en Guadalajara <b id="av-hora-casa"></b></span>
        <span>Precios en pesos mexicanos, IVA incluido</span>
      </div>
    </footer>`);

    conectarArmazon();
  }

  /* --- Comportamiento del armazón ---------------------------------------- */
  function conectarArmazon() {
    document.getElementById('av-tema').onclick = () => tema(document.documentElement.getAttribute('data-tema') === 'noche' ? 'dia' : 'noche');
    document.getElementById('av-bolsa-btn').onclick = abrirBolsa;
    document.getElementById('av-bolsa-cerrar').onclick = cerrarPaneles;
    document.getElementById('av-velo').onclick = cerrarPaneles;
    document.getElementById('av-buscar-btn').onclick = abrirBuscador;
    document.getElementById('av-menu-btn').onclick = abrirMenu;
    document.getElementById('av-menu-cerrar').onclick = cerrarPaneles;
    /* Tocar fuera del recuadro cierra el buscador: en el teléfono nadie
       quiere buscar el botón de retroceso para salir. */
    document.getElementById('av-buscador').addEventListener('pointerdown', e => {
      if (e.target === e.currentTarget) cerrarPaneles();
    });
    document.getElementById('av-menu').addEventListener('click', e => {
      if (e.target.closest('a')) cerrarPaneles();     /* al elegir, se cierra solo */
    });

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrirBuscador(); }
      if (e.key === 'Escape') cerrarPaneles();
    });

    const input = document.getElementById('av-buscar-input');
    input.addEventListener('input', () => pintarBusqueda(input.value));
    input.addEventListener('keydown', e => {
      const items = Array.from(document.querySelectorAll('.av-buscador__res a'));
      const i = items.findIndex(a => a.classList.contains('sel'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        const j = e.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
        items.forEach(a => a.classList.remove('sel')); items[j].classList.add('sel'); items[j].scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter') { const sel = items.find(a => a.classList.contains('sel')) || items[0]; if (sel) location.href = sel.href; }
    });

    /* Reloj digital del encabezado y barra de avance del día. */
    const relojTxt = document.getElementById('av-hora');
    const relojCasa = document.getElementById('av-hora-casa');
    const barra = document.querySelector('.av-dia-barra i');
    setInterval(() => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0'), ss = String(d.getSeconds()).padStart(2, '0');
      relojTxt.textContent = `${hh}:${mm}:${ss}`;
      relojTxt.setAttribute('datetime', d.toISOString());
      if (relojCasa) relojCasa.textContent = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', hour: '2-digit', minute: '2-digit' }).format(d);
      const avance = (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 86400;
      if (barra) barra.style.transform = `scaleX(${avance})`;
    }, 250);

    /* El encabezado se compacta al bajar. */
    let ultimo = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      document.body.classList.toggle('av-scrolled', y > 40);
      document.body.classList.toggle('av-sube', y < ultimo || y < 200);
      ultimo = y;
    }, { passive: true });

    pintarContadores();
  }

  function pintarContadores() {
    const mapa = { carrito: piezas(), boveda: S.boveda.length, comparador: S.comparador.length };
    document.querySelectorAll('[data-cuenta]').forEach(b => {
      const v = mapa[b.dataset.cuenta] || 0;
      b.textContent = v; b.hidden = v === 0;
    });
  }

  /* --- Paneles ----------------------------------------------------------- */
  function abrirBolsa() {
    pintarBolsa();
    document.getElementById('av-velo').hidden = false;
    document.getElementById('av-bolsa').setAttribute('aria-hidden', 'false');
    document.body.classList.add('av-bloqueado');
    requestAnimationFrame(() => document.body.classList.add('av-bolsa-abierta'));
  }
  function abrirMenu() {
    document.getElementById('av-velo').hidden = false;
    document.getElementById('av-menu').setAttribute('aria-hidden', 'false');
    document.getElementById('av-menu-btn').setAttribute('aria-expanded', 'true');
    document.body.classList.add('av-bloqueado');
    requestAnimationFrame(() => document.body.classList.add('av-menu-abierto'));
    pintarContadores();
  }

  function abrirBuscador() {
    const b = document.getElementById('av-buscador');
    b.hidden = false; document.body.classList.add('av-bloqueado');
    requestAnimationFrame(() => { b.classList.add('visible'); document.getElementById('av-buscar-input').focus(); });
    pintarBusqueda('');
  }
  function cerrarPaneles() {
    document.body.classList.remove('av-bolsa-abierta', 'av-menu-abierto', 'av-bloqueado');
    document.getElementById('av-bolsa').setAttribute('aria-hidden', 'true');
    const menu = document.getElementById('av-menu');
    if (menu) { menu.setAttribute('aria-hidden', 'true'); document.getElementById('av-menu-btn').setAttribute('aria-expanded', 'false'); }
    document.getElementById('av-velo').hidden = true;
    const b = document.getElementById('av-buscador');
    b.classList.remove('visible'); setTimeout(() => { b.hidden = true; }, 220);
  }

  function pintarBolsa() {
    const cuerpo = document.getElementById('av-bolsa-cuerpo'), pie = document.getElementById('av-bolsa-pie');
    if (!cuerpo) return;
    if (!S.carrito.length) {
      cuerpo.innerHTML = `<div class="av-vacio">
        <p class="av-t-lead">Tu bolsa está en cero.</p>
        <p>Todavía no eliges nada. Sin prisa: un reloj bien escogido te dura cuarenta años.</p>
        <a class="av-btn av-btn--laton" href="${rutaBase}catalogo.html">Ver el catálogo</a></div>`;
      pie.innerHTML = '';
      return;
    }
    cuerpo.innerHTML = S.carrito.map((l, i) => {
      const r = AV.porId(l.id);
      const v = (r.variantes.find(x => x.id === l.dial) || r.variantes[0]);
      return `<article class="av-linea">
        <div class="av-linea__img" data-reloj-mini="${l.id}" data-dial="${l.dial}" data-correa="${l.correa}"></div>
        <div class="av-linea__txt">
          <h3><a href="${rutaBase}reloj.html?id=${l.id}"><em>${r.marca}</em> ${r.modelo}</a></h3>
          <p class="av-mono av-tenue">${r.condicion === 'nuevo' ? 'Nuevo' : 'Seminuevo'} · ${v.nombre} · ${AV.CORREAS[l.correa].nombre}</p>
          ${l.grabado ? `<p class="av-grabado-eti">Nota: «${l.grabado}»</p>` : ''}
          <div class="av-linea__fila">
            <div class="av-cant">
              <button type="button" data-cant="${i}" data-d="-1" aria-label="Quitar uno">–</button>
              <span>${l.cant}</span>
              <button type="button" data-cant="${i}" data-d="1" aria-label="Agregar uno">+</button>
            </div>
            <b class="av-mono">${AV.precioMXN(l.precio * l.cant)}</b>
          </div>
          <button type="button" class="av-quitar" data-quitar="${i}">Quitar</button>
        </div>
      </article>`;
    }).join('');

    cuerpo.querySelectorAll('[data-reloj-mini]').forEach(el => {
      const r = AV.porId(el.dataset.relojMini);
      const dial = r.variantes.find(v => v.id === el.dataset.dial) || r.variantes[0];
      el.innerHTML = AVMotor.svgReloj(r, { dial, correa: el.dataset.correa });
    });
    AVMotor.refrescar();

    cuerpo.querySelectorAll('[data-quitar]').forEach(b => b.onclick = () => quitar(+b.dataset.quitar));
    cuerpo.querySelectorAll('[data-cant]').forEach(b => b.onclick = () => cantidad(+b.dataset.cant, +b.dataset.d));

    pie.innerHTML = `
      <div class="av-bolsa__linea"><span>Subtotal</span><b class="av-mono">${AV.precioMXN(total())}</b></div>
      <div class="av-bolsa__linea av-tenue"><span>Envío asegurado</span><b class="av-mono">Sin costo</b></div>
      <div class="av-bolsa__linea av-tenue"><span>Ajuste de brazalete</span><b class="av-mono">Incluido</b></div>
      <a class="av-btn av-btn--solido av-bloque" href="${rutaBase}pedido.html">Completar el pedido</a>
      <p class="av-bolsa__nota">Garantía de la marca. 7 días para devolverlo si algo no cuadra.</p>`;
  }

  /* --- Buscador ---------------------------------------------------------- */
  function pintarBusqueda(q) {
    const cont = document.getElementById('av-buscar-res');
    const t = q.trim().toLowerCase();
    let lista;
    if (!t) {
      const vistos = S.visto.map(AV.porId).filter(Boolean);
      lista = (vistos.length ? vistos : AV.RELOJES.slice(0, 5));
      cont.innerHTML = `<p class="av-buscador__eti">${vistos.length ? 'Lo último que viste' : 'Empieza por aquí'}</p>`;
    } else {
      lista = AV.RELOJES.filter(r => [r.marca, r.modelo, r.refFab, r.coleccion, r.condicion, r.estilo, r.calibre.nombre, r.calibre.tipo, AV.METALES[r.caja.metal].nombre, r.lema].join(' ').toLowerCase().includes(t));
      cont.innerHTML = `<p class="av-buscador__eti">${lista.length ? lista.length + ' reloj' + (lista.length > 1 ? 'es' : '') : 'Nada con eso. Prueba «Seiko», «diver», «automático» o «seminuevo».'}</p>`;
    }
    cont.innerHTML += lista.map((r, i) => `
      <a href="${rutaBase}reloj.html?id=${r.id}" class="${i === 0 ? 'sel' : ''}">
        <span class="av-buscador__ref av-mono">${r.marca}</span>
        <span class="av-buscador__nom">${r.modelo}<em>${r.condicion === 'nuevo' ? 'Nuevo' : 'Seminuevo'} · ${r.caja.diametro} mm · ${r.calibre.tipo}</em></span>
        <span class="av-mono">${AV.precioMXN(r.precio)}</span>
      </a>`).join('');
  }

  /* --- Arranque ---------------------------------------------------------- */
  tema();
  document.addEventListener('DOMContentLoaded', () => {
    montarArmazon();
    tema(S.tema);
    /* Revelado por scroll. Solo en escritorio con puntero: en táctil el
       desplazamiento es demasiado rápido y las piezas se veían aparecer de
       golpe. Y lo que ya está en pantalla al cargar no se anima nunca:
       animar lo que el visitante ya está viendo es lo que se siente mal. */
    const animar = matchMedia('(min-width: 861px) and (hover: hover)').matches
                && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let io = null;
    if (animar) {
      io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }), { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    }
    const observar = el => {
      if (!animar) { el.classList.add('visible'); return; }
      /* Ya visible al montarse: se muestra sin animación. */
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) { el.classList.add('visible'); return; }
      io.observe(el);
    };
    document.querySelectorAll('[data-revelar]').forEach(observar);
    global.AVTienda.observar = observar;

    /* Las cifras suben desde cero cuando entran en pantalla. Una sola vez. */
    const ioCifras = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      ioCifras.unobserve(e.target);
      const meta = +e.target.dataset.cuentaHasta;
      if (!meta) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { e.target.textContent = meta.toLocaleString('es-MX'); return; }
      const inicio = performance.now(), dur = 1100;
      const paso = t => {
        const k = Math.min(1, (t - inicio) / dur);
        const suave = 1 - Math.pow(1 - k, 3);
        e.target.textContent = Math.round(meta * suave).toLocaleString('es-MX');
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }), { threshold: 0.5 });
    document.querySelectorAll('[data-cuenta-hasta]').forEach(el => ioCifras.observe(el));
  });

  global.AVTienda = {
    estado: S, guardar, agregar, quitar, cantidad, total, piezas,
    boveda, enBoveda, comparar, enComparador, registrarVisto,
    aviso, abrirBolsa, cerrarPaneles, tema, rutaBase, pintarContadores
  };
})(window);
