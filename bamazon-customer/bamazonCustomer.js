// Initialize npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Connect MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// Creates and loads the product to server on connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Logs results to the console
function loadProducts() {

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    console.table(res);

    promptCustomerForItem(res);
  });
}

function promptCustomerForItem(inventory) {
  
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "Pick product ID to purchase? [Hit Q to quit]",
        validate: function(val) {
        //checks for lower case q too
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      
      checkIfShouldExit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);

      // If a product id matches, ask for quantity needed
      if (product) {
        
        promptCustomerForQuantity(product);
      }
      else {
        
        console.log("\nThat item is not in the inventory.");
        loadProducts();
      }
    });
}

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      
      checkIfShouldExit(val.quantity);
      var quantity = parseInt(val.quantity);

      // Check quantity desired against available and notes insufficient
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();
      }
      else {
        
        makePurchase(product, quantity);
      }
    });
}

function makePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Successful purchase alert
      console.log("\nSuccessfully purchased " + quantity + " " + product.prod_name + "'s!");
      loadProducts();
    }
  );
}

// Inventory check run
function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
}

function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log message and quit running node process
    console.log("Adios!");
    process.exit(0);
  }
}
