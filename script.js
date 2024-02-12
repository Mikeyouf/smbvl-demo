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
    let totalSections = 14;
    const submitButton = document.getElementById('submit-button');
    const progressBarContainer = document.getElementById('progress-bar-etapes');
    let typeDebien = '';
    let niveauAlea = communeData.niveauAlea;
    let batiInondable = communeData.batiInondable;
    let isEligible = communeData.isEligible;
    let score = 0;
    let formData = {
        score: 0,
    };

    // AFFICHE LES QUESTIONS ENTREPRISE
    var selectTypeDeBien = document.getElementById('type-de-bien');
    // console.log(selectTypeDeBien);

    selectTypeDeBien.addEventListener('change', function () {
        var value = this.value;
        typeDebien = value;
        // console.log(typeDebien);
        var question1_1 = document.getElementById('question-1-1');
        var question1_2 = document.getElementById('question-1-2');
        var question15_1 = document.getElementById('question-15-1');
        var question22_1 = document.getElementById('question-22-1');
        var question22_2 = document.getElementById('question-22-2');

        if (value === 'entreprise') {
            question1_1.style.display = 'block';
            question1_2.style.display = 'block';
            question15_1.style.display = 'block';
            question22_1.style.display = 'block';
            question22_2.style.display = 'block';
        } else {
            question1_1.style.display = 'none';
            question1_2.style.display = 'none';
            question15_1.style.display = 'none';
            question22_1.style.display = 'none';
            question22_2.style.display = 'none';
        }
    });

    //AFFICHE QUESTION 8 SI 7 = NON
    // Sélectionnez les boutons radio de la question 7
    const question8Radios = document.querySelectorAll('input[name="question8"]');

    // Itérez sur chaque bouton radio pour ajouter un écouteur d'événements
    question8Radios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            const isNoSelected = document.getElementById('q8a2').checked;

            const question8 = document.getElementById('question-8');

            if (isNoSelected) {
                question8.style.display = 'block';
            } else {
                question8.style.display = 'none';
            }
        });
    });


    function openPanel() {
        diagnosticPanel.classList.add('open');
        changeSection();
        closePanel();
        // console.log("communeData :", communeData);
        // Mettre à jour les informations de la commune
        const communeInfosEl = document.getElementById('commune-infos');
        if (communeInfosEl && communeData) {
            communeInfosEl.innerHTML = `➔<span class="info-label"> Commune :</span> ${communeData.nomCommune} ➔
                <span class="info-label"> Bâti Inondable :</span> ${communeData.batiInondable}` +
                (communeData.niveauAlea !== null ? ` ➔ <span class="info-label"> Niveau d'Aléa :</span> ${communeData.niveauAlea}` : '') +
                ` ➔ <span class="info-label"> Éligible :</span> ${communeData.isEligible ? 'Oui' : 'Non'}`;
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

    // INFO SECTIONS
    const infoSection = document.querySelectorAll('.section-info');
    // console.log(infoSection3);
    infoSection.forEach(icon => {
        icon.addEventListener('mouseover', function () {
            openInfoPanelSection3(icon);
        });
    });

    function openInfoPanelSection3(icon) {
        // Assurez-vous que le sélecteur utilise correctement les classes sans espace incorrect ou guillemet supplémentaire.
        const infoContent = icon.closest('.header-question').nextElementSibling; // Cible directement l'élément suivant .header-question qui devrait être .infos-questions

        const dynamicContent = document.getElementById('dynamic-content');
        const infoPanel = document.getElementById('info-panel');

        if (infoContent) {
            dynamicContent.innerHTML = infoContent.innerHTML;
            infoPanel.classList.add('open');
        }
    }

    // OBJECTIFS SECTION 1
    const objectifsInfoIcon = document.getElementById('objectifs-infos');
    if (objectifsInfoIcon) {
        objectifsInfoIcon.addEventListener('mouseover', function () {
            openObjectifsInfoPanel();
        });
    }

    function openObjectifsInfoPanel() {
        const infoContent = document.getElementById('objectifs-infos-questions');
        const dynamicContent = document.getElementById('dynamic-content');
        const infoPanel = document.getElementById('info-panel');

        if (infoContent && dynamicContent && infoPanel) {
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
            if (progressBarContainer) {
                progressBarContainer.style.display = 'none';
            }
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
        if (currentSectionIndex === totalSections - 1) {
            nextButton.style.display = 'none';
            prevButton.style.display = 'none';
        } else {
            nextButton.style.display = currentSectionIndex === totalSections - 2 ? 'none' : 'block';
            prevButton.style.display = currentSectionIndex === 0 ? 'none' : 'block';
        }

        // Modifier ici pour masquer la barre de progression dans la première et dernière section
        if (currentSectionIndex >= 1 && currentSectionIndex < totalSections - 1) {
            progressBarContainer.style.display = 'block';
        } else {
            progressBarContainer.style.display = 'none';
        }

        submitButton.style.display = currentSectionIndex === totalSections - 2 ? 'block' : 'none';
        const progressEl = document.getElementById('progress');
        progressEl.style.width = (currentSectionIndex / (totalSections - 2)) * 100 + '%';
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

    function calculateAndDisplayResult() {
        let score = 0; // Initialise le score
        formData.score = 0; 

        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const radios = document.querySelectorAll('input[type="radio"]:checked');
        const selects = document.querySelectorAll('select');

        checkboxes.forEach(function (checkbox) {
            let val = parseInt(checkbox.value, 10);
            if (!isNaN(val)) {
                formData.score += val;
            }
        });

        radios.forEach(function (radio) {
            var val = parseInt(radio.value, 10);
            if (!isNaN(val)) {
                formData.score += val;
            }
        });

        selects.forEach(function (select) {
            let val = parseInt(select.options[select.selectedIndex].value, 10);
            if (!isNaN(val)) {
                formData.score += val;
            }
        });
        
        if(niveauAlea === null) {
            formData.score += 0;
        }else if(niveauAlea === "Aléa faible") {
            formData.score += 6;
        }else if(niveauAlea === "Aléa modéré") {
            formData.score += 12;
        }else {
            formData.score += 18;
        }

        if(batiInondable) {
            formData.score += 6;
        }else if(!batiInondable) {
            formData.score += 4;
        }else {
            formData.score += 0;
        }

        displayResult(formData.score);
    }

    function displayResult(score) {
        console.log(typeDebien, score);
        var resultTextEl = document.getElementById('result-text');
        var progressBar = document.getElementById('progress-bar');

        if(typeDebien === "entreprise") {
            if (score <= 45) {
                resultTextEl.textContent = 'Peu exposé';
                progressBar.style.width = '33%';
            } else if (score <= 90) {
                resultTextEl.textContent = 'Modéré';
                progressBar.style.width = '66%';
            } else {
                resultTextEl.textContent = 'Fort';
                progressBar.style.width = '100%';
            }
        } else {
            if (score <= 40) {
                resultTextEl.textContent = 'Peu exposé';
                progressBar.style.width = '33%';
            } else if (score <= 80) {
                resultTextEl.textContent = 'Modéré';
                progressBar.style.width = '66%';
            } else {
                resultTextEl.textContent = 'Fort';
                progressBar.style.width = '100%';
            }
        }

        currentSectionIndex = totalSections - 1;
        changeSection();
    }

    function submitToFirebase() {
        const cadastreValue = communeData.cadastre;
        const ref = database.ref('form-diag').child(cadastreValue);

        ref.once('value', snapshot => {
            const userData = snapshot.val();
            const infoDiv = document.querySelector('.para-info');

            if (userData && userData.envois >= 3) {
                infoDiv.textContent = "Vous avez atteint le nombre maximal d'envois.";
                infoDiv.style.color = 'red'; // Changez la couleur du texte pour une alerte
                return;
            }

            //SECTION 1
            // Récupération de la valeur pour le type de bien
            const typeDeBienInput = document.querySelector('#type-de-bien').value;
            // Initialisation des variables pour les questions 1.1 et 1.2
            let question1_1Input = '';
            let question1_2Input = '';
            // Vérifie si "Entreprise" est sélectionné
            if (typeDeBienInput === 'entreprise') {
                // Récupère la valeur de la question 1.1 s'il y a une entrée (assurez-vous que l'input text a une valeur par défaut ou n'est pas null)
                const input1_1 = document.querySelector('#q1\\.1a1');
                question1_1Input = input1_1 ? input1_1.value : '';

                // Pour la question 1.2, récupère l'attribut datatext de l'option cochée
                const radio1_2Checked = document.querySelector('input[name="question1.2"]:checked');
                question1_2Input = radio1_2Checked ? radio1_2Checked.getAttribute('datatext') : '';
            }
            // Récupération des valeurs pour les autres questions comme avant
            const question2Input = document.querySelector('input[name="question2"]:checked') ? document.querySelector('input[name="question2"]:checked').getAttribute('datatext') : '';

            // SECTION 2
            const question3Input = document.querySelector('input[name="question3"]:checked') ? document.querySelector('input[name="question3"]:checked').getAttribute('datatext') : '';
            const question4_1Input = document.querySelector('#q4a1') ? document.querySelector('#q4a1').value : '';
            const question4_2Input = document.querySelector('#q4a2') ? document.querySelector('#q4a2').value : '';
            const question4_3Input = document.querySelector('#q4a3') ? document.querySelector('#q4a3').value : '';
            const question4_4Input = document.querySelector('#q4a4') ? document.querySelector('#q4a4').value : '';

            // SECTION 3
            const question5Input = document.querySelector('input[name="question5"]:checked') ? document.querySelector('input[name="question5"]:checked').getAttribute('datatext') : '';
            
            // SECTION 4
            const question6Input = document.querySelector('input[name="question6"]:checked') ? document.querySelector('input[name="question6"]:checked').getAttribute('datatext') : '';
            const question7Input = document.querySelector('input[name="question7"]:checked') ? document.querySelector('input[name="question7"]:checked').getAttribute('datatext') : '';

            const question8Input = document.querySelector('input[name="question8"]:checked') ? document.querySelector('input[name="question8"]:checked').getAttribute('datatext') : '';
            const question8_1Input = document.querySelector('input[name="question8.1"]:checked') ? document.querySelector('input[name="question8.1"]:checked').getAttribute('datatext') : '';

            const question9Input = document.querySelector('input[name="question9"]:checked') ? document.querySelector('input[name="question9"]:checked').getAttribute('datatext') : '';
            const question10Input = document.querySelector('input[name="question10"]:checked') ? document.querySelector('input[name="question10"]:checked').getAttribute('datatext') : '';

            //SECTION 5
            const question11aInput = document.querySelector('input[name="question11a"]:checked') ? document.querySelector('input[name="question11a"]:checked').getAttribute('datatext') : '';
            const question11bInput = document.querySelector('input[name="question11b"]:checked') ? document.querySelector('input[name="question11b"]:checked').getAttribute('datatext') : '';
            const question11cInput = document.querySelector('input[name="question11c"]:checked') ? document.querySelector('input[name="question11c"]:checked').getAttribute('datatext') : '';
            const question11dInput = document.querySelector('input[name="question11d"]:checked') ? document.querySelector('input[name="question11d"]:checked').getAttribute('datatext') : '';

            const question12Input = document.querySelector('input[name="question12"]:checked') ? document.querySelector('input[name="question12"]:checked').getAttribute('datatext') : '';
            const question13Input = document.querySelector('input[name="question13"]:checked') ? document.querySelector('input[name="question13"]:checked').getAttribute('datatext') : '';

            //SECTION 6
            const question14Input = document.querySelector('input[name="question14"]:checked') ? document.querySelector('input[name="question14"]:checked').getAttribute('datatext') : '';
            const question15Input = document.querySelector('input[name="question15"]:checked') ? document.querySelector('input[name="question15"]:checked').getAttribute('datatext') : '';
            const question15_1Input = document.querySelector('input[name="question15.1"]:checked') ? document.querySelector('input[name="question15.1"]:checked').getAttribute('datatext') : '';

            //SECTION 7
            const question16Input = document.querySelector('input[name="question16"]:checked') ? document.querySelector('input[name="question16"]:checked').getAttribute('datatext') : '';
            const question17Input = document.querySelector('input[name="question17"]:checked') ? document.querySelector('input[name="question17"]:checked').getAttribute('datatext') : '';

            //SECTION 8
            const question18Input = document.querySelector('input[name="question18"]:checked') ? document.querySelector('input[name="question18"]:checked').getAttribute('datatext') : '';
            const question19Input = document.querySelector('input[name="question19"]:checked') ? document.querySelector('input[name="question19"]:checked').getAttribute('datatext') : '';
            const question20Input = document.querySelector('input[name="question20"]:checked') ? document.querySelector('input[name="question20"]:checked').getAttribute('datatext') : '';
            const question21Input = document.querySelector('input[name="question21"]:checked') ? document.querySelector('input[name="question21"]:checked').getAttribute('datatext') : '';

            //SECTION 9
            const question22Input = document.querySelector('input[name="question22"]:checked') ? document.querySelector('input[name="question22"]:checked').getAttribute('datatext') : '';
            const question22_1Input = document.querySelector('input[name="question22.1"]:checked') ? document.querySelector('input[name="question22.1"]:checked').getAttribute('datatext') : '';
            const question22_2Input = document.querySelector('input[name="question22.2"]:checked') ? document.querySelector('input[name="question22.2"]:checked').getAttribute('datatext') : '';

            // Continuez avec l'envoi des données
            const envois = userData && userData.envois ? userData.envois + 1 : 1;

            // console.log("avant :", formData.score);

            if (typeDeBienInput === 'entreprise') {
                formData.score = formData.score <= 45 ? 'Risque Léger' : formData.score <= 90 ? 'Risque Modéré' : 'Risque Fort';
            } else {
                formData.score = formData.score <= 40 ? 'Risque Léger' : formData.score <= 80 ? 'Risque Modéré' : 'Risque Fort';
            }

            // console.log("après :", formData.score);
            
            // Exemple de données à envoyer
            const data = {
                envois: envois,
                nom_commune: communeData.nomCommune,
                cadastre: communeData.cadastre,
                aléas: communeData.niveauAlea,
                bâti_inondable: communeData.batiInondable,
                éligible: communeData.isEligible ? 'Oui' : 'Non',
                score: formData.score,
                question1: typeDeBienInput,
                question1_1: question1_1Input,
                question1_2: question1_2Input,
                question2: question2Input,
                question3: question3Input,
                question4_1: question4_1Input,
                question4_2: question4_2Input,
                question4_3: question4_3Input,
                question4_4: question4_4Input,
                question5: question5Input,
                question6: question6Input,
                question7: question7Input,
                question8: question8Input,
                question8_1: question8_1Input,
                question9: question9Input,
                question10: question10Input,
                question11a: question11aInput,
                question11b: question11bInput,
                question11c: question11cInput,
                question11d: question11dInput,
                question12: question12Input,
                question13: question13Input,
                question14: question14Input,
                question15: question15Input,
                question15_1: question15_1Input,
                question16: question16Input,
                question17: question17Input,
                question18: question18Input,
                question19: question19Input,
                question20: question20Input,
                question21: question21Input,
                question22: question22Input,
                question22_1: question22_1Input,
                question22_2: question22_2Input,
            };


            // Utilisez la méthode .ref() avec l'ID "cadastre" pour ajouter les données
            const cadastreValue = communeData.cadastre;
            const ref = database.ref('form-diag').child(cadastreValue);

            ref.set(data, function (error) {
                if (error) {
                    console.error("Erreur lors de l'envoi des données : ", error);
                    infoDiv.textContent = "Une erreur s'est produite lors de l'envoi du formulaire.";
                    infoDiv.style.color = 'red';
                } else {
                    console.log("Données envoyées avec succès !");
                    infoDiv.textContent = "Formulaire envoyé avec succès !";
                    infoDiv.style.color = 'green';
                }
            });

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