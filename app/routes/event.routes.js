module.exports = app => {
    const eventController = require("../controllers/event.controller.js");
    const authMiddleware = require('../middlewares/Auth.js')
    const router = require("express").Router();

    router.post("/create", eventController.createEvent);

    router.get("/listAll", eventController.listAll);

    router.get("/listOne/:eventId", eventController.listOne);

    router.post("/update/:eventId", eventController.updateEvent);

    router.delete("/delete/:eventId", eventController.deleteEvent);

    app.use('/api/events', authMiddleware.privateUser, router);
}