import logout from '/js.utils/logout.js';

document.getElementById('sair').addEventListener('click', () => { logout() });

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

const searchButton = document.querySelector("#searchButton");

const projectSearch = document.querySelector("#projectSearch");

const projects = document.querySelectorAll(".project-card");

function pesquisarProjetos() {
    const pesquisa = projectSearch.value.toLowerCase().trim();

    if (!pesquisa) {
        projects.forEach(project => {
            project.style.display = "block";
        });
        return;
    }

    projects.forEach(project => {
        const texto = project.innerText.toLowerCase();

        if (texto.includes(pesquisa)) {
            project.style.display = "block";
        } else {
            project.style.display = "none";
        }
    });
}

searchButton.addEventListener("click", pesquisarProjetos);

projectSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        pesquisarProjetos();
    }
});

const headerSearch = document.querySelector("#searchButton");

headerSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        projectSearch.value = headerSearch.value;
        
        pesquisarProjetos();

        projectSearch.scrollIntoView({
            behavior: "smooth"
        });
    }
});

const categories = document.querySelectorAll(".category");

categories.forEach(category => {
    category.addEventListener("click", () => {
            const categoria = category.querySelector("h3").textContent.toLowerCase();

            projectSearch.value = categoria;

            pesquisarProjetos();

            document.querySelector(".projects-section").scrollIntoView({
                    behavior: "smooth"
            });

    });
});

const suggestions = document.querySelectorAll(".suggestions button");

suggestions.forEach(button => {
    button.addEventListener("click", () => {
            projectSearch.value = button.textContent;

            pesquisarProjetos();

            document.querySelector(".projects-section").scrollIntoView({
                    behavior: "smooth"
            });
    });
});

const favorites = document.querySelectorAll(".favorite");

favorites.forEach(button => {
    console.log('fazendo essa bomba');

    button.addEventListener("click", event => {
        console.log('clicou em favoritar');

            event.stopPropagation();

            button.classList.toggle("favorited");

            if(button.classList.contains("favorited")){
                button.textContent = "♥";
            } else {
                button.textContent = "♡";
            }
    });
});

const publishButton = document.querySelector("#publishButton");

publishButton.addEventListener("click", () => {
        alert("Aqui será aberta a tela de publicação de projetos.");
});

const notifications = document.querySelectorAll(".header-icon");

notifications.forEach(button => {
    button.addEventListener("click", () => {
        alert("Você não possui novas notificações.");
    });
});