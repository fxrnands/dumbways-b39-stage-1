let dataProject = [];

function submitProject(event) {
  event.preventDefault();

  let nama = document.getElementById("input-name").value;
  let pesan = document.getElementById("input-message").value;
  let node = document.getElementById("inputNode").checked;
  let next = document.getElementById("inputNext").checked;
  let react = document.getElementById("inputReact").checked;
  let ts = document.getElementById("inputTS").checked;
  let gambar = document.getElementById("input-blog-image").files;

  if (react) {
    react = document.getElementById("inputReact").value
  } else {
    react = ''
  }
  if (node) {
    node = document.getElementById("inputNext").value
  } else {
    node = ''
  } if (ts) {
    ts = document.getElementById("inputTS").value
  } else {
    ts = ''
  } if (next) {
    next = document.getElementById("inputNode").value
  } else {
    next = ''
  }

  console.log(react);
  console.log(next);
  console.log(ts);
  console.log(node);

  gambar = URL.createObjectURL(gambar[0]);

  let Project = {
    nama,
    postAt: new Date(),
    author: "Fernands",
    pesan,
    node,
    next,
    react,
    ts,
    gambar,
  };

  console.log(Project);

  dataProject.push(Project);

  console.log(dataProject);

  renderProject();
}

function renderProject() {
  document.getElementById("contents").innerHTML = "";

  for (let index = 0; index < dataProject.length; index++) {
    document.getElementById("contents").innerHTML += `
        <div class="blog-list-item">
            <div class="blog-image">
                <img class="blog-image" src="${dataProject[index].gambar}" alt="" />
            </div>
            <div class="blog-content">
                <h1>
                    <a href="blog-detail.html" target="_blank"
                    >${dataProject[index].nama}</a
                    >
                </h1>
                <div class="detail-tanggal">
                   ${getFullTime(dataProject[index].postAt)} | ${dataProject[index].author} 
                </div>
                <p>
                    ${dataProject[index].pesan}
                    </p>
                    <div>
                    <i class="fa-brands ${dataProject[index].react}"></i>
                    <i class="fa-brands ${dataProject[index].next}"></i>
                    <i class="fa-brands ${dataProject[index].ts}"></i>
                    <i class="fa-brands ${dataProject[index].node}"></i>
                    </div>
                    <div class="btn-group">
                    <button class="btn-edit">Edit Post</button>
                    <button class="btn-post">Post Blog</button>
                </div>
                <div style="text-align: right; margin-top: 15px">
                    <span style="font-size: 12px; color:grey">${getDistanceTime(dataProject[index].postAt)}</span>
                </div>
            </div>
        </div>
        `;
  }
}

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

function getDistanceTime(time) {
  let tanggalMulai = new Date();
  let tanggalSelesai = time;

  let distance = tanggalMulai - tanggalSelesai;
  console.log(distance);

  let milisecond = 1000;
  let secondInHours = 3600;
  let hoursInDay = 24;

  let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay));
  let distanceHours = Math.floor(distance / (milisecond * 60 * 60));
  let distanceMinutes = Math.floor(distance / (milisecond * 60));
  let distanceSeconds = Math.floor(distance / milisecond);

  if (distanceDay > 0) {
    return `${distanceDay} day ago`;
  } else if (distanceHours > 0) {
    return `${distanceHours} hours ago`;
  } else if (distanceMinutes > 0) {
    return `${distanceMinutes} minutes ago`;
  } else {
    return `${distanceSeconds} seconds ago`;
  }
}
