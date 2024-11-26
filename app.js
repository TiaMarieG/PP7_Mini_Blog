// Get the express package 
const express = require('express');

const mariadb = require('mariadb');

// Instantiate an express (web) app
const app = express();

// Define a port number for the app to listen on
const PORT = 3000;

//Give info to connect to mariadb
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Izzaia8192',
    database: 'blog'
})

//Function that connects to mariadb
async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log('Connected to the database');
        // Return connection so that it can be used
        return conn;
    } catch (err) {
        console.log ('Error connecting to the database: ' + err)
    }
}


// Tell the app to encode data into JSON format
app.use(express.urlencoded({ extended: false }));

//Accesses the public folder for styles
app.use(express.static('public'));

// Set your view (templating) engine to "EJS"
// (We use a templating engine to create dynamic web pages)
app.set('view engine', 'ejs');

// Define a "default" route, 
// e.g. jshmo.greenriverdev.com/reservation-app/
app.get('/', (req, res) => {
    // Return home page
    res.render('home');
});

app.get('/entries', (req, res) => {
    res.render('entries', {posts: posts});
})

app.post('/submit', async (req, res) => {

    const data = req.body

        //To go through checks to validate data
        let isValid = true;
        let errors = [];
    
        //Don't want people to be able to submit a string with a bunch of white spaces
        //Use .trim
        if (data.author.trim() === "" || data.author.length <= 5) {
            isValid = false;
            errors.push("Author is required");
        }
    
        if (data.title.trim() === "" || data.title.length <= 5) {
            isValid = false;
            errors.push("Title is required");
        }
    
        if (data.content.trim() === "") {
            isValid = false;
            errors.push("Content is required");
        }
    
        if(!isValid) {
            res.render('home', {data : data, errors : errors});
            //Don't want rest of code to run
            //Use return to break out of the function
            return;
        }
    
    //Need to wait for connection since the method is waiting
    const conn = await connect();

    await conn.query(`
        INSERT INTO posts (author, title, content)
        Values ('${data.author}', '${data.title}', '${data.content}');
        `);

    res.render('confirmation', { details: data });
});

// Tell the app to listen for requests on the designated port
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
});
