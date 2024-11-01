const raw_positions = [
    [0.0, 0.5, 1.0, 0.3, 0.2, 0.1],  // First position
    [0.2, 0.6, 1.2, 0.4, 0.3, 0.2],  // Second position
    [0.4, 0.7, 1.4, 0.5, 0.4, 0.3],  // Third position
    [0.6, 0.8, 1.6, 0.6, 0.5, 0.4],  // Fourth position
    [0.4, 0.7, 1.4, 0.5, 0.4, 0.3],  // Fifth position
    [0.2, 0.6, 1.2, 0.4, 0.3, 0.2]   // Sixth position
];

/**
 * @type {Position[][]}
 */
const robotPositionsList = [];
raw_positions.forEach(position => {
	robotPositionsList.push(computePositions(position));
})

// Materials
const jointMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });
const historyLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

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
	camera.lookAt(0, 0, 0);

	// Animation
	let lastUpdate = 0;
	const updateInterval = 1000; // Update every 1 second

	function animate(timestamp) {
		requestAnimationFrame(animate);

		// Update robot position every second
		if (timestamp - lastUpdate > updateInterval) {
			updateRobotPosition();
			lastUpdate = timestamp;
		}

		renderer.render(scene, camera);
	}

	animate();
}

/**
 * @param position {Position}
 * @returns {Mesh}
 */
function createJoint(position) {
	const geometry = new THREE.SphereGeometry(0.2, 32, 32);  // Sphere size remains unchanged
	const joint = new THREE.Mesh(geometry, jointMaterial);
	joint.position.set(position.x * 10, position.y * 10, position.z * 10);  // Scale position
	return joint;
}

/**
 * @param points {Position[]}
 * @returns {Line|*}
 */
function createHistoryLine(points) {
	const vectors = points.map(p => new THREE.Vector3(p.x * 10, p.y * 10, p.z * 10));  // Scale position
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
		new THREE.Vector3(startPoint.x * 10, startPoint.y * 10, startPoint.z * 10),  // Scale position
		new THREE.Vector3(endPoint.x * 10, endPoint.y * 10, endPoint.z * 10)         // Scale position
	]);
	return new THREE.Line(geometry, lineMaterial);
}
