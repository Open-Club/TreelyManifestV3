import React, { Fragment, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "../../Dashboard/components/Tooltip";
const WindowHeader = (props) => {

  const [toggle, setToggle] = useState(false);

  const windowKey = props.windowKey;
  const [timeLeft, setTimeLeft] = useState(null);

  const onAdd = () => {
    chrome.runtime.sendMessage({ type: "add_new_tab", windowKey: props.windowKey });
  }

  const onDelete = () => {
    props.setDisplay(false);
    let type = props.historical ? "delete_window_historical" : "delete_window";
    chrome.runtime.sendMessage({ type: type, windowKey: props.windowKey });
  }

  const onSwitchWindow = () => {
    chrome.runtime.sendMessage({ type: "switch_window", windowKey: props.windowKey });
  }

  const onRecover = () => {
    chrome.runtime.sendMessage({ type: "recover_window", windowKey: props.windowKey });
  }


  useEffect(() => {
    if (toggle) {
      setTimeLeft(10);
    }
  }, [toggle])


  useEffect(() => {
    if (timeLeft === 0) {
      setToggle(false);
    }

    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);



  return (
    <div>
      <div className={`flex flex-row items-center py-2 justify-between`}
        id={"treely_tree"}
        style={{
          padding: "0 16px 0 25px",
          height: "2rem"
        }}
      >
        <div className={`flex text-sm ${props.active ? props.query.length > 0 ? "text-white" : "text-white" : props.historical ? "text-white" : "text-white"}`}
          style={{ width: props.hover ? "75%" : "80%" }}
        >{/*windowKey.split("treely_window_")[1]*/}
          <span className={"text-base font-bold"}>
            Window {props.index}
          </span>

          {props.windowKeyHook == windowKey ?
            <div className="flex justify-center items-center ml-2 font-medium py-1 px-2 bg-black rounded text-white">
              <div className="text-xs font-normal leading-none max-w-full flex-initial capitalize">Focused</div>
            </div> :

            props.historical ?
              <div
                className={`
                    flex justify-center items-center ml-2 font-medium py-1 px-2 bg-gray-900 hover:bg-transparent border border-gray-900 text-white border-0 hover:border-white rounded
                `}
              >
                <Tooltip message={"Recover this window"}>
                  <div
                    className="text-xs font-normal leading-none max-w-full flex-initial capitalize cursor-pointer"
                    onClick={onRecover}
                  >Restore</div>
                </Tooltip>

              </div> :
              <div
                className={`flex justify-center items-center ml-2 font-medium py-1 px-2 bg-indigo-500 hover:bg-transparent border-indigo-900 border rounded text-white hover:border-white`}
              >
                <Tooltip message={"Switch focus to this window"}>
                  <div
                    className="text-xs font-normal leading-none max-w-full flex-initial capitalize cursor-pointer"
                    onClick={() => {
                      if (props.inline) {
                        onSwitchWindow();
                        props.setWindows(false);
                      } else {
                        props.windowKeyRef.current = windowKey;
                        props.setWindowKeyHook(windowKey);
                        props.setWindows(false);
                      }

                    }}
                  >Switch</div>
                </Tooltip>

              </div>


          }




        </div>
        <div className={"flex"}>
          {
            props.historical ?
              props.hover ?
                <Fragment>

                  <button
                    className={
                      "text-white font-bold uppercase text-xs p-1 rounded shadow hover:bg-white hover:text-black outline-none focus:outline-none  capitalize mr-2"
                    }
                    style={{
                      transition: "all .15s ease",
                      borderRadius: "12px"
                    }}
                  >
                    <Tooltip message={"Delete window"}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={""}
                        onClick={onDelete}
                        style={{
                          width: "16px",
                          height: "16px"
                        }}
                      />
                    </Tooltip>

                  </button>
                  <button
                    className={
                      "text-white font-bold uppercase text-xs p-1 rounded shadow hover:bg-white hover:text-black outline-none focus:outline-none  capitalize"
                    }
                    style={{
                      transition: "all .15s ease",
                      borderRadius: "12px"
                    }}
                  >
                    <Tooltip message={"Show tree"}>
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className={""}
                        onClick={() => {
                          props.setHover(false)
                          props.setToggle(false)
                        }}
                        style={{
                          width: "16px",
                          height: "16px"
                        }}
                      />
                    </Tooltip>

                  </button>



                </Fragment> :

                <Fragment>


                  <Tooltip message={"Show tree"}>
                    <button
                      className={
                        "text-white font-bold uppercase text-xs p-1 rounded shadow hover:bg-white hover:text-black outline-none focus:outline-none  capitalize"
                      }
                      style={{
                        transition: "all .15s ease",
                        borderRadius: "12px"
                      }}
                    >
                      <FontAwesomeIcon
                        icon={props.toggle ? faArrowUp : faArrowDown}
                        className={""}
                        onClick={() => {
                          props.setToggle(true)
                        }}
                        style={{
                          width: "16px",
                          height: "16px"
                        }}
                      />

                    </button>

                  </Tooltip>



                </Fragment>
              :

              props.hover ?
                <Fragment>
                  <Tooltip message={"Open a new tab"}>
                    <button
                      className={
                        "text-white font-bold uppercase text-xs p-1 rounded shadow hover:bg-white hover:text-black outline-none focus:outline-none "
                      }
                      style={{
                        transition: "all .15s ease",
                        borderRadius: "12px"
                      }}
                    >

                      <FontAwesomeIcon
                        icon={faPlus}
                        className={""}
                        onClick={onAdd}
                        style={{
                          width: "16px",
                          height: "16px"
                        }}
                      />
                    </button>
                  </Tooltip>
                  <button
                    className={
                      "text-white font-bold uppercase text-xs p-1 rounded shadow hover:bg-white hover:text-black outline-none focus:outline-none  capitalize"
                    }
                    style={{
                      transition: "all .15s ease",
                      borderRadius: "12px"
                    }}
                  >
                    <Tooltip message={"Delete window"}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={""}
                        onClick={onDelete}
                        style={{
                          width: "16px",
                          height: "16px"
                        }}
                      />
                    </Tooltip>

                  </button>
                </Fragment> :
                <div></div>



          }

        </div>






      </div>
      {
        props.historical && !props.toggle
          ?
          <div
            className={"flex justify-between"}
            style={{
              padding: "0 16px 0 25px"
              //height: "3rem"
            }}
          >
            <div>
              <span className={"text-sm text-gray-500"}>
                {props.windowTime}
              </span>
            </div>

            <div>
              <span className={"text-sm text-gray-500"}>
                {props.tabCount} {props.tabCount > 1 ? "Tabs" : "Tab"}
              </span>
            </div>




          </div>
          :
          <div></div>
      }


    </div >

  )
}


export default WindowHeader;
