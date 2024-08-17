const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModal');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModal');

dotenv.config({ path: './config.env' });

//we are using the data here from config.env file
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    // setNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log('DB connection succesfull'));

//READ JSON FILE
//we are using JSON.parse() as in the given file below is in the json format so we first need to convert it into JS than we can use it in the functions
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

//IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false }); // here we are explicitly turning of validation which we have in our api so that we can pass data into database
    await Review.create(reviews);
    console.log('Data succesfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    // this deleteMany() will delete all the content from the document as we are not passing any arguments in it
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data succesfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
