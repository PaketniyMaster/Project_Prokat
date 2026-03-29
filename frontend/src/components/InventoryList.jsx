import { useState, useEffect } from 'react';

function InventoryList() {
  const [items, setItems] = useState([]);

  // Выносим загрузку данных в отдельную функцию, чтобы можно было вызывать её после обновления
  const fetchItems = () => {
    fetch('http://localhost:8000/api/items/items/')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error("Ошибка товаров:", error));
  };

  useEffect(() => {
    fetchItems(); // Загружаем товары при первой отрисовке
  }, []);

  // НОВОЕ: Функция для починки товара
  const handleFinishRepair = (itemId) => {
    // Спрашиваем у пользователя стоимость ремонта
    const costInput = prompt("Введите стоимость ремонта (в рублях):");
    
    // Если пользователь нажал "Отмена" или ничего не ввел — прерываем
    if (!costInput) return;

    const cost = parseFloat(costInput);
    if (isNaN(cost)) {
      alert("Пожалуйста, введите корректное число.");
      return;
    }

    // Отправляем запрос на наш бэкенд
    fetch(`http://localhost:8000/api/items/items/${itemId}/finish_repair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cost: cost })
    })
    .then(response => {
      if (response.ok) {
        alert("Товар успешно починен!");
        fetchItems(); // Перезагружаем список товаров, чтобы обновить статус на экране
        
        // Маленький трюк: перезагружаем всю страницу, чтобы обновился и компонент финансов
        window.location.reload(); 
      } else {
        alert("Произошла ошибка при починке товара.");
      }
    })
    .catch(error => console.error("Ошибка при отправке запроса:", error));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available': return <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Свободен</span>;
      case 'rented': return <span style={{ color: '#ff9800', fontWeight: 'bold' }}>В аренде</span>;
      case 'in_repair': return <span style={{ color: '#f44336', fontWeight: 'bold' }}>В ремонте</span>;
      case 'lost': return <span style={{ color: '#9e9e9e', fontWeight: 'bold' }}>Утерян</span>;
      default: return status;
    }
  };

  return (
    <>
      <h2 style={{ marginTop: '40px' }}>Наш инвентарь</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item.id} style={{ 
              padding: '20px', 
              border: item.status === 'in_repair' ? '2px solid #f44336' : '1px solid #ddd', 
              borderRadius: '8px', 
              backgroundColor: '#fafafa' 
            }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.name}</h3>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              Категория: {item.category ? item.category.name : 'Не указана'}
            </p>
            <p style={{ margin: '5px 0' }}>Цена: <b>{item.rental_price} руб/день</b></p>
            <p style={{ margin: '15px 0 15px 0' }}>Статус: {getStatusBadge(item.status)}</p>
            
            {/* НОВОЕ: Показываем кнопку только если товар в ремонте */}
            {item.status === 'in_repair' && (
              <button 
                onClick={() => handleFinishRepair(item.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🛠 Починить
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default InventoryList;