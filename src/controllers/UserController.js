const router = require("express").Router();
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validation");
const HttpException = require("../utils/HttpException.utils");
const helper = require("../utils/helper.util");
const config = require("../config/general.config");
const JWT_KEY = process.env.JWT_KEY;

//register endpoint
exports.signUp = async (req, res, next) => {
  const { error, value } = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const emailExist = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
  if (emailExist)
    return res
      .status(400)
      .send({ success: false, message: "Email already exist!" });

  try {
    const newUser = await createUserObj(req);
    const savedUser = await User.create(newUser);
    return res.status(200).send({
      success: true,
      message: "User created successfully!",
      user: savedUser,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "User does not created !", error: err });
  }
};

//login endpoint
exports.signIn = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const foundUser = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
  if (!foundUser)
    return res
      .status(400)
      .send({ success: false, message: "invalid login credential" });

  try {
    const isMatch = await bcrypt.compareSync(
      req.body.password,
      foundUser.password
    );
    if (!isMatch)
      return res
        .status(400)
        .send({ success: false, message: "invalid login credential" });

    // create and assign jwt
    const token = await jwt.sign({ _id: foundUser._id }, JWT_KEY);
    const { password, ...othersFeilds } = foundUser._doc;
    return res.status(200).header("auth-token", token).send({
      success: true,
      message: "User logged successfully",
      user: othersFeilds,
      "auth-token": token,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

const createUserObj = async (req) => {
  const { firstName, lastName, email, phone } = req.body;
  return {
    firstName,
    lastName,
    email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
};
