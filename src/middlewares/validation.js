const joi = require("joi");

function registerValidation(data) {
  const schema = joi.object({
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(4).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(4).required(),
  });
  return schema.validate(data);
}

function loginValidation(data) {
  const schema = joi.object({
    email: joi.string().min(6).email().required(),
    password: joi.string().min(4).required(),
  });
  return schema.validate(data);
}

function postValidation(data) {
    const schema = joi.object({
      title: joi.string().min(4).required(),
      content: joi.string().min(4).required(),
      author: joi.required(),
    });
    return schema.validate(data);
  }

module.exports = { registerValidation, loginValidation ,postValidation };
