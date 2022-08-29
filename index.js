const express = require("express");
const app = express();
const port = 8000;
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");

const db = require("./connection/db");
const upload = require("./middleware/file-upload");

app.use(flash());

app.use(
  session({
    secret: "fernands",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
    },
  })
);

app.set("view engine", "hbs");
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.urlencoded({ extended: false }));
app.use("/img-upload", express.static(__dirname + "/img-upload"));

// BAGIAN INDEX
app.get("/", function (request, response) {
  db.connect(function (err, client, done) {
    if (err) throw err;

    // console.log(request.session);

    const query =
      "SELECT tabel_project.id, tabel_project.name, tabel_project.description, tabel_project.technologies,tabel_project.start_date, tabel_project.end_date, tabel_project.date,tabel_project.images, tabel_project.user_id, tabel_user.name as user FROM tabel_project LEFT JOIN tabel_user ON tabel_project.user_id = tabel_user.id ORDER BY id DESC";

    client.query(query, function (err, result) {
      if (err) throw err;

      let data = result.rows;
      // console.log(result.rowCount);

      let dataProject = data.map(function (item) {
        return {
          ...item,
          duration: getDistanceTime(item.start_date, item.end_date),
          date: getFullTime(item.duration),
          isLogin: request.session.isLogin,
        };
      });

      let filterBlog;
      if (request.session.user) {
        filterBlog = dataProject.filter(function (item) {
          return item.user_id === request.session.user.id;
        });
        // console.log(filterBlog);
      }

      let resultProject = request.session.user ? filterBlog : dataProject;

      response.render("index", { dataProject: resultProject, user: request.session.user, isLogin: request.session.isLogin });
    });
  });
});
// AKHIR BAGIAN INDEX

// BAGIAN DETAIL BLOG
app.get("/detail-project/:idParams", function (request, response) {
  let id = request.params.idParams;

  if (!request.session.user) {
    request.flash("danger", "Silahkan login!");
    return response.redirect("/login");
  }

  db.connect(function (err, client, done) {
    if (err) throw err;

    let query = `SELECT * FROM tabel_project WHERE id=${id}`;

    client.query(query, function (err, result) {
      if (err) throw err;

      // console.log(result.rows[0]);
      let data = result.rows;

      let dataProject = data.map(function (item) {
        return {
          ...item,
          duration: getDistanceTime(item.start_date, item.end_date),
          start_date: getFullTime(item.start_date),
          end_date: getFullTime(item.end_date),
          isLogin: request.session.isLogin,
          images: item.images
        };
      });

      response.render("detail-project", { data: dataProject[0], user: request.session.user, isLogin: request.session.isLogin });
    });
  });
});
// AKHIR BAGIAN DETAIL BLOG

// BAGIAN ADD MY PROJECT
app.get("/myproject", function (request, response) {
  if (!request.session.user) {
    request.flash("danger", "Silahkan login!");
    return response.redirect("/login");
  }
  request.session.isLogin, response.render("myproject", { user: request.session.user, isLogin: request.session.isLogin });
});

app.post("/myproject", upload.single("inputImages"), function (request, response) {
  let { inputName: name, inputDescription: description, inputStartDate: startDate, inputEndDate: endDate, inputNode: inputNode, inputReact: inputReact, inputNext: inputNext, inputTS: inputTS } = request.body;

  const images = request.file.filename;

  db.connect(function (err, client, done) {
    if (err) throw err;

    const userId = request.session.user.id;

    let query = `INSERT INTO public.tabel_project (
        name, start_date, end_date, description, technologies, images, user_id)
        VALUES ('${name}', '${startDate}', '${endDate}', '${description}', '{"${inputNode}","${inputReact}","${inputNext}","${inputTS}"}','${images}', ${userId});`;

    client.query(query, function (err, result) {
      if (err) throw err;

      response.redirect("/");
    });
  });
});
// AKHIR BAGIAN ADD MY PROJECT

// BAGIAN EDIT PROJECT
app.get("/edit-project/:idParams", function (request, response) {
  let id = request.params.idParams;

  if (!request.session.user) {
    request.flash("danger", "Silahkan login!");
    return response.redirect("/login");
  }

  db.connect(function (err, client, done) {
    if (err) throw err;

    let query = `SELECT * FROM tabel_project WHERE id='${id}'`;

    client.query(query, function (err, result) {
      if (err) throw err;

      let data = result.rows;
      let dataRows = {
        name: data[0].name,
        description: data[0].description,
        startDate: getStart(data[0].start_date),
        endDate: getEnd(data[0].end_date),
      };

      response.render("edit-project", { data: dataRows, id });
    });
  });
});

app.post("/edit-project/:idParams", upload.single("inputImages"), function (request, response) {
  let id = request.params.idParams;

  db.connect(function (err, client, done) {
    if (err) throw err;

    let { inputName, inputDescription, inputStartDate, inputEndDate, inputNode, inputReact, inputNext, inputTS } = request.body;
    let images = request.file.filename

    let query = `UPDATE tabel_project
      SET name = '${inputName}', start_date='${inputStartDate}', end_date='${inputEndDate}', description='${inputDescription}', technologies='{"${inputNode}","${inputReact}","${inputNext}","${inputTS}"}', images= '${images}' 
      WHERE id=${id}`;

    client.query(query, function (err, result) {
      if (err) throw err;

      response.redirect("/");
    });
  });
});
// BAGIAN AKHIR EDIT PROJECT

// BAGIAN CONTACT
app.get("/contact", function (request, response) {
  if (!request.session.user) {
    request.flash("danger", "Silahkan login!");
    return response.redirect("/login");
  }

  request.session.isLogin, response.render("contact", { user: request.session.user, isLogin: request.session.isLogin });
});
// BAGIAN AKHIR CONTACT

// BAGIAN REGISTER
app.get("/register", function (request, response) {
  response.render("register");
});

app.post("/register", function (request, response) {
  // console.log(request.body);
  let { inputName, inputEmail, inputPassword } = request.body;

  db.connect(function (err, client, done) {
    if (err) throw err;
    const hashedPassword = bcrypt.hashSync(inputPassword, 10);

    let query = `INSERT INTO public.tabel_user(name, email, password)
    VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}');`;

    client.query(query, function (err, result) {
      if (err) throw err;

      response.redirect("/login");
    });
  });
});
// BAGIAN AKHIR REGISTER

// BAGIAN LOGIN
app.get("/login", function (request, response) {
  response.render("login");
});

app.post("/login", function (request, response) {
  let { inputEmail, inputPassword } = request.body;

  let query = `SELECT * FROM tabel_user WHERE email='${inputEmail}'`;
  db.connect(function (err, client, done) {
    if (err) throw err;

    client.query(query, function (err, result) {
      if (err) throw err;
      
      // console.log(result.rows[0]);
      if (result.rows.length == 0) {
        console.log("Email belum terdaftar");
        request.flash("danger", "Email belum terdaftar");
        return response.redirect("/login");
      }

      const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password);
      console.log(isMatch);

      if (isMatch) {
        console.log("Login berhasil");

        request.session.isLogin = true;
        request.session.user = {
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
        };
        request.flash("success", "Login berhasil");
        response.redirect("/");
      } else {
        console.log("Password salah");
        request.flash("danger", "Password salah");
        response.redirect("/login");
      }
    });
  });
});
// BAGIAN AKHIR LOGIN

// BAGIAN LOGOUT
app.get("/logout", function (request, response) {
  request.session.destroy();
  response.redirect("login");
});

// BAGIAN DELETE PROJECT
app.get("/delete-project/:idParams", function (request, response) {
  let id = request.params.idParams;

  db.connect(function (err, client, done) {
    if (err) throw err;

    let query = `DELETE FROM tabel_project WHERE id=${id}`;

    client.query(query, function (err, result) {
      if (err) throw err;

      response.redirect("/");
    });
  });
});
// BAGIAN AKHIR DELETE PROJECT

// FUNCTION
function getStart(start) {
  let d = new Date(start),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = "0" + month;
  }

  if (day.length < 2) {
    day = "0" + day;
  }

  return [year, month, day].join("-");
}

function getEnd(end) {
  let d = new Date(end),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = "0" + month;
  }

  if (day.length < 2) {
    day = "0" + day;
  }

  return [year, month, day].join("-");
}

function getFullTime(time) {
  let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  let date = new Date(time).getDate();
  let monthIndex = new Date(time).getMonth();
  let year = new Date(time).getFullYear();

  let fullTime = `${date} ${month[monthIndex]} ${year}`;
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

// AKHIR FUNCTION

app.listen(8000, function () {
  console.log(`server running on port ${port}`);
});
