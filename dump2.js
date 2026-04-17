const fs = require('fs');
const data = require('./data/bhagavad_gita_unified.json');
const c1 = data.filter(v => parseInt(v.chapter) === 1).map(v => v.id);
fs.writeFileSync('c1_ids_2.json', JSON.stringify(c1, null, 2));
