document.addEventListener('DOMContentLoaded', function() {
    fetch('https://form-diag-5d719-default-rtdb.europe-west1.firebasedatabase.app/nouvellesDonnees.json')
    .then(response => response.json())
    .then(data => {
        // Supposons que 'data' est un tableau d'objets, chaque objet représentant une ligne
        // console.log(data);
        updateTable(data);
    })
    .catch(error => console.error('Erreur:', error));
});

function updateTable(data) {
    var tableBody = document.getElementById('annuaire').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Effacer les anciennes lignes

    for (var i = 1; i < data.length; i++) { // Ignorer les en-têtes
        var row = data[i];
        var newRow = tableBody.insertRow();
        for (var j = 0; j < row.length; j++) {
            var newCell = newRow.insertCell();
            var cellValue = row[j];

            // Si c'est la colonne email (7ème colonne, index 6)
            if (j === 6 && cellValue) {
                var emailLink = document.createElement('a');
                emailLink.href = 'mailto:' + cellValue;
                emailLink.textContent = cellValue;
                newCell.appendChild(emailLink);
            }
            // Si c'est la colonne site web (8ème colonne, index 7)
            else if (j === 7 && cellValue) {
                var websiteLink = document.createElement('a');
                websiteLink.href = cellValue;
                websiteLink.target = '_blank'; // Ouvrir dans un nouvel onglet
                websiteLink.textContent = cellValue;
                newCell.appendChild(websiteLink);
            }
            // Pour toutes les autres colonnes
            else {
                var cellText = document.createTextNode(cellValue);
                newCell.appendChild(cellText);
            }
        }
    }
}

function downloadPDF() {
    const element = document.getElementById('annuaire'); // Remplacez par l'ID de votre tableau

    html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('l', 'mm', 'a4'); // Format paysage
        const imgWidth = 297; // Ajuster la largeur de l'image
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save("annuaire-artisans.pdf");
    });    
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function filterTable() {
    var inputNom = document.getElementById("filterNom");
    var inputVille = document.getElementById("filterVille");
    var inputMesures = document.getElementById("filterMesures");
    var filterNom = removeAccents(inputNom.value);
    var filterVille = removeAccents(inputVille.value);
    var filterMesures = removeAccents(inputMesures.value);
    var table = document.getElementById("annuaire");
    var tr = table.getElementsByTagName("tr");

    for (var i = 0; i < tr.length; i++) {
        var tdNom = tr[i].getElementsByTagName("td")[0]; 
        var tdVille = tr[i].getElementsByTagName("td")[4];
        var tdMesures = tr[i].getElementsByTagName("td")[9]; // Mettez à jour cet index en fonction de la position de la colonne Mesures
        if (tdNom && tdVille && tdMesures) {
            var txtValueNom = removeAccents(tdNom.textContent || tdNom.innerText);
            var txtValueVille = removeAccents(tdVille.textContent || tdVille.innerText);
            var txtValueMesures = removeAccents(tdMesures.textContent || tdMesures.innerText);
            if (txtValueNom.indexOf(filterNom) > -1 && txtValueVille.indexOf(filterVille) > -1 && txtValueMesures.indexOf(filterMesures) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}