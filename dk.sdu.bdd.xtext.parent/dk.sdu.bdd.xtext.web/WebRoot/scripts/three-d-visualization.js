class Offset {
	constructor(x, y, z) {
		this.x = Number.parseFloat(x);
		this.y = Number.parseFloat(y);
		this.z = Number.parseFloat(z);
	}

	get x_error() {
		return this.x;
	}

	get y_error() {
		return this.y;
	}

	get z_error() {
		return this.z;
	}

	get magnitude() {
		return math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	toArray() {
		return [this.x, this.y, this.z];
	}
}

class Position {
	constructor(x, y, z) {
		this.x = Number.parseFloat(x);
		this.y = Number.parseFloat(y);
		this.z = Number.parseFloat(z);
	}

	subtract(position) {
		return new Offset(this.x - position.x, this.y - position.y, this.z - position.z);
	}

	toArray() {
		return [this.x, this.y, this.z];
	}
}

const jointDHParameters = [
	[0, 0, 0.089159, math.pi / 2],
	[0, -0.425, 0, 0],
	[0, -0.39225, 0, 0],
	[0, 0, 0.10915, math.pi / 2],
	[0, 0, 0.09465, -math.pi / 2],
	[0, 0, 0.0823, 0]
];

const cos_alphas = [
	math.cos(jointDHParameters[0][3]),
	math.cos(jointDHParameters[1][3]),
	math.cos(jointDHParameters[2][3]),
	math.cos(jointDHParameters[3][3]),
	math.cos(jointDHParameters[4][3]),
	math.cos(jointDHParameters[5][3])
];

const sin_alphas = [
	math.sin(jointDHParameters[0][3]),
	math.sin(jointDHParameters[1][3]),
	math.sin(jointDHParameters[2][3]),
	math.sin(jointDHParameters[3][3]),
	math.sin(jointDHParameters[4][3]),
	math.sin(jointDHParameters[5][3])
];

const alpha_d_array_arrays = [
	[0, sin_alphas[0], cos_alphas[0], jointDHParameters[0][2]],
	[0, sin_alphas[1], cos_alphas[1], jointDHParameters[1][2]],
	[0, sin_alphas[2], cos_alphas[2], jointDHParameters[2][2]],
	[0, sin_alphas[3], cos_alphas[3], jointDHParameters[3][2]],
	[0, sin_alphas[4], cos_alphas[4], jointDHParameters[4][2]],
	[0, sin_alphas[5], cos_alphas[5], jointDHParameters[5][2]]
]

const last_array = [0, 0, 0, 1]

function computePositions(inputRotationsPerJoint) {
	if (inputRotationsPerJoint.length !== jointDHParameters.length) throw new Error("Input rotations must have the same length as the DH-parameters array");


	let outputPositions = [];

	const transformationMatrices = [];

	for (let i = 0; i < inputRotationsPerJoint.length; i++) {
		const theta = inputRotationsPerJoint[i] + jointDHParameters[i][0];
		const r = jointDHParameters[i][1]; // also known as a in the DH-parameters
		const cos_theta = math.cos(theta);
		const sin_theta = math.sin(theta);
		const cos_alpha = cos_alphas[i];
		const sin_alpha = sin_alphas[i];
		const jointTransformationMatrix = math.matrix([
			[cos_theta, -sin_theta * cos_alpha, sin_theta * sin_alpha, r * cos_theta],
			[sin_theta, cos_theta * cos_alpha, -cos_theta * sin_alpha, r * sin_theta],
			alpha_d_array_arrays[i].slice(),
			last_array.slice()
		]);

		transformationMatrices.push(jointTransformationMatrix);
	}

	let currentTransformationMatrix = transformationMatrices[0];
	outputPositions.push(currentTransformationMatrix.subset(math.index([0, 1, 2], 3)).toArray());

	// intentionally starting on one, since we have already looked at the first joint
	for (let i = 1; i < transformationMatrices.length; i++) {
		currentTransformationMatrix = math.multiply(currentTransformationMatrix, transformationMatrices[i]);
		outputPositions.push(currentTransformationMatrix.subset(math.index([0, 1, 2], 3)).toArray());
	}

	outputPositions = outputPositions.map((position) => {
		return [position[0][0], position[1][0], position[2][0]];
	});

	const base = outputPositions[0];
	const shoulder = outputPositions[1];
	const elbow = outputPositions[2];
	const wrist_1 = outputPositions[3];
	const wrist_2 = outputPositions[4];
	const wrist_3 = outputPositions[5];

	return [ base, shoulder, elbow, wrist_1, wrist_2, wrist_3 ];
}

// (GLOBAL VARIABLE) List of different robot positions (6 sets of coordinates)
var robotPositionsList = [];

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

	// Materials
	const jointMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
	const lineMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });
	const historyLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

	let currentPositionIndex = 0;
	const endEffectorHistory = [];

	function createJoint(position) {
	    const geometry = new THREE.SphereGeometry(0.2, 32, 32);  // Sphere size remains unchanged
	    const joint = new THREE.Mesh(geometry, jointMaterial);
	    joint.position.set(position[0] * 10, position[1] * 10, position[2] * 10);  // Scale position
	    return joint;
	}

	function createLine(startPoint, endPoint) {
	    const geometry = new THREE.BufferGeometry().setFromPoints([
	        new THREE.Vector3(startPoint[0] * 10, startPoint[1] * 10, startPoint[2] * 10),  // Scale position
	        new THREE.Vector3(endPoint[0] * 10, endPoint[1] * 10, endPoint[2] * 10)         // Scale position
	    ]);
	    return new THREE.Line(geometry, lineMaterial);
	}

	function createHistoryLine(points) {
	    const vectors = points.map(p => new THREE.Vector3(p[0] * 10, p[1] * 10, p[2] * 10));  // Scale position
	    const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
	    return new THREE.Line(geometry, historyLineMaterial);
	}

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
