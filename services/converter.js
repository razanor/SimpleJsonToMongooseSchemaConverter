import fs from 'fs';

import TreeNode from './treeNode';

class Converter {
    constructor(outputFileName) {
        this.outputFileName = outputFileName;
    }

    run(title, props) {
        if (this.checkFileExists()) fs.unlinkSync(this.outputFileName);

        this.writeToFile(`var ${title} = new Schema({`);
        this.jsonSchemaTraversal(props);
        this.writeToFile('});');
    }

    jsonSchemaTraversal(props) {
        const keys = props instanceof Object ? Object.keys(props) : [];

        for (let i = 0; i < keys.length; i++) {
            const prop = props[keys[i]];
            const type = prop.type;
            const key = keys[i]

            const node = new TreeNode(type, key);

            if (prop.type === 'array') {
                node.itemType = prop.items.type;
            }

            this.writeOpening(node);

            if (prop.type === 'object') {
                this.jsonSchemaTraversal(prop.properties);
            }

            this.writeClosing(node, i + 1 < keys.length);
        }
    }

    writeOpening({ type, key, itemType }) {
        if (type === 'object') {
            this.writeToFile(`${key}: new Schema({`);
        } else if (type === 'array') {
            this.writeToFile(`\n${key}: [{ \ntype: ${this.capitalize(itemType)}`);
        } else {
            this.writeToFile(`\n${key}: { \ntype: ${this.capitalize(type)}\n`);
        }
    }

    writeClosing({ type }, isComma) {
        if (type === 'object') {
            this.writeToFile('})');
        } else if (type === 'array') {
            this.writeToFile('}]');
        } else {
            this.writeToFile('}');
        }
        if (isComma) this.writeToFile(',\n');
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    writeToFile(text) {
        fs.appendFileSync(this.outputFileName, text);
    }

    checkFileExists() {
        try {
            if (fs.existsSync(this.outputFileName)) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

export default Converter;
