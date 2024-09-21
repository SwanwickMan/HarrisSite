var gameAssets = [
			{folder: 'backgrounds', src: '/static/scripts/assets/backgrounds/gymgroup.png' },
			{folder: 'backgrounds', src: '/static/scripts/assets/backgrounds/hamiltoncentral.png' },
			
			{folder: 'player', src: '/static/scripts/assets/sprites/player/drawn.png' },
			{folder: 'player', src: '/static/scripts/assets/sprites/player/mcSkin.png' },
			{folder: 'player', src: '/static/scripts/assets/sprites/player/sprite.png' },
			{folder: 'player', src: '/static/scripts/assets/sprites/player/primary.png' },
			{folder: 'player', src: '/static/scripts/assets/sprites/player/alcohol.png' },
			{folder: 'player', src: '/static/scripts/assets/sprites/player/despair.png' },
			{folder: 'player', src: '/static/scripts/assets/sprites/player/joy.png' },
			
			{folder: 'enemy', src: '/static/scripts/assets/sprites/enemy/lauchlan.png' },
			{folder: 'enemy', src: '/static/scripts/assets/sprites/enemy/moneyLender.png' },
			{folder: 'enemy', src: '/static/scripts/assets/sprites/enemy/lee.png' },
			{folder: 'enemy', src: '/static/scripts/assets/sprites/enemy/sausages.png' },
			
			{folder: 'clock', src: '/static/scripts/assets/misc/clock.png' },
			
			{folder: 'start', src: '/static/scripts/assets/misc/HarrisRun.png' },
			
			{folder: 'lose', src: '/static/scripts/assets/misc/lose.png' },
			]

class AssetLoader {
    constructor() {
        this.assets = {"backgrounds":[],"player":[],"enemy":[],"clock":[],"start":[],"lose":[]};
        this.loadedAssets = 0;
        this.totalAssets = 0;
        this.onProgressCallback = null;
        this.onCompleteCallback = null;
    }

    // Add multiple assets at once, separated by folders
    loadAssets(assetList) {
        this.totalAssets = assetList.length;

        assetList.forEach(asset => {
            const {folder, src } = asset;

            this.loadImage(folder, src);
        });
    }

    loadImage(folder, src) {
        const image = new Image();
        image.onload = () => {
            this.assets[folder].push(image); // Store the asset under the correct folder
            this.loadedAssets++;
            
            if (this.onProgressCallback) {
                this.onProgressCallback(this.loadedAssets, this.totalAssets);
            }

            this.checkCompletion();
        };
        image.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
        image.src = src;
    }

    // Set the progress callback
    onProgress(callback) {
        this.onProgressCallback = callback;
    }

    // Set the completion callback
    onComplete(callback) {
        this.onCompleteCallback = callback;
		console.log(this.assets)
    }

    // Check if all assets are loaded
    checkCompletion() {
        if (this.loadedAssets === this.totalAssets && this.onCompleteCallback) {
            this.onCompleteCallback(this.assets);
        }
    }
}