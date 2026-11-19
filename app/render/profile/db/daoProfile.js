
const Usuario = require('../../../auth/register/model/UsuarioSchema');

async function daoPerfilTecnico(idPerfil, req) {
    const idUsuarioAtual = req.usuario.idUser ?? req.usuario.id;

    const perfil = await Usuario.findOne({
        idUser: idPerfil
    }).lean();

    const usuario = await Usuario.findOne({
        idUser: idUsuarioAtual
    }).lean();

    if (!perfil) {
        return {
            perfil: null,
            usuario,
            mesmoUsuario: false
        };
    }

    // Preparar localização
    let localizacaoTexto = '';

    if (perfil.localizacao && typeof perfil.localizacao === 'object') {
        const { cidade, estado, pais } = perfil.localizacao;

        localizacaoTexto = [cidade, estado, pais]
            .filter(Boolean)
            .join(', ');
    } else if (typeof perfil.localizacao === 'string') {
        localizacaoTexto = perfil.localizacao;
    }

    // Preparar redes sociais
    const redesSociais = (Array.isArray(perfil.redesSociais)
        ? perfil.redesSociais
        : [])
        .filter(rede =>
            rede &&
            typeof rede.site === 'string' &&
            typeof rede.link === 'string' &&
            rede.site.trim() &&
            rede.link.trim()
        )
        .map(rede => {
            let link = rede.link.trim();

            if (!/^https?:\/\//i.test(link)) {
                link = `https://${link}`;
            }

            try {
                const url = new URL(link);

                if (!['http:', 'https:'].includes(url.protocol)) {
                    return null;
                }

                return {
                    site: rede.site,
                    link: url.href
                };
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    // Preparar habilidades
    const habilidades = Array.isArray(perfil.habilidades)
        ? perfil.habilidades
            .filter(habilidade =>
                typeof habilidade === 'string' &&
                habilidade.trim().length > 0
            )
            .map(habilidade => habilidade.trim())
        : [];

    const mesmoUsuario =
        String(perfil.idUser) === String(idUsuarioAtual);

    return {
        perfil: {
            ...perfil,
            localizacaoTexto,
            redesSociais,
            habilidades,
            possuiHabilidades: habilidades.length > 0
        },
        usuario,
        mesmoUsuario
    };
}

module.exports = daoPerfilTecnico;
