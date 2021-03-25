require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/userRouter')

//modals
// const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 9000;

//middleware to 
app.use(express.json())

//routes present in routers/user.js
app.use(userRouter)


app.listen(PORT, () => {
    console.log(`Server running on local port ${ PORT }`)
});