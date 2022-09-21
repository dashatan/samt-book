import React from "react";
import {connect} from "react-redux";
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Fab,
    Fade,
    Paper,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import {ArrowBack, Language} from "@material-ui/icons";
import Axios from "axios";
import Store from "../../../../redux/store";
import translate from "../../../../translate";
import {Link} from "react-router-dom";
import {green, red} from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import camelToSnake from "../../../../camelToSnake";
import Select from "../explore/filterComponents/Select";
import Alert from "@material-ui/lab/Alert";
import $ from 'jquery';

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        baseUrl: state.baseUrl,
        userToken: state.userToken,
        user: state.user,
        provinces: state.provinces,
    };
};

class Login extends React.Component {

    constructor(props) {
        super(props);
        Store.dispatch({
            type: "navTabValue",
            payload: 0
        });
        const avatars = [
            {
                value: this.props.baseUrl + '/icons/user/avatar/man.svg',
                label: '',
                icon: 'icons/user/avatar/man.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/man-1.svg',
                label: '',
                icon: 'icons/user/avatar/man-1.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/man-2.svg',
                label: '',
                icon: 'icons/user/avatar/man-2.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/man-3.svg',
                label: '',
                icon: 'icons/user/avatar/man-3.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/man-4.svg',
                label: '',
                icon: 'icons/user/avatar/man-4.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/boy.svg',
                label: '',
                icon: 'icons/user/avatar/boy.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/boy-1.svg',
                label: '',
                icon: 'icons/user/avatar/boy-1.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/girl.svg',
                label: '',
                icon: 'icons/user/avatar/girl.svg',
            },
            {
                value: this.props.baseUrl + '/icons/user/avatar/girl-1.svg',
                label: '',
                icon: 'icons/user/avatar/girl-1.svg',
            },
        ];
        const initialInputs = [
            // {
            //   type: 'text',
            //   inputType: 'number',
            //   name: 'melliCode',
            //   id: 'melliCode',
            //   title: 'کد ملی',
            //   label: 'کد ملی',
            //   value: '',
            //   variant: 'outlined',
            //   error: false,
            //   helperText: '',
            //   withLength: true,
            //   requiredLength: 10,
            //   autoFocus: true,
            //   required: true,
            // },
            // {
            //   type: 'text',
            //   inputType: 'text',
            //   name: 'name',
            //   id: 'name',
            //   title: 'نام و نام خانوادگی',
            //   label: 'نام و نام خانوادگی',
            //   value: '',
            //   caption: '',
            //   variant: 'outlined',
            //   error: false,
            //   helperText: '',
            //   required: true,
            // },
            {
                type: 'text',
                inputType: 'text',
                name: 'email',
                id: 'email',
                title: 'ایمیل',
                label: 'ایمیل',
                value: '',
                caption: '',
                variant: 'outlined',
                error: false,
                helperText: '',
                required: true,
            },
            {
                type: 'select',
                name: 'provinceId',
                id: 'provinceId',
                title: 'استان',
                label: '',
                value: '',
                variant: 'linear',
                btnVariant: 'rounded-outlined',
                options: this.props.provinces,
                withSearch: true,
                withIcon: false,
                withAllOption: false,
                withOthersOption: false,
                required: true,
            },
            {
                type: 'select',
                name: 'avatarUrl',
                id: 'avatarUrl',
                title: 'تصویر کاربری پیشفرض',
                label: '',
                value: this.props.baseUrl + '/icons/user/avatar/man-1.svg',
                icon: 'icons/user/avatar/man-1.svg',
                variant: 'grid',
                options: avatars,
                btnIconBackgroundSize: ' cover',
                iconBackgroundSize: 'cover',
                withSearch: false,
                withIcon: true,
                withAllOption: false,
                withOthersOption: false,
                required: true,
            },
        ]
        props.userToken && props.history.push("/profile");
        this.state = {
            inputs: initialInputs,
            step: 1,
            phoneNumber: "",
            phoneNumberHelperText: "",
            phoneNumberError: false,
            sendPhoneNumberMessage: translate('به منظور ثبت نام در صمت بوک ابتدا دکمه "احراز هویت سامانه امتا" را بزنید'),
            newPhoneNumber: true,//برای اینکه ببینیم شماره تلفنی که قبلا وارد کرده بود تغییر کرده یا نه
            melliCode: "",
            name: "",
            password: "",
            passwordError: false,
            passwordHelperText: "",
            userIsRegistered: false,
            userIsComplete: false,
            userHasPassword: false,
            btnLoader: false,
            sendPasswordBtnLoader: false,
            authorizeLoading: false,
            passwordSendMessage: '',
            passwordSent: false,
            passwordSentTimer: 0,
            userToken: '',
            scrollElementHeight: 'calc(100vh - 60px)',
            initialWindowHeight: window.innerHeight,
            virtualKeyboardVisible: false,
            textFieldFocused: false,
            focusedTextFieldId: null,
            focusedTextFieldOffset: 0,
            containerPosition: 'static',
        };
    }

    componentDidMount() {
        document.body.onresize = () => {
            if (this.state.initialWindowHeight - window.innerHeight > 150) {//virtual keyboard coming up
                this.setState({
                    virtualKeyboardVisible: true,
                    scrollElementHeight: window.innerHeight,
                    containerPosition: 'fixed',
                })
            } else {
                document.querySelectorAll('input').forEach(input => {
                    input.blur();
                });
                this.setState({
                    virtualKeyboardVisible: false,
                    scrollElementHeight: 'calc(100vh - 60px)',
                    containerPosition: 'static',
                })
            }
        }
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const ECSWCode = urlParams.get('code');
        if (ECSWCode) {
            this.getUserInfo(ECSWCode);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let scrollElement = $("#login-scroll-element");
        if (this.state.textFieldFocused) {
            let anchorElement = $(`#${this.state.focusedTextFieldId}`);
            scrollElement.scrollTo(anchorElement, {offset: this.state.focusedTextFieldOffset});
        }
    }

    authorize = () => {
        this.setState({
            authorizeLoading: true,
        })
        let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let params = {
            response_type: 'code',
            client_id: '8a6d176e-0ac0-42c0-afc3-8f583b029f60',
            redirect_uri: 'https://samtbook.ir/login',
            scope: 'user:status user:identity:general user:primaryMobileNumber user:primaryEmail',
            state: token,
        }
        let url = `https://ecsw.ir/oauth/authorize`;
        for (let i in params) {
            if (params.hasOwnProperty(i)) {
                url = url + `${i === 'response_type' ? '?' : '&'}${i}=${params[i]}`;
            }
        }
        window.location.href = url;
    }

    getUserInfo = (code) => {
        const url = `${this.props.baseUrl}/api/login/getUserInfo`;
        const data = {code}
        this.setState({
            sendPhoneNumberMessage: translate('در حال دریافت اطلاعات') + '،'+translate('لطفا صبر کنید') + ' ...',
            authorizeLoading: true,
        })
        Axios.post(url, data).then(e => {
            this.setState({
                sendPhoneNumberMessage: '',
                authorizeLoading: false,
            })
            const fName = e.data.identityData.name;
            const lName = e.data.identityData.family;
            const name = fName + ' ' + lName;
            let mobile = e.data.mobileData.primaryMobileNumber.mobileNumber;
            mobile = '0' + mobile.substring(3, 13);
            const data = {
                name,
                mobile,
            }
            this.registerNewUser(data);
        }).catch(e => {
            this.setState({
                sendPhoneNumberMessage: 'خطا',
                authorizeLoading: false,
            })
            console.log(e);
        })
    }

    registerNewUser = (data) => {
        const url = this.props.baseUrl + '/api/login/register';
        let formData = {
            ...data,
            role: 'user',
            lang: this.props.lang,
        }
        Axios.post(url, formData).then(e => {
            let mobile = e.data.mobile;
            let userHasPassword = e.data.userHasPassword;
            let userIsComplete = e.data.userIsComplete;
            if (userHasPassword) {
                this.setState({passwordSendMessage: translate("اگر رمز عبور خود را فراموش کرده اید دکمه ارسال مجدد رمز عبور را بزنید")})
            }
            this.setState({
                authorizeLoading: false,
                phoneNumber: mobile,
                userHasPassword,
                userIsComplete,
                step: 2,
                newPhoneNumber: false,
            })
            if (!userHasPassword) {
                this.sendPassword();
            }
        }).catch(e => {
            this.setState({
                authorizeLoading: false,
            })
            return console.log(e);
        })
    }

    sendPhoneNumber = () => {
        if (this.state.newPhoneNumber) {
            if (this.state.phoneNumber === '') {
                this.setState({
                    btnLoader: false,
                    phoneNumberError: true,
                    phoneNumberHelperText: translate('لطفا شماره موبایل خود را وارد کنید'),
                });
            } else if (this.state.phoneNumber.length !== 11) {
                this.setState({
                    btnLoader: false,
                    phoneNumberError: true,
                    phoneNumberHelperText: translate('شماره موبایل صحیح نیست'),
                });
            } else {
                this.setState({btnLoader: true});
                const url = this.props.baseUrl + "/api/login/sendPhoneNumber";
                Axios.post(url, {phoneNumber: this.state.phoneNumber})
                    .then((e) => {
                        let userHasPassword = e.data.userHasPassword;
                        let userIsComplete = e.data.userIsComplete;
                        if (userHasPassword) {
                            this.setState({passwordSendMessage: translate("اگر رمز عبور خود را فراموش کرده اید دکمه ارسال مجدد رمز عبور را بزنید")})
                        }
                        this.setState({
                            userIsComplete,
                            userHasPassword,
                            step: 2,
                            btnLoader: false,
                            newPhoneNumber: false,
                        });
                    })
                    .catch((e) => {
                        this.setState({
                            btnLoader: false,
                            phoneNumberError: true,
                            newPhoneNumber: false,
                            phoneNumberHelperText: translate(
                                e.response.data.errors.phoneNumber[0]
                            ),
                        });
                        console.log(e);
                    });
            }
        } else {
            this.setState({step: 2});
        }
    };

    sendPassword = () => {
        this.setState({
            sendPasswordBtnLoader: true,
            passwordSent: false,
            passwordSendMessage: translate("در حال ارسال رمز عبور برای") + ' ' + this.state.phoneNumber,
        });
        const url = this.props.baseUrl + "/api/login/sendPassword";
        Axios.post(url, {phoneNumber: this.state.phoneNumber})
            .then(() => {
                this.passwordSentTimerCountDown();
                this.setState({
                    passwordSent: true,
                    sendPasswordBtnLoader: false,
                    passwordSendMessage: translate("رمز عبور ارسال شد برای") + ' ' + this.state.phoneNumber,
                });
            })
            .catch((e) => {
                console.log(e);
                this.setState({
                    sendPasswordBtnLoader: false,
                    passwordSendMessage: translate("خطا در ارسال رمز عبور برای") + ' ' + this.state.phoneNumber,
                });
            });
    };

    passwordSentTimerCountDown = () => {
        let timer = 120;
        const interval = setInterval(() => {
            timer = timer - 1;
            if (timer > 0) {
                this.setState({passwordSentTimer: timer});
            } else {
                this.setState({
                    passwordSentTimer: 0,
                });
                clearInterval(interval);
            }
        }, 1000);
    };

    verifyPassword = () => {
        this.setState({btnLoader: true});
        const url = this.props.baseUrl + "/api/login/verifyPassword";
        Axios.post(url, {
            phoneNumber: this.state.phoneNumber,
            password: this.state.password,
        })
            .then((e) => {
                let user = e.data.user;
                let token = e.data.token;
                this.setState({
                    userToken: token,
                    btnLoader: false,
                })
                if (user.isComplete) {
                    localStorage.setItem('userToken', token);
                    Store.dispatch({
                        type: 'userToken',
                        payload: token
                    });
                    Store.dispatch({
                        type: 'user',
                        payload: user
                    });
                    this.props.history.push('/profile');
                } else {
                    this.setState({
                        step: 3,
                        name: user.name,
                    })
                }
            })
            .catch((e) => {
                this.setState({
                    btnLoader: false,
                    passwordError: true,
                    passwordHelperText: translate("رمز عبور صحیح نیست"),
                });
                console.log(e);
            });
    };

    setIdentifications = () => {
        let error = false;
        this.state.inputs.map((input, key) => {
            let newInputs = [...this.state.inputs];
            newInputs[key].error = false;
            newInputs[key].helperText = '';
            this.setState({inputs: newInputs});
            if (input.withLength && input.value.length < input.requiredLength) {
                error = true;
                let newInputs = [...this.state.inputs];
                newInputs[key].error = true;
                newInputs[key].helperText = translate('حداقل') +
                    ' ' +
                    input.requiredLength +
                    ' ' +
                    translate('حرف باید وارد کنید');
                this.setState({inputs: newInputs});
            }
            if (input.required && !input.value) {
                error = true;
                let newInputs = [...this.state.inputs];
                newInputs[key].error = true;
                newInputs[key].helperText = input.title + ' ' + translate('الزامی است');
                this.setState({inputs: newInputs});
            }
        })
        if (!error) {
            this.setState({btnLoader: true});
            let data = new FormData();
            data.append('userToken', this.state.userToken);
            this.state.inputs.map((input) => {
                data.append(camelToSnake(input.name), input.value);
            })
            const url = this.props.baseUrl + "/api/profile/setIdentifications";
            Axios.post(url, data)
                .then((e) => {
                    this.setState({btnLoader: false});
                    localStorage.setItem('userToken', this.state.userToken);
                    Store.dispatch({
                        type: 'userToken',
                        payload: this.state.userToken
                    });
                    Store.dispatch({
                        type: 'user',
                        payload: e.data.user
                    });
                    this.props.history.push('/profile');
                })
                .catch((e) => {
                    this.setState({btnLoader: false});
                    console.log(e);
                    const errors = e.response.data.errors;
                    let inputs = this.state.inputs;
                    for (let i in errors) {
                        if (errors.hasOwnProperty(i)) {
                            let input = inputs.find(x => camelToSnake(x.name) === i);
                            if (input) {
                                input.error = true;
                                input.helperText = errors[i][0];
                            } else {
                                alert(errors[i][0]);
                            }
                        }
                    }
                    this.setState({inputs});
                });
        }
    };

    setPhoneNumber = (e) => {
        this.setState({
            phoneNumber: e.target.value,
            newPhoneNumber: true,
        });
    };

    setPassword = (e) => {
        this.setState({password: e.target.value});
    };

    handleChange = (key, value, label) => {
        let newInputs = [...this.state.inputs];
        newInputs[key].value = value;
        newInputs[key].error = false;
        newInputs[key].helperText = '';
        if (label) {
            newInputs[key].label = label;
        }
        this.setState({inputs: newInputs});
    }

    prevStep = () => {
        let step = this.state.step;
        this.setState({step: step - 1});
    };

    handleFocus = (id, offset) => {
        this.setState({
            textFieldFocused: true,
            focusedTextFieldId: id,
            focusedTextFieldOffset: offset,
            // virtualKeyboardVisible: true,
        })
    }

    handleBlur = () => {
        this.setState({
            textFieldFocused: false,
            focusedTextFieldId: null,
            // virtualKeyboardVisible: false,
        })
    }

    render() {
        let delay = 0;
        const smallGap = <div style={{height: 10}}/>;
        const largeGap = <div style={{height: 60}}/>;
        return (
            <Container
                id="login-scroll-element"
                style={{
                    height: this.state.scrollElementHeight,
                    paddingBottom: 60,
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                    // backgroundImage: `linear-gradient(180deg,${lightBlue.A200},#ffffff)`,
                    backgroundColor: '#f0f8ff',
                    overflowY: 'auto',
                    zIndex: 100000,
                    position: this.state.containerPosition,
                }}
            >
                {!this.state.virtualKeyboardVisible && (
                    <Box>
                        <AppBar
                            position="fixed"
                            style={{backgroundColor: 'transparent',}}
                            color="inherit"
                            elevation={0}
                        >
                            <Toolbar
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Language/>}
                                    component={Link}
                                    to={{
                                        pathname: "/lang",
                                        state: {
                                            redirectPath: window.location.href,
                                        },
                                    }}
                                >
                                    {translate("زبان")}
                                </Button>
                                {this.state.step > 1 && (
                                    <Fab
                                        size="small"
                                        focusRipple
                                        style={{
                                            backgroundColor: "transparent",
                                            boxShadow: "none",
                                        }}
                                    >
                                        <ArrowBack
                                            onClick={this.prevStep}
                                        />
                                    </Fab>
                                )}
                            </Toolbar>
                        </AppBar>
                        {largeGap}
                    </Box>
                )}
                <Box
                    style={{
                        padding: 10,
                        width: '100%'
                    }}
                >
                    {this.state.step === 1 && (
                        <Fade in={this.state.step === 1} addEndListener="">
                            <Box>
                                <Paper
                                    elevation={6} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexFlow: 'column',
                                    borderRadius: 20,
                                    padding: 20,
                                }}
                                >
                                    <Typography style={{textAlign: 'center'}}>
                                        {translate('شماره موبایل')}
                                    </Typography>
                                    <TextField
                                        id="phone-number"
                                        value={this.state.phoneNumber}
                                        size="small"
                                        variant="outlined"
                                        type="number"
                                        className="rounded-text-field phone-number-text-field"
                                        placeholder={translate("مثال") + " : 09123456789"}
                                        fullWidth
                                        autoFocus={true}
                                        error={this.state.phoneNumberError}
                                        helperText={this.state.phoneNumberHelperText}
                                        onChange={this.setPhoneNumber}
                                        onFocus={() => {
                                            this.handleFocus('phone-number', -100)
                                        }}
                                        onBlur={this.handleBlur}
                                        style={{margin: '20px 0'}}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        style={{borderRadius: 100}}
                                        onClick={this.sendPhoneNumber}
                                    >
                                        {this.state.btnLoader ? (
                                            <CircularProgress
                                                size={24}
                                                color="inherit"
                                            />
                                        ) : (
                                            translate("مرحله بعد")
                                        )}
                                    </Button>
                                </Paper>
                                {smallGap}
                                <Typography style={{textAlign: 'center', fontSize: 14}}>
                                    {this.state.sendPhoneNumberMessage}
                                </Typography>
                                {smallGap}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    fullWidth
                                    onClick={this.authorize}
                                    startIcon={this.state.authorizeLoading
                                        ? <CircularProgress color="inherit" size={18}/>
                                        : ''}
                                >
                                    {translate('احراز هویت سامانه امتا')}
                                </Button>
                            </Box>
                        </Fade>
                    )}
                    {this.state.step === 2 && (
                        <Fade in={this.state.step === 2} addEndListener="">
                            <Box>
                                <Paper
                                    elevation={6} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexFlow: 'column',
                                    borderRadius: 20,
                                    padding: 20,
                                }}
                                >
                                    <Typography style={{textAlign: 'center'}} variant="caption">
                                        {translate("رمز عبور خود را وارد کنید")}
                                    </Typography>
                                    <TextField
                                        id="verification-code"
                                        value={this.state.password}
                                        className="rounded-text-field phone-number-text-field"
                                        type="number"
                                        error={this.state.passwordError}
                                        helperText={this.state.passwordHelperText}
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        autoFocus={true}
                                        onChange={this.setPassword}
                                        onFocus={() => {
                                            this.handleFocus('verification-code', -90)
                                        }}
                                        onBlur={this.handleBlur}
                                        style={{margin: '20px 0'}}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        style={{borderRadius: 100}}
                                        onClick={this.verifyPassword}
                                    >
                                        {this.state.btnLoader ? (
                                            <CircularProgress
                                                size={24}
                                                color="inherit"
                                            />
                                        ) : (
                                            translate("مرحله بعد")
                                        )}
                                    </Button>
                                </Paper>
                                {smallGap}
                                <Box>
                                    <Typography style={{textAlign: "center", fontSize: 14}}>
                                        {this.state.passwordSendMessage}
                                    </Typography>
                                    {smallGap}
                                    <Button
                                        variant="contained"
                                        disabled={this.state.passwordSentTimer > 0}
                                        size="small"
                                        color="primary"
                                        fullWidth
                                        onClick={this.sendPassword}
                                        endIcon={
                                            this.state.passwordSentTimer > 0
                                                ? translate("پس از") + ' ' + this.state.passwordSentTimer + ' ' + translate("ثانیه")
                                                : ""
                                        }
                                    >
                                        {this.state.sendPasswordBtnLoader
                                            ? <CircularProgress size={20} color="inherit"/>
                                            : translate("ارسال مجدد رمز عبور")
                                        }
                                    </Button>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                    {this.state.step === 3 && (
                        <Fade in={this.state.step === 3} addEndListener="">
                            <Box>
                                <Alert
                                    severity="success"
                                    variant="filled"
                                >
                                    {translate("حساب کاربری شما ساخته شده است")}
                                    <br/>
                                    {translate('نام') + ' : ' + this.state.name}
                                    <br/>
                                    <span>
                    {translate('شماره موبایل') + ' : '}
                  </span>
                                    <span style={{direction: 'ltr', display: 'inline-flex'}}>{
                                        this.state.phoneNumber.substring(0, 3) +
                                        '****' +
                                        this.state.phoneNumber.substring(7, 11)
                                    }</span>
                                </Alert>
                                {smallGap}
                                <Alert
                                    severity="info"
                                    variant="filled"
                                >{translate("برای استفاده از این حساب حتما باید موارد زیر را ثبت نمایید")}</Alert>
                                <Paper
                                    elevation={6}
                                    style={{
                                        marginTop: 20,
                                        padding: 20,
                                        borderRadius: 20
                                    }}
                                >
                                    {this.state.inputs.map((input, key) => {
                                        delay = delay + 50;
                                        switch (input.type) {
                                            default:
                                                break;
                                            case 'select':
                                                return (
                                                    <Box
                                                        key={key}
                                                        style={{
                                                            marginBottom: 20,
                                                        }}
                                                    >
                                                        <Select
                                                            id={input.id}
                                                            variant={input.variant}
                                                            btnVariant={input.btnVariant}
                                                            withSearch={input.withSearch}
                                                            withIcon={input.withIcon}
                                                            withAllOption={input.withAllOption}
                                                            withOthersOption={input.withOthersOption}
                                                            options={input.options}
                                                            title={translate(input.title)}
                                                            required={input.required}
                                                            name={input.name}
                                                            label={input.label}
                                                            icon={input.icon}
                                                            btnIconBackgroundSize={input.btnIconBackgroundSize}
                                                            iconBackgroundSize={input.iconBackgroundSize}
                                                            error={input.error}
                                                            helperText={input.helperText}
                                                            response={(_name, value, label) => {
                                                                this.handleChange(key, value, label);
                                                            }}
                                                        />
                                                    </Box>
                                                )
                                            case 'text':
                                                return (
                                                    <Box
                                                        key={key}
                                                        style={{
                                                            marginBottom: 20,
                                                        }}
                                                    >
                                                        <TextField
                                                            className="rounded-text-field"
                                                            id={input.id}
                                                            value={input.value}
                                                            variant={input.variant}
                                                            size="small"
                                                            type={input.inputType}
                                                            name={input.name}
                                                            label={translate(input.label)}
                                                            fullWidth
                                                            autoFocus={input.autoFocus}
                                                            multiline={input.inputType === 'textarea'}
                                                            rows={input.rows}
                                                            error={input.error}
                                                            helperText={input.helperText}
                                                            required={input.required}
                                                            onChange={(e) => {
                                                                this.handleChange(key, e.target.value)
                                                            }}
                                                            onFocus={() => {
                                                                this.handleFocus(input.id, input.scrollOffsetOnFocus || -20)
                                                            }}
                                                            onBlur={this.handleBlur}
                                                        />
                                                        {input.withLength && (
                                                            <Typography
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: "flex-end"
                                                                }}
                                                            >
                                                                <span>{input.requiredLength} / </span>
                                                                <span
                                                                    style={{
                                                                        color: input.value.length < input.requiredLength
                                                                            ? red.A200
                                                                            : green.A400
                                                                    }}
                                                                >{input.value.length}</span>
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )

                                        }
                                    })}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{
                                            width: "100%",
                                            borderRadius: 100,
                                            marginTop: 10,
                                        }}
                                        onClick={this.setIdentifications}
                                    >
                                        {this.state.btnLoader ?
                                            <CircularProgress size={24} color="inherit"/> : translate("تایید")}
                                    </Button>
                                </Paper>
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Container>
        );
    }
}

export default connect(mapStateToProps)(Login);
