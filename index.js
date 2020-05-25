const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");



const url = "mongodb://localhost:27017/todoTest";
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const todolist = {
    title: String,
    description: String
};
const List = mongoose.model("List", todolist);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use("/static", express.static("public"));

app.route("/").post(function (req, res) {
    const lists = new List({
        title: req.body.title,
        description: req.body.description,
    });
    lists.save(function (err) {
        if (!err) {
            res.redirect("/");
        } else {
            res.send(err);
        }
    });
});

// GET METHOD
app.get("/", function (req, res) {
    List.find(function (err, tasks) {
        if (!err) {
            res.render("index.ejs", {
                tasks: tasks
            });
        } else {
            res.send(err);
        }
    });
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    List.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//edit
//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        List.find({}, (err, tasks) => {
            res.render("edit.ejs", {
                tasks: tasks,
                id: id
            });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        List.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description
        }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });



app.use(express.urlencoded({
    extended: true
}));






app.listen(3000, () => console.log("Server Up and running"));