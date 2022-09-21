import {connect} from "react-redux";
import Store from "../../../redux/store";
import Axios from "axios";
const mapStateToProps = (state) => {
  return {
    lang: state.lang,
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
  }
}

const GetUser = (props) => {
  let url = props.baseUrl + '/api/profile/getUser';
  Axios.post(url, {userToken: props.userToken}).then(e => {
    Store.dispatch({
      type: 'user',
      payload: e.data,
    });
  }).catch(e => {
    console.log(e);
    localStorage.removeItem('userToken');
    Store.dispatch({
      type: "user",
      payload: null
    });
    Store.dispatch({
      type: 'userToken',
      payload: null
    });
  })
};
export default connect(mapStateToProps)(GetUser);