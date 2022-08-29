function submitData() {
  let name = document.getElementById("input-name").value;
  let email = document.getElementById("input-email").value;
  let number = document.getElementById("input-number").value;
  let subject = document.getElementById("input-subject").value;
  let message = document.getElementById("input-message").value;

  // penggunaan if untuk form submission
  if (name == "") {
    return alert("nama harus diisi");
  } else if (email == "") {
    return alert("email harus diisi");
  } else if (number == "") {
    return alert("no handphone harus diisi");
  } else if (message == "") {
    return alert("pesan harus diisi");
  }

  console.log(name);
  console.log(email);
  console.log(number);
  console.log(subject);
  console.log(message);

  let emailReceiver = "fxrnands@mail.com";

  let a = document.createElement("a");
  a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hello my name ${name}, ${message}, let's talk with me asap ${email}, phone ${number}`;
  a.click();

  let siswa = {
    name: name,
    email: email,
    number: number,
    subject: subject,
    message: message,
  };
  console.log(siswa);
}
