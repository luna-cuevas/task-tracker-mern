const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI ||'mongodb+srv://luna:hb9uQ0zzw58B7U85@cluster0.e80ge.mongodb.net/Cluster0?retryWrites=true&w=majority', {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB")).catch(console.error);

const Todo = require('./models/Todo');

app.get('/todos', async (req, res) => {
	const todos = await Todo.find();

	res.json(todos);
});

app.post('/todo/new', (req, res) => {
	const todo = new Todo({
		text: req.body.text
	})

	todo.save();

	res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.get('/todo/complete/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
})

app.put('/todo/update/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
});

if ( 
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
) {
    app.use(express.static("client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}...`));