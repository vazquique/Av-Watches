# AV WATCHES

> *El tiempo tiene dueño.*

**En línea: https://vazquique.github.io/Av-Watches/**

Tienda en línea de relojes **nuevos y seminuevos** de marcas existentes.
Envío a toda la República y entrega en persona en Guadalajara.
Sitio estático, sin dependencias y sin paso de build: se abre `index.html`
y funciona.

---

## ⚠ Antes de publicarlo

Tres cosas que **tienes que revisar**, porque las llené con datos de ejemplo:

1. **Precios y existencias** (`assets/js/datos.js`) — son aproximaciones de
   mercado, no tu inventario. Ajusta `precio`, `precioLista` y `stock` de
   cada entrada.
2. **Especificaciones** — siguen a los modelos de fábrica, pero verifica cada
   `refFab` contra la pieza que tengas físicamente antes de publicarla.
3. **Tus datos de contacto** — busca los comentarios `⇢` en `servicio.html`
   (correo, WhatsApp, redes) y en `casa.html` (tu historia y tus cifras).

Los formularios de pedido y contacto **no mandan nada a ningún servidor** ni
procesan cobros: son demostración. Para vender de verdad hace falta una
pasarela (Stripe, Mercado Pago, Conekta) y un backend.

## La idea

**Aquí no hay una sola fotografía.** Cada reloj se dibuja por código en SVG a
partir de su ficha técnica y **marca la hora real**, en vivo. El dial lleva la
marca que corresponde, la caja se dibuja al diámetro real del modelo, y un
cuarzo pega el salto seco de cada segundo mientras un automático barre suave.

Es una ilustración a escala, no una foto del producto: sirve para que el
catálogo se vea coherente mientras consigues fotos reales de tus piezas. Es
buena idea sustituirlas por fotos propias conforme las tengas.

## Cosas que vale la pena abrir

| Dónde | Qué |
|---|---|
| Portada | Cuatro relojes del catálogo dando la hora real de Guadalajara, Ginebra, Tokio y Nueva York. |
| Portada | Explicación de automático vs. cuarzo vs. solar, con un movimiento animado. Es la duda que más te van a preguntar. |
| Ficha | **Selector de referencia**: los colores que el modelo tiene de fábrica, cada uno con su referencia real; el reloj se redibuja al instante. |
| Ficha | **Lupa**: pasa el cursor sobre el reloj y magnifica el dial x2.6. |
| Ficha | **«Apagar la luz»**: apaga el dial y deja solo la luminiscencia. |
| Ficha | **Prueba de talla**: mueves el grosor de tu muñeca y ves la caja a escala real, con veredicto. |
| Ficha | En seminuevos, un bloque aparte con el estado real de esa pieza. |
| Catálogo | Filtros por marca, condición, mecánica, tipo, complicación, precio y diámetro. Viven en la URL, así que un filtro se comparte por WhatsApp. |
| Comparar | Hasta tres relojes lado a lado, resaltando en latón el mejor dato de cada renglón. |
| Todo | Buscador con `⌘K`, bolsa, bóveda de deseos y modo día/noche que se recuerda. |
| Encabezado | La barra dorada de arriba es el avance del día. |

## Estructura

```
index.html          Portada
catalogo.html       Catálogo con filtros
reloj.html?id=…     Ficha del reloj
comparar.html       Comparador
boveda.html         Lista de deseos
pedido.html         Cierre de compra
casa.html           Sobre AV Watches
servicio.html       Ayuda: garantía, envíos, autenticidad, contacto

assets/css/base.css      Tokens, tipografía, armazón, componentes
assets/css/paginas.css   Secciones de cada página

assets/js/datos.js       Inventario: metales, correas y los relojes
assets/js/motor-reloj.js Motor de dibujo SVG + bucle de la hora
assets/js/tienda.js      Bolsa, bóveda, comparador, tema, buscador, chrome
assets/js/componentes.js Tarjeta de vitrina y diagrama del movimiento
assets/js/{inicio,catalogo,detalle,comparar,boveda,pedido}.js
```

## Agregar un reloj

Un objeto más en `AV.RELOJES` (`assets/js/datos.js`). Aparece solo en el
catálogo, en los filtros, en el buscador y en el comparador, ya dibujado.

```js
{
  id: 'marca-modelo',                       // sin espacios, va en la URL
  marca: 'Seiko', modelo: 'Presage Cocktail',
  dialLinea: 'PRESAGE',                     // segunda línea del dial
  refFab: 'SRPB43J1',
  coleccion: 'Para empezar',                // una de AV.COLECCIONES
  condicion: 'nuevo',                       // 'nuevo' | 'seminuevo'
  incluye: 'Caja, papeles y garantía de 2 años',
  estado: null,                             // obligatorio si es seminuevo
  lema: 'Una línea que lo explique.',
  precio: 9900, precioLista: 12000,         // precioLista sale tachado
  anio: 2024, stock: 2, estilo: 'vestir',
  caja: { metal: 'acero', diametro: 40.5, altura: 11.8, agua: 50, cristal: 'Hardlex' },
  calibre: { nombre: 'Seiko 4R35', tipo: 'automático', frecuencia: '21,600 alt/h', rubies: 23, reserva: 41 },
  dial: { base: '#e8dcc0', textura: 'sunburst', indices: 'baton', tinta: '#2e2a23', lume: false },
  bisel: { tipo: 'liso', colorDia: null, colorNoche: null },
  manecillas: { tipo: 'dauphine', color: '#3a352c' },
  complicaciones: ['fecha'], correa: 'pielCafe',
  variantes: [ { id:'champan', nombre:'Champán (SRPB43J1)', base:'#e8dcc0', tinta:'#2e2a23', extra:0 } ],
  correasExtra: ['pielCafe', 'acero'],
  notas: ['Tres cosas que valga la pena decir de este reloj.']
}
```

Valores admitidos: `metal` de `AV.METALES`; `correa` y `correasExtra` de
`AV.CORREAS`; `textura` (`sunburst`, `guilloche`, `mate`, `aventurina`,
`esqueleto`); `indices` (`baton`, `puntos`, `romano`, `arabigo`);
`bisel.tipo` (`liso`, `buceo`, `gmt`, `taquimetro`, `canelado`);
`manecillas.tipo` (`dauphine`, `espada`, `mercedes`, `baton`);
`calibre.tipo` (`automático`, `cuerda manual`, `cuarzo`, `cuarzo solar`);
`complicaciones` (`fecha`, `gmt`, `cronografo`, `fase-lunar`, `reserva`,
`segundero-pequeno`, `mundo`).

Para cuarzo y solar, `reserva` va en horas: si pones más de 8760 se muestra
como años de pila, y más de 720 como meses de reserva a oscuras.

## Correr en local

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000`.

## Publicación

El sitio está en GitHub Pages: **https://vazquique.github.io/Av-Watches/**

Lo despliega `.github/workflows/pages.yml` en cada push a la rama
`claude/av-watches-ecommerce-iy3qps`. No hay paso de compilación: el repo
se sube tal cual. Para publicar desde otra rama, cambia el `branches:` de
ese archivo.

## Notas

- La bolsa, la bóveda, el comparador y el tema viven en `localStorage`: son
  de ese navegador y no salen de ahí.
- Las tipografías (Bodoni Moda, IBM Plex Mono, Archivo) vienen de Google
  Fonts, con respaldos del sistema si no hay red.
- Las marcas mencionadas son de sus respectivos dueños. El sitio las nombra
  como lo hace cualquier revendedor; no implica representación oficial.
