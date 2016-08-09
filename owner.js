

var accounts;
var account;
var balance;
var admin = Admin.deployed();
var user = User.deployed();

function checkBalance(){
  var admAddr = document.getElementById("admAddr");
  var admBal = document.getElementById("admBal");
  var contAddr = document.getElementById("contAddr");
  var contBal = document.getElementById("contBal");


  admAddr.innerHTML = "Admin/Owner Address: ";
  admBal.innerHTML = "Admin/Owner Balance: ";
  contAddr.innerHTML = "Contract Address: ";
  contBal.innerHTML = "Contract Balance: ";

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
