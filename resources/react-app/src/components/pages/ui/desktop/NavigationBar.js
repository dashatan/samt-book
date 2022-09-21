import React from "react";
import {Fade, Paper, Tab, Tabs} from "@material-ui/core";
import {Explore, HeadsetMic, Home as HomeIcon, Person, Radio} from "@material-ui/icons";
import translate from "../../../translate";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import Store from "../../../redux/store";

const mapStateToProps = (state) => {
    return {
        value: state.navTabValue,
        show: state.showBottomNavTabs,
    }
};

const tabs = [
    {
        name: 'home',
        icon: <HomeIcon/>,
        label: 'صفحه اصلی',
        url: '/',
    },
    {
        name: 'news',
        icon: <Radio/>,
        label: 'مطبوعات',
        url: '/news',
    },
    {
        name: 'explore',
        icon: <Explore/>,
        label: 'کاوش',
        url: '/explore',
    },
    {
        name: 'contact us',
        icon: <HeadsetMic/>,
        label: 'تماس با ما',
        url: '/contacts',
    },
    {
        name: 'profile',
        icon: <Person/>,
        label: 'پروفایل',
        url: '/profile',
    },
];

const lang = Store.getState().lang;

class NavigationBar extends React.Component {
    handleTabChange = (event, value) => {
        Store.dispatch({type: 'navTabValue', payload: value});
    };

    render() {
        return (
            <Fade in={this.props.show}>
                <Paper square style={{
                    width: '100%',
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    zIndex: 1000,
                }}>
                    <Tabs
                        value={this.props.value}
                        variant="standard"
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleTabChange}
                    >
                        {tabs.map((tab, key) => {
                            return (
                                <Tab
                                    style={{
                                        padding: 0,
                                        minHeight: 60,
                                        fontFamily: ['fa', 'ar', ''].includes(lang) ? "iran , sans-serif" : "sans-serif",
                                        fontSize: 16,
                                    }}
                                    label={translate(tab.label)}
                                    component={Link}
                                    to={tab.url}
                                />
                            )
                        })}
                    </Tabs>
                </Paper>
            </Fade>
        )
    }
}

export default connect(mapStateToProps)(NavigationBar);
