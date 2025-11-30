const API_URL = 'http://127.0.0.1:3000/alunos';

const alunosList = document.getElementById("alunos-list");
const form = document.getElementById("aluno-form");
const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const cursoInput = document.getElementById("curso");

const submitButton = form.querySelector("button[type='submit']");
let editId = null;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const alunoData = {
        nome: nomeInput.value,
        idade: parseInt(idadeInput.value),
        curso: cursoInput.value,
    };

    if (editId) {
        await fetch(`${API_URL}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alunoData),
        });
        
        editId = null;
        submitButton.textContent = "Cadastrar Aluno";
        submitButton.classList.remove("btn-warning");
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alunoData),
        });
    }

    nomeInput.value = "";
    idadeInput.value = "";
    cursoInput.value = "";
    carregarAlunos();
});

async function carregarAlunos() {
    try {
        const res = await fetch(API_URL);
        const alunos = await res.json();

        alunosList.innerHTML = "";

        alunos.forEach(aluno => {
            const li = document.createElement("li");
            li.innerHTML = `
            <div class="info">
                <strong>${aluno.nome}</strong> (${aluno.idade} anos) 
                <br><span class='curso'>${aluno.curso}</span>
            </div>
            <div class="actions">
                <button class="editar" onclick="prepararEdicao('${aluno._id}')">Editar</button>
                <button class="excluir" onclick="deletarAluno('${aluno._id}')">Excluir</button>
            </div>
            `;
            alunosList.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }
}

async function deletarAluno(id) {
    if (confirm("Deseja realmente apagar o registro?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        carregarAlunos();
    }
}

async function prepararEdicao(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const aluno = await res.json();

    nomeInput.value = aluno.nome;
    idadeInput.value = aluno.idade;
    cursoInput.value = aluno.curso;

    editId = id;
    submitButton.textContent = "Atualizar Aluno";
}

carregarAlunos();