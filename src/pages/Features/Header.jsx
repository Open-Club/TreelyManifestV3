import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faThList } from '@fortawesome/free-solid-svg-icons'


const Header = () => {
  const styles = {
    wrapper: {
      padding: "10px 14px 10px 34px",
      display: "flex",
      justifyContent: "space-between"
    },
    logo: {
      width: "16px",
      height: "16px"
    },
    icon: {
      width: "16px",
      height: "16px"
    },
    iconWrapper: {
      padding: "5px"
    }
  }
  return (
    <div style={styles.wrapper}>
      <span>
        <svg style={styles.logo} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14.7126" y="23.8049" width="2.75862" height="5.46341" fill="#393E46" />
          <path d="M16 0L29.8564 24H2.14359L16 0Z" fill="#393E46" />
        </svg>

      </span>
      <div>
        <span style={styles.iconWrapper}>
          <FontAwesomeIcon
            className="settingToggleIcon"
            icon={faThList}
            style={styles.icon}
          />
        </span>
        <span style={styles.iconWrapper}>
          <FontAwesomeIcon
            className="settingToggleIcon"
            icon={faCog}
            style={styles.icon}
          />
        </span>

      </div>



    </div>
  )
}

export default Header;
