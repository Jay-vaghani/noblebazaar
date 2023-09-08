const mongoose = require("mongoose");

const ConnectDataBase = () => {
  mongoose
    .connect(process.env.MONGODB_CONNECTION, {
      dbName: "eCommerce",
    })
    .then((data) => {
      console.log(`database connected to ${data.connection.host}`);
    });
};

module.exports = ConnectDataBase;
