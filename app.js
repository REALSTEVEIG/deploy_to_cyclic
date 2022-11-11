require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = 3000
const connectDB = require('./db/connect')
const router = require('./routes/auth')
const {engine} = require('express-handlebars')
const path = require('path')
const cookieParser = require('cookie-parser')
const notFoundError = require('./middleware/notfound')
const serverError = require('./middleware/servererror')
const helmet = require('helmet')
const cors = require('cors')
const limiter = require('express-rate-limit')
const xss = require('xss-clean')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.set('trust proxy', 1)
app.use(limiter({windowsMS : 15 * 60 * 1000,  max : 100}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(cookieParser())

app.use('/', router)

app.use(notFoundError)
app.use(serverError)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()