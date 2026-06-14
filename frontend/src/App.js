import React, { useState } from 'react';

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Zomato Order', category: 'Food', amount: 480, date: 'Today' },
    { id: 2, name: 'Electricity Bill', category: 'Bills', amount: 1240, date: 'Yesterday' },
    { id: 3, name: 'Uber Ride', category: 'Travel', amount: 220, date: 'Jun 12' },
    { id: 4, name: 'Big Basket', category: 'Shopping', amount: 2100, date: 'Jun 11' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', category: 'Food', amount: '' });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = 30000;
  const budgetLeft = budget - totalSpent;

  const categoryIcons = { Food: '🍕', Bills: '⚡', Travel: '🚌', Shopping: '🛒' };

  const handleAdd = () => {
    if (!newExpense.name || !newExpense.amount) return;
    setExpenses([...expenses, {
      id: Date.now(),
      name: newExpense.name,
      category: newExpense.category,
      amount: parseInt(newExpense.amount),
      date: 'Today'
    }]);
    setNewExpense({ name: '', category: 'Food', amount: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f8f7ff' }}>

      {/* Navbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium" style={{ color: '#3d1f8f' }}>SpendWise AI</h1>
        <div className="flex gap-6">
          {['Dashboard', 'Expenses', 'Reports', 'AI Chat'].map((item) => (
            <span key={item} className="text-sm cursor-pointer"
              style={{ color: item === 'Dashboard' ? '#5b21b6' : '#9b8fc0' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl text-white" style={{ backgroundColor: '#5b21b6' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c4b5fd' }}>Total Spent</p>
          <p className="text-2xl font-medium">₹{totalSpent.toLocaleString()}</p>
          <p className="text-xs mt-1" style={{ color: '#ddd6fe' }}>This month</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9b8fc0' }}>Budget Left</p>
          <p className="text-2xl font-medium" style={{ color: '#5b21b6' }}>₹{budgetLeft.toLocaleString()}</p>
          <p className="text-xs mt-1" style={{ color: '#c4b5fd' }}>of ₹{budget.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9b8fc0' }}>Transactions</p>
          <p className="text-2xl font-medium" style={{ color: '#5b21b6' }}>{expenses.length}</p>
          <p className="text-xs mt-1" style={{ color: '#c4b5fd' }}>This month</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Expense List */}
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#9b8fc0' }}>Recent Expenses</p>

          {expenses.map((expense) => (
            <div key={expense.id} className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#f5f3ff' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ backgroundColor: '#f5f3ff' }}>
                  {categoryIcons[expense.category]}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2e1065' }}>{expense.name}</p>
                  <p className="text-xs" style={{ color: '#c4b5fd' }}>{expense.date}</p>
                </div>
              </div>
              <p className="text-sm font-medium" style={{ color: '#7c3aed' }}>- ₹{expense.amount}</p>
            </div>
          ))}

          {/* Add Expense Form */}
          {showForm && (
            <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }}>
              <input
                className="w-full mb-2 p-2 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#ddd6fe', color: '#2e1065' }}
                placeholder="Expense name"
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              />
              <select
                className="w-full mb-2 p-2 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#ddd6fe', color: '#2e1065' }}
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                <option>Food</option>
                <option>Bills</option>
                <option>Travel</option>
                <option>Shopping</option>
              </select>
              <input
                className="w-full mb-3 p-2 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#ddd6fe', color: '#2e1065' }}
                placeholder="Amount in ₹"
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={handleAdd}
                  className="flex-1 py-2 rounded-lg text-sm text-white font-medium"
                  style={{ backgroundColor: '#5b21b6' }}>
                  Add
                </button>
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: '#ede9fe', color: '#5b21b6' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: '#5b21b6' }}>
              + Add Expense
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4">

          {/* Category Bars */}
          <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#ede9fe' }}>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#9b8fc0' }}>Spending by Category</p>
            {[
              { name: 'Food', amount: 8200, percent: 68 },
              { name: 'Bills', amount: 6500, percent: 54 },
              { name: 'Shopping', amount: 5780, percent: 48 },
              { name: 'Travel', amount: 4100, percent: 34 },
            ].map((cat) => (
              <div key={cat.name} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#4c1d95' }}>{cat.name}</span>
                  <span className="font-medium" style={{ color: '#7c3aed' }}>₹{cat.amount.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: '#f5f3ff' }}>
                  <div className="h-1.5 rounded-full"
                    style={{ width: `${cat.percent}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7c3aed' }}></div>
              <p className="text-xs uppercase tracking-widest font-medium" style={{ color: '#7c3aed' }}>AI Insight</p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#5b21b6' }}>
              You spent 32% more on food this month compared to last month. Consider setting a food budget of ₹6,000 to save better!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;