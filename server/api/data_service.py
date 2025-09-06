import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)

class DataService:
    def __init__(self):
        self.data_path = "data/"
        self._load_base_data()
    
    def _load_base_data(self):
        """
        Load base CSV data files
        """
        try:
            # Load core data files
            self.circuits = self._load_csv("circuits.csv")
            self.drivers = self._load_csv("drivers.csv")
            self.constructors = self._load_csv("constructors.csv")
            self.races = self._load_csv("races.csv")
            self.results = self._load_csv("results.csv")
            self.qualifying = self._load_csv("qualifying.csv")
            self.lap_times = self._load_csv("lap_times.csv")
            self.pit_stops = self._load_csv("pit_stops.csv")
            
            logger.info("Base data loaded successfully")
            
        except Exception as e:
            logger.warning(f"Could not load CSV data: {str(e)}. Using mock data.")
            self._create_mock_data()
    
    def _load_csv(self, filename: str) -> pd.DataFrame:
        """
        Load CSV file with error handling
        """
        filepath = os.path.join(self.data_path, filename)
        if os.path.exists(filepath):
            return pd.read_csv(filepath)
        else:
            logger.warning(f"File {filename} not found, using mock data")
            return pd.DataFrame()
    
    def _create_mock_data(self):
        """
        Create mock data for development
        """
        # Mock circuits
        self.circuits = pd.DataFrame({
            'circuitId': [1, 2, 3],
            'name': ['Monaco', 'Silverstone', 'Monza'],
            'location': ['Monte Carlo', 'Silverstone', 'Monza'],
            'country': ['Monaco', 'UK', 'Italy'],
            'lat': [43.7347, 52.0786, 45.6156],
            'lng': [7.4206, -1.0169, 9.2811]
        })
        
        # Mock drivers
        self.drivers = pd.DataFrame({
            'driverId': [1, 2, 3, 4, 5],
            'forename': ['Max', 'Lewis', 'Charles', 'George', 'Lando'],
            'surname': ['Verstappen', 'Hamilton', 'Leclerc', 'Russell', 'Norris'],
            'code': ['VER', 'HAM', 'LEC', 'RUS', 'NOR'],
            'nationality': ['Dutch', 'British', 'Monégasque', 'British', 'British'],
            'dob': ['1997-09-30', '1985-01-07', '1997-10-16', '1998-02-15', '1999-11-13'],
            'number': [1, 44, 16, 63, 4]
        })
        
        # Mock constructors
        self.constructors = pd.DataFrame({
            'constructorId': [1, 2, 3, 4],
            'name': ['Red Bull Racing', 'Mercedes', 'Ferrari', 'McLaren'],
            'nationality': ['Austrian', 'German', 'Italian', 'British']
        })
        
        # Mock races
        self.races = pd.DataFrame({
            'raceId': [1050, 1051, 1052],
            'year': [2024, 2024, 2024],
            'round': [8, 9, 10],
            'circuitId': [1, 2, 3],
            'name': ['Monaco Grand Prix', 'British Grand Prix', 'Italian Grand Prix'],
            'date': ['2024-05-26', '2024-07-07', '2024-09-01'],
            'time': ['15:00:00', '15:00:00', '15:00:00']
        })
    
    async def get_current_race(self) -> Dict[str, Any]:
        """
        Get current/next race information
        """
        try:
            # For demo, return Monaco GP
            race_data = {
                'raceId': 1050,
                'name': 'Monaco Grand Prix',
                'date': '2024-05-26',
                'time': '15:00',
                'location': 'Monte Carlo, Monaco',
                'round': 8,
                'circuit': {
                    'name': 'Circuit de Monaco',
                    'location': 'Monte Carlo, Monaco',
                    'length': 3.337,
                    'laps': 78,
                    'country': 'Monaco'
                }
            }
            
            return race_data
            
        except Exception as e:
            logger.error(f"Error getting current race: {str(e)}")
            raise
    
    async def get_race_predictions(self, race_id: int) -> List[Dict[str, Any]]:
        """
        Get predictions for all drivers in a race
        """
        try:
            # Mock predictions data
            predictions = [
                {
                    'driverId': 1,
                    'driver': {'forename': 'Max', 'surname': 'Verstappen', 'code': 'VER'},
                    'constructor': {'name': 'Red Bull Racing'},
                    'predicted_position': 1.2,
                    'confidence': 0.87,
                    'trend': 'up'
                },
                {
                    'driverId': 2,
                    'driver': {'forename': 'Lewis', 'surname': 'Hamilton', 'code': 'HAM'},
                    'constructor': {'name': 'Mercedes'},
                    'predicted_position': 2.1,
                    'confidence': 0.82,
                    'trend': 'up'
                },
                {
                    'driverId': 3,
                    'driver': {'forename': 'Charles', 'surname': 'Leclerc', 'code': 'LEC'},
                    'constructor': {'name': 'Ferrari'},
                    'predicted_position': 2.8,
                    'confidence': 0.78,
                    'trend': 'down'
                },
                {
                    'driverId': 4,
                    'driver': {'forename': 'George', 'surname': 'Russell', 'code': 'RUS'},
                    'constructor': {'name': 'Mercedes'},
                    'predicted_position': 4.2,
                    'confidence': 0.75,
                    'trend': 'stable'
                },
                {
                    'driverId': 5,
                    'driver': {'forename': 'Lando', 'surname': 'Norris', 'code': 'NOR'},
                    'constructor': {'name': 'McLaren'},
                    'predicted_position': 5.1,
                    'confidence': 0.73,
                    'trend': 'up'
                }
            ]
            
            return predictions
            
        except Exception as e:
            logger.error(f"Error getting race predictions: {str(e)}")
            raise
    
    async def get_driver(self, driver_id: int) -> Dict[str, Any]:
        """
        Get driver information
        """
        try:
            # Mock driver data
            drivers_data = {
                1: {
                    'driverId': 1,
                    'forename': 'Max',
                    'surname': 'Verstappen',
                    'code': 'VER',
                    'number': 1,
                    'nationality': 'Dutch',
                    'dob': '1997-09-30'
                },
                2: {
                    'driverId': 2,
                    'forename': 'Lewis',
                    'surname': 'Hamilton',
                    'code': 'HAM',
                    'number': 44,
                    'nationality': 'British',
                    'dob': '1985-01-07'
                }
            }
            
            return drivers_data.get(driver_id, drivers_data[1])
            
        except Exception as e:
            logger.error(f"Error getting driver {driver_id}: {str(e)}")
            raise
    
    async def get_driver_performance(self, driver_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get driver performance history
        """
        try:
            # Generate mock performance data
            performance = []
            for i in range(limit):
                performance.append({
                    'race': f'R{limit - i}',
                    'position': np.random.randint(1, 16),
                    'points': np.random.randint(0, 26),
                    'dnf': np.random.random() < 0.1
                })
            
            return performance
            
        except Exception as e:
            logger.error(f"Error getting driver performance: {str(e)}")
            raise
    
    async def get_lap_data(self, race_id: int) -> List[Dict[str, Any]]:
        """
        Get lap time data for a race
        """
        try:
            # Generate mock lap data
            lap_data = []
            drivers = ['VER', 'HAM', 'LEC', 'RUS', 'NOR']
            
            for lap in range(1, 59):  # 58 laps
                lap_entry = {'lap': lap}
                for driver in drivers:
                    base_time = 90000 + np.random.normal(0, 2000)
                    lap_entry[driver] = int(base_time)
                lap_data.append(lap_entry)
            
            return lap_data
            
        except Exception as e:
            logger.error(f"Error getting lap data: {str(e)}")
            raise
    
    async def get_pit_data(self, race_id: int) -> List[Dict[str, Any]]:
        """
        Get pit stop data for a race
        """
        try:
            # Mock pit stop data
            pit_data = [
                {'driverId': 1, 'driver': 'VER', 'lap': 15, 'duration': 2.4, 'stop': 1, 'tireChange': 'Medium → Soft'},
                {'driverId': 2, 'driver': 'HAM', 'lap': 18, 'duration': 2.8, 'stop': 1, 'tireChange': 'Hard → Medium'},
                {'driverId': 3, 'driver': 'LEC', 'lap': 22, 'duration': 2.1, 'stop': 1, 'tireChange': 'Soft → Hard'},
                {'driverId': 4, 'driver': 'RUS', 'lap': 24, 'duration': 3.2, 'stop': 1, 'tireChange': 'Medium → Soft'},
                {'driverId': 5, 'driver': 'NOR', 'lap': 28, 'duration': 2.5, 'stop': 1, 'tireChange': 'Soft → Medium'},
            ]
            
            return pit_data
            
        except Exception as e:
            logger.error(f"Error getting pit data: {str(e)}")
            raise
    
    async def get_confidence_stream(self, race_id: int) -> List[Dict[str, Any]]:
        """
        Get confidence stream data for live predictions
        """
        try:
            # Generate mock confidence data
            confidence_data = []
            drivers = ['VER', 'HAM', 'LEC', 'RUS', 'NOR']
            
            for lap in range(1, 59):
                lap_entry = {'lap': lap}
                for driver in drivers:
                    confidence = 0.7 + np.random.normal(0, 0.1)
                    confidence = np.clip(confidence, 0.3, 0.95)
                    lap_entry[f'{driver}_confidence'] = confidence
                confidence_data.append(lap_entry)
            
            return confidence_data
            
        except Exception as e:
            logger.error(f"Error getting confidence stream: {str(e)}")
            raise
    
    async def get_telemetry_data(self, session_id: str, driver_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Get live telemetry data for a session
        """
        try:
            # Mock telemetry data
            telemetry_data = []
            
            for i in range(100):  # 100 telemetry points
                telemetry_data.append({
                    'timestamp': datetime.now() - timedelta(seconds=i),
                    'driverId': driver_id or 1,
                    'lap': (i // 10) + 1,
                    'sector': (i % 3) + 1,
                    'speed_kmh': 200 + np.random.normal(0, 20),
                    'track_pos_x': np.random.uniform(0, 1000),
                    'track_pos_y': np.random.uniform(0, 500),
                    'lap_time_ms': 90000 + np.random.normal(0, 2000)
                })
            
            return telemetry_data
            
        except Exception as e:
            logger.error(f"Error getting telemetry data: {str(e)}")
            raise