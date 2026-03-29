import { useState, useEffect } from 'react';

function BookingList() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    fetch('http://localhost:8000/api/bookings/')
      .then(response => response.json())
      .then(data => setBookings(data))
      .catch(error => console.error("Ошибка при загрузке бронирований:", error));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Функция обработки возврата инвентаря
  const handleReturn = (bookingId) => {
    // Простой способ спросить статус через prompt (в реальном проекте тут было бы выпадающее окно)
    const statusChoice = prompt(
      "В каком состоянии вернули товар?\n1 - Целый (Свободен)\n2 - Сломан (В ремонт)\n3 - Утерян\n\nВведите цифру 1, 2 или 3:"
    );

    if (!statusChoice) return; // Если нажали "Отмена"

    let item_status = 'available';
    let repair_description = null;

    if (statusChoice === '2') {
      item_status = 'in_repair';
      repair_description = prompt("Опишите поломку (что нужно починить?):");
    } else if (statusChoice === '3') {
      item_status = 'lost';
    } else if (statusChoice !== '1') {
      alert("Неверный выбор. Введите 1, 2 или 3.");
      return;
    }

    // Отправляем запрос на наш эндпоинт возврата
    fetch(`http://localhost:8000/api/bookings/${bookingId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_status, repair_description })
    })
    .then(async (response) => {
      if (response.ok) {
        alert("Возврат успешно оформлен!");
        // Перезагружаем страницу, чтобы обновились финансы и статусы товаров
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.detail}`);
      }
    })
    .catch(error => console.error("Ошибка сети:", error));
  };

  const getBookingStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>В ожидании</span>;
      case 'active': return <span style={{ backgroundColor: '#cce5ff', color: '#004085', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Выдано</span>;
      case 'completed': return <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Завершено</span>;
      case 'conflict': return <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Конфликт</span>;
      case 'cancelled': return <span style={{ backgroundColor: '#e2e3e5', color: '#383d41', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Отменено</span>;
      default: return status;
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Управление заказами (Бронирования)</h2>
      
      <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>ID Товара</th>
              <th style={{ padding: '12px' }}>ID Клиента</th>
              <th style={{ padding: '12px' }}>Даты аренды</th>
              <th style={{ padding: '12px' }}>Статус</th>
              <th style={{ padding: '12px' }}>Сумма</th>
              <th style={{ padding: '12px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Заказов пока нет</td></tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>#{booking.id}</td>
                  <td style={{ padding: '12px' }}>Товар №{booking.item_id}</td>
                  <td style={{ padding: '12px' }}>Клиент №{booking.client_id}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    С: {new Date(booking.start_date).toLocaleString('ru-RU')}<br/>
                    По: {new Date(booking.end_date).toLocaleString('ru-RU')}
                  </td>
                  <td style={{ padding: '12px' }}>{getBookingStatusBadge(booking.status)}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#2c3e50' }}>
                    {booking.total_price ? `${booking.total_price} ₽` : '---'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {/* Кнопка возврата доступна только для активных/ожидающих заказов */}
                    {(booking.status === 'pending' || booking.status === 'active') && (
                      <button 
                        onClick={() => handleReturn(booking.id)}
                        style={{ padding: '6px 12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Принять возврат
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingList;