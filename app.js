const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const MONGODBURL = process.env.MONGODBURL;
const cors = require('cors'); 

const errorController = require('./controllers/error');
const User = require('./models/user');

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


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use((req, res, next) => {
  User.findById('5bab316ce0a7c75f783cb8a8')//hard code id
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
     MONGODBURL, options
  )
  .then(result => {
    app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
  })
  .catch(err => {
    console.log(err);
  });
