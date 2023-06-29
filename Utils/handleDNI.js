const { downloadMediaMessage } = require("@adiwajshing/baileys")
const fs = require('fs');

const handleFotos = async (ctx, number) => {
    try {
      const buffer = await downloadMediaMessage(ctx, "buffer");
      const pathtoimg = `${process.cwd()}/imgs/${number}.jpg`;
      await fs.writeFile(pathtoimg, Buffer.from(buffer));
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  };


module.exports = {handleFotos}