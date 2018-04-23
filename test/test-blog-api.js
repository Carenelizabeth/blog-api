const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog API', function(){
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    })

    it('should list blogpost contents', function(){
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate']
        return chai.request(app)
            .get('/blogpost')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);
                res.body.forEach(function(item){
                    expect(item).to.be.an('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    })

    it('should add new blog entry on POST', function(){
        newPost = {title:"Not sure about these tests", content:"Do I really need to write all of these? Shouldn't getting the expected keys mean that the item is an object anyway?", author:"Myself"}
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate']
        return chai.request(app)
            .post('/blogpost')
            .send(newPost)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys(expectedKeys);
                expect(res.body.id).to.not.equal('null');
                expect(res.body).to.deep.equal(Object.assign(newPost, {id:res.body.id}, {publishDate:res.body.publishDate}))
            })
    })
})