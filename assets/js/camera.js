
// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/wyp8Ofn8Q/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    document.getElementById("startbutton").style.display = "none";
    document.getElementById("scannerrule").style.display = "none";
    document.getElementById("four").style.display = "none";
    document.getElementById("list-inline").style.display = "block";
    document.getElementById("webcam-container").style.display = "block";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(346, 346, true); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);

    var arr = [prediction[0].probability.toFixed(2) * 100, prediction[1].probability.toFixed(2) * 100, prediction[2].probability.toFixed(2) * 100, prediction[3].probability.toFixed(2) * 100];

    var max = arr.reduce(function (a, b) { return Math.max(a, b); });

    var blue = "Blue";
    var blueresult = blue.fontcolor("blue");

    var brown = "Brown";
    var brownresult = brown.fontcolor("brown");

    var orange = "Orange";
    var orangeresult = orange.fontcolor("orange");

    if (max == prediction[0].probability.toFixed(2) * 100) {
        document.getElementById("brown-container").innerHTML = "";
        document.getElementById("orange-container").innerHTML = "";
        document.getElementById("normal-container").innerHTML = "";
        document.getElementById("blue-container").innerHTML = "<br>" + "<h6> The probability that the object is paper is </h6>" + prediction[0].probability.toFixed(2) * 100 + "%" + "<br>" + "<h6> Please throw it into the " + blueresult + " trash can </h6>" + "<br>";
    }

    else if (max == prediction[1].probability.toFixed(2) * 100) {
        document.getElementById("blue-container").innerHTML = "";
        document.getElementById("orange-container").innerHTML = "";
        document.getElementById("normal-container").innerHTML = "";
        document.getElementById("brown-container").innerHTML = "<br>" + "<h6> The probability that the object is glass is </h6>" + prediction[1].probability.toFixed(2) * 100 + "%" + "<br>" + "<h6> Please throw it into the " +brownresult + " trash can </h6>" + "<br>";
    }

    else if (max == prediction[2].probability.toFixed(2) * 100) {
        document.getElementById("blue-container").innerHTML = "";
        document.getElementById("brown-container").innerHTML = "";
        document.getElementById("normal-container").innerHTML = "";
        document.getElementById("orange-container").innerHTML = "<br>" + "<h6> The probability that the object is plastic or aluminium item is </h6>" + prediction[2].probability.toFixed(2) * 100 + "%" + "<br>" + "<h6> Please throw it into the " +orangeresult + " trash can </h6>" + "<br>";
    }

    else if (max == prediction[3].probability.toFixed(2) * 100) {
        document.getElementById("blue-container").innerHTML = "";
        document.getElementById("brown-container").innerHTML = "";
        document.getElementById("orange-container").innerHTML = "";
        document.getElementById("normal-container").innerHTML = "<br>" + "<h6> The probability that the object is non-recyclable item is </h6>" + prediction[3].probability.toFixed(2) * 100 + "%" + "<br>" + "<h6> Please throw it into the normal trash can </h6>" + "<br>";
    }

}
async function play() {
    webcam.play();
}

async function pause() {
    webcam.pause();
    var result = document.getElementById("label-container");
    result.scrollIntoView();
}

async function flip() {
    webcam.flip();
}
