import pickle
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional
import logging
import os
from datetime import datetime

logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_names = {}
        self.model_metadata = {}
        self._load_models()
    
    def _load_models(self):
        """
        Load trained models from disk
        """
        try:
            models_path = "models/saved/"
            
            if os.path.exists(models_path):
                # Load position predictor
                self._load_model("position_predictor", models_path)
                # Load other models as needed
                
            else:
                logger.warning("Models directory not found, creating mock models")
                self._create_mock_models()
                
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            self._create_mock_models()
    
    def _load_model(self, model_name: str, models_path: str):
        """
        Load a specific model from disk
        """
        try:
            model_file = os.path.join(models_path, f"{model_name}.pkl")
            scaler_file = os.path.join(models_path, f"{model_name}_scaler.pkl")
            features_file = os.path.join(models_path, f"{model_name}_features.pkl")
            
            if os.path.exists(model_file):
                self.models[model_name] = joblib.load(model_file)
                logger.info(f"Loaded model: {model_name}")
                
                if os.path.exists(scaler_file):
                    self.scalers[model_name] = joblib.load(scaler_file)
                    
                if os.path.exists(features_file):
                    self.feature_names[model_name] = joblib.load(features_file)
                    
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {str(e)}")
    
    def _create_mock_models(self):
        """
        Create mock models for development
        """
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.preprocessing import StandardScaler
        
        # Create mock position predictor
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        
        # Generate mock training data
        X_mock = np.random.randn(1000, 10)  # 10 features
        y_mock = np.random.randint(1, 21, 1000)  # Positions 1-20
        
        model.fit(X_mock, y_mock)
        
        # Create scaler
        scaler = StandardScaler()
        scaler.fit(X_mock)
        
        # Store mock model
        self.models["position_predictor"] = model
        self.scalers["position_predictor"] = scaler
        self.feature_names["position_predictor"] = [
            f"feature_{i}" for i in range(10)
        ]
        
        self.model_metadata["position_predictor"] = {
            "created": datetime.now().isoformat(),
            "type": "RandomForestRegressor",
            "features": 10,
            "target": "finishing_position"
        }
        
        logger.info("Created mock models for development")
    
    def get_model(self, model_name: str):
        """
        Get a loaded model
        """
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        
        return self.models[model_name]
    
    def get_scaler(self, model_name: str):
        """
        Get scaler for a model
        """
        return self.scalers.get(model_name)
    
    def get_feature_names(self, model_name: str):
        """
        Get feature names for a model
        """
        return self.feature_names.get(model_name, [])
    
    def predict(self, model_name: str, features: np.ndarray) -> np.ndarray:
        """
        Make prediction with preprocessing
        """
        model = self.get_model(model_name)
        scaler = self.get_scaler(model_name)
        
        # Apply scaling if available
        if scaler is not None:
            features = scaler.transform(features.reshape(1, -1))
        else:
            features = features.reshape(1, -1)
        
        return model.predict(features)
    
    def get_model_status(self) -> Dict[str, Any]:
        """
        Get status of all loaded models
        """
        status = {}
        
        for model_name in self.models:
            status[model_name] = {
                "loaded": True,
                "type": type(self.models[model_name]).__name__,
                "features": len(self.feature_names.get(model_name, [])),
                "has_scaler": model_name in self.scalers,
                "metadata": self.model_metadata.get(model_name, {})
            }
        
        return status
    
    def save_model(self, model_name: str, model, scaler=None, feature_names=None):
        """
        Save a trained model to disk
        """
        try:
            models_path = "models/saved/"
            os.makedirs(models_path, exist_ok=True)
            
            # Save model
            model_file = os.path.join(models_path, f"{model_name}.pkl")
            joblib.dump(model, model_file)
            
            # Save scaler if provided
            if scaler is not None:
                scaler_file = os.path.join(models_path, f"{model_name}_scaler.pkl")
                joblib.dump(scaler, scaler_file)
            
            # Save feature names if provided
            if feature_names is not None:
                features_file = os.path.join(models_path, f"{model_name}_features.pkl")
                joblib.dump(feature_names, features_file)
            
            # Update in-memory storage
            self.models[model_name] = model
            if scaler is not None:
                self.scalers[model_name] = scaler
            if feature_names is not None:
                self.feature_names[model_name] = feature_names
            
            logger.info(f"Saved model: {model_name}")
            
        except Exception as e:
            logger.error(f"Error saving model {model_name}: {str(e)}")
            raise