const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for CORS
app.use(cors({
    origin: ['https://my-todo-s.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));

// Middleware to serve static files from the "public" folder
app.use(express.static('public'));

// Middleware to parse JSON data
app.use(express.json());

// Initialize an array to store todos
let todos = [];

// Route to get all todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// Route to add a new todo (Create)
app.post('/additem', (req, res) => {
    const newTodoVal = req.body.todoval;
    if (!newTodoVal || typeof newTodoVal !== 'string') {
        return res.status(400).json({ message: "Invalid input" });
    }

    const newTodo = {
        id: uuidv4(), // Use UUID for unique IDs
        todoval: newTodoVal
    };
    todos.push(newTodo);
    res.status(201).json(todos);
});

// Route to delete a todo (Delete)
app.delete('/deleteitem/:id', (req, res) => {
    const todoId = req.params.id;
    todos = todos.filter(todo => todo.id !== todoId);
    res.json({ message: "Todo deleted successfully", todos });
});

// Route to update a todo (Update)
app.put('/updateitem/:id', (req, res) => {
    const todoId = req.params.id;
    const updatedTodoVal = req.body.todoval;

    if (!updatedTodoVal || typeof updatedTodoVal !== 'string') {
        return res.status(400).json({ message: "Invalid input" });
    }

    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex !== -1) {
        todos[todoIndex].todoval = updatedTodoVal;
        res.json({ message: "Todo updated successfully", todos });
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
});

// 404 Route handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
