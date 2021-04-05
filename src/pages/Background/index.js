import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { v4 as uuidv4 } from 'uuid';
import Initialise from "./initialise";
import TabFunction from "./functions/tabFunction";
import { updateTab } from "./functions/tabFunction";
import {
  scriptInjection,
  injectIntoTab,
  windowListKey,
  storeData,
  windowPrefix,
  extensionName,
  randomIntFromInterval,
  alarmName,
  popupToInlineHandler,
  initialiseSettings,
  checkWindowSweeper,
  sweeperAlarmName,
  historicalWindowPrefix,
  historicalWindowListKey,
  injectHibernationTool
} from "./functions/generalFunction";


/***
 * New Index
 */


/**
 * Global variables
 */


var tabPrefix = "";
var globalDeleteItemKey = "";
var updated = false;
var selectedTabKey = "";
var activeSelectedKey = "";
var globalOpenerKey = "";
var globalRoutes = [];
var globalRecord = [];
var globalAppendTabToOpenerTabVerdict = false;
var globalAppendTabToDuplicateTabVerdict = false;
var globalFindTabVerdict = false;
var globalUpdatePinned = [];
var globalUpdateTabId = {};
var globalWindowTasks = {};
var globalRepairSelectedKey = "";
var globalRemoveOldTabs = [];
var globalPinned = "";
var indexingTabIds = [];
var indexingIndex = 0;
var SETTINGS = {};
var globalAlarmTabList = [];
var pauseTask = { pause: false, time: "" };
var generateCounter = 0;
var globalMovingIndicator = {};
var findTabWithTabIdVerdict = false;
var findTabWithTabIdResult = {};
var globalLoopingExpandedKeys = [];

/**
 * Initialisation
 */

//Initialise Analytic

/*

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-164573930-1', 'auto');
ga('set', 'checkProtocolTask', null); // Disables file protocol checking.
ga('send', 'pageview', '/background'); // Set page, avoiding rejection due to chrome-extension protocol
*/



const startup = () => {

  chrome.windows.getAll({
    populate: true
  }, function (chromeWindows) {
    var windowList = [];
    for (var i = 0; i < chromeWindows.length; i++) {
      let currentWindow = chromeWindows[i];
      let windowKey = windowPrefix + String(currentWindow.id);
      if (currentWindow.type === "normal") windowList.push(windowKey);
      //check if window exists
      getWindow(windowKey).then((retrievedWindow) => {
        if (typeof (retrievedWindow) == "undefined") {
          setWindowData(windowKey, currentWindow);
        } else {
          /*
          if (isEmpty(retrievedWindow) && (isEmpty(retrievedWindow.pinned) || isEmpty(retrievedWindow.treeData))) {
              setWindowData(windowKey, currentWindow);
          }*/

          let newWindowKey = historicalWindowPrefix + uuidv4();
          if (!isEmpty(retrievedWindow) && (!isEmpty(retrievedWindow.pinned) || !isEmpty(retrievedWindow.treeData))) {
            generateCounter = 0;
            generateNumber(retrievedWindow.treeData)
            generateCounter += retrievedWindow.pinned.length;
            retrievedWindow.tabCount = generateCounter;
            storeData(newWindowKey, retrievedWindow).then(() => {
              setWindowData(windowKey, currentWindow).then(() => {
                checkWindowSweeper();
              });
            })
          } else {
            setWindowData(windowKey, currentWindow);
          }

        }

      });


    }
    //consolelog(windowList);
    storeData(windowListKey, windowList, "startup - storeWindowList");
  })
}



const initialiseWindows = () => {
  startup();
  scriptInjection();

}

//Initialise SETTINGS variable
chrome.storage.local.get(extensionName, (storageResult) => {
  let extensionData = storageResult[extensionName];
  if (typeof (extensionData) == "undefined") {
    initialiseSettings();
  } else {
    SETTINGS = extensionData;
  }

});



chrome.runtime.onInstalled.addListener(() => {
  initialiseSettings();
  initialiseWindows();
  storageSweeper();
  /*
  chrome.windows.create({
    url: "https://gettreely.com/how-to-use",
    type: "normal"
  });*/
});

initialiseWindows();
new Initialise();
const tabFunction = new TabFunction();
initialiseOnAlarmListener();
checkAlarm();
checkWindowSweeper();
storageSweeper();

/*
chrome.sessions.getRecentlyClosed((callback) => {
    //console.log(callback)
})*/
/*
chrome.sessions.onChanged.addListener((callback) => {
    //console.log(callback);
});
*/



const setWindowData = async (windowKey, currentWindow) => {
  chrome.storage.local.get(windowKey, (result) => {
    var currentKey = windowKey;
    var windowInfo = result.currentKey;
    if (typeof (windowInfo) === "undefined") {
      var windowInfo = {
        treeData: [],
        expandedKeys: [],
        selectedKeys: [],
        pinned: []
      };
      for (var j = 0; j < currentWindow.tabs.length; j++) {
        var currentTab = currentWindow.tabs[j];
        var tabInfo = convertToTabData(currentTab);
        if (tabInfo.pinned) {
          if (windowInfo.pinned.length !== 0) {
            tabInfo.order = windowInfo.pinned.length
          }
          windowInfo.pinned.push(tabInfo);
        } else {
          windowInfo.treeData.push(tabInfo);
        }
        if (currentTab.active) windowInfo.selectedKeys = [tabInfo.key];
      }
      ////consolelog(`saved key: ${windowKey}, ${JSON.stringify(windowInfo)}`)
      ////consolelog(windowInfo);
      storeWindowData(currentKey, windowInfo);

    }
  });
}


chrome.storage.onChanged.addListener(
  (changes, namespace) => {
    for (var key in changes) {
      let storageChange = changes[key];
      let newValue = storageChange.newValue;
      let oldValue = storageChange.oldValue;

      switch (true) {
        case (key.includes(windowPrefix) && !key.includes("all") && !key.includes(historicalWindowListKey) && !key.includes(historicalWindowPrefix)):
          let windowId = parseInt(key.split(windowPrefix)[1]);
          if (typeof (newValue) != "undefined" && typeof (oldValue) != "undefined") {

            //Check the length of the tabs and whether there's 1 less tab than previous
            if ((newValue.menuOpened || newValue.sweeper)) {
              if (newValue.menuOpened) ga('send', 'event', 'menu_open');
              run("onMenuOpened", [key, newValue])
            } else {
              if (oldValue.delete && newValue.selected) {
                ////////consolelog("Duplicate commands");
              } else if (newValue.delete) {
                ga('send', 'event', 'action');
                tabFunction.deleteTabActionHandler(newValue);
              } else if (newValue.selected) {
                ga('send', 'event', 'action');
                selectedTabActionHandler(key, windowId, newValue);
              } else if (newValue.pin) {
                ga('send', 'event', 'action');
                tabFunction.pinActionHandler(newValue);
              } else if (newValue.newTab) {
                ga('send', 'event', 'action');
                chrome.tabs.create({ active: false, windowId: windowId });
              } else if (newValue.reload) {
                ga('send', 'event', 'action');
                tabFunction.reloadActionHandler(key, newValue);
              } else if (newValue.duplicate) {
                ga('send', 'event', 'action');
                tabFunction.duplicateActionHandler(newValue);
              } else if (newValue.muted) {
                ga('send', 'event', 'action');
                tabFunction.muteActionHandler(newValue);
              } else if (newValue.newPin) {
                ga('send', 'event', 'action');
                chrome.tabs.create({ active: false, pinned: true, windowId: windowId });
              } else if (newValue.dragged) {
                ga('send', 'event', 'tab_dragged');
                run("onMenuOpened", [key, newValue])
              } else {
                if (!isEmpty(oldValue.expandedKeys) && !isEmpty(newValue.expandedKeys)) {
                  tabFunction.defaultCaseHandler(oldValue, newValue);
                }
              }
            }

          }
          break;

        case (key == extensionName):
          checkAlarm();
          initialiseOnAlarmListener();
          //////console.log(newValue)
          if (typeof (newValue) == "undefined") {
            initialiseSettings();
            //ga('send', 'event', 'settings_undefined');

          } else if (!oldValue.settings.popup && newValue.settings.popup) {
            //////console.log("value switched")
            //ga('send', 'event', 'inline_to_popup');
            //scriptInjection();
            chrome.windows.create({
              url: "treely_external.html",
              type: "popup",
              left: randomIntFromInterval(0, 600),
              width: newValue.settings.system == "win" ? 340 : 320,
              height: screen.height
            });
          } else if (oldValue.settings.popup && !newValue.settings.popup) {
            //ga('send', 'event', 'popup_to_inline');
            popupToInlineHandler();
          }


          if (typeof (newValue) != "undefined" && typeof (oldValue) != "undefined") {
            SETTINGS = newValue;

            if (!oldValue.settings.snooze.active && newValue.settings.snooze.active) {
              //Snooze mode is on
              //Check if alarm exists, if not implement
              //Snooze mode settings update
              createAlarm(newValue.settings.snooze.time);
            }

            if (newValue.settings.snooze.active) {
              if (newValue.settings.snooze.time != oldValue.settings.snooze.time) {
                createAlarm(newValue.settings.snooze.time);
              } else {
                //Look over
                chrome.alarms.get(alarmName, (callback) => {
                  if (typeof (callback) === "undefined") {
                    createAlarm(newValue.settings.snooze.time);
                  }
                });
              }

            }

            if (oldValue.settings.snooze.active && !newValue.settings.snooze.active) {
              chrome.alarms.clear(alarmName, (confirmation) => {
                ////console.log(`alarm ${confirmation}`)
              })
            }


          }

          if (typeof (oldValue) == "undefined" && typeof (newValue) != "undefined") {
            SETTINGS = newValue;
            if (newValue.settings.snooze.active) {
              createAlarm(newValue.settings.snooze.time);
            }
          }
          break;


        default:
          break;

      }
    }
  });


/**
     * Message listener for communication with scripts
     */

chrome.runtime.onMessage.addListener(
  (msg, sender, sendResponse) => {
    //let tabId = sender.tab.id;
    if (msg.url) chrome.tabs.create({ url: msg.url });
    if (msg.refresh) {
      let windowId;
      if (msg.windowId) {
        windowId = parseInt(msg.windowId.split(windowPrefix)[1]);
      } else {
        windowId = sender.tab.windowId;
      }
      refreshWindow(windowId);
    } else if (msg.focusWindowId) {
      let windowId = parseInt(msg.focusWindowId);
      chrome.windows.update(windowId, {
        focused: true
      });
    } else if (msg.deleteWindowId) {
      let windowId = parseInt(msg.deleteWindowId);
      chrome.windows.remove(windowId);
    } else if (msg.addPopup) {
      chrome.storage.local.get(extensionName, (result) => {
        let extensionData = result[extensionName];
        if (extensionData.settings.popup) {
          chrome.windows.create({
            url: "treely_external.html",
            type: "popup",
            left: randomIntFromInterval(0, 600),
            width: extensionData.settings.system == "win" ? 340 : 320,
            height: screen.height
          });
        } else {
          extensionData.settings.popup = true;
          chrome.storage.local.set({ [extensionName]: extensionData }, function (result) {
          });
        }

      });
    } else if (msg.type == "treely_page_load") {
      //Get current authentication state and tell popup
      let user = firebase.auth().currentUser;
      if (user) {
        sendResponse({ type: "loggedIn" });
        chrome.storage.local.get(extensionName, (result) => {
          let extensionData = result[extensionName];
          extensionData.user.email = user.email;
          extensionData.user.displayName = user.displayName;
          extensionData.user.uid = user.uid;
          chrome.storage.local.set({ [extensionName]: extensionData }, function (result) {
          });
        });
      } else {
        //createPopupForAuthentication();
        sendResponse({ type: "loggedOut" });
      };
    } else if (msg.type == "treely_log_out") {
      //signOut();
      sendResponse({ type: "loggedOut" });

    } else if (msg.type == "add_new_window") {
      ga('send', 'event', 'popup_action');
      chrome.windows.create({
        width: screen.width,
        height: screen.height
      });
      chrome.storage.local.remove("add_new_window");
    } else if (msg.type == "add_new_application_window") {
      ga('send', 'event', 'popup_action');
      chrome.storage.local.get(extensionName, (result) => {
        let extensionData = result[extensionName];
        chrome.windows.create({
          url: "treely_external.html",
          type: "popup",
          left: randomIntFromInterval(300, 600),
          width: extensionData.settings.system == "win" ? 340 : 320,
          height: screen.height
        });
      });

    } else if (msg.type == "showtabs") {
      let windowId = parseInt(msg.windowId);
      chrome.windows.get(windowId, {
        populate: true
      }, (callback) => {
        ////console.log(callback);
      })

    } else if (msg.type == "reload_runtime") {
      chrome.runtime.reload();
    } else if (msg.type == "reload_script") {
      let tabId = sender.tab.id;
      injectIntoTab(tabId);
    } else if (msg.type == "add_new_tab") {
      ga('send', 'event', 'action');
      let windowKey = msg.windowKey;
      let windowId = parseInt(windowKey.split(windowPrefix)[1]);
      chrome.tabs.create({ active: true, windowId: windowId });
      chrome.windows.update(windowId, { focused: true });
    } else if (msg.type == "delete_window") {
      ga('send', 'event', 'action');
      let windowKey = msg.windowKey;
      let windowId = parseInt(windowKey.split(windowPrefix)[1]);
      chrome.windows.remove(windowId);

    } else if (msg.type == "switch_window") {
      ga('send', 'event', 'switch_window');
      let windowKey = msg.windowKey;
      let windowId = parseInt(windowKey.split(windowPrefix)[1]);
      chrome.windows.update(windowId, { focused: true });
    } else if (msg.type == "delete_window_historical") {
      ga('send', 'event', 'delete_window_historical');
      let windowKey = msg.windowKey;
      chrome.storage.local.remove(windowKey);
      checkWindowSweeper();
    } else if (msg.type == "recover_window") {
      ga('send', 'event', 'recover_window');
      let windowKey = msg.windowKey;
      //console.log(windowKey)
      getWindow(windowKey).then(treeInfo => {
        ////console.log(treeInfo)
        recoverHandler(treeInfo, windowKey);
      });



    }

  });










/*
const createPopupForAuthentication = (msgType) => {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    chrome.storage.local.get(extensionName, (storageResult) => {
      let extensionData = storageResult[extensionName];
      extensionData.user.email = user.email;
      extensionData.user.displayName = user.displayName;
      extensionData.user.uid = user.uid;
      chrome.storage.local.set({ [extensionName]: extensionData }, function (result) {
      });
    });
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    //////console.log(errorCode);
    //////console.log(errorMessage)
  });
}


const signOut = () => {
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    //////console.log("Signed out")
    chrome.storage.local.get(extensionName, (storageResult) => {
      let extensionData = storageResult[extensionName];
      extensionData.user.email = "";
      extensionData.user.displayName = "";
      extensionData.user.uid = "";
      chrome.storage.local.set({ [extensionName]: extensionData }, function (result) {
      });
    });
  }).catch(function (error) {
    // An error happened.
  });
}
*/
var globalRecoverTabs = [];
var globalRecoverCounter = 0;

const recoverHandler = (treeInfo, oldWindowKey) => {
  //Turn treeData into a list with pinned and check whether the url is empty
  let urlList = [];
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { url } = node;
      urlList.push(url);
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeInfo.pinned);
  generateList(treeInfo.treeData);
  pauseTask = { pause: true, time: new Date().getSeconds() };

  chrome.windows.create({
    url: urlList
  }, (callback) => {

    let newWindowKey = windowPrefix + callback.id;
    globalRecoverTabs = callback.tabs;
    globalRecoverCounter = 0;
    //Experiemnt

    for (var i = 0; i < treeInfo.pinned.length; i++) {
      treeInfo.pinned[i] = updateTab(treeInfo.pinned[i], globalRecoverTabs[globalRecoverCounter]);
      chrome.tabs.update(globalRecoverTabs[globalRecoverCounter].id, { pinned: true });
      globalRecoverCounter++;
    }
    updateTreeData(treeInfo.treeData).then((treeData) => {
      treeInfo.treeData = treeData;
      storeWindowData(newWindowKey, {
        treeData: treeInfo.treeData,
        expandedKeys: treeInfo.expandedKeys,
        selectedKeys: treeInfo.selectedKeys,
        pinned: treeInfo.pinned,
        lastModified: new Date().valueOf()
      }, true).then(() => {
        chrome.storage.local.remove(oldWindowKey, () => {
          checkWindowSweeper();
          pauseTask = { pause: false, time: new Date().getSeconds() };
        });

      });


    });


  })
}

const updateTreeData = async data => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].active) chrome.tabs.update(globalRecoverTabs[globalRecoverCounter].id, { active: true });
    data[i] = updateTab(data[i], globalRecoverTabs[globalRecoverCounter]);
    globalRecoverCounter++;
    if (data[i].children) {
      updateTreeData(data[i].children);
    }
  }
  return data;
};

const selectedTabActionHandler = (windowKey, windowId, newValue) => {
  //ga('send', 'event', 'selected_tab');
  var selectedKey = newValue.selected;
  var tabId = typeof (selectedKey) === "number" ? selectedKey : getTabId(newValue.treeData, selectedKey);
  try {
    chrome.tabs.update(tabId, {
      active: true
    }, () => {
      if (chrome.runtime.lastError) {
        clearTasks();
        run("onMenuOpened", [windowKey, newValue])

      }
    })
    chrome.windows.update(windowId,
      {
        focused: true
      }
    )
  } catch (error) {
    ////console.log(error);
  }
}

const getTabId = (itemArr, tabKey) => {
  var tabId;
  for (var i = 0; i < itemArr.length; i++) {
    if (itemArr[i].key == tabKey) {
      return parseInt(itemArr[i].tabId);
    } else {
      if (itemArr[i].children.length !== 0) {
        tabId = getTabId(itemArr[i].children, tabKey);
        if (tabId) return tabId;
      }
    }
  }
  return tabId;
}





/**
 *
 * Tab Listeners 1
 * Tab created
 */

chrome.tabs.onCreated.addListener(
  (callback) => {
    //////console.log("oncreated", callback)
    let windowKey = windowPrefix + String(callback.windowId);
    run("onTabCreated", [windowKey, callback]) //tab
    //////console.log("callback", callback);
  });


/**
 * Tab listener 2
 * Tab deleted
 */
chrome.tabs.onRemoved.addListener(
  (tabId, removeInfo) => {
    //////console.log(removeInfo)
    let windowKey = windowPrefix + String(removeInfo.windowId);
    run("onTabRemoved", [windowKey, removeInfo, tabId])
  });


/**
 * Tab listener 3
 *
 * Tab updated
 */

chrome.tabs.onUpdated.addListener(
  (tabId, changeInfo, tab) => {
    let windowKey = windowPrefix + String(tab.windowId);
    if (changeInfo.status != "unloaded") {
      run("onTabUpdated", [windowKey, tab, tabId, changeInfo.status])
    }
  });


/**
 * Tab listener 4
 *
 * Tab detached
 */

chrome.tabs.onDetached.addListener(
  (tabId, detachInfo) => {
    var windowKey = windowPrefix + String(detachInfo.oldWindowId);
    run("onTabDetached", [windowKey, tabId]);
  });



/**
* Tab listener 5
*
* Tab activated
*/


chrome.tabs.onActivated.addListener(
  (activeInfo) => {
    //////console.log(activeInfo)
    let tabId = activeInfo.tabId;
    let windowKey = windowPrefix + String(activeInfo.windowId);
    let windowId = parseInt(activeInfo.windowId);
    run("onTabActivated", [windowKey, windowId, tabId])


    //Get the current tab


  });


/**
 * Listener 6
 * Tab is replaced
 */



chrome.webNavigation.onTabReplaced.addListener((callback) => {
  //x////console.log(callback);
  let addedTabId = callback.tabId;
  let removedTabId = callback.replacedTabId;
  getTab(addedTabId).then((tab) => {
    let windowKey = windowPrefix + String(tab.windowId);
    run("onTabReplaced", [windowKey, addedTabId, removedTabId]);
  })
});

/**
 * Listener 7
 * Tab is replaced
 */
/*
chrome.tabs.onMoved.addListener(
    (tabId, moveInfo) => {
        if (globalMovingIndicator[parseInt(moveInfo.windowId)]) {
            return;
        }
        pauseTask = false;
        var windowKey = windowPrefix + String(moveInfo.windowId);
        run("onTabMoved", [windowKey, tabId, moveInfo])
    });
*/
/**
 * Window Listeners
 *
 */

chrome.windows.onCreated.addListener(
  (callback) => {
    checkWindowSweeper();

  }
)

chrome.windows.onRemoved.addListener(
  (callback) => {
    //Get all windows
    //If no popup window -> get started with inline mode
    ////console.log(callback)
    checkWindow(callback);
    windowCollectionHandler();


  });


/**
 *
 * Alarm Listener
 */



const discardHandler = (neverSuspendUnsavedInput, tab, pass) => {
  chrome.tabs.sendMessage(tab.id, { treely_page_check: true }, function (results) {
    try {
      ////console.log(results)
      if (neverSuspendUnsavedInput && results.unsavedFormInput) {
        //console.log("suspend unsaved input")
        pass = false;
      }
      //console.log(tab, pass);
      if (pass) chrome.tabs.discard(tab.id)
    } catch (e) {
      scriptInjection();
    }
  });

}


function initialiseOnAlarmListener() {
  chrome.alarms.onAlarm.removeListener(onAlarmHandler)
  chrome.alarms.onAlarm.addListener(onAlarmHandler)
}


const onAlarmHandler = (callback) => {
  let retrievedAlarmName = callback.name;
  if (retrievedAlarmName == alarmName) {
    //Retrieve settings
    chrome.storage.local.get(extensionName, (storageResult) => {
      let snooze = storageResult[extensionName].settings.snooze;
      let settings = storageResult[extensionName].settings;
      if (snooze.active) {
        /*
        active: true,
        time: 1,
        suspendPinned: false,
        suspendUnsavedInput: false,
        suspendAudio: false,
        suspendActive: true,
        suspendOffline: false,
        -> suspendPowerSource: false,
        suspendWhitelist: []
        */
        let neverSuspendPinned = snooze.neverSuspendPinned;
        let neverSuspendActive = snooze.neverSuspendActive;
        let neverSuspendAudio = snooze.neverSuspendAudio;
        let neverSuspendUnsavedInput = snooze.neverSuspendUnsavedInput;
        let neverSuspendOffline = snooze.neverSuspendOffline;
        let neverSuspendPowerSource = snooze.neverSuspendPowerSource;
        let neverSuspendWhitelist = snooze.neverSuspendWhitelist;
        chrome.windows.getAll({ populate: true }, (windows) => {
          windows.forEach((currentWindow, element) => {

            let currentTabs = currentWindow.tabs;
            // //console.log(currentTabs);
            for (var i = 0; i < currentTabs.length; i++) {
              let currentTab = currentTabs[i];
              var pass = true;
              ////console.log(currentTab);
              if (!currentTab.url.includes("treely_external")
                && !currentTab.url.includes("chrome://extensions/")
                && currentTab.status != "unloaded"
              ) {
                //console.log(currentTab.url)
                ////console.log(`never suspend pinned ${neverSuspendPinned}`)
                if (neverSuspendPinned && currentTab.pinned) {
                  //console.log("suspendpinned")
                  pass = false;
                }
                if (neverSuspendActive && currentTab.active) {
                  //console.log("suspend active")
                  pass = false;
                }
                if (neverSuspendAudio && currentTab.audible) {
                  //console.log("suspendaudio")
                  pass = false;
                }
                if (neverSuspendOffline && settings.idle) {
                  ////console.log("suspend idle")
                  pass = false;
                }
                if (neverSuspendPowerSource && settings.power) {
                  ////console.log("suspend power source")
                  pass = false;
                }
                for (var j = 0; j < neverSuspendWhitelist.length; j++) {
                  if (currentTab.url.includes(neverSuspendWhitelist[j])) {
                    //console.log(`${currentTab.url} url not passed`)
                    pass = false;
                  }
                }
                if (pass) discardHandler(neverSuspendUnsavedInput, currentTab, pass)
              }

            }
          });
        });


      } else {
        chrome.alarms.clear(alarmName, (confirmation) => {
          ////console.log(`alarm ${confirmation}`)
        });
      }

    });

  } else if (retrievedAlarmName == sweeperAlarmName) {
    storageSweeper();
  }
}


/***
 * Helper functions of the application
 */


const checkTask = (windowKey) => {
  delete globalWindowTasks[windowKey];
  if (!isEmpty(globalUpdateTabId)) {
    let globalUpdateTabIdFirstKey = Object.keys(globalUpdateTabId)[0];
    globalWindowTasks[globalUpdateTabIdFirstKey] = true;
    windowOperationHandler("onTabReplaced", [globalUpdateTabIdFirstKey]);
  }
}

const updateAWindow = (windowKey, windowInfo, removedTabId, addedTabId) => {
  //////console.log(windowKey,windowInfo,removedTabId, addedTabId)
  getTab(addedTabId).then((currentTab) => {
    updateTabIdWindow(windowInfo, currentTab, removedTabId, addedTabId).then((windowInfo) => {
      try {
        globalUpdateTabId[windowKey].shift();
        if (globalUpdateTabId[windowKey] === undefined || globalUpdateTabId[windowKey].length == 0) {
          delete globalUpdateTabId[windowKey]
          menuOpenHandler(windowInfo, windowKey);

          //check if run needs to be run again

        } else {
          let current = globalUpdateTabId[windowKey][0];
          let newRemovedTabId = current[1];
          let newAddedTabId = current[0];
          updateAWindow(windowKey, windowInfo, newRemovedTabId, newAddedTabId)

        }
      } catch (e) {
        globalUpdateTabId = {};
      }


    })

  });
}

const run = (operation, variables) => {
  let windowKey = variables[0];
  if (operation == "onTabReplaced") {
    let removedTabId = variables[2];
    let addedTabId = variables[1];
    if (globalUpdateTabId[windowKey]) {
      globalUpdateTabId[windowKey].push([addedTabId, removedTabId])
      return;
    } else {
      globalUpdateTabId[windowKey] = [[addedTabId, removedTabId]];
    }
  } else if (pauseTask.pause) {
    if (Math.abs(new Date().getSeconds - pauseTask.time) > 2) {
      console.log(Math.abs(new Date().getSeconds - pauseTask.time), new Date().getSeconds, pauseTask.time);
      pauseTask = { pause: false, time: new Date().getSeconds() };
    } else {
      return;
    }
  }

  if (globalWindowTasks[windowKey]) return;
  globalWindowTasks[windowKey] = true;
  //////console.log(operation, variables)
  let tab;
  let tabId;
  let windowId;
  let windowInfo;
  switch (operation) {
    case "onTabMoved":
      tabId = variables[1];
      let moveInfo = variables[2];
      windowOperationHandler(operation, [windowKey, tabId, moveInfo]);
      break;
    case "onMenuOpened":
      windowInfo = variables[1];
      windowId = variables[2];
      windowOperationHandler(operation, [windowKey, windowId, windowInfo]);
      break;
    case "onTabActivated":
      tabId = variables[2];
      windowId = variables[1];
      windowOperationHandler(operation, [windowKey, windowId, tabId]);
      break;
    case "onTabDetached":
      tabId = variables[1];
      windowOperationHandler(operation, [windowKey, tabId]);
      break;
    //4
    case "onTabReplaced":
      windowOperationHandler(operation, [windowKey]);
      break;
    case "onTabCreated":
      tab = variables[1];
      //////console.log(`Tab is here`, tab);
      windowOperationHandler(operation, [windowKey, tab]);
      break;
    case "onTabRemoved":
      let removedInfo = variables[1];
      tabId = variables[2];
      windowOperationHandler(operation, [windowKey, removedInfo, tabId])
      break;
    case "onTabUpdated":
      tab = variables[1];
      tabId = variables[2];
      let status = variables[3];
      //////console.log(windowKey, tab, tabId, status)
      windowOperationHandler(operation, [windowKey, tab, tabId, status]);
      break;
    default:
      checkTask(windowKey);
      break;
  }
}

const clearTasks = () => {
  globalWindowTasks = {}
}


const windowOperationHandler = (operation, variables) => {
  //................................
  // when all done:
  let windowKey = variables[0];
  let tab;
  let tabId;
  let status;
  switch (operation) {
    case "onTabMoved":
      try {
        tabId = variables[1];
        let moveInfo = variables[2];
        //console.log(tabId, moveInfo, windowKey)
        onMovedHandler(windowKey, tabId, moveInfo);

      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    case "onMenuOpened":
      try {
        let windowInfo = variables[2];
        let windowId = parseInt(variables[1]);
        menuOpenHandler(windowInfo, windowKey);
      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    case "onTabActivated":
      try {
        tabId = variables[2];
        let windowId = variables[1];
        onActivatedHandler(windowKey, windowId, tabId)
      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    case "onTabDetached":
      try {
        tabId = variables[1];
        removeTabFromStorage(windowKey, tabId);
      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    case "onTabUpdated":
      try {
        tab = variables[1];
        tabId = variables[2];
        status = variables[3];
        updateWindow(windowKey, tab, tabId, status);
      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    case "onTabReplaced":
      try {
        if (globalUpdateTabId[windowKey]) {
          let current = globalUpdateTabId[windowKey][0];
          let removedTabId = current[1];
          let addedTabId = current[0];
          //////console.log(`removed`, removedTabId, addedTabId)
          getWindow(windowKey).then((windowInfo) => {
            updateAWindow(windowKey, windowInfo, removedTabId, addedTabId);
          })
        }
      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    case "onTabCreated":
      try {
        tab = variables[1];
        getWindow(windowKey).then((windowInfo) => {
          onCreatedHandler(windowInfo, windowKey, tab);
        });
      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    case "onTabRemoved":
      try {
        let removeInfo = variables[1];
        tabId = variables[2];
        // window is closing, remove window and all the tab storage
        onRemovedHandler(windowKey, removeInfo, tabId);
      } catch (error) {
        ga('send', 'event', 'errorCaught');
        clearTasks();
      }
      break;
    default:
      break;

  }

};


const onMovedHandler = (windowKey, tabId, moveInfo) => {
  getWindow(windowKey).then((windowInfo) => {
    //Swap the two indexes
    //console.log(windowInfo)
    getTab(tabId).then((tab) => {
      if (tab.pinned) {
        reorderList(windowInfo, moveInfo.fromIndex, moveInfo.toIndex, windowKey).then(() => {
          checkTask(windowKey);
        });
      } else {
        //console.log("not pinned");
        //console.log(moveInfo.toIndex, moveInfo.fromIndex)
        swapTab(windowInfo, moveInfo.toIndex, moveInfo.fromIndex, windowKey).then(() => {
          checkTask(windowKey);
        });
      }
    })
  })

}


const reorderList = async (windowInfo, sourceIndex, destinationIndex, windowKey) => {
  //console.log(sourceIndex, destinationIndex)
  //console.log(windowInfo)
  let list = windowInfo.pinned;
  if (destinationIndex === 0) {
    list[sourceIndex].order = list[0].order - 1;
  } else if (destinationIndex === list.length - 1) {
    list[sourceIndex].order = list[list.length - 1].order + 1;
  } else if (destinationIndex < sourceIndex) {
    list[sourceIndex].order = (list[destinationIndex].order + list[destinationIndex - 1].order) / 2;
  } else {
    list[sourceIndex].order = (list[destinationIndex].order + list[destinationIndex + 1].order) / 2;
  }
  storeData(windowKey, {
    treeData: windowInfo.treeData,
    expandedKeys: windowInfo.expandedKeys,
    selectedKeys: windowInfo.selectedKeys,
    pinned: sort(list)
  }, "onMoved")
}


function sort(list) {
  return list.slice().sort((first, second) => first.order - second.order);
}




const findTabWithIndex = async (itemArr, index) => {
  if (!findTabWithTabIdVerdict) {
    for (var i = 0; i < itemArr.length; i++) {
      if (itemArr[i].index == index) {
        findTabWithTabIdVerdict = true;
        findTabWithTabIdResult = itemArr[i];
      } else {
        if (!isEmpty(itemArr[i].children)) {
          findTabWithIndex(itemArr[i].children, index);
        }
      }
    }
  }

}


const swapTab = async (windowInfo, toIndex, fromIndex, windowKey) => {
  //Find the newIndex
  //Find the toIndex tabId
  findTabWithTabIdVerdict = false;
  findTabWithTabIdResult = {};
  let pinnedLength = windowInfo.pinned.length;
  toIndex -= pinnedLength;
  fromIndex -= pinnedLength;


  //toIndex -> New position
  //TabId -> old position
  let treeDataCopy = JSON.parse(JSON.stringify(windowInfo.treeData));
  findTabWithIndex(treeDataCopy, fromIndex).then(() => {
    let fromIndexTab = JSON.parse(JSON.stringify(findTabWithTabIdResult));
    fromIndexTab.index = toIndex;
    findTabWithTabIdVerdict = false;
    findTabWithTabIdResult = {};
    treeDataCopy = JSON.parse(JSON.stringify(windowInfo.treeData));
    findTabWithIndex(treeDataCopy, toIndex).then(() => {
      let toIndexTab = JSON.parse(JSON.stringify(findTabWithTabIdResult));
      toIndexTab.index = fromIndex;
      //console.log(windowInfo.treeData);
      swap(windowInfo.treeData, fromIndexTab).then((treeData) => {
        //console.log(treeData);
        swap(treeData, toIndexTab).then((treeData) => {
          //console.log(treeData)
          storeData(windowKey, {
            treeData: treeData,
            expandedKeys: windowInfo.expandedKeys,
            selectedKeys: windowInfo.selectedKeys,
            pinned: windowInfo.pinned
          }, "onMoved")
        })


      });
    });
  })

  //Find the two objects based on their index



  //Do the swap

};



const updateTabWithTabObject = (oldTab, newTab) => {
  oldTab.title = newTab.title;
  oldTab.active = newTab.active;
  oldTab.status = newTab.status;
  oldTab.tabId = newTab.tabId;
  oldTab.pinned = newTab.pinned;
  oldTab.muted = newTab.mutedInfo ? newTab.mutedInfo.muted : newTab.muted;
  oldTab.audible = newTab.audible;
  oldTab.favIconUrl = newTab.favIconUrl;
  oldTab.url = newTab.url;
  return oldTab;

}


const swap = async (itemArr, tab) => {

  for (var i = 0; i < itemArr.length; i++) {
    if (itemArr[i].index == tab.index) {
      itemArr[i] = updateTabWithTabObject(itemArr[i], tab);
    } else {
      if (!isEmpty(itemArr[i].children)) swap(itemArr[i].children, tab)

    }
  }
  return itemArr;
}





const onActivatedHandler = (windowKey, windowId, tabId) => {
  getTab(tabId).then((tab) => {
    getBrowsingWindow(windowId).then((result) => {
      if (result.type != "popup") {
        //////console.log("injected")
        injectIntoTab(tabId, false);
      }
    });
    getWindow(windowKey).then((windowInfo) => {
      if (typeof (windowInfo) == "undefined") {
        createWindow(tab, windowKey, "onActivated - undefined");
        windowCollectionHandler();
        checkTask(windowKey);
      } else {
        if (tab.pinned) {
          //Add to pinned
          //Check if it's in pinned
          var inPin = windowInfo.pinned.some(item => item.tabId === tab.id);
          if (!inPin) {
            var tabInfo = convertToTabData(tab);
            if (windowInfo.pinned.length !== 0) {
              tabInfo.order = windowInfo.length;
            }
            windowInfo.pinned.push(tabInfo);
            menuOpenHandler({
              treeData: windowInfo.treeData,
              expandedKeys: windowInfo.expandedKeys,
              selectedKeys: [],
              pinned: windowInfo.pinned
            }, windowKey)
          } else {
            for (var i = 0; i < windowInfo.pinned.length; i++) {
              if (windowInfo.pinned[i].tabId == tabId) {
                windowInfo.pinned[i] = updateTab(windowInfo.pinned[i], tab)
              } else {
                windowInfo.pinned[i].active = false
              }
            }
            menuOpenHandler({
              treeData: windowInfo.treeData,
              expandedKeys: windowInfo.expandedKeys,
              selectedKeys: [],
              pinned: windowInfo.pinned
            }, windowKey);

          }

        } else {
          if (windowInfo.duplicate) {
            var tabInfo = convertToTabData(tab);
            var key = windowInfo.duplicate.key;
            globalAppendTabToDuplicateTabVerdict = false;
            appendTabToDuplicateTab(windowInfo.treeData, key, tabInfo).then((treeData) => {
              menuOpenHandler({
                treeData: treeData,
                expandedKeys: windowInfo.expandedKeys,
                selectedKeys: [tabInfo.key],
                pinned: windowInfo.pinned
              }, windowKey);

            })

          } else {
            selectedTabKey = "";
            globalFindTabVerdict = false;
            findTab(windowInfo.treeData, tabId).then(() => {
              //Active tab attached into window
              if (selectedTabKey == "") {
                var tabInfo = convertToTabData(tab);
                windowInfo.treeData.push(tabInfo);
                windowInfo.selectedKeys = [tabInfo.key];
              } else {
                windowInfo.selectedKeys = [selectedTabKey];
              }
              openAllTabsToActive(windowInfo, windowInfo.selectedKeys[0], windowKey);
            });
          }
        }

      }
    });
  });
}

const getSpecificWindow = (windowKey, windowId) => {
  return new Promise(function (resolve, reject) {
    try {
      chrome.windows.get(windowId, {
        populate: true
      }, (result) => {
        if (chrome.runtime.lastError) {
          checkTask(windowKey)
          //chrome.storage.local.remove(windowKey);
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.tabs);
        }
      })
    } catch (error) {
      checkTask(windowKey)
      reject(error)
    }
  })
}


const onRemovedHandler = (windowKey, removeInfo, tabId) => {
  let isWindowClosing = removeInfo.isWindowClosing;
  if (isWindowClosing) {
    //removeWindow(windowKey);
    checkTask(windowKey);
  } else {
    removeTabFromStorage(windowKey, tabId);
  }
}



const removeWindow = (windowKey) => {
  chrome.storage.local.remove(windowKey, () => {
    ////////////consolelog(`Removed all tabs from storage`);
    getWindow(windowListKey).then((windowList) => {
      var windowCollection = windowList.filter(item => item !== windowKey);
      storeData(windowListKey, windowCollection);
    });
  });
}

const onCreatedHandler = (windowInfo, windowKey, tab) => {
  //Retrieve the window
  let windowId = tab.windowId;
  if (typeof (windowInfo) == "undefined") {
    createWindow(tab, windowKey, "onCreated - undefined");
    checkTask(windowKey);
  } else {
    //Check if child if so append
    var tabInfo = convertToTabData(tab);
    //////////consolelog(`openerID ${callback.openerTabId}`)
    if (!windowInfo.duplicate) {
      //New tab action handling procedure
      if (windowInfo.newTab) {
        var key = windowInfo.newTab.key;
        globalAppendTabToOpenerTabVerdict = false;
        appendTabToOpenerTab(windowInfo.treeData, key, tabInfo, 0, "key").then((treeData) => {
          windowInfo.expandedKeys.push(key);
          menuOpenHandler({
            treeData: treeData,
            expandedKeys: windowInfo.expandedKeys,
            selectedKeys: windowInfo.selectedKeys,
            pinned: windowInfo.pinned
          }, windowKey);
        })
        //Append a child new tab
      } else if (tab.openerTabId) {
        var openerTabId = tab.openerTabId;
        globalAppendTabToOpenerTabVerdict = false;
        appendTabToOpenerTab(windowInfo.treeData, openerTabId, tabInfo, 0, "id").then((treeData) => {
          windowInfo.expandedKeys.push(globalOpenerKey);
          menuOpenHandler({
            treeData: treeData,
            expandedKeys: windowInfo.expandedKeys,
            selectedKeys: windowInfo.selectedKeys,
            pinned: windowInfo.pinned
          }, windowKey);
        });
        //Normal new tab
      } else {
        //////console.log("here 2")
        windowInfo.treeData.push(tabInfo);
        menuOpenHandler({
          treeData: windowInfo.treeData,
          expandedKeys: windowInfo.expandedKeys,
          selectedKeys: windowInfo.selectedKeys,
          pinned: windowInfo.pinned
        }, windowKey);

      }
    } else {
      var tabInfo = convertToTabData(tab);
      var key = windowInfo.duplicate.key;
      globalAppendTabToDuplicateTabVerdict = false;
      appendTabToDuplicateTab(windowInfo.treeData, key, tabInfo).then((treeData) => {
        menuOpenHandler({
          treeData: treeData,
          expandedKeys: windowInfo.expandedKeys,
          selectedKeys: [tabInfo.key],
          pinned: windowInfo.pinned
        }, windowKey);

      })
    }
  }
}


const storeWindowData = async (key, windowInfo, closingDate) => {
  if (closingDate) {
    //console.log(windowInfo)
    storeData(key, windowInfo);
  } else {
    indexingTabIds = [];
    indexingIndex = 0;
    globalLoopingExpandedKeys = windowInfo.expandedKeys;
    looping(windowInfo.treeData).then((treeData) => {
      looping(windowInfo.pinned).then((pinned) => {
        let windowId = parseInt(key.split(windowPrefix)[1]);
        //console.log(windowId);
        //globalMovingIndicator[windowId] = true;
        chrome.tabs.move(indexingTabIds, { index: 0 }, () => {
          if (chrome.runtime.lastError) {
            clearTasks();
            run("onMenuOpened", [key, {
              treeData: treeData,
              expandedKeys: windowInfo.expandedKeys,
              selectedKeys: windowInfo.selectedKeys,
              pinned: pinned
            }])
            /*
            setTimeout(() => {
                delete globalMovingIndicator[windowId]
            }, 2000);*/

          } else {
            chrome.storage.local.set({
              [key]: {
                treeData: treeData,
                expandedKeys: globalLoopingExpandedKeys,
                selectedKeys: windowInfo.selectedKeys,
                pinned: pinned,
                lastModified: new Date().valueOf()
              }
            }, () => {
              /*
              setTimeout(() => {
                  delete globalMovingIndicator[windowId]
              }, 2000);*/
            });
          }
        });


      });
    })
  }


};


const windowCollectionHandler = () => {
  chrome.windows.getAll((windows) => {
    let windowIds = JSON.parse(JSON.stringify(windows)).filter(({ type }) => type === 'normal').map(function (singleWindow) { return (windowPrefix + singleWindow.id); });
    storeData(windowListKey, windowIds)
  });
  /*
  getBrowsingWindow(windowId).then((windowCallback) => {
      if (windowCallback.type === "normal") {
          getWindow(windowListKey).then((result) => {
              var inWindowCollection = result.some(item => item === windowKey);
              if (!inWindowCollection) {
                  result.push(windowKey);
                  //console.log(result)
                  storeData(windowListKey, result)
              } else {
                  //console.log(result)
              }
          })
      }

  })*/
}

const getBrowsingWindow = (windowId) => {
  return new Promise(function (resolve, reject) {
    try {
      chrome.windows.get(windowId, (result) => {
        if (chrome.runtime.lastError) {
          ////console.log("getbrowsingwindow last error")
          reject(chrome.runtime.lastError)
        }
        else resolve(result);
      })
    } catch (error) {
      reject(error)
    }
  })
}


const checkBrowsingWindow = (windowId) => {
  return new Promise(function (resolve, reject) {
    try {
      chrome.windows.get(windowId, (result) => {
        //console.log(result)
        if (chrome.runtime.lastError) {
          ////console.log("getbrowsingwindow last error")
          resolve(false);
        } else {
          resolve(true);
        }
      })
    } catch (error) {
      resolve(false)
    }
  })
}



const getTab = (tabId) => {
  return new Promise(function (resolve, reject) {
    try {
      chrome.tabs.get(tabId, function (result) {
        if (chrome.runtime.lastError) {
          ////console.log("here xo")
          reject(chrome.runtime.lastError)
        }
        else resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}







const updateTabIdWindow = (windowInfo, currentTab, removedTabId, addedTabId) => {
  return new Promise(function (resolve, reject) {
    try {
      let returnWindowInfo;
      if (windowInfo.pinned.length !== 0) {
        globalUpdatePinned = JSON.parse(JSON.stringify(windowInfo.pinned));
      } else {
        globalUpdatePinned = [];
      }
      //Two routes
      //Check if pinned
      if (currentTab.pinned) {
        for (var i = 0; i < globalUpdatePinned.length; i++) {
          if (globalUpdatePinned[i].tabId == removedTabId) {
            globalUpdatePinned[i].tabId = addedTabId;
          }
        }
        returnWindowInfo = {
          treeData: windowInfo.treeData,
          expandedKeys: windowInfo.expandedKeys,
          selectedKeys: windowInfo.selectedKeys,
          pinned: globalUpdatePinned
        };
        return resolve(returnWindowInfo)
      } else {
        updated = false;
        //Check if it's in pinned, if so remove
        findAndUpdateTabId(windowInfo.treeData, removedTabId, addedTabId).then((treeData) => {
          returnWindowInfo = {
            treeData: treeData,
            expandedKeys: windowInfo.expandedKeys,
            selectedKeys: windowInfo.selectedKeys,
            pinned: windowInfo.pinned
          };
          return resolve(returnWindowInfo)
        });
      }
    } catch (error) {
      reject(error)
    };

  });
}

const getWindow = (windowKey) => {
  return new Promise(function (resolve, reject) {
    try {
      chrome.storage.local.get(windowKey, function (result) {
        if (chrome.runtime.lastError) {
          ////console.log("getWindow Error")
          reject(chrome.runtime.lastError)
        }
        else resolve(result[windowKey])
      })
    } catch (error) {
      reject(error)
    }
  })

}



/**
 * Window listener
 */


const generateNumber = data => {
  for (let i = 0; i < data.length; i++) {
    generateCounter++;
    const node = data[i];
    if (node.children) {
      generateNumber(node.children);
    }
  }
};

const checkWindow = (windowId) => {
  //Check every every current window
  //If it's popupup -> check if its in the list -> if yes add
  //Check every window list to see if the window exists
  pauseTask = { pause: true, time: new Date().getSeconds() };
  let windowKey = windowPrefix + String(windowId);
  getWindow(windowKey).then((retrievedWindow) => {
    if (typeof (retrievedWindow) != 'undefined') {
      ////console.log(retrievedWindow);
      if (retrievedWindow.treeData.length == 1 && retrievedWindow.treeData[0].url.includes("treely_external")) {
        chrome.storage.local.remove(windowKey);
        pauseTask = { pause: false, time: new Date().getSeconds() };
      } else {
        generateCounter = 0;
        generateNumber(retrievedWindow.treeData)
        generateCounter += retrievedWindow.pinned.length;
        retrievedWindow.tabCount = generateCounter;
        let newWindowKey = historicalWindowPrefix + uuidv4();
        storeWindowData(newWindowKey, retrievedWindow, true).then(() => {
          chrome.storage.local.remove(windowKey);
          pauseTask = { pause: false, time: new Date().getSeconds() };
          checkWindowSweeper();
        })
      }

    } else {
      pauseTask = { pause: false, time: new Date().getSeconds() };
    }


  })

}


/**
 * Helper functions
 */



const purge = () => {
  chrome.storage.sync.clear(() => {
    //////////////consolelog("Local Cleared");
    var error = chrome.runtime.lastError;
    if (error) {
      //consoleerror(error);
    }
  });
  chrome.storage.local.clear(() => {
    //console.log("Local Cleared");
    var error = chrome.runtime.lastError;
    if (error) {
      //consoleerror(error);
    }
  });
}

//purge();

/**
 * Tab helper functions
 */

//migrated
const convertToTabData = (tab) => {
  var tabData = {};
  tabData = {
    key: uuidv4(),
    title: tab.title,
    active: tab.active,
    status: tab.status,
    favIconUrl: tab.favIconUrl,
    children: [],
    tabId: tab.id,
    url: tab.url,
    pinned: tab.pinned,
    muted: tab.mutedInfo.muted,
    audible: tab.audible
  };
  return tabData;
}


const removeTabFromStorage = (windowKey, tabId) => {
  //Get the window data of the tab
  getWindow(windowKey).then((windowInfo) => {
    globalDeleteItemKey = "";
    deleteTab(windowInfo.treeData, tabId).then((windowData) => {
      let expandedKeys = windowInfo.expandedKeys.filter((key) => {
        return key != globalDeleteItemKey;
      });
      let pinned = windowInfo.pinned.filter((item) => {
        return item.tabId != tabId;
      });
      if (isEmpty(windowData) && isEmpty(pinned)) {
        removeWindow(windowKey);
        checkTask(windowKey);
      } else {
        menuOpenHandler({
          treeData: windowData,
          expandedKeys: expandedKeys,
          selectedKeys: windowInfo.selectedKeys,
          pinned: pinned
        }, windowKey);
      }

    });

  })
}


/**
 * Window helper functions
 */



const createWindow = (tab, windowKey, type) => {
  var tabInfo = convertToTabData(tab);
  menuOpenHandler(
    {
      treeData: [tabInfo],
      expandedKeys: [],
      selectedKeys: [tabInfo.key],
      pinned: []
    }, windowKey)

}




const updateWindow = (windowKey, tab, tabId, loadingStatus) => {
  //////console.log(windowKey, tab, tabId, loadingStatus)
  if (tab.active && loadingStatus == "complete") {
    getBrowsingWindow(tab.windowId).then((result) => {
      if (result.type != "popup") injectIntoTab(tabId, false);
    })
  }
  //Retrieve the window
  getWindow(windowKey).then((windowInfo) => {
    //////consolelog(`update ${JSON.stringify(windowInfo, null, 2)}`);
    if (typeof (windowInfo) == "undefined") {
      createWindow(tab, windowKey, "updateWindow - undefined");
      checkTask(windowKey);
    } else {
      if (!windowInfo.newTab && !windowInfo.duplicate) {
        //Find and update the object in the window
        if (windowInfo.pinned.length !== 0) {
          globalUpdatePinned = JSON.parse(JSON.stringify(windowInfo.pinned));
        } else {
          globalUpdatePinned = [];
        }
        //Two routes
        let inPin;
        //Check if pinned
        inPin = globalUpdatePinned.some(item => item.tabId === tab.id);
        if (tab.pinned) {
          //Check if it's in pinned, if not append
          if (inPin) {
            for (var i = 0; i < globalUpdatePinned.length; i++) {
              if (globalUpdatePinned[i].tabId == tabId) globalUpdatePinned[i] = updateTab(globalUpdatePinned[i], tab);
            }
            deleteTab(windowInfo.treeData, tab.id).then((treeData) => {
              menuOpenHandler({
                treeData: treeData,
                expandedKeys: windowInfo.expandedKeys,
                selectedKeys: windowInfo.selectedKeys,
                pinned: globalUpdatePinned
              }, windowKey);
            });
          } else {
            let tabData = convertToTabData(tab);
            if (globalUpdatePinned !== 0) tabData.order = globalUpdatePinned.length;
            globalUpdatePinned.push(tabData);
            deleteTab(windowInfo.treeData, tab.id).then((treeData) => {
              menuOpenHandler({
                treeData: treeData,
                expandedKeys: windowInfo.expandedKeys,
                selectedKeys: windowInfo.selectedKeys,
                pinned: globalUpdatePinned
              }, windowKey);
            });

          }

          //Not pinned
        } else {
          updated = false;
          //Check if it's in pinned, if so remove
          if (inPin) {
            windowInfo.pinned = windowInfo.pinned.filter((item) => {
              return item.tabId != tabId;
            });
            var tabData = convertToTabData(tab);
            if (tabData.active) windowInfo.selectedKeys = [tabData.key]
            windowInfo.treeData.push(tabData);
            menuOpenHandler({
              treeData: windowInfo.treeData,
              expandedKeys: windowInfo.expandedKeys,
              selectedKeys: windowInfo.selectedKeys,
              pinned: windowInfo.pinned
            }, windowKey);
          } else {
            findAndUpdateTab(windowInfo.treeData, tab).then((treeData) => {
              if (tab.active) windowInfo.selectedKeys = [activeSelectedKey];
              if (updated) {
                //////console.log("updated")
                windowInfo.treeData = treeData;
                menuOpenHandler({
                  treeData: windowInfo.treeData,
                  expandedKeys: windowInfo.expandedKeys,
                  selectedKeys: windowInfo.selectedKeys,
                  pinned: windowInfo.pinned
                }, windowKey);
              } else {
                let tabInfo = convertToTabData(tab);
                windowInfo.treeData.push(tabInfo);
                menuOpenHandler({
                  treeData: windowInfo.treeData,
                  expandedKeys: windowInfo.expandedKeys,
                  selectedKeys: windowInfo.selectedKeys,
                  pinned: windowInfo.pinned
                }, windowKey);
              }
            });

          }


        }
      } else {
        checkTask(windowKey);
      }


    }

  })
}







const appendTabToOpenerTab = async (itemArr, input, tabInfo, currentDepth, typeOfInput) => {
  var newDepth = currentDepth + 1;
  if (!globalAppendTabToOpenerTabVerdict) {
    for (var i = 0; i < itemArr.length; i++) {
      if (typeOfInput == "key") {
        if (itemArr[i].key == input) {
          if (newDepth < 11) {
            itemArr[i].children.push(tabInfo);
            globalAppendTabToOpenerTabVerdict = true;
          } else {
            itemArr.push(tabInfo);
            globalAppendTabToOpenerTabVerdict = true;
          }

        } else {
          if (itemArr[i].children.length !== 0) appendTabToOpenerTab(itemArr[i].children, input, tabInfo, newDepth, typeOfInput);
        }
      } else {
        if (itemArr[i].tabId == input) {
          globalOpenerKey = itemArr[i].key;
          if (newDepth < 11) {
            itemArr[i].children.push(tabInfo);
          } else {
            itemArr.push(tabInfo);
          }

        } else {
          if (itemArr[i].children !== 0) appendTabToOpenerTab(itemArr[i].children, input, tabInfo, newDepth, typeOfInput);
        }
      }
    }
  }

  return itemArr;
}





const appendTabToDuplicateTab = async (itemArr, key, tabInfo) => {
  if (!globalAppendTabToDuplicateTabVerdict) {
    for (var i = 0; i < itemArr.length; i++) {
      if (itemArr[i].key == key) {
        itemArr.push(tabInfo);
        globalAppendTabToDuplicateTabVerdict = true;
      } else {
        if (itemArr[i].children) {
          appendTabToDuplicateTab(itemArr[i].children, key, tabInfo);
        }
      }
    }
  }

  return itemArr;
}

const findTab = async (itemArr, tabId) => {
  if (!globalFindTabVerdict) {
    for (var i = 0; i < itemArr.length; i++) {
      if (itemArr[i].tabId == tabId) {
        selectedTabKey = itemArr[i].key;
        globalFindTabVerdict = true;
      } else {
        if (!isEmpty(itemArr[i].children)) {
          findTab(itemArr[i].children, tabId);
        }
      }
    }
  }
}

//migrated


const findAndUpdateTabId = async (itemArr, oldTabId, newTabId) => {
  if (!updated) {
    for (var i = 0; i < itemArr.length; i++) {
      if (itemArr[i].tabId == oldTabId && !updated) {
        itemArr[i].tabId = newTabId
        updated = true;
      } else {
        if (itemArr[i].children.length !== 0 && !updated) {
          findAndUpdateTabId(itemArr[i].children, oldTabId, newTabId);
        }
      }
    }
  }

  return itemArr;

}


const findAndUpdateTab = async (itemArr, tab) => {
  if (!updated) {
    for (var i = 0; i < itemArr.length; i++) {
      if (itemArr[i].tabId == tab.id && !updated) {
        itemArr[i] = updateTab(itemArr[i], tab);
        if (tab.active) activeSelectedKey = itemArr[i].key;
        updated = true;
      } else {
        if (itemArr[i].children.length !== 0 && !updated) {
          findAndUpdateTab(itemArr[i].children, tab);
        }
      }

    }
  }
  return itemArr;
}

const createAlarm = (time) => {
  //console.log(time)
  time = parseInt(time);
  initialiseOnAlarmListener();
  //////console.log(time);
  chrome.alarms.clear(alarmName, (confirmation) => {
    //////console.log(`alarm ${confirmation}`)
  })
  if (time != "never") {
    chrome.alarms.create(alarmName, {
      delayInMinutes: (time / 60),
      periodInMinutes: (time / 60)
    })

  }

}


function checkAlarm() {
  chrome.alarms.getAll((allAlarms) => {
    //console.log(allAlarms)
    chrome.storage.local.get(extensionName, (storageResult) => {
      let extensionData = storageResult[extensionName];
      if (typeof (extensionData) == "undefined") {
        initialiseSettings();
      } else {
        let hibernation = true;
        if (extensionData.settings.snooze.active) {
          hibernation = false;
        }
        let sweeper = false
        for (var alarm in allAlarms) {
          if (alarm.name == alarmName) {
            hibernation = true;
          } else if (alarm.name == sweeperAlarmName) {
            sweeper = true;
          }
        }

        if (!hibernation) {
          createAlarm(extensionData.settings.snooze.time)
        }
        if (!sweeper) {
          chrome.alarms.clear(sweeperAlarmName);
          chrome.alarms.create(sweeperAlarmName, {
            delayInMinutes: (900 / 60),
            periodInMinutes: (900 / 60)
            //1800
          })
        }

      }

    });

  })
}





const deleteTab = async (itemArr, tabId) => {

  for (var i = itemArr.length - 1; i >= 0; i--) {
    if (itemArr[i].tabId == tabId) {
      if (itemArr[i].children.length > 0) {
        var foundItem = itemArr[i].children;
        globalDeleteItemKey = itemArr[i].key;
        for (var j = 0; j < foundItem.length; j++) {
          itemArr.push(foundItem[j]);
        }
        itemArr.splice(i, 1);
      } else {
        globalDeleteItemKey = itemArr[i].key;
        itemArr.splice(i, 1);
      }
    } else {
      //Current node has children
      if (!isEmpty(itemArr[i].children)) deleteTab(itemArr[i].children, tabId);
    }
  }


  return itemArr;

}
//Migrated






/****
 * Open up all tabs that are on the top of the hierachy of the current selected
 */




const openAllTabsToActive = (treeInfo, key, windowKey) => {
  globalRoutes = [];
  globalRecord = [];
  var windowId = parseInt(windowKey.split(windowPrefix)[1]);
  ////consolelog(windowId);
  getAllKeyNames(treeInfo.treeData, key, false);
  if (globalRecord[0] != "No Action To Take") {
    var expandedKeys = treeInfo.expandedKeys.concat(globalRecord);
    var expandedKeysFiltered = expandedKeys.filter((item, pos) => expandedKeys.indexOf(item) === pos)
    ////////////consolelog(expandedKeysFiltered);
    menuOpenHandler({
      treeData: treeInfo.treeData,
      expandedKeys: expandedKeysFiltered,
      selectedKeys: treeInfo.selectedKeys,
      pinned: treeInfo.pinned
    }, windowKey);
  } else {
    menuOpenHandler({
      treeData: treeInfo.treeData,
      expandedKeys: treeInfo.expandedKeys,
      selectedKeys: treeInfo.selectedKeys,
      pinned: treeInfo.pinned
    }, windowKey);


  }
}

const getAllKeyNames = (itemArr, key) => {
  if (globalRecord.length == 0) {
    for (var i = 0; i < itemArr.length; i++) {
      var first = true;
      var currPath = [itemArr[i].key];
      for (var j = 0; j < globalRoutes.length; j++) {
        if (globalRoutes[j][globalRoutes[j].length - 1] == itemArr[i].key) first = false;
      }
      if (first) {
        globalRoutes.push(currPath);
        if (currPath[0] == key) globalRecord = ["No Action To Take"];
      }
      if (itemArr[i].children.length !== 0) {
        for (var k = 0; k < itemArr[i].children.length; k++) {
          for (var j = 0; j < globalRoutes.length; j++) {
            if (globalRoutes[j][globalRoutes[j].length - 1] == itemArr[i].key) {
              //create a new path
              var newPath = JSON.parse(JSON.stringify(globalRoutes[j]));
              if (itemArr[i].children[k].key == key) {
                globalRecord = newPath;
              } else {
                newPath.push(itemArr[i].children[k].key)
                globalRoutes.push(newPath);
              }
            }
          }
        }
        if (globalRecord.length == 0) getAllKeyNames(itemArr[i].children, key)
      }
    }
  }
}


function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}



const removeOldTabs = (itemArr) => {
  try {
    var r = itemArr.filter(function (o) {
      if (o.children.length !== 0) o.children = removeOldTabs(o.children);
      for (var j = globalRemoveOldTabs.length - 1; j >= 0; j--) {
        if (o.tabId == globalRemoveOldTabs[j].id) {
          if (globalRemoveOldTabs[j].pinned) {
            return false;
          } else {
            if (globalRemoveOldTabs[j].active) globalRepairSelectedKey = o.key;
            o.title = globalRemoveOldTabs[j].title;
            o.active = globalRemoveOldTabs[j].active;
            o.status = globalRemoveOldTabs[j].status;
            o.favIconUrl = globalRemoveOldTabs[j].favIconUrl;
            o.url = globalRemoveOldTabs[j].url;
            o.pinned = globalRemoveOldTabs[j].pinned;
            o.muted = globalRemoveOldTabs[j].mutedInfo.muted;
            o.audible = globalRemoveOldTabs[j].audible;
            globalRemoveOldTabs.splice(j, 1);
            return true;

          }
        }
      }
      return false;
    })

    return r;

  } catch (error) {
    clearTasks();
  }


}



const repairTabsIfPossible = async (itemArr) => {
  ////////consolelog(itemArr);
  for (var i = 0; i < globalRemoveOldTabs.length; i++) {
    if (!globalRemoveOldTabs[i].pinned) {
      var tabData = convertToTabData(globalRemoveOldTabs[i]);
      if (globalRemoveOldTabs[i].active) globalRepairSelectedKey = tabData.key;
      itemArr.push(tabData);
    }

  }
  globalRemoveOldTabs = globalRemoveOldTabs.filter((item) => {
    return item.pinned == true;
  });

  for (var i = globalPinned.length - 1; i >= 0; i--) {
    var pass = false;

    for (var j = globalRemoveOldTabs.length - 1; j >= 0; j--) {
      if (globalRemoveOldTabs[j].id == globalPinned[i].tabId) {
        pass = true;
        globalPinned[i] = updateTab(globalPinned[i], globalRemoveOldTabs[j])
        globalRemoveOldTabs.splice(j, 1);
      }
    }
    if (!pass) {
      globalPinned.splice(i, 1);
    }
  }

  for (var i = 0; i < globalRemoveOldTabs.length; i++) {
    var tabData = convertToTabData(globalRemoveOldTabs[i]);
    globalPinned.push(tabData);
  }
  for (var i = 0; i < globalPinned.length; i++) {
    globalPinned[i].order = i;
  }
  return itemArr;
}


const menuOpenHandler = (windowInfo, windowKey) => {
  let windowId = parseInt(windowKey.split(windowPrefix)[1]);
  getSpecificWindow(windowKey, windowId).then((windowTabs) => {
    globalRemoveOldTabs = windowTabs;
    globalPinned = windowInfo.pinned;
    globalRepairSelectedKey = "";
    let treeData = removeOldTabs(windowInfo.treeData);
    repairTabsIfPossible(treeData).then((treeData) => {
      var selectedKey = globalRepairSelectedKey;
      storeWindowData(windowKey, {
        treeData: treeData,
        expandedKeys: windowInfo.expandedKeys,
        selectedKeys: [selectedKey],
        pinned: globalPinned
      }).then(() => {
        windowCollectionHandler();
        checkTask(windowKey);
      })
    })
  });

}


const looping = async (data) => {
  for (var i = 0; i < data.length; i++) {
    data[i].index = indexingIndex;
    injectHibernationTool(data[i].tabId);
    indexingTabIds.push(data[i].tabId);
    indexingIndex += 1;
    if (!isEmpty(data[i].children)) {
      for (var childIndex in data[i].children) {
        let child = data[i].children[childIndex];
        if (child.active && !globalLoopingExpandedKeys.some(item => item === data[i].key)) {
          globalLoopingExpandedKeys.push(data[i].key);
        }
      }
      looping(data[i].children);
    }
  }
  return data;
}

function sort_time(a, b) {
  //console.log(a.time.localeCompare(b.time));
  return b.time.localeCompare(a.time);
}

function storageSweeper() {

  chrome.storage.local.get(null, function (allData) {
    for (var key in allData) {
      /*
      - Settings [treely]
      - Active window [treely_window_{windowid}]
          - check if the windowId has a live window if not delete
      - Historical window [treely_window{window_id}] with fullDate
      - Saved window [treely_window{window_id}] with lastModified
      - Active window list [treely_window_all]
      - Historical window list [treely_window_historical]
      */

      // Settings [treely]
      if (!key.includes(extensionName)) {
        chrome.storage.local.remove(key);
      } else if (key === extensionName) {
        if (key == extensionName) {
          //Check if all fields are here
          /*
          settings: {
              colourMode: "dark",
              menuAlignment: "left",
              overlay: false,
              popup: false,
              width: 320,
              system: info.os,
              idle: false,
              power: false,
              snooze: {
              active: true,
              time: "60",
              neverSuspendPinned: true,
              neverSuspendUnsavedInput: true,
              neverSuspendAudio: true,
              neverSuspendActive: true,
              neverSuspendOffline: false,
              neverSuspendPowerSource: false,
              neverSuspendWhitelist: []
              }
          },
          user: {
              email: "",
              displayName: "",
              uid: ""
          }
          */
          let currentData = allData[key];
          if (currentData.hasOwnProperty("settings") && currentData.hasOwnProperty("user")) {
            let currentSettings = currentData.settings;
            let pass = true;
            if (!currentSettings.hasOwnProperty("colourMode")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("menuAlignment")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("overlay")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("popup")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("width")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("system")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("idle")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("power")) {
              pass = false;
            }
            if (!currentSettings.hasOwnProperty("snooze")) {
              pass = false;
            }
            //Inline mode
            /*
            if (currentSettings.snooze.active) {
                pass = false;
            }
            if (!currentSettings.popup) {
                pass = false;
            }*/
            if (!pass) {
              initialiseSettings();
            }
          } else {
            initialiseSettings();
          }

        }
      } else if (key.includes(windowPrefix)) {
        if (key.includes(historicalWindowPrefix)) {
          let currentData = allData[key];
          let currentKey = key;
          if (isEmpty(currentData) && (isEmpty(currentData.pinned) || isEmpty(currentData.treeData))) {
            chrome.storage.local.remove(key);
          } else if (!currentData.hasOwnProperty("tabCount")) {
            generateCounter = 0;
            generateNumber(currentData.treeData)
            generateCounter += currentData.pinned.length;
            currentData.tabCount = generateCounter;
            storeData(currentKey, currentData);
          } else if (!currentData.hasOwnProperty("lastModified")) {
            currentData.lastModified = new Date().valueOf();
            storeData(currentKey, currentData);

          }
        } else {
          if (allData[key].hasOwnProperty("lastModified")) {
            let currentKey = key;
            let windowId = parseInt(currentKey.split(windowPrefix)[1]);
            //console.log(windowId);
            checkBrowsingWindow(windowId).then((exists) => {
              //console.log(exists);
              if (!exists) {
                let currentData = allData[currentKey];
                if (!isEmpty(currentData) && (!isEmpty(currentData.pinned) || !isEmpty(currentData.treeData))) {
                  let newKey = historicalWindowPrefix + uuidv4();
                  generateCounter = 0;
                  generateNumber(currentData.treeData)
                  generateCounter += currentData.pinned.length;
                  currentData.tabCount = generateCounter;
                  storeData(newKey, currentData).then(() => {
                    chrome.storage.local.remove(currentKey);
                  });

                } else {

                  chrome.storage.local.remove(currentKey);
                }
              }
            })
          } else {
            chrome.storage.local.remove(key);
          }
        }
      }
    }
  });


}

