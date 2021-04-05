import React, { useState, useEffect } from 'react';
import AntTree from "../../Content/AntTree";
import WindowHeader from "./WindowHeader";

const WindowWrapper = (props) => {
  const [hover, setHover] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [display, setDisplay] = useState(true);
  useEffect(() => {
    if (hover) {
      //setTimeLeft(10);
    }
  }, [hover])


  useEffect(() => {
    if (props.query.length > 0) {
      setToggle(true);
    } else {
      if (toggle) setToggle(false);
    }


  }, [props.query])

  useEffect(() => {
    if (timeLeft === 0) {
      setHover(false);
    }

    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
    <div
      className={`${props.historical ? "" : props.active ? props.query.length > 0 ? "bg-gray-900" : "bg-gray-900" : ""}`}
      key={props.windowKey}
      style={{
        padding: props.active ? "25px 10px 10px 5px": "5px 0px 5px 0px",
        margin: props.active ? "0 0 20px 0" : props.historical ? "0 10px" : "0 10px 20px 10px",
        //borderRadius: "20px",
        minHeight: "50px",
        borderLeft: props.active ? "5px solid white" : "",
        display: !display ? "none" : "",

      }}
      onMouseOver={() => {
        if (props.historical) {
          if (toggle) {
            setHover(true)
          }

        } else {
          setHover(true)
        }

      }}
      //onMouseOut={() => {setHover(false)}}
      onMouseLeave={() => { setHover(false) }}
    >

      <WindowHeader
        windowKey={props.windowKey}
        index={props.index}
        windowKeyHook={props.windowKeyHook}
        setWindowKeyHook={props.setWindowKeyHook}
        windowKeyRef={props.windowKeyRef}
        active={props.active}
        inline={props.inline}
        hover={hover}
        setWindows={props.setWindows}
        query={props.query}
        historical={props.historical}
        toggle={toggle}
        setToggle={setToggle}
        tabCount={props.tabCount}
        windowTime={props.windowTime}
        setHover={setHover}
        setDisplay={setDisplay}
      />
      {
        props.historical && !toggle ?
          <div></div>
          :
          <AntTree
            info={{ windowKey: props.windowKey }}
            disconnect={props.windows}
            mainSettings={props.mainSettings}
            setMainSettings={props.setMainSettings}
            menuOpened={false}
            resize={false}
            setResize={() => { }}
            windowsTree={true}
            systemWidth={props.systemWidth}
            query={props.query}
            windowsActive={props.active}
            historical={props.historical}
          />

      }


    </div>

  );


}


export default WindowWrapper;
