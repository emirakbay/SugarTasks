import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

export class CubeScene {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    this._SetSceneSettings();

    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    this._RequestAnimationFrame();
  }

  _SetSceneSettings() {
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(150, 100, -100);

    const loader = new THREE.TextureLoader();
    const backgroundTexture = loader.load("https://i.imgur.com/upWSJlY.jpg");

    this._scene = new THREE.Scene();
    this._scene.background = backgroundTexture;
    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 75, 0);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xffffff, 0.25);
    this._scene.add(light);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x808080,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x00f5ff,
      })
    );
    box.position.set(0, box.geometry.parameters.height + 20, 0);
    box.name = "box";
    box.castShadow = true;
    box.receiveShadow = true;
    this._scene.add(box);
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RequestAnimationFrame() {
    requestAnimationFrame(() => {
      this._threejs.render(this._scene, this._camera);
      this._RequestAnimationFrame();

      this._MakeCubeTransformations();
    });
  }

  _MakeCubeTransformations() {
    const box = this._scene.getObjectByName("box");
    const t = (Date.now() % 4000) / 4000; // Use 4000 to cover both forward and backward motion

    // linear interpolation
    const lerp = (start, end, t) => {
      return start * (1 - t) + end * t;
    };

    // position lerp according to the time
    const x = lerp(-100, 100, Math.abs(t * 2 - 1)); // Reverse the motion when t > 0.5
    box.position.set(x, box.position.y, box.position.z);

    // scale lerp according to the position
    const scale = lerp(1, 4, Math.abs(t * 2 - 1));
    box.scale.set(scale, scale, scale)

    // rotate lerp according to the position
    const rotation = lerp(0, Math.PI * 2, Math.abs(t * 2 - 1));
    box.rotation.set(rotation, rotation, box.rotation.z);
  }
}
