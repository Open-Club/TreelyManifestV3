/*global chrome*/
import React, { useState, useEffect } from 'react'
import ReactDOM, { unmountComponentAtNode } from 'react-dom'
import { slide as Menu } from 'react-burger-menu'
import ApplicationManager from "../Features/ApplicationManager"
import ShadowRootStyle from '../Features/util/ShadowRootStyle'
import ReactShadowRoot from 'react-shadow-root'
import Header from "../Features/Header"
import Search from "../Features/Search"
import Tailwind from "../Features/util/Tailwind"


const Content = () => {

  const { constructableStylesheetsSupported } = ReactShadowRoot;
  const tailWindStyles = Tailwind();

  let sheet;
  let styleSheets;

  if (constructableStylesheetsSupported) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(tailWindStyles);
    styleSheets = [sheet];
  }

  const [indicatorHovered, setIndicatorHovered] = useState(false);

  const styles = {
    wrapper: {
      position: "fixed",
      width: "100%",
      height: "100%",
      top: "0px",
      left: "0px",
      right: "0px",
      bottom: "0px",
      zIndex: indicatorHovered ? 99999999999999 : -99999999999999,
      border: "none"
    },
    indicator: {
      width: "5px",
      height: "100%",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 99999999999999
    },
    burgerMenu: {
      bmBurgerButton: {
        display: "none"
      },
      bmBurgerBars: {
        background: '#373a47'
      },
      bmBurgerBarsHover: {
        background: '#a90000'
      },
      bmCrossButton: {
        display: "none"
      },
      bmMenuWrap: {
        position: 'fixed',
        height: '100%'
      },
      bmMenu: {
        background: 'white',
        padding: '0.5em 0em 0',
        fontSize: '1.15em'
      },
      bmMorphShape: {
        fill: '#373a47'
      },
      bmItemList: {
        overflow: "hidden"
      },
      bmItem: {
        display: 'inline-block'
      },
      bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
      }
    }
  }

  return (
    <div>
      <div
        id={"treely_wrapper"}
        style={styles.wrapper}
      >

        <ReactShadowRoot stylesheets={styleSheets}>
          <style>{ShadowRootStyle()}</style>
          <Menu
            styles={styles.burgerMenu}
            isOpen={indicatorHovered}
            onStateChange={(state) => setIndicatorHovered(state.isOpen)}
          >
            <Header />
            <Search />
            <ApplicationManager />
          </Menu>

        </ReactShadowRoot>



      </div>
      <div
        id={"treely_indicator"}
        style={styles.indicator}
        onMouseEnter={() => { setIndicatorHovered(true) }}
      //onMouseLeave={() => { setIndicatorHovered(false) }}

      />
      <button onClick={() => { unmountComponentAtNode(document.getElementById('treely_app')); }}>UNMOUNT</button>
    </div>


  );
};



const initialise = () => {
  const app = document.createElement('treely_div');
  app.id = "treely_app";
  document.body.appendChild(app);
  ReactDOM.render(<Content />, app);

};

initialise();
