const mongoose = require("mongoose");

mongoose
  .connect(
    
    "mongodb+srv://" + process.env.DB_USER_PASS + "@cluster0.54sz4.mongodb.net/mern-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));