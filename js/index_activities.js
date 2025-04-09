const actividades = data.slice(0, 5);

function redirigirActividad(id) {
    location.href=`listado_detalle.html?id=${id}`;
}

function loadActivityDetails() {
    const list = document.getElementById("list");
    let html = '';
    actividades.forEach((actividad, index) => {
        html += `
            <tr>
                    <td class="dateBegin">${actividad.inicio}</td>
                    <td class="dateEnd">${actividad.termino}</td>
                    <td class="comuna">${actividad.comuna}</td>
                    <td class="sector">${actividad.sector}</td>
                    <td class="topic">${actividad.tema}</td>
                    <td class="photo">${actividad.fotos.length > 0 ? `<img src="${actividad.fotos[0]}" alt="Foto" class="mini-foto">` : ''}</td>
            </tr>
        `;
    });
    list.innerHTML = html;
}
loadActivityDetails(); 
