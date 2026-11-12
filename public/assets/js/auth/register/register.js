localStorage.setItem("usuario", "Cliente");

console.log(localStorage.getItem("usuario"));

function toggleValue(){
    console.log('clicou');

    if(localStorage.getItem("usuario") === "Cliente"){
        document.getElementById("toggle-btn").value = "Freelancer";
        localStorage.setItem("usuario", "Freelancer");
        console.log(localStorage.getItem("usuario"));
    }else{
        document.getElementById("toggle-btn").value = "Cliente";
        localStorage.setItem("usuario", "Cliente");
        console.log(localStorage.getItem("usuario"));
    }
}

const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", async(e) => {
    e.preventDefault();

    let completeName = document.getElementById("nome-completo").value;
    let username = document.getElementById("nome-de-exibicao").value;
    let email = document.getElementById("email").value;
    let dateOfBirth = document.getElementById("data-de-nascimento").value;
    let phone = document.getElementById('telefone').value;
    let password = document.getElementById("senha").value;
    let passwordConf = document.getElementById("confirmar-senha").value;
    let role = localStorage.getItem("usuario");


    console.log("Nome Completo: ", completeName);
    console.log("Username: ", username);
    console.log("Email: ", email);
    console.log("Data de Nascimento: ", dateOfBirth);
    
    console.log("Senha: ", password);
    console.log("Confirmando Senha: ", passwordConf);
    console.log("Tipo de usuário: ", role);

    const resposta = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            completeName: completeName,
            username: username,     
            email: email,
            dateOfBirth: dateOfBirth,
            phone: phone,
            password: password,
            passwordConf: passwordConf,
            role: role
        })
    });

    const dados = await resposta.json();

    console.log(dados);

    if(dados.success){
        console.log('deu tudo certo');
        window.location.href='/login'
    }else{
        console.log('alguma coisa deu errado!');
    }
    
});