const Joi = require("joi");

const minYear = 1908;
const currentYear = new Date().getFullYear();

const searchQueryValidator = Joi.object({
  _id: Joi.string(),
  make: Joi.string(),
  model: Joi.string(),
  year: Joi.number().min(minYear).max(currentYear),
  color: Joi.string(),
  vin: Joi.string(),
});

const newCarValidator = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().min(minYear).max(currentYear).required(),
  color: Joi.string().required(),
  vin: Joi.string().required(),
});

const updateCarValidator = Joi.object({
  make: Joi.string(),
  model: Joi.string(),
  year: Joi.number().min(minYear).max(currentYear),
  color: Joi.string(),
  vin: Joi.string(),
}).min(1);

module.exports = {
  searchQueryValidator,
  newCarValidator,
  updateCarValidator,
};
