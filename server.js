const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create('My Very First Blog Post', "Today I'm randomly writing some words so that I can test out this Blog API with volatile data storage", "Me");
BlogPosts.create('Making Something UP', 'Now writing even more random words, but not with an apostraphe because I used single quotes. oops.', 'I');
BlogPosts.create("Third Time's the Charm", 'Note how I carefully used double quotes on the title? Yay, me!', 'I');

app.get('/blogpost', (req, res) => {
    res.json(BlogPosts.get());
});

app.post('/blogpost', jsonParser, (req, res) =>{
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message = `Missing \`${field}\` in the request body`;
            console.error(message)
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.date);
    res.status(201).json(item);
})


app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });