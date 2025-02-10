const nodemailer = require('nodemailer')

const sendActivationMail = async (res, to, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      sevure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html: `
              <div>
                  <h1>Для активации перейдите по ссылке</h1>
                  <a href="${link}">${link}</a>
              </div>
          `,
    })
    return res.status(200)
  } catch (error) {
    console.log(error)
    return res.status(500)
  }
}

module.exports = { sendActivationMail }

// const sendActivationMail = async (req, res) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.mail.ru',
//       port: 465,
//       secure: true,
//       auth: {
//         user: 'blablachat84@mail.ru',
//         pass: 'Zyj9djksvBwBaiueBahD'
//       }
//     })
//   } catch (error) {
//     return res.status(500).send({
//       status: 500,
//       message: 'Ошибка при запросе'
//     })
//   }
// }
