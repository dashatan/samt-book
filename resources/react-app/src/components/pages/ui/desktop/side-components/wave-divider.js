import React from "react";

export default function WaveDivider(props) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
         <path
            fill={props.color}
            fillOpacity="1"
               d="M0,160L60,181.3C120,203,240,245,360,234.7C480,224,600,160,720,122.7C840,85,960,75,1080,101.3C1200,128,1320,192,1380,224L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
         </path>
      </svg>
   )
}