import React from "react";

const profileHead = (props) => {
  const signOut = () => {
    chrome.runtime.sendMessage({ type: "treely_log_out" }, function (response) {
      if (response.type == "loggedOut") {
        //let htmlString = /*Your extension UI's HTML;
        console.log("signed out");
      }
    });
  }


  const logIn = () => {
    chrome.runtime.sendMessage({ type: "treely_page_load" }, function (response) {
    });
  }
  /*
  if (newValue.user.email == "") {
          setAuth({
            loggedIn: false,
            displayName: ""
          });
        } else {
          setAuth({
            loggedIn: true,
            displayName: newValue.user.displayName
          });
        }
  */
  return (
    <div
      id={"treely_header_wrapper"}
      className={"pb-5"}
    >
      {
        props.mainSettings.user.email != "" ?
          <div
            className={"flex flex-row items-center justify-between text-sm text-white"}
            style={{padding: "0 30px"}}
          >

            <span className="font-bold">
              Hello, {props.mainSettings.user.displayName}
            </span>
            <span
              className={
                "text-xs cursor-pointer font-bold rounded flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 border-4 text-white py-1 px-1 rounded"
              }
              onClick={
                signOut

              }
            >
              Sign out
            </span>
          </div>
          :
          <div
            className="items-end flex flex-col" style={{ paddingRight: "30px" }}
          >
            <a
              className="text-xs font-bold cursor-pointer flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 border-4 text-white py-1 px-1 rounded"
              onClick={logIn}
            >
              Login
            </a>
          </div>


      }



    </div>
  )

}


export default profileHead;
