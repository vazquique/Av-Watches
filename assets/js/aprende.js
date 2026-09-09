/* La guía de movimientos monta el esquema del mecanismo. */
document.addEventListener('DOMContentLoaded', () => {
  const zona = document.getElementById('mecanismo');
  if (zona && window.AVMecanismo) zona.innerHTML = AVMecanismo.mecanismoSVG();
});
