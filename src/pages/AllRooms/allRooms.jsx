import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, TextField, Card, CardContent, Typography, Box, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './allRooms.css';
import axiosInstance from '../../axiosService';

function AllRooms() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('http://localhost:4000/rooms');
        setTournaments(response.data.rooms);
      } catch (error) {
        console.error('Ошибка при получении данных турниров', error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <Container className="App" maxWidth="md">
      <Box className="search-bar" display="flex" alignItems="center" mb={4}>
        <TextField 
          variant="outlined" 
          fullWidth 
          placeholder="Search..." 
          InputProps={{
            endAdornment: <SearchIcon />
          }}
        />
      </Box>
      <Grid container spacing={3}>
        {tournaments.map((tournament, index) => (
          <Grid item xs={12} key={index}>
            <Card className="tournament-card">
              <CardContent>
                <Link to={`/room/${tournament._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Box display="flex" alignItems="center">
                    <img src={tournament.imageUrl || 'path_to_default_image'} alt="profile" className="profile-image" />
                    <Box ml={2}>
                      <Typography variant="h6">{tournament.name}</Typography>
                      <Typography variant="body2" color="textSecondary">формат {tournament.formatPlay}</Typography>
                    </Box>
                    <Box ml="auto">
                      <Typography variant="body2" color="green">{tournament.gameTime}</Typography>
                    </Box>
                  </Box>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AllRooms;
