function openimg(){
    document.getElementById("upload").style.width = "100%";
    document.getElementById("upload").style.height = "100%";
    document.getElementById("close").style.fontSize = "20px";
    document.getElementById("close").style.fontStyle = "bold";
}
function closeimg(){
    document.getElementById("upload").style.width = "0";
    document.getElementById("upload").style.height = "0";
    document.getElementById("close").style.fontSize = "0";
}
function login(){
    document.getElementById("signup").style.zIndex = "1";
    document.getElementById("signup").style.height = "0";
    document.getElementById("uname").style.height = "0";
    document.getElementById("password").style.height = "0";
    document.getElementById("uname").style.width = "0";
    document.getElementById("password").style.width = "0";
}
