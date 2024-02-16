// nuke.js
const fs = require('fs');
const path = require('path');

const deleteIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted:', filePath);
    }
};

const deleteFolderRecursive = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
        console.log('Deleted:', folderPath);
    }
};

deleteIfExists('yarn.lock');
deleteIfExists('package-lock.json');
deleteFolderRecursive('node_modules');
