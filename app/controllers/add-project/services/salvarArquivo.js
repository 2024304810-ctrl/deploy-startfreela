
const cloudinary = require('../../../repositories/cloud/cloudinary');
const streamifier = require('streamifier');

async function salvarArquivo(buffer, nomeArquivo) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'startfreela/portfolio/anexos',
                use_filename: true,
                unique_filename: true,
                filename_override: nomeArquivo
            },
            (erro, resultado) => {
                if (erro) {
                    return reject(erro);
                }

                if (!resultado?.secure_url) {
                    return reject(
                        new Error('O Cloudinary não retornou a URL do arquivo.')
                    );
                }

                resolve(resultado.secure_url);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

module.exports = salvarArquivo;
