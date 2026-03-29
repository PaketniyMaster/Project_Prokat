import FinanceSummary from './FinanceSummary';
import InventoryList from './InventoryList';
import BookingList from './BookingList'; // <--- Новый импорт

function AdminPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Панель управления бизнесом ⚙️</h1>
      
      <FinanceSummary />
      <BookingList /> {/* <--- Вставили таблицу с заказами сюда */}
      <InventoryList />
      
    </div>
  );
}

export default AdminPage;