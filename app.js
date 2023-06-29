//requerimiento..basico de proveedor, base de datos y flow//
const axios = require('axios');
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const FormData = require('form-data');
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock');
const { addAnswer } = require('@bot-whatsapp/bot');
const { options } = require('nodemon/lib/config');
const { downloadMediaMessage } = require("@adiwajshing/baileys")
const fs = require('fs');
const DIR_IMGS = './imgs';
const {flowGrupos, subMenuGrupos, subMenuGeneralElitesAuth} = require('./Flows/FlowGrupos')
//Variables en memoria (Mala practica, cambiar urgente)
let nombre_apellido;
let dni;
let email;

//TODO: Mover todos los flows a sus respectivos files
//TODO: Todas las funciones tienen que tercerizarse
const flujoContacto = addKeyword(['contacto', '⬅️ Volver al Inicio', 'Contacto'])
.addAnswer(['Bien, ahora vamos a necesitar su nombre y apellido!', 'Ingreselo a continuacion'],
{capture: true},
async (ctx, { flowDynamic }) => {
    nombre_apellido = ctx.body
    return flowDynamic(`Encantado *${nombre_apellido}*, continuamos...`)
})
.addAnswer(
    ['También necesito su email'],
    {capture: true},
    async (ctx, { flowDynamic, endFlow }) => {
    email = ctx.body
    if(!ctx.body.includes('@')) {
        await flowDynamic('No es un email valido')
        return endFlow()
    }
    return flowDynamic(`Perfecto, un poquito mas`)
    })
    .addAnswer(["Ahora necesito una foto de su DNI"],
    {capture : true},
        async (ctx,{flowDynamic}) => {
            try {
                const buffer = await downloadMediaMessage(ctx, 'buffer');
                const pathtoimg = `${process.cwd()}/imgs/${ctx.from}.jpg`;
                await fs.writeFile(pathtoimg, Buffer.from(buffer),(err) =>{if(err) return null});
                return true;
              } catch (error) {
                console.error('Error writing file:', error);
                return false;
              }
    })
    .addAnswer(
        ['Dejeme su DNI'],
        { capture: true},

        async (ctx, { flowDynamic }) => {
                dni = ctx.body
                //FlowDynamic es un addAnwser pero dinamico, osea si entra en una condicional podes mostrar un mensaje u el otro
                //En este caso lo uso para mandar el nombre del cliente, lo separo en una array y lo muestro en la posicion 0
                return flowDynamic(`Estupendo *${nombre_apellido.split(' ')[0]}*! te dejo el resumen de tu formulario
                \n- Nombre y apellidos: ${nombre_apellido}
                \n- DNI: *${dni}*
                \n- Email: *${email}*
                \n- Telefono: *${ctx.from}*` )
                
        }
    )
    .addAnswer(
        ['Sus datos han sido guardados...']
    ).addAction(
       async (ctx,{endFlow, flowDynamic}) =>{
        try {
          //Esto tendria que ser una funcion aparte y moverla a la carpeta utils pero por falta de tiempo se queda aca
          //Genera un numero aleatorio despues lo redondea y despues se lo agrega al usuario que se registro.
          /*
          * IMPORTANTE: El bot necesita un cambio completo en su codigo, ya que contacto se puede repetir infinita veces
          * y un ataque malicioso puede repetir muchas veces este proceso y sobrecargar la base de datos
          */ 
            let random = Math.random();
            let scaled = Math.floor(Math.floor(random * 9999) + 1)
            fs.readdir(DIR_IMGS, async (error, archivos) => {
              if (error) {
                console.error('Error al leer el directorio:', error);
                return;
              }
              // Buscar el archivo por su título
              const imagenEncontrada = archivos.find((archivo) => archivo === `${ctx.from}.jpg`);
              if (imagenEncontrada) {
                // La imagen fue encontrada
                const rutaImagen = `${DIR_IMGS}/${imagenEncontrada}`;
                console.log('Ruta de la imagen encontrada:', rutaImagen);
          
                // Leer el archivo de la imagen
                const imagenData = fs.readFileSync(rutaImagen);
          
                // Crear un objeto FormData
                const formData = new FormData();
          
                // Agregar la imagen al FormData
                formData.append('files.fotoDNI', imagenData, { filename: imagenEncontrada });
                //Muy mala practica dios mio, mover la peticion a una file aparte, 
                //la url debe estar en un env no en el codigo
                let json = {
                    "data": {
                      "username": nombre_apellido,
                      "dni": dni,
                      "email": email,
                      "telefono": ctx.from,
                      "idCliente": `#${scaled}`
                    }
                  };
                  formData.append('data', JSON.stringify(json.data));
                // Configurar la solicitud POST con Axios
                const options = {
                  method: 'post',
                  url: 'https://strapi-5kbn.onrender.com/api/contactos',
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                };
          
                const response = await axios(options);
                await flowDynamic(`Perfecto, su id es #${scaled}`);
                return endFlow();
              } else {
                console.log('La imagen no fue encontrada');
              }
            });
          } catch (e) {
            console.log(e);
          }
          
        }
    )

    const flujoFacebook = addKeyword(['Facebook', 'facebook'])
    .addAnswer(['Darle like, seguir la página y dejar comentarios sobre la experiencia con la doctora.',
     'https://www.facebook.com/DraMontesCarrillo?mibextid=LQQJ4d'])
    const flujoTelegram=addKeyword('telegram')
    .addAnswer('Encontraras ejercicios y audios de Marilu Carrillo')
    .addAnswer('https://t.me/c/1495986832/502')
    const flujoYoutube=addKeyword('radiactivo')
    .addAnswer('Videos y clases de Marilu Carrillo')
    .addAnswer('https://www.youtube.com/@SomosRadioactivo')
    
//Agregar botones es posible pero solo para versiones actualizadas de WhatsApp, no es recomendable utilizarlos 

const flowInicio=addKeyword([EVENTS.WELCOME, '❌ Cancelar solicitud'],
{
    sensitive:false
}

).addAnswer([
    'Bienvenido a los grupos de *Resonancia* de la *Doctora Marilu Carrillo*'])
.addAnswer('A continuación....encontrarás algunas de las opciones que ofrece RESONANCIA.')

.addAnswer([
    'Escribe *Contacto* para incorporar tus datos al sistema',
    'Escribe *Grupos* para integrar los mismos según la conferencia tomada o si entrarás como inicial',
    'Escribe *Facebook* para ayudar a la comunidad',
    'Escribe *Radiactivo* videos interesantes para oirlos y comprenderlos',
    'Escribe *Telegram* información, audios y ejercicios sobre Resonancia',
],
null,
null,
[flowGrupos,flujoFacebook, flujoContacto, flujoTelegram, flujoYoutube],)

//Constantes que no se usan en el bot, borrar las para ahorra espacio en el codigo
const flowNotadevoz=addKeyword([EVENTS.VOICE_NOTE]).addAnswer('En un momento escuchamos tu mensaje')
const flowMedia=addKeyword([EVENTS.MEDIA]).addAnswer('Hemos recibido tu archivo')
const flowDoc=addKeyword([EVENTS.DOCUMENT]).addAnswer('Hemos recibido tu documento')
const flowSalida=addKeyword(['adios', 'chau', 'by'],
{
    sensitive:false
}

).addAnswer('*Gracias por haberte contactado*!!!')

    const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowInicio,flowSalida, flowNotadevoz, flowMedia, flowDoc, subMenuGrupos, subMenuGeneralElitesAuth, subMenuGeneralElitesAuth])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
