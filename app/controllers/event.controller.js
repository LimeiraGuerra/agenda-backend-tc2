const db = require("../models");
const Event = db.event;

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

exports.createEvent = (req, res) => {
    const description = req.body.description;
    const _id = req.userId;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    
    if(!(description && description.trim().length > 0)) {
        res.status(400).send({id: 'missing-data', msg: "Insufficient data" });
        return;
    }

    let dateRe = /^[2]\d\d\d-[0-1]\d-[0-3]\d [0-2]\d:[0-5]\d/g;
    
    if (!dateRe.test(startDate) && !dateRe.test(endDate)){
        res.status(400).send({id: 'invalid-date', msg: "Date(s) malformatted" });
        return;
    }
    
    startDate = new Date(startDate.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}));
    endDate = new Date(endDate.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}));
    let dateNow = new Date(new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}));
    
    if(!(startDate > dateNow)) {
        res.status(400).send({id: 'old-startDate', msg: "Start date is older than today" });
        return;
    }
    else if (!(endDate > startDate)) {
        res.status(400).send({id: 'old-endDate', msg: "End date is older than today" });
        return;
    }
    else if (monthDiff(startDate, endDate) > 2){
        res.status(400).send({id: 'long-interval', msg: "Event duration longer than 2 months" });
        return;
    }

    const event = {
        description: description.trim(),
        startDate: req.body.startDate.trim(),
        endDate: req.body.endDate.trim(),
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
    Event.findOne({_id: req.params.eventId, creator: req.userId}, (err, event) => {
        if (err){
            res.status(400).send({id: 'invalid-id', msg: "Missing creator id or event id" });
            return;
        }
        if (!event) {
            res.status(404).send({id: 'event-not-found', msg: "No event with id "+req.params.eventId});
            return;
        }
        return res.json({event});
    });
}

exports.updateEvent = (req, res) => {
    const description = req.body.description;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    
    if(!(description && description.trim().length > 0)) {
        res.status(400).send({id: 'missing-data', msg: "Insufficient data" });
        return;
    }

    let dateRe = /^[2]\d\d\d-[0-1]\d-[0-3]\d [0-2]\d:[0-5]\d/g;
    
    if (!dateRe.test(startDate) && !dateRe.test(endDate)){
        res.status(400).send({id: 'invalid-date', msg: "date malformatted" });
        return;
    }
    
    startDate = new Date(startDate.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}));
    endDate = new Date(endDate.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}));
    let dateNow = new Date(new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}));

    console.log(startDate > dateNow)
    if(!(startDate > dateNow)) {
        res.status(400).send({id: 'old-startDate', msg: "Start date is older than today" });
        return;
    }
    else if (!(endDate > startDate)) {
        res.status(400).send({id: 'old-endDate', msg: "End date is older than today" });
        return;
    }
    else if (monthDiff(startDate, endDate) > 2){
        res.status(400).send({id: 'long-interval', msg: "Event duration longer than 2 months" });
        return;
    }

    const event = {
        description: description.trim(),
        startDate: req.body.startDate.trim(),
        endDate: req.body.endDate.trim(),
    }

    Event.findOneAndUpdate({_id: req.params.eventId, creator: req.userId}, event, (err, event) => {
        if (err){
            res.status(400).send({id: 'invalid-id', msg: "Missing creator id or event id" });
            return;
        }
        if (!event) {
            res.status(404).send({id: 'event-not-found', msg: "No event with id "+req.params.eventId});
            return;
        }

        Event.findOne(event._id, (err, event) => {
            if (err){
                res.status(400).send({id: 'invalid-id', msg: "Missing creator id or event id" });
                return;
            }
            return res.json({event});
        });
    });

}

exports.deleteEvent = (req, res) => {
    Event.deleteOne({_id: req.params.eventId, creator: req.userId}, (err, event) =>  {
        if (err) {
            res.status(400).send({id: 'invalid-id', msg: "Missing creator id or event id" });
        }
        if (event.n == 0 ){
            res.status(400).send({id: 'event-not-found', msg: "No matched cases"});
            return;
        }

        if (event.deletedCount == 0){
            res.status(404).send({id: 'not-deleted', msg: "No document deleted"});
            return;
        }

        return res.json({id: 'deleted', msg:"Successful deleted"});
      });
}