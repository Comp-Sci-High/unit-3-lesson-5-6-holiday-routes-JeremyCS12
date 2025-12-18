const express = require("express")
const app = express()

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  // Redirect home to the themed Christmas route for this assignment
  res.redirect('/christmas');
})

app.get("/christmas", (req, res) => {
  res.sendFile(__dirname + "/public/christmas.html");
})

app.get("/mr-castro", (req, res) => {
  res.sendFile(__dirname + "/public/mr-castro.html");
})

app.get("/christmas-facts", (req, res) => {
  res.sendFile(__dirname + "/public/christmas-facts.html");
})

app.listen(3000, () => {
  console.log(`Holiday Server is Running!`)
});
