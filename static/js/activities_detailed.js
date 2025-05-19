window.addEventListener('DOMContentLoaded', async () => {
  // 1. Extraer el ID de la URL
  const parts = window.location.pathname.split('/');
  const actId = parts[parts.length - 1];

  // 2. Pedir los datos de la actividad
  const resp = await fetch(`/api/actividades/${actId}`);
  const a    = await resp.json();

  // 3. Rellenar la sección de info
  const info = document.getElementById('info-actividad');
  info.innerHTML = `
    <p><strong>ID:</strong> ${a.id}</p>
    <p><strong>Inicio:</strong> ${new Date(a.inicio).toLocaleString()}</p>
    <p><strong>Término:</strong> ${a.termino 
        ? new Date(a.termino).toLocaleString() 
        : '—'}</p>
    <p><strong>Comuna:</strong> ${a.comuna}</p>
    <p><strong>Sector:</strong> ${a.sector || '—'}</p>
    <p><strong>Tema(s):</strong> ${a.tema || '—'}</p>
    <p><strong>Organizador:</strong> ${a.organizador}</p>
    <p><strong>Email:</strong> ${a.email}</p>
    <p><strong>Celular:</strong> ${a.celular || '—'}</p>
    <p><strong>Descripción:</strong> ${a.descripcion || '—'}</p>
  `;

  // 4. Rellenar la sección de fotos iterando todas
  const fotosSection = document.getElementById('fotos-actividad');
  if (a.fotos && a.fotos.length > 0) {
    a.fotos.forEach(foto => {
      const img = document.createElement('img');
      img.src    = `/static/${foto.ruta_archivo}`;
      img.alt    = foto.nombre_archivo;
      img.width  = 100;
      fotosSection.appendChild(img);
    });
  } else {
    fotosSection.innerHTML = '<p>No hay fotos.</p>';
  }
});
