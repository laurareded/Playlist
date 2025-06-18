document.addEventListener("DOMContentLoaded", function () {
  const base = "http://localhost:5159/api/Musica";

  // Cadastrar Casa
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
      alert("Musica cadastrada com sucesso!");
      document.getElementById("form-cadastrar").reset();
      listarMusicas();
    } catch {
      alert("Erro ao cadastrar Musica!");
    }
  });

  // Listar Casas
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
        
        /*// Botão editar 
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editar";
        btnEdit.onclick = () => editarMusica(musica);
        li.appendChild(btnEdit);

        // Botão deletar
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Excluir";
        btnDelete.onclick = () => excluirMusica(musica.id);
        li.appendChild(btnDelete);*/

        ul.appendChild(li);
      });
    } catch {
      alert("Erro ao buscar Musica!");
    }
  }

  document.getElementById("btn-listar").addEventListener("click", listarMusicas);

  // Buscar Casa por ID
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
      alert("Erro ao buscar Musica!");
    }
  });

  // Excluir Casa por ID 
  document.getElementById("btn-excluir-id").addEventListener("click", async function () {
    const id = document.getElementById("id-excluir").value;
    if (!id) return alert("Informe um ID válido.");
    excluirMusica(id);
  });

  // Excluir Casa por botão
  async function excluirMusica(id) {
    if (!confirm(`Tem certeza que deseja excluir a Musica com ID ${id}?`)) return;
    try {
      const res = await fetch(`${base}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      alert("Musica excluída!");
      listarMusicas();
    } catch {
      alert("Erro ao excluir Musica!");
    }
  }

  // Editar Casa (preenche o form com os dados da Casa)
  function editarMusica(musica) {
    document.getElementById("nome").value = musica.nome;
    document.getElementById("artista").value = musica.artista;
    // Troca o submit para atualizar
    const form = document.getElementById("form-cadastrar");
    form.querySelector("button[type='submit']").textContent = "Atualizar";

    form.onsubmit = async function (e) {
      e.preventDefault();
      const nome = document.getElementById("nome").value;
      const artista = document.getElementById("artista").value;
      try {
        const res = await fetch(`${base}/${musica.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: musica.id, nome, artista })
        });
        if (!res.ok) throw new Error();
        alert("Musica atualizada!");
        form.reset();
        form.querySelector("button[type='submit']").textContent = "Cadastrar";
        form.onsubmit = defaultCadastrar; // Volta ao cadastro
        listarMusicas();
      } catch {
        alert("Erro ao atualizar Musica!");
      }
    }
  }

  // Função padrão pra cadastrar
  async function defaultCadastrar(e) {
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
      alert("Musica cadastrada com sucesso!");
      document.getElementById("form-cadastrar").reset();
      listarMusicas();
    } catch {
      alert("Erro ao cadastrar Musica!");
    }
  }

  // Função: Buscar música pelo ID para editar
document.getElementById("btn-editar-id").addEventListener("click", async function () {
  const id = document.getElementById("id-editar").value;
  if (!id) return alert("Informe um ID válido.");
  try {
    const res = await fetch(`${base}/${id}`);
    if (!res.ok) throw new Error();
    const musica = await res.json();
    // Mostra o form de edição preenchido
    document.getElementById("edit-section").style.display = "block";
    document.getElementById("edit-nome").value = musica.nome;
    document.getElementById("edit-artista").value = musica.artista;
    // Salva o id da música sendo editada
    document.getElementById("btn-atualizar").setAttribute("data-id", musica.id);
  } catch {
    alert("Erro ao buscar música para editar!");
    document.getElementById("edit-section").style.display = "none";
  }
});

// Função: Atualizar música pelo ID (depois de editar)
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



  // Carregar lista ao abrir a página
  listarMusicas();
});
