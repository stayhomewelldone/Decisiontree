import { DecisionTree } from "./libraries/decisiontree.js";
// import { VegaTree } from "./libraries/vegatree.js";

let predictedHtml = document.getElementById("predict");
const form = document.getElementById("myForm");
let decisionTree;
//
form.addEventListener("submit", function (event) {
  event.preventDefault();
  predictedHtml.textContent = "";

  const Glucose = parseFloat(document.getElementById("glucose").value);
  const Pregnant = parseFloat(document.getElementById("pregnant").value);
  const Bp = parseFloat(document.getElementById("bp").value);
  const Skin = parseFloat(document.getElementById("skin").value);
  const Insulin = parseFloat(document.getElementById("insulin").value);
  const bmi = parseFloat(document.getElementById("bmi").value);
  const Pedigree = parseFloat(document.getElementById("pedigree").value);
  const Age = parseFloat(document.getElementById("age").value);

  // console.log(`glucose: ${glucose}, pregnant: ${pregnant}`);
  let diabetes = {
    Pregnant,
    Glucose,
    Bp,
    Skin,
    Insulin,
    bmi,
    Pedigree,
    Age,
  };
  console.log(diabetes);

  let prediction = decisionTree.predict(diabetes);
  console.log("predicted " + prediction);
  prediction == 1
    ? (predictedHtml.textContent += "YES") && alert("Congratulations, you're healthy!")
    : (predictedHtml.textContent += "NO") && alert("Oh, Make an appointment with your doctor");
});
// laad csv data als json
//
function loadSavedModel() {
  fetch("./model.json")
    .then((response) => response.json())
    .then((model) => modelLoad(model));
}
//
// MACHINE LEARNING - Decision Tree
//
function modelLoad(model) {
  // todo : splits data in traindata en testdata

  // maak het algoritme aan
  decisionTree = new DecisionTree(model);

  // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
  // let visual = new VegaTree("#view", 800, 400, decisionTree.toJSON());
}

loadSavedModel();
