import * as firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
import Axios from "axios";
import Store from "./components/redux/store";

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onTokenRefresh(()=>{
  getToken();
})
export function getToken(){
  messaging.getToken().then(token => {
    return setUserFcmToken(token)
  })
}

function setUserFcmToken(token){
  const url = Store.getState().baseUrl + '/api/setUserFcmToken';
  const data = {
    userToken:Store.getState().userToken,
    fcmToken:token,
  }
  return Axios.post(url,data)
  .then(e=>{
    console.log('userFcmTokenSetSucceed');
  })
  .catch(e=>{
    console.log(e);
  });
}

//user is on page and browsing
messaging.onMessage(payload => {
  console.log('on message => ',payload);
})

export function askPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(result => {
      resolve(result);
    })
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then((permissionResult) => {
    if (permissionResult !== 'granted') {
      throw new Error('service worker permission denied');
    } else {
      console.log('permission granted');
    }
  })
}
