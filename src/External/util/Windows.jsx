import React, { Fragment, useState, useEffect } from 'react';
import WindowWrapper from "./WindowWrapper";
import Tooltip from "../../Dashboard/components/Tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
const Windows = (props) => {
  const historicalWindowList = props.historicalWindowList;
  const [historicalLength, setHistoricalLength] = useState(0);
  //console.log(historicalWindowList)
  const inline = props.systemWidth == "inline";
  const [historyQuery, setHistoryQuery] = useState("");

  const styles = {
    main: {
      //height: inline ? props.mainSettings.settings.system == "win" ?  "85%" : "calc(100% - 140px)" : "100%",
      height: inline ? "calc(100% - 140px)" : "calc(100% - 140px)",
      overflow: inline ? "scroll" : "",
      overflowX: "hidden"

    },
    heading: {
      padding: "0 5px 0 35px"
    },
    windowWrapper: {
      padding: "5px 0px"
    },
    historyHeading: {
      marginLeft: "35px",
      marginRight: "35px",
      borderBottom: "1px solid white"
    },
    question: {
      width: "16px",
      height: "16px",
      display: "inline",
      marginLeft: "5px",
      cursor: "pointer",
      verticalAlign: "unset",
      color: "white"
    }
  }

  useEffect(() => {
    if (!historicalWindowList) return;
    if (historicalLength == 0) {
      setHistoricalLength(historicalWindowList.length > 1 ? 1 : historicalWindowList.length);
    }

  }, [historicalWindowList])


  const loop = (windowKeys, index) => windowKeys.map((windowKey) => {
    index += 1;
    const active = props.windowKeyHook === windowKey;
    return (
      <WindowWrapper
        key={windowKey}
        windowKey={windowKey}
        index={index}
        windowKeyHook={props.windowKeyHook}
        setWindowKeyHook={props.setWindowKeyHook}
        windowKeyRef={props.windowKeyRef}
        active={active}
        inline={inline}
        setWindows={props.setWindows}
        systemWidth={props.systemWidth}
        mainSettings={props.mainSettings}
        setMainSettings={props.setMainSettings}
        query={props.query}
        historical={false}
      />

    );


  })

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const firstDateIsPastDayComparedToSecond = (firstDate, secondDate) => firstDate.toLocaleDateString() == secondDate.toLocaleDateString();




  const loopHistorical = (historicalList, historicalLength) => {
    let index = 0;
    let historicalListSliced = historicalList.slice(0, historicalLength);
    let historicalWindows = historicalListSliced.map(function (singleHistorical) {
      let fullDate = new Date(singleHistorical.fullDate);
      const today = new Date();
      const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
      //console.log(weekDay)
      let day = fullDate.toDateString() === today.toDateString() ? "Today" : firstDateIsPastDayComparedToSecond(fullDate, yesterday) ? "Yesteday" : "";
      let windowList = singleHistorical.windowList;
      let windowComponents = windowList.map(function (singleWindow) {
        let windowKey = singleWindow.key;
        let tabCount = singleWindow.tabCount;
        let windowTime = singleWindow.time;
        //console.log(dateString);
        index += 1;
        const active = props.windowKeyHook === windowKey;
        return (
          <WindowWrapper
            key={windowKey}
            windowKey={windowKey}
            index={index}
            windowKeyHook={props.windowKeyHook}
            setWindowKeyHook={props.setWindowKeyHook}
            windowKeyRef={props.windowKeyRef}
            active={active}
            inline={inline}
            setWindows={props.setWindows}
            systemWidth={props.systemWidth}
            mainSettings={props.mainSettings}
            setMainSettings={props.setMainSettings}
            query={historyQuery}
            historical={true}
            tabCount={tabCount}
            windowTime={windowTime}
          />

        );

      })
      return (
        <div key="historical_windows">
          <h1 className={"text-lg font-bold text-white mt-6 mb-2 pt-2 pb-3"}
            style={styles.historyHeading}>
            {day} {day === "" ? `${days[fullDate.getDay()]}, ${fullDate.toLocaleDateString()} ` : `- ${fullDate.toLocaleDateString()}`}
          </h1>
          {windowComponents}
        </div>
      )

    })
    return (
      historicalWindows
    )


  };

  return (
    <div
      id={"treely_windows"}
      style={styles.main}
    >
      <span className={"flex"}>
        <Tooltip message="The active section contains all trees of current active browsing windows">

          <span
            className={"text-xl font-bold uppercase text-white mt-6 mb-2 pt-2"}
            style={styles.heading}
          >
            Active
                </span>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            style={styles.question}
          />
        </Tooltip>
      </span>

      {loop(props.windowList, 0)}

      {
        historicalWindowList.length != 0 ?
          <div className={"my-6"}>
            <span className={"flex"}>
              <Tooltip message="The history section has all windows that were either closed or lost during a shutdown.">

                <span
                  className={"text-xl font-bold uppercase text-white mt-6 mb-2 pt-2"}
                  style={styles.heading}
                >
                  History
                </span>
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  style={styles.question}
                />
              </Tooltip>
            </span>
            <div className={`w-full flex items-center py-2 justify-between shadow-xs`}
              style={{
                padding: "20px 20px 20px 20px",
                height: "3rem"
              }}
            >
              <div
                className="h-8 pl-3 mr-3  bg-gray-900 text-gray-600 focus-within:text-gray-400 rounded-md flex-1 flex content-between items-center relative"
                //style={{ width: props.windows ? (props.inline ? "85%" : "60%") : "70%" }}
                style={{ minWidth: "100%" }}
              >
                <button type="submit" className="bg-gray-900 mr-1 focus:outline-none active:outline-none">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
                <input type="search" name="search" id="search" placeholder="Search..." value={historyQuery} onChange={({ currentTarget }) => { setHistoryQuery(currentTarget.value) }}
                  className={`bg-gray-900 appearance-none outline-none text-sm `}
                  //disabled={props.windows ? true : false}
                  style={{
                    minWidth: "calc(100% - 35px)",
                    maxWidth: "calc(100% - 35px)"
                  }}
                  autoComplete="off"

                //style={{width: "40%"}}
                />

              </div>
            </div>

            {loopHistorical(historicalWindowList, historicalLength)}
            {
              historicalLength != historicalWindowList.length ?
                <div>
                  <h1 className={"text-xs font-bold uppercase text-white mt-6 mb-6 pt-2 cursor-pointer"}
                    style={styles.heading}
                    onClick={() => {
                      setHistoricalLength((historicalLength + 1) < historicalWindowList.length ? (historicalLength + 1) : historicalWindowList.length);
                    }}
                  >
                    Load more
                  </h1>

                </div> :
                <div></div>
            }

          </div>


          :
          <div></div>

      }

    </div>
  )

}

export default Windows;
