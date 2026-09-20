const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel")

async function signup(req, res) {
    try{
        const {fullName, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
    })

    res.status(201).json({
            message: "User has been created",
            user: user,
        });
    } catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = {
    signup,
}