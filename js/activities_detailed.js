const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const actividades = data

function mostrarDetalles() {
    const actividad = actividades[id - 1];

    let fotosHTML = '';
    actividad.fotos.forEach(foto => {
        fotosHTML += `<img src="${foto}" alt="Foto" class="mini-foto">`;
    });

    document.getElementById('info-actividad').innerHTML = `
        <p><strong>Inicio:</strong> ${actividad.inicio}</p>
        <p><strong>Término:</strong> ${actividad.termino}</p>
        <p><strong>Comuna:</strong> ${actividad.comuna}</p>
        <p><strong>Sector:</strong> ${actividad.sector}</p>
        <p><strong>Tema:</strong> ${actividad.tema}</p>
        <p><strong>Nombre Organizador:</strong> ${actividad.organizador}</p>
    `;

    document.getElementById('fotos-actividad').innerHTML = fotosHTML;
}

mostrarDetalles();