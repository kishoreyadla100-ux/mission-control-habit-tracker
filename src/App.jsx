import React, { useState, useEffect } from 'react';

const SHORT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function App() {
  const [time, setTime] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  
  // 1. STABLE LOADING: Specifically named key 'HABIT_DATA_FINAL'
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('HABIT_DATA_FINAL');
    if (saved) return JSON.parse(saved);
    return [{ id: 1, name: 'Deep Work Architecture', completed: [false, false, false, false, false, false, false], color: '#6366f1' }];
  });

  // 2. LIVE CLOCK
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. BULLETPROOF SAVING: This runs every time 'habits' changes
  useEffect(() => {
    localStorage.setItem('HABIT_DATA_FINAL', JSON.stringify(habits));
    console.log("Data Locked to Storage"); // You can see this in the browser console
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newEntry = {
      id: Date.now(),
      name: inputValue,
      completed: Array(7).fill(false),
      color: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'][habits.length % 5]
    };
    setHabits([...habits, newEntry]);
    setInputValue('');
  };

  const toggleHabit = (habitId, dayIndex) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completed];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        return { ...habit, completed: newCompleted };
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const momentum = habits.length > 0 
    ? Math.round((habits.reduce((acc, h) => acc + h.completed.filter(Boolean).length, 0) / (habits.length * 7)) * 100) 
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'monospace' }}>{time.toLocaleTimeString([], { hour12: false })}</div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div style={{ textAlign: 'right', color: '#6366f1', fontWeight: 'bold', fontSize: '12px' }}>MOMENTUM: {momentum}%</div>
        </div>

        {/* INPUT */}
        <form onSubmit={addHabit} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="DEPLOY NEW OBJECTIVE..." 
            style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '15px', color: 'white' }}
          />
          <button type="submit" style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold' }}>ADD</button>
        </form>

        {/* LIST */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {habits.map(habit => (
            <div key={habit.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>{habit.name}</span>
                <button onClick={() => deleteHabit(habit.id)} style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {SHORT_DAYS.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleHabit(habit.id, idx)}
                    style={{
                      aspectRatio: '1/1', borderRadius: '8px', border: '1px solid #1e293b',
                      background: habit.completed[idx] ? habit.color : 'transparent',
                      color: habit.completed[idx] ? '#000' : '#475569',
                      fontWeight: 'bold', cursor: 'pointer'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}