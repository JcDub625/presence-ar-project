import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

const baseUrl = "https://pub-6af8e8ef5f034d8cac96e6e40fcb727b.r2.dev";

const targets = [
  { index: 0, videoSrc: `${baseUrl}/Presence_p1.mp4` },
  { index: 1, videoSrc: `${baseUrl}/Presence_p6.mp4` },
  { index: 2, videoSrc: `${baseUrl}/Presence_p7.mp4` },
  { index: 3, videoSrc: `${baseUrl}/Presence_p8.mp4` },
  { index: 4, videoSrc: `${baseUrl}/Presence_p28.mp4` },
  { index: 5, videoSrc: `${baseUrl}/Presence_p29.mp4` },
  { index: 6, videoSrc: `${baseUrl}/Presence_p30.mp4` },
  { index: 7, videoSrc: `${baseUrl}/Presence_p31.mp4` },
  { index: 8, videoSrc: `${baseUrl}/Presence_p34.mp4` },
  { index: 9, videoSrc: `${baseUrl}/Presence_p36.mp4` },
  { index: 10, videoSrc: `${baseUrl}/Presence_p37.mp4` },
  { index: 11, videoSrc: `${baseUrl}/Presence_p38.mp4` },
  { index: 12, videoSrc: `${baseUrl}/Presence_p39.mp4` },
  { index: 13, videoSrc: `${baseUrl}/Presence_p43.mp4` },
  { index: 14, videoSrc: `${baseUrl}/Presence_p44.mp4` },
  { index: 15, videoSrc: `${baseUrl}/Presence_p52.mp4` },
  { index: 16, videoSrc: `${baseUrl}/Presence_p53.mp4` },
  { index: 17, videoSrc: `${baseUrl}/Presence_p55.mp4` },
  { index: 18, videoSrc: `${baseUrl}/Presence_p58.mp4` },
  { index: 19, videoSrc: `${baseUrl}/Presence_p63.mp4` }
];

const loadingEl = document.createElement("div");
loadingEl.style.cssText = "position:fixed;inset:0;background:black;color:white;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:1.2rem;z-index:20;";
loadingEl.textContent = "Loading animations... (0/" + targets.length + ")";

let loaded = 0;

const preloadVideo = (src) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = src;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.load();
    const done = () => {
      loaded++;
      loadingEl.textContent = `Loading animations... (${loaded}/${targets.length})`;
      resolve(video);
    };
    video.addEventListener("canplaythrough", done, { once: true });
    setTimeout(done, 20000);
  });
};

const start = async () => {
  document.body.appendChild(loadingEl);

  // Preload all videos first
  const preloadedVideos = await Promise.all(
    targets.map(t => preloadVideo(t.videoSrc))
  );

  loadingEl.textContent = "Starting camera...";

  const mindarThree = new MindARThree({
    container: document.querySelector("#ar-container"),
    imageTargetSrc: "./targets.mind"
  });

  const { renderer, scene, camera } = mindarThree;
  renderer.toneMapping = THREE.NoToneMapping;

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const imageAspectRatio = 651 / 1024;

  targets.forEach((target, i) => {
    const anchor = mindarThree.addAnchor(target.index);
    const video = preloadedVideos[i];

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.PlaneGeometry(1, 1 / imageAspectRatio);
    const material = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    anchor.group.add(plane);

    anchor.onTargetFound = () => video.play();
    anchor.onTargetLost = () => video.pause();
  });

  await mindarThree.start();
  loadingEl.remove();
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
};

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-screen").style.display = "none";
  start();
});