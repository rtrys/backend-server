// set environment
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Hospital = require('./../models/hospital');

// require dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./../app');
let should = chai.should();

chai.use(chaiHttp);

// Parent block
describe('Hospitals', () => {

    // before each test I empty the db
    beforeEach((done) => {
        Hospital.remove({}, () => done());
    });

    // test GET /hospital
    describe('GET /api/hospital', () => {

        it('it should retrive all hospitals', (done) => {
            chai.request(server)
                .get('/api/hospital')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('array');
                    res.body.payload.length.should.be.eql(0)
                    done();
                });
        });

    });

    // test GET /hospital/:id
    describe('GET /api/hospital/:id', () => {

        it('it should retrive given hospital', (done) => {

            let hospital = {
                name: 'name hospital'
            };

            hospital.save((err, hospital) => {
                chai.request(server)
                    .get(`/api/hospital/${hospital._id}`)
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
                .get(`/api/hospital/12345asdf`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.not.have.proerty('payload')
                    done();
                });
        });

    });

    // test POST /hospital
    describe('POST /api/hospital', () => {

        it('it should create a new hospital', (done) => {

            let hospital = {
                name: 'name hospital'
            };

            chai.request(server)
                .post('/api/hospital')
                .send(hospital)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    res.body.payload.should.have.proerty('_id');
                    done();
                });
        });

        it('it should be an error', (done) => {

            let hospital = {};

            chai.request(server)
                .post('/api/hospital')
                .send(hospital)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    done();
                });
        });

    });

    // test PUT /hospital/:id
    describe('PUT /api/hospital/:id', () => {

        it('it should updated hospital', (done) => {

            let hospital = {
                name: 'name hospital'
            };

            hospital.save((err, hospital) => {
                chai.request(server)
                    .put(`/api/hospital/${hospital._id}`)
                    .send({
                        name: 'edited name hospital'
                    }).end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.payload.should.be.a('object');
                        res.body.payload.should.have.proerty('name').eql('edited name hospital');
                        done();
                    });
            });
        });

        it('it should be an error on update', (done) => {

            let hospital = {
                name: 'name hospital'
            };

            hospital.save((err, hospital) => {
                chai.request(server)
                    .put(`/api/hospital/${hospital._id}`)
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

    // test DELETE /hospital/:id
    describe('DELETE /api/hospital/:id', () => {

        it('it should deleted hospital', (done) => {

            let hospital = {
                name: 'name hospital'
            };

            hospital.save((err, hospital) => {
                chai.request(server)
                    .delete(`/api/hospital/${hospital._id}`)
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
                .delete(`/api/hospital/1234asdf`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    done();
                });
        });

    });
});