const sharp = require('sharp');
const Tesseract = require('tesseract.js');

const preprocessImage = async (inputBuffer) => {
    try {
        const processedBuffer = await sharp(inputBuffer)
            .sharpen({sigma: 2})
            .grayscale()
            .toBuffer();

        return processedBuffer;
    } catch (error) {
        console.error('Error while processing image:', error);
        throw error;
    }
}

const extractTextFromImage = async (buffer) => {
    try {
        const result = await Tesseract.recognize(buffer, 'eng', {
            logger: (info) => console.log(info), // Лог прогресса
        });
        return result.data.text;
    } catch (error) {
        console.error('Error recognizing text:', error);
        throw error;
    }
}

module.exports = {
    preprocessImage,
    extractTextFromImage
};
