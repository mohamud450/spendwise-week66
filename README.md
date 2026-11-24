# SpendWise – Week 5: Interactive Budget Tracker

## Improvements made this week
In Week 4, SpendWise asked questions with pop-up prompts and printed results to the console. This week it became a real interactive page:
- A **Dashboard** card shows the budget, total spent, balance, a feedback message and spending per category.
- The **expense table** is now generated from an array instead of hardcoded in the HTML.
- The **Add Expense** form validates input and adds a new expense that appears instantly.
- Each row has a **Delete** button, and there is a **Clear All Expenses** button.
- The user sets the **monthly budget** on the page (no more `prompt()`).
- The dashboard colors and the balance change depending on how much of the budget is spent.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Structure: dashboard, form, table, video |
| `style.css` | Design (Week 3) plus styles for the dashboard and status messages |
| `script.js` | Data, calculations, DOM updates and event listeners |
| `images/logo.svg` | Logo |

## How to run
Open `index.html` in a browser. Try setting a budget, adding an expense, deleting one, and entering a very large expense to see the over-budget warning.

## How conditionals are used
- `getBudgetStatus()` uses an `if / else if / else` chain on the percentage of the budget spent: under 50% (good), 50–79% (caution), 80–99% (warning) and 100% or more (danger, showing the balance). A budget of 0 asks the user to set one.
- `handleAddExpense()` validates the name, amount and date one after another and shows a specific error message for the first problem found. The expense is only added when everything is valid.
- `renderDashboard()` adds a `negative` class to the balance only when it is below zero.
- `renderTable()` shows "No expenses yet" when the array is empty.

## How arrays are used to store data
All expenses live in one array called `expenses`. Each item is an object: `{ id, name, amount, category, date }`. A second array, `categories`, lists the five category names.
- **Add:** `expenses.push(newExpense)`
- **Delete:** `expenses = expenses.filter(...)` keeps every expense except the one with the matching `id`
- **Clear:** `expenses = []`

## How loops are used
- `calculateTotalExpenses()` uses a `for` loop to add up every amount.
- `calculateCategoryTotals()` uses `for...of` loops to total spending per category.
- `renderTable()` and `renderCategoryList()` loop through the data to create one table row or list item for each record.

## How the DOM is updated
Elements are found with `document.getElementById()`. The `render` functions then update the page:
- `textContent` sets the budget, total, balance and status text.
- `classList.add/remove` and `className` change colors based on the situation.
- `createElement()` and `appendChild()` build the table rows, delete buttons and category list.

`renderAll()` calls the three render functions, so after every change the whole dashboard, category list and table stay in sync with the `expenses` array. Text is inserted with `textContent` (not `innerHTML`), so whatever the user types is shown as plain text.

## How user interactions are handled through events
Event listeners connect user actions to the code:
- `click` on **Set Budget** → `handleSetBudget()`
- `click` on **Add Expense** → `handleAddExpense()`
- `click` on the table body → `handleDelete()`. This is *event delegation*: one listener on `<tbody>` catches clicks on any Delete button, even ones created after the page loaded. The button's `data-id` tells the code which expense to remove.
- `click` on **Clear All Expenses** → `handleClearAll()` (asks for confirmation first)

The flow is always: **user action → event → update data → re-render the page**.

## Challenges and how I resolved them
1. **Delete buttons made by JavaScript did not respond when I gave each its own listener after re-rendering.** I used event delegation on `<tbody>` and a `data-id` attribute on each button, so one listener works for every row.
2. **The table did not match the data after adding or deleting.** I made `renderAll()` rebuild everything from the `expenses` array, so the array is the single source of truth.
3. **The global `button` CSS stretched the Delete buttons across the form grid.** I moved the full-width rule to `#add-expense-btn` and gave `.btn-delete` its own style.
4. **Dividing by a zero budget.** `calculateSpendingPercentage()` checks for a budget of 0 first.
5. **Script cut off when submitted.** My first grader saw an incomplete `script.js`. I rewrote the file in a more compact form, with the event handlers and listeners placed before the render functions, and checked that the last line, `renderAll();`, is in the file on GitHub.
6. **Negative balance display** like `$-50.00`. `formatMoney()` now prints `-$50.00`.
