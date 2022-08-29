const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "hbs");
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.urlencoded({ extended: false }));
const db = require('./connection/db')

let dataProject = []

app.get("/", function (request, response) {
  db.connect(function(err, client, done){
    if (err) throw err // menampilkan error koneksi database

    client.query('SELECT * FROM tabel_project', function(err, result){
        if (err) throw err // menampilkan error dari query

        // console.log(result.rows)
        let data = result.rows

        let data_Project = data.map(function(item){
            return {
              ...item,
              duration: getDistanceTime (item.start_date, item.end_date),
              date: getFullTime (item.duration)
            }
        })

        response.render('index', {dataProject: data_Project})
    })
})
})

app.get('/detailblog/:index', function(request, response){
  let index = request.params.index

  let data = dataProject[index]
  data = {
      title: data.name,
      description: data.description,
      duration: getDistanceTime(new Date(data.startDate), new Date(data.endDate)),
      startDate: data.startDate,
      endDate: data.endDate,
  }

  response.render('detailblog', {data})
})

app.get("/myproject", function (request, response) {
  response.render("myproject");
});

app.get("/edit-project", function (request, response) {
  response.render("edit-project");
});

app.get("/detailblog", function (request, response) {
  response.render("detailblog");
});

app.get("/contact", function (request, response) {
  response.render("contact");
});

app.get("/edit-blog/:index", function (request, response) {
  let index = request.params.index

  console.log(index);
  response.render("edit-project", {index});
});

app.post('/edit-project/:index', function(request, response){

  let index = request.params.index

  dataProject[index].title = request.body.inputName;
  dataProject[index].startDate = request.body.inputStartDate;
  dataProject[index].endDate = request.body.inputEndDate;
  dataProject[index].description = request.body.inputDescription;

  response.redirect('/')
})

app.get('/delete-blog/:index', function(request, response) {
  let index = request.params.index
  console.log(index);
  dataProject.splice(index, 1)
  response.redirect('/')
})

app.post("/myproject", function (request, response) {
  console.log(request.body);
  let title = request.body.inputName;
  let startDate = request.body.inputStartDate;
  let endDate = request.body.inputEndDate;
  let description = request.body.inputDescription;
  let node = request.body.inputNode;
  let react = request.body.inputReact;
  let next = request.body.inputNext;
  let type = request.body.inputTS
  

  // console.log(title);
  // console.log(startDate);
  // console.log(endDate);
  // console.log(description);
  // console.log(node);
  // console.log(react);
  // console.log(next);
  // console.log(type);

  let project = {
    title,
    duration: new Date(),
    startDate,
    endDate,
    description,
    author: "Fernands",
    node,
    react,
    next,
    type
  }

  dataProject.push(project);

  response.redirect("/");
});

function getFullTime(time) {
  let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  let date = time.getDate();
  let monthIndex = time.getMonth();
  let year = time.getFullYear();

  let hours = time.getHours();
  let minutes = time.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  } else if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`;
  return fullTime;
}

function getDistanceTime(time, end) {
  let timeNow = end;
  let timePost = time;

  let distance = timeNow - timePost;

  let milisecond = 1000; 
  let secondInHours = 3600; 
  let hoursInDay = 24; 
  let daysInMonth = 30; 

  let distanceMonth = Math.floor(distance / (milisecond * secondInHours * hoursInDay * daysInMonth));
  let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay));
  let distanceHours = Math.floor(distance / (milisecond * 60 * 60));
  let distanceMinutes = Math.floor(distance / (milisecond * 60));
  let distanceSeconds = Math.floor(distance / milisecond);

  if (distanceMonth > 0) {
    return `${distanceMonth} months ago`;
  } else if (distanceDay > 0) {
    return `${distanceDay} days ago`;
  } else if (distanceHours > 0) {
    return `${distanceHours} hours ago`;
  } else if (distanceMinutes > 0) {
    return `${distanceMinutes} minutes ago`;
  } else {
    return `${distanceSeconds} seconds ago`;
  }
}

app.listen(8000, function () {
  console.log(`server running on port ${port}`);
});

