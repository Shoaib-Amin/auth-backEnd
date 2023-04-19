const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
app.use(bodyParser.json());

//AVOIDING CORS ISSUE
const corsOptions = {
    exposedHeaders: 'Authorization',
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
};
app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
app.use(cors(corsOptions));


const PORT = 5000 || process.env.PORT

mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

//Import Routes
const authRoute = require('./routes/auth');

//Import Middlewares
app.use('/api/auth', authRoute);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));