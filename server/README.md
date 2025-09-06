# F1 Predictive Platform - Backend Server

FastAPI-based backend server for F1 race predictions and telemetry analysis.

## Features

- **Prediction API**: REST endpoints for race position predictions
- **Data Processing**: ETL pipeline for F1 historical data
- **Model Management**: Training and serving ML models (LightGBM, XGBoost, Random Forest)
- **SHAP Explanations**: Model interpretability and feature importance
- **Live Telemetry**: Integration with FastF1 for real-time data capture
- **Scalable Architecture**: Modular design with proper separation of concerns

## Quick Start

### 1. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Prepare Data

Place your F1 CSV datasets in the `data/` directory:
- circuits.csv, drivers.csv, constructors.csv, races.csv, results.csv, etc.

### 3. Train Models (Optional)

```bash
python scripts/train_models.py
```

### 4. Start Server

```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Test API

```bash
curl http://localhost:8000/health
curl http://localhost:8000/races/current
```

## API Endpoints

### Core Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /models/status` - Model status

### Prediction Endpoints

- `POST /predict` - Predict race finishing position
- `GET /drivers/{driver_id}/explanations` - SHAP explanations

### Data Endpoints

- `GET /races/current` - Current race information
- `GET /races/{race_id}/predictions` - Race predictions
- `GET /drivers/{driver_id}` - Driver information
- `GET /drivers/{driver_id}/performance` - Driver performance history
- `GET /races/{race_id}/lap-data` - Lap time data
- `GET /races/{race_id}/pit-data` - Pit stop data
- `GET /telemetry/{session_id}` - Live telemetry data

## Example Prediction Request

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "raceId": 1050,
    "driverId": 1,
    "constructorId": 1,
    "qualifying_position": 3,
    "live_last_3_laps_mean_ms": 78500,
    "live_last_3_sector_deltas_ms": [1200, -150, 350]
  }'
```

## Live Telemetry Capture

### Using FastF1

```bash
# Capture single session
python scripts/capture_telemetry.py --year 2024 --event Monaco --session R

# Live capture mode
python scripts/capture_telemetry.py --year 2024 --event Monaco --session R --live
```

### Example FastF1 Usage

```python
import fastf1

# Load session
session = fastf1.get_session(2024, 'Monaco', 'R')
session.load()

# Get telemetry
telemetry = session.laps.pick_drivers(['VER', 'HAM'])
telemetry.to_parquet('data/live_telemetry_saved/monaco_race.parquet')
```

## Model Training

The training pipeline supports multiple algorithms:

- **LightGBM**: Primary gradient boosting model
- **XGBoost**: Alternative gradient boosting
- **Random Forest**: Ensemble baseline
- **Neural Networks**: For large telemetry datasets

### Feature Engineering

- **Race Features**: Circuit characteristics, weather, session type
- **Driver Features**: Historical performance, experience, recent form
- **Constructor Features**: Team performance, reliability
- **Live Features**: Real-time lap times, sector deltas, pit strategy
- **Telemetry Features**: Speed profiles, consistency metrics

### Training Process

1. **Data Loading**: Join CSV datasets
2. **Feature Engineering**: Create predictive features
3. **Time-based Split**: Train on historical data, validate on recent
4. **Model Training**: Train multiple algorithms
5. **Model Selection**: Choose best performing model
6. **Model Saving**: Persist models with metadata

## Architecture

```
server/
├── main.py                 # FastAPI application
├── api/                    # API services
│   ├── prediction_service.py
│   └── data_service.py
├── models/                 # Model management
│   ├── model_manager.py
│   └── saved/             # Trained models
├── utils/                  # Utilities
│   ├── feature_engineering.py
│   └── shap_explainer.py
├── scripts/               # Training & data scripts
│   ├── train_models.py
│   └── capture_telemetry.py
└── data/                  # CSV datasets & telemetry
```

## Docker Deployment

```bash
# Build image
docker build -t f1-prediction-api .

# Run container
docker run -p 8000:8000 -v $(pwd)/data:/app/data f1-prediction-api
```

## Environment Variables

- `DATA_PATH`: Path to CSV datasets (default: "data/")
- `MODELS_PATH`: Path to saved models (default: "models/saved/")
- `LOG_LEVEL`: Logging level (default: "INFO")
- `CORS_ORIGINS`: Allowed CORS origins for frontend

## Performance Optimization

- **Model Caching**: Models loaded once at startup
- **Feature Caching**: Precomputed features for common requests
- **Async Processing**: Non-blocking API endpoints
- **Batch Predictions**: Support for multiple driver predictions
- **Connection Pooling**: Efficient database connections

## Monitoring & Logging

- **Health Checks**: Endpoint monitoring
- **Performance Metrics**: Response times, prediction accuracy
- **Error Tracking**: Comprehensive error logging
- **Model Drift**: Detection of prediction quality degradation

## Development

### Running Tests

```bash
pytest tests/
```

### Code Quality

```bash
black server/
flake8 server/
mypy server/
```

### Adding New Models

1. Implement model in `models/`
2. Add training logic in `scripts/train_models.py`
3. Update `model_manager.py` for loading
4. Add prediction endpoint in `main.py`

## Troubleshooting

### Common Issues

1. **Missing CSV Data**: Place datasets in `data/` directory
2. **Model Loading Errors**: Run training script first
3. **FastF1 Connection**: Check internet connection for live data
4. **Memory Issues**: Reduce telemetry sampling rate
5. **CORS Errors**: Update allowed origins in middleware

### Performance Tuning

- Increase worker processes for production
- Use Redis for caching frequent predictions
- Implement database connection pooling
- Optimize feature engineering pipeline