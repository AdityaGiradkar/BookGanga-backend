const mongoose = require('mongoose')


//database user_name = BookGanga
//database password = BookGanga123


const DbUrl = 'mongodb+srv://BookGanga:BookGanga123@bookganga.9s1u5.mongodb.net/BookGanga?retryWrites=true&w=majority';
mongoose.connect(DbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});