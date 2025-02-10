 require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const parser = bodyParser.urlencoded({extended: false})
const fileUpload = require('express-fileupload')
const {Server} = require("socket.io")
const cors = require('cors')
const helmet = require("helmet")
const app = express()
const server = require("http").createServer(app)
const port = process.env.PORT || 7070
const router = require('./routes/user.routes')

// const io = new Server(server, {
//   cors: {
//     origin: `http://localhost:5173`,
//     credentials: "true"
//   }
// })

app.use(helmet())
app.use(express.json())
app.use('/api', router)
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload({}))
app.use(express.static(__dirname + '/uploaded'))

app.get('/', (req, res) => {
  res.sendFile("public/index.html", {root: __dirname})
})

// io.on("connection", (socket) => {
//   console.log(`пользователь ${socket.id} подключился`)
//   socket.on('disconnect', () => {
//     console.log(`user ${socket.id} disconnect`)
//   })
// })


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})