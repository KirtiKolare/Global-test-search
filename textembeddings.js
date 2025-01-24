// textEmbedding.js
const loadGloveEmbeddings = require('./gloveHelper');
const gloveEmbeddings = loadGloveEmbeddings();

const getTextEmbedding = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  let embedding = Array(50).fill(0);  // Initialize with zeros for 50-dimensional vectors

  let wordCount = 0;
  words.forEach(word => {
    if (gloveEmbeddings[word]) {
      embedding = embedding.map((value, index) => value + gloveEmbeddings[word][index]);
      wordCount++;
    }
  });

  // Average the embeddings to form a single vector
  if (wordCount > 0) {
    embedding = embedding.map(value => value / wordCount);
  }

  return embedding;
};

module.exports = getTextEmbedding;
