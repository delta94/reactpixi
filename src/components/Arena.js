import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin, TweenLite, TimelineMax } from "gsap/TweenMax";

import * as Pixi from "pixi.js";


class Arena extends Component {
  constructor() {
    super();
    this.topOffset = 0
  }

  componentWillUnmount(){
    // Static this.props.apps are not dismantlced upon unmounting.
    this.props.app.active = false
    // If the this.props.app is static, don't deconstruct.
    if (this.props.app.static == false){
      // Remove assigned this.props.app items.
      this.props.app.resizable = false
      this.props.app.active = false
      this.props.app.loaded = false
      let children = this.props.app.stage.children
      for (var i = children.length - 1; i >= 0; i--) {	this.props.app.stage.removeChild(children[i]);};
      for (var i = children.length - 1; i >= 0; i--) {	children[i].destroy(true);};
      Object.keys(Pixi.utils.TextureCache).forEach(function(texture) {  Pixi.utils.TextureCache[texture].destroy(true);})
    } 
  }

  // Resizes the view it it's mounted and resizable. (Old versions don't always have a resize function)
  resize(){
    // Active means the this.props.app is mounted and currently being use (Not in the background)
    if (this.props.app.active){
      // Does this have a resize option?
      if (this.props.app.resizable){
        this.props.app.resize({width: this.gameCanvas.clientWidth,height: this.gameCanvas.clientHeight})
      } else {
        // Unless the this.props.app has an assign resizable function, we just redraw but we reload the script. (This erases everything)
        this.redraw()
      }
   }
  }

  redraw(){
    let children = this.props.app.stage.children
    for (var i = children.length - 1; i >= 0; i--) {	this.props.app.stage.removeChild(children[i]);};
    for (var i = children.length - 1; i >= 0; i--) {	children[i].destroy(true);};

    // Recalculate setup
    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.props.width != null ? this.props.width : this.gameCanvas.clientWidth,
      props: this.props
    };

    this.props.app.renderer.resize(this.gameCanvas.clientWidth,this.gameCanvas.clientHeight)
    this.props.script(this.props.app, setup);
  }

  
  shouldComponentUpdate(nextProps,nextState){

      // To stop component from trying to re-render when only the panel number changes or the shelf opens.
    if (this.props.panelNumber != nextProps.panelNumber){
      return false
    } else if (this.props.tipsOpen != nextProps.tipsOpen) {
      return false
    } else {
      return true
    }
  }
  

  componentDidMount() {

      window.onresize = () => {
        this.resize()
      }
      
      this.props.app.active = true
      this.props.app.renderer.backgroundColor = 0xffffff;
      this.props.app.renderer.resolution = 2
      this.props.app.renderer.autoDensity = true
      this.props.app.renderer.resize(this.gameCanvas.clientWidth,this.gameCanvas.clientHeight)
      this.gameCanvas.appendChild(this.props.app.view);

      const setup = {
        height: this.gameCanvas.clientHeight,
        width: this.props.width != null ? this.props.width : this.gameCanvas.clientWidth,
        props: this.props
      };
      
      // What's the different between active and loaded?
      if (!this.props.app.loaded){        
        // One of the scripts offsets y so we have to reset this. (was that the fraction wall?) - maybe we don't need this anymore
        this.props.app.stage.y = 0
        this.props.app.loaded = true
        this.props.script(this.props.app, setup);
      } else {
        if (this.props.app.resizable == true && this.props.app.static == false){
          this.redraw()
        }
      }

  }

  render() { 

    let styleType = this.props.fullscreen ? { height: "100vh",marginTop: 0 } : {height: this.props.screenstate.height,width: this.props.screenstate.width};
    
    if (this.props.app.multilayoutenabled){
      this.resize()
    } 
   
    return (
        <div style = {styleType}
          ref={me => this.gameCanvas = me }
        />
    );
  }
}

export default Arena;
