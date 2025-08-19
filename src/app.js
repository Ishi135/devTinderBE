const express = require('express')
const app = express();
const connectDb = require('./config/database')
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')

app.use(express.json());  //  used to parse request body
app.use(cookieParser());  //  used to parse cookie otherwise gets undefined

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)

app.use('/', (err, req, res, next) => {
  res.status(500).send('Something went wrong!');
})

connectDb()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
  }).catch(() => {
    console.error('Database connection failed');
  })