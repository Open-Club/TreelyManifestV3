import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSpinner, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'

const TabTitle = ({ item }) => {
  const styles = {
    titleLeft: {
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      marginRight: "3px"
    },
    titleLogo: {
      display: "inline",
      marginRight: "10px",
      verticalAlign: "middle",
      width: "16px",
      height: "16px"
    },
    titleWrapper: {
      display: "flex",
      padding: "4px 5px 4px 10px"
    },
    titleRight: {
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center"
    },
    titleText: {
      fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'",
      verticalAlign: "middle"
    }
  }

  let icon = <img border="0" src={[chrome.runtime.getURL("icon-blank.png")]} style={{ width: "16px", height: "16px" }} />;

  const deleteIcon = <FontAwesomeIcon
    //onClick={() => onDelete(item.key, item.tabId)}
    icon={faTimes}
    className="ant-tree-title-icon"
    //style={deleteIconStyle(item.key, true, false)}
    style={styles.titleIcon}
  />;


  return (
    <div className="ant-tree-title-wrapper" style={styles.titleWrapper}>
      <div className="ant-tree-title-left" style={styles.titleLeft}>
        <img className="ant-tree-title-logo" style={styles.titleLogo} border="0" src={[chrome.runtime.getURL("icon-blank.png")]} />
        <span className="ant-tree-title-text" style={styles.titleText}>{item.status == "loading" ? item.url.includes("") ? "New Tab" : item.url : item.title}</span>
        {/*soundIcon*/}
      </div>
      <div className="ant-tree-title-right" style={styles.titleRight}>
        <span className="ant-tree-title-iconWrapper">
          {deleteIcon}
        </span>
      </div>
    </div>
  );
}


export default TabTitle;
