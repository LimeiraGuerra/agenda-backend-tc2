module.exports = app => {
    const eventController = require("../controllers/event.controller.js");

    const router = require("express").Router();

    router.post("/create", eventController.createEvent);

    router.get("/listAll", eventController.listAll);

    router.get("/listOne/:eventId", eventController.listOne);

    router.post("/update", eventController.updateEvent);

    router.delete("/delete/:eventId", eventController.deleteEvent);

    app.use('/api/events', router);
}