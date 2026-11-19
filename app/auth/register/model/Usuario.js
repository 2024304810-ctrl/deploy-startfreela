class Usuario{

    constructor(idUser,completeName, username, email, dateOfBirth, phone, contato, password, passwordConf, role, ativo, premium, createdIn, informacoesAdicionais){
        this.idUser = idUser;
        this.completeName = completeName;
        this.username = username;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.contato = contato;
        this.password = password;
        this.passwordConf = passwordConf;
        this.role = role;
        this.ativo = ativo;
        this.premium = premium;
        this.createdIn = createdIn;
        this.informacoesAdicionais = informacoesAdicionais;
    }

}

module.exports = Usuario;