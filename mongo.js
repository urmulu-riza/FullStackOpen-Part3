const mongoose = require('mongoose')

if (
  process.argv.length < 3 ||
  (process.argv.length > 3 && process.argv.length < 5)
) {
  console.log('give password as argument')
  process.exit(1)
}

const { 2: password, 3: name, 4: number } = process.argv

// const url = `mongodb+srv://fullstackopen:${password}@cluster0.6vxzppr.mongodb.net/?retryWrites=true&w=majority`;
const url = `mongodb+srv://fullstackopen:${password}@cluster0.6vxzppr.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((p) => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}
//              Use like this:
// node mongo.js yourpassword Anna 040-1234556
// node mongo.js yourpassword "Arto Vihavainen" 045-1232456
//                  Result:
// added Anna number 040-1234556 to phonebook
