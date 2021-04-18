const mongoose = require('mongoose')

//database user_name = BookGanga
//database password = BookGanga123
//database name = BookGangaDB

// compass = mongodb+srv://BookGanga:BookGanga123@bookgangadb.anlus.mongodb.net/test


const DbUrl = 'mongodb+srv://BookGanga:BookGanga123@bookgangadb.anlus.mongodb.net/BookGangaDB?retryWrites=true&w=majority';
//const DbUrl='mongodb://127.0.0.1:27017/BookGanga-DB'

mongoose.connect(DbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

var con = mongoose.connection;
con.on('connected', function() {
    console.log('database is connected successfully');
});

con.on('disconnected', function() {
    console.log('database is disconnected successfully');
})

con.on('error', console.error.bind(console, 'connection error:'));

module.exports = con;