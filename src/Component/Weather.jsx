import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import { IoSearchOutline } from "react-icons/io5"; // Import the search icon
import cloud from '/cloud.png';       // Correct relative paths
import humidity from '/humidity.png';
import wind from '/wind.png';
import clear from '/clear.png';
import drizzle from '/drizzle.png';
import rain from '/rain.png';
import snow from '/snow.png';

function Weather() {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');

    const allIcons = {
        "01d": clear,
        "01n": clear,
        "02d": cloud,
        "02n": cloud,
        "03d": cloud,
        "03n": cloud,
        "04d": drizzle,
        "04n": drizzle,
        "09d": rain,
        "09n": rain,
        "10d": rain,    // Corrected keys
        "10n": rain,
        "13d": snow,
        "13n": snow,
    };

    const search = async (city) => {
        if (!city) {
            alert("Please enter a city name.");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=898683f0e37cc30ae2e8386e2746e9dc`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                const icon = allIcons[data.weather[0].icon] || clear;
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temp: Math.floor(data.main.temp),
                    location: data.name,
                    icon: icon,
                });
                setError('');
            } else {
                setWeatherData(null);
                setError('City not found. Please enter a valid city name.');
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeatherData(null);
            setError('An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        search("Mumbai"); // Fetch weather for default city on component mount
    }, []);

    const handleSearch = () => {
        const city = inputRef.current.value.trim();
        search(city);
    };

    return (
        <div className="container">
            <div className="search">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter Your City"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <IoSearchOutline className="search-icon" onClick={handleSearch} />
            </div>

            {error && <p className="error-message">{error}</p>}

            {weatherData && (
                <>
                    <div className="weather-info">
                        <div className="cloud">
                            <img src={weatherData.icon} alt="Weather Icon" />
                            <h3>{weatherData.location}</h3>
                            <p>{weatherData.temp}&deg;C</p>
                        </div>

                        <div className="footer">
                            <div className="humidity">
                                <img src={humidity} alt="Humidity Icon" />
                                <h5>{weatherData.humidity}%
                                    <h6>Humidity</h6></h5>

                            </div>

                            <div className="speed">
                                <img src={wind} alt="Wind Icon" />
                                <h5>{weatherData.windSpeed} km/h
                                    <h6>Wind Speed</h6></h5>

                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Weather;
