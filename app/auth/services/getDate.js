function getDate(){
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
}

module.exports=getDate;