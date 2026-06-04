import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#c');
const info = document.querySelector('#info');
const hoverInfo = document.querySelector('#hoverInfo');

const makeMaterial = (Ctor, props) => new Ctor(props);
const makeMesh = (geometry, material, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, shadow = false } = {}) => {
	const object = new THREE.Mesh(geometry, material);
	object.position.set(x, y, z);
	object.rotation.set(rx, ry, rz);
	object.castShadow = shadow;
	return object;
};

// start scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08111f);
scene.fog = new THREE.Fog(0x08111f, 18, 45);
// end scene

// start camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(9, 7, 11);
// end camera

// start renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// end renderer

// start controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.2, 0);
// end controls

// start texture
const labTexture = new THREE.TextureLoader().load('./Textures/lab-grid.svg');
labTexture.wrapS = THREE.RepeatWrapping;
labTexture.wrapT = THREE.RepeatWrapping;
labTexture.repeat.set(4, 4);
// end texture

// start lights
const ambient = new THREE.AmbientLight(0xffffff, 0.55);
const keyLight = new THREE.DirectionalLight(0x9be7ff, 1.6);
keyLight.position.set(6, 10, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
const rimLight = new THREE.PointLight(0xff7a59, 1.7, 30);
rimLight.position.set(-6, 4, -4);
scene.add(ambient, keyLight, rimLight);
// end lights

// start floor and walls
const floor = makeMesh(
	new THREE.PlaneGeometry(36, 36),
	makeMaterial(THREE.MeshStandardMaterial, { map: labTexture, color: 0xb7d8ff, roughness: 0.95, metalness: 0.05 }),
	{ rx: -Math.PI / 2 }
);
floor.receiveShadow = true;
scene.add(floor);

scene.add(
	makeMesh(new THREE.PlaneGeometry(36, 12), makeMaterial(THREE.MeshStandardMaterial, { color: 0x0f1a2c, roughness: 0.98, metalness: 0 }), { y: 6, z: -9 }),
	makeMesh(new THREE.PlaneGeometry(36, 12), makeMaterial(THREE.MeshStandardMaterial, { color: 0x0c1624, roughness: 1, metalness: 0 }), { x: -9, y: 6, ry: Math.PI / 2 })
);
// end floor and walls

// start lab workspace
const labWorkspace = new THREE.Group();
scene.add(labWorkspace);
// end lab workspace

// start robot
const robotBodyMaterial = makeMaterial(THREE.MeshStandardMaterial, { color: 0x5fd7ff, metalness: 0.25, roughness: 0.35 });
robotBodyMaterial.emissive = new THREE.Color(0x000000);
const robotDarkMaterial = makeMaterial(THREE.MeshStandardMaterial, { color: 0x1c2433, metalness: 0.45, roughness: 0.75 });
robotDarkMaterial.emissive = new THREE.Color(0x000000);
const robotEyeMaterial = makeMaterial(THREE.MeshStandardMaterial, { color: 0xffffff, emissive: 0x36d8ff, emissiveIntensity: 1.8 });
const robotTipMaterial = makeMaterial(THREE.MeshStandardMaterial, { color: 0xffcf5a, emissive: 0x553300, emissiveIntensity: 0.5 });
const robotArmGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 14);

const ihsanRobot = new THREE.Group();
const ihsanRobotBody = makeMesh(new THREE.BoxGeometry(1.5, 1.8, 1.1), robotBodyMaterial, { y: 1.4, shadow: true });
const ihsanRobotHead = makeMesh(new THREE.BoxGeometry(1.1, 0.9, 0.9), robotDarkMaterial, { y: 2.55, shadow: true });
const ihsanRobotAntenna = makeMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16), robotDarkMaterial, { y: 3.25, shadow: true });
const ihsanRobotAntennaTip = makeMesh(new THREE.SphereGeometry(0.12, 16, 16), robotTipMaterial, { y: 3.75 });
const ihsanRobotEyeL = makeMesh(new THREE.SphereGeometry(0.08, 12, 12), robotEyeMaterial, { x: -0.22, y: 2.62, z: 0.46 });
const ihsanRobotEyeR = ihsanRobotEyeL.clone();
ihsanRobotEyeR.position.x = 0.22;
const ihsanRobotArmL = makeMesh(robotArmGeo, robotDarkMaterial, { x: -0.95, y: 1.55, rz: 0.5, shadow: true });
const ihsanRobotArmR = ihsanRobotArmL.clone();
ihsanRobotArmR.position.x = 0.95;
ihsanRobotArmR.rotation.z = -0.5;
ihsanRobot.add(ihsanRobotBody, ihsanRobotHead, ihsanRobotAntenna, ihsanRobotAntennaTip, ihsanRobotEyeL, ihsanRobotEyeR, ihsanRobotArmL, ihsanRobotArmR);
ihsanRobot.position.set(-4.2, 0, 0.5);
labWorkspace.add(ihsanRobot);

const ihsanRobotHitbox = makeMesh(new THREE.BoxGeometry(2.3, 4.4, 2.0), makeMaterial(THREE.MeshBasicMaterial, { color: 0x000000, transparent: true, opacity: 0.01 }), { y: 2.05 });
ihsanRobotHitbox.userData.target = 'robot';
ihsanRobot.add(ihsanRobotHitbox);
// end robot

// start computer
const computerBaseMaterial = makeMaterial(THREE.MeshStandardMaterial, { color: 0x2d3445, metalness: 0.35, roughness: 0.7 });
computerBaseMaterial.emissive = new THREE.Color(0x000000);
const screenMaterial = makeMaterial(THREE.MeshStandardMaterial, { color: 0x142e35, emissive: 0x0f6375, emissiveIntensity: 0.8, map: labTexture });
const labComputer = new THREE.Group();
const monitorFrame = makeMesh(new THREE.BoxGeometry(2.2, 1.5, 0.18), computerBaseMaterial, { y: 2.1, shadow: true });
const screen = makeMesh(new THREE.PlaneGeometry(1.8, 1.05), screenMaterial, { y: 2.1, z: 0.12 });
const keyboard = makeMesh(new THREE.BoxGeometry(1.7, 0.12, 0.7), computerBaseMaterial, { y: 0.55, z: 0.65, shadow: true });
const stand = makeMesh(new THREE.CylinderGeometry(0.08, 0.12, 0.9, 14), computerBaseMaterial, { y: 1.35, shadow: true });
const standBase = makeMesh(new THREE.BoxGeometry(1.0, 0.12, 0.45), computerBaseMaterial, { y: 0.88, z: 0.05, shadow: true });
labComputer.add(monitorFrame, screen, keyboard, stand, standBase);
labComputer.position.set(-0.6, 0, -0.7);
labWorkspace.add(labComputer);

const labComputerHitbox = makeMesh(new THREE.BoxGeometry(3.2, 3.8, 2.4), makeMaterial(THREE.MeshBasicMaterial, { color: 0x000000, transparent: true, opacity: 0.01 }), { y: 1.5, z: 0.3 });
labComputerHitbox.userData.target = 'computer';
labComputer.add(labComputerHitbox);
// end computer

// start satellite
const satellite = new THREE.Group();
const satelliteCore = makeMesh(new THREE.SphereGeometry(0.9, 24, 24), makeMaterial(THREE.MeshStandardMaterial, { color: 0x9eb2c7, metalness: 0.2, roughness: 0.4 }), { y: 2.1, shadow: true });
const solarPanelGeo = new THREE.BoxGeometry(1.5, 0.06, 0.9);
const solarPanelMat = makeMaterial(THREE.MeshStandardMaterial, { color: 0x1c5f8a, emissive: 0x13304d, emissiveIntensity: 0.4, roughness: 0.55 });
const panelLeft = makeMesh(solarPanelGeo, solarPanelMat, { x: -2.0, y: 2.1, shadow: true });
const panelRight = panelLeft.clone();
panelRight.position.x = 2.0;
const panelArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 12);
const panelArmL = makeMesh(panelArmGeo, computerBaseMaterial, { x: -1.1, y: 2.1, rz: Math.PI / 2 });
const panelArmR = panelArmL.clone();
panelArmR.position.x = 1.1;
satellite.add(satelliteCore, panelLeft, panelRight, panelArmL, panelArmR);
satellite.position.set(3.8, 0, -1.5);
labWorkspace.add(satellite);
// end satellite

// start battery
const battery = new THREE.Group();
const batteryBody = makeMesh(new THREE.CylinderGeometry(0.65, 0.65, 2.3, 24), makeMaterial(THREE.MeshStandardMaterial, { color: 0x2dff8a, metalness: 0.15, roughness: 0.35, emissive: 0x0d4b28, emissiveIntensity: 0.2 }), { y: 0.8, rz: Math.PI / 2, shadow: true });
const batteryCap = makeMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.35, 20), makeMaterial(THREE.MeshStandardMaterial, { color: 0x173620, metalness: 0.2, roughness: 0.55 }), { x: 1.25, y: 0.8, rz: Math.PI / 2, shadow: true });
const batteryRing = makeMesh(new THREE.TorusGeometry(0.38, 0.08, 10, 20), makeMaterial(THREE.MeshStandardMaterial, { color: 0xa5ffcf, emissive: 0x23ff89, emissiveIntensity: 1.2 }), { x: -0.2, y: 0.8, ry: Math.PI / 2 });
battery.add(batteryBody, batteryCap, batteryRing);
battery.position.set(1.7, 0, 2.4);
labWorkspace.add(battery);
// end battery

// start antenna
const antenna = new THREE.Group();
const antennaStand = makeMesh(new THREE.CylinderGeometry(0.18, 0.25, 2.8, 18), makeMaterial(THREE.MeshStandardMaterial, { color: 0xff8c57, metalness: 0.35, roughness: 0.45 }), { y: 1.4, shadow: true });
const antennaDish = makeMesh(new THREE.ConeGeometry(0.95, 1.6, 20, 1, true), makeMaterial(THREE.MeshStandardMaterial, { color: 0xffb27e, side: THREE.DoubleSide, metalness: 0.2, roughness: 0.5 }), { y: 2.6, rx: Math.PI / 2, shadow: true });
const antennaDot = makeMesh(new THREE.SphereGeometry(0.12, 16, 16), makeMaterial(THREE.MeshStandardMaterial, { color: 0xffffff, emissive: 0xff6f3c, emissiveIntensity: 1.1 }), { y: 2.75, z: 0.78 });
antenna.add(antennaStand, antennaDish, antennaDot);
antenna.position.set(5.2, 0, 2.2);
labWorkspace.add(antenna);
// end antenna

// start interaction
const state = { hover: null, selected: null };
const clickables = [ihsanRobotHitbox, labComputerHitbox];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const messages = {
	robot: 'Robot dipilih. Klik lagi untuk deselect.',
	computer: 'Komputer dipilih. Klik lagi untuk deselect.',
	default: 'Klik robot atau komputer untuk memilih objek.'
};
const hoverLabels = {
	robot: 'Robot',
	computer: 'Komputer'
};

function setPointerCursor() {
	document.body.style.cursor = state.hover ? 'pointer' : 'default';
}

function setHoverInfo(text, event) {
	if (!text) {
		hoverInfo.style.display = 'none';
		return;
	}

	hoverInfo.textContent = text;
	hoverInfo.style.left = `${event.clientX}px`;
	hoverInfo.style.top = `${event.clientY}px`;
	hoverInfo.style.display = 'block';
}

function applyVisualState() {
	const robotActive = state.hover === 'robot' || state.selected === 'robot';
	const computerActive = state.hover === 'computer' || state.selected === 'computer';

	ihsanRobot.scale.setScalar(robotActive ? 1.08 : 1);
	labComputer.scale.setScalar(computerActive ? 1.08 : 1);
	robotBodyMaterial.emissive.setHex(robotActive ? 0x123b57 : 0x000000);
	robotDarkMaterial.emissive.setHex(robotActive ? 0x06090f : 0x000000);
	computerBaseMaterial.emissive.setHex(computerActive ? 0x10202d : 0x000000);
	screenMaterial.emissive.setHex(computerActive ? 0x1f8b7d : 0x0f6375);
}

function applySelection(target) {
	const robotActive = target === 'robot';
	const computerActive = target === 'computer';

	robotBodyMaterial.color.setHex(robotActive ? 0xffc857 : 0x5fd7ff);
	robotDarkMaterial.color.setHex(robotActive ? 0x4e2e11 : 0x1c2433);
	robotEyeMaterial.emissive.setHex(robotActive ? 0xffb347 : 0x36d8ff);
	robotTipMaterial.emissive.setHex(robotActive ? 0xff5511 : 0x553300);
	ihsanRobot.rotation.y = robotActive ? Math.PI / 8 : 0;
	screenMaterial.color.setHex(computerActive ? 0x173b48 : 0x142e35);
	screenMaterial.emissive.setHex(computerActive ? 0x3dffcf : 0x0f6375);
	monitorFrame.material.color.setHex(computerActive ? 0x44506a : 0x2d3445);
}

function updateMessage() {
	info.textContent = messages[state.selected] || messages.default;
}

function getTarget(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(pointer, camera);
	return raycaster.intersectObjects(clickables, true)[0]?.object.userData.target ?? null;
}

function onPointerMove(event) {
	const nextHover = getTarget(event);
	if (nextHover !== state.hover) {
		state.hover = nextHover;
		setPointerCursor();
		applyVisualState();
	}
	setHoverInfo(nextHover ? `${hoverLabels[nextHover]} - arahkan klik untuk memilih` : '', event);
}

function onClick(event) {
	const clickedTarget = getTarget(event);
	if (!clickedTarget) return;
	state.selected = clickedTarget === state.selected ? null : clickedTarget;
	applySelection(state.selected);
	applyVisualState();
	updateMessage();
}

function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onClick);
window.addEventListener('resize', onResize);

// end interaction

// start animation
const clock = new THREE.Clock();
applySelection(null);
applyVisualState();
updateMessage();

function animate() {
	const elapsed = clock.getElapsedTime();
	const armSwing = Math.sin(elapsed * 3.2) * 0.05;

	ihsanRobotHead.rotation.y = Math.sin(elapsed * 1.8) * 0.14;
	ihsanRobotArmL.rotation.z = 0.5 + armSwing;
	ihsanRobotArmR.rotation.z = -0.5 - armSwing;
	satellite.rotation.y = elapsed * 0.35;
	satellite.position.y = Math.sin(elapsed * 2) * 0.12 + 0.05;
	battery.rotation.y = elapsed * 0.8;
	antenna.rotation.y = Math.sin(elapsed * 1.1) * 0.18;
	labWorkspace.rotation.y = Math.sin(elapsed * 0.12) * 0.06;
	controls.update();
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
// end animation