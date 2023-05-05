const data = require("./data.json");
const carModel = require("../models/car.model");
const seedData = async () => {
  console.log("Seeding data");
  await carModel.create(data.cars);
};

module.exports = seedData;
