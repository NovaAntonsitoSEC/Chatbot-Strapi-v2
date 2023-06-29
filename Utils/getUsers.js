const axios = require('axios')

const isAUser = async (number) => {
    try{
    const options = {
        method : "get",
        url : `http://localhost:1337/api/contacts?filters[telefono][$eq]=${number}`,
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
            url: `http://localhost:1337/api/contacts?filters[idCliente][$eq]=${idCliente}`,
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