document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('activityForm')
    .addEventListener('submit', validateActivityForm);
});

function validateActivityForm(event) {
  event.preventDefault(); // cortamos el envío nativo

  // 1) Validaciones básicas
  const nombre     = document.getElementById("nombre").value.trim();
  const email      = document.getElementById("email").value.trim();
  const inicio     = document.getElementById("inicio").value;
  const termino    = document.getElementById("termino").value;
  const celular    = document.getElementById("celular").value.trim();
  const tema       = document.getElementById("tema").value;
  const otroTema   = document.getElementById("otro_tema").value.trim();
  const region     = document.getElementById("region").value;
  const comuna     = document.getElementById("comuna").value;

  // 2) Campos obligatorios
  const faltan = [];
  if (!region)  faltan.push("Región");
  if (!comuna)  faltan.push("Comuna");
  if (!nombre)  faltan.push("Nombre del organizador");
  if (!email)   faltan.push("Correo electrónico");
  if (!inicio)  faltan.push("Fecha y Hora de Inicio");
  if (!termino) faltan.push("Fecha y Hora de Término");
  if (!tema)    faltan.push("Tema");
  if (tema === "otro" && !otroTema) faltan.push("Especificar tema");

  if (faltan.length) {
    alert("Por favor completa: " + faltan.join(", "));
    return false;
  }

  // 3) Fecha término > fecha inicio
  if (new Date(termino) <= new Date(inicio)) {
    alert("La fecha de término debe ser posterior a la de inicio.");
    return false;
  }

  // 4) Formato de celular (si está presente)
  const telefonoRegex = /^\+569\d{8}$/;
  if (celular && !telefonoRegex.test(celular)) {
    alert("El número de celular debe tener formato +56912345678.");
    return false;
  }

  // 5) Validación de email con regex
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    alert("Correo inválido: debe tener formato usuario@dominio.com");
    document.getElementById("email").focus();
    return false;
  }

  // 6) Fotos: contar TODOS los archivos subidos en inputs .foto
  const fotoInputs = document.getElementsByClassName("foto");
  let totalFotos = 0;
  for (let inp of fotoInputs) {
    totalFotos += inp.files.length;
  }
  if (totalFotos < 1) {
    alert("Por favor, sube al menos una foto.");
    return false;
  }
  if (totalFotos > 5) {
    alert("Por favor, sube un máximo de 5 fotos.");
    return false;
  }

  // 7) Si todo OK, abrimos el modal de confirmación
  document.getElementById("modal").classList.add("open");
  return true;
}

// Mantener contador para no añadir más de 5 campos
let amountFotos = 1;
function addAnotherPhoto() {
  if (amountFotos >= 5) {
    alert("No puedes subir más de 5 fotos.");
    return;
  }
  amountFotos++;
  const container = document.getElementById("photoInputsContainer");
  const input = document.createElement("input");
  input.type = "file";
  input.className = "foto";       // clase para validar luego
  input.name = "fotos[]";         // nombre en plural con []
  input.accept = "image/*";
  container.appendChild(input);
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
    document.getElementById("modal").classList.remove("open");
}

function goIndex() {
    window.location.href = '/';
}

function submitForm() {
    closeModal();
    const modal = document.getElementById("modal");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = "<p>Formulario enviado con éxito.</p>";
    modalContent.innerHTML += "<button onclick='goIndex()'>Cerrar</button>";
    document.getElementById("activityForm").submit();
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
