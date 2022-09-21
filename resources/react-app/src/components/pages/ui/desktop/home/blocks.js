import React from 'react';
import {ButtonBase, Card, CardMedia, Grid} from "@material-ui/core";
import {Skeleton} from '@material-ui/lab';
import translate from "../../../../translate";
import Store from "../../../../redux/store";
import {Link} from "react-router-dom";


export default class Blocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: [],
        }
    }

    componentDidMount() {
        if (Store.getState().homeBlocks) {
            this.setState({blocks: Store.getState().homeBlocks});
        } else {
            Store.subscribe(() => {
                if (Store.getState().homeBlocks) {
                    this.setState({blocks: Store.getState().homeBlocks});
                }
            })
        }
    }

    render() {

        return (
            <div>
                {this.state.blocks.length > 0 ?
                    <Grid container spacing={3} className='grid-container'>
                        {this.state.blocks.map((block, key) => {
                            return (
                                <Grid key={key} item xs={6} className='grid-item'>
                                    <ButtonBase style={{width:'100%',height:'100%'}} component={Link} to={`/explore/${block.collection}`}>
                                        <Card className='block' elevation={3} >
                                            <CardMedia className='block-image' image={block.icon}
                                                       title={translate(block.label)}/>
                                            <div className='block-title'>{translate(block.label)}</div>
                                        </Card>
                                    </ButtonBase>
                                </Grid>
                            );
                        })
                        }
                    </Grid>
                    :

                    <Grid container spacing={3} className='grid-container'>
                        {[...Array(8)].map((x,i)=>{
                            return(
                                <Grid key={i} item xs={6} className='grid-item'><Skeleton variant='rect' height={160} animation='wave'/></Grid>
                            )
                        })}
                    </Grid>
                }
            </div>
        )
    }

}
