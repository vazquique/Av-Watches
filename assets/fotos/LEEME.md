# Fotos de los relojes

Aquí van tus fotos. En cuanto pongas una, el sitio la usa sola: el catálogo,
la ficha, la bolsa, la guía y el pedido pasan a enseñar la foto. El dibujo
vectorial queda de respaldo para las piezas que todavía no tengan, y sigue
disponible en la pestaña «Dibujo» de la ficha, donde vive el tamaño real.

La portada y el comparador se quedan siempre dibujados a propósito: en la
portada el reloj está vivo y en hora, y el comparador superpone siluetas
para enseñar el tamaño.

## Cómo nombrarlas

```
<id-del-reloj>-1.jpg     ← la principal, la que sale en el catálogo
<id-del-reloj>-2.jpg
<id-del-reloj>-3.jpg
```

El `id` es el mismo que aparece en `assets/js/datos.js` y en la dirección de
la ficha. Por ejemplo, para `reloj.html?id=tissot-prx-powermatic`:

```
assets/fotos/tissot-prx-powermatic-1.jpg
assets/fotos/tissot-prx-powermatic-2.jpg
```

Luego, en `assets/js/datos.js`, agrega el renglón `fotos` a ese reloj:

```js
fotos: ['tissot-prx-powermatic-1.jpg', 'tissot-prx-powermatic-2.jpg'],
```

Solo el nombre del archivo: la carpeta la pone el sitio.

## Qué fotos tomar

Con cuatro te alcanza, y en este orden:

1. **De frente**, el reloj recto y el dial completo. Es la que se ve en el catálogo.
2. **En la muñeca**, para que se entienda el tamaño.
3. **De perfil**, que se vea el grosor.
4. **El fondo de caja** y, si es seminuevo, un acercamiento a cualquier marca de uso.

En seminuevos, **fotografía los defectos**. Un rayón que se ve en la foto no
genera una devolución; uno que aparece cuando llega el paquete, sí.

## Cómo que salgan bien

- **Luz de ventana**, de lado, en día nublado. Nada de flash: rebota en el cristal.
- Fondo liso y oscuro (una cartulina negra o gris sirve).
- Limpia el cristal con una microfibra antes. Se nota muchísimo.
- Pon las manecillas a las **10:10**: es como se fotografían los relojes y deja el logo despejado.
- Acércate y recorta después. Que el reloj llene el cuadro.
- Toma todas las piezas con la misma luz y el mismo fondo: un catálogo parejo
  se ve el doble de serio.

## Tamaño y formato

- **1600 × 1600 px**, cuadradas, es más que suficiente.
- JPG de buena calidad, o WebP si tu teléfono lo da.
- Que cada una pese menos de 400 KB: si no, la página tarda en abrir.
