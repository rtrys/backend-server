var express = require('express');

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

var app = express();

app.get('/todo/:search', (req, res) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise.all([
        searchHospital(search, regex),
        searchDoctors(search, regex),
        searchUsers(search, regex)
    ]).then(resps => {
        res.status(200).json({
            ok: true,
            hospitals: resps[0],
            doctors: resps[1],
            users: resps[2]
        });
    });

});

app.get('/coleccion/:table/:search', (req, res) => {

    var table = req.params.table;
    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    var promise;

    switch (table) {
        case 'hospital':
            promise = searchHospital(search, regex);
            break;
        case 'user':
            promise = searchUsers(search, regex);
            break;
        case 'doctor':
            promise = searchDoctors(search, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Allwed types: user, doctor y hospital',
                errs: { message: 'Table invalid' }
            });
    }

    promise.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    });

});

function searchHospital(search, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find()
            .or([{ 'name': regex }])
            .populate('user', 'name email img')
            .exec({ name: regex }, (err, hospitals) => {
                if (err) {
                    reject('Error', err);
                } else {
                    resolve(hospitals);
                }
            });
    });
}

function searchDoctors(search, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find()
            .or([{ 'name': regex }])
            .populate('hospital')
            .populate('user', 'name email img')
            .exec({ name: regex }, (err, doctors) => {
                if (err) {
                    reject('Error', err);
                } else {
                    resolve(doctors);
                }
            });
    });
}

function searchUsers(search, regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role img')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, users) => {
                if (err) {
                    reject('Error', err);
                } else {
                    resolve(users);
                }
            });
    });
}

module.exports = app;