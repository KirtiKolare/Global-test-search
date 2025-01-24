// models/candidate.model.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  PRN: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  subjects: { type: [String], required: true },
  introduction: { type: String, required: true },
  cgpa: { type: Number, required: true },
  embeddings: { type: [Number], default: [] },  // Vector embeddings
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
