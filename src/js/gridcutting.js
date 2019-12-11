import * as PIXI from "pixi.js";
import blueGradient from "../assets/blue-gradient.png";
import * as CONST from "./const.js";
import QuestionMark from '../assets/QuestionMark.png'
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin, TweenLite, TimelineMax } from "gsap/TweenMax";
import {Fraction, Draggable, distance} from "./api.js"
import {Line, polygonArea,DraggablePoly,getIntersectionPoints,splitPolygon, splitMultiplePolygons} from "./api.js";
const ASSETS = CONST.ASSETS


export const init = (app, setup) => {

  // Layout Parameters
  const LINE_PERCENTAGE = 0.8
  const BLUE_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.GLASS_CIRCLE)
  const CLOSED_CIRCLE_TEXTURE = new PIXI.Texture.from(ASSETS.CLOSED_CIRCLE)
  const OPEN_CIRCLE_TEXTURE = new PIXI.Texture.from(ASSETS.OPEN_CIRCLE)
    
  let WINDOW_WIDTH = setup.width
  let BAR_HEIGHT = setup.height/15
  let WINDOW_HEIGHT = setup.height
  let H_W_RATIO = setup.height/setup.width
  let LANDSCAPE = H_W_RATIO < 3/4
  let ARENA_WIDTH = LANDSCAPE ? 4/3*setup.height : setup.width
  let ARENA_HEIGHT = LANDSCAPE ? setup.height : 3/4*setup.width
  let SQUARE_DIM = ARENA_HEIGHT*0.6
  let SQUARE_AREA = SQUARE_DIM*SQUARE_DIM
  let BTN_DIM = SQUARE_DIM/6
  let DX;
  let DY

  let stencil;
  let Nodes = []
  let CurrentPolygon = []
  let activePolygon = null
  let polygons = []
  let fractionObj;
  let trashBtn;
  let rotateLeftBtn;
  let rotateRightBtn;
  let duplicateBtn;
  let flipVerticalBtn;
  let flipHorizontalBtn;
  let resetBtn;
  let cutting = false
  let linePoints = []
  let polygonObjects = []

  let fadeAnimation = new TimelineLite({paused: true})
 
  function makeBackground(){
    // Setup Background
    this.sprite = new PIXI.Sprite.from(CONST.ASSETS.BLUE_GRADIENT);
    this.sprite.width = WINDOW_WIDTH
    this.sprite.height = WINDOW_HEIGHT
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.interactive = true

    app.stage.addChild(this.sprite)

    this.draw = () => {
        this.sprite.width = WINDOW_WIDTH
        this.sprite.height = WINDOW_HEIGHT
    }
  }

  const SQUARE = [[0,0],[0,SQUARE_DIM],[SQUARE_DIM,SQUARE_DIM],[SQUARE_DIM,0]]
  let initialPolygon = new DraggablePoly(SQUARE,app)
  app.stage.addChild(initialPolygon)


  class Stencil extends PIXI.Graphics {
    constructor(){
      super()
    }

    draw(nodes){
      this.clear()
      this.lineStyle(4,0x000000)
      this.moveTo(nodes[0][0],nodes[0][1])
      for (let n of nodes){
        let x = n[0]
        let y = n[1]
        this.lineTo(x,y)
      }
    }
  }



  class Node extends PIXI.Sprite {
    constructor(){
      super()
      this.on('pointerdown',this.pointerDown)
      //this.on('pointerup',this.pointerUp)
      //this.on('pointerupoutside',this.pointerUpOutside)
      this.anchor.set(0.5)
      this.activated = false
      this.interactive = true
      this.texture = OPEN_CIRCLE_TEXTURE
    }

    pointerDown(){
      Nodes.forEach((n)=>{app.stage.addChild(n)})
      this.texture = CLOSED_CIRCLE_TEXTURE
      if (linePoints.length < 2 ){
        linePoints.push([this.x,this.y])
        stencil.draw(linePoints)
      } else {
        linePoints = []
        stencil.clear()
        Nodes.forEach((n)=>{n.texture = OPEN_CIRCLE_TEXTURE})
        this.texture = CLOSED_CIRCLE_TEXTURE
        linePoints.push([this.x,this.y])
      }
    }

  }

  function cut(){
    console.log("linepoints",linePoints)
    let rawCopyOfPolygons = polygonObjects.map(pObj=>{
      return pObj.getPolyPoints()})
    // Destroy old ones.
    console.log("polygonObjects",polygonObjects)
    polygonObjects.forEach(pObj=>{
      pObj.destroy(true)
      app.stage.removeChild(pObj)
    })
    polygonObjects = []

    let newPolygons = splitMultiplePolygons(linePoints,rawCopyOfPolygons)
    newPolygons.forEach(p=>{
      let pObj = new DraggablePoly(p,app)
      app.stage.addChild(pObj)
      polygonObjects.push(pObj)
      pObj.on('pointerup',snap)
    })
  }

  function snap(){
    /*
      let originX = this.x - this.width/2
      let originY = this.y - this.height/2
      console.log("originaXY",originX,originY)
      let i = Math.round(originX/DX)*DX
      let j = Math.round(originY/DY)*DY
      console.log('i,j',i,j)
      let deltaX = originX - i   
      let deltaY = originY - j
      console.log("deltas",deltaX,deltaY)
      this.x = i + this.width/2
      this.y = j + this.height/2
      */
  } 

  function setNodes(a,b){
    DX = SQUARE_DIM/(a-1)
    DY = SQUARE_DIM/(b-1)
    let dim = SQUARE_DIM/15
    for (let i=0;i<10;i++){
      for (let j=0;j<10;j++){
        let n = new Node()
        Nodes.push(n)
        n.x = i*DX
        n.y = j*DY
        n.w = DX/10
        n.height = dim
        n.width = dim
        app.stage.addChild(n)
      }
    }
  }


  function decimalToFrac(dec){
    for (let i=1;i<100;i++){
      for (let j=0;j<=i;j++){
        if (Math.abs(j/i - dec) < 0.001) {
          return [j,i]
        }
      }
    }
  }

  // Called on resize
  function resize(newFrame,flex){
    // Make sure all layout parameters are up to date.
    updateLayoutParams(newFrame)
    app.renderer.resize(WINDOW_WIDTH,WINDOW_HEIGHT)
  }


  function polygonArea(poly) {
     let area = 0
     let xS = poly.map(p=> p[0])
     let yS = poly.map(p=> p[1])
 
      // Calculate value of shoelace formula 
      let n = poly.length
      let j = n - 1 
      for (let i = 0; i < n; i++) { 
          area = area + (xS[j] + xS[i]) * (yS[j] - yS[i]);
          j = i;  // j is previous vertex to i 
      } 
    
      // Return absolute value 
      return Math.abs(area / 2)
  } 

  function updateLayoutParams(newFrame){
    let frame;
    if (newFrame){
      frame = newFrame
    } else {
      frame = {width: WINDOW_WIDTH,height: WINDOW_HEIGHT}
    }
    WINDOW_WIDTH = frame.width
    WINDOW_HEIGHT = frame.height
    H_W_RATIO = frame.height/frame.width
    LANDSCAPE = H_W_RATIO < 3/4
    ARENA_WIDTH = LANDSCAPE ? 4/3*frame.height : frame.width
    ARENA_HEIGHT = LANDSCAPE ? frame.height : 3/4*frame.width
  }

  function placeButtons(alpha){
    app.stage.addChild(rotateLeftBtn)
    app.stage.addChild(flipVerticalBtn)
    rotateLeftBtn.alpha = alpha 
    flipVerticalBtn.alpha = alpha
    rotateLeftBtn.interactive = alpha == 0 ? false : true
    flipVerticalBtn.interactive = alpha == 0 ? false : true

    if (activePolygon != null){
      let width = activePolygon.rotated ? activePolygon.height : activePolygon.width
      let height = activePolygon.rotated ? activePolygon.width : activePolygon.height  

      rotateLeftBtn.x = activePolygon.x - BTN_DIM
      rotateLeftBtn.y = activePolygon.y - height/2 - 1.15*BTN_DIM
      flipVerticalBtn.x = activePolygon.x
      flipVerticalBtn.y = activePolygon.y - height/2 - 1.15*BTN_DIM
    }
  }

  // Loading Script
  function load(){
    app.loaded = true
    let features = {}
    if (setup.props.features){
      features = setup.props.features
    }

    let backGround = new makeBackground()

    rotateLeftBtn = new PIXI.Sprite.from(ASSETS.ROTATE_LEFT)
    rotateLeftBtn.width = BTN_DIM
    rotateLeftBtn.height = BTN_DIM
    rotateLeftBtn.x = - BTN_DIM
    rotateLeftBtn.interactive = true
    rotateLeftBtn.alpha = 0
    app.stage.addChild(rotateLeftBtn)
    rotateLeftBtn.on('pointerdown',()=>{
      if (activePolygon != null){
        activePolygon.rotated = !activePolygon.rotated
        placeButtons(1)
        TweenLite.to(activePolygon,0.2,{rotation: activePolygon.rotation - Math.PI/2})
      }
    })

    flipVerticalBtn = new PIXI.Sprite.from(ASSETS.FLIP_VERT)
    flipVerticalBtn.x = - BTN_DIM
    flipVerticalBtn.y = BTN_DIM
    flipVerticalBtn.width = BTN_DIM
    flipVerticalBtn.height = BTN_DIM
    flipVerticalBtn.interactive = true
    app.stage.addChild(flipVerticalBtn)
    flipVerticalBtn.on('pointerdown',()=>{
      if (activePolygon != null){
        if (!activePolygon.rotated){
          TweenLite.to(activePolygon.scale,0.2,{y: activePolygon.scale.y*(-1)})
        } else {
          TweenLite.to(activePolygon.scale,0.2,{x: activePolygon.scale.x*(-1)})
        }

      }
    })

    /*
    resetBtn = new PIXI.Sprite.from(ASSETS.RESET)
    resetBtn.y = 0*BTN_DIM
    resetBtn.width = BTN_DIM
    resetBtn.height = BTN_DIM
    resetBtn.interactive = true
    app.stage.addChild(resetBtn)
    resetBtn.on('pointerdown',()=>{
      polygons.forEach(p=>{
        app.stage.removeChild(p)
        p.destroy(true)
      })
      polygons = []
      activePolygon = null 
      fractionObj.draw(0,1,BTN_DIM)
    })
    */

    duplicateBtn = new PIXI.Sprite.from(ASSETS.SCISSORS)
    duplicateBtn.y = 0
    duplicateBtn.width = BTN_DIM
    duplicateBtn.height = BTN_DIM
    duplicateBtn.interactive = true
    app.stage.addChild(duplicateBtn)
    duplicateBtn.on('pointerdown',()=>{
      cut()
      linePoints = []
      Nodes.forEach((n)=>{n.texture = OPEN_CIRCLE_TEXTURE})
      stencil.clear()
    })


    trashBtn = new PIXI.Sprite.from(ASSETS.TRASH)
    trashBtn.width = BTN_DIM*0.8
    trashBtn.height = BTN_DIM*0.8
    trashBtn.x = WINDOW_WIDTH - trashBtn.width*1.1
    trashBtn.y = trashBtn.width*0.1
    trashBtn.interactive = true
    app.stage.addChild(trashBtn)
 
    let {x,y,descriptor} = setup.props.features
    setNodes(x,y)


    stencil = new Stencil()
    stencil.lineStyle(4,0x000000)
    stencil.x = 0 
    stencil.y = 0
    app.stage.addChild(stencil)

    app.stage.addChild(initialPolygon)
    polygonObjects.push(initialPolygon)
    initialPolygon.on('pointerup',snap)
  }

  // Call load script
  load()
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame)
  app.resizable = false
};