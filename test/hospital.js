const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('../src/models/hospital');
const auth = require('../src/middlewares/auth');

const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

let stubVerifyToken;
let stubVerifyAdminUserRole;
let server;

const should = chai.should();
chai.use(chaiHttp);

describe('Hospitals', () => {

    const urlBase = `/hospital`;
   
    beforeEach((done) => {
        
        // stub middleware
        stubVerifyToken = sinon.stub(auth, 'verifyUserToken').callsFake((req, res, next) => {
            req.user = { _id: '123456789123456789123456' }
            next()
        });
        stubVerifyAdminUserRole = sinon.stub(auth, 'verifyAdminUserRole').callsFake((req, res, next) =>  next() );
        stubVerifyAdminRolOnMyOwnUser = sinon.stub(auth, 'verifyAdminRolOnMyOwnUser').callsFake((req, res, next) =>  next() );

        // clear DB
        Hospital.remove({}, (err) => done());
        
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
        it('it should GET all hospitals', (done) => {
            chai.request(server)
            .get(`${urlBase}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.payload.hospitals.should.be.a('array');
                done();
            });
        });
    });

    describe(`POST ${urlBase}`, () => {
        it('it should not POST a hospital without name', (done) => {

            chai.request(server)
            .post(`${urlBase}`)
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
        });
        it('it should POST a new Hospital', (done) => {

            chai.request(server)
            .post(`${urlBase}`)
            .send({ name: 'Hospital Nacional Regional de Escuintla' })
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
        it('it should UPDATE a hospital given the ID', (done) => {

            let body = new Hospital({
                name: 'Hospital Nacional Regional de Escuintla',
                user: '123456789123456789123456'
            });

            body.save((err, savedResp) => {

                body.name = 'Hospital San Juan de Dios';

                chai.request(server)
                .put(`${urlBase}/${savedResp._id}`)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.payload.should.be.a('object');
                    res.body.payload.name.should.be.eql('Hospital San Juan de Dios');
                    done();
                });

            });
        });
    });

    describe(`DELETE ${urlBase}/:id`, () => {
        it('it should DELETE a hospital given the ID', (done) => {

            let body = new Hospital({
                name: 'Hospital Nacional Regional de Escuintla',
                user: '123456789123456789123456'
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