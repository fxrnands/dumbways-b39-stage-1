function submitData(){

    let name = document.getElementById("input-name").value
    let email = document.getElementById("input-email").value
    let number = document.getElementById("input-number").value
    let subject = document.getElementById("input-subject").value
    let message = document.getElementById("input-message").value

    if(name == ""){
       return alert("NAMA WAJIB DIISI")
    } else if(email == ""){
       return alert("EMAIL WAJIB DIISI")
    } else if(number == ""){
       return alert("NO TELEPHONE WAJIB DIISI")
    } else if(subject == ""){
       return alert("SUBJECT WAJIB DIISI")
    } else if(message == ""){
       return alert("ISI PESAN WAJIB DIISI")
    }

    console.log(name);
    console.log(email);
    console.log(number);
    console.log(subject);
    console.log(message);

    let emailReceiver = "fxrnands@gmail.com"
    
    let a = document.createElement('a')
    a.href=`mailto:${emailReceiver}?subject=${subject}&body=Hallo nama saya ${name}, ${message}, silahkan kontak saya dengan email ${email}, telp ${number}`
    a.click()

    let siswa = {
        name,
        email,
        number,
        subject,
        message
    }
    console.log(siswa);   
}