const { addAnswer, addKeyword, EVENTS, endFlow, flowDynamic } = require('@bot-whatsapp/bot');
const {isAUser, handleIDUnique} = require('../Utils/getUsers');

let idUser;
const flowGrupos = addKeyword(['grupos', 'Grupos'])
.addAnswer(['Consultando a nuestra base de datos'])
.addAction(async (ctx, {flowDynamic, endFlow, gotoFlow})=>{
    const verify = await isAUser(ctx.from)
    //Placeholder va verify
    if(true){
        await flowDynamic([
        'Ok, usted esta en nuestra base de datos', 
        'Puede acceder a nuestros grupos',
        'Por favor ingrese el numero del grupo que desea entrar',
        '*1* Inside',
        '*2* Metamorfosis',
        '*3* Avanzados Alpha (Catarsis, Atlantes, Atlas, Dioses, Alquimia)',
        '*4* Avanzados Beta (Pandora, Genesis, Quantum)',
        '*5* Amor',
        '*6* Generales/Elites (2.0)',
        '*7* Generales'])
        return gotoFlow(subMenuGrupos)
    }else{
        await flowDynamic(['No esta en nuestra base de datos', 'Escriba Contacto para poder entrar a nuestros grupos!'])
        return endFlow()
    }
})

const subMenuGrupos = addKeyword(['1', '2', '3', '4', '5', '6', '7']).addAction(
    async (ctx, { flowDynamic, endFlow, gotoFlow }) => {
        switch (ctx.body) {
            case '1': return flowDynamic(['Este es el grupo de Inside', 'https://chat.whatsapp.com/DKRBcf7KZMh3AU5MxnDSmi']);
            case '2': return flowDynamic(['Este es el grupo de Metamorfosis', 'https://chat.whatsapp.com/K86Q8iD6tj6FIFltiA4uOF']);
            case '3': return flowDynamic(['Este es el grupo de Avanzados Alpha', 'https://chat.whatsapp.com/BOmEA0TPLFgDSLiBlGnQZ9']);
            case '4': return flowDynamic(['Este es el grupo de Avanzados Beta', 'https://chat.whatsapp.com/FBEYcB2zU3g1srLq6twYzB']);
            case '5': return flowDynamic(['Este es el grupo de Amor', 'https://chat.whatsapp.com/F1UiF5mUgFy7c2LSglHtgN']);
            case '6':
                return gotoFlow(subMenuGeneralElitesAuth)
            case '7': 
                return gotoFlow(subMenuGeneralAuth)
        }
    }
);

const subMenuGeneralElitesAuth = addKeyword('7').addAnswer(['Ingrese su id de contacto'], 
{capture : true},(ctx)=>idUser = ctx.body
).addAction(
    async(ctx,{flowDynamic,endFlow})=>{
        const objectProto = await handleIDUnique(idUser);

        if(!(typeof objectProto === 'boolean')){    
            await flowDynamic([`Bienvenido/a `,'Este es el grupo General/Elite', 'https://chat.whatsapp.com/LCTAFL16tRF6OUOa91Dmkb'])
            return endFlow()
        }else{
            await flowDynamic(['La id no corresponde a un usuario existente'])
            return endFlow()
        }
    }
)
const subMenuGeneralAuth = addKeyword('8').addAnswer(['Ingrese su id de contacto'], 
{capture : true},(ctx)=>idUser = ctx.body).addAction(
    async(ctx,{flowDynamic,endFlow})=>{
        const objectProto = await handleIDUnique(idUser);

        if(!(typeof objectProto === 'boolean')){    
            await flowDynamic([`Bienvenido/a `,'Este es el grupo General', 'https://chat.whatsapp.com/DrMAMUhK4Bk6N9Pw7SA0GF'])
            return endFlow()
        }else{
            await flowDynamic(['La id no corresponde a un usuario existente'])
            return endFlow()
        }
    }
)
module.exports = {flowGrupos,subMenuGrupos, subMenuGeneralElitesAuth, subMenuGeneralAuth}