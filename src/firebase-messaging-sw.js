importScripts('https://www.gstatic.com/firebasejs/6.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.4.2/firebase-messaging.js');


firebase.initializeApp({
  'messagingSenderId': '63810351639'
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler((payload) => {
  return self.registration.showNotification(payload);
})