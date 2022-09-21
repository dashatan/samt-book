import React from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import {Calendar} from 'react-modern-calendar-datepicker';
import {AppBar, Button, ButtonBase, Card, CardMedia, Divider, Fab, Grid, List, ListItem, ListItemText, Slide, Toolbar} from "@material-ui/core";
import {Link, Route, Switch} from "react-router-dom";
import {ArrowBack} from "@material-ui/icons";

export default class Date extends React.Component {
    constructor(props) {
        super(props);
        let value = '';
        if (this.props.value){
            value = this.props.value.split('/');
            value = {year:parseInt(value[0]),month:parseInt(value[1]),day:parseInt(value[2])};
        }
        this.state = {
            showModal: 0,
            value: value,
            inputValue: this.props.value,
        };
        this.setDate = this.setDate.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
    }

    showModal(e) {
        this.setState({
            hideModal: 0,
            showModal: 1
        });
    }

    hideModal(e) {
        this.setState({
            hideModal: 1,
            showModal: 0
        });

    }

    setDate(e) {
        let inputValue = `${e.year}/${e.month}/${e.day}`;
        this.setState({
            inputValue,
            value: e,
        });
        setTimeout(e=>{
            this.hideModal();
        },300);
    }

    render() {
        return (
            <div>
                <input type="hidden" name={this.props.name} value={this.state.inputValue}/>
                <div className='form-control' onClick={this.showModal}>{this.state.inputValue}</div>
                {this.state.showModal === 1 &&
                <div id={this.props.id + '-modal'}
                     className={`select-modal side-modal show animated ${this.state.hideModal === 1 ? '' : ''}`}>
                    <div className="w-100 bg-white header justify-content-end">
                        <div className="btn btn-rounded" onClick={this.hideModal}>
                            <i className="fal fa-arrow-left"></i>
                        </div>
                    </div>
                    <div className='content d-flex justify-content-center' style={{marginTop:'70px'}}>
                        <Calendar
                            value={this.state.value}
                            onChange={this.setDate}
                            shouldHighlightWeekends
                            locale={this.props.locale === 'fa' ? 'fa' : 'en'} />
                    </div>
                </div>
                }


                <div>
                    <ButtonBase component={Link}
                                to={this.props.match.url + '/' + this.props.name}
                                onClick={() => {
                                    this.setState({showSelectModal: true})
                                }}
                                style={{width: '100%'}}>
                        <Grid container>
                            {this.state.icon &&
                            <Grid item xs={3} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <Card elevation={3}
                                      className='select-icon'
                                      style={{backgroundImage: `url('${baseUrl + '/' + this.state.icon}')`}}/>
                            </Grid>
                            }
                            <Grid item xs={this.state.icon ? 9 : 12} style={{display: "flex", flexDirection: "column"}}>
                                <div style={{position: 'relative', top: -5, fontSize: 13}}><small>{this.props.title}</small>
                                </div>
                                <div style={{fontSize: 16}}>{this.state.label}</div>
                            </Grid>
                        </Grid>
                    </ButtonBase>

                    <Divider style={{margin: '10px 0'}}/>
                    <Switch>
                        <Route path={this.props.match.path + '/' + this.props.name}>
                            <Slide direction='left' in={true} timeout={500}>
                                <div className='select-modal'>
                                    <AppBar color='inherit' position='sticky'>
                                        <Toolbar
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                            <div style={{padding: 10}}>
                                                {this.props.title}
                                            </div>
                                            <Fab size='small' focusRipple
                                                 style={{backgroundColor: "transparent", boxShadow: "none"}}>
                                                <ArrowBack onClick={this.prevBranch}/>
                                            </Fab>

                                        </Toolbar>
                                    </AppBar>
                                    <div className='select-modal-body'>
                                        {this.props.withAllOption &&
                                        <Button size='medium' variant='contained' style={{width: '100%'}}
                                                onClick={this.handleChoose.bind(this, this.state.allOption)}>
                                            {this.state.allOption.label}
                                        </Button>
                                        }
                                        {this.props.variant === 'grid' &&
                                        <Grid container className='grid-container' spacing={3}>
                                            {this.props.options.map((option, key) => {
                                                return (
                                                    <Grid item className='grid-item' xs={6} key={key}>
                                                        <ButtonBase style={{width: '100%', height: '100%'}}
                                                                    onClick={this.handleChoose.bind(this, option)}>
                                                            <Card className='block' elevation={3}>
                                                                {this.props.withIcon &&
                                                                <CardMedia className='block-image'
                                                                           image={baseUrl + '/' + option.icon}
                                                                           title={option.label}/>
                                                                }
                                                                <div className='block-title'>{option.label}</div>
                                                            </Card>
                                                        </ButtonBase>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                        }
                                        {this.props.variant === 'linear' &&
                                        <List>
                                            {this.props.options.map((option, key) => {
                                                return (
                                                    <div key={key}>
                                                        <ListItem button onClick={this.handleChoose.bind(this, option)}>
                                                            <ListItemText>{option.label}</ListItemText>
                                                        </ListItem>
                                                        <Divider/>
                                                    </div>
                                                )
                                            })}
                                        </List>
                                        }
                                        {this.props.variant === 'linearNested' &&
                                        <List>
                                            {this.state.optionsToShow.map((option, key) => {
                                                return (
                                                    <div key={key}>
                                                        <ListItem button
                                                                  onClick={this.handleNestedChoose.bind(this, option)}>
                                                            <ListItemText>{option.label}</ListItemText>
                                                        </ListItem>
                                                        <Divider/>
                                                    </div>
                                                )
                                            })}
                                        </List>
                                        }
                                    </div>
                                </div>
                            </Slide>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}
