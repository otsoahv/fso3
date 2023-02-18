const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@fsocluster.7zgyzyj.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})


person.save().then(result => {
  console.log('person added!')
  mongoose.connection.close()
})


Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(x => {
      console.log(x)
    })
    mongoose.connection.close()
  })


