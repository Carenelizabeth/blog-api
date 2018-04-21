const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('My Very First Blog Post', "Today I'm randomly writing some words so that I can test out this Blog API with volatile data storage", "Me");
BlogPosts.create('Making Something UP', 'Now writing even more random words, but not with an apostraphe because I used single quotes. oops.', 'I');
BlogPosts.create("Third Time's the Charm", 'Note how I carefully used double quotes on the title? Yay, me!', 'I');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) =>{
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
});

router.delete('/:id', (req, res) =>{
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blogpost`);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message = `Missing \`${field}\` in the request body`;
            console.error(message)
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id){
        const message = "path id and body id must math";
        console.error(message)
        return res.status(400).send(message);
    }
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: req.body.date
    })
    res.status(204).end();
})

module.exports = router;