console.log("DESATIVAR AUTOCOMPLETE CARREGADO!");

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        form.setAttribute('autocomplete', 'off');
    });

    document.querySelectorAll('input, textarea').forEach(campo => {
        campo.setAttribute('autocomplete', 'off');
    });

    console.log("Autocomplete desativado nos campos!");
});