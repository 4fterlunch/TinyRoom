/**
 * 
 _______           ___                
/_  __(_)__  __ __/ _ \___  ___  __ _ 
 / / / / _ \/ // / , _/ _ \/ _ \/  ' \
/_/ /_/_//_/\_, /_/|_|\___/\___/_/_/_/
           /___/                      
* 
* @author Michael Holmes
* @description A tiny 3d room component. The Simple 
*              principle is 'only send what you need'
*              
* 
*/

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
  vertices: Position[]
}


type Artifact = {
  type: string,
  geometry: Geometry,
  properties: {
    group:string,
    label:string,
    interactive:boolean,
    colour:number,
    size:number
  }
}

export type pushPointZParams = {
  x: number,
  y: number,
  z: number,
  group: string | undefined,
  label: string | undefined,
  colour: number | undefined,
  interactive:boolean | undefined,
  size: number | undefined
}

export type pushLinestringZParams = {
  x:number[],
  y:number[],
  z:number[],
  group: string | undefined,
  label: string | undefined,
  colour: number | undefined,
  interactive:boolean | undefined
}


export function ArtifactBundler() {
  let _bundle:Artifact[] = [];

  return {
    pushPointZ: (x:number, y:number, z:number, group?:string, label?:string, colour?:number, interactive?:boolean, size?:number) => {
      let pos:Position = {
        x: x,
        y: y,
        z: z
      }
      let p:Artifact = {
        type: "Feature",
        geometry: {
          vertices: [pos],
          type: "PointZ"
        },
        properties: {
          group: group || "undefined",
          colour: colour || 0x00ff00,
          interactive:interactive || false,
          size: size || 0.3,
          label: label || ""
        }
      }
      _bundle.push(p);
  },
  pushLinestringZ: (x:number[], y:number[], z:number[], group?:string, label?:string, colour?:number, interactive?:boolean) => {
    let pos:Position[] = [];
    for (var i = 0; i < x.length; i++)
      pos.push({x: x[i], y: y[i], z: z[i]});
    let l:Artifact = {
      type: "Feature",
      geometry: {
        vertices: pos,
        type: "LinestringZ"
      },
      properties: {
        group:group || "undefined",
        colour:colour || 0x00ff00,
        interactive:interactive || false,
        label:label || "",
        size: -1
      }
    }
    _bundle.push(l);
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

function sendArtifactsToObject(artis:Artifact[], object:THREE.Object3D) {
  for (var i = 0; i < artis.length; i++) {
    switch (artis[i].geometry.type) {
      case "PointZ":
        var point:Artifact = artis[i];
        var g = new THREE.Geometry();
        var m = new THREE.PointsMaterial({color:point.properties.colour, size:point.properties.size || 1});
        g.vertices.push(new THREE.Vector3(  
          point.geometry.vertices[0].x,
          point.geometry.vertices[0].y,
          point.geometry.vertices[0].z));
        var p = new THREE.Points(g, m);
        p.userData = point.properties;
        object.add(p);
        break;
      case "LinestringZ":
          var line:Artifact = artis[i];
          var lineg = new THREE.Geometry();
          var linem = new THREE.LineBasicMaterial({color:line.properties.colour});
          for (var j = 0; j < line.geometry.vertices.length; j++) {
            var v:Position = line.geometry.vertices[j];
            lineg.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
          }
          var line3 = new THREE.Line(lineg,linem);
          line3.userData = line.properties;
          object.add(line3);
          break;
    }
    

  }
}

export const TinyRoom = ({artifacts, title, width, height, background}:TinyRoomProps) => {
 

  var scene = new THREE.Scene();
  scene.background = new THREE.Color( background );
  
  var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({antialias:true});
  var controls = new OrbitControls(camera,renderer.domElement);
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  

  var grid = new GridHelper(50,20,0xff0000);
  scene.add(grid);

  sendArtifactsToObject(parseArtifacts(artifacts), grid);


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