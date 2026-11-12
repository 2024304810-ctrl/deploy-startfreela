function validarNumero(numero){
    const caracteresNumericos = numero.replace(/\D/g, '');

    const regex = /^[1-9]{2}(?:[2-8]|9[1-9])\d{7}$/;

    return regex.test(caracteresNumericos);
}

module.exports=validarNumero;