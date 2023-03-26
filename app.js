import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignored = ["cap-surface","odor","gill-attachment","gill-spacing","gill-size","gill-color",
"stalk-shape","stalk-root","stalk-surface-above-ring","stalk-surface-below-ring", "stalk-color-above-ring","stalk-color-below-ring",
"veil-type","veil-color","ring-number","ring-type","spore-print-color","habitat"]


// Load CSV Data
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        minNumSamples: 10,
        complete: results => trainModel(results.data)
    })
}

// Decision Tree
function trainModel(data) {
    data.sort(() => (Math.random() - 0.4))

    let trainData = data.slice(0, Math.floor(data.length * 0.4))
    let testData = data.slice(Math.floor(data.length * 0.4))

    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    let json = decisionTree.toJSON()
    let visual = new VegaTree('#view', 2300, 1000, json)

    let mushroom = testData[78]
    let mushroomPrediction = decisionTree.predict(mushroom)
    console.log(`This mushroom is : ${mushroomPrediction}`)

    function testMushroom() {
        let amountCorrect = 0;

        let truePositives = 0;
        let trueNegatives = 0;
        let falsePositives = 0;
        let falseNegatives = 0;

        for (let i = 0; i < testData.length; i++) {
            const mushroomWithoutLabel = { ...testData[i] }
            delete mushroomWithoutLabel.class

            let prediction = decisionTree.predict(mushroomWithoutLabel)

            if (prediction === testData[i].class) {
                amountCorrect++

              if (prediction === "p" && testData[i].class === "p") {
                  truePositives++;
              } else if (prediction === "e" && testData[i].class === "e") {
                  trueNegatives++;
              }
              } else {
                if (prediction === "p" && testData[i].class === "e") {
                  falsePositives++;
              } else if (prediction === "e" && testData[i].class === "p") {
                  falseNegatives++;
              }
            }
        }

        let accuracy = amountCorrect / testData.length
        console.log(`Accuracy: ${accuracy}`)

        console.log(`True Positives: ${truePositives}`);
        console.log(`True Negatives: ${trueNegatives}`);
        console.log(`False Positives: ${falsePositives}`);
        console.log(`False Negatives: ${falseNegatives}`);

        document.getElementById("truePositives").innerHTML = truePositives.toString();
        document.getElementById("trueNegatives").innerHTML = trueNegatives.toString();
        document.getElementById("falsePositives").innerHTML = falsePositives.toString();
        document.getElementById("falseNegatives").innerHTML = falseNegatives.toString();

        return accuracy
    }
    document.getElementById("accuracy").textContent = `Accuracy: ${(testMushroom()*100).toFixed(2)}%`

    let jsonStringify = decisionTree.stringify()
    console.log(jsonStringify)
}

loadData()