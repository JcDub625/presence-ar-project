import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

const container = document.createElement("div");
container.style.width = "100%";
container.style.height = "100%";
document.body.appendChild(container);

const mindarThree = new MindARThree({
  container,
  imageTargetSrc: "/targets.mind",
});

const { renderer, scene, camera } = mindarThree;

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});
const plane = new THREE.Mesh(geometry, material);

const anchor = mindarThree.addAnchor(0);
anchor.group.add(plane);

await mindarThree.start();
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
