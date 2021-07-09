const db = require("../models");
const Event = db.event;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config.js');

exports.createEvent = (req, res) => {
    const {name} = req.body;
    const {description} = req.body;
    const _id = "60e8b3967cebaa610caed594"; // TODO pegar id pelo token
    let startDate;
    let endDate;

    try{
        startDate = new Date(req.body.startDate);
        endDate = new Date(req.body.endDate);
    }
    catch(err) {
        res.status(400).send({id: 'Invalid Date', msg: err });
        return;
    };

    const event = {
        name: name,
        description: description,
        startDate: startDate,
        endDate: endDate,
        creator: _id,
      };

    Event.create(event, (err, event) => {
        if (err) {
            res.status(500).send({id: 'internal-error', msg: err.message });
        }
        return res.json(event);
    });
}

exports.listAll = (req, res) => {
    Event.find({ creator: "60e8b3967cebaa610caed594"}).lean().exec((err, events) =>{
        if (err) {
            res.status(500).send({id: 'internal-error', msg: err.message})
        }

        events.forEach(event =>{
            if (event.endDate > Date.now()) {
                
            }
        return res.json({events_list})
        })
    })
}

exports.listOne = (req, res) => {
}

exports.updateEvent = (req, res) => {
}

exports.deleteEvent = (req, res) => {

}