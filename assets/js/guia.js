/* ==========================================================================
   AV WATCHES · ¿Cuál es tu reloj?
   --------------------------------------------------------------------------
   Cinco preguntas y una puntuación de verdad sobre el inventario. No es un
   cuestionario de adorno: cada respuesta suma o resta puntos a cada pieza y
   al final se explica, con palabras, por qué salió cada una.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const PREGUNTAS = [
    {
      id: 'presupuesto', titulo: '¿Cuánto quieres gastar?',
      pie: 'Sin compromiso. Si te pasas un poco del rango, igual te lo enseño.',
      ops: [
        { v: 'a', eti: 'Hasta $6,000',        sub: 'Primer reloj en serio', max: 6000 },
        { v: 'b', eti: '$6,000 a $20,000',    sub: 'Un buen automático',    min: 5000,  max: 20000 },
        { v: 'c', eti: '$20,000 a $60,000',   sub: 'Suizo o seminuevo bueno', min: 18000, max: 62000 },
        { v: 'd', eti: 'Más de $60,000',      sub: 'La pieza que te vas a quedar', min: 50000 }
      ]
    },
    {
      id: 'muneca', titulo: '¿Cómo tienes la muñeca?',
      pie: 'Mídela con un listón si no sabes. Es el dato que más gente ignora y el que más arruina una compra.',
      ops: [
        { v: 'a', eti: 'Delgada',  sub: 'Menos de 16 cm', ideal: [34, 39] },
        { v: 'b', eti: 'Normal',   sub: 'Entre 16 y 18 cm', ideal: [37, 42] },
        { v: 'c', eti: 'Gruesa',   sub: 'Más de 18 cm',   ideal: [40, 45] },
        { v: 'd', eti: 'Ni idea',  sub: 'Ya la mediremos', ideal: [36, 43] }
      ]
    },
    {
      id: 'uso', titulo: '¿Para qué lo quieres?',
      pie: 'Un solo reloj puede hacer casi todo, pero siempre hace una cosa mejor que las demás.',
      ops: [
        { v: 'diario',   eti: 'Para todos los días', sub: 'Que aguante todo sin cuidarlo', estilos: ['deportivo', 'campo', 'buceo'], cols: ['De todos los días', 'Para empezar'] },
        { v: 'vestir',   eti: 'Oficina y vestir',    sub: 'Que pase bajo el puño',        estilos: ['vestir'], cols: ['Para empezar', 'Piezas serias'], finoImporta: true },
        { v: 'agua',     eti: 'Agua y aventura',     sub: 'Alberca, mar, montaña',        estilos: ['buceo', 'campo'], cols: ['Bajo el agua'], aguaImporta: true },
        { v: 'especial', eti: 'Una pieza especial',  sub: 'Algo que no se ve en todos lados', estilos: ['complicacion', 'cronografo'], cols: ['Piezas serias'] }
      ]
    },
    {
      id: 'lata', titulo: '¿Te late darle cuerda?',
      pie: 'Un mecánico se para si lo dejas dos días. Un solar nunca te pide nada.',
      ops: [
        { v: 'mecanico', eti: 'Sí, eso me gusta',      sub: 'Quiero algo mecánico, vivo',   tipos: ['automático', 'cuerda manual'] },
        { v: 'facil',    eti: 'Prefiero que no',        sub: 'Que ande solo y ya',           tipos: ['cuarzo', 'cuarzo solar'] },
        { v: 'igual',    eti: 'Me da lo mismo',         sub: 'Con que dé bien la hora',      tipos: null }
      ]
    },
    {
      id: 'condicion', titulo: '¿Nuevo o seminuevo?',
      pie: 'Un seminuevo bien revisado te da mucho más reloj por el mismo dinero.',
      ops: [
        { v: 'nuevo',     eti: 'Nuevo y sellado',  sub: 'Con su garantía de la marca', cond: 'nuevo' },
        { v: 'seminuevo', eti: 'Seminuevo',        sub: 'Más reloj por el mismo dinero', cond: 'seminuevo' },
        { v: 'igual',     eti: 'Lo que convenga',  sub: 'Enséñame los dos',            cond: null }
      ]
    }
  ];

  const resp = {};
  let paso = 0;
  const zona = document.getElementById('guia');

  /* --- Puntuación -------------------------------------------------------- */
  function evaluar() {
    const q = i => PREGUNTAS[i].ops.find(o => o.v === resp[PREGUNTAS[i].id]);
    const pres = q(0), mun = q(1), uso = q(2), lata = q(3), cond = q(4);

    return AV.RELOJES.map(r => {
      let pts = 0; const razones = []; const contras = [];

      /* Presupuesto: manda, pero con un margen para no esconder joyas. */
      const bajo = pres.min || 0, alto = pres.max || Infinity;
      if (r.precio >= bajo && r.precio <= alto) { pts += 40; }
      else if (r.precio < bajo) { pts += 22; razones.push('cuesta menos de lo que pensabas gastar'); }
      else if (r.precio <= alto * 1.25) { pts += 12; contras.push('se pasa un poco de tu rango'); }
      else { pts -= 60; }

      /* Muñeca: el diámetro que le queda bien a cada quien. */
      const [i0, i1] = mun.ideal, d = r.caja.diametro;
      if (d >= i0 && d <= i1) { pts += 26; razones.push(`${d} mm te van a quedar bien`); }
      else {
        const fuera = d < i0 ? i0 - d : d - i1;
        pts += Math.max(-18, 18 - fuera * 9);
        if (fuera > 1.5) contras.push(d < i0 ? `${d} mm puede verse chico en tu muñeca` : `${d} mm es grande para tu muñeca`);
      }

      /* Para qué lo quiere. */
      if (uso.estilos.includes(r.estilo)) { pts += 22; razones.push('es justo el tipo de reloj que buscas'); }
      if (uso.cols.includes(r.coleccion)) pts += 10;
      if (uso.aguaImporta) {
        if (r.caja.agua >= 200) { pts += 14; razones.push(`${r.caja.agua} m de resistencia al agua`); }
        else if (r.caja.agua < 100) { pts -= 20; contras.push(`solo ${r.caja.agua} m de agua`); }
      }
      if (uso.finoImporta) {
        if (r.caja.altura <= 11) { pts += 14; razones.push(`${r.caja.altura} mm de alto: pasa bajo el puño`); }
        else if (r.caja.altura >= 13.5) { pts -= 14; contras.push(`${r.caja.altura} mm se nota bajo la manga`); }
      }

      /* Mecánica. */
      if (lata.tipos) {
        if (lata.tipos.includes(r.calibre.tipo)) { pts += 20; razones.push(r.calibre.tipo); }
        else if (lata.v === 'facil' && r.calibre.tipo === 'cuerda manual') pts -= 70;  /* lo contrario de lo pedido */
        else pts -= 45;
      } else pts += 8;

      /* Condición. */
      if (cond.cond) {
        if (r.condicion === cond.cond) pts += 14;
        else pts -= 22;
      } else pts += 6;

      /* Detalles que suman por sí solos. */
      if (r.precioLista > r.precio * 1.2) razones.push(`ahorras ${AV.precioMXN(r.precioLista - r.precio)} sobre el de lista`);
      if (r.stock === 1) contras.push('solo queda una pieza');

      return { r, pts, razones: razones.slice(0, 3), contras: contras.slice(0, 2) };
    }).sort((a, b) => b.pts - a.pts);
  }

  /* --- Pintado ----------------------------------------------------------- */
  function pintarPaso() {
    const p = PREGUNTAS[paso];
    zona.innerHTML = `
      <div class="av-guia__barra" aria-hidden="true"><i style="transform:scaleX(${(paso) / PREGUNTAS.length})"></i></div>
      <p class="av-guia__cuenta av-mono">Pregunta ${paso + 1} de ${PREGUNTAS.length}</p>
      <h2 class="av-t-display av-guia__titulo">${p.titulo}</h2>
      <div class="av-guia__ops">
        ${p.ops.map(o => `<button type="button" class="av-guia__op" data-v="${o.v}">
          <span class="e">${o.eti}</span><span class="s">${o.sub}</span></button>`).join('')}
      </div>
      <p class="av-guia__pie">${p.pie}</p>
      ${paso ? '<button type="button" class="av-enlace av-guia__atras" id="guia-atras">← Volver</button>' : ''}`;

    zona.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
      resp[p.id] = b.dataset.v;
      b.classList.add('elegida');
      setTimeout(() => { paso++; paso < PREGUNTAS.length ? pintarPaso() : pintarResultado(); }, 220);
    });
    const atras = document.getElementById('guia-atras');
    if (atras) atras.onclick = () => { paso--; pintarPaso(); };
    zona.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function pintarResultado() {
    const orden = evaluar();
    const top = orden.filter(x => x.pts > 0).slice(0, 3);
    const mejor = top[0];

    if (!top.length) {
      zona.innerHTML = `<div class="av-guia__final">
        <h2 class="av-t-display">No tengo nada que encaje.</h2>
        <p class="av-t-lead">Con eso que me pides no hay pieza en existencia. Escríbeme y lo consigo por encargo.</p>
        <div class="av-hero__cta"><a class="av-btn av-btn--laton" href="servicio.html#contacto">Escríbeme</a>
        <button type="button" class="av-btn" id="guia-otra">Volver a empezar</button></div></div>`;
      document.getElementById('guia-otra').onclick = reiniciar;
      return;
    }

    zona.innerHTML = `
      <div class="av-guia__barra" aria-hidden="true"><i style="transform:scaleX(1)"></i></div>
      <p class="av-guia__cuenta av-mono">Listo · ${top.length} de ${AV.RELOJES.length} piezas encajan contigo</p>
      <h2 class="av-t-display av-guia__titulo">Yo te daría este.</h2>

      <article class="av-guia__gana">
        <div class="av-guia__pieza" data-reloj="${mejor.r.id}"></div>
        <div>
          <p class="av-mono av-laton" style="letter-spacing:.24em;text-transform:uppercase;font-size:.66rem">${mejor.r.marca}</p>
          <h3 class="av-t-display" style="font-size:clamp(1.8rem,3.4vw,2.8rem)">${mejor.r.modelo}</h3>
          <p class="av-t-lead" style="margin:.6rem 0 1.2rem">${mejor.r.lema}</p>
          <ul class="av-guia__razones">${mejor.razones.map(x => `<li>${x}</li>`).join('')}</ul>
          ${mejor.contras.length ? `<p class="av-guia__pero">Ten en cuenta: ${mejor.contras.join(' · ')}.</p>` : ''}
          <div class="av-guia__compra">
            <b class="av-mono">${AV.precioMXN(mejor.r.precio)}</b>
            <a class="av-btn av-btn--solido" href="reloj.html?id=${mejor.r.id}">Ver la ficha</a>
          </div>
        </div>
      </article>

      ${top.length > 1 ? `<p class="av-t-eyebrow" style="margin:2.5rem 0 1rem">Y estos también te quedarían</p>
      <div class="av-vitrina" id="guia-mas"></div>` : ''}

      <div class="av-guia__final">
        <button type="button" class="av-btn" id="guia-otra">Volver a empezar</button>
        <a class="av-btn av-btn--laton" href="catalogo.html">Ver todo el catálogo</a>
      </div>`;

    AVMotor.montarTodos(zona);
    if (top.length > 1) AVComp.pintarVitrina(document.getElementById('guia-mas'), top.slice(1).map(x => x.r));
    document.getElementById('guia-otra').onclick = reiniciar;
    zona.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function reiniciar() { paso = 0; Object.keys(resp).forEach(k => delete resp[k]); pintarPaso(); }
  pintarPaso();
});
