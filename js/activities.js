
const actividades = data;

function mostrarActividad(id) {
    const actividad = actividades[id - 1];

    const detallesHTML = `
        <h2>Detalles de la Actividad</h2>
        <p><strong>Inicio:</strong> ${actividad.inicio}</p>
        <p><strong>Término:</strong> ${actividad.termino}</p>
        <p><strong>Comuna:</strong> ${actividad.comuna}</p>
        <p><strong>Sector:</strong> ${actividad.sector}</p>
        <p><strong>Tema:</strong> ${actividad.tema}</p>
        <p><strong>Nombre Organizador:</strong> ${actividad.organizador}</p>
        <p><strong>Total Fotos:</strong> ${actividad.fotos.length}</p>
        <div id="fotos-actividad">
            ${actividad.fotos.map(foto => `<img src="${foto}" alt="Foto" class="mini-foto">`).join('')}
        </div>
        <button onclick="volverListado()">Volver al Listado</button>
    `;

    document.getElementById('main-content').innerHTML = detallesHTML;
}

function redirigirActividad(id) {
    location.href=`listado_detalle.html?id=${id}`;
}

function loadActivityDetails() {
    const list = document.getElementById("list");
    let html = '';
    actividades.forEach((actividad, index) => {
        html += `
            <tr onclick="redirigirActividad(${index + 1})">
                    <td class="dateBegin">${actividad.inicio}</td>
                    <td class="dateEnd">${actividad.termino}</td>
                    <td class="comuna">${actividad.comuna}</td>
                    <td class="sector">${actividad.sector}</td>
                    <td class="topic">${actividad.tema}</td>
                    <td class="organizatorName">${actividad.organizador}</td>
                    <td class="totalPhotos">${actividad.fotos.length}</td>
            </tr>
        `;
    });
    list.innerHTML = html;
}



loadActivityDetails(); 
