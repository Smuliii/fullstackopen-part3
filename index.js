'use strict';

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const Person = require('./models/person');
const PORT = process.env.PORT;

const errorHandler = (err, req, res, next) => {
	if (err.name === 'CastError') {
	  return res.status(400).send({ error: 'invalid id' });
	} else if (err.name === 'ValidationError') {
		return res.status(400).send({ error: err.message })
	}

	next(err);
};

morgan.token('post-data', (req, res) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body);
	}
	return '';
});

app.use(express.static('build'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));
app.use(cors());

app.get('/info', (req, res) => {
	Person.find({}).then(people => {
		const info = `
		<p>Phonebook has info for ${people.length} persons</p>
		<p>${new Date()}</p>
		`;
		res.send(info);
	});
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(people => res.json(people));
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		if (person) {
			res.json(person);
		} else {
			res.status(404).end();
		}
	}).catch(err => next(err));
});

app.post('/api/persons', (req, res, next) => {
	const data = {
		name: req.body.name,
		number: req.body.number,
	};

	const validation = {
		'name is required': () => !!data.name,
		'number is required': () => !!data.number,
	};

	let error;

	for (const [msg, test] of Object.entries(validation)) {
		if (!test()) {
			error = msg;
			break;
		}
	}

	if (!error) {
		const person = new Person(data);
		person.save().then(person => {
			person = person.toJSON();
			res.json(person);
		}).catch(err => next(err));
	} else {
		res.status(400).json({ error });
	}
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndDelete(req.params.id).then(person => {
		res.status(204).end();
	}).catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
	const id = req.params.id;
	const data = {
		number: req.body.number
	};

	Person.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
		context: 'query',
	}).then(person => {
		res.json(person);
	}).catch(err => next(err));
});

app.use(errorHandler);
app.listen(PORT, () => console.log('server running'));