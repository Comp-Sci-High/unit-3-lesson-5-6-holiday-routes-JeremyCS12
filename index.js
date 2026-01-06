
const express = require("express") //Import the express library
const app = express() //Create an express application

app.use(express.static(__dirname + "/public")) //Serve static files from the public directory

app.get("/", (req, res) => { //Home route
  // Redirect home to the themed Christmas route for this assignment
  res.redirect('/christmas'); // Redirect to /christmas
})

app.get("/christmas", (req, res) => { //Christmas route
  res.sendFile(__dirname + "/public/christmas.html"); //Send the christmas.html file
})

app.get("/mr-castro", (req, res) => { //Mr. Castro route
  res.sendFile(__dirname + "/public/mr-castro.html"); //Send the mr-castro.html file
})

app.get("/christmas-facts", (req, res) => { //Christmas Facts route
  res.sendFile(__dirname + "/public/christmas-facts.html"); //Send the christmas-facts.html file
})

app.listen(3000, () => { //Start the server on port 3000
  console.log(`Holiday Server is Running!`) //Log a message to the console
});
