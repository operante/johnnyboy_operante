/* computeLoan()
 *
 * This function is invoked when Calculate Payment button is clicked to read the purchase price, loan term, and other details to simulate and display the Monthly payment, Total Payment, Total Interest.
 *
 */
function computeLoan() {
    if (document.getElementById("purchasePrice").value) {
        let purchasePrice = document.getElementById("purchasePrice").value;
        let interestRate = document.getElementById("rate").value * 0.01;       // % converted to decimal
        let numbersMonths = document.getElementById("months").value * 12;      // Years converted to numbers of month
        let zipCode = document.getElementById("zipcode").value;                       // zip code
        let downPercent = document.getElementById("downPercent").value * 0.01; // % converted to decimal
        let downPayment = purchasePrice * downPercent;                         // Downpayment in $
        let loanPrincipal = purchasePrice - downPayment;
        let monthlyPayment = new MonthlyPayment(loanPrincipal, numbersMonths, interestRate); //monthly total payment
        let monthlyPaymentLocale = Number(monthlyPayment.payment).toLocaleString();
        let totalEverything = monthlyPayment.payment * numbersMonths;
        let totalEverythingLocale = Number(totalEverything.toFixed(2)).toLocaleString();
        let totalInterest = totalEverything - loanPrincipal;
        let totalInterestLocale = Number(totalInterest.toFixed(2)).toLocaleString();

        document.getElementById("downpayment").innerHTML = "$" + downPayment;
        document.getElementById('newPayment').innerHTML = "Your Monthly Payment = $" + monthlyPaymentLocale;
        document.getElementById('monthly').innerHTML = "Your monthly total payment is: " + "$" + monthlyPaymentLocale;
        document.getElementById('total').innerHTML = "Your total payment: " + "$" + totalEverythingLocale;
        document.getElementById('interest').innerHTML = "Your interest amount is: " + "$" + totalInterestLocale;

        getLender(document.getElementById('purchasePrice').value, numbersMonths, zipCode);
    } else {
        document.getElementById("validateAmountMsg").innerHTML = "Purchase price is required.";
    }
}


/* getLender(loadPrincipal, loanTerm)
 * Called by computeLoan().
 * Get mortgate lender
 */
function getLender(loanPrincipal, loanTerm, zipCode){
    let f = new XMLHttpRequest();
    // let html = "";
    f.open('GET', './data/data.json', true);
    f.send();
    f.onreadystatechange = function() {
        if (f.readyState != 4) return;
        if (f.status != 200) {
            console.log(f.status + ': ' + f.statusText);
        } else {
            generateInnerHTML(f, loanPrincipal, loanTerm, zipCode);
        }
    }
}

/* generateInnerHTML(f, html, loanPrincipal)
 * Called by getLender().
 * Generate lender list HTML and insert into the page.
 */
function generateInnerHTML(f, loanPrincipal, loanTerm, zipCode) {
    let html = "";
    let dataArray = JSON.parse(f.responseText);
    let term = loanTerm / 12;
    for (let i = 0; i < dataArray.length; i++) {
        if (zipCode != "" && dataArray[i].zipCode == zipCode && term == dataArray[i].termYear) {
            //if (term == dataArray[i].termYear) {
                let lender = dataArray[i].lenderName;
                let rate = dataArray[i].mortgageRate * 0.01;
                let monthlyPayment = new MonthlyPayment(loanPrincipal, loanTerm, rate);
                let monthlyPaymentLocale = Number(monthlyPayment.payment).toLocaleString();
                let phone = dataArray[i].phoneNumber;
                let zipcode = dataArray[i].zipCode;
                let webUrl = dataArray[i].website;
                html +=
                    'Lender : ' + lender + '&nbsp' +
                    '<a class="glyphicon glyphicon-link" aria-hidden="true" href=' + webUrl + '></a>' + '<br>' +
                    'Rate : ' + (rate * 100).toFixed(3) + '<br>' +
                    'Monthly Payment :' + "$" + monthlyPaymentLocale + '<br>' +
                    'Lender Phone No. : ' + phone + '<br>' +
                    'Lender Zipcode : ' + zipcode + '<br>' +
                    'Lender Website : ' + webUrl + '<br><br>';
                document.getElementById('lender-list').innerHTML = html;
        //    }
        }
    }
}

/* MonthlyPayment(loanPrincipal, numberOfMonths, rate)
Calculate Monthly Payment, used in both User the specified rate as well as lender-term specific rates
 * M = P * (r(1+r)^n / (1+r)^n - 1)
 * M: Monthly Payment
 * P: Principal
 * r: monthly interest rate, annual interest rate divided by 12.
 * n: number of payments
 */
function MonthlyPayment (loanPrincipal, numberOfMonths, rate) {
    this.loanPrincipal = loanPrincipal;
    this.numberOfMonths = numberOfMonths;
    this.rate = rate;
    let monthlyRate = (this.rate/12);         // This is r.
    let payment = this.loanPrincipal *
        ((monthlyRate*(1 + monthlyRate) ** this.numberOfMonths)
            /((1 + monthlyRate) ** this.numberOfMonths - 1));       // monthly payment
    this.payment = payment.toFixed(2).toString();
}

/*
 * Input validations
 */
function checkPurchasePrice() {
    if (document.getElementById("purchasePrice").value) {
        document.getElementById("validateAmountMsg").innerHTML = "";
    } else {
        document.getElementById("validateAmountMsg").innerHTML = "Please only enter numbers.";
    }
}

function checkZipcode() {
    if (document.getElementById("zipcode").value) {
        document.getElementById("validateZipcodeMsg").innerHTML = "";
    } else {
        document.getElementById("validateZipcodeMsg").innerHTML = "Please only enter numbers for the zipcode.";
    }
}