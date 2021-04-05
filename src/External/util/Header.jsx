import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH, faPalette, faArrowLeft, faQuestionCircle, faCog, faPlus, faThList, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "../../Dashboard/components/Tooltip";

const Header = (props) => {
  const page = props.page;
  const setPage = props.setPage;
  const settings = props.mainSettings.settings;
  const styles =
  {
    wrapper: {
      verticalAlign: "middle",
      padding: "15px 0",
      width: "100%"
    },

    container: {
      width: "100%",
      display: "flex"
    },

    left: {
      width: `${settings.width - 80}px`,
      padding: "0px 5px 0px 0px"
    },

    right: {
      width: "50px",
      padding: "0px 5px 0px 33px",
      /*borderLeft: "1px solid white",*/
      height: "18px"
    },

    rightIcon: {
      cursor: "pointer",
      width: props.settingsActive ? "20px" : "24px",
      height: props.settingsActive ? "20px" : "24px"
    },
    refreshIcon: {
      color: "white",
      cursor: "pointer",
      padding: "0px 10px 0px 0px"
    },

    logo: {
      width: "24px",
      height: "24px"
    }

  };

  const onAdd = () => {
    chrome.runtime.sendMessage({ type: "add_new_tab", windowKey: props.windowKeyRef ? props.windowKeyRef.current : props.info.windowKey });
  }

  const onAddWindow = () => {
    chrome.runtime.sendMessage({ type: "add_new_window" });
  }

  const onAddApplicationWindow = () => {
    chrome.runtime.sendMessage({ type: "add_new_application_window" });
  }


  const logo =
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={styles.logo}
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <image
          width="24"
          height="24"
          x="0"
          y="0"
          xlinkHref="data:image/png;base64,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"
        ></image>
      </g>
    </svg>;
  /*
  const button = <span
    onClick={onClickHandler}
    onMouseLeave={() => setHover(false)}
  >{icon}</span>*/



  return (
    <div id={"treely_header_wrapper"}>
      <div className={`${props.windowkeyRef ? "w-screen" : ""} flex flex-row items-center py-2 justify-between shadow-xs`}
        style={{
          padding: "0 30px",
          height: "5rem"
          //borderBottom: props.windowList.length == 0 ? "1px solid gray" : ""
        }}
        id={"treely_header_wrapper"}
      >
        <div className="flex text-lg text-gray-700 block">{logo}</div>




        <div className="flex flex-row-reverse">
          {
            props.settingsActive ?
              <Fragment>
                <Tooltip message={"Back"}>
                  <FontAwesomeIcon
                    className={`settingToggleIcon text-white`}
                    icon={faArrowLeft}
                    style={styles.rightIcon}
                    onClick={() => {
                      props.setSettingsActive(false)
                    }}
                  />
                </Tooltip>
                <Tooltip message={"Theme"}>
                  <FontAwesomeIcon
                    className={`settingToggleIcon mr-3 ${page == "apperance" ? "settingToggleIconActive" : "text-white"}`}
                    icon={faPalette}
                    style={styles.rightIcon}
                    onClick={() => {
                      setPage("apperance")
                    }}
                  />
                </Tooltip>


                {
                  /*
                  <FontAwesomeIcon
                  className={`settingToggleIcon mr-3 ${page == "" ? "settingToggleIconActive" : "text-white"}`}
                  icon={faWallet}
                  style={styles.rightIcon}
                  onClick={() => {
                    setPage("apperance")
                  }}
                />*/

                }
                <Tooltip message={"Settings"}>
                  <FontAwesomeIcon
                    className={`settingToggleIcon mr-3 ${page == "settings" ? "settingToggleIconActive" : "text-white"}`}
                    icon={faSlidersH}
                    style={styles.rightIcon}
                    onClick={() => {
                      setPage("settings")
                    }}
                  />
                </Tooltip>

                <Tooltip message={"Information"}>
                  <FontAwesomeIcon
                    className={`settingToggleIcon mr-3 ${page == "info" ? "settingToggleIconActive" : "text-white"}`}
                    icon={faQuestionCircle}
                    style={styles.rightIcon}
                    onClick={() => {
                      setPage("info")
                    }}
                  />
                </Tooltip>

              </Fragment> :
              /*
              <Tooltip
                className={"settingToggleIcon text-white"}
                message={"Settings"}
                icon={faCog}
                style={styles.rightIcon}
                action={() => {
                  setPage("settings")
                  props.setSettingsActive(true)
                }}
              />*/
              <Tooltip message={"Settings"}>
                <FontAwesomeIcon
                  className="settingToggleIcon text-white"
                  icon={faCog}
                  style={styles.rightIcon}
                  onClick={() => {
                    setPage("settings")
                    props.setSettingsActive(true)
                  }}
                />
              </Tooltip>

            /*
            <FontAwesomeIcon
            className="settingToggleIcon text-white"
            icon={faCog}
            style={styles.rightIcon}
            onClick={() => {
              setPage("settings")
              props.setSettingsActive(true)
            }}
          />
            */







          }


        </div>





      </div>


      {
        props.settingsActive || props.windowList.length == 0 ?
          <div></div> :
          <div className={`w-full flex items-center py-2 justify-between shadow-xs`}
            style={{
              padding: props.windows ? "20px 32px 40px 20px" : "20px 32px 20px 25px",
              height: "3rem"
            }}
            id={"treely_header_wrapper"}
          >
            <div
              className="h-8 pl-3 mr-3 bg-gray-900 text-gray-600 focus-within:text-gray-400 rounded-md flex-1 flex content-between items-center relative"
              //style={{ width: props.windows ? (props.inline ? "85%" : "60%") : "70%" }}
              style={{ minWidth: "40%" }}
            >
              <button type="submit" className="bg-gray-900 mr-1 focus:outline-none active:outline-none">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
              <input type="search" name="search" id="search" placeholder="Search..." value={props.query} onChange={({ currentTarget }) => { props.setQuery(currentTarget.value) }}
                className={`bg-gray-900 appearance-none outline-none text-sm `}
                //disabled={props.windows ? true : false}
                style={{
                  minWidth: props.windows ? "calc(100% - 35px)" : "calc(100% - 35px)",
                  maxWidth: props.windows ? "calc(100% - 35px)" : "calc(100% - 35px)"
                }}
                autoComplete="off"

              //style={{width: "40%"}}
              />

            </div>

            <div
              className="flex-none"
              style={{ display: `${props.windows ? "block" : "none"}` }}
            >
              {
                props.inline ?
                  <Fragment>
                    <button
                      className={
                        "text-white font-bold text-xs  mr-2 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                      }
                      style={{ transition: "all .15s ease" }}
                      type="button"
                      onClick={onAddWindow}
                    >
                      <Tooltip message={"Open a new browsing window"}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          className={"settingToggleIcon"}
                          style={{
                            width: "18px",
                            height: "18px"
                          }}
                        />
                      </Tooltip>

                    </button>
                    <button
                      className={
                        "text-white font-bold text-xs rounded shadow hover:bg-dark outline-none focus:outline-none"
                      }
                      style={{
                        transition: "all .15s ease",
                        borderRadius: "12px"
                      }}
                    >
                      <Tooltip message={"Back"}>
                        <FontAwesomeIcon
                          className={"settingToggleIcon"}
                          icon={faArrowLeft}
                          style={{
                            width: "18px",
                            height: "18px"
                          }}
                          onClick={() => {
                            props.setWindows(false)
                          }}
                        />
                      </Tooltip>

                    </button>
                  </Fragment>

                  :
                  <div

                  >
                    <button
                      className={
                        "text-white font-bold text-xs mr-2 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                      }
                      style={{ transition: "all .15s ease" }}
                      type="button"
                      onClick={onAddApplicationWindow}
                    >
                      <Tooltip message={"Open a new pop-up window"}>
                        <FontAwesomeIcon
                          icon={faWindowRestore}
                          className={"settingToggleIcon"}
                          style={{
                            width: "18px",
                            height: "18px"
                          }}
                        />
                      </Tooltip>

                    </button>
                    <button
                      className={
                        "text-white font-bold text-xs  mr-2 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                      }
                      style={{ transition: "all .15s ease" }}
                      type="button"
                      onClick={onAddWindow}
                    >
                      <Tooltip message={"Open a new browsing window"}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          className={"settingToggleIcon"}
                          style={{
                            width: "18px",
                            height: "18px"
                          }}
                        />
                      </Tooltip>

                    </button>
                    <button
                      className={
                        "text-white font-bold text-xs rounded shadow hover:bg-dark outline-none focus:outline-none  capitalize"
                      }
                      style={{
                        transition: "all .15s ease",
                        borderRadius: "12px"
                      }}
                    >
                      <Tooltip message={"Back"}>
                        <FontAwesomeIcon
                          icon={faArrowLeft}
                          className={"settingToggleIcon"}
                          onClick={() => {
                            props.setWindows(false)
                          }}
                          style={{
                            width: "18px",
                            height: "18px"
                          }}
                        />
                      </Tooltip>

                    </button>

                  </div>


              }


            </div>




            <div className="flex-none"
              style={{ display: `${props.windows ? "none" : "block"}` }}
            >
              <button
                className={
                  "text-white font-bold text-xs  mr-2 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                }
                style={{ transition: "all .15s ease" }}
                type="button"
                onClick={() => {
                  props.setWindows(true)
                }}
              >
                <Tooltip message={"Window management"}>
                  <FontAwesomeIcon
                    icon={faThList}
                    className={"settingToggleIcon"}
                    style={{
                      width: "18px",
                      height: "18px"
                    }}
                  />
                </Tooltip>

              </button>
              <button
                className={
                  "text-white font-bold text-xs rounded shadow hover:bg-dark outline-none focus:outline-none"
                }
                style={{
                  transition: "all .15s ease",
                  borderRadius: "12px"
                }}
              >
                <Tooltip message={"Open a new tab"}>
                  <FontAwesomeIcon
                    icon={faPlus}
                    className={"settingToggleIcon"}
                    onClick={onAdd}
                    style={{
                      width: "18px",
                      height: "18px"
                    }}
                  />
                </Tooltip>

              </button>

            </div>
          </div>

      }



    </div>

  )
}


export default Header;
