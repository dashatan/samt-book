import React from "react";
import {connect} from "react-redux";
import {Box, Button, CardMedia, Grid, Typography} from "@material-ui/core";
import translate from "../../../../translate";
import {Group, Help, Mail, Settings} from "@material-ui/icons";
import {deepPurple} from "@material-ui/core/colors";
import {Link, Route, Switch} from "react-router-dom";
import EditProfile from "./editProfile/editProfile";
import Users from "./users/users";
import Inbox from "./inBox";
import Badge from "@material-ui/core/Badge";

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    user: state.user
  };
};

const AvatarArea = (props) => {
  return (
    <Box>
      <Grid
        container
      >
        <Grid
          item
          xs={4}
          style={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            padding: 10
          }}
        >
          <CardMedia
            image={props.user.avatar}
            title={props.user.name}
            style={{
              height: 80,
              width: 80,
              borderRadius: 80,
              backgroundSize: 'cover'
            }}
          />
        </Grid>
        <Grid
          item
          xs={8}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Typography
            style={{
              whiteSpace: "nowrap",
              color: '#ffffff'
            }}
          >
            {props.user.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{padding: '0 10px'}}>
        <Grid item xs={4}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            fullWidth
            startIcon={<Settings/>}
            component={Link}
            to="/profile/editProfile"
            style={{
              borderRadius: 100,
              backgroundColor: deepPurple.A700,
            }}
          >
            {translate('تنظیمات')}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            fullWidth
            startIcon={<Help/>}
            style={{
              borderRadius: 100,
              backgroundColor: deepPurple.A700,
            }}
          >
            {translate('راهنما')}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Badge
            badgeContent={props.user.unseenMessagesCount}
            color="secondary"
            style={{width:'100%'}}
          >
            <Button
              color="secondary"
              variant="contained"
              size="small"
              fullWidth
              startIcon={<Mail/>}
              style={{
                borderRadius: 100,
                backgroundColor: deepPurple.A700,
                fontSize: 12,
              }}
              component={Link}
              to="/profile/inbox"
            >
              {translate('صندوق پیام')}
            </Button>
          </Badge>
        </Grid>
      </Grid>
      {['admin', 'editor'].includes(props.user.role) && (
        <Box
          style={{
            padding: '0 10px',
            marginTop: 10,
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            style={{
              borderRadius: 100,
              minWidth: 100,
              backgroundColor: deepPurple.A700,
            }}
            size="small"
            startIcon={<Group/>}
            component={Link}
            to="/profile/Users"
          >
            {translate('مدیریت کاربران')}
          </Button>
        </Box>
      )}
      <Switch>
        <Route path="/profile/editProfile" component={EditProfile}/>
        <Route path="/profile/Users" component={Users}/>
        <Route path="/profile/inbox" component={Inbox}/>
      </Switch>
    </Box>
  );
}

export default connect(mapStateToProps)(AvatarArea);
