import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import { generateId } from '../../utils/helpers';
import { format } from 'date-fns';
import toast from "react-hot-toast";

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, updateTransaction } = useStore();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'food',
    date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: String(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        note: transaction.note || '',
      });
    }
  }, [transaction]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Valid amount required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const categoryMeta = CATEGORIES.find(c => c.id === form.category);
    const txn = {
      ...form,
      amount: Number(form.amount),
      categoryMeta,
      id: isEdit ? transaction.id : generateId(),
    };

    if (isEdit) {
      updateTransaction(transaction.id, txn);
      toast.success("Transaction updated successfully");
    } else {
      addTransaction(txn);
      toast.success("Transaction added successfully");
    }
    onClose();

  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const incomeCategories = CATEGORIES.filter(c => ['salary', 'freelance', 'investment'].includes(c.id));
  const expenseCategories = CATEGORIES.filter(c => !['salary', 'freelance', 'investment'].includes(c.id));
  const relevantCategories = form.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-display font-700 text-lg" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Type</label>
            <div className="flex gap-2">
              {['income', 'expense'].map(t => (
                <button
                  key={t}
                  onClick={() => {
                    set('type', t);
                    set('category', t === 'income' ? 'salary' : 'food');
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
                  style={form.type === t
                    ? { background: t === 'income' ? 'rgba(79,255,176,0.15)' : 'rgba(255,107,107,0.15)', color: t === 'income' ? '#4fffb0' : '#ff6b6b', border: `1px solid ${t === 'income' ? '#4fffb0' : '#ff6b6b'}` }
                    : { background: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                  }
                >
                  {t === 'income' ? '↑' : '↓'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Description *</label>
            <input
              className="input-field"
              placeholder="e.g. Swiggy Order"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            {errors.description && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.description}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Amount (₹) *</label>
            <input
              className="input-field font-mono"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
            />
            {errors.amount && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.amount}</p>}
          </div>

          {/* Category & Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select
                className="select-field"
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {relevantCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Date</label>
              <input
                className="input-field"
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Note (optional)</label>
            <input
              className="input-field"
              placeholder="Any additional notes..."
              value={form.note}
              onChange={e => set('note', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary flex-1 justify-center">
            <Check size={16} />
            {isEdit ? 'Update' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}