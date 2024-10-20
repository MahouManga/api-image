// services/fileService.js
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const { possibleExtensions } = require('../utils/constants');

const listarArquivos = (directory) => {
    if (!fs.existsSync(directory)) {
        return [];
    }

    return fs.readdirSync(directory).map((file) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        const fileExtension = path.extname(file);
        const fileName = path.basename(file, fileExtension);
        let dimensions = {};

        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension.toLowerCase())) {
            try {
                dimensions = sizeOf(filePath);
            } catch (err) {
                console.error(`Erro ao obter dimensões da imagem: ${filePath}`, err);
            }
        }

        return {
            name: fileName,
            archive: file,
            size: stats.size,
            width: dimensions.width,
            height: dimensions.height,
            created: stats.birthtime,
            modified: stats.mtime,
        };
    });
};

const servirArquivos = (directory, req, res) => {
    const name = req.params.name;
    for (const ext of possibleExtensions) {
        const filePath = path.join(directory, `${name}${ext}`);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }
    res.status(204).end();
};

module.exports = {
    listarArquivos,
    servirArquivos,
};