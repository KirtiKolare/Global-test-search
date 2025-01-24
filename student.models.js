// models/student.model.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Rollno: { type: String, required: true },
  Subject: { type: [String], required: true },
  Semester: { type: Number, required: true },
  dob: { type: Date, required: true },
  Introduction: { type: String, required: true },
  embeddings: { type: [Number], default: [] },  // Vector embeddings
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
