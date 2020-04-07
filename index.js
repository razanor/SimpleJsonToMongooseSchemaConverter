import fs from 'fs';

import Converter from './services/converter';

const rawConfig = fs.readFileSync('config.json');
const { jsonSchema: inputFileName, mongooseSchema: outputFileName } = JSON.parse(rawConfig);

const rawJsonSchema = fs.readFileSync(inputFileName);
const { title, properties } = JSON.parse(rawJsonSchema);

const converter = new Converter(outputFileName);
converter.run(title, properties);
