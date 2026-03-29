import { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardActions, 
  Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Box, Tabs, Tab, Alert
} from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';

function StorefrontPage() {
  const [items, setItems] = useState([]);
  
  // --- ЛОГИКА АВТОРИЗАЦИИ ---
  const savedClientId = localStorage.getItem('prokat_client_id');
  const [clientId, setClientId] = useState(savedClientId);
  
  const [isAuthOpen, setIsAuthOpen] = useState(!savedClientId);
  const [authTab, setAuthTab] = useState(0); // 0 - Вход, 1 - Регистрация
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState(''); // Для красивого вывода ошибок

  // Логика бронирования
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch('http://localhost:8000/api/items/items/')
      .then(response => response.json())
      .then(data => setItems(data.filter(item => item.status === 'available')))
      .catch(error => console.error("Ошибка:", error));
  };

  // Обработка ВХОДА (поиск существующего клиента)
  const handleLogin = () => {
    setAuthError('');
    if (!authPhone.trim()) {
      setAuthError("Пожалуйста, введите номер телефона");
      return;
    }

    // Запрашиваем всех клиентов и ищем совпадение по телефону
    fetch('http://localhost:8000/api/clients/')
      .then(response => response.json())
      .then(clients => {
        const existingClient = clients.find(c => c.phone === authPhone.trim());
        
        if (existingClient) {
          localStorage.setItem('prokat_client_id', existingClient.id);
          setClientId(existingClient.id);
          setIsAuthOpen(false);
          alert(`С возвращением, ${existingClient.full_name}!`);
        } else {
          setAuthError("Клиент с таким номером не найден. Перейдите на вкладку 'Регистрация'.");
        }
      })
      .catch(error => {
        console.error("Ошибка:", error);
        setAuthError("Ошибка связи с сервером");
      });
  };

  // Обработка РЕГИСТРАЦИИ (создание нового клиента)
  const handleRegister = () => {
    setAuthError('');
    if (!authName.trim() || !authPhone.trim()) {
      setAuthError("Пожалуйста, заполните все поля");
      return;
    }
    if (authName.length < 3) {
      setAuthError("Имя должно содержать минимум 3 символа");
      return;
    }

    const newClient = {
      full_name: authName.trim(),
      phone: authPhone.trim(),
      email: null,
      passport_data: null
    };

    fetch('http://localhost:8000/api/clients/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('prokat_client_id', data.id);
        setClientId(data.id);
        setIsAuthOpen(false);
        alert(`Добро пожаловать, ${data.full_name}!`);
      } else {
        const errorData = await response.json();
        setAuthError(`Ошибка регистрации: ${errorData.detail}`);
      }
    })
    .catch(error => {
      console.error("Ошибка:", error);
      setAuthError("Ошибка связи с сервером");
    });
  };

  // Общий обработчик кнопки в модалке (Вход или Регистрация)
  const handleAuthSubmit = () => {
    if (authTab === 0) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  // ... (логика бронирования осталась без изменений)
  const openBookModal = (item) => {
    setSelectedItem(item);
    setIsBookOpen(true);
  };

  const closeBookModal = () => {
    setIsBookOpen(false);
    setSelectedItem(null);
    setStartDate('');
    setEndDate('');
  };

  const handleBookSubmit = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      alert("Дата возврата должна быть позже даты начала!");
      return;
    }
    
    const bookingData = {
      item_id: selectedItem.id,
      client_id: parseInt(clientId), 
      start_date: startDate,
      end_date: endDate
    };

    fetch('http://localhost:8000/api/bookings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })
    .then(async (response) => {
      if (response.ok) {
        alert("Бронирование успешно оформлено!");
        closeBookModal();
        fetchItems(); 
      } else {
        const errorData = await response.json();
        alert(`Ошибка бронирования: ${errorData.detail}`);
      }
    })
    .catch(error => console.error("Ошибка:", error));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom>
          Прокат "С ветерком" <DirectionsBikeIcon fontSize="large" color="secondary"/> <DownhillSkiingIcon fontSize="large" color="secondary"/>
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Арендуй лучшее снаряжение для активного отдыха
        </Typography>
      </Box>

      {/* ОБНОВЛЕННОЕ ОКНО АВТОРИЗАЦИИ */}
      <Dialog open={isAuthOpen} disableEscapeKeyDown maxWidth="xs" fullWidth>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={authTab} onChange={(e, newValue) => { setAuthTab(newValue); setAuthError(''); }} variant="fullWidth">
            <Tab label="Вход" sx={{ fontWeight: 'bold' }} />
            <Tab label="Регистрация" sx={{ fontWeight: 'bold' }} />
          </Tabs>
        </Box>
        
        <DialogContent>
          {/* Показываем блок с ошибкой, если она есть */}
          {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}

          {/* Поле ИМЯ показываем ТОЛЬКО при регистрации (authTab === 1) */}
          {authTab === 1 && (
            <TextField 
              fullWidth label="Ваше ФИО" variant="outlined" margin="normal"
              value={authName} onChange={(e) => setAuthName(e.target.value)}
              placeholder="Иванов Иван"
            />
          )}

          {/* Поле ТЕЛЕФОН показываем всегда */}
          <TextField 
            fullWidth label="Номер телефона" variant="outlined" margin="normal"
            value={authPhone} onChange={(e) => setAuthPhone(e.target.value)}
            placeholder="+7 (999) 000-00-00"
            helperText={authTab === 0 ? "Введите номер, указанный при регистрации" : ""}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button variant="contained" color="primary" fullWidth size="large" onClick={handleAuthSubmit}>
            {authTab === 0 ? "Войти" : "Создать аккаунт"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Окно бронирования */}
      <Dialog open={isBookOpen} onClose={closeBookModal}>
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>Оформление заказа</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Вы бронируете: <b>{selectedItem?.name}</b>
          </Typography>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>Дата и время начала:</Typography>
            <TextField 
              fullWidth type="datetime-local" 
              value={startDate} onChange={(e) => setStartDate(e.target.value)}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>Дата и время возврата:</Typography>
            <TextField 
              fullWidth type="datetime-local" 
              value={endDate} onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeBookModal} color="inherit">Отмена</Button>
          <Button onClick={handleBookSubmit} variant="contained" color="secondary">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Список товаров */}
      {items.length === 0 ? (
        <Typography align="center" variant="h6" mt={5}>К сожалению, сейчас всё разобрали :(</Typography>
      ) : (
        <Grid container spacing={4}>
          {items.map(item => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2, '&:hover': { boxShadow: 8, transform: 'translateY(-4px)', transition: '0.3s' } }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" component="h2" gutterBottom color="primary">
                    {item.name}
                  </Typography>
                  <Typography color="text.secondary" mb={3}>
                    {item.description || "Отличное состояние, готово к использованию!"}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label={item.category?.name || "Без категории"} size="small" sx={{ bgcolor: 'rgba(44, 62, 80, 0.1)', color: 'primary.main', fontWeight: 'bold' }} />
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {item.rental_price} ₽/день
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    fullWidth variant="contained" color="secondary" size="large" 
                    onClick={() => openBookModal(item)}
                  >
                    Забронировать
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default StorefrontPage;