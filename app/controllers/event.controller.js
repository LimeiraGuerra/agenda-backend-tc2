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

    if (!(endDate > startDate) || !(startDate > Date.now()) || !(endDate > Date.now())) {
        res.status(400).send({id: 'invalid-date', msg: "Date is invalid" });
        return;
    }
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
    const _id = req.params.eventId;

    Event.findOne({_id}, (err, event) => {
        if (err){
            res.status(400).send({id: 'invalid-id', msg: err });
            return;
        }

        return res.json({event})
    });
}

exports.updateEvent = (req, res) => {
    const _id = req.params.eventId;

    const event = {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        creator: req.body.creator,
    }

    Event.findOneAndUpdate({_id}, event, (err, event) => {
        if (err){
            res.status(400).send({id: 'invalid-id', msg: err });
            return;
        }

        Event.findOne(event._id, (err, event) => {
            if (err){
                res.status(400).send({id: 'invalid-id', msg: err });
                return;
            }
            return res.json({event});
        });
    });

}

exports.deleteEvent = (req, res) => {
    const _id = req.params.eventId;

    Event.deleteOne({_id}, (err, event) =>  {
        if (err) {
            res.status(400).send({id: 'invalid-id', msg: err });
        }

        return res.json({event});
      });
}