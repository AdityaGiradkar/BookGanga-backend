require('./db/mongoose');
const express = require('express');
// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUI = require('swagger-ui-express');
const userRouter = require('./routers/userRouter')
const blogRouter = require('./routers/blogRouter')
const tagRouter = require('./routers/tagRouter')
const bookRouter = require('./routers/bookRouter')

//modals
// const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 9000;

//swagger options decleariation for documaintation
// const options = {
//     swaggerDefinition: {
//         openapi: "3.0.0",
//         info: {
//             title: "BookGAnga API",
//             version: "1.0.0",
//             description: "BookGanga API Documentations",
//             contact: {
//                 name: "Aditya Giradkar",
//                 email: "giradkaraditya3@gmail.com"
//             }
//         },
//         servers: [{
//                 url: "http://localhost:9000"
//             },
//             {
//                 url: "https://book-ganga.herokuapp.com"
//             }
//         ],
//     },
//     apis: ["./routers/*.js"]
// };

// const swaggerDocs = swaggerJsDoc(options);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))


//middleware to 
app.use(express.json())

//Routes for API
app.use(userRouter)
app.use(blogRouter)
app.use(tagRouter)
app.use(bookRouter)

//start listning on port specify by server or default 9000
app.listen(PORT, () => {
    console.log(`Server running on local port ${ PORT }`)
});