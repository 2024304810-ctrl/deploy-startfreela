
const Projeto = require('../models/ProjetoSchema');
const salvarImagem = require('../services/salvarImagem');
const salvarArquivo = require('../services/salvarArquivo');
const excluirArquivoCloudinary = require('../services/excluirArquivoCloudnary.js');

async function controllerEditarProjeto(idProjeto, idUser, body, arquivos) {
    try {
        const projeto = await Projeto.findOne({
            idProjeto: String(idProjeto),
            idUser: String(idUser)
        });

        if (!projeto) {
            return {
                success: false,
                status: 404,
                message: 'Projeto não encontrado.'
            };
        }

        const parseArray = (valor, padrao = []) => {
            if (!valor) return padrao;
            return typeof valor === 'string' ? JSON.parse(valor) : valor;
        };

        const habilidades = parseArray(body.habilidades);
        const imagensMantidas = parseArray(body.imagensExistentes);
        const anexosMantidos = parseArray(body.anexosExistentes);

        if (
            !body.titulo?.trim() ||
            !body.categoria ||
            !body.dataConclusao?.trim() ||
            !body.descricao?.trim() ||
            !Array.isArray(habilidades)
        ) {
            return {
                success: false,
                status: 400,
                message: 'Verifique os campos obrigatórios.'
            };
        }

        const imagensAntigas = projeto.imagensAdicionais || [];
        const anexosAntigos = projeto.anexos || [];

        const urlsImagensPermitidas = new Set(
            imagensAntigas.map(imagem => imagem.url)
        );

        const urlsAnexosPermitidos = new Set(
            anexosAntigos.map(anexo => anexo.url)
        );

        const novasImagensMantidas = imagensMantidas
            .filter(imagem => urlsImagensPermitidas.has(imagem.url))
            .map(imagem => ({
                url: imagem.url,
                legenda: imagem.legenda || ''
            }));

        const novosAnexosMantidos = anexosMantidos
            .filter(anexo => urlsAnexosPermitidos.has(anexo.url))
            .map(anexo => anexosAntigos.find(
                antigo => antigo.url === anexo.url
            ));

        const legendas = parseArray(body.legendasImagens);

        const imagensEnviadas = await Promise.all(
            (arquivos.imagensAdicionais || []).map(async (arquivo, indice) => ({
                url: await salvarImagem(arquivo.buffer),
                legenda: legendas[indice] || ''
            }))
        );

        const anexosEnviados = await Promise.all(
            (arquivos.anexos || []).map(async arquivo => ({
                nome: arquivo.originalname,
                url: await salvarArquivo(arquivo.buffer, arquivo.originalname),
                tipo: arquivo.mimetype,
                tamanho: arquivo.size
            }))
        );

        const capaAntiga = projeto.imagemCapa;

        if (arquivos.imagemCapa?.[0]) {
            projeto.imagemCapa = await salvarImagem(
                arquivos.imagemCapa[0].buffer
            );
        }

        projeto.titulo = body.titulo.trim();
        projeto.categoria = body.categoria;
        projeto.dataConclusao = body.dataConclusao.trim();
        projeto.descricao = body.descricao.trim();
        projeto.habilidades = habilidades;
        projeto.imagensAdicionais = [
            ...novasImagensMantidas,
            ...imagensEnviadas
        ];
        projeto.anexos = [
            ...novosAnexosMantidos,
            ...anexosEnviados
        ];
        projeto.links = {
            projeto: body.linkProjeto || '',
            github: body.linkGithub || ''
        };

        await projeto.save();

        const urlsImagensMantidas = new Set(
            novasImagensMantidas.map(imagem => imagem.url)
        );

        const urlsAnexosMantidos = new Set(
            novosAnexosMantidos.map(anexo => anexo.url)
        );

        for (const imagem of imagensAntigas) {
            if (!urlsImagensMantidas.has(imagem.url)) {
                await excluirArquivoCloudinary(imagem.url, 'image');
            }
        }

        for (const anexo of anexosAntigos) {
            if (!urlsAnexosMantidos.has(anexo.url)) {
                await excluirArquivoCloudinary(anexo.url, 'raw');
            }
        }

        if (arquivos.imagemCapa?.[0]) {
            await excluirArquivoCloudinary(capaAntiga, 'image');
        }

        return {
            success: true,
            status: 200,
            message: 'Projeto atualizado com sucesso!'
        };

    } catch (erro) {
        console.error('Erro ao editar projeto:', erro);

        return {
            success: false,
            status: 500,
            message: 'Não foi possível atualizar o projeto.'
        };
    }
}

module.exports = controllerEditarProjeto;
