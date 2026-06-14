import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe'];

function Reports({ expenses }) {
  const categories = ['Food', 'Bills', 'Shopping', 'Travel'];

  const pieData = categories.map(cat => ({
    name: cat,
    value: expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
  })).filter(d => d.value > 0);

  const barData = expenses.slice(-7).map(e => ({
    name: e.name.slice(0, 8),
    amount: e.amount
  }));

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const highest = categories.reduce((max, cat) => {
    const catTotal = expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return catTotal > max.amount ? { name: cat, amount: catTotal } : max;
  }, { name: '', amount: 0 });

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f8f7ff' }}>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-medium" style={{ color: '#3d1f8f' }}>Reports & Analytics</h2>
        <p className="text-sm mt-1" style={{ color: '#9b8fc0' }}>Your spending breakdown this month</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl text-white" style={{ backgroundColor: '#5b21b6' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c4b5fd' }}>Total Spent</p>
          <p className="text-2xl font-medium">₹{total.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9b8fc0' }}>Highest Category</p>
          <p className="text-2xl font-medium" style={{ color: '#5b21b6' }}>{highest.name || 'N/A'}</p>
          <p className="text-xs mt-1" style={{ color: '#c4b5fd' }}>₹{highest.amount.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9b8fc0' }}>Transactions</p>
          <p className="text-2xl font-medium" style={{ color: '#5b21b6' }}>{expenses.length}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#9b8fc0' }}>Spending by Category</p>
          {pieData.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#9b8fc0' }}>No data yet!</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs" style={{ color: '#4c1d95' }}>{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#9b8fc0' }}>Recent Expenses</p>
          {barData.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#9b8fc0' }}>No data yet!</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9b8fc0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9b8fc0' }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-5 border col-span-2" style={{ borderColor: '#ede9fe' }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#9b8fc0' }}>Category Breakdown</p>
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat, index) => {
              const catTotal = expenses
                .filter(e => e.category === cat)
                .reduce((sum, e) => sum + e.amount, 0);
              const percent = total > 0 ? ((catTotal / total) * 100).toFixed(1) : 0;
              return (
                <div key={cat} className="p-4 rounded-xl text-center" style={{ backgroundColor: '#f5f3ff' }}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9b8fc0' }}>{cat}</p>
                  <p className="text-xl font-medium" style={{ color: '#5b21b6' }}>₹{catTotal.toLocaleString()}</p>
                  <p className="text-xs mt-1" style={{ color: '#a78bfa' }}>{percent}% of total</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Reports;