const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "hbs");
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.urlencoded({ extended: false }));

app.get("/", function (request, response) {
  response.render("index");
});

app.get("/contact", function (request, response) {
  response.render("contact");
});

let isLogin = true;

app.get("detailblog", function (request, response) {
  let id = request.params.id;
  console.log(id);

  response.render("detailblog", {
    id,
    title: "Selamat Datang",
    content: "Pasar Coding di Indonesia",
    author: "Fernands",
    postAt: "18 Agustus 2022",
  });
});

app.get("/myproject", function (request, response) {
  response.render("myproject");
});

app.post("/myproject", function (request, response) {
  console.log(request.body);
  let title = request.body.inputName;
  let startDate = request.body.inputStartDate;
  let endDate = request.body.inputEndDate;
  let description = request.body.inputDescription;
  let checkbox = request.body.checkboxDefault;

  console.log(title);
  console.log(startDate);
  console.log(endDate);
  console.log(description);
  console.log(checkbox);

  response.redirect("/myproject");
});

app.listen(8000, function () {
  console.log(`server running on port ${port}`);
});
