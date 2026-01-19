import React, { useState, useEffect } from 'react';
import { PiggyBank, Wallet, TrendingUp, Target, Calendar, DollarSign, Trash2, AlertCircle, Plus, PieChart, Edit2, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

export default function FinancialTracker() {
  const [activeTab, setActiveTab] = useState('savings'); // 'savings' or 'budget'

  // ==================== SAVINGS STATE ====================
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: 500000,
      current: 125000,
      deadline: "2026-06-30",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "New Motorcycle",
      target: 1200000,
      current: 340000,
      deadline: "2026-12-31",
      color: "from-purple-500 to-purple-600"
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddSaving, setShowAddSaving] = useState(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: ''
  });
  const [savingAmount, setSavingAmount] = useState('');

  // ==================== BUDGET STATE ====================
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgetView, setBudgetView] = useState('overview'); // overview, add-transaction, budgets
  
  const [income, setIncome] = useState([
    { id: 1, amount: 150000, source: 'Salary', date: '2026-01-15', category: 'Income' }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, amount: 50000, description: 'Rent', date: '2026-01-01', category: 'Housing' },
    { id: 2, amount: 15000, description: 'Groceries - Shoprite', date: '2026-01-05', category: 'Food' },
    { id: 3, amount: 5000, description: 'Taxi to work', date: '2026-01-06', category: 'Transport' },
    { id: 4, amount: 8000, description: 'Electricity bill', date: '2026-01-07', category: 'Utilities' },
    { id: 5, amount: 12000, description: 'Market shopping', date: '2026-01-10', category: 'Food' },
    { id: 6, amount: 3000, description: 'Minibus fare', date: '2026-01-12', category: 'Transport' },
    { id: 7, amount: 7000, description: 'Phone airtime', date: '2026-01-14', category: 'Utilities' },
    { id: 8, amount: 20000, description: 'Clothes shopping', date: '2026-01-16', category: 'Shopping' }
  ]);

  const [budgets, setBudgets] = useState({
    'Food': 30000,
    'Transport': 20000,
    'Housing': 50000,
    'Utilities': 15000,
    'Shopping': 25000,
    'Entertainment': 10000,
    'Healthcare': 15000,
    'Other': 10000
  });

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10)
  });

  const categories = ['Food', 'Transport', 'Housing', 'Utilities', 'Shopping', 'Entertainment', 'Healthcare', 'Other'];

  // ==================== UTILITY FUNCTIONS ====================
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // ==================== SAVINGS FUNCTIONS ====================
  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateMonthlyTarget = (goal) => {
    const remaining = goal.target - goal.current;
    const daysLeft = calculateDaysLeft(goal.deadline);
    const monthsLeft = Math.max(daysLeft / 30, 1);
    return remaining / monthsLeft;
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      alert('Please fill in all fields');
      return;
    }

    const colors = [
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-teal-500 to-teal-600",
      "from-indigo-500 to-indigo-600"
    ];

    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: 0,
      deadline: newGoal.deadline,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', deadline: '' });
    setShowAddGoal(false);
  };

  const addSaving = (goalId) => {
    if (!savingAmount || parseFloat(savingAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          current: Math.min(goal.current + parseFloat(savingAmount), goal.target)
        };
      }
      return goal;
    }));

    setSavingAmount('');
    setShowAddSaving(null);
  };

  const deleteGoal = (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  const getTotalSaved = () => {
    return goals.reduce((sum, goal) => sum + goal.current, 0);
  };

  const getTotalTarget = () => {
    return goals.reduce((sum, goal) => sum + goal.target, 0);
  };

  // ==================== BUDGET FUNCTIONS ====================
  const getTotalIncome = () => {
    return income.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getExpensesByCategory = () => {
    const categoryTotals = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return categoryTotals;
  };

  const getCategoryStatus = (category) => {
    const spent = getExpensesByCategory()[category] || 0;
    const budget = budgets[category] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) {
      alert('Please fill in all fields');
      return;
    }

    const transaction = {
      id: Date.now(),
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: newTransaction.date,
      category: newTransaction.category
    };

    if (newTransaction.type === 'income') {
      transaction.source = newTransaction.description;
      transaction.category = 'Income';
      setIncome([...income, transaction]);
    } else {
      setExpenses([...expenses, transaction]);
    }

    setNewTransaction({
      type: 'expense',
      amount: '',
      description: '',
      category: 'Food',
      date: new Date().toISOString().slice(0, 10)
    });
    setBudgetView('overview');
  };

  const deleteExpense = (id) => {
    if (confirm('Delete this transaction?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const deleteIncome = (id) => {
    if (confirm('Delete this income?')) {
      setIncome(income.filter(i => i.id !== id));
    }
  };

  const updateBudget = (category, amount) => {
    setBudgets({ ...budgets, [category]: parseFloat(amount) || 0 });
  };

  const getRecentTransactions = () => {
    const all = [
      ...expenses.map(e => ({ ...e, type: 'expense' })),
      ...income.map(i => ({ ...i, type: 'income' }))
    ];
    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {activeTab === 'savings' ? (
              <PiggyBank className="w-10 h-10 text-blue-400" />
            ) : (
              <Wallet className="w-10 h-10 text-green-400" />
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Financial Tracker
            </h1>
          </div>
          <p className="text-slate-300">
            {activeTab === 'savings' ? 'Track your savings goals and watch your money grow' : 'Track your money, control your spending'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('savings')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              activeTab === 'savings'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : 'bg-slate-800/50 hover:bg-slate-700/50'
            }`}
          >
            <PiggyBank className="w-6 h-6" />
            Savings Tracker
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              activeTab === 'budget'
                ? 'bg-gradient-to-r from-green-500 to-blue-500'
                : 'bg-slate-800/50 hover:bg-slate-700/50'
            }`}
          >
            <Wallet className="w-6 h-6" />
            Budget Master
          </button>
        </div>

        {/* ==================== SAVINGS TRACKER VIEW ==================== */}
        {activeTab === 'savings' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Total Saved</span>
                </div>
                <p className="text-3xl font-bold text-green-400">{formatMoney(getTotalSaved())}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-300">Total Target</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">{formatMoney(getTotalTarget())}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-slate-300">Overall Progress</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  {getTotalTarget() > 0 ? ((getTotalSaved() / getTotalTarget()) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>

            {/* Add New Goal Button */}
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="w-full mb-6 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Savings Goal
            </button>

            {/* Add Goal Form */}
            {showAddGoal && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6 border border-slate-700">
                <h3 className="text-xl font-semibold mb-4">New Savings Goal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Name</label>
                    <input
                      type="text"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      placeholder="e.g., Emergency Fund, New Phone, School Fees"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Amount (MWK)</label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      placeholder="500000"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Date</label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={addGoal}
                      className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all"
                    >
                      Create Goal
                    </button>
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="flex-1 py-2 px-4 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Goals List */}
            <div className="space-y-4">
              {goals.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-12 border border-slate-700 text-center">
                  <PiggyBank className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No savings goals yet. Create your first goal to get started!</p>
                </div>
              ) : (
                goals.map(goal => {
                  const progress = calculateProgress(goal.current, goal.target);
                  const daysLeft = calculateDaysLeft(goal.deadline);
                  const monthlyTarget = calculateMonthlyTarget(goal);
                  const isCompleted = goal.current >= goal.target;

                  return (
                    <div key={goal.id} className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{goal.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                            </span>
                            <span>{new Date(goal.deadline).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold">{formatMoney(goal.current)}</span>
                          <span className="text-slate-400">{formatMoney(goal.target)}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${goal.color} transition-all duration-500 flex items-center justify-end pr-2`}
                            style={{ width: `${progress}%` }}
                          >
                            {progress > 10 && (
                              <span className="text-xs font-bold text-white">{progress.toFixed(1)}%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-slate-700/30 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">Remaining</p>
                          <p className="text-lg font-bold text-orange-400">
                            {formatMoney(goal.target - goal.current)}
                          </p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">Save per month</p>
                          <p className="text-lg font-bold text-blue-400">
                            {formatMoney(monthlyTarget)}
                          </p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">Progress</p>
                          <p className="text-lg font-bold text-green-400">
                            {progress.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Warning if behind schedule */}
                      {!isCompleted && daysLeft < 30 && progress < 70 && (
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-yellow-400">Behind Schedule</p>
                            <p className="text-slate-300">You need to increase your savings to reach this goal on time.</p>
                          </div>
                        </div>
                      )}

                      {/* Completed Badge */}
                      {isCompleted && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 text-center">
                          <p className="text-green-400 font-bold text-lg">🎉 Goal Completed! 🎉</p>
                        </div>
                      )}

                      {/* Add Saving Button */}
                      {!isCompleted && (
                        <>
                          {showAddSaving === goal.id ? (
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={savingAmount}
                                onChange={(e) => setSavingAmount(e.target.value)}
                                placeholder="Amount to add"
                                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                              />
                              <button
                                onClick={() => addSaving(goal.id)}
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setShowAddSaving(null);
                                  setSavingAmount('');
                                }}
                                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddSaving(goal.id)}
                              className={`w-full py-3 px-4 bg-gradient-to-r ${goal.color} hover:opacity-90 rounded-lg font-semibold transition-all flex items-center justify-center gap-2`}
                            >
                              <Plus className="w-5 h-5" />
                              Add Savings
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ==================== BUDGET MASTER VIEW ==================== */}
        {activeTab === 'budget' && (
          <>
            {/* Budget Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <button
                onClick={() => setBudgetView('overview')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  budgetView === 'overview' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setBudgetView('add-transaction')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  budgetView === 'add-transaction' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
              <button
                onClick={() => setBudgetView('budgets')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  budgetView === 'budgets' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
              >
                Set Budgets
              </button>
            </div>

            {/* Overview View */}
            {budgetView === 'overview' && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur rounded-xl p-6 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-slate-300">Total Income</span>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{formatMoney(getTotalIncome())}</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur rounded-xl p-6 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-slate-300">Total Expenses</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{formatMoney(getTotalExpenses())}</p>
                  </div>

                  <div className={`bg-gradient-to-br backdrop-blur rounded-xl p-6 border ${
                    getBalance() >= 0 
                      ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
                      : 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-slate-300">Balance</span>
                    </div>
                    <p className={`text-3xl font-bold ${getBalance() >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                      {formatMoney(getBalance())}
                    </p>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <PieChart className="w-6 h-6" />
                    Budget by Category
                  </h2>
                  <div className="space-y-4">
                    {categories.map(category => {
                      const spent = getExpensesByCategory()[category] || 0;
                      const budget = budgets[category] || 0;
                      const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                      const status = getCategoryStatus(category);

                      return (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{category}</span>
                              {status === 'over' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                              {status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                              {status === 'good' && spent > 0 && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                            <span className="text-sm">
                              <span className={`font-bold ${
                                status === 'over' ? 'text-red-400' :
                                status === 'warning' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>{formatMoney(spent)}</span>
                              <span className="text-slate-400"> / {formatMoney(budget)}</span>
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                status === 'over' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                status === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                'bg-gradient-to-r from-green-500 to-green-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {percentage.toFixed(1)}% used • {formatMoney(budget - spent)} remaining
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
                  <div className="space-y-2">
                    {getRecentTransactions().map(transaction => (
                      <div key={`${transaction.type}-${transaction.id}`} 
                        className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{transaction.description || transaction.source}</p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              transaction.type === 'income' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {transaction.category}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">{new Date(transaction.date).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className={`text-xl font-bold ${
                            transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatMoney(transaction.amount)}
                          </p>
                          <button
                            onClick={() => transaction.type === 'income' ? deleteIncome(transaction.id) : deleteExpense(transaction.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Add Transaction View */}
            {budgetView === 'add-transaction' && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Add New Transaction</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                          newTransaction.type === 'expense'
                            ? 'bg-red-500'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        Expense
                      </button>
                      <button
                        onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                          newTransaction.type === 'income'
                            ? 'bg-green-500'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        Income
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (MWK)</label>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      placeholder="5000"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {newTransaction.type === 'income' ? 'Source' : 'Description'}
                    </label>
                    <input
                      type="text"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      placeholder={newTransaction.type === 'income' ? 'e.g., Salary, Business' : 'e.g., Groceries, Taxi fare'}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {newTransaction.type === 'expense' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={addTransaction}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg font-semibold transition-all"
                    >
                      Add Transaction
                    </button>
                    <button
                      onClick={() => setBudgetView('overview')}
                      className="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Budgets View */}
            {budgetView === 'budgets' && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Set Monthly Budgets</h2>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category} className="flex items-center gap-4">
                      <label className="w-32 font-semibold">{category}</label>
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">MWK</span>
                        <input
                          type="number"
                          value={budgets[category]}
                          onChange={(e) => updateBudget(category, e.target.value)}
                          className="w-full pl-16 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-600">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Budget:</span>
                      <span className="text-blue-400">
                        {formatMoney(Object.values(budgets).reduce((sum, b) => sum + b, 0))}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setBudgetView('overview')}
                    className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg font-semibold transition-all"
                  >
                    Save & View Overview
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}