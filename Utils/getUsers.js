const axios = require('axios')

const isAUser = async (number) => {
    try{
    const options = {
        method : "get",
        url : `https://strapi-5kbn.onrender.com/api/contactos?filters[telefono][$eq]=${number}`,
    }
    const response = await axios(options)
    if(response.data.data.length === 0){
        return false
    }
    return true
    }catch(e){
        console.log(e);
    }
}


const handleIDUnique = async (number) =>{
    try {
        const idCliente = encodeURIComponent("#" + number);
        console.log(idCliente);
        const options = {
            method: "get",
            url: `https://strapi-5kbn.onrender.com/api/contactos?filters[idCliente][$eq]=${idCliente}`,
        }
 
        const response = await axios(options);
        if (response.data.data.length === 0) {
            return false;
        }
        return response.data.data.attributes.username;
    } catch (error) {
        console.log(error);
    }
} 

module.exports = {isAUser, handleIDUnique}