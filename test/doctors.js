const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('../src/models/doctor');
const auth = require('../src/middlewares/auth');

const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

let stubVerifyToken;
let stubVerifyAdminUserRole;
let server;

const should = chai.should();
chai.use(chaiHttp);

describe('Doctors', () => {

    const urlBase = `/doctor`;
   
    beforeEach((done) => {
        
        // stub middleware
        stubVerifyToken = sinon.stub(auth, 'verifyUserToken').callsFake((req, res, next) => {
            req.user = { _id: '123456789123456789123456' }
            next()
        });
        stubVerifyAdminUserRole = sinon.stub(auth, 'verifyAdminUserRole').callsFake((req, res, next) =>  next() );
        stubVerifyAdminRolOnMyOwnUser = sinon.stub(auth, 'verifyAdminRolOnMyOwnUser').callsFake((req, res, next) =>  next() );

        // clear DB
        Doctor.remove({}, (err) => done());
        
        // now we can create server
        server = require('../src/app');
    });

    afterEach((done) => {

        // restore stubs middlewares
        stubVerifyToken.restore();
        stubVerifyAdminUserRole.restore();
        stubVerifyAdminRolOnMyOwnUser.restore();
        done();
    });

    describe(`GET ${urlBase}`, () => {
        it('it should GET all doctors', (done) => {
            chai.request(server)
            .get(`${urlBase}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.payload.doctors.should.be.a('array');
                done();
            });
        });
    });

    describe(`POST ${urlBase}`, () => {
        it('it should not POST a doctor without name and hospital', (done) => {

            chai.request(server)
            .post(`${urlBase}`)
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
        });
        it('it should POST a new doctor', (done) => {

            chai.request(server)
            .post(`${urlBase}`)
            .send({ 
                name: 'Dr Pepito',
                hospital: '123456789123456789123456'
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.payload.should.be.a('object');
                res.body.payload.should.have.property('_id');
                done();
            });
        });
    });

    describe(`PUT ${urlBase}/:id`, () => {
        it('it should UPDATE a doctor given the ID', (done) => {

            let body = new Doctor({
                name: 'Dr Pepito',
                user: '123456789123456789123456',
                hospital: '123456789123456789123456'
            });

            body.save((err, savedResp) => {

                body.name = 'Dra Juana de Arco';

                chai.request(server)
                .put(`${urlBase}/${savedResp._id}`)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    res.body.payload.name.should.be.eql('Dra Juana de Arco');
                    done();
                });

            });
        });
    });

    describe(`DELETE ${urlBase}/:id`, () => {
        it('it should DELETE a doctor given the ID', (done) => {

            let body = new Doctor({
                name: 'Dr Pepito',
                user: '123456789123456789123456',
                hospital: '123456789123456789123456'
            });

            body.save((err, savedResp) => {

                chai.request(server)
                .delete(`${urlBase}/${savedResp._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    res.body.payload._id.should.be.eql(`${savedResp._id}`);
                    done();
                });

            });
        });
    });

});