const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const botState = require("./state");
const User = require("../models/User");

const getStateByTelegramId = async (telegramId) => botState.getState(telegramId) || null;

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

/**
 * Extracts the amount from the text
 * @param text
 * Text example
 * Q Bangkok Bank
 * Transaction successful
 * 15 Jan 25,11:23
 * Amoun
 * 240.008
 * From @® MRVIKTOR SHATAEV
 * 970-0-xxx919
 * Bangkok Bank
 * To & K+ shop (KIDCHANA)
 * Biller ID:010753600031508
 * Merchant ID
 * KB000001879706
 * Transaction ID (Optional)
 * EMPKB000001879706005
 * Fee 0.00 THB
 * Bank reference no. =; ’ Hk [=]
 * 411018 x hn Fad
 * Transaction reference [0] jedan 4
 * 2025011511232023005097408 - oH
 * Scan fo verify
 * @returns {number|null}
 */
const extractAmount = (text) =>{
    const regex = /Amount\s+([\d,]+\.\d{2})/i;
    const match = text.match(regex);

    if (match) {
        return parseFloat(match[1].replace(',', ''));
    }

    return null;
}

module.exports = {
    preprocessImage,
    extractTextFromImage,
    extractAmount,
    getStateByTelegramId
};
