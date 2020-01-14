import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Arena from "./Arena";
import * as FractionWallScript from "../js/newfractionwall.js";
import * as NumberLineToolScript from "../js/numberlinetool.js";
import * as OrderingToolScript from "../js/orderingtool.js";
import * as FractionBarScript from "../js/fractionbar.js";
import * as GridNodeScript from "../js/gridnodes.js";
import * as GridCuttingScript from "../js/gridcutting.js";
import * as FractionStacksScript from "../js/fractionstacks.js";
import FactorBlocks from "./FactorBlocks";
import * as Pixi from "pixi.js";
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin, TweenLite, TimelineMax } from "gsap/TweenMax";



function TabContainer({ children, dir }) {
  return (
    <div component="div" dir={dir}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  }
}));

Pixi.settings.RESOLUTION = 3
var globalApp = new Pixi.Application(0,0,{backgroundColor: 0xffffff,antialias: true});
globalApp.static = false
globalApp.loaded = false

var arenaOne

export default function ManipulativeCarousel(props) {

  const classes = useStyles();
  const theme = useTheme();
  const app = globalApp
  const [value, setValue] = React.useState(0);

 
  app.help = ()=> {    
    console.log("animating",arenaOne.style)
    var tl = new TimelineMax()
    tl.to(arenaOne, 0.5, {x: arenaOne.clientWidth,alpha: 0})
      .to(arenaOne,0, {x: -arenaOne.clientWidth,alpha: 1})
      .to(arenaOne,1,{x: 0})
    }

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  return (
    <div className="container">
        <div className="section no-pad-bot" id="index-banner">
        <div className="container">
          <h1 className="header center grey-text">Manipulatives</h1>
        </div>
      </div>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant = "scrollable"
        centered

      >
        <Tab className = "white" label="Fraction Wall" />
        <Tab className = "white" label="Fraction Line" />
        <Tab className = "white" label="Ordering" />
        <Tab className = "white" label="Builder Grid" />
        <Tab className = "white" label="Cutting Grid" />
        <Tab className = "white" label="Fraction Stacks" />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}>
          {value == 0 && (
            <Arena
              app = {app}
              setup={false}
              fullscreen={true}
              script={FractionWallScript.init}
            />
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 1 && (
            <Arena
              app = {app}
              fullscreen={true}
              script={NumberLineToolScript.init}
            />
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 2 && (
            <Arena
             app = {app}
              fullscreen={true}
              features = {{numberOfBlocks: 5}}
              script={OrderingToolScript.init}
            />
           )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 3 && (
              <Arena
                app = {app}
                setup={false}
                fullscreen={true}
                features = {{x: 5,y: 5,descriptor: false}}
                script={GridNodeScript.init}
              />
           )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 4 && (
              <Arena
                app = {app}
                setup={false}
                fullscreen={true}
                features = {{x: 5,y: 5,descriptor: false,snapping: true}}
                script={GridCuttingScript.init}
              />
           )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 5 && (
              <Arena
                app = {app}
                setup={false}
                fullscreen={true}
                script={FractionStacksScript.init}
              />
           )}
        </TabContainer>
      </SwipeableViews>
    </div>
  );
}
