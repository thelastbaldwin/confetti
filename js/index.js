window.addEventListener("DOMContentLoaded", function () {
    const MyConfetti = new Confetti(document.getElementById("canvas"));

    window.addEventListener("resize", MyConfetti.resetCanvas);
    document.querySelector('#stopButton').addEventListener("click", MyConfetti.deactivateConfetti);
    document.querySelector('#startButton').addEventListener("click", MyConfetti.startConfetti);
});