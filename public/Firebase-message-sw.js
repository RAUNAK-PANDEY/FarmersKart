// importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
        messaging.useServiceWorker(registration); 
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }
    // if('serviceWorker' in navigator) { 
    //     navigator.serviceWorker.register('../firebase-messaging-sw.js')
    //   .then(function(registration) {
    //    console.log("Service Worker Registered");
       
    //     }); 
    //     }
firebase.initializeApp({
    messagingSenderId: "726458409238",
  })

const initMessaging = firebase.messaging()