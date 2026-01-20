import * as skinview3d from '../src/skinview3d';

let skinViewer: skinview3d.SkinViewer;
let currentAnimationIndex = 0;
const animations = [
	new skinview3d.IdleAnimation(),
	new skinview3d.WalkingAnimation(),
	new skinview3d.WaveAnimation(),
];
const ANIMATION_INTERVAL = 5000; // 5秒

function getSkinUrlFromParams(): string | null {
	const params = new URLSearchParams(window.location.search);
	return params.get('skin');
}

function startAnimationLoop(): void {
	skinViewer.animation = animations[currentAnimationIndex];
}

function initializeViewer(): void {
	const canvas = document.getElementById('skin_container') as HTMLCanvasElement;
	if (!canvas) {
		throw new Error('Canvas element not found');
	}

	skinViewer = new skinview3d.SkinViewer({
		canvas: canvas,
		width: window.innerWidth,
		height: window.innerHeight,
	});

	// Set canvas to resize on window resize
	window.addEventListener('resize', () => {
		skinViewer.width = window.innerWidth;
		skinViewer.height = window.innerHeight;
	});

	// Load skin from URL parameter
	const skinUrl = getSkinUrlFromParams();
	if (skinUrl) {
		skinViewer.loadSkin(skinUrl).catch(e => {
			console.error('Failed to load skin:', e);
		});
	}

	// Start animation loop
	startAnimationLoop();

	// Load default panorama background
	skinViewer.loadPanorama('public/img/panorama.png').catch(e => {
		console.error('Failed to load panorama:', e);
	});

	// Switch animation every 5 seconds
	setInterval(() => {
		currentAnimationIndex = (currentAnimationIndex + 1) % animations.length;
		startAnimationLoop();
	}, ANIMATION_INTERVAL);
}

initializeViewer();
