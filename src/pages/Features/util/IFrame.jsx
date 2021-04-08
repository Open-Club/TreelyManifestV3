import React from 'react';
import Frame from './Frame';

const IFrame = (props) => {
  return (
    <Frame
      style={props.style == "inline" ?
        {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          border: "none",
          fontFamily: "Roboto, sans-serif",
          display: "block"
        } : props.style == "windows" ?
          {
            fontFamily: "Roboto, sans-serif",
            height: "850px",
            padding: "5px"
          } :
          props.style == "popup" ?
            {
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              border: "none",
              fontFamily: "Roboto, sans-serif",
              display: "block",
              background: "#11111E"
            } :
            {
              fontFamily: "Roboto, sans-serif",
              height: "850px",
              borderRadius: "15px",
              padding: "5px"
            }
      }
      styleSheets={props.styleSheet}
      css={props.css}
    //sandbox="allow-scripts allow-same-origin"
    >
      {props.children}
    </Frame>
  );


}

export default IFrame;
