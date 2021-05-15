const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
console.log("PORT", PORT);
const MONGODB_URL = process.env.MONGODB_URL;
console.log("MONGODB_URL", MONGODB_URL);
const cors = require('cors');

const errorController = require('./controllers/error');
// const User = require('./models/user');

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


app.use((req, res, next) => {
  User.findById('')//code id
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
     'mongodb+srv://user:Di22mbcYcSz9cGNE@cluster0.9cael.mongodb.net/shop?retryWrites=true&w=majority', { useNewUrlParser: true }
  )
  .then(result => {
      User.findOne().then ( user => {
          if (!user) {
            const user = new User({
                name: 'Delfi',
                email: 'dmg@test.com',
                cart: {
                   items: []
                }
          });
          user.save();
          }
      });
    app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
  })
  .catch(err => {
    console.log(err);
  });
