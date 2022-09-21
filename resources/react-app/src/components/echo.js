import Echo from "laravel-echo";
import Store from "./redux/store";
window.Pusher = require('pusher-js');

export default function () {
  return new Echo({
    broadcaster: 'pusher',
    key: 'a564943091d3354ba087',
    cluster: 'ap1',
    encrypted: true,
    auth: {
      headers: {
        Authorization: 'Bearer ' + Store.getState().userToken,
      },
    },
  })
}