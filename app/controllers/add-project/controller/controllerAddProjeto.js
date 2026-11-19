
const salvarImagem = require('../services/salvarImagem');
const salvarArquivo = require('../services/salvarArquivo');
const daoAddProjeto = require('../db/daoAddProjeto');

async function controllerAddProjeto(projeto, arquivos) {
    try {
        if (
            !projeto.idUser ||
            !projeto.idProjeto ||
            !projeto.titulo?.trim() ||
            !projeto.categoria ||
            !projeto.dataConclusao?.trim() ||
            !projeto.descricao?.trim() ||
            !arquivos?.imagemCapa?.buffer
        ) {
            return {
                success: false,
                status: 400,
                message: 'Preencha os campos obrigatórios e adicione uma imagem de capa.'
            };
        }

        // Imagem de capa
        projeto.imagemCapa = await salvarImagem(
            arquivos.imagemCapa.buffer
        );

        // Imagens adicionais
        const imagensOriginais = projeto.imagensAdicionais || [];

        projeto.imagensAdicionais = await Promise.all(
            (arquivos.imagensAdicionais || []).map(
                async (arquivo, indice) => {
                    const legenda =
                        imagensOriginais[indice]?.legenda || '';

                    const url = await salvarImagem(arquivo.buffer);

                    return {
                        url,
                        legenda
                    };
                }
            )
        );

        // Anexos: documentos enviados como arquivos RAW
        projeto.anexos = await Promise.all(
            (arquivos.anexos || []).map(
                async arquivo => {
                    const url = await salvarArquivo(
                        arquivo.buffer,
                        arquivo.originalname
                    );

                    return {
                        nome: arquivo.originalname,
                        url,
                        tipo: arquivo.mimetype,
                        tamanho: arquivo.size
                    };
                }
            )
        );

        const projetoSalvo = await daoAddProjeto(projeto);

        return {
            success: true,
            status: 201,
            message: 'Projeto adicionado ao portfólio!',
            idProjeto: projetoSalvo.idProjeto
        };

    } catch (erro) {
        console.error('Erro no controller de portfólio:', erro);

        return {
            success: false,
            status: 500,
            message: 'Não foi possível salvar o projeto.'
        };
    }
}

module.exports = controllerAddProjeto;
