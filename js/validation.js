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
    var regionSelect = document.getElementById("region");
    var comunaSelect = document.getElementById("comuna");
    var selectedRegion = regionSelect.value;

    while (comunaSelect.options.length > 1) {
        comunaSelect.remove(1);
    }
    
    if (selectedRegion !== "") {
        var regionData = region_comuna.regiones.find(function(region) {
            return region.nombre === selectedRegion;
        });
        
        if (regionData) {
            regionData.comunas.forEach(function(comuna) {
                var option = new Option(comuna.nombre, comuna.id);
                comunaSelect.options.add(option);
            });
        }
    }
}
