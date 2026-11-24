/* SpendWise - arrays, loops, conditionals, DOM updates, events */
let monthlyBudget = 1000, nextId = 6;
let expenses = [
  { id: 1, name: "Groceries", amount: 54.20, category: "Food", date: "2026-11-02" },
  { id: 2, name: "Bus pass", amount: 30.00, category: "Transport", date: "2026-11-03" },
  { id: 3, name: "November rent", amount: 650.00, category: "Rent", date: "2026-11-05" },
  { id: 4, name: "Movie night", amount: 15.50, category: "Entertainment", date: "2026-11-08" },
  { id: 5, name: "Phone airtime", amount: 10.00, category: "Other", date: "2026-11-10" }
];
const categories = ["Food", "Transport", "Rent", "Entertainment", "Other"];
const $ = (id) => document.getElementById(id);
const budgetInput = $("budget-input"), statusMessage = $("status-message"), formMessage = $("form-message");
const nameInput = $("expense-name"), amountInput = $("expense-amount"), dateInput = $("expense-date");
const categoryInput = $("expense-category"), expenseBody = $("expense-body");
// Handlers
function handleSetBudget() {
  const value = parseFloat(budgetInput.value);
  if (isNaN(value) || value < 0) {
      statusMessage.textContent = "Enter a valid budget.";
    statusMessage.className = "status status-danger";
    return;
  }
  monthlyBudget = value;
  renderAll();
}
function handleAddExpense() {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  if (name === "") {
    showFormMessage("Please enter an expense name.", true);
  } else if (isNaN(amount) || amount <= 0) {
    showFormMessage("Please enter an amount greater than 0.", true);
  } else if (dateInput.value === "") {
    showFormMessage("Please choose a date.", true);
  } else {
    expenses.push({ id: nextId++, name, amount, category: categoryInput.value, date: dateInput.value });
    nameInput.value = "";
    amountInput.value = "";
    showFormMessage("Expense added: " + name + " (" + formatMoney(amount) + ")", false);
    renderAll();
  }
}
function handleDelete(event) {
  if (!event.target.classList.contains("btn-delete")) return;
  const id = Number(event.target.dataset.id);
  expenses = expenses.filter((e) => e.id !== id);
  renderAll();
}
function handleClearAll() {
  if (expenses.length > 0 && confirm("Delete all expenses?")) {
    expenses = [];
    showFormMessage("", false);
    renderAll();
  }
}
// Listeners
$("set-budget-btn").addEventListener("click", handleSetBudget);
$("add-expense-btn").addEventListener("click", handleAddExpense);
expenseBody.addEventListener("click", handleDelete);
$("clear-btn").addEventListener("click", handleClearAll);
function formatMoney(n) { return (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2); }
function calculateTotalExpenses(list) {
  let total = 0;
  for (let i = 0; i < list.length; i++) total += list[i].amount;
  return total;
}
function calculateBalance(budget, total) { return budget - total; }
function calculateSpendingPercentage(budget, total) {
  if (budget <= 0) return total > 0 ? 100 : 0;
  return (total / budget) * 100;
}
function calculateCategoryTotals(list) {
  const totals = {};
  for (const cat of categories) totals[cat] = 0;
  for (const e of list) totals[e.category] += e.amount;
  return totals;
}
function getBudgetStatus(budget, total) {
  const pct = calculateSpendingPercentage(budget, total);
  if (budget <= 0) return { level: "warning", message: "Set a monthly budget to get started." };
  if (pct >= 100) return { level: "danger", message: "Budget reached or exceeded! Balance: " + formatMoney(budget - total) };
  if (pct >= 80) return { level: "warning", message: "Careful! You have used " + pct.toFixed(0) + "% of your budget." };
  if (pct >= 50) return { level: "caution", message: "Past halfway (" + pct.toFixed(0) + "% used). Watch spending." };
  return { level: "good", message: "Great job! Only " + pct.toFixed(0) + "% of your budget used." };
}
function renderDashboard() {
  const total = calculateTotalExpenses(expenses);
  const balance = calculateBalance(monthlyBudget, total);
  const status = getBudgetStatus(monthlyBudget, total);
  $("budget-display").textContent = formatMoney(monthlyBudget);
  $("total-display").textContent = formatMoney(total);
  $("balance-display").textContent = formatMoney(balance);
  $("balance-display").classList.toggle("negative", balance < 0);
  statusMessage.textContent = status.message;
  statusMessage.className = "status status-" + status.level;
}
function renderCategoryList() {
  const totals = calculateCategoryTotals(expenses);
  $("category-list").innerHTML = "";
  for (const cat of categories) {
    const item = document.createElement("li");
    item.innerHTML = "<span>" + cat + "</span><strong>" + formatMoney(totals[cat]) + "</strong>";
    $("category-list").appendChild(item);
  }
}
function renderTable() {
  expenseBody.innerHTML = "";
  if (expenses.length === 0) {
    expenseBody.innerHTML = '<tr><td colspan="5" class="empty-cell">No expenses yet</td></tr>';
    return;
  }
  for (const e of expenses) {
    const row = document.createElement("tr");
    for (const text of [e.name, formatMoney(e.amount), e.category, e.date]) {
      const cell = document.createElement("td");
      cell.textContent = text;
      row.appendChild(cell);
    }
    const actionCell = document.createElement("td");
    actionCell.innerHTML = '<button type="button" class="btn-delete">Delete</button>';
    actionCell.firstChild.dataset.id = e.id;
    row.appendChild(actionCell);
    expenseBody.appendChild(row);
  }
}
function renderAll() { renderDashboard(); renderCategoryList(); renderTable(); }
function showFormMessage(text, isError) {
  formMessage.textContent = text;
  formMessage.className = "form-message " + (isError ? "error" : "success");
}
budgetInput.value = monthlyBudget;
dateInput.value = new Date().toISOString().split("T")[0];
renderAll();
