Number.prototype.toDollars = function () { return `$${this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` }
String.prototype.toFloat = function () { return Math.floor(100 * parseFloat(this.replace("$", "").replace(",", ""))) / 100 }
const treegrid = document.querySelector(`table[role="treegrid"]`)
const rows = Array.from(treegrid.querySelectorAll("tr")).reverse()
const initialBalance = 1020.52
var total = 0;
rows.reduce((runningBalance, row, index) => {
      const increaseAmount = 700
      const positiveIconClass = "transaction-icon-income"
      const negativeIconClass = "transaction-icon-expense"
      //GetElements
      const transactionIconElement = row.querySelector(".transaction-icon");
      const transactionAmountElement = row.querySelector(`[data-stable-name=Amount] span`);
      const rowBalanceElement = row.querySelector(`[data-field=Balance]`)
      const rowDescriptionElement = row.querySelector(`[data-field=Description]`)
      if (transactionAmountElement) {
            const transactionAmount = Math.floor(100 * transactionAmountElement.innerText.toFloat()) / 100
            var currentBalance = transactionAmount;
            if (rowBalanceElement) {
                  if (transactionIconElement.classList.contains(positiveIconClass)) {
                        rowDescriptionElement.innerText = "Deposit"
                        currentBalance += increaseAmount;
                        total += currentBalance;
                        transactionAmountElement.innerText = currentBalance.toDollars()
                  }
            }
            rowBalanceElement.innerText = (Math.floor(100 * (runningBalance + currentBalance)) / 100).toDollars()
            return runningBalance += currentBalance;
      }
      return runningBalance;
}, initialBalance)
var divToPrint=treegrid;
newWin= window.open("");
newWin.document.write(divToPrint.outerHTML);
newWin.print();
newWin.close();