const express = require('express')
const app = express()

let notes = [
  {
    "persons": [
      {
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
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})