function showViewDiv() {
    var viewDiv = document.getElementById("viewDiv");
    var logDiv = document.getElementById("logDiv");
    logDiv.style.display = "none";
    viewDiv.style.display = "block";

}

function showLogDiv() {
    var viewDiv = document.getElementById("viewDiv");
    var logDiv = document.getElementById("logDiv");
    viewDiv.style.display = "none";
    logDiv.style.display = "block";
  
    
}


function logSymptoms(e) {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var symptoms = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);;
    var errorMessage = document.getElementById("errorMessage");
    if(symptoms.length == 0){
        errorMessage.innerHTML ="Please select symptoms before submiting!"
        errorMessage.style.display = "block";
    }else{
        errorMessage.style.display = "none";
        console.log(symptoms);
        fetch("http://127.0.0.1:5000/logSymptoms",{
            method : 'POST',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify(symptoms)
        }).then(response =>{
            if(response.ok){
                return response;
            }else{
                alert("error : "+response);
            }
        }).catch(error =>{
            console.error('Error:',error);
        });
    }
  
}