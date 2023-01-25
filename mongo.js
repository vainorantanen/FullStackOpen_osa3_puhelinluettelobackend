const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
//console.log(process.argv);
const nimi = process.argv[3]
const numero = process.argv[4]

const url =
  `mongodb+srv://fullstackpuhelinluettelo:${password}@cluster0.0bs1puh.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: nimi,
  number: numero,
})

if (process.argv.length == 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
} else {
    person.save().then(result => {
    console.log(`added ${nimi} number ${numero} to phonebook`)
    mongoose.connection.close()
    })
}

