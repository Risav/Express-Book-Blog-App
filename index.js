import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import path from 'path';

const app = express();
const port = 4000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended:false }));

app.use(methodOverride(function (req, res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        var method = req.body._method
        console.log(method, req.body._method)
        delete req.body._method
        return method
    }
}))

app.use(express.static('public'));

// Setting EJS as the view engine
app.set('view engine', "ejs");

// Setting the path for the views directory
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render(__dirname + "/views/index.ejs")
});

let posts = [];

app.get("/submit", (req, res) => {
    res.render('index.ejs', {posts});
})

app.post("/submit", (req, res) => {
    const postObj = {
        id: posts.length + 1,
        name: req.body.name, 
        title: req.body.title,
        description: req.body.description,
    };
    posts.push(postObj)
    console.log(posts)
    res.redirect('/submit');
});

app.delete("/delete", (req, res) => {
    const id = parseInt(req.body.id);

    posts = posts.filter(post => post.id !== id);
    res.redirect('/submit');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});