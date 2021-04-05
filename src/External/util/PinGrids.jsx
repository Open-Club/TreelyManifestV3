import React, { useEffect, useState } from 'react';
import { ListManager } from "react-beautiful-dnd-grid";
import PinContextMenu from "./PinContextMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp, faMoon } from '@fortawesome/free-solid-svg-icons';

const PinGrids = (props) => {
  const query = props.query;
  const queryActive = query.length > 0;
  const colours = {
    white: "#e2e2e2",
    dark: "white",
    splash: "white",
    zyon: "white",
    nylon: "white",
    nature: "white",
    flash: "white"
  }
  const colour = colours[props.settings.colourMode];
  const darkMode = props.settings.colourMode != "white";
  const macWidth = parseInt((props.systemWidth - 52) / 29);
  const winWidth = parseInt((props.systemWidth - 69) / 29.75);
  const linuxWidth = parseInt((props.systemWidth - 67) / 28);
  const system = props.settings.system;
  const maxItemCount = system == "win" ? winWidth : system == "mac" ? macWidth : linuxWidth;
  //onsole.log(winWidth);
  //console.log(maxItemCount);

  const styles = {
    iconStyle: {
      width: "18px",
      height: "18px"
    },
    icon: {
      width: "14px",
      height: "14px",
      verticalAlign: "text-top",
      padding: "0px 4px 0px 0px",
      display: "block",
    },
    snoozeIcon: {
      position: "absolute",
      top: "2px",
      right: "0px",
      width: "10px",
      height: "10px",
      color: "dimgrey"
    },
    soundIcon: {
      position: "absolute",
      top: "2px",
      left: "2px",
      width: "10px",
      height: "10px",
      color: "dimgrey"

    }
  }

  //const maxItemCount = parseInt((props.systemWidth - 52) / 30);
  ////consolelog(props.systemWidth);
  ////consolelog(maxItemCount);

  const itemStyle = (item) => {
    let style = {
      margin: "0px 0px 0px 0px",
      padding: `${system == "win" ? "6px 6px" : system == "linux" ? "5px" : "5.5px"}`,
      position: "relative",
      background: item.active ? colour : "transparent",
      borderRadius: "5px"
    }
    return style
  }

  const display = props.treeInfo.pinned.length !== 0 ? true : false;

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    pinned: false,
    key: ""
  });

  const ListElement = (item) => {
    var item = item.item;
    var render;
    var icon = <img border="0" src={"https://www.google.com/images/icons/product/chrome-32.png"} style={styles.iconStyle} />;
    if (item.favIconUrl) icon = <img border="0" src={item.favIconUrl} style={styles.iconStyle} />
    var soundIcon;
    let snoozeIcon;
    if (item.muted) {
      soundIcon = <FontAwesomeIcon
        icon={faVolumeMute}
        style={styles.soundIcon}
      />
    } else {
      if (item.audible) {
        soundIcon = <FontAwesomeIcon
          icon={faVolumeUp}
          style={styles.soundIcon}
        />
      }
    }
    if (item.status == "unloaded") {
      snoozeIcon = <FontAwesomeIcon
        icon={faMoon}
        style={styles.snoozeIcon}
      />
    }
    if (queryActive) {
      if (item.title.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.url.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        render =
          <div
            key={item.key}
            className="item"
            style={itemStyle(item)}
            onClick={() => onClickHandler(item)}
            onContextMenu={e => onRightClick(e, item)}
          >
            {snoozeIcon}
            {icon}
            {soundIcon}
          </div>;
      } else {
        render = <span></span>;
      }
    } else {
      render =
        <div
          key={item.key}
          className="item"
          style={itemStyle(item)}
          onClick={() => onClickHandler(item)}
          onContextMenu={e => onRightClick(e, item)}
        >
          {snoozeIcon}
          {icon}
          {soundIcon}
        </div>;


    }

    return render;
  }


  const onClickHandler = (item) => {
    saveData({
      treeData: props.treeInfo.treeData,
      expandedKeys: props.treeInfo.expandedKeys,
      selectedKeys: [],
      pinned: props.treeInfo.pinned,
      selected: item.tabId
    });
  }


  const onRightClick = (e, info) => {
    var clientX = props.settings.menuAlignment == "left" ? e.clientX : 300 - (window.innerWidth - e.clientX);
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: clientX,
      y: e.clientY,
      pin: info.pinned,
      muted: info.muted,
      tabId: info.tabId,
      key: info.key
    });

  }


  const saveData = (data) => {
    var windowKey = props.windowKeyHook;
    data.lastModified = new Date().valueOf();
    chrome.storage.local.set({ [windowKey]: data }, (callback) => {
      //////////consolelog(`Saved ${JSON.stringify(data, null, 2)}`);
    });
  }

  const sortAndStoreData = (pinnedList) => {
    ////consolelog(pinnedList)
    saveData({
      treeData: props.treeInfo.treeData,
      expandedKeys: props.treeInfo.expandedKeys,
      selectedKeys: props.treeInfo.selectedKeys,
      pinned: sort(pinnedList),
      dragged: true
    });
  }

  const reorderList = (sourceIndex, destinationIndex) => {
    if (queryActive) return;
    ////consolelog(sourceIndex, destinationIndex)
    if (destinationIndex === sourceIndex) {
      return;
    }
    const list = [...props.treeInfo.pinned];
    if (destinationIndex === 0) {
      list[sourceIndex].order = list[0].order - 1;
      sortAndStoreData(list);
      return;
    }
    if (destinationIndex === list.length - 1) {
      list[sourceIndex].order = list[list.length - 1].order + 1;
      sortAndStoreData(list);
      return;
    }
    if (destinationIndex < sourceIndex) {
      list[sourceIndex].order = (list[destinationIndex].order + list[destinationIndex - 1].order) / 2;
      sortAndStoreData(list);
      return;
    }
    list[sourceIndex].order = (list[destinationIndex].order + list[destinationIndex + 1].order) / 2;
    sortAndStoreData(list);
  }
  /*
  <span style={styles.heading}>
        <FontAwesomeIcon
          icon={faThumbtack}
          style={styles.icon}
        />
          Default
      </span>
      */

  return (
    display ?
      <div style={styles.pinGridWrapper} >
        <ListManager
          items={props.treeInfo.pinned}
          direction="horizontal"
          maxItems={maxItemCount}
          render={item => <ListElement item={item} />}
          onDragEnd={reorderList}
        />
        <PinContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          windowKeyHook={props.windowKeyHook}
          treeInfo={props.treeInfo}
          settings={props.settings}
        />
      </div> :
      <div></div>
  );
}

function sort(list) {
  return list.slice().sort((first, second) => first.order - second.order);
}


export default PinGrids;
