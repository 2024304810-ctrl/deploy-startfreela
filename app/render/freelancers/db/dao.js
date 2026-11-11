const Freelancers = require('../model/FreelancersSchema');

async function renderizarFreelancers(){
    console.log('dentro do render buscando os freelancers')

    const freelancers = await Freelancers.find({
        role: "Freelancer"
    }).lean();

    console.log("Freelancers pegado do render:", freelancers);

    return freelancers;
}

module.exports=renderizarFreelancers;