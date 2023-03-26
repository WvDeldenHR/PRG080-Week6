import { DecisionTree } from "./libraries/decisiontree.js"

fetch("./model.json").then((response) => response.json()).then((model) => modelLoaded(model))

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    const form = document.getElementById('mushroomForm');
    form.addEventListener('submit', event => {
        event.preventDefault();

        const bruises = document.getElementById('bruises').value;
        const cap_shape = document.getElementById('cap-shape').value;
        const population = document.getElementById('population').value;
        const cap_color = document.getElementById('cap-color').value;

        const prediction = decisionTree.predict({ bruises, cap_shape, population, cap_color });
                    
        const resultElement = document.getElementById('predictionResult');
        if (prediction === 'e') {
            resultElement.innerHTML = 'Prediction: It is edible';
        } else {
            resultElement.innerHTML = 'Prediction: It is poisonous';
        }
    });
}