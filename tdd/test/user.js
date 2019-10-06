// set environment
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let User = require('./../models/user');

// require dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./../app');
let should = chai.should();

chai.use(chaiHttp);

// Parent block
describe('Users', () => {

    // before each test I empty the db
    beforeEach((done) => {
        User.remove({}, () => done());
    });

    // test GET /user
    describe('GET /api/user', () => {

        it('it should retrive all user', (done) => {
            chai.request(server)
                .get('/api/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('array');
                    res.body.payload.length.should.be.eql(0)
                    done();
                });
        });

    });

    // test GET /user/:id
    describe('GET /api/user/:id', () => {

        it('it should retrive given user', (done) => {

            let user = {
                name: 'name user',
                email: 'email@asdf.com'
            };

            user.save((err, user) => {
                chai.request(server)
                    .get(`/api/user/${user._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.payload.should.be.a('object');
                        done();
                    });
            });

        });

        it('it should give an error not found', (done) => {
            chai.request(server)
                .get(`/api/user/12345asdf`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.not.have.proerty('payload')
                    done();
                });
        });

    });

    // test POST /user
    describe('POST /api/user', () => {

        it('it should create a new user', (done) => {

            let user = {
                name: 'name user',
                email: 'email@asdf.com'
            };

            chai.request(server)
                .post('/api/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    res.body.payload.should.have.proerty('_id');
                    done();
                });
        });

        it('it should be an error', (done) => {

            let user = {};

            chai.request(server)
                .post('/api/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    done();
                });
        });

    });

    // test PUT /user/:id
    describe('PUT /api/user/:id', () => {

        it('it should updated user', (done) => {

            let user = {
                name: 'name user',
                email: 'email@asdf.com'
            };

            user.save((err, user) => {
                chai.request(server)
                    .put(`/api/user/${user._id}`)
                    .send({
                        name: 'edited name user',
                        email: 'email@asdf.com'
                    }).end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.payload.should.be.a('object');
                        res.body.payload.should.have.proerty('name').eql('edited name user');
                        done();
                    });
            });
        });

        it('it should be an error on update', (done) => {

            let user = {
                name: 'name user',
                email: 'email@asdf.com'
            };

            user.save((err, user) => {
                chai.request(server)
                    .put(`/api/user/${user._id}`)
                    .send({})
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.payload.should.be.a('object');
                        done();
                    });
            });
        });

    });

    // test DELETE /user/:id
    describe('DELETE /api/user/:id', () => {

        it('it should deleted user', (done) => {

            let user = {
                name: 'name user',
                email: 'email@asdf.com'
            };

            user.save((err, user) => {
                chai.request(server)
                    .delete(`/api/user/${user._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.payload.should.be.a('object');
                        res.body.payload.should.have.proerty('name');
                        done();
                    });
            });
        });

        it('it should be an error on update', (done) => {

            chai.request(server)
                .delete(`/api/user/1234asdf`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    done();
                });
        });

    });
});