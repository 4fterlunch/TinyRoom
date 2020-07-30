import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import React, { useState, ChangeEvent } from "react";
import { GridHelper } from "three";

type TinyRoomProps = {
  artifacts: string,
  title: string,
  width: number,
  height: number,
  background: number
}

type Position = {
  x:number,
  y:number,
  z:number
}

type Geometry = {
  type: string,
  position: Position
}


type Artifact = {
  type: string,
  geometry: Geometry,
  properties: {
    group:string,
    interactive:boolean,
    colour:number,
    size:number
  }
}

export function ArtifactBundler() {
  let _bundle:Artifact[] = [];

  return {
    pushPoint: (pos:Position, group:string, colour:number|undefined, interactive:boolean|undefined, size:number|undefined) => {
      let col:number = colour || 0x00ff00;
      let inter:boolean = interactive || false;
      let p:Artifact = {
        type: "Feature",
        geometry: {
          position: pos,
          type: "PointZ"
        },
        properties: {
          group: group,
          colour: col,
          interactive:inter,
          size: size || 1
        }
      }
      _bundle.push(p);
  },
  stringyfyBundle: () => {
    return JSON.stringify(_bundle);
  }

}
}


function parseArtifacts(artifacts:string) {
  let a:Artifact[] = JSON.parse(artifacts);
  console.log(a);
  return a;
}

function sendArtifactsToRoom(artis:Artifact[], scene:THREE.Scene) {
  for (var i = 0; i < artis.length; i++) {
    switch (artis[i].geometry.type) {
      case "PointZ":
        var point:Artifact = artis[i];
        var g = new THREE.Geometry();
        var m = new THREE.PointsMaterial({color:point.properties.colour, size:point.properties.size || 1});
        g.vertices.push(new THREE.Vector3(  
          point.geometry.position.x,
          point.geometry.position.y,
          point.geometry.position.z));
        var p = new THREE.Points(g, m);
        p.name = point.properties.group;
        scene.add(p);
        break;
    }
  }
}

export const TinyRoom = ({artifacts, title, width, height, background}:TinyRoomProps) => {
 

  var scene = new THREE.Scene();
  scene.background = new THREE.Color( background );
  
  var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();
  var controls = new OrbitControls(camera,renderer.domElement);

  var grid = new GridHelper(50,20,0xff0000);
  scene.add(grid);

  sendArtifactsToRoom(parseArtifacts(artifacts), scene);


  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    //scene.add( cube );
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame( animate );

      renderer.render( scene, camera );
    };
    animate();

  return (<div id="info">{title}
            <div id='tiny-room-container'>
            </div>
            </div>);
}