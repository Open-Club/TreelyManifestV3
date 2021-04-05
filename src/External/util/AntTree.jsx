/*global chrome*/
import React, { useState, useEffect, useCallback } from 'react';
import { Tree } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faSpinner, faThumbtack, faVolumeUp, faVolumeMute, faRedo } from '@fortawesome/free-solid-svg-icons';
import ContextMenu from "./ContextMenu";
import templatedData from "../../Content/data/fakeData";
import PinGrids from "./PinGrids";

const AntTree = (props) => {
  const query = props.query;
  const queryActive = query.length > 0;
  const [queryExpandedKeys, setQueryExpandedKeys] = useState([]);

  const systemWidth = props.systemWidth;
  const [deletekey, setDeleteKey] = useState("");
  const { TreeNode } = Tree;
  const treeInfo = props.treeInfo;
  const [contextMenu, setContextMenu] = useState(
    {
      visible: false,
      x: 0,
      y: 0,
      pinned: false,
      key: ""
    });







  /****
   * Listener
   */





  /****
   * Hooks
   */
  useEffect(() => {
    if (!query) return;
    const dataList = [];
    const generateList = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, url, title } = node;
        dataList.push({ key, title: title, url: url });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(treeInfo.treeData);
    const tempExpandedKeys = dataList
      .map(item => {
        if (item.title.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.url.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          return getParentKey(item.key, treeInfo.treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setQueryExpandedKeys(tempExpandedKeys);

  }, [query])



  useEffect(() => {
    //////////consolelog(props.disconnect);
    if (props.disconnect) {
      //////////consolelog("disconnect");
      chrome.storage.onChanged.removeListener(storageHandler);
      window.removeEventListener('resize', handleResize);
    }
  }, [props.disconnect])




  /****
   * Action handlers
   */
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  const onExpand = (expandedKeys) => {
    expandedKeys = expandedKeys.filter(onlyUnique);
    if (queryActive) {
      setQueryExpandedKeys(expandedKeys)
    } else {
      /*
      props.setTreeInfo({
        treeData: treeInfo.treeData,
        expandedKeys: expandedKeys,
        selectedKeys: treeInfo.selectedKeys,
        pinned: treeInfo.pinned
      });*/
      props.setTreeInfo({
        ...treeInfo,
        expandedKeys: expandedKeys
      });
      props.setTreeInfo({
        ...treeInfo,
        expandedKeys: expandedKeys
      });
      saveData({
        treeData: treeInfo.treeData,
        expandedKeys: expandedKeys,
        selectedKeys: treeInfo.selectedKeys,
        pinned: treeInfo.pinned
      });
    }

  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };




  const onDrop = info => {
    if (queryActive) return;
    //////////consolelog(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const selectedKey = treeInfo.selectedKeys[0];
    //console.log(info);
    const getDepth = (data) => {
      var depth = 0;
      if (data.children) {
        data.children.forEach((d) => {
          var tmpDepth = getDepth(d)
          if (tmpDepth > depth) {
            depth = tmpDepth
          }
        })
      }
      return 1 + depth;
    }

    const checkIfSelectedExists = (data) => {
      var exists = false;
      if (data.key == selectedKey) {
        exists = true
      } else {
        if (data.children) {
          data.children.forEach((d) => {
            var existsFromChildren = checkIfSelectedExists(d);
            if (existsFromChildren) exists = true
          })
        }
      }
      return exists;
    }

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    const tempData = [...treeInfo.treeData];
    // Find dragObject
    let dragObj;
    loop(tempData, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    var selectedExists = checkIfSelectedExists(dragObj);
    var highestChildDepth = getDepth(dragObj);
    var accepted = (highestChildDepth + dropPos.length) < 13;

    if (accepted) {
      if (!info.dropToGap) {
        // Drop on the content
        loop(tempData, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(tempData, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(tempData, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      var expandedKeys = [...treeInfo.expandedKeys];
      /*
      if (selectedExists) {
        expandedKeys.push(dropKey);
      }*/
      expandedKeys.push(dropKey);
      saveData({
        treeData: tempData,
        expandedKeys: expandedKeys,
        selectedKeys: treeInfo.selectedKeys,
        pinned: treeInfo.pinned,
        dragged: true
      });
    }


  };

  const onRightClick = (info) => {
    var htmlElements = info.node.title.props.children;
    var muted = false;
    for (var i = 0; i < htmlElements.length; i++) {
      if (typeof (htmlElements[i]) != "undefined") {
        if (htmlElements[i].props.icon) {
          var icon = htmlElements[i].props.icon.iconName;
          if (icon == "volume-mute") muted = true;
        }
      }
    }
    var key = info.node.key;
    var event = info.event;
    event.preventDefault();
    var clientX = props.mainSettings.settings.menuAlignment == "left" ? event.clientX : props.mainSettings.settings.width - (window.innerWidth - event.clientX);
    var context = {
      visible: true,
      x: clientX,
      y: event.clientY,
      pin: false,
      muted: muted,
      key: key
    }
    ////consolelog(context)
    setContextMenu(context);
  }






  const onDelete = (key, tabId) => {
    ////////////consolelog(key, tabId);
    if (typeof (key) === 'string' && typeof (tabId) === "number") {
      setDeleteKey(key);
      saveData({
        treeData: treeInfo.treeData,
        expandedKeys: treeInfo.expandedKeys,
        selectedKeys: treeInfo.selectedKeys,
        pinned: treeInfo.pinned,
        delete: tabId
      });
    } else if (key[0] != deletekey) {
      saveData({
        treeData: treeInfo.treeData,
        expandedKeys: treeInfo.expandedKeys,
        selectedKeys: treeInfo.selectedKeys,
        pinned: treeInfo.pinned,
        selected: key[0]
      });
    }
  }








  /****
   * Utilities
   */

  const saveData = (data) => {
    if (!data.delete && !data.selected && !data.add) {
      props.setTreeInfo({
        treeData: data.treeData,
        expandedKeys: data.expandedKeys,
        pinned: treeInfo.pinned,
        selectedKeys: data.selectedKeys
      });
    }
    //////////consolelog(data)

    var windowKey = props.windowKeyHook;
    data.lastModified = new Date().valueOf();
    chrome.storage.local.set({ [windowKey]: data }, (callback) => {
      ////////////consolelog(`Saved ${JSON.stringify(data, null, 2)}`);
    });
  }


  const deleteIconStyle = (key, cursor, padding) => {
    var colour;

    if (key == treeInfo.selectedKeys[0]) {
      if (props.mainSettings.settings.colourMode == "dark") {
        colour = "#11111E";
      }
    }
    var style =
    {
      width: "16px",
      height: "16px",
      verticalAlign: "middle",
      cursor: cursor ? "pointer" : "no-drop",
      color: colour,
      pointerEvents: cursor ? "auto" : "none",
      padding: padding ? "0 5px 0 0" : "0",
      //display: "inline",
      boxSizing: "content-box"
    }
    return style
  }
  const addIconStyle =
  {
    width: "16px",
    height: "16px",
    cursor: "pointer"
  };


  let windowPinWidth = systemWidth - 17;
  let macPinWidth = systemWidth;
  let pinWidth = props.mainSettings.settings.system == "win" ? windowPinWidth : macPinWidth;

  const styles = {
    treeWrapper: {
      padding: `${treeInfo.pinned.length === 0 ? "10px" : "5px"} 0px 300px 0px`,
      overflowY: "scroll",
      height: "100%"
    },
    pinWrapper: {
      display: "block",
      width: `${pinWidth}px`,
      padding: `${props.mainSettings.settings.system == "linux" ? "16px 40px 16px 25px" : "16px 25px 16px 25px"}`,
      display: treeInfo.pinned.length !== 0 ? "block" : "none"
    },
    totalWrapper: {
      /*
      overflowY: "scroll",
      */
      height: "calc(100% - 128px)"
    }
  }


  const textStyle = (maxWidth) => {
    var style = {
      fontFamily: "Roboto, sans-serif",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "inline-block",
      verticalAlign: "middle",
      maxWidth: maxWidth,
      minWidth: maxWidth
    }
    return style;
  }


  const randomTreeHandler = () => {
    saveData(templatedData);
  }

  const showPinnedHandler = () => {
    console.log(JSON.stringify(treeInfo.pinned, null, 2));
  }

  const showTreeDataHandler = () => {
    console.log(JSON.stringify(treeInfo.treeData, null, 2));
  }

  const showTreeInfoHandler = () => {
    console.log(JSON.stringify(treeInfo, null, 2));
  }

  const showTabsHandler = () => {
    let windowId = props.windowKeyHook.split("_")[2];
    chrome.runtime.sendMessage({ type: "showtabs", windowId: windowId });
  }

  const reloadRunTimeHandler = () => {
    chrome.runtime.sendMessage({ type: "reload_runtime" });
  }




  const loop = (data, depth, check) => data.map((item) => {
    ////////////consolelog(item, "with depth ", depth);
    var render;
    var pinned = item.pinned;
    var muted = item.muted;
    var audible = item.audible;
    var displaySoundIcon = muted || audible;
    //var icon = <img border="0" src={"https://www.google.com/images/icons/product/chrome-32.png"} style={{ width: "16px", height: "16px" }} />;
    //let icon = <img border="0" src={[chrome.runtime.getURL("icon-16.png")]} style={{ width: "16px", height: "16px" }} />;
    let queryActiveCheckMatch = false;

    if (queryActive && check) {
      if (item.title.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.url.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        queryActiveCheckMatch = true;
      }
    }


    var endIcon = <FontAwesomeIcon
      onClick={() => onDelete(item.key, item.tabId)}
      icon={faTimes}
      className="deleteIcon"
      style={deleteIconStyle(item.key, true, false)}
    />;


    if (muted) {
      soundIcon = <FontAwesomeIcon
        icon={faVolumeMute}
        className="soundIcon"
        style={deleteIconStyle(item.key, false, true)}
      />;
    } else {
      if (audible) {
        var soundIcon = <FontAwesomeIcon
          icon={faVolumeUp}
          className="soundIcon"
          style={deleteIconStyle(item.key, false, true)}
        />;
      }

    }
    let icon = <img border="0" src={[chrome.runtime.getURL("icon-16.png")]} style={{ width: "16px", height: "16px" }} />;
    if ((item.status == "complete" || item.status == "unloaded") && item.favIconUrl) {
      icon = <img border="0" src={item.favIconUrl} style={{ width: "16px", height: "16px" }} />
    } else if (item.status == "loading" && item.title != "New Tab") {
      icon = <FontAwesomeIcon icon={faSpinner} style={addIconStyle} />
    }
    const windowWidth = (systemWidth - 122);
    const macWidth = (systemWidth - 105);
    const linuxWidth = (systemWidth - 100 - 22);
    const width = props.mainSettings.settings.system == "win" ? windowWidth : props.mainSettings.settings.system == "linux" ? linuxWidth : macWidth;

    var maxWidth = String((width) - (queryActiveCheckMatch ? 0 : depth) * 16) + "px";
    var title = (
      <span>
        <span style={textStyle(maxWidth)}>
            {item.status == "loading" ? item.url.includes("") ? "New Tab" : item.url : item.title}
        </span>
        {soundIcon}
        {endIcon}
      </span>



    );

    if (item.children) {
      var newDepth = depth + 1;
      if (queryActive && check) {
        if (item.title.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.url.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          render = <TreeNode {...item} icon={icon} key={item.key} title={title}>{loop(item.children, newDepth, false)}</TreeNode>;
        } else {
          render = loop(item.children, newDepth, true);
        }
      } else {
        render = <TreeNode {...item} icon={icon} key={item.key} title={title}>{loop(item.children, newDepth, false)}</TreeNode>;
      }

    } else {
      if (queryActive) {
        if (item.title.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.url.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          render = <TreeNode {...item} icon={icon} key={item.key} title={title}></TreeNode>;
        } else {
          render = <span></span>;
        }
      } else {
        render = <TreeNode {...item} icon={icon} key={item.key} title={title}></TreeNode>;
      }

    }

    return render;
  });
  return (


    <div
      id={"treely_tree"}
      style={styles.totalWrapper}

    >
      <div style={{ display: "none" }}>
        <button onClick={randomTreeHandler}>
          Random tree
          </button>
      </div>

      <div style={{ display: "none" }}>
        <button onClick={showPinnedHandler}>
          Show pinned
          </button>
      </div>

      <div style={{ display: "none" }}>
        <button onClick={showTreeDataHandler}>
          Show treeData
          </button>
      </div>
      <div style={{ display: "none" }}>
        <button onClick={showTabsHandler}>
          Show tabs
          </button>
      </div>
      <div style={{ display: "none" }}>
        <button onClick={showTreeInfoHandler}>
          Show all
          </button>
      </div>
      <div style={{ display: "none" }}>
        <button onClick={reloadRunTimeHandler}>
          Reload runtime
          </button>
      </div>
      <div style={styles.pinWrapper}>
        <PinGrids
          systemWidth={systemWidth}
          windowKeyHook={props.windowKeyHook}
          treeInfo={treeInfo}
          settings={props.mainSettings.settings}
          query={props.query}
        />
      </div>

      <div style={styles.treeWrapper}>
        <Tree
          showIcon
          autoExpandParent={queryActive ? true : false}
          selectedKeys={treeInfo.selectedKeys}
          expandedKeys={queryActive ? queryExpandedKeys : treeInfo.expandedKeys}
          className="draggable-tree"
          blockNode
          draggable={queryActive ? false : true}
          onExpand={onExpand}
          onDrop={onDrop}
          onSelect={onDelete}
          onRightClick={onRightClick}
        >
          {loop(treeInfo.treeData, 0, true)}

        </Tree>
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          windowKeyHook={props.windowKeyHook}
          treeInfo={treeInfo}
          settings={props.mainSettings.settings}
        />
      </div>



    </div>




  );

}

export default AntTree;
