'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

morgan.token('post-data', (req, res) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body);
	}
	return '';
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));
app.use(cors());
app.use(express.static('build'))

let phonebook = [{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1
	},
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
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	}
];


app.get('/info', (req, res) => {
	const info = `
	<p>Phonebook has info for ${phonebook.length} persons</p>
	<p>${new Date()}</p>
	`;
	res.send(info)
})


app.get('/api/persons', (req, res) => {
	res.json(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = phonebook.find(person => person.id === id);

	if (person) {
		res.send(person);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	phonebook = phonebook.filter(person => person.id !== id);
	res.status(204).end()
});

app.post('/api/persons', (req, res) => {
	const randomId = Math.round(Math.random() * 1000000);
	const data = {
		...req.body,
		id: randomId,
	};

	const validation = {
		'name is required': () => !!data.name,
		'number is required': () => !!data.number,
		'name must be unique': () => !phonebook.find(person => person.name === data.name),
	};

	let error;

	for (const [msg, test] of Object.entries(validation)) {
		if (!test()) {
			error = msg;
			break;
		}
	}

	if (error) {
		res.status(400).json({ error });
	} else {
		phonebook.push(data);
		res.send(data);
	}
});

app.listen(PORT, () => console.log('server running'));