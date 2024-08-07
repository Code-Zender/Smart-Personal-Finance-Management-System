let transactions = [];

        async function load() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found. Please log in.');
                return;
            }

            const user = parseJwt(token);
            if (!user || !user.userID) {
                alert('Invalid token.');
                return;
            }

            const userID = user.userID.toString();

            try {
                const response = await fetch('/getTransactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: userID })
                });

                if (response.ok) {
                    transactions = await response.json();
                    displayTransactions(transactions);
                    calculateTotal(transactions);
                    console.log(transactions);
                } else {
                    alert('Error fetching transactions');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error fetching transactions');
            }
        }

        function displayTransactions(transactions) {
            const incomeList = document.getElementById('incomeList');
            const expenseList = document.getElementById('expenseList');

            incomeList.innerHTML = '';
            expenseList.innerHTML = '';

            transactions.forEach(transaction => {
                generateTransactionEntries(transaction).forEach(entry => {
                    const li = document.createElement('li');
                    const date = new Date(entry.date).toLocaleDateString();
                    li.innerHTML = `
                        <span class="transaction-date">${date}</span>: 
                        <span class="transaction-amount">${entry.amount} ${entry.currency}</span> - 
                        <span class="transaction-category">${entry.category}</span> 
                        (${entry.description}) <img class="img" src="../src/img/del.png" alt="Delete" onclick="delEntry('${entry._id}')"> <img class="img" src="../src/img/edit.png" alt="edit" onclick="editEntry('${entry._id}')">
                        ${entry.frequency ? `<br><span class="transaction-frequency">Frequency: ${entry.frequency}</span>` : ''}
                    `;

                    if (transaction.type === 'income') {
                        incomeList.appendChild(li);
                    } else if (transaction.type === 'expense') {
                        expenseList.appendChild(li);
                    }
                });
            });
        }

        function generateTransactionEntries(transaction) {
            const entries = [];
            const currentDate = new Date();
            const startDate = new Date(transaction.date);
            const endDate = transaction.end_date ? new Date(transaction.end_date) : currentDate;
            let nextDate = startDate;
            if(nextDate <= currentDate && nextDate <= endDate){
                console.log("YES")
            
                while (nextDate <= currentDate && nextDate <= endDate) {
                    const newEntry = { ...transaction, date: nextDate.toISOString().split('T')[0] };
                    entries.push(newEntry);
        
                    if (transaction.frequency === 'daily') {
                        nextDate.setDate(nextDate.getDate() + 1);
                    } else if (transaction.frequency === 'weekly') {
                        nextDate.setDate(nextDate.getDate() + 7);
                    } else if (transaction.frequency === 'monthly') {
                        nextDate.setMonth(nextDate.getMonth() + 1);
                    } else if (transaction.frequency === 'yearly') {
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                    } else {
                        break;
                    }
                }
                return entries;
            }else{
              
                return [transaction]
            }
            
        }

        async function delEntry(transactionID){
            console.log(transactionID);
            transactionID = transactionID.toString();
            console.log(transactionID);
            try {
                const response = await fetch('/delTransaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: transactionID })
                });

                if (response.ok) {
                    console.log(response);
                } else {
                    alert('Error deleting transaction');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting transaction');
            }
            location.reload()
        }

        function editEntry(transactionID) {
            const transaction = transactions.find(t => t._id === transactionID); 
            if (!transaction) {
                alert('Transaction not found.');
                return;
            }

            // Show the edit form
            document.getElementById('editFormContainer').style.display = 'block';
            
            // Pre-fill the form with transaction details
            document.getElementById('editTransactionId').value = transaction._id;
            document.getElementById('editType').value = transaction.type;
            document.getElementById('editAmount').value = transaction.amount;
            document.getElementById('editCurrency').value = transaction.currency;
            document.getElementById('editCategory').value = transaction.category;
            document.getElementById('editDate').value = transaction.date;
            document.getElementById('editDescription').value = transaction.description;
            document.getElementById('editRecurring').value = transaction.recurring ? 'yes' : 'no';
            if (transaction.recurring) {
                document.getElementById('editFrequency').value = transaction.frequency;
                document.getElementById('editEndDate').value = transaction.end_date;
                document.getElementById('editRecurringOptions').classList.remove('hidden');
            } else {
                document.getElementById('editRecurringOptions').classList.add('hidden');
            }
        }

        function cancelEdit() {
            document.getElementById('editFormContainer').style.display = 'none';
            location.reload()
        }

        async function saveEdit() {
            const updatedTransaction = {
                _id: document.getElementById('editTransactionId').value,
                type: document.getElementById('editType').value,
                amount: document.getElementById('editAmount').value,
                currency: document.getElementById('editCurrency').value,
                category: document.getElementById('editCategory').value,
                date: document.getElementById('editDate').value,
                description: document.getElementById('editDescription').value,
                recurring: document.getElementById('editRecurring').value === 'yes',
                frequency: document.getElementById('editRecurring').value === 'yes' ? document.getElementById('editFrequency').value : null,
                end_date: document.getElementById('editRecurring').value === 'yes' ? document.getElementById('editEndDate').value : null
            };

            try {
                const response = await fetch('/editTransaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedTransaction)
                });

                if (response.ok) {
                    const updatedTransactions = await response.json();
                    transactions = updatedTransactions;
                    displayTransactions(transactions);
                    cancelEdit();
                } else {
                    alert('Error saving transaction');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error saving transaction');
            }
        }

        async function calculateTotal(transactions) {
            const currencyRates = await fetchCurrencyRates();
            const currencyCounts = {};
            let totalIncomeConverted = {};
            let totalExpenseConverted = {};
            let mostUsedCurrency = "USD";
            let maxCount = 0;
            
            transactions.forEach(transaction => {
                generateTransactionEntries(transaction).forEach(entry => {
                    const { amount, currency } = entry;
                    if(!totalIncomeConverted[currency] && transaction.type === 'income'){
                        totalIncomeConverted[currency] = 0

                    }else if(!totalExpenseConverted[currency]&&transaction.type === 'expense'){
                        totalExpenseConverted[currency] = 0
 
                    }
                    if (transaction.type === 'income') {
                        console.log(amount)
                        totalIncomeConverted[currency] += parseInt(amount);

                    } else if (transaction.type === 'expense') {
                        console.log(amount,"expense")
                        totalExpenseConverted[currency] += parseInt(amount);
                    }

                });
                
            });
            cur = "USD"
            most = ""
            mostI = {name:"",value:0}
            mostE = {name:"",value:0}
            convertedAmountExpense = 0
            convertedAmountIncome = 0
            forEach(totalIncomeConverted, function(value,key,obj){
                    console.log(key,value)
                    console.log(value > mostI["value"])
                    if(value > mostI["value"]){
                        mostI = {name:key,value:parseInt(value)}
                        console.log(mostI)
                    }
                    
            }); 
            forEach(totalIncomeConverted, function(value,key,obj){
                    console.log(key,value)
                    if (key != mostI["name"]){
                        console.log(value, key, mostI["name"], currencyRates)
                        convertedAmountIncome += convertCurrency(parseInt(value), key, mostI["name"], currencyRates);
                    }else{
                        convertedAmountIncome += parseInt(value)
                    }
            }); 

            forEach(totalExpenseConverted, function(value,key,obj){
                    console.log(key,value)
                    console.log(value > mostE["value"])
                    if(value > mostE["value"]){
                        mostE = {name:key,value:value}
                        console.log(mostE)
                    }
                    
            }); 
            forEach(totalExpenseConverted, function(value,key,obj){
                    console.log(key,value)
                    if (key != mostE["name"]){
                        console.log(value, key, mostE["name"], currencyRates)
                        convertedAmountExpense += convertCurrency(value, key, mostE["name"], currencyRates);
                    }else{
                        convertedAmountExpense += value
                    }
            }); 
            if (convertedAmountExpense && convertedAmountIncome){
                if (convertedAmountExpense < convertedAmountIncome){
                    most = mostI["name"]
                    total = convertCurrency(convertedAmountExpense, mostE["name"], most, currencyRates);
                    total = convertedAmountIncome - total

                }else{
                    most = mostE["name"]
                    total = convertCurrency(convertedAmountIncome, mostI["name"], most, currencyRates);
                    total = total - convertedAmountExpense
                }
            }else if(convertedAmountExpense && !convertedAmountIncome){
                most = mostE["name"]
                total = convertedAmountExpense
            }else if(convertedAmountIncome && !convertedAmountExpense){
                most = mostI["name"]
                total = parseInt(convertedAmountIncome)
            }
            total = parseInt(total)
            console.log(total)
            const amountValue = document.getElementById('amountValue');
            if (amountValue) {
                amountValue.textContent = `${total.toFixed(2)} ${most}`;
            } else {
                console.error('Element with id "amountValue" not found.');
            }
  



        }
        function forEach(obj,callback){
            for(let key in obj){
                if(obj.hasOwnProperty(key)){
                    callback(obj[key],key,obj)
                }
            }
        }

        async function fetchCurrencyRates() {
            const appId = 'cd379f04131543818f76dfdbc0eac0f4'; // Hier tragen Sie Ihre eigene App-ID ein
            const baseCurrency = 'USD'; // Die Basiswährung für die Umrechnung (hier USD)
            const symbols = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD'].join(','); // Symbole der Zielwährungen für die Umrechnung
            const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${appId}&base=${baseCurrency}&symbols=${symbols}`;
            
            try {
                const response = await fetch(apiUrl);
               
                if (!response.ok) {
                    throw new Error('Failed to fetch currency rates');
                }
                const data = await response.json();
 console.log(data)
                return data.rates;
            } catch (error) {
                console.error('Error fetching currency rates:', error);
                // Falls ein Fehler auftritt, können Sie hier fallback-Logik hinzufügen oder eine Standardrate verwenden
                return {
                    'EUR': 0.89, // Beispiel: 1 USD = 0.89 EUR
                    'GBP': 0.78, // Beispiel: 1 USD = 0.78 GBP
                    'JPY': 110.25, // Beispiel: 1 USD = 110.25 JPY
                    'AUD': 1.32, // Beispiel: 1 USD = 1.32 AUD
                    'CAD': 1.25, // Beispiel: 1 USD = 1.25 CAD
                };
            }
        }

        function convertCurrency(amount, fromCurrency, toCurrency, rates) {
            if (fromCurrency === toCurrency) {
                return amount;
            }
            if (fromCurrency == "USD"){
                rate = rates[toCurrency];

                console.log(rate)
            }else if (toCurrency == "USD"){
                rate = rates[fromCurrency];

                console.log(rate)
            }else{
                rate = rates[toCurrency] / rates[fromCurrency];

                console.log(rate)
            }
            console.log(amount * rate)
            return amount * rate;
        }

        function parseJwt(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error('Error parsing token:', error);
                return null;
            }
        }

        window.onload = load;