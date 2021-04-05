/*global chrome*/
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { slide as Menu } from 'react-burger-menu'


const Content = () => {

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
      zIndex: 99999999999999,
      color: "black"
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
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
      },
      bmMorphShape: {
        fill: '#373a47'
      },
      bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em'
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
        <Menu
          styles={styles.burgerMenu}
          isOpen={indicatorHovered}
        />
      </div>
      <div
        id={"treely_indicator"}
        style={styles.indicator}
        onMouseEnter={() => { setIndicatorHovered(true) }}
      //onMouseLeave={() => { setIndicatorHovered(false) }}
      />
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
