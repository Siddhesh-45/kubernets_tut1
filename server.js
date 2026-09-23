const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

let students = [
  { id: randomUUID(), name: 'Maya Thompson', email: 'maya.thompson@northstar.edu', course: 'Computer Science', year: 'Year 2', status: 'Active' },
  { id: randomUUID(), name: 'Jordan Lee', email: 'jordan.lee@northstar.edu', course: 'Business Analytics', year: 'Year 3', status: 'Active' },
  { id: randomUUID(), name: 'Avery Morgan', email: 'avery.morgan@northstar.edu', course: 'Visual Design', year: 'Year 1', status: 'On leave' },
  { id: randomUUID(), name: 'Samir Patel', email: 'samir.patel@northstar.edu', course: 'Mechanical Engineering', year: 'Year 4', status: 'Active' },
  { id: randomUUID(), name: 'Nina Foster', email: 'nina.foster@northstar.edu', course: 'Psychology', year: 'Year 2', status: 'Active' }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/students', (req, res) => {
  res.json(students);
});

app.post('/api/students', (req, res) => {
  const { name, email, course, year } = req.body;
  if (![name, email, course, year].every((value) => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'Please complete every field.' });
  }

  const student = {
    id: randomUUID(),
    name: name.trim(),
    email: email.trim(),
    course: course.trim(),
    year: year.trim(),
    status: 'Active'
  };

  students = [student, ...students];
  res.status(201).json(student);
});

app.delete('/api/students/:id', (req, res) => {
  const originalLength = students.length;
  students = students.filter((student) => student.id !== req.params.id);
  if (students.length === originalLength) {
    return res.status(404).json({ message: 'Student not found.' });
  }
  res.status(204).end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Student management app running at http://localhost:${port}`);
});
