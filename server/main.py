from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime
import logging

from api.prediction_service import PredictionService
from api.data_service import DataService
from models.model_manager import ModelManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="F1 Predictive Platform API",
    description="REST API for F1 race predictions and telemetry data",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
prediction_service = PredictionService()
data_service = DataService()
model_manager = ModelManager()

# Pydantic models for request/response
class PredictionRequest(BaseModel):
    raceId: int
    driverId: int
    constructorId: int
    qualifying_position: Optional[int] = None
    live_last_3_laps_mean_ms: Optional[int] = None
    live_last_3_sector_deltas_ms: Optional[List[int]] = None
    precomputed_features: Optional[Dict[str, Any]] = None

class FeatureContribution(BaseModel):
    feature: str
    contribution: float

class PredictionResponse(BaseModel):
    predicted_position: float
    predicted_rank_probs: Optional[List[float]] = None
    confidence: float
    explanations: Dict[str, List[FeatureContribution]]

class DriverInfo(BaseModel):
    driverId: int
    forename: str
    surname: str
    code: str
    nationality: str
    dob: str
    number: Optional[int] = None

class RaceInfo(BaseModel):
    raceId: int
    name: str
    date: str
    time: Optional[str] = None
    location: str
    round: int
    circuit: Dict[str, Any]

@app.get("/")
async def root():
    return {"message": "F1 Predictive Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/predict", response_model=PredictionResponse)
async def predict_race_position(request: PredictionRequest):
    """
    Predict finishing position for a driver in a race
    """
    try:
        logger.info(f"Prediction request for driver {request.driverId} in race {request.raceId}")
        
        # Get prediction from service
        prediction = await prediction_service.predict_position(request)
        
        return PredictionResponse(**prediction)
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/races/current", response_model=RaceInfo)
async def get_current_race():
    """
    Get current/next race information
    """
    try:
        race_data = await data_service.get_current_race()
        return RaceInfo(**race_data)
    except Exception as e:
        logger.error(f"Error getting current race: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/races/{race_id}/predictions")
async def get_race_predictions(race_id: int):
    """
    Get predictions for all drivers in a race
    """
    try:
        predictions = await data_service.get_race_predictions(race_id)
        return {"predictions": predictions}
    except Exception as e:
        logger.error(f"Error getting race predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/drivers/{driver_id}", response_model=DriverInfo)
async def get_driver(driver_id: int):
    """
    Get driver information
    """
    try:
        driver_data = await data_service.get_driver(driver_id)
        return DriverInfo(**driver_data)
    except Exception as e:
        logger.error(f"Error getting driver {driver_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Driver not found")

@app.get("/drivers/{driver_id}/performance")
async def get_driver_performance(driver_id: int, limit: int = 10):
    """
    Get driver performance history
    """
    try:
        performance = await data_service.get_driver_performance(driver_id, limit)
        return {"performance": performance}
    except Exception as e:
        logger.error(f"Error getting driver performance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/drivers/{driver_id}/explanations")
async def get_driver_explanations(driver_id: int, race_id: Optional[int] = None):
    """
    Get SHAP explanations for driver predictions
    """
    try:
        explanations = await prediction_service.get_driver_explanations(driver_id, race_id)
        return {"explanations": explanations}
    except Exception as e:
        logger.error(f"Error getting explanations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/races/{race_id}/lap-data")
async def get_lap_data(race_id: int):
    """
    Get lap time data for a race
    """
    try:
        lap_data = await data_service.get_lap_data(race_id)
        return {"lap_data": lap_data}
    except Exception as e:
        logger.error(f"Error getting lap data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/races/{race_id}/pit-data")
async def get_pit_data(race_id: int):
    """
    Get pit stop data for a race
    """
    try:
        pit_data = await data_service.get_pit_data(race_id)
        return {"pit_data": pit_data}
    except Exception as e:
        logger.error(f"Error getting pit data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/races/{race_id}/confidence-stream")
async def get_confidence_stream(race_id: int):
    """
    Get confidence stream data for live predictions
    """
    try:
        confidence_data = await data_service.get_confidence_stream(race_id)
        return {"confidence_data": confidence_data}
    except Exception as e:
        logger.error(f"Error getting confidence stream: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/telemetry/{session_id}")
async def get_telemetry_data(session_id: str, driver_id: Optional[int] = None):
    """
    Get live telemetry data for a session
    """
    try:
        telemetry = await data_service.get_telemetry_data(session_id, driver_id)
        return {"telemetry": telemetry}
    except Exception as e:
        logger.error(f"Error getting telemetry: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/status")
async def get_model_status():
    """
    Get status of loaded models
    """
    try:
        status = model_manager.get_model_status()
        return {"model_status": status}
    except Exception as e:
        logger.error(f"Error getting model status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )