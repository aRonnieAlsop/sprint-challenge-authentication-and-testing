const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = require('express').Router();
const Users = require('../users-model')

const hashPassword = (password) => {
  const rounds = 8
  return bcrypt.hashSync(password, rounds)
}

const generateToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const secret = process.env.JWT_SECRET || 'secret'
  const options = {
    expiresIn: '1d',
  }

  return jwt.sign(payload, secret, options)
}

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password required' })
    }

    const existingUser = await Users.findBy({ username })

    if (existingUser) {
      return res.status(400).json({ message: 'username taken' })
    }

    const hashedPassword = hashPassword(password)

    const newUser = await Users.add({ username, password: hashedPassword })

    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }

});

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password required' })
    }

    const user = await Users.findBy({ username })
    
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' })
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user)
      return res.status(200).json({ message: `welcome, ${user.username}`, token})
    } else {
      return res.status(401).json({ message: 'invalid credentials' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'server error' })
  }

})

 /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

module.exports = router
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

        /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */