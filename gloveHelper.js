const fs = require('fs');
const path = require('path');

// Load GloVe embeddings from file
const loadGloveEmbeddings = () => {
  const embeddings = {};
  const filePath = path.join(__dirname, 'glove.6B.50d.txt');

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  lines.forEach(line => {
    const parts = line.split(' ');
    const word = parts[0];
    const vector = parts.slice(1).map(Number);
    embeddings[word] = vector;
  });

  console.log('GloVe embeddings loaded!');
  return embeddings;
};

module.exports = loadGloveEmbeddings;
