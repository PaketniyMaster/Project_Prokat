import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import AdminPage from './components/AdminPage';
import StorefrontPage from './components/StorefrontPage';

// Создаем нашу корпоративную тему один раз для всего проекта
const theme = createTheme({
  palette: {
    primary: { main: '#2c3e50' }, // Строгий темно-синий
    secondary: { main: '#e67e22' }, // Оранжевый акцент
    success: { main: '#27ae60' },
    background: { default: '#f4f6f8' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

function App() {
  return (
    // Оборачиваем ВСЁ приложение в провайдер темы
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Сброс стилей и мягкий серый фон на все страницы */}
      <BrowserRouter>
        <Navbar />
        <Box sx={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<StorefrontPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;