// gloveHelper.js
const fs = require('fs');

const loadGloveEmbeddings = () => {
  const glove = {};
  const filePath = 'glove.6B.50d.txt';  // Path to the GloVe file

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  lines.forEach(line => {
    const parts = line.split(' ');
    const word = parts[0];
    const vector = parts.slice(1).map(Number);
    glove[word] = vector;
  });

  return glove;
};

module.exports = loadGloveEmbeddings;
