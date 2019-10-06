// set environment
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Doctor = require('./../models/doctor');

// require dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./../app');
let should = chai.should();

chai.use(chaiHttp);

// Parent block
describe('Doctors', () => {

    // before each test I empty the db
    beforeEach((done) => {
        Doctor.remove({}, () => done());
    });

    // test GET /doctor
    describe('GET /api/doctor', () => {

        it('it should retrive all doctors', (done) => {
            chai.request(server)
                .get('/api/doctor')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('array');
                    res.body.payload.length.should.be.eql(0)
                    done();
                });
        });

    });

    // test GET /doctor/:id
    describe('GET /api/doctor/:id', () => {

        it('it should retrive given doctor', (done) => {

            let doctor = {
                name: 'name doctor'
            };

            doctor.save((err, doctor) => {
                chai.request(server)
                    .get(`/api/doctor/${doctor._id}`)
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
                .get(`/api/doctor/12345asdf`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.not.have.proerty('payload')
                    done();
                });
        });

    });

    // test POST /doctor
    describe('POST /api/doctor', () => {

        it('it should create a new doctor', (done) => {

            let doctor = {
                name: 'name doctor'
            };

            chai.request(server)
                .post('/api/doctor')
                .send(doctor)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    res.body.payload.should.have.proerty('_id');
                    done();
                });
        });

        it('it should be an error', (done) => {

            let doctor = {};

            chai.request(server)
                .post('/api/doctor')
                .send(doctor)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    done();
                });
        });

    });

    // test PUT /doctor/:id
    describe('PUT /api/doctor/:id', () => {

        it('it should updated doctor', (done) => {

            let doctor = {
                name: 'name doctor'
            };

            doctor.save((err, doctor) => {
                chai.request(server)
                    .put(`/api/doctor/${doctor._id}`)
                    .send({
                        name: 'edited name doctor'
                    }).end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.payload.should.be.a('object');
                        res.body.payload.should.have.proerty('name').eql('edited name doctor');
                        done();
                    });
            });
        });

        it('it should be an error on update', (done) => {

            let doctor = {
                name: 'name doctor'
            };

            doctor.save((err, doctor) => {
                chai.request(server)
                    .put(`/api/doctor/${doctor._id}`)
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

    // test DELETE /doctor/:id
    describe('DELETE /api/doctor/:id', () => {

        it('it should deleted doctor', (done) => {

            let doctor = {
                name: 'name doctor'
            };

            doctor.save((err, doctor) => {
                chai.request(server)
                    .delete(`/api/doctor/${doctor._id}`)
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
                .delete(`/api/doctor/1234asdf`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    done();
                });
        });

    });
});