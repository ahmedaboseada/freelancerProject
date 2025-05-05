const mongoose = require("mongoose");


mongoose.connect(process.env.MONGO_URI).then((conn) => {
  console.log(`Database Connected: ${conn.connection.host}`);
});

module.exports = mongoose;


// VtAGK7MnQRBBOJ6V
// mongodb+srv://freelancing:VtAGK7MnQRBBOJ6V@cluster0.kwuh4fr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0