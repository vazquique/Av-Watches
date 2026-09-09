# AV WATCHES

> *El tiempo tiene dueño.*

Tienda en línea de una casa relojera independiente. Sitio estático, sin
dependencias, sin build: se abre `index.html` y funciona.

---

## La idea

**Aquí no hay una sola fotografía de reloj.** Cada pieza se dibuja por código
en SVG a partir de su ficha técnica y **marca la hora real**, en vivo, con las
manecillas girando. Cambiar el diámetro de la caja en `datos.js` hace que el
reloj se vea más grande en toda la tienda; cambiar el color del dial lo repinta
en la portada, el catálogo, el carrito y el comparador.

El motor sabe dibujar biseles de buceo, GMT bicolor, taquímetro y canelado;
diales con rayo de sol, guilloché, aventurina y esqueleto; índices bâton,
romanos, arábigos y de buzo; agujas dauphine, espada, mercedes y bâton; y
complicaciones de fecha, cronógrafo, fase lunar, reserva de marcha, segundo
huso y hora mundial.

## Cosas que vale la pena abrir

| Dónde | Qué |
|---|---|
| Portada | La hora real en cuatro husos, cada uno en una pieza distinta. El calibre AV·01 con su tren de rodaje girando y el volante oscilando. |
| Ficha de pieza | **Configurador en vivo**: cambias dial o correa y el reloj se redibuja al instante, con su precio. |
| Ficha de pieza | **Lupa de relojero**: pasa el cursor sobre la pieza y magnifica el dial x2.6. |
| Ficha de pieza | **«Apagar la luz»**: apaga el dial y deja encendida solo la luminiscencia. |
| Ficha de pieza | **Prueba de talla**: mueves el grosor de tu muñeca y ves la caja a escala real de milímetros, con veredicto. |
| Catálogo | Filtros por colección, temperamento, material, complicación, precio y diámetro. Los filtros viven en la URL, así que una búsqueda se comparte. |
| Banco de trabajo | Compara hasta tres piezas y resalta en latón el mejor dato de cada renglón. |
| Todo el sitio | Buscador con `⌘K` / `Ctrl+K`, bolsa lateral, bóveda de deseos, y modo día/noche que se recuerda. |
| Encabezado | La barra dorada de arriba es el avance del día: a medianoche está en cero, a las 23:59 llena. |

## Estructura

```
index.html          Portada
catalogo.html       La colección, con filtros
reloj.html?id=…     Ficha de pieza + configurador
comparar.html       Banco de trabajo
boveda.html         Lista de deseos
pedido.html         Cierre de compra
casa.html           Historia del taller
servicio.html       Garantía, servicio y citas

assets/css/base.css      Tokens, tipografía, armazón, componentes
assets/css/paginas.css   Secciones de cada página

assets/js/datos.js       Catálogo: metales, correas y las 12 piezas
assets/js/motor-reloj.js Motor de dibujo SVG + bucle de la hora
assets/js/tienda.js      Carrito, bóveda, comparador, tema, buscador, chrome
assets/js/componentes.js Tarjeta de vitrina y diagrama del calibre
assets/js/{inicio,catalogo,detalle,comparar,boveda,pedido}.js
```

## Agregar un reloj

Se añade un objeto a `AV.RELOJES` en `assets/js/datos.js`. Aparece solo en el
catálogo, en los filtros, en el buscador y en el comparador, con su dibujo ya
hecho. Nada más que tocar.

```js
{
  id: 'nuevo-modelo', ref: 'AV·13', nombre: 'Nombre', coleccion: 'Nocturno',
  lema: 'Una línea que lo explique.', precio: 40000, anio: 2026,
  piezas: 100, stock: 5, estilo: 'buceo',
  caja: { metal: 'acero', diametro: 40, altura: 11, agua: 200, cristal: 'Zafiro' },
  calibre: { nombre: 'AV-01', tipo: 'automático', frecuencia: '28,800 alt/h', rubies: 24, reserva: 41 },
  dial: { base: '#101318', textura: 'sunburst', indices: 'baton', tinta: '#EDE8E0', lume: true },
  bisel: { tipo: 'buceo', colorDia: '#0a2340', colorNoche: null },
  manecillas: { tipo: 'espada', color: '#EDE8E0' },
  complicaciones: ['fecha'], correa: 'acero',
  variantesDial: [...], variantesCorrea: [...], notas: [...]
}
```

Valores admitidos: `metal` de `AV.METALES`, `textura` (`sunburst`, `guilloche`,
`mate`, `aventurina`, `esqueleto`), `indices` (`baton`, `puntos`, `romano`,
`arabigo`), `bisel.tipo` (`liso`, `buceo`, `gmt`, `taquimetro`, `canelado`),
`manecillas.tipo` (`dauphine`, `espada`, `mercedes`, `baton`) y
`complicaciones` (`fecha`, `gmt`, `cronografo`, `fase-lunar`, `reserva`,
`segundero-pequeno`, `mundo`).

## Correr en local

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000`. También funciona abriendo el archivo directo,
pero con servidor se ve como debe.

## Notas

- El carrito, la bóveda, el comparador y el tema viven en `localStorage`: son
  de ese navegador y no salen de ahí.
- El formulario de pedido y el de citas **no mandan nada a ningún servidor**:
  es una demostración, no se procesa ningún cobro.
- Las tipografías (Bodoni Moda, IBM Plex Mono, Archivo) se cargan de Google
  Fonts, con respaldos del sistema si no hay red.
