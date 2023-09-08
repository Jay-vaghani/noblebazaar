const app = require("./app");
const dotenv = require("dotenv");
const dataBaseCOnnection = require("./config/databaseConnect");

// ******************** Unhandled Exception ********************
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down the server due to 'Unhandled Exception'");
  process.exit(1);
});

// ******************** Unhandled Rejection ********************
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down the server due to 'Unhandled Rejection'");

  server.close(() => {
    process.exit(1);
  });
});

// ******************** CONFIG ********************

// ********** DOT_ENV **********
dotenv.config({ path: "./config/config.env" });

// ******************** DATABASE CONNECTION ********************
dataBaseCOnnection();

const server = app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});

// console.log(youtube);
