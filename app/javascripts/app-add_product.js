var accounts;
var account;
var balance;
var admin = Admin.deployed();
var user = User.deployed();
var pid;
var customers= new Array();

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function setStatus1(message) {
  var status = document.getElementById("status1");
  status.innerHTML = message;
};


function setProdDetail() {

  var prid = document.getElementById("sprid");
  var price = document.getElementById("sprprice");
  var stock = document.getElementById("sprstock");

  user.returnLatestProd.call({from: account}).then(function(value) {

    prid.innerHTML = "Product ID: " + value[0].valueOf();
    price.innerHTML = "Product Price: " + value[1].valueOf();
    stock.innerHTML = "Product Stock: " + value[2].valueOf();

  }).catch(function(e){
    console.log(e);
    setStatus1("Error while getting Product Detail");
  });

};


function submitProd(){

  var price = document.getElementById("prprice").value;
  var stock = document.getElementById("prstock").value;

  setStatus("Product Submitted. Please Wait....")

  user.addProduct(price, stock, {from:account}).then (function(){

    setStatus("Product Added Successfully.")
    setProdDetail();
    return null;

    }).catch(function(e){
      console.log(e);
      setStatus("Error while adding the product")
  });
};

function refreshProdList() {

  returnProdId();

};

function returnProdId(){

  user.returnProdId.call({from: account}).then(function(value) {

    console.log("Prod ID: " + value.valueOf());
    pid = value.valueOf();
    prodList();
    return null;

    }).catch(function(e){
    console.log(e);
    setStatus1("Error while getting last Product ID");
  });

};

function prodList() {
  var stock;
  var price;

  customers.push(["--Product ID--","--Price--","--Stock--"]);

  user.returnProductList.call(pid,{from: account}).then(function(value) {

    for (var i=0;i<pid;i++){

        console.log(value[0][i].valueOf());
        console.log(value[1][i].valueOf());
        stock = value[0][i].valueOf();
        price = value[1][i].valueOf();
        customers.push([i+1,stock,price]);

    }

    console.log(customers);
    GenerateTable();
    return null;

    }).catch(function(e){
      console.log(e);
      setStatus1("Error while getting Product Detail");
  });


};


function GenerateTable() {


    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    table.border = "1";


    //Get the count of columns.
    var columnCount = customers[0].length;

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = customers[0][i];
        row.appendChild(headerCell);

    }

    //Add the data rows.
    for (var i = 1; i < customers.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = customers[i][j];
        }
    }

    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}

function buyProd() {

  var bpid = document.getElementById('buyProdId').value;
  var account = document.getElementById('buyAcc').value;

  user.returnAddrPrice.call(bpid, {from:account}).then (function(value){

    var etherValue = value[0].valueOf() * 1000000000000000000;
    console.log(value[0].valueOf());
    var contAddress = value[1].valueOf();
    console.log(value[1].valueOf());

    //Send Ether to Contract
      web3.eth.sendTransaction({from:account,to: contAddress, value: etherValue}, function (err, value1) {
       if (err != null) {
         alert ("There was an error fetching contract Balance in Send Ether");
         console.log("Send Ether error: " + err);
       } else {
    }
    });
    //Send Ether to Contract

  }).catch(function(e){
      console.log(e);
      setStatus("Error while buying the product")
  });

  user.buyProd(bpid, {from:account}).then (function(){

    setStatus("Product Bought Successfully.")
    return null;

  }).catch(function(e){
      console.log(e);
      setStatus("Error while buying the product")
  });

};


function checkDetail(){

  var admAddr = document.getElementById("admAddr");
  var admBal = document.getElementById("admBal");
  var contAddr = document.getElementById("contAddr");
  var contBal = document.getElementById("contBal");
  var cdtl = document.getElementById("cdtl");
  cdtl.innerHTML = "Please Wait. Fetching the Details ....";

  user.returnAccAddr.call({from:account}).then (function(value){

    //Owner Balance
    web3.eth.getBalance(value[0].valueOf(),function(err, owner_bal){

      if (err != null) {
        alert("There was an error fetching your balance.");
        return;
      } else {

        admAddr.innerHTML = "Admin/Owner Address: " + value[0].valueOf();
        admBal.innerHTML = "Admin/Owner Balance: " + web3.fromWei(owner_bal,"ether");

      }
    });

//Owner Balance**
    web3.eth.getBalance(value[1].valueOf(),function(err, cont_bal){

      if (err != null) {
        alert("There was an error fetching your balance.");
        return;
      } else {

        contAddr.innerHTML = "Contract Address: " + value[1].valueOf();
        contBal.innerHTML = "Contract Balance: " + web3.fromWei(cont_bal,"ether");
        cdtl.innerHTML = "";
      }

  });
//Owner Balance**
  }).catch(function(e){
      console.log(e);
      setStatus("Error while buying the product")
  });
};

function checkBalance(){

  var bcheck = document.getElementById("checkBal").value;
  var scbal = document.getElementById("scbal");

  web3.eth.getBalance(bcheck,function(err, addr_bal){

    if (err != null) {
      alert("There was an error fetching your balance.");
      return;
    } else {

      scbal.innerHTML = "Your Balance is: " + web3.fromWei(addr_bal,"ether");
    }

  });
};

function sendBalance() {

  var bsend = document.getElementById("sendBal").value;
  var bamt = document.getElementById("sendAmt").value;
  var smpay = document.getElementById("smpay");

  user.sendEther(bamt*1000000000000000000, bsend, {from:account}).then (function(){

    smpay.innerHTML = "Payment Successful"
    return null;

  }).catch(function(e){
      console.log(e);
      setStatus("Error while buying the product")
  });


};

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

  });
};
