function validateActivityForm(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const inicio = document.getElementById("inicio").value;
    const termino = document.getElementById("termino").value;
    const celular = document.getElementById("celular").value;
    const tema = document.getElementById("tema").value;
    const otroTema = document.getElementById("otro_tema").value;
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;

    if (nombre === "" || email === "" || inicio === "" || termino === "" || tema === "" || region === "" || comuna === "") {
        alert("Por favor, completa todos los campos obligatorios.");
        return false;
    }

    if (new Date(termino) <= new Date(inicio)) {
        alert("La fecha de término debe ser posterior a la de inicio.");
        return false;
    }

    const telefonoRegex = /^\+569\d{8}$/;
    if (celular && !telefonoRegex.test(celular)) {
        alert("El número de celular debe estar en el formato +56912345678.");
        return false;
    }

    if (tema === "otro" && (otroTema === "" || otroTema.length < 3 || otroTema.length > 15)) {
        alert("Por favor, ingresa un tema válido con entre 3 y 15 caracteres.");
        return false;
    }

    fotos = document.getElementsByClassName("foto");
    let amount = 0;
    for (let i = 0; i < fotos.length; i++) {
        if (fotos[i].files.length > 0) {
            amount++;
        }
    }
    if (amount > 5) {
        alert("Por favor, sube un máximo de 5 fotos.");
        return false;
    }

    document.getElementById("modal").classList.toggle("open");

    return true;
}

let amountFotos = 1;
function addAnotherPhoto() {
    if (amountFotos >= 5) {
        alert("No puedes subir más de 5 fotos.");
        return;
    }
    amountFotos++;
    const input = document.createElement("input");
    input.type = "file";
    input.className = "foto";
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

function closeModal() {
    document.getElementById("modal").classList.toggle("open");
}

function goIndex() {
    window.location.href = "index.html";
}

function submitForm() {
    const modal = document.getElementById("modal");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = "<p>Formulario enviado con éxito.</p>";
    modalContent.innerHTML += "<button onclick='goIndex()'>Cerrar</button>";
}

function checkOtherTopic() {
    var temaSelect = document.getElementById("tema");
    var otroTemaInput = document.getElementById("otro_tema_input");
    if (temaSelect.value === "otro") {
        otroTemaInput.style.display = "block";
    } else {
        otroTemaInput.style.display = "none";
    }
}

function showContactInput() {
    var contactarSelect = document.getElementById("contactar_por");
    var contactoInput = document.getElementById("contacto_input");
    if (contactarSelect.value === "" || contactarSelect.value === "whatsapp") {
        contactoInput.style.display = "none";
    } else {
        contactoInput.style.display = "block";
    }
}
