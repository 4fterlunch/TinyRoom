import React from 'react';
import logo from './logo.svg';
import './App.css';
import {TinyRoom, ArtifactBundler} from "./components/TinyRoom";

function App() {
  var bundle = ArtifactBundler();
  bundle.pushPointZ(-1, 1, -1, "poles", "pole1");
  bundle.pushPointZ(-3, 1, -1, "poles","pole2", 0x0000ff);
  bundle.pushPointZ(-4, 1, -3, "poles","pole3", 0x0000ff);
  bundle.pushPointZ(-5, 1, 2, "poles","pole4", 0x0000ff);
  bundle.pushPointZ(-2, 2, -5,"camera","camera",0xff0000);
  bundle.pushLinestringZ([-1, -2], [1, 2], [-1,-5]);
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
