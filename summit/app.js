// 

const customersUrl = 'http://localhost:3000/customers';
const transactionsUrl = 'http://localhost:3000/transactions';

let customersData = [];
let transactionsData = [];
let bubbleChart;

document.addEventListener('DOMContentLoaded', () => {
    fetchCustomerData();
    fetchTransactionData();
});

async function fetchCustomerData() {
    try {
        const response = await fetch(customersUrl);
        if (!response.ok) {
            console.log("error");
        }
        customersData = await response.json();
        filterAndRender();
    } catch (error) {
        console.error('Error fetching customer data:', error);
        alert('Failed to fetch customer data. Please try again later.');
    }
}

async function fetchTransactionData() {
    try {
        const response = await fetch(transactionsUrl);
        if (!response.ok) {
            console.log("error");
        }
        transactionsData = await response.json();
        filterAndRender();
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        alert('Failed to fetch transaction data. Please try again later.');
    }
}

function renderTable(customers, transactions) {
    const tbody = document.querySelector('#customerTable tbody');
    tbody.innerHTML = '';

    customers.forEach(customer => {
        const customerTransactions = transactions.filter(transaction => transaction.customer_id.toString() === customer.id.toString());
        if (customerTransactions.length > 0) {
            customerTransactions.forEach(transaction => {
                const row = `<tr>
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${transaction.id}</td>
                    <td>${transaction.amount}</td>
                    <td>${transaction.date}</td>
                    <td><button class="btn btn-primary btn-sm">Action</button></td>
                </tr>`;
                tbody.insertAdjacentHTML('beforeend', row);
            });
        }
    });
}

function renderBubbleChart(customers, transactions) {
    const ctx = document.getElementById('bubbleChart').getContext('2d');

    const data = transactions.map(transaction => {
        const customer = customers.find(c => c.id == transaction.customer_id);
        return {
            x: customer ? customer.id : null,
            y: transaction.amount,
            r: Math.sqrt(transaction.amount)
        };
    });

    if (bubbleChart) {
        bubbleChart.destroy();
    }

    bubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Transactions',
                data: data,
                backgroundColor: 'rgba(0, 123, 255, 0.5)'
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Customer ID'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Transaction Amount'
                    }
                }
            }
        }
    });
}

function filterCustomers(customers, searchValue) {
    if (!searchValue) return customers;
    searchValue = searchValue.toLowerCase();
    return customers.filter(customer => customer.name.toLowerCase().includes(searchValue));
}

function filterTransactions(transactions, searchValue) {
    if (!searchValue) return transactions;
    searchValue = parseFloat(searchValue);
    return transactions.filter(transaction => transaction.amount == searchValue);
}

function filterAndRender() {
    const customerSearchValue = document.getElementById('filter-name').value;
    const transactionSearchValue = document.getElementById('filter-amount').value;

    const filteredCustomers = filterCustomers(customersData, customerSearchValue);
    const filteredTransactions = filterTransactions(transactionsData, transactionSearchValue);

    renderTable(filteredCustomers, filteredTransactions);
    renderBubbleChart(filteredCustomers, filteredTransactions);
}
