require('dotenv').config()
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')


const Person = require('./mongo/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(morgan('tiny'));
app.use(express.json())
app.use(requestLogger)
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
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  const currentTime = new Date().toString();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`
  )
})

//GET kaikkien yhteystietojen haku
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

//GET yksittäinen yhteystieto
app.get('/api/persons/:id', (request, response, next) => {
  
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
  .catch(error => next(error))
  /*const id = Number(request.params.id)
  const note = persons.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }*/
})

//DELETE yhteystieto
app.delete('/api/persons/:id', (request, response, next) => {
  console.log("deleting id:", request.params.id)
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  
})

//POST uusi yhteystieto
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

  /* const duplicate = persons.find(person => person.name === body.name)
  if (duplicate) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }*/

  const person = new Person( {
    name: body.name,
    number: body.number || false,
    // id: generateId(),
  })

  //  persons = persons.concat(person)
 
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})