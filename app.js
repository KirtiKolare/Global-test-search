// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const getTextEmbedding = require('./textembeddings');
const Student = require('./models/student.models');
const Candidate = require('./models/candidate.models');

// MongoDB connection URI
const mongoUri = 'mongodb://localhost:27017/Enzigma';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const app = express();
app.use(bodyParser.json());

// Route to add a document (student/candidate) and save its embedding
app.post('/add-document', async (req, res) => {
  const { collection, document } = req.body;
  let embedding;

  try {
    embedding = getTextEmbedding(document.Introduction || document.introduction);

    // Save embedding to document and insert into the corresponding collection
    if (collection === 'students') {
      const newStudent = new Student({
        ...document,
        embeddings: embedding,
      });
      await newStudent.save();
    } else if (collection === 'candidates') {
      const newCandidate = new Candidate({
        ...document,
        embeddings: embedding,
      });
      await newCandidate.save();
    }

    res.status(200).send({ message: 'Document added successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route for global text search
app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send({ error: 'Query parameter "q" is required' });
  }

  try {
    const studentResults = await Student.find({ $text: { $search: query } });
    const candidateResults = await Candidate.find({ $text: { $search: query } });

    res.status(200).json({
      studentResults,
      candidateResults,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
