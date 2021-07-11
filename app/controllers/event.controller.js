const db = require("../models");
const Event = db.event;

exports.createEvent = (req, res) => {
    const description = req.body.description;
    const _id = req.userId;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    
    let dateRe = /^[2]\d\d\d-[0-1]\d-[0-3]\d [0-2]\d:[0-5]\d/g;
    
    if (!dateRe.test(startDate) && !dateRe.test(endDate)){
        res.status(400).send({id: 'invalid-date', msg: "date malformatted" });
        return;
    }
    
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let dateNow = new Date();

    if (!(endDate > startDate) || !(startDate > dateNow) || !(endDate > dateNow)) {
        if (endDate.getMonth() - startDate.getMonth() > 2){
            res.status(400).send({id: 'invalid-date', msg: "event duration longer than 2 months" });
            return;
        }
        else if (endDate.getMonth() - startDate.getMonth() == 2 && endDate.getDay() > startDate.getDay()){
            res.status(400).send({id: 'invalid-date', msg: "event duration longer than 2 months" });
            return;
        }
        res.status(400).send({id: 'invalid-date', msg: "date is invalid" });
        return;
    }
    const event = {
        description: description,
        startDate: startDate.toLocaleString(),
        endDate: endDate.toLocaleString(),
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
    Event.find({ creator: req.userId}).lean().exec().then(data =>{
        if (req.query.eventState) {
            if(req.query.eventState.trim() === 'open') {
                res.send(data.filter((d => {
                    return new Date(d.endDate) > new Date();
                })));
                return;
            }
            if (req.query.eventState.trim() === 'ended'){
                res.send(data.filter((d =>{
                    return new Date(d.endDate ) < new Date();
                })));
                return;
            }
        }
        res.send(data);
        }).catch(err => {
            res.status(500).send({id: 'internal-error', msg: err.message});
        });


}

exports.listOne = (req, res) => {
    console.log(req)
    Event.findOne({_id: req.params.eventId, creator: req.userId}, (err, event) => {
        if (err){
            res.status(400).send({id: 'invalid-id', msg: err });
            return;
        }
        if (!event) {
            res.status(400).send({id: 'invalid-id', msg: "No event with id "+req.params.eventId});
            return;
        }
        return res.json({event});
    });
}

exports.updateEvent = (req, res) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    
    let dateRe = /^[2]\d\d\d-[0-1]\d-[0-3]\d [0-2]\d:[0-5]\d/g;
    
    if (!dateRe.test(startDate) && !dateRe.test(endDate)){
        res.status(400).send({id: 'invalid-date', msg: "date malformatted" });
        return;
    }
    
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let dateNow = new Date();

    if (!(endDate > startDate) || !(startDate > dateNow) || !(endDate > dateNow)) {
        if (endDate.getMonth() - startDate.getMonth() > 2){
            res.status(400).send({id: 'invalid-date', msg: "event duration longer than 2 months" });
            return;
        }
        else if (endDate.getMonth() - startDate.getMonth() == 2 && endDate.getDay() > startDate.getDay()){
            res.status(400).send({id: 'invalid-date', msg: "event duration longer than 2 months" });
            return;
        }
        res.status(400).send({id: 'invalid-date', msg: "date is invalid" });
        return;
    }

    const event = {
        description: req.body.description,
        startDate: startDate.toLocaleString(),
        endDate: endDate.toLocaleString(),
    }

    Event.findOneAndUpdate({_id: req.params.eventId, creator: req.userId}, event, (err, event) => {
        if (err){
            res.status(400).send({id: 'invalid-id', msg: err });
            return;
        }
        if (!event) {
            res.status(400).send({id: 'invalid-id', msg: "No event with id "+req.params.eventId});
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
    Event.deleteOne({_id: req.params.eventId, creator: req.userId}, (err, event) =>  {
        if (err) {
            res.status(400).send({id: 'invalid-id', msg: err });
        }
        if (event.n == 0 ){
            res.status(400).send({id: 'no-case', msg: "no matched cases"});
            return;
        }

        if (event.deletedCount == 0){
            res.status(400).send({id: 'no-deleted', msg: "no document deleted"});
            return;
        }

        return res.json({id: 'deleted', msg:"successful deleted"});
      });
}