const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

app.use(cors())

app.use(morgan('tiny'));

app.use(express.json())

app.use(express.static('build'))



let persons = [
  {
    "name": "Otso Ahvonene",
    "number": "123456-67890",
    "id": 1
  },{
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "qwer",
    "key": "qwer",
    "number": "1234",
    "id": 4
  },
  {
    "name": "qwerr",
    "key": "qwerr",
    "number": "12345",
    "id": 5
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const currentTime = new Date().toString();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = persons.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("body post", body)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const duplicate = persons.find(person => person.name === body.name)
  if (duplicate) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number || false,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})