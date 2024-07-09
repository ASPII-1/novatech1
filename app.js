const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to the Mongo server");
    })
    .catch(err => {
        console.log('error is:-', err)
    })
// Define a schema for form submissions
const submissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.get('/contact', (req, res) => {
    res.render('pages/contact');
});


app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;
    console.log('hii');
    try {
        const newSubmission = new Submission({
            name,
            email,
            message
        });

        await newSubmission.save();
        res.send('Form submission successful!');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
