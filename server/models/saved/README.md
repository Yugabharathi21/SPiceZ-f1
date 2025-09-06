# Saved Models Directory

This directory contains trained ML models and their associated files:

## Model Files:
- `{model_name}.pkl` - Trained model (joblib/pickle format)
- `{model_name}_scaler.pkl` - Feature scaler (StandardScaler, etc.)
- `{model_name}_features.pkl` - Feature names list
- `{model_name}_metadata.json` - Model metadata and training info

## Example Models:
- `position_predictor.pkl` - Main finishing position prediction model
- `lap_time_predictor.pkl` - Next lap time prediction model
- `retirement_predictor.pkl` - DNF probability model

## Training Scripts:
Place training notebooks/scripts in the parent `models/` directory.