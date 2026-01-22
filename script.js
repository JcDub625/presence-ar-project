const start = async () => {
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Target index 0 = first comic page
  const anchor = mindarThree.addAnchor(0);

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const plane = new THREE.Mesh(geometry, material);

  plane.position.y = 0.5;
  anchor.group.add(plane);

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

start();