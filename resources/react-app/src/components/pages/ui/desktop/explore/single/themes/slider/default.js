import React from "react";
import Slider from "../../../../Slider";
import {Skeleton} from "@material-ui/lab";


export default function DefaultSlider(props) {
  return (
    <div>
      {props.slides.length > 0 ?
        <Slider slides={props.slides} id={props.id}/> :
        <Skeleton height={200} variant="rect" animation="wave"/>
      }
    </div>
  )
}

