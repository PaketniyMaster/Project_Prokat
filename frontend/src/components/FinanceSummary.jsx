import { useState, useEffect } from 'react';

function FinanceSummary() {
  const [finance, setFinance] = useState({
    total_income: 0,
    total_expenses: 0,
    net_profit: 0
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/finance/summary/')
      .then(response => response.json())
      .then(data => setFinance(data))
      .catch(error => console.error("Ошибка финансов:", error));
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <div style={{ padding: '20px', border: '1px solid #4caf50', borderRadius: '8px', flex: 1 }}>
        <h3>Доходы</h3>
        <p style={{ fontSize: '24px', color: '#4caf50' }}>{finance.total_income} руб.</p>
      </div>

      <div style={{ padding: '20px', border: '1px solid #f44336', borderRadius: '8px', flex: 1 }}>
        <h3>Расходы</h3>
        <p style={{ fontSize: '24px', color: '#f44336' }}>{finance.total_expenses} руб.</p>
      </div>

      <div style={{ padding: '20px', border: '1px solid #2196f3', borderRadius: '8px', backgroundColor: '#e3f2fd', flex: 1 }}>
        <h3>Чистая прибыль</h3>
        <p style={{ fontSize: '24px', color: '#1976d2', fontWeight: 'bold' }}>{finance.net_profit} руб.</p>
      </div>
    </div>
  );
}

export default FinanceSummary;