
const cloudinary = require('../../../repositories/cloud/cloudinary');

async function excluirArquivoCloudinary(url, tipo = 'image') {
    if (!url) return;

    try {
        const partes = url.split('/');
        const indiceUpload = partes.indexOf('upload');

        if (indiceUpload === -1) {
            throw new Error('URL inválida do Cloudinary.');
        }

        const caminhoArquivo = partes
            .slice(indiceUpload + 1)
            .join('/')
            .replace(/^v\d+\//, '');

        const publicId = caminhoArquivo.replace(/\.[^/.]+$/, '');

        await cloudinary.uploader.destroy(publicId, {
            resource_type: tipo
        });

    } catch (erro) {
        console.error('Erro ao excluir arquivo do Cloudinary:', erro);
        throw erro;
    }
}

module.exports = excluirArquivoCloudinary;
