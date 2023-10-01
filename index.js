const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");
const {v4: uuidv4} = require('uuid')
const cookieParser = require('cookie-parser');


const PORT = 5000;
const app = express();
mongoose
.connect(
    "mongodb+srv://sahajit119:RXXhhpovcxg0681K@cluster0.j01vf9i.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(console.log("MongoDB connected🟢"));
    
    app.use(express.static("app"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    
app.use((req, res, next) => {
    if (!req.cookies.userId) {
        res.cookie('userId', uuidv4(), { maxAge: 365 * 24 * 60 * 60 * 1000 })
    }
    next();
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {

  const userId = req.cookies.userId

  if(userId) {
    Todo.find({userId}).then((result) => {
    res.render("Todo", { data: result });
    })
  } else {
    res.render("Todo", { data: null });
  }
});

app.post("/", (req, res) => {
  const todo = new Todo({
    todo: req.body.todoValue,
    userId: req.cookies.userId
  });
  todo.save().then((result) => {
    res.redirect("/");
  });
});

app.delete("/:id", (req, res) => {
  Todo.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ success: true }))
    .catch((res) => console.log(res));
});

app.listen(PORT, () => console.log(`Server Started PORT:${PORT}`));
