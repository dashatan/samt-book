import React from 'react';
import {Link} from 'react-router-dom';
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {Home,Search} from '@material-ui/icons';
import translate from '../../../translate';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        position: 'sticky',
        bottom: 0,
        right: 0,
        width: '100%',
        marginTop:10,
        boxShadow: '0px 0px 8px -3px grey',
    },
});

export default function BottomNavigator() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            className={classes.root}
            showLabels
        >
            <BottomNavigationAction label={translate('خانه')} icon={<Home/>} component={Link} to='/' />
            <BottomNavigationAction label={translate('جستجو')} icon={<Search/>} component={Link} to='/explore' />
        </BottomNavigation>
    );
}
