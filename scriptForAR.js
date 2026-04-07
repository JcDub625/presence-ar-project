import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

// Map each target index to its video file
const targets = [
  { index: 0, videoSrc: "./videos/Presence_p1.mp4" },
  { index: 1, videoSrc: "./videos/Presence_p6.mp4" },
  { index: 2, videoSrc: "./videos/Presence_p7.mp4" },
  { index: 3, videoSrc: "./videos/Presence_p8.mp4" },
  { index: 4, videoSrc: "./videos/Presence_p28.mp4" },
  { index: 5, videoSrc: "./videos/Presence_p29.mp4" },
  { index: 6, videoSrc: "./videos/Presence_p30.mp4" },
  { index: 7, videoSrc: "./videos/Presence_p31.mp4" },
  { index: 8, videoSrc: "./videos/Presence_p34.mp4" },
  { index: 9, videoSrc: "./videos/Presence_p36.mp4" },
  { index: 10, videoSrc: "./videos/Presence_p37.mp4" },
  { index: 11, videoSrc: "./videos/Presence_p38.mp4" },
  { index: 12, videoSrc: "./videos/Presence_p39.mp4" },
  { index: 13, videoSrc: "./videos/Presence_p43.mp4" },
  { index: 14, videoSrc: "./videos/Presence_p44.mp4" },
  { index: 15, videoSrc: "./videos/Presence_p52.mp4" },
  { index: 16, videoSrc: "./videos/Presence_p53.mp4" },
  { index: 17, videoSrc: "./videos/Presence_p55.mp4" },
  { index: 18, videoSrc: "./videos/Presence_p58.mp4" },
  { index: 19, videoSrc: "./videos/Presence_p63.mp4" }
];

const start = async () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#ar-container"),
    imageTargetSrc: "./targets.mind"
  });

  const { renderer, scene, camera } = mindarThree;
  renderer.toneMapping = THREE.NoToneMapping;

  //const anchor = mindarThree.addAnchor(0);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const imageAspectRatio = 651 / 1024; // adjust if your pages differ

  for (const target of targets) {
    const anchor = mindarThree.addAnchor(target.index);

    const video = document.createElement("video");
    video.src = target.videoSrc;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.PlaneGeometry(1, 1 / imageAspectRatio);
    const material = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    anchor.group.add(plane);

    anchor.onTargetFound = () => video.play();
    anchor.onTargetLost = () => video.pause();
  }

  await mindarThree.start();
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
};

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-screen").style.display = "none";
  start();
});