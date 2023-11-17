function showViewDiv() {
    var date = document.getElementById("viewDate");
    if(date.value != ""){
        viewSymptoms();
        var viewDiv = document.getElementById("viewDiv");
        var logDiv = document.getElementById("logDiv");
        logDiv.style.display = "none";
        viewDiv.style.display = "block";
    }else{
        date.style.accentColor = "red";
    }

}

function showLogDiv() {
    var viewDiv = document.getElementById("viewDiv");
    var logDiv = document.getElementById("logDiv");
    viewDiv.style.display = "none";
    logDiv.style.display = "block";
    var date = document.getElementById("viewDate");
    date.value = "";
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

function viewSymptoms() {
    
    var date = document.getElementById("viewDate").value;
    console.log(date);
    const url = `http://127.0.0.1:5000/getSymptoms?date=${date}`;

    fetch(url)
    .then(response =>{
        if(response.ok){
            return response.json();
        }else{
            throw new Error("Error: while getting logged data.")
        }
    }).then(response =>{
        var errorMessage = document.getElementById("viewerrorMessage");
        var listDiv = document.getElementById("listDiv");
        var symptomsArray = JSON.parse(response);
        listDiv.innerHTML ="";
        if(symptomsArray.length <= 0){
            listDiv.style.display = "none";
            errorMessage.innerHTML ="No symptom logged for selected date!"
            errorMessage.style.display = "block";
        }else{
            errorMessage.style.display = "none";

            
            var ul = document.createElement('ul');

            for (var i = 0; i < symptomsArray.length; ++i) {
                var symptom = symptomsArray[i];  
                var li = document.createElement('li');
                li.textContent = symptom;
                ul.appendChild(li);
            }

            listDiv.appendChild(ul);
            listDiv.style.display = "block";
        }

    }).catch(error =>{
        console.error("Error:",error);
    })
}