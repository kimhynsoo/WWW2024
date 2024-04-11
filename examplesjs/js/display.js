let waitingTime=1000;

function greetUser(){
    setTimeout( () => {
        var username = document.getElementById("name").value;
        alert("Hello, " + username);

    }, 
    waitingTime)
    
}