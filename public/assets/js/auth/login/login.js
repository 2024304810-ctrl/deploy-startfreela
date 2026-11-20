
function toggleColor() {
    const body = document.body;
    const header = document.getElementById("header");
    const heroPrincipal = document.getElementById("heroPrincipal");

    body.classList.toggle("dark");

    if (header) {
        header.classList.toggle("dark");
    }

    if (heroPrincipal) {
        heroPrincipal.classList.toggle("dark");
    }

    localStorage.setItem(
        "theme",
        body.classList.contains("dark") ? "dark" : "light"
    );
}

function toggleEye() {
    const password = document.getElementById("password");
    const imageEye = document.getElementById("image-eye");

    const isPassword = password.type === "password";
    password.type = isPassword ? "text" : "password";

    imageEye.src = isPassword
        ? "/img/closedeye.png"
        : "/img/openeye.png";
}

// Aplicar tema salvo
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");

        document.getElementById("header")?.classList.add("dark");
        document.getElementById("heroPrincipal")?.classList.add("dark");
    }
});

const formLogin = document.getElementById("formulario");

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: password
            })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("token", data.token);

            if (data.informacoesAdicionaisConcluidas) {
                window.location.href = "/home";
            } else {
                window.location.href = "/additional.information";
            }

        } else {
            document.getElementById("email").classList.add("erro");
            document.getElementById("password").classList.add("erro");
        }

    } catch (error) {
        console.error("Erro ao realizar login:", error);
        alert("Não foi possível realizar o login. Tente novamente.");
    }
});
