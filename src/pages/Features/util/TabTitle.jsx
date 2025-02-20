import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSpinner, faVolumeUp, faVolumeMute, faPlus } from '@fortawesome/free-solid-svg-icons'

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
      verticalAlign: "middle",
      fontSize: "14px"
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

  const defaultFavicon = <svg className="ant-tree-title-logo" style={styles.titleLogo} xmlns="http://www.w3.org/2000/svg" id="Layer_1" enableBackground="new 0 0 511.83 511.83" height="512" viewBox="0 0 511.83 511.83" width="512"><g><path d="m462.054 32.599h-412.278c-27.447 0-49.776 22.329-49.776 49.775v347.082c0 27.446 22.329 49.775 49.776 49.775h412.278c27.447 0 49.776-22.329 49.776-49.775v-347.082c0-27.446-22.329-49.775-49.776-49.775zm-412.278 30h412.278c10.904 0 19.776 8.871 19.776 19.775v68.515h-451.83v-68.515c0-10.904 8.872-19.775 19.776-19.775zm412.278 386.632h-412.278c-10.904 0-19.776-8.871-19.776-19.775v-248.567h451.83v248.567c0 10.904-8.872 19.775-19.776 19.775z" /><circle cx="75.308" cy="107.635" r="15.099" /><circle cx="136.704" cy="107.635" r="15.099" /><circle cx="200.883" cy="107.635" r="15.099" /><path d="m164.488 272.691c-7.834-2.69-16.369 1.477-19.062 9.31l-6.206 18.054-7.095-18.539c-3.398-10.795-22.384-14.702-28.195.485l-6.206 18.054-7.095-18.539c-2.961-7.737-11.635-11.612-19.371-8.647-7.737 2.961-11.609 11.634-8.648 19.37l21.861 57.121c2.225 5.813 7.802 9.639 14.007 9.639.086 0 .174-.001.26-.002 6.309-.109 11.876-4.154 13.927-10.122l6.206-18.054 7.095 18.539c2.225 5.813 7.802 9.639 14.007 9.639.086 0 .174-.001.26-.002 6.309-.109 11.876-4.154 13.927-10.122l19.634-57.121c2.697-7.835-1.471-16.369-9.306-19.063z" /><path d="m302.283 272.691c-7.835-2.69-16.368 1.477-19.062 9.31l-6.206 18.054-7.095-18.539c-3.405-10.805-22.397-14.691-28.195.485l-6.206 18.054-7.095-18.539c-2.961-7.737-11.634-11.612-19.371-8.647-7.737 2.961-11.609 11.634-8.648 19.37l21.861 57.121c2.225 5.813 7.802 9.639 14.007 9.639.086 0 .174-.001.26-.002 6.309-.109 11.876-4.154 13.927-10.122l6.206-18.054 7.095 18.539c2.225 5.813 7.802 9.639 14.007 9.639.086 0 .174-.001.26-.002 6.309-.109 11.876-4.154 13.927-10.122l19.634-57.121c2.697-7.835-1.471-16.369-9.306-19.063z" /><path d="m440.079 272.691c-7.834-2.69-16.369 1.477-19.062 9.31l-6.206 18.054-7.095-18.539c-3.4-10.777-22.339-14.729-28.195.485l-6.206 18.055-7.096-18.54c-2.961-7.737-11.633-11.612-19.371-8.647-7.737 2.961-11.608 11.634-8.647 19.37l21.862 57.121c2.225 5.813 7.802 9.639 14.007 9.639.086 0 .174-.001.26-.002 6.309-.109 11.876-4.154 13.927-10.122l6.206-18.054 7.095 18.539c2.225 5.813 7.802 9.639 14.007 9.639.086 0 .174-.001.26-.002 6.309-.109 11.876-4.154 13.927-10.122l19.634-57.121c2.695-7.835-1.473-16.369-9.307-19.063z" /></g></svg>
  const favicon = defaultFavicon




  return (
    <div className="ant-tree-title-wrapper" style={styles.titleWrapper}>
      <div className="ant-tree-title-left" style={styles.titleLeft}>
        {favicon}
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
