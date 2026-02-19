import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

const start = async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./targets.mind"
  });

  const { renderer, scene, camera } = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const video = document.createElement("video");
  video.src = "./DemoVideo.mp4";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  const videoTexture = new THREE.VideoTexture(video);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true });
  const plane = new THREE.Mesh(geometry, material);
  anchor.group.add(plane);

  anchor.onTargetFound = () => video.play();
  anchor.onTargetLost = () => video.pause();

  await mindarThree.start();

  renderer.setAnimationLoop(() => renderer.render(scene, camera));
};

start();
