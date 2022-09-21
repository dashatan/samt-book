import {green,teal} from "@material-ui/core/colors";
import React, {Suspense} from 'react';
import {createMuiTheme, jssPreset, MuiThemeProvider, StylesProvider} from "@material-ui/core/styles";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import Store from "./components/redux/store";
import {create} from "jss";
import rtl from "jss-rtl";
import {isMobile} from "react-device-detect";

const lang = Store.getState().lang;
document.body.style.overflow = 'hidden';
document.body.style.direction = ['fa', 'ar', ''].includes(lang) ? 'rtl' : 'ltr';
document.body.style.textAlign = ['fa', 'ar', ''].includes(lang) ? 'right' : 'left';

const Theme = createMuiTheme({
    direction: ['fa', 'ar', ''].includes(lang) ? 'rtl' : 'ltr',
    typography: {
        "fontFamily": ['fa', 'ar', ''].includes(lang) ? "iran , sans-serif" : "sans-serif",
        "fontSize": 14,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        primary: teal,
        secondary: green,
    },
});

const jss = create({plugins: [...jssPreset().plugins, rtl()]});

const ltr_jss = create({plugins: [...jssPreset().plugins]});

export default function App() {
    let DisplayApp;
    if (isMobile){
        if (lang) {
            DisplayApp = React.lazy(() => import('./components/pages/ui/mobile/index'));
        } else {
            DisplayApp = React.lazy(() => import('./components/pages/ui/mobile/Lang'));
        }

    }else {
        DisplayApp = React.lazy(() => import('./components/pages/ui/desktop/index'));
    }

    return (
        <MuiThemeProvider theme={Theme}>
            <StylesProvider jss={['fa', 'ar'].includes(lang) ? jss : ltr_jss}>
                <Router>
                    <Provider store={Store}>
                        <Suspense fallback={<div/>}>
                            <DisplayApp/>
                        </Suspense>
                    </Provider>
                </Router>
            </StylesProvider>
        </MuiThemeProvider>
    )
}
