import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

function Navbar() {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        {/* Иконка и логотип */}
        <DirectionsBikeIcon sx={{ mr: 2, color: 'secondary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Прокат CRM
        </Typography>

        {/* Кнопки навигации */}
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/" 
            sx={{ mr: 2, fontWeight: 'bold' }}
          >
            Витрина
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            component={RouterLink} 
            to="/admin" 
            sx={{ fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            Админ-панель
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;