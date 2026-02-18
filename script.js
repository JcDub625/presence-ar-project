import * as THREE from "https://unpkg.com/three@0.150.1/build/three.module.js";
import { MindARThree } from "https://unpkg.com/mind-ar@1.2.5/dist/mindar-image-three.prod.js";

const start = async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  // Light
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Create video element
  const video = document.createElement("video");
  video.src = "./DemoVideo.mp4";
  video.loop = true;
  video.muted = true;
  video.setAttribute("playsinline", "");
  video.crossOrigin = "anonymous";

  // Create video texture
  const videoTexture = new THREE.VideoTexture(video);

  // Create plane
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true
  });

  const plane = new THREE.Mesh(geometry, material);
  anchor.group.add(plane);

  // Target events
  anchor.onTargetFound = () => {
    video.play();
  };

  anchor.onTargetLost = () => {
    video.pause();
  };

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

start();
