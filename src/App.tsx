import React from 'react';
import logo from './logo.svg';
import './App.css';
import {TinyRoom, ArtifactBundler} from "./components/TinyRoom";

function App() {
  var bundle = ArtifactBundler();
  for (var j = 0; j < 1000; j++)
    bundle.pushPoint({x: Math.random()*15, y: Math.random()*10, z:1- Math.random()*15},"Poles",Math.random()*10**7, false, Math.random()/2);
  return (
    <div className="App">

      <TinyRoom 
          height={window.innerHeight}
          width={window.innerWidth}
          background={0xffffff}
          title={"test"}
          artifacts={bundle.stringyfyBundle()}  />
    </div>
  );
}

export default App;
