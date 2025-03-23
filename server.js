if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: './.env' });  // Load environment variables from .env file if not in production mode.
}
const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bodyParser = require('body-parser'); 
const bookRouter= require('./routes/books');
const methodOverride = require('method-override');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');
app.use(expressLayout);
app.use(express.static('public'));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: 'Something broke!' });
});
app.use("/",indexRouter);
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use('/books',bookRouter);
app.use(methodOverride('_method'));
app.use("/authors",authorRouter);

app.listen(process.env.PORT || 3000);