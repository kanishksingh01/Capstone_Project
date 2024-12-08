// Load Google Charts
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawInitialCharts); // Calls the function to draw initial charts after loading

// Function to draw the initial charts with zero values
function drawInitialCharts() {
    drawFirstChart(0, []); // Draws the income and costs breakdown chart
    drawSecondChart(100, [50, 50]); // Draws the savings plan chart
}

// Draws the chart showing income and cost breakdown
function drawFirstChart(totalIncome, costs) {
    const remainingIncome = totalIncome - costs.reduce((a, b) => a + b.value, 0);
    const adjustedRemainingIncome = remainingIncome > 0 ? remainingIncome : 0;

    // Data for the chart
    const dataArray = [['Category', 'Value']];
    dataArray.push(['Remaining Income', adjustedRemainingIncome]);
    costs.forEach((item, index) => {
        dataArray.push([item.name || 'Cost ' + (index + 1), item.value]);
    });

    // Set up chart options and draw
    const data = google.visualization.arrayToDataTable(dataArray);
    const options = { title: 'Income and Costs Breakdown', is3D: true };
    const chart = new google.visualization.PieChart(document.getElementById('first_pie_chart'));
    chart.draw(data, options);
}

// Draws the chart showing savings and spending plan
function drawSecondChart(remaining, percentages) {
    const data = google.visualization.arrayToDataTable([
        ['Category', 'Value'],
        ['Saved Money', (remaining * percentages[0]) / 100],
        ['Spending Money', (remaining * percentages[1]) / 100]
    ]);

    const options = { title: 'Savings Plan', is3D: true };
    const chart = new google.visualization.PieChart(document.getElementById('second_pie_chart'));
    chart.draw(data, options);
}

// Updates charts based on user input
function updateCharts() {
    let totalIncome = parseFloat(document.getElementById('input_value').value) || 0;

    // Adjust income based on monthly or annual
    const incomeFrequency = document.querySelector('input[name="income_frequency"]:checked').value;
    if (incomeFrequency === 'monthly') {
        totalIncome *= 12;  // Convert monthly income to annual
    }

    // Collect costs and convert each to annual if needed
    const costs = Array.from(document.getElementsByClassName('subtracted_field')).map((input, index) => {
        const name = input.querySelector('.cost_name').value;
        let value = parseFloat(input.querySelector('.cost_value').value) || 0;
        const costFrequency = document.querySelector(`input[name="cost_frequency_${index}"]:checked`).value;
        if (costFrequency === 'monthly') {
            value *= 12;  // Convert monthly cost to annual
        }
        return { name, value };
    });

    // Calculate total costs and remaining income on an annual basis
    const totalCosts = costs.reduce((a, b) => a + b.value, 0);
    let remainder = totalIncome - totalCosts;
    document.getElementById('error_message').innerText = remainder < 0 
        ? `Warning: Your costs exceed the income by $${Math.abs(remainder).toFixed(2)}!` 
        : "";
    remainder = remainder > 0 ? remainder : 0;

    // Calculate amount to save monthly based on annual remainder
    const percentage1 = parseFloat(document.getElementById('percentage1').value) || 0;
    const amountToSaveMonthly = (remainder * (percentage1 / 100)) / 12;

    // Update texts
    document.getElementById('remaining_income_text').innerText = `Remaining Income after Costs: $${remainder.toFixed(2)}`;
    document.getElementById('monthly_savings_text').innerText = `Amount to be put aside per month: $${amountToSaveMonthly.toFixed(2)}`;

    // Draw charts with updated data
    drawFirstChart(totalIncome, costs);
    drawSecondChart(remainder, [percentage1, 100 - percentage1]);

    // Display months needed to reach savings goal
    calculatePaymentPlan();
}

// Calculation for how long it takes to reach the savings goal
function calculatePaymentPlan() {
    let totalIncome = parseFloat(document.getElementById('input_value').value) || 0;

    // Adjust income based on monthly or annual
    const incomeFrequency = document.querySelector('input[name="income_frequency"]:checked').value;
    if (incomeFrequency === 'monthly') {
        totalIncome *= 12;  // Convert monthly income to annual
    }

    // Collect costs and convert each to annual if needed
    const costs = Array.from(document.getElementsByClassName('subtracted_field')).map(input => {
        let value = parseFloat(input.querySelector('.cost_value').value) || 0;
        const costFrequency = input.querySelector('input[type="radio"]:checked').value;
        if (costFrequency === 'monthly') {
            value *= 12;  // Convert monthly cost to annual
        }
        return value;
    });

    // Calculate remaining income after annual costs
    const totalCosts = costs.reduce((a, b) => a + b, 0);
    let remainder = totalIncome - totalCosts;
    remainder = remainder > 0 ? remainder : 0;

    // Calculate monthly savings based on percentage
    const percentage1 = parseFloat(document.getElementById('percentage1').value) || 0;
    const amountToSaveMonthly = (remainder * (percentage1 / 100)) / 12;

    // Calculate the number of months needed to reach the savings goal
    const goalAmount = parseFloat(document.getElementById('goal_amount').value) || 0;
    const monthsToGoal = amountToSaveMonthly > 0 ? Math.ceil(goalAmount / amountToSaveMonthly) : Infinity;

    // Display the result
    document.getElementById('payment_plan').innerHTML = monthsToGoal < Infinity 
        ? `<strong>It will take approximately ${monthsToGoal} months to achieve your goal.</strong>` 
        : "<strong>Saving this percentage will not reach your goal.</strong>";
}

// Adds new input fields for additional costs
function addSubtractedField() {
    const container = document.getElementById('subtracted_fields');
    const index = document.getElementsByClassName('subtracted_field').length;
    const newField = document.createElement('div');
    newField.className = 'subtracted_field';

    // HTML structure for new cost field
    newField.innerHTML = `
        <label>Name:\u00A0 </label><input type="text" class="cost_name" value="">
        <label> Cost:\u00A0 </label><input class="cost_value" step="0.01" value="0" oninput="updateCharts()">
        <label>
            <input type="radio" name="cost_frequency_${index}" value="annual" checked onchange="updateCharts()"> Annual
        </label>
        <label>
            <input type="radio" name="cost_frequency_${index}" value="monthly" onchange="updateCharts()"> Monthly
        </label>`;
    container.appendChild(newField);
}

function displayMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.className = type === 'success' ? 'alert alert-success' : 'alert alert-danger';
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

function submitForm() {
    var totalIncome = parseFloat(document.getElementById('input_value').value) || 0;
    var subtractedValues = Array.from(document.querySelectorAll('.subtracted_field')).map(field => ({
        name: field.querySelector('.cost_name').value,
        value: parseFloat(field.querySelector('.cost_value').value) || 0,
        frequency: field.querySelector('input[name^="cost_frequency_"]:checked').value
    }));
    var remainingIncome = totalIncome - subtractedValues.reduce((a, b) => a + b.value, 0);
    var savingsGoal = parseFloat(document.getElementById('goal_amount').value) || 0;
    var goalPercentage = parseFloat(document.getElementById('percentage1').value) || 0;

    document.getElementById('total_income').value = totalIncome;
    document.getElementById('subtracted_values').value = JSON.stringify(subtractedValues);
    document.getElementById('remaining_income').value = remainingIncome;
    document.getElementById('savings_goal').value = savingsGoal;
    document.getElementById('goal_percentage').value = goalPercentage;

    var form = document.getElementById('plan2Form');
    var formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': form.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(response => {
        if (response.ok) {
            alert('Data saved successfully!');
            fetchSavedData();  // Fetch and display the saved data
        } else {
            alert('Failed to save data.');
        }
    })
}

function fetchGoalPlanData() {
    $.ajax({
        url: "/fetch_goal_plan_data/",  // Ensure this URL is correct
        method: "GET",
        success: function (data) {
            console.log("Fetched data:", data);  // Log the response data for debugging

            const tableBody = $("#savedDataTable tbody");
            tableBody.empty();  // Clear any existing rows

            if (data.length === 0) {
                // Display message if no data available
                tableBody.append('<tr><td colspan="7">No data available</td></tr>');
                return;
            }

            // Populate table rows
            data.forEach((item, index) => {
                console.log("Processing item:", item);  // Log each item for debugging

                // Parse subtracted values
                const subtractedValues = item.subtracted_values
                    ? JSON.parse(item.subtracted_values).map(
                          (subItem) => `${subItem.name}: $${subItem.value.toFixed(2)}`
                      ).join("<br>")
                    : "N/A";

                // Log the raw created_at value
                console.log("Raw created_at:", item.created_at);

                // Use the raw created_at value directly
                const createdAt = item.created_at;

                // Log the raw created_at value
                console.log("Using raw created_at:", createdAt);

                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>$${item.total_income.toFixed(2)}</td>
                        <td>${subtractedValues}</td>
                        <td>$${item.remaining_income.toFixed(2)}</td>
                        <td>$${item.savings_goal.toFixed(2)}</td>
                        <td>${createdAt}</td>
                    </tr>
                `;
                tableBody.append(row);  // Append row to the table body
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);  // Log the error
            console.log("Response text:", xhr.responseText);  // Log the response text from the server
            $("#savedDataTable tbody").append('<tr><td colspan="7">Error loading data</td></tr>');
        }
    });
}

// Call the function after the page loads
$(document).ready(function() {
    fetchGoalPlanData();  // Fetch and populate data when the page loads
});

// Gets the question marks to work
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});