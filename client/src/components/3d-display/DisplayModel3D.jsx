import {useRef, useEffect, memo} from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from 'prop-types'

const DisplayModel3D = memo(({ model3D, setModelsLoading }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    const loaderTexture = new THREE.TextureLoader();
    const floorTexture = loaderTexture.load('/3DModels/ground/ground24h.png', (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    });

    const floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      transparent: true,
      alphaTest: 0.5
    });

    const floorGeometry = new THREE.PlaneGeometry(60, 28);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.set(-360, 50, 858);
    floor.rotation.y = Math.PI / 0.46;

    scene.add(floor);

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    const sunLight = new THREE.DirectionalLight(0xffd700, 2);
    sunLight.position.set(100, 50, 100);
    scene.add(sunLight);

    const loader = new GLTFLoader();
    let mixerBackground;
    let mixerPlayer;

    const loadModel = (path) => new Promise((resolve, reject) => {
      loader.load(path, resolve, undefined, reject);
    });

    Promise.all([
      loadModel(model3D.path),
      loadModel('/3DModels/background/scene.gltf'),
      loadModel('/3DModels/tv/scene.gltf')
    ]).then(([player, background, tv]) => {
      const playerScale = model3D.size;

      player.scene.position.set(10, 10, 1050);
      player.scene.scale.set(playerScale.x, playerScale.y, playerScale.z);
      
      background.scene.position.set(0, 0, 300);
      background.scene.scale.set(100, 100, 100);
      background.scene.rotation.y = Math.PI / 0.60; 
      
      tv.scene.position.set(-400,0,800);
      tv.scene.scale.set(300,300,300);
      tv.scene.rotation.y = Math.PI / 0.60;

      scene.add(player.scene);
      scene.add(tv.scene);
      scene.add(background.scene);

      // AnimationMixer for background
      mixerBackground = new THREE.AnimationMixer(background.scene);
      mixerPlayer = new THREE.AnimationMixer(player.scene);
      if (background.animations.length) {
        const action = mixerBackground.clipAction(background.animations[0]);
        action.play();
      }
      if (player.animations.length) {
        const action2 = mixerPlayer.clipAction(player.animations[0]);
        action2.play();
      }

      setModelsLoading(false);
      startCameraAnimation(camera, scene);
    });

    const clock = new THREE.Clock();
    const startCameraAnimation = (camera, scene) => {
      let transitionProgress = 0;
      const startPosition = new THREE.Vector3(50, 800, 1350);
      const endPosition = new THREE.Vector3(50, 150, 1350);
      camera.position.copy(startPosition);
      
      const animate = () => {
        requestAnimationFrame(animate);

        const delta = clock.getDelta(); 
        if (mixerBackground) mixerBackground.update(delta);
        if (mixerPlayer) mixerPlayer.update(delta);

        if (transitionProgress < 1) {
          transitionProgress += delta * 0.2; 
          const curvePosition = startPosition.clone().lerp(endPosition, transitionProgress);
          camera.position.copy(curvePosition);
          camera.lookAt(scene.position);
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    const handleResize = () => {
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
    };

    const mountNode = mountRef.current;

    window.addEventListener('resize', handleResize);

    return () => {
      mountNode.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, [model3D]);

  return <div ref={mountRef} style={{width: '100vw', height: '100vh'}}/>;
});

DisplayModel3D.propTypes = {
  model3D: PropTypes.shape({
    path: PropTypes.string.isRequired,
    size: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  modelsLoading: PropTypes.bool,
  setModelsLoading: PropTypes.func,
};

DisplayModel3D.displayName = 'DisplayModel3D';

export default DisplayModel3D;
