import { storeData } from "../functions/generalFunction";
import { v4 as uuidv4 } from 'uuid';

export default class tabFunction {
  constructor() {
    //menuOpenHandler
  }


  defaultCaseHandler = (oldValue, newValue) => {
    var oldExpandedKeys = oldValue.expandedKeys;
    var newExpandedKeys = newValue.expandedKeys;
    var collapsedKey = oldExpandedKeys.filter(x => !newExpandedKeys.includes(x))[0];
    if (collapsedKey && newValue.selectedKeys[0]) {
      //Find the data and see it's children is selected
      let collapsedItem = findCollapsed(newValue.treeData, collapsedKey);
      let newSelectedId = collapsedItem[0].tabId;
      let underCollapsed = checkIfSelectedUnderCollapsed(collapsedItem, newValue.selectedKeys[0]);
      if (underCollapsed) {
        //ga('send', 'event', 'tab_collapsed_with_active_child');
        chrome.tabs.update(newSelectedId, {
          active: true
        })
      }
    }
  }


  muteActionHandler(newValue) {
    //ga('send', 'event', 'mute_tab');
    var mutedKey = newValue.muted.key;
    var value = newValue.muted.value;
    var tabId = typeof (mutedKey) === "undefined" ? newValue.muted.tabId : getTabId(newValue.treeData, mutedKey);
    chrome.tabs.update(tabId, {
      muted: value
    })

  }

  duplicateActionHandler(newValue) {
    //ga('send', 'event', 'duplicate_tab');
    var duplicateKey = newValue.duplicate.key;
    var tabId = getTabId(newValue.treeData, duplicateKey);
    chrome.tabs.duplicate(tabId);
  }

  reloadActionHandler(windowKey, newValue) {
    //ga('send', 'event', 'reload_tab');
    var reloadKey = newValue.reload.key;
    var tabId = typeof (reloadKey) === "undefined" ? newValue.reload.tabId : getTabId(newValue.treeData, reloadKey);
    chrome.tabs.reload(tabId);
  }

  pinActionHandler(newValue) {
    //ga('send', 'event', 'pin_tab');
    var selectedKey = newValue.pin.key;
    var action = newValue.pin.value;
    var tabId = typeof (selectedKey) === "undefined" ? newValue.pin.tabId : getTabId(newValue.treeData, selectedKey);
    chrome.tabs.update(tabId, {
      pinned: action
    })
  }


  deleteTabActionHandler(newValue) {
    //ga('send', 'event', 'delete_tab');
    var deleteTab = newValue.delete;
    if (typeof (deleteTab) == "number") {
      var tabKey = getTabKey(newValue.treeData, deleteTab)
      if (tabKey == newValue.selectedKeys[0]) {
        chrome.tabs.remove(deleteTab);
        deleteTabIterator(newValue.treeData, tabKey).then((retrievedSelectedTabId) => {
          //////////consolelog(retrievedSelectedTabId);
          chrome.tabs.update(retrievedSelectedTabId, {
            active: true
          }, (callback) => {
            chrome.tabs.remove(deleteTab);
          })
        });
      } else {
        chrome.tabs.remove(deleteTab);
      }

    } else {
      if (deleteTab.key == newValue.selectedKeys[0]) {
        deleteTabIterator(newValue.treeData, deleteTab.key).then((retrievedSelectedTabId) => {
          chrome.tabs.update(retrievedSelectedTabId, {
            active: true
          }, (callback) => {
            let tabId = getTabId(newValue.treeData, deleteTab.key);
            chrome.tabs.remove(tabId);
          })
        });
      } else {
        let tabId = getTabId(newValue.treeData, deleteTab.key);
        chrome.tabs.remove(tabId)
      }
    }
  }


}



/****
 * Handlers
 */












/****
 * Helper functions
 */


const findCollapsed = (itemArr, key) => {
  var collapsedItem;
  for (var i = 0; i < itemArr.length; i++) {
    if (itemArr[i].key == key) {
      //console.log(itemArr[i])
      return [itemArr[i]];
    } else {
      if (itemArr[i].children.length > 0) {
        collapsedItem = findCollapsed(itemArr[i].children, key);
        if (collapsedItem) {
          return collapsedItem;
        }
      }
    }
  }
  return collapsedItem;

}


const getTabKey = (itemArr, tabId) => {
  var tabKey;
  for (var i = 0; i < itemArr.length; i++) {
    if (itemArr[i].tabId == tabId) {
      return itemArr[i].key;
    } else {
      if (itemArr[i].children.length !== 0) {
        tabKey = getTabKey(itemArr[i].children, tabId);
        if (tabKey) return tabKey;
      }
    }
  }
  return tabKey;

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


const deleteTabIterator = async (itemArr, key) => {
  for (var i = 0; i < itemArr.length; i++) {
    if (itemArr[i].key == key) {
      if (itemArr[i].children.length !== 0) {
        return itemArr[i].children[0].tabId;
      } else {
        var higher = i + 1;
        var lower = i - 1;

        if (itemArr.length - 1 >= higher) {
          return itemArr[higher].tabId;
        } else if (lower > -1) {
          return itemArr[lower].tabId;
        }
      }
    } else {
      if (itemArr[i].children.length !== 0) {
        for (var j = 0; j < itemArr[i].children.length; j++) {
          if (itemArr[i].children[j].key == key && !itemArr[i].children[j].children.length > 0) {
            return itemArr[i].tabId;
          }
        }
        deleteTabIterator(itemArr[i].children, key)
      }
    }
  }
}







export const convertToTabData = (tab) => {
  var tabData = {
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
    audible: tab.audible,
    order: 0,
    index: tab.index
  };
  return tabData;
}





const checkIfSelectedUnderCollapsed = (itemArr, key) => {
  let verdict;
  for (var i = 0; i < itemArr.length; i++) {
    if (itemArr[i].key == key) {
      return true;
    } else {
      if (itemArr[i].children.length !== 0) {
        verdict = checkIfSelectedUnderCollapsed(itemArr[i].children, key);
        if (verdict) return verdict;
      }
    }
  }
  return verdict;
}



export const updateTab = (oldTab, tab, loadingStatus) => {
  //console.log(oldTab);
  //console.log(tab)
  oldTab.index = tab.index;
  oldTab.title = tab.title;
  oldTab.active = tab.active;
  oldTab.status = tab.status;
  oldTab.tabId = tab.id;
  oldTab.pinned = tab.pinned;
  oldTab.muted = tab.mutedInfo ? tab.mutedInfo.muted : tab.muted;
  oldTab.audible = tab.audible;
  oldTab.favIconUrl = tab.favIconUrl;
  oldTab.url = tab.url;

  return oldTab;
};

