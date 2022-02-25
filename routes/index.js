var express = require('express');
var router = express.Router();

// start by creating data so we don't have to type it in each time
let TaskArray = [];

// define a constructor to create Task objects
let TaskObject = function (taskName, taskEstimatedTime) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.taskName = taskName;
    this.taskEstimatedTime= taskEstimatedTime;
}

TaskArray.push(new TaskObject("Do Homework", 20));
TaskArray.push(new TaskObject("Feed the cat", 60));
TaskArray.push(new TaskObject("Clean the kitchen", 25));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all Movie data */
router.get('/getAllTasks', function(req, res) {
  res.status(200).json(TaskArray);
});

/* Add one new Task */
router.post('/AddTask', function(req, res) {
  const newTask = req.body;  // get the object from the req object sent from browser
  console.log(newTask);
  TaskArray.push(newTask);  // add it to our "DB"  (array)
  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added Successfully'
  }
  res.end(JSON.stringify(TaskArray)); // send reply
});

module.exports = router;
