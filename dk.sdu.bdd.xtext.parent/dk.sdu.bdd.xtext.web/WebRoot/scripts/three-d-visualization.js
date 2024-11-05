const positions_filepath = "./logs/position_log.json";
let raw_positions = loadData(positions_filepath);

/**
 * @type {Position[][]}
 */
const robotPositionsList = [];
raw_positions.forEach(position => {
	robotPositionsList.push(computePositions(position));
})
console.log(robotPositionsList);

// Materials
const jointMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });
const historyLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

const robotscale = 6;
const jointBallSize = 0.02 * robotscale;
const updateInterval = 100; // Update every 1 second


function render3DVisualization() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf5f5f5);
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.scale.set(0.5, 0.5)
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(500, 500);
	const $3dContainer = $("#three-d-container");
	$3dContainer.empty();
	$3dContainer.append(renderer.domElement);

	// Lighting
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(100, 100, 100);  // Scale the light positioning as well
	scene.add(directionalLight);

	let currentPositionIndex = 0;
	const endEffectorHistory = [];

	let joints = [];
	let lines = [];
	let historyLine = null;

	function updateRobotPosition() {
		// Remove existing joints and lines
		joints.forEach(joint => scene.remove(joint));
		lines.forEach(line => scene.remove(line));
		if (historyLine) scene.remove(historyLine);

		joints = [];
		lines = [];

		const currentPosition = robotPositionsList[currentPositionIndex];

		// Add new joints
		currentPosition.forEach(position => {
			const joint = createJoint(position);
			scene.add(joint);
			joints.push(joint);
		});

		// Add connecting lines between joints
		for (let i = 0; i < currentPosition.length - 1; i++) {
			const line = createLine(currentPosition[i], currentPosition[i + 1]);
			scene.add(line);
			lines.push(line);
		}

		// Add end effector position to history
		const endEffector = currentPosition[currentPosition.length - 1];
		endEffectorHistory.push(endEffector);

		// Create history line
		historyLine = createHistoryLine(endEffectorHistory);
		scene.add(historyLine);

		// Update position index
		currentPositionIndex = (currentPositionIndex + 1) % robotPositionsList.length;
	}

	// Camera position
	camera.position.set(7, 7, 7);

	const endEffectorPosition = robotPositionsList[0][robotPositionsList[0].length - 1];
	const cameraTarget = new THREE.Vector3(endEffectorPosition.x * robotscale, robotscale / 2, endEffectorPosition.z * robotscale);

	camera.lookAt(cameraTarget);

	// Animation
	let lastUpdate = 0;
	let angle = 0;

	function animate(timestamp) {
		requestAnimationFrame(animate);

		// Update robot position every second
		if (timestamp - lastUpdate > updateInterval) {
			updateRobotPosition();
			lastUpdate = timestamp;
		}


		// Update camera position to spin around the y-axis
		const radius = 9; // Distance from the origin
		camera.position.x = radius * Math.cos(angle) + endEffectorPosition.x;
		camera.position.z = radius * Math.sin(angle) + endEffectorPosition.z;
		camera.lookAt(cameraTarget);  // Look at the end effector

		// Increment the angle for the next frame
		angle += 0.001;

		renderer.render(scene, camera);
	}

	animate();
}

/**
 * @param position {Position}
 * @returns {Mesh}
 */
function createJoint(position) {
	const geometry = new THREE.SphereGeometry(jointBallSize, 32, 32);  // Sphere size remains unchanged
	const joint = new THREE.Mesh(geometry, jointMaterial);
	joint.position.set(position.x * robotscale, position.y * robotscale, position.z * robotscale);  // Scale position
	return joint;
}

/**
 * @param points {Position[]}
 * @returns {Line|*}
 */
function createHistoryLine(points) {
	const vectors = points.map(p => new THREE.Vector3(p.x * robotscale, p.y * robotscale, p.z * robotscale));  // Scale position
	const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
	return new THREE.Line(geometry, historyLineMaterial);
}

/**
 * @param startPoint {Position}
 * @param endPoint {Position}
 * @returns {Line|*}
 */
function createLine(startPoint, endPoint) {
	const geometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(startPoint.x * robotscale, startPoint.y * robotscale, startPoint.z * robotscale),  // Scale position
		new THREE.Vector3(endPoint.x * robotscale, endPoint.y * robotscale, endPoint.z * robotscale)         // Scale position
	]);
	return new THREE.Line(geometry, lineMaterial);
}
