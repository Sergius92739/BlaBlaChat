const db = require('../db')

const activate = async (res, activationLiink) => {
  try {
    const user = await db.query('SELECT * FROM users WHERE activation_link = $1', [activationLiink])
    if (!user) {
      return res.status(401)
    }
    await db.query(`UPDATE users SET is_activated = true WHERE activation_link = '${activationLiink}'`)
    return res.status(200)
  } catch (error) {
    console.log(error)
    return res.status(500)
  }
}

module.exports = { activate }
