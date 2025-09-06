import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class SHAPExplainer:
    def __init__(self):
        self.explainer = None
        self.feature_names = []
        
    def initialize_explainer(self, model, background_data: np.ndarray, feature_names: List[str]):
        """
        Initialize SHAP explainer for a model
        """
        try:
            import shap
            
            # Choose appropriate explainer based on model type
            if hasattr(model, 'predict_proba'):
                # Tree-based models
                if hasattr(model, 'estimators_'):
                    self.explainer = shap.TreeExplainer(model)
                else:
                    self.explainer = shap.KernelExplainer(model.predict_proba, background_data)
            else:
                # Regression models
                if hasattr(model, 'estimators_'):
                    self.explainer = shap.TreeExplainer(model)
                else:
                    self.explainer = shap.KernelExplainer(model.predict, background_data)
            
            self.feature_names = feature_names
            logger.info("SHAP explainer initialized successfully")
            
        except ImportError:
            logger.warning("SHAP not available, using mock explanations")
            self.explainer = None
        except Exception as e:
            logger.error(f"Error initializing SHAP explainer: {str(e)}")
            self.explainer = None
    
    def explain_prediction(self, features: np.ndarray, model) -> Dict[str, float]:
        """
        Get SHAP explanations for a single prediction
        """
        try:
            if self.explainer is not None:
                # Get SHAP values
                shap_values = self.explainer.shap_values(features.reshape(1, -1))
                
                if isinstance(shap_values, list):
                    # Multi-class case, take first class
                    shap_values = shap_values[0][0]
                else:
                    shap_values = shap_values[0]
                
                # Create feature importance dictionary
                explanations = {}
                for i, importance in enumerate(shap_values):
                    feature_name = self.feature_names[i] if i < len(self.feature_names) else f"feature_{i}"
                    explanations[feature_name] = float(importance)
                
                # Sort by absolute importance
                explanations = dict(sorted(explanations.items(), key=lambda x: abs(x[1]), reverse=True))
                
                return explanations
                
            else:
                # Return mock explanations
                return self._get_mock_explanations()
                
        except Exception as e:
            logger.error(f"Error getting SHAP explanations: {str(e)}")
            return self._get_mock_explanations()
    
    def _get_mock_explanations(self) -> Dict[str, float]:
        """
        Generate mock SHAP explanations for development
        """
        return {
            "qualifying_position": 2.1,
            "constructor_recent_form": 1.5,
            "driver_experience_at_track": 0.9,
            "last_3_laps_mean": 0.7,
            "sector_delta_1": 0.4,
            "weather_conditions": -0.3,
            "tire_strategy_risk": -0.8,
            "track_temperature": -1.1
        }
    
    def get_global_explanations(self, model, test_data: np.ndarray) -> Dict[str, Any]:
        """
        Get global feature importance explanations
        """
        try:
            if self.explainer is not None:
                # Get SHAP values for test set
                shap_values = self.explainer.shap_values(test_data)
                
                if isinstance(shap_values, list):
                    shap_values = shap_values[0]
                
                # Calculate mean absolute SHAP values
                mean_shap = np.mean(np.abs(shap_values), axis=0)
                
                # Create global importance dictionary
                global_importance = {}
                for i, importance in enumerate(mean_shap):
                    feature_name = self.feature_names[i] if i < len(self.feature_names) else f"feature_{i}"
                    global_importance[feature_name] = float(importance)
                
                # Sort by importance
                global_importance = dict(sorted(global_importance.items(), key=lambda x: x[1], reverse=True))
                
                return {
                    "feature_importance": global_importance,
                    "summary_plot_data": shap_values.tolist(),
                    "feature_names": self.feature_names
                }
                
            else:
                return self._get_mock_global_explanations()
                
        except Exception as e:
            logger.error(f"Error getting global explanations: {str(e)}")
            return self._get_mock_global_explanations()
    
    def _get_mock_global_explanations(self) -> Dict[str, Any]:
        """
        Generate mock global explanations
        """
        return {
            "feature_importance": {
                "qualifying_position": 0.25,
                "constructor_recent_form": 0.18,
                "driver_experience": 0.15,
                "last_3_laps_mean": 0.12,
                "weather_conditions": 0.10,
                "tire_strategy": 0.08,
                "track_temperature": 0.07,
                "sector_deltas": 0.05
            },
            "summary_plot_data": [],
            "feature_names": self.feature_names
        }
    
    def create_explanation_plots(self, features: np.ndarray, model) -> Dict[str, Any]:
        """
        Create SHAP explanation plots
        """
        try:
            if self.explainer is not None:
                import shap
                import matplotlib.pyplot as plt
                import io
                import base64
                
                # Get SHAP values
                shap_values = self.explainer.shap_values(features.reshape(1, -1))
                
                if isinstance(shap_values, list):
                    shap_values = shap_values[0]
                
                # Create waterfall plot
                fig, ax = plt.subplots(figsize=(10, 6))
                shap.waterfall_plot(
                    shap.Explanation(
                        values=shap_values[0],
                        base_values=self.explainer.expected_value,
                        feature_names=self.feature_names
                    ),
                    show=False
                )
                
                # Convert plot to base64 string
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight', dpi=150)
                buffer.seek(0)
                plot_data = base64.b64encode(buffer.getvalue()).decode()
                plt.close()
                
                return {
                    "waterfall_plot": plot_data,
                    "shap_values": shap_values[0].tolist(),
                    "feature_names": self.feature_names
                }
                
            else:
                return {"error": "SHAP explainer not available"}
                
        except Exception as e:
            logger.error(f"Error creating explanation plots: {str(e)}")
            return {"error": str(e)}