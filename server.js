const express = require("express")
const path = require("path")
const mongoose = require("mongoose")

const app = express()
const PORT = process.env.PORT || 8080

var db = require("./models")
const { Workout } = require("./models")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// CXN to Mongoose =========
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true })

// HTML Routes ===================================================================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
  });

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/exercise.html"))
  });

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"))
  });

// API Routes ====================================================================================

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
    //.populate("exercises")
    .then(dbWorkout => { res.json(dbWorkout) })
    .catch( err => { res.json(err) })
})

app.get("/api/workouts/", (req, res) => {
    db.Workout.find({})
    //.populate("exercises")
    .then(dbWorkout => { res.json(dbWorkout) })
    //.then(dbWorkout => { console.log(dbWorkout) })
    .catch( err => { res.json(err) })
})

app.get("/api/workouts/:id", ({ id }, res) => {
        console.log("GET /api/workouts: " + id) // DEL
    db.Workout.find({ _id: id })
    .then( dbWorkout => { res.json(dbWorkout) })
    .catch( err => { res.json(err) })
})

app.put("/api/workouts/:id", (req, res) => {
  const id = req.params.productId;
    db.Workout.update({ _id: id}, { $push: req.body }, {new: true})
    .then( dbExercise => { res.json(dbExercise) })
    .catch( err => { res.json(err) })
})

app.post("/api/workouts", ({body}, res) => {
  var exercise = new Workout(body)
  exercise.getDuration()
  db.Workout.create(exercise)
  //.then(({ _id }) => { db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, {new: true}) })
  .then( dbExercise => { res.json(dbExercise) })
  .catch( err => { res.json(err) })
})

// App Init ==========================================================
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
  });