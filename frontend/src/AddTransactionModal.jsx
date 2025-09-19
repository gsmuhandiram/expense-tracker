import React, { useState } from "react";

export default function AddTransactionModal({ isOpen, onClose, onSave }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const tx = {
      id: Date.now(),
      date,
      description,
      amount: parseFloat(amount),
      type: parseFloat(amount) >= 0 ? "Income" : "Expense", 
      categories: categories, // array, backend will join
    };

    onSave(tx);
    onClose();

    // Reset fields
    setAmount("");
    setDescription("");
    setDate("");
    setCategories([]);
  };

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const isIncome = parseFloat(amount) >= 0;

  const incomeCategories = ["Salary", "Rental", "Interest"];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        {/* Categories */}
        <div>
        <p className="font-medium mb-2">Categories</p>

        {isIncome ? (
            // Income → show all as primary
            <div className="flex flex-wrap gap-2">
            {incomeCategories.map((cat) => (
                <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded border ${
                    categories.includes(cat)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                >
                {cat}
                </button>
            ))}
            </div>
        ) : (
        // Expense → split into primary (left) and secondary (right)
          <div className="grid grid-cols-2 gap-4">
          {/* Primary categories */}
          <div className="flex flex-wrap gap-2 items-start">
              {["Savings", "Food", "Groceries", "Medicine", "Self care", "Entertainment", "Bills", "Fuel", "Gifts/Charity", "Other"].map((cat) => (
              <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-1 py-1 rounded border text-sm ${
                  categories.includes(cat)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                  {cat}
              </button>
              ))}
          </div>

          {/* Secondary categories */}
          <div className="flex flex-wrap gap-2 items-start">
              {["Mobile", "Water", "Electicity", "Crew Cab", "Car", "Bike", "Driver", "Insurance/License", "Parts", "Repair and Maintenance"].map((cat) => (
              <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-1 py-1 rounded border text-sm ${
                  categories.includes(cat)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                  {cat}
              </button>
              ))}
          </div>
          </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
