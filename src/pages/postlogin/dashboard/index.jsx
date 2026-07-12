import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-400 text-sm">
          Welcome to your Expense Tracker Dashboard.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
