import React, { useState, useEffect } from 'react';
import Reports from './Reports';
import axios from 'axios';

const API = "http://127.0.0.1:8000";

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', category: 'Food', amount: '' });
  const [loading, setLoading] = useState(true);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [budget, setBudget] = useState(30000);
const [editBudget, setEditBudget] = useState(false);
const [newBudget, setNewBudget] = useState('');
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetLeft = budget - totalSpent;
  const categoryIcons = {
  Food: '/food.png',
  Bills: '/bill.png',
  Travel: '/transportation.png',
  Shopping: '/online-shopping.png'
};

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`);
      setExpenses(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching expenses", err);
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newExpense.name || !newExpense.amount) return;
    try {
      const res = await axios.post(`${API}/expenses`, {
        name: newExpense.name,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        date: new Date().toLocaleDateString('en-IN'),
      });
      setExpenses([...expenses, res.data]);
      setNewExpense({ name: '', category: 'Food', amount: '' });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  const handleAIQuestion = async (question) => {
    if (!question.trim()) return;
    setAiLoading(true);
    setAiQuestion('');
    try {
      const res = await axios.post(`${API}/ai/chat`, { question });
      setAiMessages([...aiMessages, { question, answer: res.data.answer }]);
    } catch (err) {
      setAiMessages([...aiMessages, { question, answer: "Sorry, I couldn't process that. Try again!" }]);
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f8f7ff' }}>

      {/* Navbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium" style={{ color: '#3d1f8f' }}>SpendWise AI</h1>
        <div className="flex gap-6">
          {['Dashboard', 'Reports'].map((item) => (
            <span key={item}
              onClick={() => setActivePage(item)}
              className="text-sm cursor-pointer"
              style={{ color: item === activePage ? '#5b21b6' : '#9b8fc0',
                borderBottom: item === activePage ? '2px solid #5b21b6' : 'none',
                paddingBottom: '2px' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Reports Page */}
      {activePage === 'Reports' && (
        <Reports expenses={expenses} />
      )}

      {/* Dashboard Page */}
      {activePage === 'Dashboard' && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-5 rounded-2xl text-white" style={{ backgroundColor: '#5b21b6' }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c4b5fd' }}>Total Spent</p>
              <p className="text-2xl font-medium">₹{totalSpent.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: '#ddd6fe' }}>This month</p>
            </div>
             <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#ede9fe' }}>
  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9b8fc0' }}>Budget Left</p>
  <p className="text-2xl font-medium" style={{ color: budgetLeft < 0 ? '#ef4444' : '#5b21b6' }}>
    ₹{budgetLeft.toLocaleString()}
  </p>
  {editBudget ? (
    <div className="flex gap-1 mt-2">
      <input
        type="number"
        className="w-full p-1 rounded-lg text-xs border outline-none"
        style={{ borderColor: '#ddd6fe', color: '#2e1065' }}
        placeholder="Enter budget"
        value={newBudget}
        onChange={(e) => setNewBudget(e.target.value)}
      />
      <button
        onClick={() => { setBudget(parseInt(newBudget)); setEditBudget(false); setNewBudget(''); }}
        className="px-2 py-1 rounded-lg text-xs text-white"
        style={{ backgroundColor: '#5b21b6' }}>
        ✓
      </button>
    </div>
  ) : (
    <p className="text-xs mt-1 cursor-pointer"
      style={{ color: '#c4b5fd' }}
      onClick={() => setEditBudget(true)}>
      of ₹{budget.toLocaleString()} ✏️
    </p>
  )}
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

              {loading ? (
                <p className="text-sm text-center py-4" style={{ color: '#9b8fc0' }}>Loading...</p>
              ) : expenses.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: '#9b8fc0' }}>No expenses yet!</p>
              ) : (
                expenses.map((expense) => (
                  <div key={expense._id} className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#f5f3ff' }}>
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f5f3ff' }}>
  <img
    src={categoryIcons[expense.category] || '/food.png'}
    alt={expense.category}
    className="w-5 h-5"
  />
</div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#2e1065' }}>{expense.name}</p>
                        <p className="text-xs" style={{ color: '#c4b5fd' }}>{expense.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium" style={{ color: '#7c3aed' }}>- ₹{expense.amount}</p>
                      <button onClick={() => handleDelete(expense._id)}
                        className="text-xs px-2 py-1 rounded-lg"
                        style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}

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
              <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#ede9fe' }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#9b8fc0' }}>Spending by Category</p>
                {['Food', 'Bills', 'Shopping', 'Travel'].map((cat) => {
                  const total = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
                  const percent = totalSpent > 0 ? (total / totalSpent) * 100 : 0;
                  return (
                    <div key={cat} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#4c1d95' }}>{cat}</span>
                        <span className="font-medium" style={{ color: '#7c3aed' }}>₹{total.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: '#f5f3ff' }}>
                        <div className="h-1.5 rounded-full"
                          style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Chat */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7c3aed' }}></div>
                  <p className="text-xs uppercase tracking-widest font-medium" style={{ color: '#7c3aed' }}>AI Assistant</p>
                </div>
                <div className="mb-3 max-h-40 overflow-y-auto">
                  {aiMessages.length === 0 ? (
                    <p className="text-xs" style={{ color: '#9b8fc0' }}>Ask me anything about your expenses!</p>
                  ) : (
                    aiMessages.map((msg, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-xs font-medium mb-1" style={{ color: '#5b21b6' }}>You: {msg.question}</p>
                        <p className="text-xs leading-relaxed p-2 rounded-lg" style={{ backgroundColor: '#ede9fe', color: '#4c1d95' }}>
                          AI: {msg.answer}
                        </p>
                      </div>
                    ))
                  )}
                  {aiLoading && <p className="text-xs" style={{ color: '#9b8fc0' }}>AI is thinking...</p>}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['How much did I spend on food?', 'Am I over budget?', 'Where can I save money?'].map((q) => (
                    <button key={q} onClick={() => handleAIQuestion(q)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}>
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 p-2 rounded-lg text-xs border outline-none"
                    style={{ borderColor: '#ddd6fe', color: '#2e1065' }}
                    placeholder="Ask about your expenses..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAIQuestion(aiQuestion)}
                  />
                  <button onClick={() => handleAIQuestion(aiQuestion)}
                    className="px-3 py-2 rounded-lg text-xs text-white font-medium"
                    style={{ backgroundColor: '#5b21b6' }}>
                    Ask
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;