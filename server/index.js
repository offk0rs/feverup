const express = require("express");
const app = express();
const routes = require('./routes/routes.js');
const bodyParser = require("body-parser")
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes.apiRouter)

app.listen(PORT, () => {
    console.log("feverUp API launched on port " + PORT);
});