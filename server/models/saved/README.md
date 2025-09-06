# Saved Models Directory

This directory contains trained ML models and their associated files for the SPiceZ-F1 application.

## Model Files:
- `lightgbm.pkl` - LightGBM trained model (MAE: ~2.9)
- `xgboost.pkl` - XGBoost trained model (MAE: ~4.0)
- `random_forest.pkl` - Random Forest trained model (MAE: ~2.7)
- `random_forest_scaler.pkl` - Feature scaler for Random Forest model
- `position_predictor.pkl` - Best performing model (currently Random Forest)
- `*_features.pkl` - Feature names lists used by each model

## Python Environment:
All models were trained using Python 3.11 with the following key dependencies:
- scikit-learn
- lightgbm
- xgboost
- catboost
- pandas
- numpy

## Training:
Models are trained using the `scripts/train_models.py` script in the server directory:
```bash
# Activate the Python 3.11 environment
.\.venv311\Scripts\Activate.ps1

# Run the training script
python scripts/train_models.py
```

## Model Serving:
The FastAPI server in `server/main.py` serves these models through the prediction service.