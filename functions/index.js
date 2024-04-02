/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {
    onRequest
} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const axios = require('axios');

exports.sendDataToMake = functions.database.ref('/form-diag/{cadastreValue}')
    .onCreate((snapshot, context) => {
        const data = snapshot.val();

        // L'URL de votre webhook Make
        const makeWebhookURL = 'https://hook.eu1.make.com/29gvb91ve8graryr65pc9kc3s3sm7pmw';

        // Envoie les données sous forme JSON
        return axios.post(makeWebhookURL, {
                data: data // Vous pouvez structurer ceci comme nécessaire
            })
            .then(response => console.log('Réponse de Make:', response))
            .catch(error => console.error('Erreur lors de l\'envoi à Make', error));
    });


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });