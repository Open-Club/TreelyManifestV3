import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const NewTab = ({ item }) => {
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
      padding: "5px 15px 5px 35px",
      fontSize: "14px"
    },
    titleRight: {
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center"
    },
    titleText: {
      fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'",
      verticalAlign: "middle",
      fontSize: "14px"
    }
  }

  return (
    <div className="ant-tree-new-tab-wrapper" style={styles.titleWrapper} >
      <div className="ant-tree-title-left" style={styles.titleLeft}>
        <FontAwesomeIcon
          //onClick={() => onDelete(item.key, item.tabId)}
          icon={faPlus}
          className="ant-tree-title-logo" style={styles.titleLogo}
        />
        <span className="ant-tree-title-text" style={styles.titleText}>New Tab</span>
        {/*soundIcon*/}
      </div>
      <div className="ant-tree-title-right" style={styles.titleRight}>
        <span className="ant-tree-title-iconWrapper">
          ⌘T
        </span>
      </div>
    </div >
  );
}


export default NewTab;
