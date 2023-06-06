const express = require('express');
const app = express();
app.use(express.json()); //it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object before the route handler is called.

const morgan = require('morgan');
app.use(morgan('tiny'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];
app.get('/api/persons', (request, response) => {
  response.json(persons);
});
app.get('/info', (request, response) => {
  let time = new Date().toString();
  response.send(
    `<div><br/><p>Phonebook has info for ${persons.length} people</p><p>${time}</p></div>`
  );
});
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  person ? response.json(person) : response.status(404).end();
});
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  const err = (error) =>
    response.status(400).json({
      error,
    });
  !(name && number) && err('name or number missing');
  persons.find((p) => p.name === name) && err('Name must be unique');
  const person = { name, number, id: Math.trunc(Math.random() * 10000) };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
