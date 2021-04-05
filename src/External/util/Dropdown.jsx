import React, { Fragment } from "react";
import Popper from "popper.js";
import { windowListKey } from "../../Background/functions/generalFunction";
import { faUserInjured, faArrowDown, faThList, faWindowMaximize, faWindowMinimize, faArrowRight, faArrowCircleRight, faPlusCircle, faExternalLinkSquareAlt } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Dropdown = (props) => {
  const styles = {
    arrowRight: {
      width: "16px",
      height: "16px",
      display: "inline",
      verticalAlign: "sub"
    },
    minimise: {
      width: "16px",
      height: "16px",
      display: "inline",
      verticalAlign: "inherit"
    }
  }
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  const onAddWindow = () => {
    chrome.runtime.sendMessage({ type: "add_new_window" });
    setDropdownPopoverShow(false);
  }

  const onAddApplicationWindow = () => {
    chrome.runtime.sendMessage({ type: "add_new_application_window" });
    setDropdownPopoverShow(false);
  }
  const loop = (data) => data.map((item) => {
    var displayText = item.split("treely_")[1];
    var current = item == props.windowKeyHook;
    var elem =
      <span
        key={displayText}
        href="#pablo"
        className={
          "text-xs py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800 bg-white cursor-pointer capitalize hover:bg-black hover:text-white"
        }
        onClick={() => {
          props.windowKeyRef.current = item;
          props.setWindowKeyHook(item);
          closeDropdownPopover();
        }}
      >
        {
          current ?
            <FontAwesomeIcon
              icon={faArrowCircleRight}
              style={styles.arrowRight}
              className={"mr-2"}
            /> :
            <FontAwesomeIcon
              icon={faWindowMinimize}
              style={styles.minimise}
              className={"mr-2"}
            />

        }

        {`${displayText} ${current ? "(current)" : ""}`}
      </span>
    return elem;
  });
  const windowKeyHookFiltered = typeof (props.windowKeyHook) != "undefined" ? props.windowKeyHook.split("treely_")[1] : "";
  return (
    props.windowList.length === 0 ?
      <div></div> :
      <Fragment>
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="relative inline-flex align-middle w-full">
              <button
                className={
                  "text-black font-bold uppercase text-xs p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none bg-white capitalize"
                }
                style={{ transition: "all .15s ease" }}
                type="button"
                ref={btnDropdownRef}
                onClick={() => {
                  dropdownPopoverShow
                    ? closeDropdownPopover()
                    : openDropdownPopover();
                }}
              >
                {/*windowKeyHookFiltered*/}
                <FontAwesomeIcon
                  icon={faThList}
                  className={"settingToggleIcon"}
                  style={{
                    width: "18px",
                    height: "18px"
                  }}
                />
              </button>
              <div
                ref={popoverDropdownRef}
                className={
                  (dropdownPopoverShow ? "block " : "hidden ") +
                  +
                  "text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 bg-white"
                }
                style={{ minWidth: "12rem", zIndex: "99" }}
              >
                {loop(props.windowList)}
                <div className="border-t border-gray-400"></div>
                <span
                  href="#pablo"
                  className={
                    "text-xs py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800 bg-white cursor-pointer hover:bg-black hover:text-white"
                  }
                  onClick={() => {
                    onAddWindow()
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    style={styles.arrowRight}
                    className={"mr-2"}
                  />
                  New browsing window
                </span>
                <span
                  href="#pablo"
                  className={
                    "text-xs py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800 bg-white cursor-pointer hover:bg-black hover:text-white"
                  }
                  onClick={() => {
                    onAddApplicationWindow()
                  }}
                >
                  <FontAwesomeIcon
                    icon={faExternalLinkSquareAlt}
                    style={styles.arrowRight}
                    className={"mr-2"}
                  />
                  New pop-up window
                </span>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
  );
};

export default Dropdown;
