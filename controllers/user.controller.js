const db = require('../db')
const path = require('path')
const { unlink } = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { formidable } = require('formidable')
const { moveFile } = require('move-file')
const { sendActivationMail } = require('../service/mail.service')
const { v4: uuidv4 } = require('uuid')
const userService = require('../service/user.service')

const registration = async (req, res, next) => {
  try {
    const form = formidable({})

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err)
        return
      }

      const { login, password, email } = fields

      // Проверка логина не изпользуется ли
      const isLoginUsed = await db.query('SELECT * FROM users WHERE login = $1', [login[0]])

      // Проверка email не изпользуется ли
      const isEmailUsed = await db.query('SELECT * FROM users WHERE email = $1', [email[0]])

      //Отправка письма с сылкой подтверждения
      const activationLink = uuidv4()
      const isEmailValid = await sendActivationMail(
        res,
        email[0],
        `${process.env.API_URL}/api/activate/${activationLink}`,
      )

      if (isLoginUsed.rows[0]) {
        return res.json({
          message: 'Данный username уже занят.',
        })
      }

      if (isEmailUsed.rows[0]) {
        return res.json({
          message: 'Пользователь с данным email уже зарегестрирован',
        })
      }

      if (isEmailValid.statusCode === 500) {
        return res.json({
          message: 'Неверный адрес электронной почты',
        })
      }

      let fileName

      if (files.avatar && files.avatar[0].size) {
        fileName = Date.now().toString() + form.openedFiles[0].originalFilename
        await moveFile(files.avatar[0].filepath, path.join(__dirname, '..', 'uploaded', fileName))
      } else {
        fileName = ''
      }

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password[0], salt, (err) => {
        console.log('err: ', err)
      })

      const newUser = await db.query(
        'INSERT INTO users (login, password, avatar, is_online, email, activation_link) values ($1, $2, $3, $4, $5, $6) RETURNING *',
        [login[0], hash, fileName, 'online', email[0], activationLink],
      )

      const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        user: {
          id: newUser.rows[0].id,
          login: newUser.rows[0].login,
          avatar: newUser.rows[0].avatar,
          is_active: newUser.rows[0].is_active,
        },
        token,
        message: 'Регистрация прошла успешно',
      })
    })
  } catch (error) {
    console.error(error)
    res.json({ message: 'Ошибка при регистрации пользователя' })
  }
}

const activate = async (req, res) => {
  try {
    const activationLink = req.params.link
    console.log('activationLink in params: ', `${activationLink}`)
    const activateUser = await userService.activate(res, activationLink)
    if (activateUser.statusCode === 401) {
      return res.json({
        message: 'Некорректная ссылка активации',
      })
    }
    if (activateUser.statusCode === 500) {
      return res.json({
        message: 'Непредвиденная ошибка',
      })
    }
    return res.redirect(process.env.CLIENT_URL)
  } catch (err) {
    console.log(err)
  }
}

const login = async (req, res) => {}

const getUsers = async (req, res) => {}

const getOneUser = async (req, res) => {}

const logout = async (req, res) => {}

const refresh = async (req, res) => {}

const updateUser = async (req, res) => {}

const deleteUser = async (req, res) => {}

module.exports = { registration, login, logout, refresh, activate, getUsers, getOneUser, updateUser, deleteUser }
