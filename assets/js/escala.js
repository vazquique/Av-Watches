/* ==========================================================================
   AV WATCHES · Tamaño real
   --------------------------------------------------------------------------
   Comprar un reloj en línea falla casi siempre por lo mismo: no te haces una
   idea de qué tan grande es. Aquí se resuelve midiendo la pantalla del que
   mira: pone una tarjeta bancaria contra el monitor y ajusta hasta que
   coincida. Una tarjeta mide 85.60 mm en todo el mundo (norma ISO/IEC 7810
   ID-1), así que con eso se sabe cuántos píxeles mide un milímetro en ESA
   pantalla, y a partir de ahí cualquier reloj se puede mostrar a su tamaño
   físico exacto.
   ========================================================================== */
(function (global) {
  'use strict';

  const LLAVE = 'av-escala-v1';
  const TARJETA_MM = 85.60;            /* ISO/IEC 7810 ID-1 */
  const MONEDA_MM = 28.0;              /* diez pesos mexicanos */
  const POR_OMISION = 96 / 25.4;       /* lo típico si nadie calibra: ~3.78 px/mm */

  let pxmm = null;
  try { const v = parseFloat(localStorage.getItem(LLAVE)); if (v > 1 && v < 30) pxmm = v; } catch (e) {}

  const estaCalibrada = () => pxmm !== null;
  const pxPorMM = () => pxmm || POR_OMISION;

  function guardar(v) {
    pxmm = v;
    try { localStorage.setItem(LLAVE, String(v)); } catch (e) {}
    document.documentElement.classList.add('av-calibrado');
    document.dispatchEvent(new CustomEvent('av:escala', { detail: v }));
  }
  function olvidar() {
    pxmm = null;
    try { localStorage.removeItem(LLAVE); } catch (e) {}
    document.documentElement.classList.remove('av-calibrado');
    document.dispatchEvent(new CustomEvent('av:escala', { detail: null }));
  }

  /* Ancho en píxeles que debe tener el dibujo de frente para que la caja
     mida en pantalla exactamente sus milímetros. El motor dibuja la caja
     con cierto radio dentro de un viewBox de 400, así que se despeja.  */
  function anchoFrente(spec) {
    const R = AVMotor.radioCaja(spec);
    return spec.caja.diametro * pxPorMM() * 400 / (2 * R);
  }
  /* El perfil se dibuja con el viewBox en milímetros: es directo. */
  function anchoPerfil(spec) {
    return (spec.caja.diametro + 52 + 24) * pxPorMM();
  }

  /* ----------------------------------------------------------------------
     El calibrador
     ---------------------------------------------------------------------- */
  function abrir(alTerminar) {
    let panel = document.getElementById('av-calibrador');
    if (panel) panel.remove();

    const anchoInicial = TARJETA_MM * pxPorMM();
    document.body.insertAdjacentHTML('beforeend', `
    <div class="av-calibrador" id="av-calibrador" role="dialog" aria-modal="true" aria-label="Calibrar el tamaño real de tu pantalla">
      <div class="av-cal__caja">
        <header class="av-cal__cab">
          <div>
            <p class="av-t-eyebrow">Tamaño real</p>
            <h2 class="av-t-titulo">Mide tu pantalla<br>con una tarjeta.</h2>
          </div>
          <button type="button" class="av-cerrar" id="av-cal-cerrar">Cerrar</button>
        </header>

        <ol class="av-cal__pasos av-mono">
          <li>Toma cualquier tarjeta bancaria o tu credencial de elector.</li>
          <li>Ponla sobre el rectángulo de abajo, pegada a la pantalla.</li>
          <li>Mueve el control hasta que el dibujo quede del tamaño exacto de tu tarjeta.</li>
        </ol>

        <div class="av-cal__zona">
          <div class="av-cal__tarjeta" id="av-cal-tarjeta">
            <span class="av-cal__chip" aria-hidden="true"></span>
            <span class="av-cal__marca av-mono">85.60 mm</span>
            <span class="av-cal__banda" aria-hidden="true"></span>
          </div>
        </div>

        <div class="av-cal__mando">
          <button type="button" class="av-cal__paso" data-nudge="-1" aria-label="Más chico">−</button>
          <input type="range" id="av-cal-rango" min="140" max="900" step="0.5" value="${anchoInicial.toFixed(1)}" aria-label="Ancho de la tarjeta en pantalla">
          <button type="button" class="av-cal__paso" data-nudge="1" aria-label="Más grande">+</button>
        </div>

        <p class="av-cal__lectura av-mono" id="av-cal-lectura"></p>

        <div class="av-cal__pie">
          <button type="button" class="av-btn av-btn--solido" id="av-cal-guardar">Listo, así está</button>
          <button type="button" class="av-btn av-btn--bajo" id="av-cal-olvidar">Olvidar la medida</button>
        </div>
        <p class="av-cal__nota">La medida se queda en este navegador. No sale de aquí.</p>
      </div>
    </div>`);

    panel = document.getElementById('av-calibrador');
    const tarjeta = document.getElementById('av-cal-tarjeta');
    const rango = document.getElementById('av-cal-rango');
    const lectura = document.getElementById('av-cal-lectura');

    function pintar() {
      const w = parseFloat(rango.value);
      tarjeta.style.width = w + 'px';
      tarjeta.style.height = (w / 1.5858) + 'px';       /* proporción ID-1 */
      const v = w / TARJETA_MM;
      lectura.innerHTML = `1 mm = <b>${v.toFixed(2)} px</b> · una moneda de diez pesos se vería de ` +
        `<b>${Math.round(MONEDA_MM * v)} px</b>`;
    }
    rango.addEventListener('input', pintar);
    panel.querySelectorAll('[data-nudge]').forEach(b => b.onclick = () => {
      rango.value = (parseFloat(rango.value) + parseFloat(b.dataset.nudge) * 0.5).toFixed(1);
      pintar();
    });
    pintar();

    const cerrar = () => { panel.classList.remove('visible'); setTimeout(() => panel.remove(), 260); document.body.classList.remove('av-bloqueado'); };
    document.getElementById('av-cal-cerrar').onclick = cerrar;
    document.getElementById('av-cal-guardar').onclick = () => {
      guardar(parseFloat(rango.value) / TARJETA_MM);
      AVTienda.aviso('Pantalla medida. Ya puedes ver los relojes a tamaño real.');
      cerrar(); if (alTerminar) alTerminar(true);
    };
    document.getElementById('av-cal-olvidar').onclick = () => {
      olvidar(); AVTienda.aviso('Medida olvidada.');
      cerrar(); if (alTerminar) alTerminar(false);
    };
    panel.addEventListener('click', e => { if (e.target === panel) cerrar(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', esc); }
    });

    document.body.classList.add('av-bloqueado');
    requestAnimationFrame(() => panel.classList.add('visible'));
  }

  if (estaCalibrada()) document.documentElement.classList.add('av-calibrado');

  global.AVEscala = { pxPorMM, estaCalibrada, abrir, olvidar, anchoFrente, anchoPerfil, TARJETA_MM };
})(window);
