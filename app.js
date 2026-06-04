import * as THREE from 'https://esm.sh/three@0.160.0';

import { OrbitControls }
from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#c');
const info = document.querySelector('#info');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08111f);
scene.fog = new THREE.Fog(0x08111f, 18, 45);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(9, 7, 11);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.2, 0);

const textureLoader = new THREE.TextureLoader();
const labTexture = textureLoader.load('./Textures/lab-grid.svg');
labTexture.wrapS = THREE.RepeatWrapping;
labTexture.wrapT = THREE.RepeatWrapping;
labTexture.repeat.set(4, 4);

const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0x9be7ff, 1.6);
keyLight.position.set(6, 10, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xff7a59, 1.7, 30);
rimLight.position.set(-6, 4, -4);
scene.add(rimLight);

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(36, 36),
	new THREE.MeshStandardMaterial({ map: labTexture, color: 0xb7d8ff, roughness: 0.95, metalness: 0.05 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const wallBack = new THREE.Mesh(
	new THREE.PlaneGeometry(36, 12),
	new THREE.MeshStandardMaterial({ color: 0x0f1a2c, roughness: 0.98, metalness: 0 })
);
wallBack.position.set(0, 6, -9);
scene.add(wallBack);

const wallLeft = new THREE.Mesh(
	new THREE.PlaneGeometry(36, 12),
	new THREE.MeshStandardMaterial({ color: 0x0c1624, roughness: 1, metalness: 0 })
);
wallLeft.rotation.y = Math.PI / 2;
wallLeft.position.set(-9, 6, 0);
scene.add(wallLeft);

const labGroup = new THREE.Group();
scene.add(labGroup);

const robot = new THREE.Group();
const robotBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x5fd7ff, metalness: 0.25, roughness: 0.35 });
const robotDarkMaterial = new THREE.MeshStandardMaterial({ color: 0x1c2433, metalness: 0.45, roughness: 0.75 });
robotBodyMaterial.emissive = new THREE.Color(0x000000);
robotDarkMaterial.emissive = new THREE.Color(0x000000);

const robotBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.8, 1.1), robotBodyMaterial);
robotBody.castShadow = true;
robotBody.position.y = 1.4;
robot.add(robotBody);

const robotHead = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 0.9), robotDarkMaterial);
robotHead.castShadow = true;
robotHead.position.set(0, 2.55, 0);
robot.add(robotHead);

const robotAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16), robotDarkMaterial);
robotAntenna.position.set(0, 3.25, 0);
robotAntenna.castShadow = true;
robot.add(robotAntenna);

const robotAntennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffcf5a, emissive: 0x553300, emissiveIntensity: 0.5 }));
robotAntennaTip.position.set(0, 3.75, 0);
robot.add(robotAntennaTip);

const robotEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x36d8ff, emissiveIntensity: 1.8 }));
robotEyeL.position.set(-0.22, 2.62, 0.46);
robot.add(robotEyeL);

const robotEyeR = robotEyeL.clone();
robotEyeR.position.x = 0.22;
robot.add(robotEyeR);

const robotArmGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 14);
const robotArmL = new THREE.Mesh(robotArmGeo, robotDarkMaterial);
robotArmL.position.set(-0.95, 1.55, 0);
robotArmL.rotation.z = 0.5;
robotArmL.castShadow = true;
robot.add(robotArmL);

const robotArmR = robotArmL.clone();
robotArmR.position.x = 0.95;
robotArmR.rotation.z = -0.5;
robot.add(robotArmR);

robot.position.set(-4.2, 0, 0.5);
labGroup.add(robot);

const robotPickBox = new THREE.Mesh(
	new THREE.BoxGeometry(2.3, 4.4, 2.0),
	new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.01 })
);
robotPickBox.position.set(0, 2.05, 0);
robotPickBox.userData.target = 'robot';
robot.add(robotPickBox);

const computer = new THREE.Group();
const computerBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3445, metalness: 0.35, roughness: 0.7 });
computerBaseMaterial.emissive = new THREE.Color(0x000000);
const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 0.18), computerBaseMaterial);
monitorFrame.castShadow = true;
monitorFrame.position.y = 2.1;
computer.add(monitorFrame);

const screen = new THREE.Mesh(
	new THREE.PlaneGeometry(1.8, 1.05),
	new THREE.MeshStandardMaterial({ color: 0x142e35, emissive: 0x0f6375, emissiveIntensity: 0.8, map: labTexture })
);
screen.position.set(0, 2.1, 0.12);
computer.add(screen);

const keyboard = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.7), computerBaseMaterial);
keyboard.position.set(0, 0.55, 0.65);
keyboard.castShadow = true;
computer.add(keyboard);

const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.9, 14), computerBaseMaterial);
stand.position.set(0, 1.35, 0);
stand.castShadow = true;
computer.add(stand);

const standBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.45), computerBaseMaterial);
standBase.position.set(0, 0.88, 0.05);
standBase.castShadow = true;
computer.add(standBase);

computer.position.set(-0.6, 0, -0.7);
labGroup.add(computer);

const computerPickBox = new THREE.Mesh(
	new THREE.BoxGeometry(3.2, 3.8, 2.4),
	new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.01 })
);
computerPickBox.position.set(0, 1.5, 0.3);
computerPickBox.userData.target = 'computer';
computer.add(computerPickBox);

const satellite = new THREE.Group();
const satelliteCore = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), new THREE.MeshStandardMaterial({ color: 0x9eb2c7, metalness: 0.2, roughness: 0.4 }));
satelliteCore.castShadow = true;
satelliteCore.position.y = 2.1;
satellite.add(satelliteCore);

const solarPanelGeo = new THREE.BoxGeometry(1.5, 0.06, 0.9);
const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x1c5f8a, emissive: 0x13304d, emissiveIntensity: 0.4, roughness: 0.55 });
const panelLeft = new THREE.Mesh(solarPanelGeo, solarPanelMat);
panelLeft.position.set(-2.0, 2.1, 0);
panelLeft.castShadow = true;
satellite.add(panelLeft);

const panelRight = panelLeft.clone();
panelRight.position.x = 2.0;
satellite.add(panelRight);

const panelArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 12);
const panelArmL = new THREE.Mesh(panelArmGeo, computerBaseMaterial);
panelArmL.rotation.z = Math.PI / 2;
panelArmL.position.set(-1.1, 2.1, 0);
satellite.add(panelArmL);

const panelArmR = panelArmL.clone();
panelArmR.position.x = 1.1;
satellite.add(panelArmR);

satellite.position.set(3.8, 0, -1.5);
labGroup.add(satellite);

const battery = new THREE.Group();
const batteryBody = new THREE.Mesh(
	new THREE.CylinderGeometry(0.65, 0.65, 2.3, 24),
	new THREE.MeshStandardMaterial({ color: 0x2dff8a, metalness: 0.15, roughness: 0.35, emissive: 0x0d4b28, emissiveIntensity: 0.2 })
);
batteryBody.rotation.z = Math.PI / 2;
batteryBody.castShadow = true;
batteryBody.position.y = 0.8;
battery.add(batteryBody);

const batteryCap = new THREE.Mesh(
	new THREE.CylinderGeometry(0.28, 0.28, 0.35, 20),
	new THREE.MeshStandardMaterial({ color: 0x173620, metalness: 0.2, roughness: 0.55 })
);
batteryCap.rotation.z = Math.PI / 2;
batteryCap.position.set(1.25, 0.8, 0);
batteryCap.castShadow = true;
battery.add(batteryCap);

const batteryRing = new THREE.Mesh(
	new THREE.TorusGeometry(0.38, 0.08, 10, 20),
	new THREE.MeshStandardMaterial({ color: 0xa5ffcf, emissive: 0x23ff89, emissiveIntensity: 1.2 })
);
batteryRing.rotation.y = Math.PI / 2;
batteryRing.position.set(-0.2, 0.8, 0);
battery.add(batteryRing);

battery.position.set(1.7, 0, 2.4);
labGroup.add(battery);

const antenna = new THREE.Group();
const antennaStand = new THREE.Mesh(
	new THREE.CylinderGeometry(0.18, 0.25, 2.8, 18),
	new THREE.MeshStandardMaterial({ color: 0xff8c57, metalness: 0.35, roughness: 0.45 })
);
antennaStand.position.y = 1.4;
antennaStand.castShadow = true;
antenna.add(antennaStand);

const antennaDish = new THREE.Mesh(
	new THREE.ConeGeometry(0.95, 1.6, 20, 1, true),
	new THREE.MeshStandardMaterial({ color: 0xffb27e, side: THREE.DoubleSide, metalness: 0.2, roughness: 0.5 })
);
antennaDish.rotation.x = Math.PI / 2;
antennaDish.position.set(0, 2.6, 0);
antennaDish.castShadow = true;
antenna.add(antennaDish);

const antennaDot = new THREE.Mesh(
	new THREE.SphereGeometry(0.12, 16, 16),
	new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xff6f3c, emissiveIntensity: 1.1 })
);
antennaDot.position.set(0, 2.75, 0.78);
antenna.add(antennaDot);

antenna.position.set(5.2, 0, 2.2);
labGroup.add(antenna);

const clickables = [robotPickBox, computerPickBox];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoverObject = null;
let selectedTarget = null;

const defaultRobotScale = robot.scale.clone();
const defaultComputerScale = computer.scale.clone();
const defaultRobotBodyEmissive = robotBodyMaterial.emissive.clone();
const defaultRobotDarkEmissive = robotDarkMaterial.emissive.clone();
const defaultComputerEmissive = computerBaseMaterial.emissive.clone();
const defaultScreenEmissive = screen.material.emissive.clone();

function setHoverState(target) {
	if (hoverObject === target) {
		return;
	}

	hoverObject = target;
	document.body.style.cursor = hoverObject ? 'pointer' : 'default';
	applyInteractionState();
}

function applyInteractionState() {
	const robotIsHovered = hoverObject === 'robot';
	const computerIsHovered = hoverObject === 'computer';
	const robotIsSelected = selectedTarget === 'robot';
	const computerIsSelected = selectedTarget === 'computer';

	robot.scale.setScalar(robotIsHovered || robotIsSelected ? 1.08 : defaultRobotScale.x);
	computer.scale.setScalar(computerIsHovered || computerIsSelected ? 1.08 : defaultComputerScale.x);

	robotBodyMaterial.emissive.setHex(robotIsHovered || robotIsSelected ? 0x123b57 : defaultRobotBodyEmissive.getHex());
	robotDarkMaterial.emissive.setHex(robotIsHovered || robotIsSelected ? 0x06090f : defaultRobotDarkEmissive.getHex());
	computerBaseMaterial.emissive.setHex(computerIsHovered || computerIsSelected ? 0x10202d : defaultComputerEmissive.getHex());
	screen.material.emissive.setHex(computerIsHovered || computerIsSelected ? 0x1f8b7d : defaultScreenEmissive.getHex());
}

function setMessage(text) {
	info.textContent = text;
}

function setRobotState(active) {
	robotBodyMaterial.color.set(active ? 0xffc857 : 0x5fd7ff);
	robotDarkMaterial.color.set(active ? 0x4e2e11 : 0x1c2433);
	robotEyeL.material.emissive.set(active ? 0xffb347 : 0x36d8ff);
	robotEyeR.material.emissive.set(active ? 0xffb347 : 0x36d8ff);
	robotAntennaTip.material.emissive.set(active ? 0xff5511 : 0x553300);
	robot.rotation.y = active ? Math.PI / 8 : 0;
}

function setComputerState(active) {
	screen.material.emissive.set(active ? 0x3dffcf : 0x0f6375);
	screen.material.color.set(active ? 0x173b48 : 0x142e35);
	monitorFrame.material.color.set(active ? 0x44506a : 0x2d3445);
}

function updateSelectionFeedback() {
	if (selectedTarget === 'robot') {
		setMessage('Robot dipilih. Klik lagi untuk deselect.');
		return;
	}

	if (selectedTarget === 'computer') {
		setMessage('Komputer dipilih. Klik lagi untuk deselect.');
		return;
	}

	setMessage('Klik robot atau komputer untuk memilih objek.');
}

function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(pointer, camera);
	const intersections = raycaster.intersectObjects(clickables, true);
	const nextHover = intersections.length > 0 ? intersections[0].object.userData.target : null;

	setHoverState(nextHover);
}

function onClick(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(pointer, camera);
	const intersections = raycaster.intersectObjects(clickables, true);

	if (!intersections.length) {
		return;
	}

	const clickedTarget = intersections[0].object.userData.target;
	if (clickedTarget === selectedTarget) {
		selectedTarget = null;
		setRobotState(false);
		setComputerState(false);
		applyInteractionState();
		updateSelectionFeedback();
		return;
	}

	selectedTarget = clickedTarget;
	setRobotState(clickedTarget === 'robot');
	setComputerState(clickedTarget === 'computer');
	applyInteractionState();
	updateSelectionFeedback();
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onClick);
window.addEventListener('resize', onResize);

function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

const clock = new THREE.Clock();

setRobotState(false);
setComputerState(false);
applyInteractionState();

function animate() {
	const elapsed = clock.getElapsedTime();

	robotHead.rotation.y = Math.sin(elapsed * 1.8) * 0.14;
	robotArmL.rotation.z = 0.5 + Math.sin(elapsed * 3.2) * 0.05;
	robotArmR.rotation.z = -0.5 - Math.sin(elapsed * 3.2) * 0.05;
	satellite.rotation.y = elapsed * 0.35;
	satellite.position.y = Math.sin(elapsed * 2) * 0.12 + 0.05;
	battery.rotation.y = elapsed * 0.8;
	antenna.rotation.y = Math.sin(elapsed * 1.1) * 0.18;
	labGroup.rotation.y = Math.sin(elapsed * 0.12) * 0.06;

	controls.update();
	renderer.render(scene, camera);
}

updateSelectionFeedback();
renderer.setAnimationLoop(animate);