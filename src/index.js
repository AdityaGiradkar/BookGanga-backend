require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/userRouter')
const blogRouter = require('./routers/blogRouter')
const tagRouter = require('./routers/tagRouter')
const bookRouter = require('./routers/bookRouter')

//modals
// const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 9000;

//middleware to 
app.use(express.json())
app.use(userRouter)
app.use(blogRouter)
app.use(tagRouter)
app.use(bookRouter)


app.listen(PORT, () => {
    console.log(`Server running on local port ${ PORT }`)
});