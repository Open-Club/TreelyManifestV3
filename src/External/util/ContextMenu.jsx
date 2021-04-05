import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRedo, faVolumeMute, faVolumeUp, faThumbtack, faClone, faTimes } from '@fortawesome/free-solid-svg-icons';
const contextMenu = (props) => {
  const styles = {
    underlay: {
      zIndex: "1",
      position: "absolute",
      width: "100%",
      height: "100%",
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
    })
  }


  const onClickHandler = (info) => {
    var action = info.action;
    ////consolelog(action);
    ////consolelog(props.contextMenu);
    //Unpin
    switch (action) {
      case "pin":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          pin: { value: !props.contextMenu.pin, key: props.contextMenu.key }
        });
        break;
      case "newTab":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          newTab: { key: props.contextMenu.key }
        });
        break;
      case "reload":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          reload: { key: props.contextMenu.key }
        });
        break;
      case "delete":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          delete: { key: props.contextMenu.key }
        });
        break;
      case "duplicate":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          duplicate: { key: props.contextMenu.key }
        });
        break;
      case "mute":
        saveData({
          treeData: props.treeInfo.treeData,
          expandedKeys: props.treeInfo.expandedKeys,
          selectedKeys: props.treeInfo.selectedKeys,
          pinned: props.treeInfo.pinned,
          muted: { value: !props.contextMenu.muted, key: props.contextMenu.key }
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
        <li style={styles.seperator} onClick={() => onClickHandler({ action: "newTab" })}>
          <div style={{ boxSizing: "content-box" }}>
            <FontAwesomeIcon icon={faPlus} style={styles.fontAWEIcon} />
            <span className={"align-middle"}>New Tab</span>
          </div>
        </li>
        <li onClick={() => onClickHandler({ action: "reload" })}>
          <div style={{ boxSizing: "content-box" }}>
            <FontAwesomeIcon icon={faRedo} style={styles.fontAWEIcon} />
            <span className={"align-middle"}>Reload</span>
          </div>

        </li>
        <li onClick={() => onClickHandler({ action: "mute" })}>
          <div style={{ boxSizing: "content-box" }}>
            {volumeIcon}
            <span className={"align-middle"}>{muted}</span>
          </div>

        </li>
        <li onClick={() => onClickHandler({ action: "pin", info: pin })}>
          <div style={{ boxSizing: "content-box" }}>
            <FontAwesomeIcon icon={faThumbtack} style={styles.fontAWEIcon} />
            <span className={"align-middle"}>{pin}</span>
          </div>

        </li>
        <li style={styles.seperator} onClick={() => onClickHandler({ action: "duplicate" })}>
          <div style={{ boxSizing: "content-box" }}>
            <FontAwesomeIcon icon={faClone} style={styles.fontAWEIcon} />
            <span className={"align-middle"}>Duplicate</span>
          </div>

        </li>
        <li onClick={() => onClickHandler({ action: "delete" })}>
          <div style={{ boxSizing: "content-box" }}>
            <FontAwesomeIcon icon={faTimes} style={styles.fontAWEIcon} />
            <span className={"align-middle"}>Close</span>
          </div>

        </li>
      </ul>
    </Fragment>



  );

}

export default contextMenu;
