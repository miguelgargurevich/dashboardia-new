"use client";
import { useState } from "react";
import { FaSave } from "react-icons/fa";

export default function ModernForm({ onSubmit, initial = {}, fields, title }: any) {
  const [form, setForm] = useState(initial);
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <form
      className="bg-white dark:bg-darkBg p-6 rounded-xl shadow-lg flex flex-col gap-4 max-w-md w-full"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <h2 className="text-xl font-bold mb-2 text-primary dark:text-primary">{title}</h2>
      {fields.map((f: any) => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-gray-700 dark:text-gray-200">{f.label}</label>
          <input
            className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-lightBg dark:bg-darkBg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            type={f.type || "text"}
            name={f.name}
            value={form[f.name] || ""}
            onChange={handleChange}
            required={f.required}
          />
        </div>
      ))}
      <button
        type="submit"
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition"
      >
        <FaSave /> Guardar
      </button>
    </form>
  );
}
