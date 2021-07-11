require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authMiddleware = require('./app/middlewares/Auth');
const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ msg: "Está funcionando!" });
});

const db = require("./app/models");
db.mongoose
  .connect(db.url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch(err => {
    console.log("Não foi possível conectar ao banco de dados", err);
    process.exit();
  });

require("./app/routes/user.routes")(app);
require("./app/routes/event.routes")(app);

app.use('/checkUser', authMiddleware.privateUser, (req, res)=>{
  res.status(200).json({data:200});
});

const PORT = process.env.PORT || 3030; //mudar para 8080
app.listen(PORT, () => {
  console.log(`Servidor está executando na porta ${PORT}.`);
});