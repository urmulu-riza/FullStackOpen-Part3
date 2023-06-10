require('dotenv').config();
const express = require('express');
const app = express();

const Person = require('./models/person');

app.use(express.static('build'));
app.use(express.json()); //takes the JSON data of a req, transforms 2 JSobj & attaches 2 the req.body
//Morgan

const morgan = require('morgan');
// app.use(morgan('tiny'));
morgan.token('body', (req) =>
  Object.values(req.body)[0] ? JSON.stringify(req.body) : null
);
// morgan.token('type',  req=>req.headers['content-type'])
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const cors = require('cors');
app.use(cors());

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});
// app.get('/info', (request, response) => {
//   let time = new Date().toString();
//   response.send(
//     `<div><br/><p>Phonebook has info for ${persons.length} people</p><p>${time}</p></div>`
//   );
// });
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) =>
      person ? response.json(person) : response.status(404).end()
    )
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' });
    });
});
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!(name && number)) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }
  // if (persons.find((p) => p.name === name)) {
  //   return response.status(422).json({
  //     error: 'Name must be unique',
  //   });
  // }
  if (request.header('Content-Type') !== 'application/json') {
    return res.status(400).json({ error: 'Content-Type Unsupported' });
  }
  const person = new Person({ name, number });
  person.save().then((savedPerson) => response.json(savedPerson));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
