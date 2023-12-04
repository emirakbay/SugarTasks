import { CubeScene } from "./cubeScene.js";
import { ShaderScene } from "./shaderScene.js";
import { ShaderScene2 } from "./shaderScene2.js";

let _APP = null;
window.addEventListener("DOMContentLoaded", () => {
  const button = document.createElement("button");
  button.innerHTML = "Cube Scene";
  button.style.padding = "10px";
  button.addEventListener("click", () => {
    _APP = null;
    document.body.removeChild(document.body.lastChild);
    _APP = new CubeScene();
  });
  document.body.appendChild(button);

  const shaderButton = document.createElement("button");
  shaderButton.innerHTML = "Shader Scene";
  shaderButton.style.padding = "10px";
  shaderButton.addEventListener("click", () => {
    _APP = null;
    document.body.removeChild(document.body.lastChild);
    _APP = new ShaderScene();
  });
  document.body.appendChild(shaderButton);

  const shaderButton2 = document.createElement("button");
  shaderButton2.innerHTML = "Shader Scene 2";
  shaderButton2.style.padding = "10px";
  shaderButton2.addEventListener("click", () => {
    _APP = null;
    document.body.removeChild(document.body.lastChild);
    _APP = new ShaderScene2();
  });
  document.body.appendChild(shaderButton2);

  // this doesn't do anything, but it's here to show that the
  // cube scene doesn't work if the button is created after the
  // cube scene is created
  const cubeButton = document.createElement("button");
  cubeButton.style.visibility = "hidden";
  document.body.appendChild(cubeButton);
});
