const fs = require('fs');
const data = require('./data/bhagavad_gita_unified.json');
fs.writeFileSync('./tmp.json', JSON.stringify(data[0], null, 2));
