

document.addEventListener('DOMContentLoaded', async function() {
    const ctx = document.getElementById('myChart').getContext('2d');
    let backgroundColores = [
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)'
    ]
    let borderColors = [
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 255, 0, 1)'
    ]
    const entries = await load();
    const months = getUniqueMonths(entries);
    const sortedMonths = sortMonths(months);
    const data = generateData(entries, months);
    console.log(data)
    const Colors = getPositve(backgroundColores,data,borderColors)
    console.log(data)
    const myChart = new Chart(ctx, {
        type: 'bar', // Typ des Diagramms: 'bar', 'line', 'pie', etc.
        data: {
            labels: months,
            datasets: [{
                label: 'Gewinn/monat',
                data: data,
                backgroundColor: Colors[0],
                borderColor: Colors[1],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

async function load() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No token found. Please log in.');
        return [];
    }

    const user = parseJwt(token);
    if (!user || !user.userID) {
        alert('Invalid token.');
        return [];
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
        const entries = [];
        if (response.ok) {
            const transactions = await response.json();
            console.log(transactions)
            
            transactions.forEach(transaction => {
                
                generateTransactionEntries(transaction).forEach(entry => {
                    
                    entries.push(entry);
                    console.log(entry)
                });
            });
            return entries;
        } else {
            alert('Error fetching transactions');
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching transactions');
        return [];
    }
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

function getMonthName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', { month: 'long' });
}

function generateTransactionEntries(transaction) {
    const entries = [];
    const currentDate = new Date();
    const startDate = new Date(transaction.date);
    const endDate = transaction.end_date ? new Date(transaction.end_date) : currentDate;
    let nextDate = startDate;
    if(nextDate <= currentDate && nextDate <= endDate && transaction.recurring == true){
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
function getUniqueMonths(entries) {
    const months = new Set();
    entries.forEach(entry => {
        const month = getMonthName(entry.date);
        months.add(month);
    });
    return Array.from(months);
}

function generateData(entries, months) {
    const data = new Array(months.length).fill(0);
    entries.forEach(entry => {
        const month = getMonthName(entry.date);
        const index = months.indexOf(month);
        if (index !== -1) {
            data[index] += entry.amount || 0; // Summiere den Betrag für diesen Monat
        }
    });
    return data;
}

function calculateTotalValue(entries) {
    return entries.reduce((total, entry) => total + (entry.amount || 0), 0);
}

function sortMonths(months) {
    const monthMap = {
        'Januar': 1, 'Februar': 2, 'März': 3, 'April': 4, 'Mai': 5, 'Juni': 6,
        'Juli': 7, 'August': 8, 'September': 9, 'Oktober': 10, 'November': 11, 'Dezember': 12
    };
    return months.sort((a, b) => monthMap[a] - monthMap[b]);
}
function getPositve(backgroundColors,data,borderColors){
    for(let i = 0; i<=12;i++){
        if(!data[i]){
            break
        }
        if(data[i] < 0){
            backgroundColors[i] = 'rgba(255, 0, 0, 0.2)'
            borderColors[i] = 'rgba(255, 0, 0, 1)'
        }               
    }
    Colors = [backgroundColors,borderColors]
    return Colors      
}