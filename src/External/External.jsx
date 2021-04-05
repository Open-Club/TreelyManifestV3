/*global chrome*/
import React, { Fragment, useState, useEffect, useRef } from 'react';
import './External.css';
import { windowPrefix, windowListKey, historicalWindowListKey, savedWindowListKey } from "../Background/functions/generalFunction";
import AntTree from "./util/AntTree";
import Header from "./util/Header";
import IFrame from "../Content/util/IFrame";
import CSS from "../Content/util/CSS";
import Dashboard from "../Dashboard/Dashboard";
import ProfileHead from "./util/ProfileHead";
import Windows from "./util/Windows";
import {
  extensionName
} from "../Background/functions/generalFunction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'


const External = () => {
  const styles = {
    resizingText: {
      position: "absolute",
      left: "50%",
      top: "50%",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      color: "white"

    },
    resizingBackground: {
      background: "#1A1A1B",
      width: "100%",
      height: "100%"
    }
  };
  const [treeInfo, setTreeInfo] = useState({
    treeData: [],
    expandedKeys: [],
    selectedKeys: [],
    pinned: []
  });
  const [settingsActive, setSettingsActive] = useState(false);
  const [page, setPage] = useState("settings");
  const [windowList, setWindowList] = useState([]);
  const [disconnect, setDisconnect] = useState(false);
  const [mainSettings, setMainSettings] = useState({
    settings: {
      colourMode: "white",
      idle: false,
      menuAlignment: "right",
      overlay: true,
      popup: true,
      power: false,
      "snooze": { "active": true, "neverSuspendActive": true, "neverSuspendAudio": true, "neverSuspendOffline": false, "neverSuspendPinned": true, "neverSuspendPowerSource": false, "neverSuspendUnsavedInput": true, "neverSuspendWhitelist": [], "time": "never" },
      system: "mac",
      width: 340
    },
    user: {
      displayName: "",
      email: ""
    }

  });
  const [windows, setWindows] = useState(false);
  const [windowKeyHook, setWindowKeyHook] = useState("");
  const [auth, setAuth] = useState({
    loggedIn: false,
    displayName: ""
  });

  const windowKeyRef = useRef();

  const [timeLeft, setTimeLeft] = useState(null);
  const [systemWidth, setSystemWidth] = useState(window.innerWidth);
  const [query, setQuery] = useState('');
  const [historicalWindowList, setHistoricalWindowList] = useState([]);
  const [savedWindowList, setSavedWindowList] = useState([]);



  /***
   * Functions
   */



  const fetchSettings = async () => {
    chrome.storage.local.get(extensionName, (result) => {
      var extensionData = result[extensionName];
      ////consolelog(`Setting is ${JSON.stringify(extensionData)} and local hook is ${JSON.stringify(settings)}`);
      setMainSettings(extensionData);

      /*
      if (extensionData.user.email == "") {
        setAuth({
          loggedIn: false,
          displayName: ""
        });
      } else {
        setAuth({
          loggedIn: true,
          displayName: extensionData.user.displayName
        });
      }*/


    });
  }

  const getHistoricalWindowList = async () => {
    chrome.storage.local.get(historicalWindowListKey, (result) => {
      let historicalWindowList = result[historicalWindowListKey];
      if (typeof (historicalWindowList) !== "undefined" && historicalWindowList.length != 0) {
        setHistoricalWindowList(historicalWindowList);
      }
    });
  }






  const getTreeInfo = async () => {
    let localKey = windowKeyRef.current;
    chrome.storage.local.get(localKey, (result) => {
      var treeInfo = result[localKey];
      if (typeof (treeInfo) != "undefined") {
        setTreeInfo(treeInfo);
      }

    });
  }



  const getWindowList = async () => {
    chrome.storage.local.get(windowListKey, (result) => {
      var windowList = result[windowListKey];
      if (typeof (windowList) === "undefined" || windowList.length == 0) {
        setTreeInfo({
          treeData: [],
          expandedKeys: [],
          selectedKeys: [],
          pinned: []
        })
      } else {
        setWindowList(windowList);
        windowKeyRef.current = windowList[0];
        setWindowKeyHook(windowList[0]);
      }
    });
  }
  const storageHandler = (changes) => {
    let windowKey = windowKeyRef.current;
    for (var key in changes) {
      var newValue = changes[key].newValue;
      if (typeof(newValue) == "undefined") continue;
      if (key == windowKey && typeof (newValue) != "undefined") {
        if (!newValue.delete && !newValue.selected && !newValue.add && !newValue.pin && !newValue.newTab && !newValue.reload && !newValue.duplicate && !newValue.muted && !newValue.newPin && !newValue.sweeper && !newValue.menuOpened) setTreeInfo(newValue);

      } else if (key == windowKey && typeof (newValue) == "undefined") {
        //get windowList
        getWindowList();
      } else if (key == extensionName) {
        /*
        //////consolelog("here", newValue);
        if (newValue.user.email == "") {
          setAuth({
            loggedIn: false,
            displayName: ""
          });
        } else {
          setAuth({
            loggedIn: true,
            displayName: newValue.user.displayName
          });
        }*/
        setMainSettings(newValue);


      } else if (key == windowListKey) {
        //Check if the current key is inside
        ////consolelog(windowListKey, "is here")
        if (typeof (newValue) != "undefined") {
          setWindowList(newValue);
          var currentWindowActive = newValue.some(id => id === windowKey);
          if (!currentWindowActive) {
            //Reset windowkey
            getWindowList();
          }
        }

      } else if (key == historicalWindowListKey) {
        if (typeof(newValue) != "undefined") {
          setHistoricalWindowList(newValue);
        }
      }
    }
  }

  const saveData = (data) => {
    if (!data.delete && !data.selected && !data.add && !data.pin && !data.newTab && !data.reload && !data.duplicate && !data.muted && !data.newPin && !data.sweeper && !data.menuOpened) {
      setTreeInfo({
        treeData: data.treeData,
        expandedKeys: data.expandedKeys,
        pinned: treeInfo.pinned,
        selectedKeys: data.selectedKeys
      });
    }
    //////////consolelog(data)

    var windowKey = windowKeyHook;
    chrome.storage.local.set({ [windowKey]: data }, (callback) => {
      ////////////consolelog(`Saved ${JSON.stringify(data, null, 2)}`);
    });
  }




  /**
   * useEffect hooks
   */

  //window outer 320 inner 307
  var minimumWidth = 0
  if (window.outerWidth < minimumWidth) {
    window.resizeTo(minimumWidth, window.outerHeight);
    setSystemWidth(minimumWidth);
    window.location.reload();
  }

  useEffect(() => {
    if (timeLeft === 0) {
      saveData({
        treeData: treeInfo.treeData,
        expandedKeys: treeInfo.expandedKeys,
        selectedKeys: treeInfo.selectedKeys,
        pinned: treeInfo.pinned,
        sweeper: Math.random()
      })
      setTimeLeft(3)
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


  useEffect(() => {
    if (!windowKeyHook) return;
    getTreeInfo();
    fetchSettings();
  }, [windowKeyHook])

  useEffect(() => {
    intialise();
  }, []);

  useEffect(() => {
    if (typeof (historicalWindowList.length) == "undefined") getHistoricalWindowList();
  }, [historicalWindowList])








  useEffect(() => {
    if (windowList.length == 0) {
      intialise();
    }
  }, [windowList])



  useEffect(() => {
  }, [treeInfo]);



  function intialise() {
    getHistoricalWindowList();
    getWindowList();
    chrome.storage.onChanged.removeListener(storageHandler);
    chrome.storage.onChanged.addListener(storageHandler);
    setTimeLeft(5);
    function handleResize() {
      setSystemWidth(parseInt(window.innerWidth));
      window.location.reload();
    }
    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
  }


  //Create collect all windows into hook
  const onClickHandler = (link) => {
    chrome.tabs.create({ url: link });
  }

  const onAddWindow = () => {
    chrome.runtime.sendMessage({ type: "add_new_window" });
    setWindows(false);
  }
  const outerWidth = mainSettings.settings.system == "win" ? 340 : 320;
  const resizeToMinimum = () => {
    window.resizeTo(outerWidth, screen.height);
  }

  return (

    <IFrame
      id="treely_popup"
      //styleSheet={settingsActive ? [chrome.runtime.getURL("App.css")] : [chrome.runtime.getURL("Empty.css")]}
      styleSheet={[chrome.runtime.getURL("App.css")]}
      css={CSS(mainSettings.settings, false, settingsActive, windows, (query.length > 0))}
      style={"popup"}
    >
      {
        window.outerWidth < outerWidth ?
          <div style={styles.resizingBackground}>
            <div
              className={"text-base font-semibold"}
              style={styles.resizingText}
            >
              <h1> Current window width is {window.outerWidth}px, which is less than the minimal required application width ({outerWidth}px). <br /> Drag to resize or click <span className={"cursor-pointer text-blue-500"} onClick={() => { resizeToMinimum() }}>here</span> to auto-resize.</h1>
            </div>
          </div>

          :



          <Fragment>
            <Header
              page={page}
              setPage={setPage}
              mainSettings={mainSettings}
              setMainSettings={setMainSettings}
              setSettingsActive={setSettingsActive}
              settingsActive={settingsActive}
              windowList={windowList}
              setWindowKeyHook={setWindowKeyHook}
              windowKeyHook={windowKeyHook}
              windowKeyRef={windowKeyRef}
              windows={windows}
              setWindows={setWindows}
              inline={false}
              query={query}
              setQuery={setQuery}
            />
            {


              settingsActive ?
                <Fragment>
                  < ProfileHead
                    mainSettings={mainSettings}
                    setMainSettings={setMainSettings}
                  />
                  <Dashboard
                    page={page}
                    mainSettings={mainSettings}
                    setMainSettings={setMainSettings}
                  />
                </Fragment>

                :
                windowList.length == 0 ?
                  <div
                    id={"treely_windows"}
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <div
                      className="p-2 text-center cursor-pointer text-white hoverIcon"
                      onClick={onAddWindow}
                    >
                      <div className="py-16 max-w-sm transition duration-500">
                        <div className="space-y-10">
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            style={{
                              width: "128px",
                              height: "128px",
                              display: "inline"
                            }}
                          />
                          <div className="px-6 py-4">
                            <div className="space-y-5">
                              <p className="text-xl font-bold hoverIcon">
                                Start Browsing!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  :

                  windows ?
                    <Windows
                      windows={windows}
                      setWindows={setWindows}
                      mainSettings={mainSettings}
                      setMainSettings={setMainSettings}
                      windowList={windowList}
                      systemWidth={systemWidth}
                      windowKeyHook={windowKeyHook}
                      setWindowKeyHook={setWindowKeyHook}
                      windowKeyRef={windowKeyRef}
                      query={query}
                      setQuery={setQuery}
                      historicalWindowList={historicalWindowList}
                      savedWindowList={savedWindowList}
                    /> :
                    <AntTree
                      query={query}
                      treeInfo={treeInfo}
                      setTreeInfo={setTreeInfo}
                      disconnect={disconnect}
                      mainSettings={mainSettings}
                      setMainSettings={setMainSettings}
                      windowList={windowList}
                      setWindowList={setWindowList}
                      setWindowKeyHook={setWindowKeyHook}
                      windowKeyHook={windowKeyHook}
                      systemWidth={systemWidth}
                    />








            }





          </Fragment>





      }

    </IFrame >

  );
}

export default External;
