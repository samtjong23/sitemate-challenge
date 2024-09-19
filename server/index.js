const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

let issues = {};

// Create a new issue
app.post('/issues', (req, res) => {
    const { id, title, description } = req.body;
    if (issues[id]) {
        console.log(`CREATE: Issue with ID ${id} already exists`);
        return res.status(400).send({ message: `Issue with ID ${id} already exists` });
    }
    issues[id] = { id, title, description };
    console.log(`CREATE: Issue created:`, issues[id]);
    res.status(201).send(issues[id]);
});

// Get all issues
app.get('/issues', (req, res) => {
    console.log(`READ: All issues requested`);
    res.status(200).json(Object.values(issues));
});

// Get a specific issue by ID
app.get('/issues/:id', (req, res) => {
    const { id } = req.params;
    const issue = issues[id];
    if (issue) {
        console.log(`READ: Issue with ID ${id} requested`);
        res.status(200).json(issue);
    } else {
        console.log(`READ: Issue with ID ${id} not found`);
        res.status(404).send({ message: `Issue with ID ${id} not found` });
    }
});

// Update an issue
app.put('/issues/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    if (issues[id]) {
        issues[id] = { id: parseInt(id), title, description };
        console.log(`UPDATE: Issue with ID ${id} updated:`, issues[id]);
        res.status(200).send(issues[id]);
    } else {
        console.log(`UPDATE: Issue with ID ${id} not found`);
        res.status(404).send({ message: `Issue with ID ${id} not found` });
    }
});

// Delete an issue
app.delete('/issues/:id', (req, res) => {
    const { id } = req.params;
    if (issues[id]) {
        delete issues[id];
        console.log(`DELETE: Issue with ID ${id} deleted`);
        res.status(204).send();
    } else {
        console.log(`DELETE: Issue with ID ${id} not found`);
        res.status(404).send({ message: `Issue with ID ${id} not found` });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
