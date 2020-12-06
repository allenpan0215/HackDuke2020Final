firebase.initializeApp({
  apiKey: 'AIzaSyDJJ2q3bUvf4vbtjuDXBryAMzqW5qeigw8',
  authDomain: 'hackduke-environment.firebaseapp.com',
  projectId: 'hackduke-environment'
});
var db = firebase.firestore();



function storeData() {
  var w = 0;
  var companyOption = [];
  var brandOption = [];
  var productOption = [];
  var dataArray = [];
  var dataRef = db.collection("Data");
  dataRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var companyName = doc.get("Company");
      if (!companyOption.includes(companyName)) {
        companyOption.push(companyName);
      }
      var brandName = doc.get("Brand");
      if (!brandOption.includes(brandName)) {
        brandOption.push(brandName);
      }
      var productName = doc.get("Product");
      if (!productOption.includes(productName)) {
        productOption.push(productName);
      }
      var production = doc.get("Production");
      var packaging = doc.get("Packaging");
      var transportation = doc.get("Transportation");
      var total = doc.get("Total");
      dataArray.push(companyName + "," + brandName + "," + productName + "," + production + "," + packaging + "," + transportation + "," + total + "," + w);
      w++;
      console.log(dataArray);
    });
    companyOption.sort();
    brandOption.sort();
    productOption.sort();
    addCompanyOption(companyOption);
    addBrandOption(brandOption);
    addProductOption(productOption);
    dataArray.sort();
    createTable(dataArray);
  });
}



document.getElementById("search-button").addEventListener("click", updateItems);

function updateItems() {
  if (document.getElementById("company").value == "" && document.getElementById("brand").value == "" && document.getElementById("product").value == "") {
    location.reload();
  }
  $("#search-section").remove();
  var companyOption = [];
  var brandOption = [];
  var productOption = [];
  var dataArray = [];
  if (!document.getElementById('product').value == "") {
    var dataRef = db.collection("Data").where("Product", "==", document.getElementById('product').value);
  } else if (!document.getElementById("company").value == "" && !document.getElementById("brand").value == "") {
    var dataRef = db.collection("Data").where("Company", "==", document.getElementById('company').value).where("Brand", "==", document.getElementById('brand').value);
  } else if (document.getElementById("company").value == "" && !document.getElementById("brand").value == "") {
    var dataRef = db.collection("Data").where("Brand", "==", document.getElementById('brand').value);
  } else {
    var dataRef = db.collection("Data").where("Company", "==", document.getElementById('company').value);
  }
  dataRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var companyName = doc.get("Company");
      console.log(companyName);
      if (!companyOption.includes(companyName)) {
        companyOption.push(companyName);
      }
      var brandName = doc.get("Brand");
      if (!brandOption.includes(brandName)) {
        brandOption.push(brandName);
      }
      var productName = doc.get("Product");
      if (!productOption.includes(productName)) {
        productOption.push(productName);
      }
      dataArray.push(companyName + "," + brandName + "," + productName);
    });
    console.log(dataArray.length);
    companyOption.sort();
    brandOption.sort();
    productOption.sort();
    addCompanyOption(companyOption);
    addBrandOption(brandOption);
    addProductOption(productOption);
    dataArray.sort();
    createTable(dataArray);
  });
}

function addCompanyOption(array) {
  var companyID = document.getElementById('company');
  for (var i = 0; i < array.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = array[i];
    companyID.appendChild(opt);
  }
}

function addBrandOption(array) {
  var brandID = document.getElementById('brand');
  for (var i = 0; i < array.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = array[i];
    brandID.appendChild(opt);
  }
}

function addProductOption(array) {
  var productID = document.getElementById('product');
  for (var i = 0; i < array.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = array[i];
    productID.appendChild(opt);
  }
}

function createTable(array) {

var all = [];
  var body = document.body;
  var section = document.getElementById('item-search');
  var tbl = document.createElement('table');
  tbl.classList.add("table");
  tbl.classList.add("table-striped");
  tbl.id = "search-section";
  var thead = document.createElement('thead');
  var tr1 = tbl.insertRow();
  var td = tr1.insertCell();
  td.appendChild(document.createTextNode('COMPANY'));
  td = tr1.insertCell();
  td.appendChild(document.createTextNode('BRAND'));
  td = tr1.insertCell();
  td.appendChild(document.createTextNode('PRODUCT'));
  for (var i = 0; i < array.length; i++) {
    var tr = tbl.insertRow();
    var split = array[i].split(",")
    console.log(split);
    var productName = split[2];
    var valueProduction = split[3];
    var valuePackaging = split[4];
    var valueTransportation = split[5];
    var valueTotal = split[6];
    var valueImage = split[7];
    for (var j = 0; j < 3; j++) {

      var td = tr.insertCell();

      td.appendChild(document.createTextNode(split[j]));
      all.push(split[j]);
    }
    for (var j = 3; j < 7; j++){
      all.push(split[j]);
    }

    var td = tr.insertCell();
    var b = document.createElement('a');
    var linkText = document.createTextNode("See Carbon Footprint");
    b.appendChild(linkText);
    productName = productName.replace(/\s+/g, '-');
    b.id = productName;
    b.classList.add("productClass");
    b.title = "my title text";
    b.href = "product.html?name="+productName+"%20valueProduction="+valueProduction + "%20valuePackaging=" + valuePackaging + "%20valueTransportation=" + valueTransportation + "%20valueTotal=" + valueTotal + "%20valueImage=" + valueImage;
    td.appendChild(b);

  }
  section.appendChild(tbl);
}





storeData();
