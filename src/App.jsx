import React, { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function App() {
  const [time, setTime] = useState(new Date());
  const [inputValue, setInputValue] = useState(''); // FOR ADDING NEW HABITS
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('massive_habits_final');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Deep Work Architecture', completed: [false, false, false, false, false, false, false], color: '#6366f1' }
    ];
  });

  // LIVE CLOCK ENGINE
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('massive_habits_final', JSON.stringify(habits));
  }, [habits]);

  // CALCULATION LOGIC
  const momentum = habits.length > 0 
    ? Math.round((habits.reduce((acc, h) => acc + h.completed.filter(Boolean).length, 0) / (habits.length * 7)) * 100) 
    : 0;

  // ADD HABIT FUNCTION
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
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completed];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        return { ...habit, completed: newCompleted };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* TOP TEMPORAL BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', fontFamily: 'monospace' }}>
              {time.toLocaleTimeString([], { hour12: false })}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: 'bold' }}>SYSTEM_STATUS: ACTIVE</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>USER_ID: SHAKINA_KISHORE</div>
          </div>
        </div>

        {/* NEW HABIT INPUT (The Missing Piece) */}
        <form onSubmit={addHabit} style={{ marginBottom: '40px', display: 'flex', gap: '10px' }}>
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="TYPE_NEW_OBJECTIVE..."
            style={{ 
              flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', 
              padding: '15px 20px', color: 'white', fontFamily: 'monospace', outline: 'none' 
            }}
          />
          <button type="submit" style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', padding: '0 25px', cursor: 'pointer', fontWeight: 'bold' }}>
            INITIALIZE
          </button>
        </form>

        {/* MOMENTUM HUD */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #020617 100%)', padding: '40px', borderRadius: '32px', border: '1px solid #334155', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontSize: '12px', letterSpacing: '2px', color: '#94a3b8' }}>TOTAL_MOMENTUM</span>
            <span style={{ color: '#6366f1', fontWeight: 'bold' }}>{momentum}%</span>
          </div>
          <div style={{ height: '6px', background: '#0f172a', borderRadius: '3px' }}>
            <div style={{ width: `${momentum}%`, height: '100%', background: '#6366f1', transition: '0.5s', boxShadow: '0 0 15px #6366f1' }} />
          </div>
        </div>

        {/* HABIT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {habits.map(habit => (
            <div key={habit.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: '700' }}>{habit.name}</span>
                <button onClick={() => deleteHabit(habit.id)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer' }}>×</button>
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
                      cursor: 'pointer', fontSize: '10px', fontWeight: 'bold'
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