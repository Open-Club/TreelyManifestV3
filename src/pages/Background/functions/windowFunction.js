
import { storeData, windowPrefix } from "./generalFunction";
import { convertToTabData } from "./tabFunction";


export const refreshWindow = (windowId) => {
  ga('send', 'event', 'refresh_window');
  chrome.windows.get(windowId, {
    populate: true
  }, (callback) => {
    var windowKey = windowPrefix + String(windowId);
    var currentWindowTabs = JSON.parse(JSON.stringify(callback.tabs));
    var treeInfo = createWindow(currentWindowTabs);
    storeData(windowKey, treeInfo, "refreshWindow");
  })
}


const createWindow = (tabs) => {
  var windowInfo = {
    treeData: [],
    selectedKeys: [],
    expandedKeys: [],
    pinned: []
  }
  tabs.forEach((tab, index) => {
    var tabData = convertToTabData(tab);
    if (windowInfo.selectedKeys.length == 0 && tab.active) windowInfo.selectedKeys = [tabData.key];
    if (tab.pinned) {
      if (windowInfo.pinned.length === 0) {
        //consolelog(tab);
        windowInfo.pinned.push(tabData);
      }
      else {
        tabData.order = windowInfo.pinned.length;
        windowInfo.pinned.push(tabData);
      }
    } else {
      windowInfo.treeData.push(tabData);
    }

  })
  return windowInfo;
}


