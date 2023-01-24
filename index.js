const express = require('express')
const { token } = require('morgan')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]

app.use(express.json())

app.use(morgan(function (tokens, req, res) {
  //console.log(tokens)
  //console.log(req.body)
  const a = JSON.stringify(req.body)
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    a
  ].join(' ')
}))

app.use(cors())

app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/info', (req, res) => {
    const time = Date()
    const num = persons.length
    res.send(`<p>Phonebook has info for ${num} people <br></br>${time}</p>`)
  })

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end
    }

})

app.delete("/api/persons/:id", (req, res) => {
    console.log(req.params)
    const id = Number(req.params.id)
    console.log(id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    //tarkistetaan onko nimi jo luettelossa
    let onko = persons.find(p => p.name === body.name)
    console.log(onko)

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    } else if (onko) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })