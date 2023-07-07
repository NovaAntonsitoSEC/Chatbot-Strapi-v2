const { downloadMediaMessage } = require("@adiwajshing/baileys");
const fs = require("fs");
const isImage = require("is-image");
const handleFotos = async (ctx, number) => {
  try {
    const buffer = await downloadMediaMessage(ctx, "buffer");
    const pathtoimg = `${process.cwd()}/imgs/${number}.jpg`;
    await fs.writeFile(pathtoimg, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error("Error writing file:", error);
    return false;
  }
};

const checkifImg = async (buffer) => {
  // Verificar los primeros bytes del buffer para determinar si es una imagen JPEG o PNG
  const isJPEG = buffer[0] === 0xff && buffer[1] === 0xd8; // Verificar los bytes iniciales de un JPEG
  const isPNG =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47; // Verificar los bytes iniciales de un PNG

  if (!isJPEG && !isPNG) {
    console.error("El archivo no es una imagen");
    return false;
  }

  const extension = isJPEG ? "jpg" : "png";
  
  return extension;
};

module.exports = { checkifImg };
