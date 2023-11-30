const express = require("express");
const app = express();

app.use(express.static('./client/build'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/config/db");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
     
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to ECE 9065 API." });
});

require("./app/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});