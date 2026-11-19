
const UsuarioSchema = require('../../../auth/register/model/UsuarioSchema');

async function renderizarFreelancers() {
    console.log('Buscando freelancers...');

    const freelancers = await UsuarioSchema.find({
        role: "Freelancer"
    }).lean();

    console.log('Total de freelancers:', freelancers.length);
    console.log('Freelancers encontrados:', freelancers);

    return freelancers;
}

module.exports = renderizarFreelancers;
