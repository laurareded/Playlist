document.addEventListener("DOMContentLoaded", function () {
  // Controle de navegação (páginas)
  const home = document.getElementById("home");
  const secMusicas = document.getElementById("sec-musicas");
  const secPlaylists = document.getElementById("sec-playlists");

  document.getElementById("btn-musicas").onclick = function () {
    home.style.display = "none";
    secMusicas.style.display = "block";
    secPlaylists.style.display = "none";
  }
  document.getElementById("btn-playlists").onclick = function () {
    home.style.display = "none";
    secMusicas.style.display = "none";
    secPlaylists.style.display = "block";
  }
  secMusicas.querySelector(".back-btn").onclick = function () {
    secMusicas.style.display = "none";
    secPlaylists.style.display = "none";
    home.style.display = "block";
  }
  secPlaylists.querySelector(".back-btn").onclick = function () {
    secMusicas.style.display = "none";
    secPlaylists.style.display = "none";
    home.style.display = "block";
  }

  // === CRUD de MÚSICA ===
  const base = "http://localhost:5159/api/Musica";

  // Cadastrar Musica
  document.getElementById("form-cadastrar").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const artista = document.getElementById("artista").value;

    try {
      const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, artista })
      });
      if (!res.ok) throw new Error();
      alert("Música cadastrada com sucesso!");
      document.getElementById("form-cadastrar").reset();
      listarMusicas();
    } catch {
      alert("Erro ao cadastrar Música!");
    }
  });

  // Listar Musicas
  async function listarMusicas() {
    try {
      const res = await fetch(base);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const ul = document.getElementById("listagem");
      ul.innerHTML = "";
      data.forEach(musica => {
        const li = document.createElement("li");
        li.textContent = `ID: ${musica.id} - Nome: ${musica.nome} - Artista: ${musica.artista} `;
        ul.appendChild(li);
      });
    } catch {
      alert("Erro ao buscar Música!");
    }
  }
  document.getElementById("btn-listar").addEventListener("click", listarMusicas);

  // Buscar Musica por ID
  document.getElementById("btn-buscar-id").addEventListener("click", async function () {
    const id = document.getElementById("id-buscar").value;
    if (!id) return alert("Informe um ID válido.");
    try {
      const res = await fetch(`${base}/${id}`);
      if (!res.ok) throw new Error();
      const musica = await res.json();
      const ul = document.getElementById("id-listagem");
      ul.innerHTML = "";
      const li = document.createElement("li");
      li.textContent = `ID: ${musica.id} - Nome: ${musica.nome} - Artista: ${musica.artista}`;
      ul.appendChild(li);
    } catch {
      alert("Erro ao buscar Música!");
    }
  });

  // Excluir Musica por ID 
  document.getElementById("btn-excluir-id").addEventListener("click", async function () {
    const id = document.getElementById("id-excluir").value;
    if (!id) return alert("Informe um ID válido.");
    excluirMusica(id);
  });

  async function excluirMusica(id) {
    if (!confirm(`Tem certeza que deseja excluir a Música com ID ${id}?`)) return;
    try {
      const res = await fetch(`${base}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      alert("Música excluída!");
      listarMusicas();
    } catch {
      alert("Erro ao excluir Música!");
    }
  }

  // Buscar música para editar
  document.getElementById("btn-editar-id").addEventListener("click", async function () {
    const id = document.getElementById("id-editar").value;
    if (!id) return alert("Informe um ID válido.");
    try {
      const res = await fetch(`${base}/${id}`);
      if (!res.ok) throw new Error();
      const musica = await res.json();
      document.getElementById("edit-section").style.display = "block";
      document.getElementById("edit-nome").value = musica.nome;
      document.getElementById("edit-artista").value = musica.artista;
      document.getElementById("btn-atualizar").setAttribute("data-id", musica.id);
    } catch {
      alert("Erro ao buscar música para editar!");
      document.getElementById("edit-section").style.display = "none";
    }
  });

  // Atualizar música
  document.getElementById("btn-atualizar").addEventListener("click", async function () {
    const id = this.getAttribute("data-id");
    const nome = document.getElementById("edit-nome").value;
    const artista = document.getElementById("edit-artista").value;
    if (!id) return alert("Nenhuma música selecionada para atualizar!");
    try {
      const res = await fetch(`${base}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nome, artista })
      });
      if (!res.ok) throw new Error();
      alert("Música atualizada!");
      document.getElementById("edit-section").style.display = "none";
      listarMusicas();
    } catch {
      alert("Erro ao atualizar música!");
    }
  });

  // === CRUD de PLAYLIST ===
  const playlistBase = "http://localhost:5159/api/Playlist";

  // Criar Playlist
  document.getElementById("form-criar-playlist").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = document.getElementById("playlist-nome").value;
    try {
      const res = await fetch(playlistBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
      });
      if (!res.ok) throw new Error();
      alert("Playlist criada com sucesso!");
      document.getElementById("form-criar-playlist").reset();
      listarPlaylists();
    } catch {
      alert("Erro ao criar playlist!");
    }
  });

  // Listar Playlists
  async function listarPlaylists() {
    try {
      const res = await fetch(playlistBase);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const ul = document.getElementById("listagem-playlists");
      ul.innerHTML = "";
      data.forEach(playlist => {
        let musicas = "";
        if (playlist.playlistMusicas && playlist.playlistMusicas.length > 0) {
          musicas = " | Músicas: " + playlist.playlistMusicas.map(pm =>
            `(${pm.musica.id} - ${pm.musica.nome} - ${pm.musica.artista})`
          ).join(", ");
        } else {
          musicas = " | Nenhuma música";
        }
        const li = document.createElement("li");
        li.textContent = `ID: ${playlist.id} - Nome: ${playlist.nome}${musicas}`;
        ul.appendChild(li);
      });
    } catch {
      alert("Erro ao buscar playlists!");
    }
  }
  document.getElementById("btn-listar-playlists").addEventListener("click", listarPlaylists);

  // Adicionar música à playlist
  document.getElementById("form-add-musica-playlist").addEventListener("submit", async function (e) {
    e.preventDefault();
    const playlistId = document.getElementById("add-playlist-id").value;
    const musicaId = document.getElementById("add-musica-id").value;
    try {
      const res = await fetch(`${playlistBase}/${playlistId}/AdicionarMusica/${musicaId}`, {
        method: "POST"
      });
      if (!res.ok) throw new Error();
      alert("Música adicionada à playlist!");
      this.reset();
      listarPlaylists();
    } catch {
      alert("Erro ao adicionar música!");
    }
  });

  // Remover música da playlist
  document.getElementById("form-remove-musica-playlist").addEventListener("submit", async function (e) {
    e.preventDefault();
    const playlistId = document.getElementById("remove-playlist-id").value;
    const musicaId = document.getElementById("remove-musica-id").value;
    try {
      const res = await fetch(`${playlistBase}/${playlistId}/RemoverMusica/${musicaId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error();
      alert("Música removida da playlist!");
      this.reset();
      listarPlaylists();
    } catch {
      alert("Erro ao remover música!");
    }
  });

  // Carregar listas ao abrir
  //listarMusicas();
  //listarPlaylists();
});
