const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main()
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async function () {
  await Listing.deleteMany();
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6884b87724230b3939924baf",
  }));
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data");
};

initDB();
