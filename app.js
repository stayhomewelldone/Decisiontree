import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

//
// DATA
//
const csvFile = "./data/diabetes.csv";
const trainingLabel = "Label";
const ignored = [];
const treeDept = 3;
let firstleftHtml = document.getElementById("pdad");
let firstrightHtml = document.getElementById("phad");
let secondleftHtml = document.getElementById("pdah");
let secondrightHtml = document.getElementById("phah");
let accuracyHtml = document.getElementById("accuracy");
// let table = document.getElementById("confusion")
let [amountCorrect, totalAmount] = [0, 0];
let [pdad, pdah, phad, phah] = [0, 0, 0, 0];

//
// laad csv data als json
//
function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (result) => trainModel(result.data), // gebruik deze data om te trainen
  });
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
  // todo : splits data in traindata en testdata

  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);

  // maak het algoritme aan
  let decisionTree = new DecisionTree({
    ignoredAttributes: ["Label"],
    trainingSet: trainData,
    categoryAttr: trainingLabel,
    maxTreeDepth: treeDept,
  });
  let json = decisionTree.stringify();
  console.log(json);

  // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
  let visual = new VegaTree("#view", 800, 400, decisionTree.toJSON());

  totalAmount = testData.length;
  console.log(totalAmount);
  // todo : maak een prediction met een sample uit de testdata
  // console.log(testData[7])
  for (let i = 0; i < testData.length; i++) {
    let person = testData[i];
    console.log(person);
    testPerson(person, decisionTree);
  }
  // let person = testData[7]
  // let personPrediction = decisionTree.predict(person)
  // testPerson(person, decisionTree)
  // console.log(`Has diabetes : ${personPrediction}`)

  // todo : bereken de accuracy met behulp van alle test data
  let accuracy = amountCorrect / totalAmount;
  console.log(accuracy);
  accuracyHtml.textContent += accuracy;
  firstrightHtml.textContent += phad;
  firstleftHtml.textContent += pdad;
  secondleftHtml.textContent += pdah;
  secondrightHtml.textContent += phah;
}

function confusionMatrix(person, prediction) {
  if (prediction == "0" && person.Label == "1") {
    console.log("🥗 predicted healthy, but had actually diabetes 🤢");
    phad++;
  }
  if (prediction == "1" && person.Label == "1") {
    console.log("🤢 predicted diabetes, and had indeed diabetes 🤢");
    pdad++;
  }
  if (prediction == "1" && person.Label == "0") {
    console.log("🤢 predicted diabetes, and was actually healthy 🥗");
    pdah++;
  }
  if (prediction == "0" && person.Label == "0") {
    console.log("🥗 predicted healthy, and was indeed healthy 🥗");
    phah++;
  }
}

function testPerson(person, decisionTree) {
  // kopie van person maken, zonder het "survived" label
  let personWithLabel = { ...person },
    personWithoutLabel = { ...person };
  delete personWithoutLabel.Label;
  console.log(personWithoutLabel);
  console.log(personWithLabel);
  // prediction
  let prediction = decisionTree.predict(personWithoutLabel);
  confusionMatrix(personWithLabel, prediction);
  console.log(prediction);
  // vergelijk de prediction met het echte label
  if (prediction == person.Label) {
    amountCorrect++;
    console.log("goed voorspeld!");
  } else {
    console.log("fout voorspeld!");
  }
  // let message = (prediction == person.Label) ? amountCorrect++ && "goed voorspeld!" : "fout voorspeld!";

  // console.log(message)

  console.log(amountCorrect);
}

loadData();
