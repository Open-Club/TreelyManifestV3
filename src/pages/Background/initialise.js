import {
  injectIntoTab,
  windowPrefix,
  randomIntFromInterval,
  alarmName,
  popUpWindowListKey,
  extensionName,
  checkWindowHistoricalSweeper
} from "./functions/generalFunction";
import { refreshWindow } from "./functions/windowFunction";

export default class Initilise {

  constructor() {
    this.initialiseListeners();
  }


  initialiseListeners() {

    chrome.runtime.setUninstallURL("https://forms.gle/mo9UVmbqRicYRvbs6");
    chrome.runtime.onUpdateAvailable.addListener(() => {
      chrome.runtime.reload();
    });

    // Initialise Firebase
    /*
    var config = {
      apiKey: "AIzaSyAAH1cCt4iLmuv_gAWknykBtYlyRtkj_nE",
      authDomain: "opentst-production.firebaseapp.com",
      databaseURL: "https://opentst-production.firebaseio.com",
      projectId: "opentst-production",
      storageBucket: "opentst-production.appspot.com",
      messagingSenderId: "50049161242",
      appId: "1:50049161242:web:f678914f1163fe4e9759a3",
      measurementId: "G-PKF24CKS0X"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function (user) {
      ////console.log(user);
    });

    */



    //Initialise Alarm


    // Initialise opened windows
    //chrome.storage.local.set({ [popUpWindowListKey]: [] });


    /**
    * Initialise Listeners
    */

    chrome.idle.setDetectionInterval(300);

    chrome.idle.onStateChanged.addListener((callback) => {
      chrome.storage.local.get(extensionName, (storageResult) => {
        let extensionData = storageResult[extensionName];
        extensionData.settings.idle = callback == "idle";
        chrome.storage.local.set({ [extensionName]: extensionData });
      });

    });
    if (navigator.getBattery) {
      navigator.getBattery().then(function (battery) {

        let chargingMode = battery.charging;
        chrome.storage.local.get(extensionName, (storageResult) => {
          let extensionData = storageResult[extensionName];
          extensionData.settings.power = chargingMode;
          chrome.storage.local.set({ [extensionName]: extensionData });
        });

        battery.onchargingchange = function () {
          let chargingMode = battery.charging;
          chrome.storage.local.get(extensionName, (storageResult) => {
            let extensionData = storageResult[extensionName];
            extensionData.settings.power = chargingMode;
            chrome.storage.local.set({ [extensionName]: extensionData });
          });
        };
      });
    }



    chrome.runtime.onConnect.addListener(
      (port) => {
        var senderWindowId = port.sender.tab.windowId;
        //ga('send', 'event', 'background_initialised_menu');
        port.onMessage.addListener(function (msg) {
          if (msg.code == "initialised") {
            port.postMessage({ windowId: senderWindowId });
          }
        });
        port.onDisconnect.addListener((info) => {
          ////////consolelog(`${JSON.stringify(info)} disconneced`);
          var tabId = info.sender.tab.id;
          chrome.tabs.get(tabId, (callback) => {
            if (!chrome.runtime.lastError) {
              injectIntoTab(tabId);
              ////////consolelog(`Revived ${callback} and info is ${info}`);
            }
          });
        });
      });









  }


}
