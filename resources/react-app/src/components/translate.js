import Store from "./redux/store";

export default function translate(text) {
    if (Store.getState().locale && Store.getState().locale[text]) {
        return Store.getState().locale[text];
    } else {
        return text;
    }
}
