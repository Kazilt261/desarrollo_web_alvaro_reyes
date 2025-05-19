let currentPage = 1;
let totalPages  = 1;

async function loadActivities(page = 1) {
  const resp = await fetch(`/api/actividades?page=${page}`);
  const data = await resp.json();

  // 1) Obtén la lista y ordénala por id descendente
  const lista = data.actividades.sort((a, b) => b.id - a.id);

  // 2) Actualiza paginación
  currentPage  = data.page;
  totalPages   = data.total_pages;

  // 3) Render y controles
  renderTable(lista);
  updatePaginationControls();
}

function renderTable(lista) {
  const tbody = document.getElementById('list');
  tbody.innerHTML = '';  // limpiamos

  lista.forEach(act => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(act.inicio).toLocaleString('es-CL')}</td>
      <td>${act.termino ? new Date(act.termino).toLocaleString('es-CL') : '—'}</td>
      <td>${act.comuna}</td>
      <td>${act.sector || '—'}</td>
      <td>${act.tema || '—'}</td>
      <td>${act.organizador}</td>
      <td>${act.total_fotos}</td>
    `;
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => {
      window.location.href = `/actividades/${act.id}`;
    });
    tbody.appendChild(tr);
  });
}

function updatePaginationControls() {
  document.getElementById('prevBtn').disabled = currentPage <= 1;
  document.getElementById('nextBtn').disabled = currentPage >= totalPages;
  document.getElementById('pageInfo').textContent = 
    `Página ${currentPage} de ${totalPages}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Carga inicial
  loadActivities();

  // Listeners
  document.getElementById('prevBtn')
          .addEventListener('click', () => {
    if (currentPage > 1) loadActivities(currentPage - 1);
  });
  document.getElementById('nextBtn')
          .addEventListener('click', () => {
    if (currentPage < totalPages) loadActivities(currentPage + 1);
  });
});
