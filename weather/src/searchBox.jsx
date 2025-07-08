import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './searchBox.css';
import boyImage from './boy2.png'; // ✅ Transparent background image
import CloudIcon from '@mui/icons-material/Cloud';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import OpacityIcon from '@mui/icons-material/Opacity';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import CircleIcon from '@mui/icons-material/Circle';
import Box from '@mui/material/Box';

export default function SearchBox() {
  const [city, setCity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const API_KEY = '53185aa1bf3d5a73c6a570fe1a988a80';

  const gatherCityInfo = async () => {
    const fullUrl = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setError(null);
      } else {
        setResult(null);
        setError(data.message);
      }
    } catch (err) {
      setResult(null);
      setError('Network error. Please try again.');
    }
  };

  const handleChange = (e) => setCity(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      gatherCityInfo();
      setCity('');
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear': return <WbSunnyIcon style={{ fontSize: '40px', color: 'goldenrod' }} />;
      case 'Clouds': return <CloudQueueIcon style={{ fontSize: '40px', color: 'gray' }} />;
      case 'Rain': return <OpacityIcon style={{ fontSize: '40px', color: 'blue' }} />;
      case 'Snow': return <AcUnitIcon style={{ fontSize: '40px', color: 'skyblue' }} />;
      case 'Thunderstorm': return <ThunderstormIcon style={{ fontSize: '40px', color: 'purple' }} />;
      case 'Mist':
      case 'Haze':
      case 'Fog':
        return <BlurOnIcon style={{ fontSize: '40px', color: 'darkgray' }} />;
      default: return <CloudIcon style={{ fontSize: '40px', color: 'gray' }} />;
    }
  };

  const getSpeechText = () => {
    if (!result) return "Hey! Enter a city to check the weather! 🌍";
    const weather = result.weather[0].main.toLowerCase();
    if (weather.includes('rain')) return "Umbrella time! ☔";
    if (weather.includes('clear')) return "Sunny skies! 😎";
    if (weather.includes('cloud')) return "A bit cloudy today.";
    if (weather.includes('snow')) return "Snowy weather! ❄️";
    if (weather.includes('thunderstorm')) return "Thunder ahead! ⚡";
    return "Weather’s in!";
  };

  return (
    <>
      {/* Background Sun & Clouds */}
      <div style={{ position: 'relative' }}>
        <CloudIcon style={{ position: 'absolute', top: '70px', left: '20px', fontSize: '220px', color: 'rgb(127, 121, 131)', zIndex: 10 }} />
        <CloudIcon style={{ position: 'absolute', top: '190px', left: '200px', fontSize: '150px', color: 'rgb(127, 121, 131)', zIndex: 10 }} />
        <CircleIcon style={{ position: 'absolute', top: '100px', left: '160px', fontSize: '170px', color: 'rgb(224, 236, 91)', zIndex: 1 }} />
      </div>

      {/* Main Content */}
      <div className="searchBox">
        <h1 style={{ color: 'black' }}>Search for Weather</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            id="city"
            label="City Name"
            variant="outlined"
            required
            value={city}
            onChange={handleChange}
          />
          <br /><br />
          <Button variant="contained" type="submit">
            Search
          </Button>
        </form>

        {/* Error Message */}
        {error && <div style={{ color: 'red', marginTop: '10px' }}>❌ {error}</div>}

        {/* Weather Result Box */}
        {result && (
          <Box className="helo" component="section" sx={{
            p: 2,
            border: '2px dashed seagreen',
            borderRadius: 2,
            mt: 3,
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'black',
            width: '400px'
          }}>
            <h4>{result.name}, {result.sys.country}</h4>
            {getWeatherIcon(result.weather[0].main)}
            <p><strong>Temperature:</strong> {result.main.temp}°C</p>
            <p><strong>Feels Like:</strong> {result.main.feels_like}°C</p>
            <p><strong>Humidity:</strong> {result.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> {result.wind.speed} m/s</p>
            <p><strong>Condition:</strong> {result.weather[0].description}</p>
          </Box>
        )}
      </div>

      {/* Bottom-right Boy & Speech Bubble (always visible) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        zIndex: 1000,
        maxWidth: '300px'
      }}>
        <div style={{
          background: 'white',
          padding: '12px 20px',
          borderRadius: '15px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          fontStyle: 'italic',
          color: 'black',
          fontSize: '16px',
          position: 'relative',
          lineHeight: '1.5'
        }}>
          <div style={{
            content: '""',
            position: 'absolute',
            bottom: '10px',
            left: '-10px',
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '10px solid white'
          }} />
          {getSpeechText()}
        </div>
        <img
          src={boyImage}
          alt="Weather Buddy"
          style={{ width: '180px', height: '200px' }}
        />
      </div>
    </>
  );
}
