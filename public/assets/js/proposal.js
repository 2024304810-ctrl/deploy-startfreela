import logout from '/js.utils/logout.js';

console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

// =========================
// SALVAR PROJETO
// =========================

const saveButton = document.querySelector("#save-button");
const saveText = document.querySelector("#save-text");
const saveIcon = document.querySelector("#save-icon");

let saved = false;

saveButton.addEventListener("click", () => {

    saved = !saved;

    saveButton.classList.toggle("is-saved", saved);

    saveText.textContent = saved
        ? "Projeto salvo"
        : "Salvar projeto";

    saveIcon.className = saved
        ? "fa-solid fa-bookmark"
        : "fa-regular fa-bookmark";

    showToast(
        saved
            ? "Projeto salvo nesta demonstração."
            : "Projeto removido dos salvos nesta demonstração."
    );

});


// =========================
// AVISOS TEMPORÁRIOS
// =========================

const toast = document.querySelector("#toast");

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.remove("hidden");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.add("hidden");

    }, 3200);

}


// =========================
// ABRIR MODAL DE CANDIDATURA
// =========================

const modal = document.querySelector("#application-modal");

const applyButton = document.querySelector("#apply-button");

const closeModalButton = document.querySelector("#close-modal");


function openModal() {

    modal.classList.remove("hidden");

    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    document.querySelector("#proposal-price").focus();

}


function closeModal() {

    modal.classList.add("hidden");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


applyButton.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeModal);


// Fecha ao clicar fora do formulário.

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        closeModal();

    }

});


// Fecha ao pressionar ESC.

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        !modal.classList.contains("hidden")
    ) {

        closeModal();

    }

});


// =========================
// FORMULÁRIO DE CANDIDATURA
// =========================

const form = document.querySelector("#application-form");

const feedback = document.querySelector("#form-feedback");


form.addEventListener("submit", (event) => {

    event.preventDefault();

    const price = Number(
        document.querySelector("#proposal-price").value
    );

    const deadline = Number(
        document.querySelector("#proposal-deadline").value
    );

    const message = document
        .querySelector("#proposal-message")
        .value
        .trim();


    // Validação dos campos.

    if (
        price <= 0 ||
        deadline <= 0 ||
        message.length < 20
    ) {

        feedback.textContent =
            "Confira os campos. A mensagem precisa ter pelo menos 20 caracteres.";

        return;

    }


    /*
       Por enquanto, os dados são apenas validados.

       Posteriormente, você poderá enviar os dados para
       uma rota Express e salvá-los no MongoDB.
    */

    feedback.textContent =
        "Dados validados! Esta demonstração ainda não envia a proposta ao servidor.";

    showToast(
        "Proposta validada, mas ainda não enviada."
    );


    // Exibe os dados no console para testes.

    console.log("Proposta de demonstração:", {

        project: "Desenvolvimento de site institucional",

        price: price,

        deadlineDays: deadline,

        message: message

    });

});


// =========================
// OPÇÕES DO CLIENTE
// =========================

const clientMore = document.querySelector("#client-more");

clientMore.addEventListener("click", () => {

    showToast(
        "As opções do cliente poderão ser conectadas ao perfil real."
    );

});


// =========================
// CAMPO DE BUSCA
// =========================

const searchInput = document.querySelector("#global-search");

searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        const query = event.currentTarget.value.trim();

        if (query) {

            showToast(
                `A busca por "${query}" ainda precisa ser conectada ao servidor.`
            );

        }

    }

});