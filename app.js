const express = require('express');
const mongoose = require('mongoose');
const loadGloveEmbeddings = require('./gloveHelper');

// MongoDB connection URI
const mongoUri = 'mongodb://localhost:27017/global_search_db';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Load GloVe embeddings
const gloveEmbeddings = loadGloveEmbeddings();

// MongoDB Schema for storing text and embeddings
const documentSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
});
const Document = mongoose.model('Document', documentSchema);

// Express app setup
const app = express();
app.use(express.json());

// Function to get embedding for a word (or text)
const getTextEmbedding = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  let embedding = Array(50).fill(0); // Initialize an empty embedding

  let wordCount = 0;
  words.forEach(word => {
    if (gloveEmbeddings[word]) {
      embedding = embedding.map((value, index) => value + gloveEmbeddings[word][index]);
      wordCount++;
    }
  });

  // Average the word vectors
  if (wordCount > 0) {
    embedding = embedding.map(value => value / wordCount);
  }

  return embedding;
};

// Route to add a document and store its embedding
app.post('/add-document', async (req, res) => {
  try {
    const { text } = req.body;
    const embedding = getTextEmbedding(text);

    const newDocument = new Document({ text, embedding });
    await newDocument.save();

    res.status(200).send({ message: 'Document added successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route for global text search
app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).send({ error: 'Query parameter is required' });
    }

    const queryEmbedding = getTextEmbedding(query);
    const documents = await Document.find({});
    
    let bestMatch = null;
    let maxSimilarity = -Infinity;

    documents.forEach(doc => {
      const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestMatch = doc;
      }
    });

    if (bestMatch) {
      res.status(200).json({ match: bestMatch });
    } else {
      res.status(404).send({ message: 'No matching documents found' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Function to compute cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
