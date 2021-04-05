import { convertToTabData } from "./tabFunction";

export const windowPrefix = "treely_window_";
export const windowListKey = windowPrefix + "all";
export const historicalWindowListKey = windowPrefix + "all_historical";
export const savedWindowListKey = windowPrefix + "all_saved"
export const savedWindowPrefix = windowPrefix + "_saved_"
export const historicalWindowPrefix = windowPrefix + "_historical_"
export const extensionName = "treely";
export const popUpWindowListKey = "treely_window_list"
export const alarmName = extensionName + "_alarm";
export const sweeperAlarmName = extensionName + "_sweeper_alarm";



export const popupToInlineHandler = () => {
  scriptInjection();
  chrome.windows.getAll({ populate: true }, (windows) => {
    windows.forEach((currentWindow, element) => {
      let currentTabs = currentWindow.tabs;
      var removed = false;
      for (var i = 0; i < currentTabs.length; i++) {
        if (currentTabs[i].url.includes("treely_external") && !removed) {
          chrome.windows.remove(currentTabs[i].windowId);
          removed = true;
        }
      }
    });
  });
}





/**
 * Utility helper functions
 */


export const randomIntFromInterval = (min, max) => { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}



/****
 * Script maintanance
 */

export const feedbackHandler = () => {
  chrome.storage.local.get(extensionName, (result) => {
    var extensionData = result[extensionName];
    extensionData.feedback.given = true;
    chrome.storage.local.set({ [extensionName]: extensionData });
  });
}


export const injectHibernationTool = (tabId) => {
  chrome.tabs.sendMessage(tabId, { treely_page_loaded: true }, function (results) {
    //console.log(results);
    if (chrome.runtime.lastError || !results || !results.length) {
      //console.log(results);
      chrome.tabs.executeScript(tabId, {
        runAt: 'document_end',
        file: 'checkSite.js',
        allFrames: false,
        matchAboutBlank: false,
      });
    }
  });
}


export const injectIntoTab = (tabId, check) => {
  chrome.storage.local.get(extensionName, (result) => {
    var extensionData = result[extensionName];
    if (typeof (extensionData) == "undefined") {
      initialiseSettings();
    } else {
      if (!extensionData.settings.popup) {
        chrome.tabs.executeScript(tabId, {
          runAt: 'document_end',
          file: 'contentScript.bundle.js',
          allFrames: false,
          matchAboutBlank: false,
        });
      }

      //Check if checkSite script is enabled
      chrome.tabs.sendMessage(tabId, { treely_page_loaded: true }, function (results) {
        //console.log(results);
        if (chrome.runtime.lastError || !results || !results.length) {
          //console.log(results);
          chrome.tabs.executeScript(tabId, {
            runAt: 'document_end',
            file: 'checkSite.js',
            allFrames: false,
            matchAboutBlank: false,
          });
        }
      });

    }

  });

  /*
    chrome.tabs.executeScript(tabId, {
      runAt: 'document_start',
      file: 'contentScript.bundle.js',
      allFrames: false,
      matchAboutBlank: false,
    });*/
}



/****
* Utility for maintanance
*/

export const scriptInjection = () => {
  chrome.windows.getAll({
    populate: true
  }, function (windows) {
    var i = 0, w = windows.length, currentWindow;
    for (; i < w; i++) {
      currentWindow = windows[i];
      var j = 0, t = currentWindow.tabs.length, currentTab;
      for (; j < t; j++) {
        currentTab = currentWindow.tabs[j];
        // Skip chrome:// and https:// pages
        if (!currentTab.url.includes("treely_external")) {
          injectIntoTab(currentTab.id, false);
        }
      }
    }
  });
}



export const storeData = (key, obj, from) => {
  return new Promise(function (resolve, reject) {
    try {
      chrome.storage.local.set({ [key]: obj }, function (result) {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
        else resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}


function custom_sort(a, b) {
  return new Date(b.date) - new Date(a.date);
}

function sort_time(a, b) {
  //console.log(a.time.localeCompare(b.time));
  return b.time.localeCompare(a.time);
}
export const checkWindowSweeper = () => {
  //let historicalWindowList = [{ date: "03/10/2020", windowList: [], fullDate: 1601749103000 }, { date: "02/10/2020", windowList: [], fullDate: 1601662703000 }];
  let historicalWindowList = [];
  chrome.storage.local.get(null, function (allData) {
    for (var key in allData) {
      if (key.includes(historicalWindowPrefix)) {
        //console.log(allData[key])
        let dataDate = new Date(allData[key].lastModified);
        let localeDate = dataDate.toLocaleDateString();
        let data = {
          time: dataDate.toLocaleTimeString(),
          key: key,
          tabCount: allData[key].tabCount,
          fullDate: allData[key].fullDate,
          date: localeDate
        };

        //historicalWindowList.push({ date: dataDate, key: key, tabCount: allData[key].tabCount, time: allData[key].time })
        let appended = false;
        for (var i = 0; i < historicalWindowList.length; i++) {
          if (historicalWindowList[i].date == localeDate) {
            historicalWindowList[i].windowList.push(data);
            appended = true;
          }
        }
        if (!appended) {
          historicalWindowList.push({ date: localeDate, windowList: [data], fullDate: allData[key].lastModified });
        }
      }
    }
    historicalWindowList.sort(custom_sort);
    for (var i = 0; i < historicalWindowList.length; i++) {
      historicalWindowList[i].windowList.sort(sort_time);
    }
    storeData(historicalWindowListKey, historicalWindowList);

  });

}




export const initialiseSettings = () => {
  chrome.runtime.getPlatformInfo((info) => {
    let extensionInfo = {
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
    }
    storeData(extensionName, extensionInfo);
  });

}
