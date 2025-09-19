import React, { useState } from "react";
import axios from "axios";
import AddTransactionModal from "./AddTransactionModal";

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save transaction (local + backend)
  const saveTransaction = async (tx) => {
    console.log("Sending transaction to backend:", tx);  // 🔍 Debug
    try {
      await axios.post("http://127.0.0.1:8000/transactions", tx);
      const response = await axios.get("http://127.0.0.1:8000/transactions");
      setTransactions(response.data.transactions);
      console.log("Transaction saved successfully");
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };
  // Delete from local list only (backend integration later)
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshTransactions = async () => {
    console.log("Retrieving transactions from backend");
    try {
      const response = await axios.get("http://127.0.0.1:8000/transactions");
      setTransactions(response.data.transactions);
      console.log("Transaction refreshed successfully");
    } catch (error) {
      console.error("Error refreshing transactions", error);
    }
  }

  // Summary calculation
  const summary = transactions.reduce(
    (acc, t) => {
      const txDate = new Date(t.date);
      const now = new Date();

      // check if transaction is in current month/year
      const isThisMonth =
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear();

      if (isThisMonth && t.categories?.includes("food")) {
        acc.foodExpenses += t.amount;
      }

      if (t.categories?.includes("savings")) {
        acc.savings += t.amount;
      }

      return acc;
    },
    { foodExpenses: 0, savings: 0 }
  );

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <div className="w-1/4 bg-gray-300 p-4 flex flex-col border-r">
        <div className="flex flex-row">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-4/5 mb-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Transaction
          </button>
          <button
          onClick={() => refreshTransactions()}
          className="w-1/5 ml-2 mb-4 bg-yellow-200 hover:bg-yellow-400 rounded">
           Refresh
          </button>
        </div>

        <div className="space-y-1 overflow-y-auto">
          {transactions.map((t, index) => (
            <div
              key={index}
              className="p-1.5 m-1 bg-white rounded shadow flex justify-between"
            >
              <div>
                <p className="font-small">{t.description || "(No description)"}</p>
                <p className="text-xs text-gray-600">
                Rs.{t.amount}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {t.categories?.map((cat, i) => (
                    <span
                      key={i}
                      className="px-1 py-0 bg-gray-200 text-xs rounded border border-indigo-600"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-col">
                <div className="flex justify-end">
                <p className="text-xs text-gray-600">{t.date}</p></div>
                <div>
                  <button
                  onClick={() => deleteTransaction(t.id)}
                  className="px-1 py-0.5 mt-8 mr-3 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Top summary */}
        <div className="h-1/5 grid grid-cols-2 gap-4">
          <div className="bg-white rounded shadow flex flex-col justify-center items-center p-4">
            <h2 className="text-lg font-bold">Monthly Food Expenses</h2>
            <p className="text-red-600 text-xl">Rs.{summary.foodExpenses}</p>
          </div>
          <div className="bg-white rounded shadow flex flex-col justify-center items-center p-4">
            <h2 className="text-lg font-bold">Total Savings</h2>
            <p className="text-green-600 text-xl">Rs.{summary.savings}</p>
          </div>
        </div>

        {/* Bottom placeholder */}
        <div className="flex-1 mt-4 border rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500">Bottom section content will go here...</p>
        </div>
      </div>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveTransaction}
      />
    </div>
  );
}
