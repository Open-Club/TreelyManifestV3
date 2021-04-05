import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRedo, faVolumeMute, faVolumeUp, faThumbtack, faClone, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { Fragment, useState } from 'react';

const PinContextMenu = (props) => {
  const styles = {
    underlay: {
      zIndex: "1",
      position: "absolute",
      width: "300px",
      height: "100vh",
      top: "0",
    },
    hidden: {
      display: "none"
    },
    seperator: {
      borderBottom: "1px solid #D3D3D3"
    },
    fontAWEIcon: {
      width: "14px",
      height: "14px",
      padding: "0px 6px 0px 0px",
      verticalAlign: "middle",
      display: "inline",
      boxSizing: "content-box"
    }
  }

  const pin = props.contextMenu.pin ? "Unpin" : "Pin";
  const muted = props.contextMenu.muted ? "Unmute" : "Mute";
  const volumeIcon = muted == "Unmute" ? (<FontAwesomeIcon icon={faVolumeMute} style={styles.fontAWEIcon} />) : (<FontAwesomeIcon icon={faVolumeUp} style={styles.fontAWEIcon} />);

  const saveData = (data) => {
    ////consolelog(data);
    var windowKey = props.windowKeyHook ? props.windowKeyHook : props.info.windowKey;
    chrome.storage.local.set({ [windowKey]: data }, (callback) => {
      //////consolelog(`Saved ${JSON.stringify(data, null, 2)}`);
      closeMenuHandler();
    });
  }
  const closeMenuHandler = () => {
    props.setContextMenu({
      ...props.contextMenu,
      visible: false
    });
  }

  const onClickHandler = (info) => {
    var action = info.action;
    ////consolelog(action);
    ////consolelog(props.contextMenu);
    //Unpin
    switch (action) {
      case "newPin":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          newPin: true
        });
        break;
      case "pin":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          pin: { value: !props.contextMenu.pin, tabId: props.contextMenu.tabId }
        });
        break;
      case "reload":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          reload: { tabId: props.contextMenu.tabId }
        });
        break;
      case "delete":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          delete: props.contextMenu.tabId
        });
        break;
      case "mute":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          muted: { value: !props.contextMenu.muted, tabId: props.contextMenu.tabId }
        });
        break;
      default:
        break;
    }
  }

  return (
    props.contextMenu.visible &&
    <Fragment>
      <div
        style={styles.underlay}
        className={"contextMenuUnderlay"}
        onClick={closeMenuHandler}>
      </div>
      <ul className="contextMenu" style={{ left: `${props.contextMenu.x}px`, top: `${props.contextMenu.y}px` }}>
        <li style={styles.seperator} onClick={() => onClickHandler({ action: "newPin" })}>
          <FontAwesomeIcon icon={faPlus} style={styles.fontAWEIcon} />
          <span className={"align-middle"}>New Pin</span>
        </li>
        <li onClick={() => onClickHandler({ action: "pin", info: pin })}>
          <FontAwesomeIcon icon={faThumbtack} style={styles.fontAWEIcon} />
          <span className={"align-middle"}>{pin}</span>
        </li>
        <li onClick={() => onClickHandler({ action: "reload" })}>
          <FontAwesomeIcon icon={faRedo} style={styles.fontAWEIcon} />
          <span className={"align-middle"}>Reload</span>
        </li>
        <li style={styles.seperator} onClick={() => onClickHandler({ action: "mute" })}>
          {volumeIcon}
          <span className={"align-middle"}>{muted}</span>
        </li>
        <li onClick={() => onClickHandler({ action: "delete" })}>
          <FontAwesomeIcon icon={faTimes} style={styles.fontAWEIcon} />
          <span className={"align-middle"}>Close</span>
        </li>
      </ul>
    </Fragment>



  );

}


export default PinContextMenu;
