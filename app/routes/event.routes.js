module.exports = app => {
    const eventController = require("../controllers/event.controller.js");
    const authMiddleware = require('../middlewares/auth.js')
    const router = require("express").Router();

    // Cria novo evento
    router.post("/", eventController.createEvent);

    // Lista todos os eventos do usuário
    router.get("/", eventController.listAll);

    // Lista um evento do usuário
    router.get("/:eventId", eventController.listOne);

    // Atualiza um evento do usuário
    router.put("/:eventId", eventController.updateEvent);

    // Deleta um evento do usuário
    router.delete("/:eventId", eventController.deleteEvent);

    app.use('/api/events', authMiddleware.privateUser, router);
}