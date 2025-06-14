async function cargarRegionesYComunas() {
  const resp = await fetch('/api/localidades');
  const { regiones } = await resp.json();
  const selReg = document.getElementById('region');
  const selCom = document.getElementById('comuna');

  regiones.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.numero;
    opt.textContent = r.nombre;
    selReg.appendChild(opt);
  });

  selReg.addEventListener('change', () => {
    selCom.innerHTML = '<option value="">Selecciona una comuna</option>';
    const regionId = parseInt(selReg.value, 10);
    if (!regionId) return;
    const comunas = regiones.find(r => r.numero === regionId).comunas;
    comunas.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nombre;
      selCom.appendChild(opt);
    });
  });
}

function addAnotherPhoto() {
  const container = document.getElementById('photoInputsContainer');
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'fotos[]';
  input.accept = 'image/*';
  input.classList.add('foto');     
  container.appendChild(input);
}
window.addAnotherPhoto = addAnotherPhoto;

document.addEventListener('DOMContentLoaded', () => {
  cargarRegionesYComunas();

  const selMedio = document.getElementById('contactar_por');
  const divContacto = document.getElementById('contacto_input');
  selMedio.addEventListener('change', () => {
    const vals = Array.from(selMedio.selectedOptions).map(o => o.value);
    divContacto.style.display = vals.includes('otra') ? 'block' : 'none';
  });
});
