
const cloudinary = require('../../../repositories/cloud/cloudinary');
const streamifier = require('streamifier');

async function salvarImagem(buffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: 'startfreela/portfolio/imagens'
            },
            (erro, resultado) => {
                if (erro) {
                    return reject(erro);
                }

                if (!resultado?.secure_url) {
                    return reject(
                        new Error('O Cloudinary não retornou a URL da imagem.')
                    );
                }

                resolve(resultado.secure_url);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

module.exports = salvarImagem;
