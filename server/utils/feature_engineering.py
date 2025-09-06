import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class FeatureEngineer:
    def __init__(self):
        self.feature_names = [
            'race_id', 'driver_id', 'constructor_id',
            'qualifying_position', 'last_3_laps_mean',
            'sector_delta_1', 'sector_delta_2', 'sector_delta_3',
            'driver_experience', 'constructor_form'
        ]
    
    def create_feature_vector(self, features_dict: Dict[str, Any]) -> np.ndarray:
        """
        Create feature vector from input dictionary
        """
        try:
            # Extract base features
            feature_vector = []
            
            # Basic features
            feature_vector.append(features_dict.get('race_id', 0))
            feature_vector.append(features_dict.get('driver_id', 0))
            feature_vector.append(features_dict.get('constructor_id', 0))
            feature_vector.append(features_dict.get('qualifying_position', 10))
            feature_vector.append(features_dict.get('last_3_laps_mean', 90000))
            
            # Sector deltas
            feature_vector.append(features_dict.get('sector_delta_1', 0))
            feature_vector.append(features_dict.get('sector_delta_2', 0))
            feature_vector.append(features_dict.get('sector_delta_3', 0))
            
            # Derived features
            driver_experience = self._calculate_driver_experience(
                features_dict.get('driver_id', 0)
            )
            feature_vector.append(driver_experience)
            
            constructor_form = self._calculate_constructor_form(
                features_dict.get('constructor_id', 0)
            )
            feature_vector.append(constructor_form)
            
            return np.array(feature_vector, dtype=np.float32)
            
        except Exception as e:
            logger.error(f"Error creating feature vector: {str(e)}")
            # Return default feature vector
            return np.zeros(len(self.feature_names), dtype=np.float32)
    
    def _calculate_driver_experience(self, driver_id: int) -> float:
        """
        Calculate driver experience score
        """
        # Mock calculation - replace with actual historical data
        experience_map = {
            1: 8.5,  # Verstappen
            2: 9.8,  # Hamilton
            3: 7.2,  # Leclerc
            4: 6.1,  # Russell
            5: 6.8,  # Norris
        }
        
        return experience_map.get(driver_id, 5.0)
    
    def _calculate_constructor_form(self, constructor_id: int) -> float:
        """
        Calculate constructor recent form
        """
        # Mock calculation - replace with actual performance data
        form_map = {
            1: 9.2,  # Red Bull
            2: 7.8,  # Mercedes
            3: 8.1,  # Ferrari
            4: 7.5,  # McLaren
        }
        
        return form_map.get(constructor_id, 6.0)
    
    def engineer_race_features(self, race_data: pd.DataFrame) -> pd.DataFrame:
        """
        Engineer features for race-level data
        """
        try:
            # Add circuit-specific features
            race_data['is_street_circuit'] = race_data['circuit_name'].isin([
                'Monaco', 'Singapore', 'Baku'
            ]).astype(int)
            
            # Add weather features (mock)
            race_data['weather_risk'] = np.random.uniform(0, 1, len(race_data))
            
            # Add temporal features
            race_data['days_since_last_race'] = 14  # Mock value
            race_data['season_round_normalized'] = race_data['round'] / 23
            
            return race_data
            
        except Exception as e:
            logger.error(f"Error engineering race features: {str(e)}")
            return race_data
    
    def engineer_driver_features(self, driver_data: pd.DataFrame) -> pd.DataFrame:
        """
        Engineer driver-specific features
        """
        try:
            # Calculate recent form (last 5 races)
            driver_data['recent_avg_finish'] = driver_data.groupby('driver_id')['position'].rolling(5).mean().reset_index(0, drop=True)
            
            # Calculate consistency
            driver_data['position_std'] = driver_data.groupby('driver_id')['position'].rolling(10).std().reset_index(0, drop=True)
            
            # DNF rate
            driver_data['dnf_rate'] = driver_data.groupby('driver_id')['dnf'].rolling(10).mean().reset_index(0, drop=True)
            
            return driver_data
            
        except Exception as e:
            logger.error(f"Error engineering driver features: {str(e)}")
            return driver_data
    
    def engineer_telemetry_features(self, telemetry_data: pd.DataFrame) -> pd.DataFrame:
        """
        Engineer features from telemetry data
        """
        try:
            # Calculate sector times
            telemetry_data['sector_1_time'] = telemetry_data.groupby(['driver_id', 'lap'])['sector_time_ms'].nth(0)
            telemetry_data['sector_2_time'] = telemetry_data.groupby(['driver_id', 'lap'])['sector_time_ms'].nth(1)
            telemetry_data['sector_3_time'] = telemetry_data.groupby(['driver_id', 'lap'])['sector_time_ms'].nth(2)
            
            # Calculate speed statistics
            telemetry_data['avg_speed'] = telemetry_data.groupby(['driver_id', 'lap'])['speed_kmh'].mean()
            telemetry_data['max_speed'] = telemetry_data.groupby(['driver_id', 'lap'])['speed_kmh'].max()
            telemetry_data['speed_variance'] = telemetry_data.groupby(['driver_id', 'lap'])['speed_kmh'].var()
            
            # Calculate track position variance (consistency)
            telemetry_data['track_pos_std'] = telemetry_data.groupby(['driver_id', 'lap'])[['track_pos_x', 'track_pos_y']].std().mean(axis=1)
            
            return telemetry_data
            
        except Exception as e:
            logger.error(f"Error engineering telemetry features: {str(e)}")
            return telemetry_data
    
    def get_feature_names(self) -> List[str]:
        """
        Get list of feature names
        """
        return self.feature_names.copy()
    
    def validate_features(self, features: np.ndarray) -> bool:
        """
        Validate feature vector
        """
        try:
            if len(features) != len(self.feature_names):
                logger.warning(f"Feature vector length mismatch: expected {len(self.feature_names)}, got {len(features)}")
                return False
            
            if np.any(np.isnan(features)):
                logger.warning("Feature vector contains NaN values")
                return False
            
            if np.any(np.isinf(features)):
                logger.warning("Feature vector contains infinite values")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating features: {str(e)}")
            return False