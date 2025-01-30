const mongoose = require("mongoose")



const UserSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true })

const Usermodel = mongoose.model("user", UserSchema)

module.exports = {
    Usermodel
}