import React, {useEffect} from "react";
import {connect} from "react-redux";
import Store from "../../../../redux/store";
import {CircularProgress} from "@material-ui/core";
import Axios from "axios";
import AvatarArea from "./avatarArea";
import {deepPurple} from "@material-ui/core/colors";
import UsersCollections from "./usersCollections";
import Box from "@material-ui/core/Box";
import {useHistory} from "react-router";

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    user: state.user,
  };
};

const Profile = (props) => {
  let {push} = useHistory();
  useEffect(() => {
    Store.dispatch({
      type: "navTabValue",
      payload: 0
    });
    !props.userToken && props.history.push("/login");
    props.userToken && !props.user && getUser();
  }, []);

  const getUser = () => {
    const url = props.baseUrl + "/api/profile/getUser";
    Axios.post(url, {userToken: props.userToken})
    .then(e => {
      Store.dispatch({
        type: "user",
        payload: e.data
      });
    })
    .catch(e => {
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
      push('/login');
    });
  };

  return (
    <Box
      id="profile"
      style={{
        height: "calc(100vh - 60px)",
        paddingBottom: 60,
        overflowY: 'auto',
      }}
    >
      {!props.user && (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <CircularProgress color="primary"/>
        </Box>
      )}
      {props.user && (
        <Box>
          <Box
            style={{
              backgroundColor: deepPurple.A200,
            }}
          >
            <AvatarArea/>
            <Box
              style={{
                height: 60,
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '60px 60px 0 0',
                marginTop: 15,
              }}
            />
          </Box>
          <UsersCollections/>
        </Box>
      )}
    </Box>
  );
}

export default connect(mapStateToProps)(Profile);
