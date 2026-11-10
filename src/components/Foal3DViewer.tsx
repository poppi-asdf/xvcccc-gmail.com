import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FoalColor, HatAccessory, OutfitAccessory, FoalActivity, FoalStats } from '../types';

interface Foal3DViewerProps {
  color: FoalColor;
  hat: HatAccessory;
  outfit: OutfitAccessory;
  activity: FoalActivity;
  stats: FoalStats;
  isPetting: boolean;
  onPet: () => void;
  className?: string;
}

export const Foal3DViewer: React.FC<Foal3DViewerProps> = ({
  color,
  hat,
  outfit,
  activity,
  stats,
  isPetting,
  onPet,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to dynamic 3D parts for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const foalGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const neckGroupRef = useRef<THREE.Group | null>(null);
  const tailRef = useRef<THREE.Group | null>(null);
  const leftEarRef = useRef<THREE.Mesh | null>(null);
  const rightEarRef = useRef<THREE.Mesh | null>(null);
  const legFLRef = useRef<THREE.Group | null>(null);
  const legFRRef = useRef<THREE.Group | null>(null);
  const legBLRef = useRef<THREE.Group | null>(null);
  const legBRRef = useRef<THREE.Group | null>(null);

  // Eyes
  const leftEyeLidRef = useRef<THREE.Mesh | null>(null);
  const rightEyeLidRef = useRef<THREE.Mesh | null>(null);
  const leftPupilRef = useRef<THREE.Mesh | null>(null);
  const rightPupilRef = useRef<THREE.Mesh | null>(null);

  // Accessories groups
  const hatGroupRef = useRef<THREE.Group | null>(null);
  const outfitGroupRef = useRef<THREE.Group | null>(null);

  // Materials to update when color changes
  const materialsRef = useRef<{
    body: THREE.MeshStandardMaterial;
    mane: THREE.MeshStandardMaterial;
    muzzle: THREE.MeshStandardMaterial;
    hoof: THREE.MeshStandardMaterial;
    blush: THREE.Material;
    spot?: THREE.MeshStandardMaterial;
  } | null>(null);

  // Prop refs for animate loop without recreation
  const activityRef = useRef(activity);
  activityRef.current = activity;
  const isPettingRef = useRef(isPetting);
  isPettingRef.current = isPetting;
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const onPetRef = useRef(onPet);
  onPetRef.current = onPet;

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.8, 1.8, 3.6);
    camera.lookAt(0, 0.9, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0xb45309, 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    dirLight.position.set(4, 6, 4);
    dirLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 15;
      dirLight.shadow.camera.left = -2;
      dirLight.shadow.camera.right = 2;
      dirLight.shadow.camera.top = 2;
      dirLight.shadow.camera.bottom = -2;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // 6. Orbit Controls (Gentle drag to rotate 3D foal!)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.2;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't flip below floor
    controls.target.set(0, 0.9, 0);

    // 7. Contact Shadow Grounding
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    scene.add(shadowMesh);

    // 8. ASSEMBLE PROCEDURAL 3D BABY FOAL (12-PART HIERARCHY)
    const foalGroup = new THREE.Group();
    foalGroup.position.set(0, 0, 0);
    scene.add(foalGroup);
    foalGroupRef.current = foalGroup;

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x8d4925,
      roughness: 0.65,
      metalness: 0.05,
    });
    const maneMat = new THREE.MeshStandardMaterial({
      color: 0x421e0e,
      roughness: 0.5,
      metalness: 0.1,
    });
    const muzzleMat = new THREE.MeshStandardMaterial({
      color: 0xe4a87c,
      roughness: 0.7,
      metalness: 0.02,
    });
    const hoofMat = new THREE.MeshStandardMaterial({
      color: 0x382012,
      roughness: 0.4,
      metalness: 0.2,
    });
    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0.55,
    });
    const spotMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.05,
    });

    materialsRef.current = {
      body: bodyMat,
      mane: maneMat,
      muzzle: muzzleMat,
      hoof: hoofMat,
      blush: blushMat,
      spot: spotMat,
    };

    // (1) Torso (Plump cute baby belly)
    const torsoGeo = new THREE.SphereGeometry(0.55, 24, 20);
    torsoGeo.scale(1, 0.85, 1.25);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
    torsoMesh.position.set(0, 0.85, 0);
    torsoMesh.castShadow = !isSoftwareGl;
    torsoMesh.receiveShadow = !isSoftwareGl;
    foalGroup.add(torsoMesh);

    // Belly fluff patch
    const bellyGeo = new THREE.SphereGeometry(0.48, 16, 16);
    bellyGeo.scale(0.8, 0.6, 0.9);
    const bellyMesh = new THREE.Mesh(bellyGeo, muzzleMat);
    bellyMesh.position.set(0, 0.76, 0.05);
    foalGroup.add(bellyMesh);

    // (2) Neck
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.05, 0.45);
    foalGroup.add(neckGroup);
    neckGroupRef.current = neckGroup;

    const neckGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.5, 16);
    neckGeo.rotateX(Math.PI / 6);
    const neckMesh = new THREE.Mesh(neckGeo, bodyMat);
    neckMesh.castShadow = !isSoftwareGl;
    neckGroup.add(neckMesh);

    // Mane on neck
    for (let i = 0; i < 4; i++) {
      const maneLock = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        maneMat
      );
      maneLock.scale.set(0.6, 1.2, 0.9);
      maneLock.position.set(0, -0.15 + i * 0.12, -0.15 - i * 0.05);
      neckGroup.add(maneLock);
    }

    // (3) Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.28, 0.22);
    neckGroup.add(headGroup);
    headGroupRef.current = headGroup;

    // Head base (Chubby baby foal cheeks)
    const headGeo = new THREE.SphereGeometry(0.38, 24, 20);
    headGeo.scale(1, 0.95, 1.05);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.castShadow = !isSoftwareGl;
    headGroup.add(headMesh);

    // Forelock (Bang hair)
    const forelock = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), maneMat);
    forelock.scale.set(0.7, 1.3, 0.8);
    forelock.position.set(0, 0.32, 0.22);
    forelock.rotation.x = Math.PI / 5;
    headGroup.add(forelock);

    // Muzzle / Snout
    const muzzleGeo = new THREE.SphereGeometry(0.26, 20, 16);
    muzzleGeo.scale(0.85, 0.72, 1.15);
    const muzzleMesh = new THREE.Mesh(muzzleGeo, muzzleMat);
    muzzleMesh.position.set(0, -0.1, 0.32);
    muzzleMesh.castShadow = !isSoftwareGl;
    headGroup.add(muzzleMesh);

    // Nostrils
    const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x3d1a08 });
    const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), nostrilMat);
    nostrilL.position.set(0.08, -0.06, 0.58);
    headGroup.add(nostrilL);
    const nostrilR = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), nostrilMat);
    nostrilR.position.set(-0.08, -0.06, 0.58);
    headGroup.add(nostrilR);

    // Cheeks Blush
    const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), blushMat);
    blushL.scale.set(1, 0.8, 0.4);
    blushL.position.set(0.28, -0.08, 0.2);
    blushL.rotation.y = Math.PI / 4;
    headGroup.add(blushL);

    const blushR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), blushMat);
    blushR.scale.set(1, 0.8, 0.4);
    blushR.position.set(-0.28, -0.08, 0.2);
    blushR.rotation.y = -Math.PI / 4;
    headGroup.add(blushR);

    // Ears
    const earGeo = new THREE.ConeGeometry(0.1, 0.3, 12);
    earGeo.rotateZ(Math.PI / 10);

    const leftEar = new THREE.Mesh(earGeo, bodyMat);
    leftEar.position.set(0.2, 0.38, -0.05);
    leftEar.rotation.set(0.1, 0.2, 0.3);
    headGroup.add(leftEar);
    leftEarRef.current = leftEar;

    const rightEar = new THREE.Mesh(earGeo, bodyMat);
    rightEar.position.set(-0.2, 0.38, -0.05);
    rightEar.rotation.set(0.1, -0.2, -0.3);
    headGroup.add(rightEar);
    rightEarRef.current = rightEar;

    // (4) Big Expressive Anime 3D Eyes
    const createEye = (isLeft: boolean) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(isLeft ? 0.26 : -0.26, 0.08, 0.24);
      eyeGroup.rotation.y = isLeft ? Math.PI / 5 : -Math.PI / 5;

      // Sclera (White)
      const whiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.0,
      });
      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), whiteMat);
      eyeWhite.scale.set(0.5, 1, 1);
      eyeGroup.add(eyeWhite);

      // Pupil / Iris
      const pupilMat = new THREE.MeshStandardMaterial({
        color: 0x1e150f,
        roughness: 0.1,
      });
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), pupilMat);
      pupil.position.set(isLeft ? 0.02 : -0.02, 0, 0.05);
      pupil.scale.set(0.5, 1, 1);
      eyeGroup.add(pupil);

      // Eye highlight (Sparkle)
      const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const shine1 = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), shineMat);
      shine1.position.set(isLeft ? 0.03 : -0.01, 0.035, 0.1);
      eyeGroup.add(shine1);

      const shine2 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), shineMat);
      shine2.position.set(isLeft ? 0.01 : -0.03, -0.025, 0.09);
      eyeGroup.add(shine2);

      // Eyelid for blinking and sleeping
      const lidMat = new THREE.MeshStandardMaterial({
        color: 0x8d4925,
        roughness: 0.65,
      });
      const eyelid = new THREE.Mesh(
        new THREE.SphereGeometry(0.115, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        lidMat
      );
      eyelid.position.set(0, 0.01, 0);
      eyelid.rotation.x = -Math.PI / 2; // Open by default
      eyeGroup.add(eyelid);

      return { eyeGroup, eyelid, pupil };
    };

    const eyeL = createEye(true);
    headGroup.add(eyeL.eyeGroup);
    leftEyeLidRef.current = eyeL.eyelid;
    leftPupilRef.current = eyeL.pupil;

    const eyeR = createEye(false);
    headGroup.add(eyeR.eyeGroup);
    rightEyeLidRef.current = eyeR.eyelid;
    rightPupilRef.current = eyeR.pupil;

    // (5) Four Cute Baby Legs with Hooves
    const createLeg = (x: number, z: number) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(x, 0.7, z);

      // Upper leg
      const upperGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.38, 12);
      const upperMesh = new THREE.Mesh(upperGeo, bodyMat);
      upperMesh.position.y = -0.15;
      upperMesh.castShadow = !isSoftwareGl;
      legGroup.add(upperMesh);

      // Lower leg
      const lowerGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.34, 12);
      const lowerMesh = new THREE.Mesh(lowerGeo, bodyMat);
      lowerMesh.position.y = -0.42;
      lowerMesh.castShadow = !isSoftwareGl;
      legGroup.add(lowerMesh);

      // Hoof
      const hoofGeo = new THREE.CylinderGeometry(0.075, 0.1, 0.12, 12);
      const hoofMesh = new THREE.Mesh(hoofGeo, hoofMat);
      hoofMesh.position.y = -0.62;
      hoofMesh.castShadow = !isSoftwareGl;
      legGroup.add(hoofMesh);

      foalGroup.add(legGroup);
      return legGroup;
    };

    legFLRef.current = createLeg(0.24, 0.36);
    legFRRef.current = createLeg(-0.24, 0.36);
    legBLRef.current = createLeg(0.24, -0.38);
    legBRRef.current = createLeg(-0.24, -0.38);

    // (6) Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.9, -0.55);
    foalGroup.add(tailGroup);
    tailRef.current = tailGroup;

    for (let i = 0; i < 3; i++) {
      const tailSegment = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), maneMat);
      tailSegment.scale.set(0.7, 1.4, 0.8);
      tailSegment.position.set(0, -i * 0.15, -i * 0.08);
      tailSegment.rotation.x = -Math.PI / 6;
      tailSegment.castShadow = !isSoftwareGl;
      tailGroup.add(tailSegment);
    }

    // Groups for accessories
    const hatGroup = new THREE.Group();
    headGroup.add(hatGroup);
    hatGroupRef.current = hatGroup;

    const outfitGroup = new THREE.Group();
    foalGroup.add(outfitGroup);
    outfitGroupRef.current = outfitGroup;

    // 9. Raycasting for Petting when clicking 3D Foal
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(foalGroup.children, true);
      if (intersects.length > 0) {
        onPetRef.current();
      }
    };

    container.addEventListener('click', handlePointerDown);

    // 10. Animation Loop with Kinematics
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;
    let frameId = 0;

    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      controls.update();

      const act = activityRef.current;
      const pet = isPettingRef.current;
      const st = statsRef.current;

      // Eye blinking logic
      blinkTimer += delta;
      if (act === 'sleeping') {
        // Closed eyes during sleep
        if (leftEyeLidRef.current) leftEyeLidRef.current.rotation.x = 0;
        if (rightEyeLidRef.current) rightEyeLidRef.current.rotation.x = 0;
      } else {
        if (blinkTimer > 3.2) {
          isBlinking = true;
          if (blinkTimer > 3.36) {
            isBlinking = false;
            blinkTimer = 0;
          }
        }
        const lidTarget = isBlinking ? 0 : -Math.PI / 2;
        if (leftEyeLidRef.current) {
          leftEyeLidRef.current.rotation.x = THREE.MathUtils.damp(
            leftEyeLidRef.current.rotation.x,
            lidTarget,
            24,
            delta
          );
        }
        if (rightEyeLidRef.current) {
          rightEyeLidRef.current.rotation.x = THREE.MathUtils.damp(
            rightEyeLidRef.current.rotation.x,
            lidTarget,
            24,
            delta
          );
        }
      }

      // Tail wagging
      if (tailRef.current) {
        const wagSpeed = pet || act === 'playing_ball' ? 12 : 3;
        const wagAmp = pet ? 0.35 : 0.15;
        tailRef.current.rotation.y = Math.sin(elapsed * wagSpeed) * wagAmp;
        tailRef.current.rotation.z = Math.cos(elapsed * (wagSpeed * 0.5)) * 0.08;
      }

      // Ear twitches
      if (leftEarRef.current && rightEarRef.current) {
        const twitch = Math.sin(elapsed * 2) > 0.85 ? Math.sin(elapsed * 18) * 0.15 : 0;
        leftEarRef.current.rotation.x = 0.1 + twitch;
        rightEarRef.current.rotation.x = 0.1 - twitch;
      }

      // Body animations per activity
      if (foalGroupRef.current) {
        if (act === 'sleeping') {
          // Curled up sleeping pose on ground
          foalGroupRef.current.position.y = THREE.MathUtils.damp(
            foalGroupRef.current.position.y,
            -0.35,
            6,
            delta
          );
          foalGroupRef.current.rotation.z = THREE.MathUtils.damp(
            foalGroupRef.current.rotation.z,
            0.25,
            4,
            delta
          );
          foalGroupRef.current.rotation.y = THREE.MathUtils.damp(
            foalGroupRef.current.rotation.y,
            0.4,
            4,
            delta
          );

          // Deep breathing oscillation
          const breath = Math.sin(elapsed * 1.8) * 0.02;
          foalGroupRef.current.scale.set(1 + breath, 1 + breath, 1 + breath);

          // Fold legs
          if (legFLRef.current) legFLRef.current.rotation.x = -1.2;
          if (legFRRef.current) legFRRef.current.rotation.x = -1.1;
          if (legBLRef.current) legBLRef.current.rotation.x = 1.2;
          if (legBRRef.current) legBRRef.current.rotation.x = 1.1;
        } else if (act === 'resting_sofa') {
          // Sitting on sofa
          foalGroupRef.current.position.y = THREE.MathUtils.damp(
            foalGroupRef.current.position.y,
            -0.2,
            6,
            delta
          );
          foalGroupRef.current.rotation.z = 0;
          foalGroupRef.current.rotation.y = THREE.MathUtils.damp(
            foalGroupRef.current.rotation.y,
            -0.3,
            4,
            delta
          );
          if (legFLRef.current) legFLRef.current.rotation.x = -0.7;
          if (legFRRef.current) legFRRef.current.rotation.x = -0.7;
          if (legBLRef.current) legBLRef.current.rotation.x = 0.8;
          if (legBRRef.current) legBRRef.current.rotation.x = 0.8;
        } else if (act === 'playing_ball' || act === 'playing_balloon') {
          // Bouncing happily
          const bounce = Math.abs(Math.sin(elapsed * 7)) * 0.18;
          foalGroupRef.current.position.y = bounce;
          foalGroupRef.current.rotation.z = Math.sin(elapsed * 6) * 0.08;
          foalGroupRef.current.rotation.y = Math.sin(elapsed * 3) * 0.3;

          // Running legs
          const legSwing = Math.sin(elapsed * 10) * 0.45;
          if (legFLRef.current) legFLRef.current.rotation.x = legSwing;
          if (legFRRef.current) legFRRef.current.rotation.x = -legSwing;
          if (legBLRef.current) legBLRef.current.rotation.x = -legSwing;
          if (legBRRef.current) legBRRef.current.rotation.x = legSwing;
        } else if (act === 'eating') {
          // Head bobbing down & chewing
          foalGroupRef.current.position.y = 0;
          foalGroupRef.current.rotation.z = 0;
          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = 0.3 + Math.sin(elapsed * 8) * 0.15;
          }
          if (legFLRef.current) legFLRef.current.rotation.x = 0;
          if (legFRRef.current) legFRRef.current.rotation.x = 0;
          if (legBLRef.current) legBLRef.current.rotation.x = 0;
          if (legBRRef.current) legBRRef.current.rotation.x = 0;
        } else {
          // Standing Idle
          const idleBreath = Math.sin(elapsed * 2.5) * 0.03;
          foalGroupRef.current.position.y = THREE.MathUtils.damp(
            foalGroupRef.current.position.y,
            idleBreath,
            8,
            delta
          );
          foalGroupRef.current.rotation.z = THREE.MathUtils.damp(
            foalGroupRef.current.rotation.z,
            0,
            6,
            delta
          );
          foalGroupRef.current.rotation.y = THREE.MathUtils.damp(
            foalGroupRef.current.rotation.y,
            0,
            4,
            delta
          );

          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = THREE.MathUtils.damp(
              headGroupRef.current.rotation.x,
              Math.sin(elapsed * 1.5) * 0.06,
              6,
              delta
            );
            headGroupRef.current.rotation.y = THREE.MathUtils.damp(
              headGroupRef.current.rotation.y,
              Math.sin(elapsed * 0.8) * 0.1,
              4,
              delta
            );
          }

          if (legFLRef.current) legFLRef.current.rotation.x = 0;
          if (legFRRef.current) legFRRef.current.rotation.x = 0;
          if (legBLRef.current) legBLRef.current.rotation.x = 0;
          if (legBRRef.current) legBRRef.current.rotation.x = 0;
        }
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handlePointerDown);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement.parentElement);
      }
    };
  }, []);

  // Update Coat Color
  useEffect(() => {
    if (!materialsRef.current) return;
    const { body, mane, muzzle, hoof, spot } = materialsRef.current;

    switch (color) {
      case 'white':
        body.color.setHex(0xf8fafc);
        mane.color.setHex(0xcbd5e1);
        muzzle.color.setHex(0xfce7f3);
        hoof.color.setHex(0x64748b);
        break;
      case 'black':
        body.color.setHex(0x26262e);
        mane.color.setHex(0x111115);
        muzzle.color.setHex(0x4b4b58);
        hoof.color.setHex(0x09090b);
        break;
      case 'cream':
        body.color.setHex(0xfde047);
        mane.color.setHex(0xfef9c3);
        muzzle.color.setHex(0xffedd5);
        hoof.color.setHex(0x854d0e);
        break;
      case 'spotted':
        body.color.setHex(0x9a5028);
        mane.color.setHex(0x3e1c0a);
        muzzle.color.setHex(0xfce7f3);
        hoof.color.setHex(0x351c0f);
        break;
      case 'brown':
      default:
        body.color.setHex(0x8d4925);
        mane.color.setHex(0x421e0e);
        muzzle.color.setHex(0xe4a87c);
        hoof.color.setHex(0x382012);
        break;
    }
  }, [color]);

  // Update Hat 3D Accessory
  useEffect(() => {
    const hatGroup = hatGroupRef.current;
    if (!hatGroup) return;

    // Clear existing hat
    while (hatGroup.children.length > 0) {
      const child = hatGroup.children[0];
      hatGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (hat === 'none') return;

    if (hat === 'straw_hat') {
      const sGroup = new THREE.Group();
      sGroup.position.set(0, 0.44, 0.05);

      // Brim
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.03, 24),
        new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.8 })
      );
      sGroup.add(brim);

      // Crown dome
      const crown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.28, 0.18, 20),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.85 })
      );
      crown.position.y = 0.09;
      sGroup.add(crown);

      // Red ribbon band
      const ribbon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.285, 0.285, 0.05, 20),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 })
      );
      ribbon.position.y = 0.04;
      sGroup.add(ribbon);

      hatGroup.add(sGroup);
    } else if (hat === 'crown') {
      const cGroup = new THREE.Group();
      cGroup.position.set(0, 0.46, 0.05);

      // Gold crown body
      const crownMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.16, 0.18, 6),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          metalness: 0.85,
          roughness: 0.25,
        })
      );
      cGroup.add(crownMesh);

      // Jewels
      const rubyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.1 });
      const sapphireMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.1 });
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const gem = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          i % 2 === 0 ? rubyMat : sapphireMat
        );
        gem.position.set(Math.cos(angle) * 0.19, 0.09, Math.sin(angle) * 0.19);
        cGroup.add(gem);
      }

      hatGroup.add(cGroup);
    } else if (hat === 'flower') {
      const fGroup = new THREE.Group();
      fGroup.position.set(0, 0.4, 0.05);

      // Floral ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.26, 0.03, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0x22c55e })
      );
      ring.rotation.x = Math.PI / 2;
      fGroup.add(ring);

      // Colorful flowers around wreath
      const colors = [0xf472b6, 0xfde047, 0x60a5fa, 0xfb923c];
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const fl = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          new THREE.MeshStandardMaterial({ color: colors[i % colors.length] })
        );
        fl.position.set(Math.cos(ang) * 0.26, 0.04, Math.sin(ang) * 0.26);
        fGroup.add(fl);
      }

      hatGroup.add(fGroup);
    } else if (hat === 'cowboy') {
      const cbGroup = new THREE.Group();
      cbGroup.position.set(0, 0.44, 0.05);

      // Curled Brim
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.03, 24),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
      );
      brim.scale.set(0.85, 1, 1.25);
      cbGroup.add(brim);

      // Crown
      const crown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.28, 0.22, 16),
        new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.65 })
      );
      crown.position.y = 0.11;
      cbGroup.add(crown);

      // Star badge
      const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 })
      );
      star.position.set(0, 0.08, 0.29);
      cbGroup.add(star);

      hatGroup.add(cbGroup);
    }
  }, [hat]);

  // Update Outfit 3D Accessory
  useEffect(() => {
    const outfitGroup = outfitGroupRef.current;
    if (!outfitGroup) return;

    while (outfitGroup.children.length > 0) {
      const child = outfitGroup.children[0];
      outfitGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (outfit === 'none') return;

    if (outfit === 'red_scarf') {
      const sGroup = new THREE.Group();
      sGroup.position.set(0, 1.05, 0.35);

      // Collar knot
      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.06, 12, 24),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 })
      );
      collar.rotation.x = Math.PI / 3;
      sGroup.add(collar);

      // Triangle drape
      const drape = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.28, 4),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 })
      );
      drape.rotation.y = Math.PI / 4;
      drape.rotation.x = Math.PI / 6;
      drape.position.set(0, -0.16, 0.28);
      sGroup.add(drape);

      outfitGroup.add(sGroup);
    } else if (outfit === 'bell_necklace') {
      const bGroup = new THREE.Group();
      bGroup.position.set(0, 1.05, 0.35);

      // Leather collar
      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.04, 12, 24),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
      );
      collar.rotation.x = Math.PI / 3;
      bGroup.add(collar);

      // Shiny Gold Bell
      const bell = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          metalness: 0.9,
          roughness: 0.2,
        })
      );
      bell.position.set(0, -0.15, 0.26);
      bGroup.add(bell);

      outfitGroup.add(bGroup);
    } else if (outfit === 'blue_vest') {
      const vGroup = new THREE.Group();
      vGroup.position.set(0, 0.88, 0.05);

      // Vest shell over torso
      const vest = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.58, 0.55, 20, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0x2563eb,
          roughness: 0.6,
          side: THREE.DoubleSide,
        })
      );
      vest.scale.set(1.02, 1, 1.15);
      vGroup.add(vest);

      // Golden buttons
      const btnMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 });
      for (let i = 0; i < 3; i++) {
        const btn = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), btnMat);
        btn.position.set(0, 0.15 - i * 0.14, 0.62);
        vGroup.add(btn);
      }

      outfitGroup.add(vGroup);
    } else if (outfit === 'rainbow_cape') {
      const cGroup = new THREE.Group();
      cGroup.position.set(0, 1.05, 0.2);

      // Cape drape plane with procedural rainbow gradient
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const rGrad = ctx.createLinearGradient(0, 0, 64, 0);
      rGrad.addColorStop(0, '#EF4444');
      rGrad.addColorStop(0.25, '#F59E0B');
      rGrad.addColorStop(0.5, '#10B981');
      rGrad.addColorStop(0.75, '#3B82F6');
      rGrad.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = rGrad;
      ctx.fillRect(0, 0, 64, 128);

      const capeTex = new THREE.CanvasTexture(canvas);
      capeTex.colorSpace = THREE.SRGBColorSpace;
      const capeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.85, 0.95, 6, 6),
        new THREE.MeshStandardMaterial({
          map: capeTex,
          side: THREE.DoubleSide,
          roughness: 0.4,
        })
      );
      capeMesh.position.set(0, -0.2, -0.5);
      capeMesh.rotation.x = Math.PI / 4;
      cGroup.add(capeMesh);

      outfitGroup.add(cGroup);
    }
  }, [outfit]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}
      title="마우스나 터치로 드래그하면 3D 아기 말을 360도 둘러볼 수 있어요! (클릭하면 쓰다듬기)"
    />
  );
};
