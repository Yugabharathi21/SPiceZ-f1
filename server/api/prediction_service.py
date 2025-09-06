import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime

from models.model_manager import ModelManager
from utils.feature_engineering import FeatureEngineer
from utils.shap_explainer import SHAPExplainer

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model_manager = ModelManager()
        self.feature_engineer = FeatureEngineer()
        self.shap_explainer = SHAPExplainer()
        
    async def predict_position(self, request) -> Dict[str, Any]:
        """
        Predict finishing position for a driver
        """
        try:
            # Extract features from request
            features = await self._extract_features(request)
            
            # Get model prediction
            model = self.model_manager.get_model('position_predictor')
            prediction = model.predict([features])[0]
            
            # Calculate confidence
            confidence = await self._calculate_confidence(features, model)
            
            # Get SHAP explanations
            explanations = await self._get_explanations(features, model)
            
            # Generate rank probabilities (optional)
            rank_probs = await self._generate_rank_probabilities(features, model)
            
            return {
                "predicted_position": float(prediction),
                "predicted_rank_probs": rank_probs,
                "confidence": float(confidence),
                "explanations": explanations
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise
    
    async def _extract_features(self, request) -> np.ndarray:
        """
        Extract and engineer features from request
        """
        # Mock feature extraction - replace with actual feature engineering
        features = {
            'race_id': request.raceId,
            'driver_id': request.driverId,
            'constructor_id': request.constructorId,
            'qualifying_position': request.qualifying_position or 10,
            'last_3_laps_mean': request.live_last_3_laps_mean_ms or 90000,
            'sector_delta_1': request.live_last_3_sector_deltas_ms[0] if request.live_last_3_sector_deltas_ms else 0,
            'sector_delta_2': request.live_last_3_sector_deltas_ms[1] if request.live_last_3_sector_deltas_ms else 0,
            'sector_delta_3': request.live_last_3_sector_deltas_ms[2] if request.live_last_3_sector_deltas_ms else 0,
        }
        
        # Use feature engineer to create full feature vector
        feature_vector = self.feature_engineer.create_feature_vector(features)
        
        return feature_vector
    
    async def _calculate_confidence(self, features: np.ndarray, model) -> float:
        """
        Calculate prediction confidence
        """
        # Mock confidence calculation - replace with actual uncertainty estimation
        base_confidence = 0.75
        
        # Adjust based on feature quality
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba([features])[0]
            confidence = float(np.max(proba))
        else:
            # For regression models, use prediction variance or ensemble disagreement
            confidence = base_confidence + np.random.normal(0, 0.1)
            confidence = np.clip(confidence, 0.3, 0.95)
        
        return confidence
    
    async def _get_explanations(self, features: np.ndarray, model) -> Dict[str, List[Dict[str, Any]]]:
        """
        Get SHAP explanations for prediction
        """
        try:
            explanations = self.shap_explainer.explain_prediction(features, model)
            
            return {
                "top_features": [
                    {"feature": feat, "contribution": float(contrib)}
                    for feat, contrib in explanations.items()
                ]
            }
        except Exception as e:
            logger.warning(f"SHAP explanation failed: {str(e)}")
            # Return mock explanations
            return {
                "top_features": [
                    {"feature": "qualifying_position", "contribution": 2.1},
                    {"feature": "constructor_recent_form", "contribution": 1.5},
                    {"feature": "driver_experience_at_track", "contribution": 0.9},
                    {"feature": "weather_conditions", "contribution": -0.3},
                    {"feature": "tire_strategy_risk", "contribution": -0.8}
                ]
            }
    
    async def _generate_rank_probabilities(self, features: np.ndarray, model) -> Optional[List[float]]:
        """
        Generate probability distribution over finishing positions
        """
        try:
            if hasattr(model, 'predict_proba'):
                probs = model.predict_proba([features])[0]
                return probs.tolist()
            else:
                # For regression models, create probability distribution around prediction
                prediction = model.predict([features])[0]
                probs = np.zeros(20)  # Assume max 20 positions
                
                # Create normal distribution around prediction
                for i in range(20):
                    probs[i] = np.exp(-0.5 * ((i + 1 - prediction) / 2.0) ** 2)
                
                # Normalize
                probs = probs / np.sum(probs)
                return probs.tolist()
                
        except Exception as e:
            logger.warning(f"Rank probability generation failed: {str(e)}")
            return None
    
    async def get_driver_explanations(self, driver_id: int, race_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Get SHAP explanations for a specific driver
        """
        try:
            # Mock explanations - replace with actual SHAP analysis
            explanations = [
                {"feature": "Qualifying Position", "contribution": 2.3},
                {"feature": "Recent Form", "contribution": 1.8},
                {"feature": "Circuit Performance", "contribution": 1.2},
                {"feature": "Constructor Pace", "contribution": 0.9},
                {"feature": "Weather Conditions", "contribution": -0.4},
                {"feature": "Tire Strategy", "contribution": -0.7},
                {"feature": "Track Temperature", "contribution": -1.1},
            ]
            
            return explanations
            
        except Exception as e:
            logger.error(f"Error getting driver explanations: {str(e)}")
            raise