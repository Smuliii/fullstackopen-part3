'use strict';

const mongoose = require('mongoose');

const [, , password, name, number] = process.argv;

if (!password) {
	throw 'Password is required argument: node mongo.js <password>';
}

const url = `mongodb+srv://smuliii:${password}@test-cluster.t9ixy.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema);

const addPerson = (name, number) => {
	const person = new Person({ name, number, });
	person.save().then(res => {
		console.info(`${res.name} was added!`)
		mongoose.connection.close();
	}).catch(err => console.log(err));
}

const listPhonebook = () => {
	Person.find({}).then(res => {
		const phonebook = res.map(person => `${person.name} ${person.number}`);
		console.log('Phonebook:\n' + phonebook.join('\n'));
		mongoose.connection.close();
	});
}

if (name && number) {
	addPerson(name, number);
} else {
	listPhonebook();
}