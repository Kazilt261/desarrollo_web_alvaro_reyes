document.addEventListener('DOMContentLoaded', () => {
  window.openLightbox = src => {
    const lb = document.getElementById('lightbox');
    document.getElementById('lb-img').src = src;
    lb.classList.add('open');
  };

  const actId = Number(document.body.dataset.actId);

  function loadComments() {
    fetch(`/api/comentarios/${actId}`)
      .then(r => r.json())
      .then(data => {
        const ul = document.getElementById('commentsList');
        ul.innerHTML = '';
        if (!data.length) {
          ul.innerHTML = '<li>No hay comentarios aún.</li>';
          return;
        }

        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        data.forEach(c => {
          const li = document.createElement('li');
          li.classList.add('comment-item');
          const fecha = new Date(c.fecha).toLocaleString('es-CL');
          li.innerHTML = `
            <div class="comment-header">
              <span class="comment-name">${c.nombre}</span>
              <span class="comment-date">${fecha}</span>
            </div>
            <div class="comment-text">${c.texto}</div>
          `;
          ul.appendChild(li);
        });
      })
      .catch(err => console.error('Error cargando comentarios:', err));
  }

  const form = document.getElementById('commentForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const errorsDiv = document.getElementById('commentErrors');
    errorsDiv.innerHTML = '';

    const nombre = document.getElementById('commentName').value.trim();
    const texto  = document.getElementById('commentText').value.trim();

    fetch(`/api/comentarios/${actId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, texto })
    })
    .then(resp => resp.ok
      ? resp.json()
      : resp.json().then(j => Promise.reject(j.errors))
    )
    .then(() => {
      form.reset();
      loadComments();
    })
    .catch(errs => {
      errs.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = msg;
        errorsDiv.appendChild(div);
      });
    });
  });
  loadComments();
});
