const start = async () => {
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  // Create video element
  const video = document.createElement("video");
  video.src = "animation.mp4";   // Put your video file in same directory
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";

  // Create Three.js video texture
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBAFormat;

  // Create plane
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ 
    map: videoTexture,
    transparent: true
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.position.y = 0;
  anchor.group.add(plane);

  // Play video when target found
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