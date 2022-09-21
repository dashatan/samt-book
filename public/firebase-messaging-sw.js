importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBanpbzkjuzB7bfLsqv8Qt_nt31Hba5tqQ",
  authDomain: "samtbook-27aaa.firebaseapp.com",
  databaseURL: "https://samtbook-27aaa.firebaseio.com",
  projectId: "samtbook-27aaa",
  storageBucket: "samtbook-27aaa.appspot.com",
  messagingSenderId: "1032068067442",
  appId: "1:1032068067442:web:60b4496075f487cfd312eb",
  measurementId: "G-YJDD6W933D"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

//user is not on the page and browser is closed
messaging.setBackgroundMessageHandler(payload => {
  const title = payload.title;
  const options = {
    body:payload.data.status,
  }
  return self.registration.showNotification(title, options);
})


