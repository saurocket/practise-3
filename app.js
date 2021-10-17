const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const User = require('./model/user')
const cors = require('cors')

//load config variables
dotenv.config({path: './config/config.env'})

const app = express()
app.use(cors())
//request parse JSON
app.use(express.json())

// express.urlencoded({})

//register
app.post('/register',async (req, res) => {
    // console.log(req.body)
    //Получаем данные от пользователя через форму(email password ...)
    //Делаем валидацию полей от пользователя
    //Проверяем, есть ли пользователь
    //Если есть выкидывает сообщение что пользователь есть
    //Если нет, шифруем пароль
    //Cоздаем пользователя в БД
    //Создаем JWT token для пользователя
    //Делаем ответ пользователю success

    const {firstName, lastName, email, password} = req.body

        console.log(firstName, lastName, email, password)
})

//login
app.post('/login', (req, res) => {
    //Получаем данные от пользователя через форму(email password ...)
    //Делаем валидацию полей от пользователя
    //Проверяем, есть ли пользователь
    //Если есть
    //Создаем JWT token для пользователя
    //Делаем ответ пользователю success
    //Если нет, делаем ответ Ошибку авторизации


})

//connect dataBase
connectDB()

const server = app.listen(process.env.PORT, () => {
    console.log('server runing on port ' + process.env.PORT)
})

process.on('unhandledRejection', (error, promice) => {
    if(error){
        console.log(`error: ${error.message}`)
        server.close(()=> process.exit(1))
    }

})

