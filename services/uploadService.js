// services/uploadService.js
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size');

const extractZip = (zipFilePath, extractionPath) => {
    return new Promise((resolve, reject) => {
        const extractedImages = [];

        // Remover imagens antigas
        if (fs.existsSync(extractionPath)) {
            fs.readdirSync(extractionPath).forEach((file) => {
                const filePath = path.join(extractionPath, file);
                if (fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            });
        } else {
            fs.mkdirSync(extractionPath, { recursive: true });
        }

        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Parse())
            .on('entry', function (entry) {
                const fileName = entry.path;
                const fileExt = path.extname(fileName).toLowerCase();
                const newFileName = `${uuidv4()}${fileExt}`;
                const newFilePath = path.join(extractionPath, newFileName);

                entry
                    .pipe(fs.createWriteStream(newFilePath))
                    .on('finish', () => {
                        const fileStats = fs.statSync(newFilePath);
                        let dimensions = {};

                        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt)) {
                            try {
                                dimensions = sizeOf(newFilePath);
                            } catch (err) {
                                console.error(`Erro ao obter dimensões da imagem: ${newFilePath}`, err);
                            }
                        }

                        extractedImages.push({
                            order: extractedImages.length + 1,
                            originalName: fileName,
                            imageURL: newFileName,
                            width: dimensions.width || null,
                            height: dimensions.height || null,
                            fileSize: fileStats.size,
                        });
                    })
                    .on('error', (err) => reject(err));
            })
            .on('close', function () {
                fs.unlinkSync(zipFilePath);
                resolve(extractedImages);
            })
            .on('error', function (err) {
                reject(err);
            });
    });
};

const analyzePages = async (pages, chapterDir) => {
    if (!fs.existsSync(chapterDir)) {
        fs.mkdirSync(chapterDir, { recursive: true });
    }

    const existingFiles = fs.readdirSync(chapterDir);

    const filesToDelete = existingFiles.filter((file) => {
        return !pages.some((page) => page.imageURL === file);
    });

    filesToDelete.forEach((file) => {
        const filePath = path.join(chapterDir, file);
        fs.unlinkSync(filePath);
    });

    const updatedPages = await Promise.all(
        pages.map(async (page) => {
            if (page.imageData) {
                const base64Data = page.imageData.replace(/^data:image\/\w+;base64,/, '');
                const extension = page.imageData.match(/data:image\/(\w+);base64,/)[1];
                const fileName = `${uuidv4()}.${extension}`;
                const filePath = path.join(chapterDir, fileName);

                await fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });

                const dimensions = sizeOf(filePath);
                const fileStats = fs.statSync(filePath);

                return {
                    id: page.id,
                    imageURL: fileName,
                    order: page.order,
                    width: dimensions.width,
                    height: dimensions.height,
                    fileSize: fileStats.size,
                };
            } else {
                const filePath = path.join(chapterDir, page.imageURL);
                let dimensions = {};
                let fileSize = 0;

                if (fs.existsSync(filePath)) {
                    dimensions = sizeOf(filePath);
                    fileSize = fs.statSync(filePath).size;
                }

                return {
                    id: page.id,
                    imageURL: page.imageURL,
                    order: page.order,
                    width: dimensions.width || null,
                    height: dimensions.height || null,
                    fileSize: fileSize || 0,
                };
            }
        })
    );

    const sortedPages = updatedPages.sort((a, b) => a.order - b.order);

    return sortedPages;
};

module.exports = {
    extractZip,
    analyzePages,
};