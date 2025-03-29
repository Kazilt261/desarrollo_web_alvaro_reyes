function validateActivityForm() {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const inicio = document.getElementById("inicio").value;
    const termino = document.getElementById("termino").value;

    if (nombre === "" || email === "" || inicio === "" || termino === "") {
        alert("Por favor, completa todos los campos obligatorios.");
        return false; // Impide que el formulario se envíe
    }

    // Asegúrate de que la fecha de término sea posterior a la fecha de inicio
    if (new Date(termino) <= new Date(inicio)) {
        alert("La fecha de término debe ser posterior a la de inicio.");
        return false;
    }

    return true; // Permite el envío del formulario si todo es válido
}

function addAnotherPhoto() {
    const input = document.createElement("input");
    input.type = "file";
    input.name = "foto";
    input.accept = "image/*";
    document.querySelector("form").insertBefore(input, document.querySelector("button[type='submit']"));
}
function updateComunas() {
    var comunasByRegion = {
        "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
        "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
        "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
        "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
        "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca"],
        "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Limache", "Olmué", "Casablanca", "Concón", "Quintero", "Puchuncaví", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "San Antonio", "Juan Fernández", "Isla de Pascua"],
        "Metropolitana": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura"],
        "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Santa Cruz"],
        "Maule": ["Talca", "Constitución", "Curepto", "Curicó", "Empedrado", "Hualañé", "Linares", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pelluhue", "Pencahue", "Rauco", "Retiro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Villa Alegre", "Yerbas Buenas"],
        "Ñuble": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Trehuaco", "Yungay"],
        "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Huechuraba", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa"],
        "Araucanía": ["Temuco", "Angol", "Carahue", "Cholchol", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Purén", "Renaico", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Traiguén", "Victoria", "Vilcún", "Villarrica"],
        "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
        "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo"],
        "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
        "Magallanes y Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel"]
    };
    

    var regionSelect = document.getElementById("region");
    var comunaSelect = document.getElementById("comuna");
    var selectedRegion = regionSelect.value;

    // Limpiar las comunas existentes
    while (comunaSelect.options.length > 1) {
        comunaSelect.remove(1);
    }

    if (selectedRegion !== "") {
        var comunas = comunasByRegion[selectedRegion];
        comunas.forEach(function(comuna) {
            var option = new Option(comuna, comuna);
            comunaSelect.options.add(option);
        });
    }
}
