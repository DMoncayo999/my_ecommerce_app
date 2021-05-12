const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const cors = require('cors') 
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

//heroku connection
const corsOptions = {
    origin: "https://git.heroku.com/cse341-sweet-delight.git",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};
const MONGODBURL = process.env.MONGODBURL || "mongodb+srv://user:Di22mbcYcSz9cGNE@cluster0.9cael.mongodb.net/shop?retryWrites=true&w=majority";


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose
  .connect(
    "mongodb+srv://user:Di22mbcYcSz9cGNE@cluster0.9cael.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(result => {
    app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
  })
  .catch(err => {
    console.log(err);
  });

