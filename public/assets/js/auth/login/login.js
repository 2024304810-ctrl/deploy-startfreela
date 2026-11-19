function toggleColor(){
    const bttDarkMode = document.getElementById("change-theme");
    const body = document.body;

    body.classList.toggle("dark");
    document.getElementById("header").classList.toggle("dark");
    document.getElementById("heroPrincipal").classList.toggle("dark");
    
    if(body.classList.contains("dark")){
        localStorage.setItem("theme", "dark");
    }else{
        localStorage.setItem("theme", "light");
    }

    if(localStorage.getItem("theme") === "dark"){
        body.classList.add("dark");
        document.getElementById("header").classList.add("dark");
    }
}

function toggleEye(){
    let password = document.getElementById("password");
    let isPassword = password.type === 'password';
    password.type = isPassword ? 'text' : 'password';

    document.getElementById("image-eye").src = isPassword 
    ? '/img/closedeye.png'
    : '/img/openeye.png';
}

const formLogin = document.getElementById("formulario");
formLogin.addEventListener("submit", async(e) => {
    console.log("clicou");

    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log("Email: " + email);
    console.log("Senha: " + password);

    fetch("/api/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            email: email, 
            senha: password})
    }).then(response =>{
        console.log(response);
        return response.json();
    })
    .then(data => {
        console.log(data);
        if(data.success){
            localStorage.setItem("token", data.token);
            window.location.href = '/profile'; 
        }else{
            const mailInput = document.getElementById("email");
            const passInput = document.getElementById("password");

            mailInput.classList.add('erro');
            passInput.classList.add('erro');
        }
    });
});
