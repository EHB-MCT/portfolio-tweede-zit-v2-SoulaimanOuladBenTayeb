// threeLoading.js

function initLoadingScreen() {
    const container = document.getElementById('threejs-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Lighting for better visual effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create a background plane
    const planeGeometry = new THREE.PlaneGeometry(200, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -10; // Position it behind the text
    scene.add(plane);

    // Create the 3D question mark
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry('?', {
            font: font,
            size: 10, // Increase size
            height: 2,
            curveSegments: 12,
        });
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0x0077ff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);

        textMesh.position.set(-5, -2, 0); // Center the question mark
        camera.position.z = 20;

        // Add some particles for a cooler effect
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Animation loop
        let startTime = Date.now();

        function animate() {
            requestAnimationFrame(animate);

            let elapsedTime = Date.now() - startTime;

            if (elapsedTime < 3000) { // Rotate for 3 seconds
                textMesh.rotation.y += 0.02; // Rotate the question mark faster
                particlesMesh.rotation.y += 0.001; // Slightly rotate particles
            }

            renderer.render(scene, camera);
        }
        animate();
    });
}

// Show main content after loading is complete
function showMainContent() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    loadingScreen.style.display = 'none'; // Hide the loading screen
    mainContent.style.display = 'block'; // Show the main content
}

// Initialize the loading screen
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();

    // Simulate a loading delay (e.g., for assets or data fetching)
    setTimeout(() => {
        showMainContent();
    }, 3000); // Adjust the delay as needed
});