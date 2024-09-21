const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const flowers = [];
const maxSunFlowers = 160;
const batchSunFlowers = 10;
const sunFlowerImg = new Image();
const roseImg = new Image();

// Load the sunflower SVG image
sunFlowerImg.src = './files/img/sunflower.svg';

// Flower constructor
function Flower(x, y, scale, opacity, rotation) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.opacity = opacity;
    this.rotation = rotation; // Rotation angle in degrees
}

// Method to draw a sunflower image on canvas
Flower.prototype.draw = function (img) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180); // Convert degrees to radians
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.opacity;

    // Change the width and height based on the desired scale (e.g., 128x128 for bigger sunflowers)
    const width = 2 * 128 * this.scale;  // Adjust the width for scaling
    const height = 2 * 128 * this.scale; // Adjust the height for scaling

    // Draw sunflower image, centered at the (x, y) position
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

// Initialize flower positions with random spawning across the canvas
function initFlowers() {
    for (let i = 0; i < maxSunFlowers; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const scale = 0; // Start with scale 0 for animation
        const opacity = 0; // Start invisible
        const rotation = Math.random() * 360; // Random initial rotation angle
        flowers.push(new Flower(x, y, scale, opacity, rotation));
    }
}

// Animate flowers in batches of 20
function animateFlowers() {
    for (let i = 0; i < maxSunFlowers; i += batchSunFlowers) {
        const batchedFlowers = flowers.slice(i, i + batchSunFlowers);

        // Delay between each batch
        setTimeout(() => {
            const randomScales = batchedFlowers.map(() => 0.5 + Math.random() * 0.5);
            const rotations = batchedFlowers.map(flower => flower.rotation + 360);

            // Create a single timeline for the batch
            const tl = gsap.timeline({
                onUpdate: render // Continuously render
            });

            batchedFlowers.forEach((flower, index) => {
                tl.to(flower, {
                    scale: randomScales[index],
                    opacity: 1,
                    rotation: rotations[index],
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                }, 0); // Start all animations at the same time
            });

        }, i * 30); // Delay between batches

    }
}

// Render loop to draw all flowers
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Set the background color
    ctx.fillStyle = '#FFDC7F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each flower
    flowers.forEach(flower => {
        flower.draw(sunFlowerImg);
    });

}


const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ensure the images are fully loaded before starting the animation
Promise.all([
    new Promise(resolve => sunFlowerImg.onload = resolve),
]).then(() => {
    initFlowers();
    animateFlowers();
    // Select the phrase element
    const title = document.getElementById("h1_title");

    // Split the text into characters using GSAP's SplitText plugin
    const splitText = new SplitText(title, { type: "chars" });

    // Animate each character to appear as if typed
    gsap.from(splitText.chars, {
      opacity: 0,
      y: 10,
      duration: 0.05,
      stagger: 0.1,
      ease: "power2.inOut",
      onComplete: () => splitText.revert() // Clean up after animation
    });
});