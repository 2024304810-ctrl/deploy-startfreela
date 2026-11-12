export default async function logout(){
    await fetch("/logout", {method: "POST"});
    localStorage.removeItem("token");
    window.location.href="/login";  
};


