const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const User = require('./model/user')
const cors = require('cors')
const bqrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//load config variables
dotenv.config({path: './config/config.env'})

const app = express()
app.use(cors())
//request parse JSON
app.use(express.json())

//Для отправки формы через Index.html
// const urlencodedParser = express.urlencoded({extended: false});

// express.urlencoded({})

//register
app.post('/register', async (req, res) => {
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
    //Делаем валидацию полей от пользователя
    if (!firstName && !lastName && !email && !password) {
        res.status(400).send('Введите все поля корректно')
        return
    }
    //Проверка есть ли пользователь
    const user = await User.findOne({email})
    if (user) {
        res.status(409).send('Пользователь уже существует. Выполните вход')
        return
    }
    //Шифруем пароль
    const encriptedPassword = await bqrypt.hash(req.body.password, 10)
    // Сохранить пользователя в BD
    const newUser = await User.create({
        firstName, lastName, email, password: encriptedPassword
    })
    //генерируем токет

    const token = jwt.sign({user_id: newUser._id}, process.env.TOKEN_SECRET_KEY, {expiresIn: '2h'})

    //Сохраняем токен в базе данных

    newUser.token = token
    await newUser.save()
        //Отправляем ответ пользователю
    res.status(201).json(newUser)

})

//login
app.post('/login', async (req, res) => {
    //Получаем данные от пользователя через форму(email password ...)
    //Делаем валидацию полей от пользователя
    //Проверяем, есть ли пользователь
    //Если есть
    //Создаем JWT token для пользователя
    //Делаем ответ пользователю success
    //Если нет, делаем ответ Ошибку авторизации
    const {email, password} = req.body
    if(!email && !password){
        res.status(400).send('введите логин и пароль')
        return
    }
    //Проверяем есть ли пользователь
    const user = await User.findOne({email})

    const coorectPassword = await bqrypt.compare(req.body.password, user.password)
    if (!user && !coorectPassword){
        res.status(401).send('Неправильное имя или пароль')
        return
    }
    const token = jwt.sign({user_id: user._id}, process.env.TOKEN_SECRET_KEY, {expiresIn: '2h'})

    user.token = token
    await user.save()
    res.status(200).json(user)

})

app.get('/logout',async (req, res) => {
    //Получаем токен из заголовков
    //расшифровываем токен
    //Если у нас в токене есть Id, то в юсере token: удаляем
    //Если нет, то токен не действителен(истек)

    const [Bearer,token] = req.headers.authorization.split(' ')

    if(!token && Bearer !== 'Bearer'){
        res.status(401).send('Пользователь не аторизирован')
        return
    }
    try {
        const userId = jwt.decode(token, process.env.TOKEN_SECRET_KEY)
        console.log(userId.id)
        //todo fix this User.findByIdAndUpdate
        const user = await User.findByIdAndUpdate(userId.id,{token: null} )
        console.log(user)
        res.status(201)


    }catch (e) {
        console.log(e)
    }


})


//connect dataBase
connectDB()

const server = app.listen(process.env.PORT, () => {
    console.log('server runing on port ' + process.env.PORT)
})

process.on('unhandledRejection', (error, promice) => {
    if (error) {
        console.log(`error: ${error.message}`)
        server.close(() => process.exit(1))
    }

})

