function gerarCodigo(){
    const min = 100000;
    const max = 999999;

    const num = Math.floor(Math.random() * (max - min + 1)) + min

    return num;
}

module.exports=gerarCodigo;