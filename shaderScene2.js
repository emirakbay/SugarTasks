import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

const _VS = `
varying vec3 vNormal;
varying vec3 vPosition;  // Add vPosition as a varying variable

uniform float uTime;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;  // Pass the position as a varying variable
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const _FS = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform float uTime;

void main() {
    // Map the normal vector components to the range [0, 1]
    vec3 normalizedNormal = normalize(vNormal);

    // Calculate a more realistic wave pattern based on time, normalized normal, and fragment position
    float waveX = 0.01 + 0.9 * sin(uTime + 2.0 * normalizedNormal.x - 0.2 * vPosition.y);
    float waveY = 2.2 + 1.2 * sin(uTime + 10.0 * normalizedNormal.y + 0.6 * vPosition.x + 0.1 * vPosition.z);

    // Combine wave patterns for a more realistic moving wave effect
    float movingWave = 0.6 * (waveX + waveY);

    // Adjust colors for an ocean-like appearance
    vec3 deepBlue = vec3(0.0, 0.05, 0.1);
    vec3 lightBlue = vec3(0.2, 0.5, 0.8);

    // Interpolate between deep blue and light blue based on the moving wave intensity
    vec3 color = mix(deepBlue, lightBlue, movingWave);

    // Apply some ambient lighting
    vec3 ambientColor = vec3(0.5, 0.5, 1.5);
    color *= ambientColor;

    gl_FragColor = vec4(color, 1.0);
}
`;

export class ShaderScene2 {
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

    window.addEventListener(
      "mousemove",
      (e) => {
        this._OnMouseMove(e);
      },
      false
    );

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();

    const loader = new THREE.TextureLoader();
    const backgroundTexture = loader.load("https://i.imgur.com/upWSJlY.jpg");
    this._scene.background = backgroundTexture;

    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(20, 100, 10);
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

    light = new THREE.AmbientLight(0x101010);
    this._scene.add(light);

    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(15, 32, 32),
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: _VS,
        fragmentShader: _FS,
      })
    );
    sphere.name = "sphere";
    sphere.position.set(0, 15, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this._scene.add(sphere);

    this._RequestAnimationFrame();
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _OnMouseMove(event) {
    const mouse = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this._camera);
    const intersects = raycaster.intersectObjects(this._scene.children);
    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (obj.name == "sphere") {
        obj.material.uniforms.uTime.value += 0.3;
        obj.material.uniforms.uTime.needsUpdate = true;
      }
    }
  }

  _RequestAnimationFrame() {
    requestAnimationFrame(() => {
      const material = this._scene.getObjectByName("sphere").material;
      material.uniforms.uTime.value += 0.01;
      material.uniforms.uTime.needsUpdate = true;

      this._threejs.render(this._scene, this._camera);
      this._RequestAnimationFrame();
    });
  }
}
