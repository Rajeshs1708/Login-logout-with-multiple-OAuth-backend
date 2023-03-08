const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Users = require('../Models/user.model')

const router = express.Router()

//signup
router.post('/signup', async (req, res) => {
  try {
    const payload = req.body
    payload.hashedPassword = await bcrypt.hash(payload.password, 10)
    delete payload.password
    let user = new Users(payload) //creating mongoose object
    await user.save((err, data) => {
      if (err) {
        return res.status(400).send({
          message: ' User Already Exist .'
        })
      }
      return res.status(201).send({
        message: 'User has been registered successfully.'
      })
    })
  } catch (err) {
    console.log('Error: ', err)
    return res.status(500).send({
      message: 'Internal Server Error'
    })
  }
})

// signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body
    const existingUser = await Users.findOne({ email: email })
    if (existingUser) {
      const isValidUser = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      ) //true or false
      if (isValidUser) {
        const token = jwt.sign(
          { _id: existingUser._id },
          process.env.SECRET_KEY
        )
        //persist the token as 't' in cookie with expiry date
        res.cookie('entryToken', token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        //return response with user and token to frontend client
        const { _id, name, email } = existingUser
        return res
          .status(200)
          .send({ token: token, user: { _id, email, name } })
      }
      return res.status(400).send({
        message: 'Email/Password are not matching.'
      })
    }
    return res.status(400).send({
      message: "User doesn't exist."
    })
  } catch (err) {
    return res.status(500).send({
      message: 'Internal Server Error'
    })
  }
})

//Get user
router.get('/getUser', (req, res) => {
  if (req.user) {
    res.status(200).send({
      user: user
    })
  } else {
    res.status(403).send({
      success: true,
      message: 'Not Authorized'
    })
  }
})

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const _otp = Math.floor(100000 + Math.random() * 900000)

    let user = await Users.findOne({ email: req.body.email })

    if (!user) {
      res.send({ code: 500, message: 'User not Found' })
    }

    //Nodemailer
    let testAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    })

    let info = await transporter.sendMail({
      from: 'rajeshlakshmik@gmail.com', // sender address
      to: req.body.email, // list of receivers
      subject: 'OTP', // Subject line
      text: String(_otp), // plain text body
      html: '<b>Hello world?</b>' // html body
    })

    if (info.messageId) {
      Users.updateOne({ email: req.body.email }, { otp: _otp })
        .then(result => {
          res.send({ code: 200, message: 'OTP send', otp: _otp })
        })
        .catch(err => {
          res.send({ code: 500, message: 'Server error inside' })
        })
    } else {
      res.send({ code: 500, message: 'Server error' })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  }
})

// Submit OTP
router.post('/submit-otp', async (req, res) => {
  try {
    const payload = req.body
    //New password hashing
    payload.hashedPassword = await bcrypt.hash(payload.password, 10)
    delete payload.password
    Users.findOne({ otp: payload.otp })
      .then(result => {
        //update password
        Users.updateOne(
          { email: result.email },
          { hashedPassword: payload.hashedPassword }
        )
          .then(result => {
            res.send({ code: 200, message: 'Password Updated.' })
          })
          .catch(err => {
            res.send({ code: 500, message: 'Server error' })
          })
      })
      .catch(error => {
        res.send({ code: 500, message: 'OTP is wrong' })
      })
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error'
    })
  }
})

// signout
router.get('/signout', (req, res) => {
  res.clearCookie('entryToken')

  return res.status(200).send({
    message: 'Successfully Signed out! '
  })
})

module.exports = router
