const express = require("express");
const mongoose = require("mongoose");
let cors = require('cors');
const bodyParser = require("body-parser");
let dbConfig = require('./database/db');
const app = express();
require('./models/usuario.js')
const passport = require("passport");
const users = require('./routes/api/usuarios.js')
const contratos = require('./routes/api/contratos.js')
// Bodyparser middleware
app.use(
   bodyParser.urlencoded({
   extended: false
   })
);
app.use(bodyParser.json());
// DB Config
const db = require("./database/db.js").mongoURI;
// Connect to MongoDB
mongoose
   .connect(
   db,
   { useNewUrlParser: true, useFindAndModify: false,  useUnifiedTopology: true }
   )
   .then(() => console.log("MongoDB successfully connected"))
   .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
// app.use("/", draw(
//    <h1>Servidor on</h1>
// ));
app.use("/api/users", users);
app.use("/api/contratos", contratos);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
