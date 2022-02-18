let table;
let date = [];
let gsml = [];
let numRows, numCols;
let dataMax = 0, dataMin;
function preload() {
  table = loadTable("assets/gsml.csv", "csv", "header");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  colorMode(RGB);//Mode de couleur en RGB

// Trouve les données de base, dans la BDD
  numRows = table.getRowCount();
  numCols = table.getColumnCount();
  print("Rows: " + numRows + " , Columns: " + numCols);
  
//Chargement des données dans le code
  for (let r = 0; r < table.getRowCount(); r++) {
    for (let c = 0; c < table.getColumnCount(); c++) {
      date[r] = table.getString(r, 0);
      gsml[r] = table.getNum(r, 1);

//print(date);
    }
  }
  findMinMax();
  cursor(CROSS)
}
let size = [];
let diagramX, diagramY;
let highlight;
let pointsize = 3;

function draw() {
  background(240);
  textInfo();
  
// Change le rayon intérieur
  let xOffset = width / 8 - 100;
  let ang = 360 / numRows;

// Place la data dans la page. Ne pas toucher
  diagramX = (width / 4) * 3 - 90;
  diagramY = height / 2;
  
//Tourne le radian;
  for (let i = 0; i < numRows; i++) {
    
// Changer le rayon extérieur
    size[i] = map(gsml[i], -0.41, 0.903, 105, 250);
    let pointx = (size[i] + xOffset) * cos(radians(ang * i)) + diagramX;
    let pointy = (size[i] + xOffset) * sin(radians(ang * i)) + diagramY;
    let circlex = xOffset * cos(radians(ang * i)) + diagramX;
    let circley = xOffset * sin(radians(ang * i)) + diagramY;
    
//draw indicator
    stroke("grey");
    noFill();
    
//circle(diagramX,diagramY,xOffset*2)
    if (i % 12 === 0) {
      line(pointx, pointy, circlex, circley);
    } else {
      stroke("grey");
      
// Epaisseur des traits.
      strokeWeight(1);
      line(pointx, pointy, circlex, circley);
    }
//longueur des traits
    if (i+35 < numRows - 40) {
      let nextpointx =
        (size[i + 1] + xOffset) * cos(radians(ang * i + 1)) + diagramX;
      let nextpointy =
        (size[i + 1] + xOffset) * sin(radians(ang * i + 1)) + diagramY;
      line(pointx, pointy, nextpointx, nextpointy);
    }
    
//tag
    let dis = dist(mouseX, mouseY, pointx, pointy);
    if (dis < 4) {
      fill("black");

// Texte
      textFont('roboto-medium');
      textSize(17);
      textAlign(CENTER)
      text(date[i], diagramX, diagramY);
      fill("blue");
      
// Rectangle de séparation des deux textes.
      noStroke();
      rect(diagramX, diagramY + 15, 80, 5);
      textSize(16);
      text(gsml[i]+"°C", diagramX, diagramY + 45);
      highlight = color("red");
      pointsize = 16;
    } else {
      
// Epaisseur des points.
      pointsize=15;
      highlight = color("blue"); 
    }
// Points sur le dessin
    fill(highlight);
    noStroke();
    circle(pointx, pointy, pointsize);
  }
}
function textInfo(){
  textFont('roboto-bold');
  textSize(17)
  textAlign(LEFT)
  fill('black')
  text("Toutes les valeurs sont exprimées en degré Celsius.", width/5,height/7,width/4)
}
function findMinMax(){
  
//Trouve les datas maximum et minimum
  for (let i = 0; i < numRows; i++) {
    if (table.getNum(i, 1) > dataMax) {
      dataMax = table.getNum(i, 1);
    }
  }
  dataMin = dataMax;
  for (let i = 0; i < numRows; i++) {
    if (table.getNum(i, 1) < dataMin) {
      dataMin = table.getNum(i, 1);
    }
  }
  print( " Valeur Minimal: " + dataMin + " Valeur Maximale: " + dataMax);
}