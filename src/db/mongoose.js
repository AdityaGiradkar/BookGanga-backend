const mongoose = require('mongoose')


//database user_name = BookGanga
//database password = BookGanga123
//database name = BookGangaDB


// const DbUrl = 'mongodb+srv://BookGanga:BookGanga123@bookganga.9s1u5.mongodb.net/BookGanga?retryWrites=true&w=majority';
const DbUrl = 'mongodb+srv://BookGanga:BookGanga123@bookgangadb.anlus.mongodb.net/BookGangaDB?retryWrites=true&w=majority';
// mongoose.connect(DbUrl, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

mongoose.connect(DbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});