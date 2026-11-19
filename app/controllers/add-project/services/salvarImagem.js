const cloudinary = require('../../../repositories/cloud/cloudinary');
const streamifier = require('streamifier');

async function salvarImagem(buffer){
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image'
            },
            (erro, result) => {
                if(erro){
                    reject(erro);
                    return;
                }

                console.log('salvando imagem:', result.url);

                resolve(result.url);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream)
    });
}

module.exports=salvarImagem;