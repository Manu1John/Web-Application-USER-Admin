const User = require("../models/userModel")
const bcrypt = require("bcrypt")

exports.getUsers = async (search) => {

  let query = {}

  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }
  }

  return await User.find(query)
}

exports.createUser = async (data) => {

  const { name, email, password } = data

  const existingUser = await User.findOne({ name })

  if (existingUser) return null

  const hashedPassword = await bcrypt.hash(password, 10)

  return await User.create({
    name,
    email,
    Password: hashedPassword
  })
}

exports.updateUser = async (id, data) => {

  return await User.findByIdAndUpdate(id, {
    name: data.name,
    email: data.email
  })
}

exports.deleteUser = async (id) => {

  return await User.findByIdAndDelete(id)

}