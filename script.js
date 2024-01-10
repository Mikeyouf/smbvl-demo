// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCaDh7N18VrM_-UQtr9kSXMA4_pLSUn2yE",
    authDomain: "form-diag-5d719.firebaseapp.com",
    projectId: "form-diag-5d719",
    storageBucket: "form-diag-5d719.appspot.com",
    messagingSenderId: "799317471286",
    appId: "1:799317471286:web:eef61dbaf2fe400ee92897",
    databaseURL: "https://form-diag-5d719-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

// Accédez à la base de données Firebase
const database = firebase.database();

let isMobile;

function isMobileDevice() {
    if (navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        isMobile = true;
    } else {
        isMobile = false;
    }
}

isMobileDevice();

// fermer message d'erreur
const croixElt = document.getElementById('croix');
const boiteMessErreur = document.getElementById('message-boite');
croixElt.addEventListener('click', function () {
    boiteMessErreur.classList.toggle('goUp');
})

// fermer panneau latéral droit
const croixRightElt = document.getElementById('croix-right');
const panneauLatRight = document.getElementById('info-commune');
croixRightElt.addEventListener('click', function () {
    panneauLatRight.classList.toggle('show');
})

const communeDataVariables = {
    "Bollène": dataParcelles_2,
    "Bouchet": dataParcelles_0,
    "Chamaret": dataParcelles_0,
    "Colonzelle": dataParcelles_0,
    "Grignan": dataParcelles_0,
    "Grillon": dataParcelles_3,
    "La Baume-de-Transit": dataParcelles_0,
    "Lagarde-Paréol": dataParcelles_3,
    "Le Pègue": dataParcelles_1,
    "Mondragon": dataParcelles_3,
    "Montbrison-sur-Lez": dataParcelles_0,
    "Montjoux": dataParcelles_0,
    "Montségur-sur-Lauzon": dataParcelles_1,
    "Mornas": dataParcelles_3,
    "Richerenches": dataParcelles_3,
    "Rochegude": dataParcelles_1,
    "Roche-Saint-Secret-Béconne": dataParcelles_1,
    "Saint-Pantaléon-les-Vignes": dataParcelles_1,
    "Suze-la-Rousse": dataParcelles_1,
    "Taulignan": dataParcelles_2,
    "Teyssières": dataParcelles_2,
    "Tulette": dataParcelles_2,
    "Valréas": dataParcelles_3,
    "Venterol": dataParcelles_2,
    "Vesc": dataParcelles_2,
    "Vinsobres": dataParcelles_2,
    "Visan": dataParcelles_3
};

// Je récupère la position de l'utilisateur si il est ok
let lat;
let lng;
let adresse;
let selectedCommune;
let communeIsCorrect = false;
let postaleCode;
let street;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        // Utilisez lat et lng pour afficher la position sur la carte Leaflet
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var result = JSON.parse(xhr.responseText);
                adresse = result.address.road + ', ' + result.address.postcode + ' ' + result.address.village;
                postaleCode = result.address.postcode;
                street = result.address.road
                // ON TEST SI ON EST DANS LA BONNE COMMUNE
                // selectedCommune = "Grignan" // décommenter / commenter pour test
                // function removeAccents(str) {
                //     return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                // }
                selectedCommune = result.address.village || result.address.city;
                // selectedCommune = removeAccents(selectedCommune).toUpperCase();
                // console.log(removeAccents(selectedCommune).toUpperCase());
                const communes = ["Bollène", "Bouchet", "Chamaret", "Colonzelle", "Grignan", "Grillon", "La Baume-de-Transit", "Lagarde-Paréol", "Le Pègue", "Mondragon", "Montbrison-sur-Lez", "Montjoux", "Montségur-sur-Lauzon", "Mornas", "Richerenches", "Rochegude", "Roche-Saint-Secret-Béconne", "Saint-Pantaléon-les-Vignes", "Suze-la-Rousse", "Taulignan", "Teyssières", "Tulette", "Valréas", "Venterol", "Vesc", "Vinsobres", "Visan"];
                if (communes.includes(selectedCommune)) {
                    // Utilisez l'adresse pour afficher l'adresse sur la page
                    // console.log("géo ok");

                    // Obtenir les données appropriées
                    let data = communeDataVariables[selectedCommune];

                    let geoJSONLayer = L.geoJSON(data, {
                        style: style,
                        onEachFeature: onEachFeature,
                        filter: function (feature, layer) {
                            return feature.properties.nom_commune === selectedCommune;
                        }
                    }).addTo(map);

                    geoJSONLayer.clearLayers();
                    geoJSONLayer.addData(data);

                    // on cache le menu latéral gauche
                    const houseDivElt = document.getElementById("choix-commune");
                    houseDivElt.classList.toggle('isVisible');

                    // on zoom sur la partie de la carte choisie
                    let bounds = geoJSONLayer.getBounds();
                    map.fitBounds(bounds, {
                        maxZoom: 16
                    });

                    communeIsCorrect = true;
                } else {
                    boiteMessErreur.classList.toggle('goUp');
                    communeIsCorrect = false;
                }
            } else {
                // Erreur lors de la requête
                choixCommune();
            }
        };
        xhr.send();

    });
} else {
    // Géolocalisation non supportée par le navigateur
    choixCommune();
}

const canvasRenderer = L.canvas(); // TEST

const baseMaps = {
    "Rues": L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satellite": L.tileLayer(
        'https://wxs.ign.fr/decouverte/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal', {
            tileSize: 256,
            attribution: "IGN-F/Géoportail"
        })
}

//on crée la carte
let map = L.map('map', {
    dragging: !L.Browser.mobile,
    tap: !L.Browser.mobile,
    layers: [baseMaps["Satellite"]]
}).setView([44.384201382742944, 4.990312329391747], isMobile ? 9 : 12);

L.control.layers(baseMaps).addTo(map);

map.options.minZoom = isMobile ? 7 : 8;

map.options.maxZoom = 18;

// Fonction pour afficher la boîte de message d'erreur avec un message personnalisé
function showMessageBoite(errorMessage) {
    const messageBoite = document.getElementById("message-boite");
    const messageText = messageBoite.querySelector("p");

    messageText.textContent = errorMessage;
    messageBoite.classList.toggle("goUp");
}

// CHOIX COMMUNES
let geoJSONLayer;

function choixCommune() {
    select.addEventListener('change', function () {
        selectedCommune = select.options[select.selectedIndex].value;
        // console.log(selectedCommune)

        // Obtenir les données appropriées
        let data = communeDataVariables[selectedCommune];

        // console.log(data)

        if (geoJSONLayer) {
            geoJSONLayer.clearLayers();
        }

        geoJSONLayer = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature,
            filter: function (feature, layer) {
                return feature.properties.nom_commune === selectedCommune;
            },
            renderer: canvasRenderer,
        }).addTo(map);

        // on cache le menu latéral gauche
        const houseDivElt = document.getElementById("choix-commune");
        houseDivElt.classList.toggle('isVisible');

        // on zoom sur la partie de la carte choisie
        let bounds = geoJSONLayer.getBounds();
        map.fitBounds(bounds, {
            maxZoom: 16
        });
    });
}

choixCommune();

function style(feature) {
    return {
        fillColor: 'black',
        weight: 1,
        opacity: 0.5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.2
    };
}

// menu latéral gauche
function toggleHouseBtn() {
    const houseElt = document.getElementById("house");
    const houseDivElt = document.getElementById("choix-commune");
    houseElt.addEventListener("click", function () {
        houseDivElt.classList.toggle('isVisible');
    })
}

toggleHouseBtn();

function onEachFeature(feature, layer) {
    // je récupère si éligible ou pas
    let isEligible = feature.properties.surface_ppri_m2 > 0;

    let niveauAlea = feature.properties.alea_majorant;
    let batiInondable = feature.properties.bati_x_ppri == true ? 'Oui' : 'Non';

    const popupElt = `
        ${
            isEligible 
            ? '<p class="eligible" >Votre parcelle est dans le zonage inondable du PPRi du bassin versant du Lez. </p>'
            + `<p class="eligible" >Niveau d\'aléa majorant : <b>${niveauAlea}</b></p>`
            + `<p class="eligible" >Le bâti est dans le zonage inondable du PPRi : <b>${batiInondable}</b></p>`
            + '<p class="btn-1">Pour estimer ma vulnérabilité <a id="open-form-btn"> > Je réalise mon pré-diagnostic en ligne</a></p>'
            + '<p class="btn-2">Pour bénéficier d\'un diagnostic complet ou pour en savoir plus <a href="mailto:inondation@smbvl.fr"> > smbvl-alabri@smbvl.net</a></p>'
            : '<p>Votre parcelle n\'est pas dans le zonage inondable du PPRi du bassin versant du Lez.</p>'
            + '<p class="non-eligible">Si votre bien a été impacté par une inondation, n\'hésitez pas à nous contacter pour signaler votre situation et obtenir davantage d\'informations.</p>'
            + '<p class="btn-1">Pour estimer ma vulnérabilité <a id="open-form-btn"> > Je réalise mon pré-diagnostic en ligne</a></p>'
            + '<p class="btn-2">Pour signaler ma situation et en savoir plus <a href="mailto:inondation@smbvl.fr"> > smbvl-alabri@smbvl.net</a></p>'
        }
    `;

    layer.bindPopup(popupElt);
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// change la couleur au survol
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.2,
        fillColor: '#FEB24C',
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    layer.bringToFront();

}

function resetHighlight(e) {
    e.target.setStyle({
        fillColor: 'black',
        weight: 1,
        opacity: 0.5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.2
    });
}

let communeData = {};

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());

    e.target.openPopup();
    // je récupère si éligible ou pas
    let isEligible = e.target.feature.properties.surface_ppri_m2 > 0;

    let cadastre = e.target.feature.properties.id_parcelle;

    let batiInondable = e.target.feature.properties.bati_x_ppri == true ? 'Oui' : 'Non';
    let niveauAlea = e.target.feature.properties.alea_majorant;

    communeData = {
        cadastre: cadastre,
        batiInondable: batiInondable,
        niveauAlea: niveauAlea,
        nomCommune: e.target.feature.properties.nom_commune,
        isEligible: isEligible
    };

    let commune = e.target.feature.properties.nom_commune;
    let parentElt = document.getElementById("liens");
    let divElt = document.getElementById("info-commune");

    parentElt.innerHTML = isEligible ? `
        <div>
          <h2>2. Je suis éligible, je complète le formulaire</h2>  
          <form action="/success.html" method="POST" data-netlify="true" name="contact-eligibilite" netlify-honeypot="bot-field">
            <p class="hidden" hidden>
                <label>
                    Don’t fill this out if you’re human: <input name="bot-field" />
                </label>
            </p>
            <input type="hidden" name="form-name" value="contact-eligibilite">
            <div class="form-group">
                <label for="nom">Nom*</label>
                <input type="text" id="nom" name="nom" placeholder="votre nom" required>
            </div>
            <div class="form-group">
                <label for="prenom">Prénom*</label>
                <input type="text" id="prenom" name="prenom" placeholder="votre prénom" required>
            </div>
            <input type="text" id="cadastre" name="cadastre" value="${cadastre}" hidden>
            <input type="text" id="batiInondable" name="batiInondable" value="${batiInondable}" hidden>
            <input type="text" id="niveauAlea" name="niveauAlea" value="${niveauAlea}" hidden>
            <div class="form-group adresse">
                <label for="adresse">Adresse*</label>
                <input type="text" id="adresse" name="adresse" placeholder="votre adresse" value="${communeIsCorrect ? street : "" }" required>
            </div>
            <div class="form-group">
                <label for="codePostal">Code postal*</label>
                <input type="text" id="codePostal" name="codePostal" placeholder="votre code postal" value="${communeIsCorrect ? postaleCode : ""}" required>
            </div>
            <div class="form-group">
                <label for="commune">Commune*</label>
                <input type="text" id="commune" name="commune" value="${commune}" required>
            </div>
            <div class="form-group">
                <label for="telephone">Numéro de téléphone</label>
                <input type="text" id="telephone" name="telephone" placeholder="votre numéro de téléphone">
            </div>
            <div class="form-group">
                <label for="email">Email*</label>
                <input type="email" id="email" name="email" placeholder="votre email" required>
            </div>
            <input type="submit" value="Envoyer">
          </form>
        </div>
        ` :
        `
        <div>
            <p class="message">Vous n'êtes pas éligible</p>
        </div>
        `;

    if (isEligible) {
        divElt.classList.add('show');
    } else {
        divElt.classList.remove('show');
    }
}

let searchControl = L.Control.geocoder({
    position: 'topleft',
    placeholder: 'Rechercher une adresse ou un lieu',
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);

searchControl.on('markgeocode', function (e) {
    // Utilisez les coordonnées pour faire une requête à l'API Nominatim pour obtenir les informations de la commune
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + e.geocode.center.lat + '&lon=' + e.geocode.center.lng);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            // console.log("result", result);
            postaleCode = result.address.postcode;
            street = result.address.road
            // console.log(postaleCode);
            // console.log(street);

            // function removeAccents(str) {
            //     return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            // }
            selectedCommune = String(result.address.city || result.address.village);
            console.log("selectedCommune :", selectedCommune)
            // selectedCommune = removeAccents(selectedCommune).toUpperCase();
            // console.log(removeAccents(selectedCommune).toUpperCase());
            const communes = ["Bollène", "Bouchet", "Chamaret", "Colonzelle", "Grignan", "Grillon", "La Baume-de-Transit", "Lagarde-Paréol", "Le Pègue", "Mondragon", "Montbrison-sur-Lez", "Montjoux", "Montségur-sur-Lauzon", "Mornas", "Richerenches", "Rochegude", "Roche-Saint-Secret-Béconne", "Saint-Pantaléon-les-Vignes", "Suze-la-Rousse", "Taulignan", "Teyssières", "Tulette", "Valréas", "Venterol", "Vesc", "Vinsobres", "Visan"];
            if (communes.includes(selectedCommune)) {
                // Obtenir les données appropriées
                let data = communeDataVariables[selectedCommune];
                console.log("data : ", data);

                // Utilisez l'adresse pour afficher l'adresse sur la page
                let geoJSONLayer = L.geoJSON(data, {
                    style: style,
                    onEachFeature: onEachFeature,
                    filter: function (feature, layer) {
                        return feature.properties.nom_commune === selectedCommune;
                    }
                }).addTo(map);
                geoJSONLayer.clearLayers();
                geoJSONLayer.addData(data);
                // on cache le menu latéral gauche
                const houseDivElt = document.getElementById("choix-commune");
                houseDivElt.classList.toggle('isVisible');

                communeIsCorrect = true;
            } else {
                console.log("ok")
                boiteMessErreur.classList.toggle('goUp');
                communeIsCorrect = false;
            }

            // Reste du code pour filtrer les parcelles par commune
        } else {
            // Erreur lors de la requête
            choixCommune();
        }
    };
    xhr.send();
});

document.addEventListener('DOMContentLoaded', function () {
    const geocoderDiv = document.querySelector('.leaflet-control-geocoder.leaflet-bar.leaflet-control');
    geocoderDiv.classList.toggle('leaflet-control-geocoder-expanded');
});

// FORM DIAG

function preDiagnostic() {
    const diagnosticPanel = document.getElementById('diagnostic-panel');
    const sections = document.querySelectorAll('.form-section');
    let currentSectionIndex = 0;
    let totalSections = 5;
    const submitButton = document.getElementById('submit-button');

    function openPanel() {
        diagnosticPanel.classList.add('open');
        changeSection();
        closePanel();
        // console.log("communeData :", communeData);
        // Mettre à jour les informations de la commune
        const communeInfosEl = document.getElementById('commune-infos');
        if (communeInfosEl && communeData) {
            communeInfosEl.innerHTML = `<span class="info-label">Commune:</span> ${communeData.nomCommune}, 
                                            <span class="info-label">Bâti Inondable:</span> ${communeData.batiInondable}` +
                (communeData.niveauAlea !== null ? `, <span class="info-label">Niveau d'Aléa:</span> ${communeData.niveauAlea}` : '') +
                `, <span class="info-label">Éligible:</span> ${communeData.isEligible ? 'Oui' : 'Non'}`;
        }
        const infoImg = document.getElementById('bulle-info'); // Remplacez par l'ID de votre image
        // Gérer le survol ou le clic
        if (infoImg) {
            infoImg.addEventListener('mouseover', openInfoPanel);
            infoImg.addEventListener('click', openInfoPanel);
        }
    }

    function closePanel() {
        const formContainer = document.getElementById('form-container');
        const infoPanel = document.getElementById('info-panel');

        // Fermer le panneau lors d'un clic sur le conteneur du formulaire
        formContainer.addEventListener('click', function () {
            infoPanel.classList.remove('open');
        });

        // Fermer le panneau lorsque la souris quitte la zone du panneau d'informations
        infoPanel.addEventListener('mouseleave', function () {
            infoPanel.classList.remove('open');
        });
    }

    // Sélectionnez toutes les icônes d'information (bulle-info)
    const infoIcons = document.querySelectorAll('.bulle-info');

    infoIcons.forEach(icon => {
        icon.addEventListener('mouseover', function () {
            openInfoPanel(icon);
        });
    });

    function openInfoPanel(icon) {
        // Trouver le parent le plus proche de l'icône et ensuite trouver 'infos-questions' à l'intérieur de ce parent
        const parent = icon.closest('.form-section-question');
        const infoContent = parent.querySelector('.infos-questions');
        const dynamicContent = document.getElementById('dynamic-content');
        const infoPanel = document.getElementById('info-panel');

        if (infoContent) {
            dynamicContent.innerHTML = infoContent.innerHTML;
            infoPanel.classList.add('open');
        }
    }

    function resetForm() {
        // Sélectionnez votre formulaire par son ID ou sa classe
        const form = document.getElementById('diagnostic-form');
        if (form) {
            form.reset(); // Réinitialiser les champs du formulaire

            // Réinitialiser la barre de progression et d'autres éléments si nécessaire
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }

            // Réinitialiser le texte des résultats
            const resultTextEl = document.getElementById('result-text');
            if (resultTextEl) {
                resultTextEl.textContent = '';
            }

            // Réinitialiser l'index de la section actuelle si nécessaire
            currentSectionIndex = 0;
            changeSection();
        }
    }

    document.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'open-form-btn') {
            openPanel();
        }
    });

    // panneau infos
    const infoPanel = document.getElementById('info-panel');
    var prevButton = document.getElementById('prev-button');
    var nextButton = document.getElementById('next-button');

    const btnFermer2 = document.getElementById('btn-fermer2');
    btnFermer2.addEventListener('click', function () {
        infoPanel.classList.remove('open');
    });


    const btnFermer = document.getElementById('btn-fermer');
    btnFermer.addEventListener('click', function () {
        diagnosticPanel.classList.remove('open');
        resetForm(); // Si vous souhaitez réinitialiser le formulaire lors de la fermeture
    });

    function updateNavigationButtons() {
        // Masquer les boutons "Suivant" et "Précédent" dans la section des résultats
        if (currentSectionIndex === totalSections - 1) {
            nextButton.style.display = 'none';
            prevButton.style.display = 'none';
        } else {
            // Masquer le bouton "Suivant" dans la section 4 (juste avant les résultats)
            nextButton.style.display = currentSectionIndex === totalSections - 2 ? 'none' : 'block';

            // Masquer le bouton "Précédent" dans la première section
            prevButton.style.display = currentSectionIndex === 0 ? 'none' : 'block';
        }

        // Afficher le bouton "Voir les Résultats" uniquement dans la section 4
        submitButton.style.display = currentSectionIndex === totalSections - 2 ? 'block' : 'none';

        // Mettre à jour la barre de progression des étapes
        const progressEl = document.getElementById('progress');
        progressEl.style.width = (currentSectionIndex / (totalSections - 1)) * 100 + '%';
    }

    function changeSection() {
        sections.forEach(function (section) {
            section.classList.remove('active');
        });

        var currentSection = document.getElementById('section-' + (currentSectionIndex + 1));
        if (currentSection) {
            currentSection.classList.add('active');
        }

        updateNavigationButtons();
    }

    prevButton.addEventListener('click', function () {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            changeSection();
        }
    });

    nextButton.addEventListener('click', function () {
        if (currentSectionIndex < totalSections - 1) {
            currentSectionIndex++;
            changeSection();
        }
    });

    let score = 0;

    function calculateAndDisplayResult() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const radios = document.querySelectorAll('input[type="radio"]:checked');

        checkboxes.forEach(function (checkbox) {
            let val = parseInt(checkbox.value, 10);
            if (!isNaN(val)) {
                score += val;
            }
        });

        radios.forEach(function (radio) {
            var val = parseInt(radio.value, 10);
            if (!isNaN(val)) {
                score += val;
            }
        });
        // console.log(score);
        displayResult(score);
    }

    function displayResult(score) {
        var resultTextEl = document.getElementById('result-text');
        var progressBar = document.getElementById('progress-bar');

        if (score <= 10) {
            resultTextEl.textContent = 'Risque Léger';
            progressBar.style.width = '33%';
        } else if (score <= 20) {
            resultTextEl.textContent = 'Risque Modéré';
            progressBar.style.width = '66%';
        } else {
            resultTextEl.textContent = 'Risque Fort';
            progressBar.style.width = '100%';
        }

        currentSectionIndex = totalSections - 1;
        changeSection();
    }

    function submitToFirebase() {
        // ... (initialisation de Firebase et autres)

        // Récupérez les valeurs des champs du formulaire
        const question1Input = document.querySelector('input[name="question1"]:checked').getAttribute('datatext');
        const question2Input = document.querySelector('input[name="question2"]:checked').getAttribute('datatext');
        const question3Input = document.querySelector('input[name="question3"]:checked').getAttribute('datatext');
        const question4Input = document.querySelector('input[name="question4"]:checked').getAttribute('datatext');
        const question8Input = document.querySelector('input[name="question8"]:checked').getAttribute('datatext');
        const question9Input = document.querySelector('input[name="question9"]:checked').getAttribute('datatext');
        const question10Input = document.querySelector('input[name="question10"]:checked').getAttribute('datatext');
        const question15Input = document.querySelector('input[name="question15"]:checked').getAttribute('datatext');
        const question16Input = document.querySelector('input[name="question16"]:checked').getAttribute('datatext');
        const question22Input = document.querySelector('input[name="question22"]:checked').getAttribute('datatext');
        const question23Input = document.querySelector('input[name="question23"]:checked').getAttribute('datatext');

        score = score <= 10 ? 'Risque Léger' : score <= 20 ? 'Risque Modéré' : 'Risque Fort';
        // Exemple de données à envoyer
        const data = {
            nom_commune: communeData.nomCommune,
            cadastre: communeData.cadastre,
            aléas: communeData.niveauAlea,
            bâti_inondable: communeData.batiInondable,
            éligible: communeData.isEligible,
            score: score,
            question1: question1Input,
            question2: question2Input,
            question3: question3Input,
            question4: question4Input,
            question8: question8Input,
            question9: question9Input,
            question10: question10Input,
            question15: question15Input,
            question16: question16Input,
            question22: question22Input,
            question23: question23Input,
            // Ajoutez d'autres réponses de formulaire ici...
        };


        // Utilisez la méthode .ref() avec l'ID "cadastre" pour ajouter les données
        const cadastreValue = communeData.cadastre;
        const ref = database.ref('form-diag').child(cadastreValue);

        ref.set(data, function (error) {
            if (error) {
                console.error("Erreur lors de l'envoi des données : ", error);
            } else {
                console.log("Données envoyées avec succès !");
            }
        });
    }

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        calculateAndDisplayResult();
        submitToFirebase();
    });
}
// Appeler preDiagnostic une seule fois lors du chargement de la page
document.addEventListener('DOMContentLoaded', preDiagnostic);