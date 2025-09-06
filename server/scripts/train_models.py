#!/usr/bin/env python3
"""
Training script for F1 prediction models
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GroupKFold
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import lightgbm as lgb
import xgboost as xgb
import joblib
import logging
import os
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class F1ModelTrainer:
    def __init__(self, data_path="data/"):
        self.data_path = data_path
        self.models = {}
        self.scalers = {}
        self.feature_names = {}
        
    def load_data(self):
        """
        Load and join F1 datasets
        """
        logger.info("Loading F1 datasets...")
        
        try:
            # Load core datasets
            self.results = pd.read_csv(os.path.join(self.data_path, "results.csv"))
            self.races = pd.read_csv(os.path.join(self.data_path, "races.csv"))
            self.drivers = pd.read_csv(os.path.join(self.data_path, "drivers.csv"))
            self.constructors = pd.read_csv(os.path.join(self.data_path, "constructors.csv"))
            self.circuits = pd.read_csv(os.path.join(self.data_path, "circuits.csv"))
            self.qualifying = pd.read_csv(os.path.join(self.data_path, "qualifying.csv"))
            
            # Optional datasets
            try:
                self.lap_times = pd.read_csv(os.path.join(self.data_path, "lap_times.csv"))
                self.pit_stops = pd.read_csv(os.path.join(self.data_path, "pit_stops.csv"))
            except FileNotFoundError:
                logger.warning("Lap times or pit stops data not found")
                self.lap_times = pd.DataFrame()
                self.pit_stops = pd.DataFrame()
            
            logger.info("Data loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise
    
    def engineer_features(self):
        """
        Engineer features for model training
        """
        logger.info("Engineering features...")
        
        # Join main datasets
        df = self.results.merge(self.races, on='raceId', how='left')
        df = df.merge(self.drivers, on='driverId', how='left')
        df = df.merge(self.constructors, on='constructorId', how='left')
        df = df.merge(self.circuits, on='circuitId', how='left')
        
        # Add qualifying data
        qualifying_features = self.qualifying.groupby(['raceId', 'driverId']).agg({
            'position': 'first',
            'q1': lambda x: pd.to_numeric(x.replace('\\N', np.nan), errors='coerce').first(),
            'q2': lambda x: pd.to_numeric(x.replace('\\N', np.nan), errors='coerce').first(),
            'q3': lambda x: pd.to_numeric(x.replace('\\N', np.nan), errors='coerce').first()
        }).reset_index()
        
        qualifying_features.columns = ['raceId', 'driverId', 'qualifying_position', 'q1_time', 'q2_time', 'q3_time']
        df = df.merge(qualifying_features, on=['raceId', 'driverId'], how='left')
        
        # Add lap time features if available
        if not self.lap_times.empty:
            lap_features = self.lap_times.groupby(['raceId', 'driverId']).agg({
                'milliseconds': ['mean', 'std', 'min', 'count']
            }).reset_index()
            lap_features.columns = ['raceId', 'driverId', 'avg_lap_time', 'lap_time_std', 'fastest_lap', 'lap_count']
            df = df.merge(lap_features, on=['raceId', 'driverId'], how='left')
        
        # Add pit stop features if available
        if not self.pit_stops.empty:
            pit_features = self.pit_stops.groupby(['raceId', 'driverId']).agg({
                'stop': 'count',
                'milliseconds': 'sum'
            }).reset_index()
            pit_features.columns = ['raceId', 'driverId', 'pit_count', 'total_pit_time']
            df = df.merge(pit_features, on=['raceId', 'driverId'], how='left')
        
        # Create target variable (finishing position)
        df['target_position'] = pd.to_numeric(df['positionOrder'], errors='coerce')
        
        # Filter valid positions
        df = df[df['target_position'].notna()]
        df = df[df['target_position'] > 0]
        
        # Create features
        feature_columns = [
            'year', 'round', 'circuitId', 'driverId', 'constructorId',
            'qualifying_position', 'grid'
        ]
        
        # Add lap time features if available
        if not self.lap_times.empty:
            feature_columns.extend(['avg_lap_time', 'lap_time_std', 'fastest_lap', 'lap_count'])
        
        # Add pit features if available
        if not self.pit_stops.empty:
            feature_columns.extend(['pit_count', 'total_pit_time'])
        
        # Fill missing values
        for col in feature_columns:
            if col in df.columns:
                if df[col].dtype in ['float64', 'int64']:
                    df[col] = df[col].fillna(df[col].median())
                else:
                    df[col] = df[col].fillna(0)
        
        # Create historical features
        df = df.sort_values(['driverId', 'year', 'round'])
        
        # Driver recent form (last 5 races)
        df['driver_recent_avg'] = df.groupby('driverId')['target_position'].rolling(5, min_periods=1).mean().reset_index(0, drop=True)
        
        # Constructor recent form
        df['constructor_recent_avg'] = df.groupby('constructorId')['target_position'].rolling(5, min_periods=1).mean().reset_index(0, drop=True)
        
        # Driver experience (race count)
        df['driver_experience'] = df.groupby('driverId').cumcount() + 1
        
        self.feature_data = df
        self.feature_columns = [col for col in feature_columns if col in df.columns] + [
            'driver_recent_avg', 'constructor_recent_avg', 'driver_experience'
        ]
        
        logger.info(f"Feature engineering complete. Features: {len(self.feature_columns)}")
        
    def prepare_training_data(self):
        """
        Prepare data for training with time-based split
        """
        logger.info("Preparing training data...")
        
        # Remove rows with missing target
        df = self.feature_data.dropna(subset=['target_position'])
        
        # Time-based split (train on earlier years, test on recent)
        train_years = df['year'].unique()
        split_year = np.percentile(train_years, 80)  # 80% for training
        
        train_mask = df['year'] <= split_year
        
        X = df[self.feature_columns].values
        y = df['target_position'].values
        race_groups = df['raceId'].values
        
        X_train = X[train_mask]
        X_test = X[~train_mask]
        y_train = y[train_mask]
        y_test = y[~train_mask]
        
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.y_test = y_test
        self.race_groups = race_groups
        
        logger.info(f"Training data: {X_train.shape}, Test data: {X_test.shape}")
        
    def train_lightgbm(self):
        """
        Train LightGBM model
        """
        logger.info("Training LightGBM model...")
        
        # Create datasets
        train_data = lgb.Dataset(self.X_train, label=self.y_train)
        
        # Parameters
        params = {
            'objective': 'regression',
            'metric': 'mae',
            'boosting_type': 'gbdt',
            'num_leaves': 31,
            'learning_rate': 0.05,
            'feature_fraction': 0.9,
            'bagging_fraction': 0.8,
            'bagging_freq': 5,
            'verbose': -1
        }
        
        # Train model
        model = lgb.train(
            params,
            train_data,
            num_boost_round=1000,
            valid_sets=[train_data],
            callbacks=[lgb.early_stopping(100), lgb.log_evaluation(0)]
        )
        
        # Evaluate
        y_pred = model.predict(self.X_test)
        mae = mean_absolute_error(self.y_test, y_pred)
        r2 = r2_score(self.y_test, y_pred)
        
        logger.info(f"LightGBM - MAE: {mae:.3f}, R2: {r2:.3f}")
        
        self.models['lightgbm'] = model
        
    def train_xgboost(self):
        """
        Train XGBoost model
        """
        logger.info("Training XGBoost model...")
        
        # Parameters
        params = {
            'objective': 'reg:squarederror',
            'eval_metric': 'mae',
            'max_depth': 6,
            'learning_rate': 0.05,
            'subsample': 0.8,
            'colsample_bytree': 0.8,
            'random_state': 42
        }
        
        # Create DMatrix
        dtrain = xgb.DMatrix(self.X_train, label=self.y_train)
        dtest = xgb.DMatrix(self.X_test, label=self.y_test)
        
        # Train model
        model = xgb.train(
            params,
            dtrain,
            num_boost_round=1000,
            evals=[(dtrain, 'train')],
            early_stopping_rounds=100,
            verbose_eval=False
        )
        
        # Evaluate
        y_pred = model.predict(dtest)
        mae = mean_absolute_error(self.y_test, y_pred)
        r2 = r2_score(self.y_test, y_pred)
        
        logger.info(f"XGBoost - MAE: {mae:.3f}, R2: {r2:.3f}")
        
        self.models['xgboost'] = model
        
    def train_random_forest(self):
        """
        Train Random Forest model
        """
        logger.info("Training Random Forest model...")
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(self.X_train)
        X_test_scaled = scaler.transform(self.X_test)
        
        # Train model
        model = RandomForestRegressor(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X_train_scaled, self.y_train)
        
        # Evaluate
        y_pred = model.predict(X_test_scaled)
        mae = mean_absolute_error(self.y_test, y_pred)
        r2 = r2_score(self.y_test, y_pred)
        
        logger.info(f"Random Forest - MAE: {mae:.3f}, R2: {r2:.3f}")
        
        self.models['random_forest'] = model
        self.scalers['random_forest'] = scaler
        
    def save_models(self):
        """
        Save trained models
        """
        logger.info("Saving models...")
        
        models_dir = "models/saved"
        os.makedirs(models_dir, exist_ok=True)
        
        for model_name, model in self.models.items():
            # Save model
            model_path = os.path.join(models_dir, f"{model_name}.pkl")
            joblib.dump(model, model_path)
            
            # Save scaler if exists
            if model_name in self.scalers:
                scaler_path = os.path.join(models_dir, f"{model_name}_scaler.pkl")
                joblib.dump(self.scalers[model_name], scaler_path)
            
            # Save feature names
            features_path = os.path.join(models_dir, f"{model_name}_features.pkl")
            joblib.dump(self.feature_columns, features_path)
            
            logger.info(f"Saved {model_name} model")
        
        # Save best model as position_predictor
        best_model_name = 'lightgbm'  # Choose best performing model
        best_model_path = os.path.join(models_dir, "position_predictor.pkl")
        joblib.dump(self.models[best_model_name], best_model_path)
        
        if best_model_name in self.scalers:
            best_scaler_path = os.path.join(models_dir, "position_predictor_scaler.pkl")
            joblib.dump(self.scalers[best_model_name], best_scaler_path)
        
        best_features_path = os.path.join(models_dir, "position_predictor_features.pkl")
        joblib.dump(self.feature_columns, best_features_path)
        
        logger.info("Model training and saving complete!")

def main():
    """
    Main training pipeline
    """
    trainer = F1ModelTrainer()
    
    try:
        # Load and prepare data
        trainer.load_data()
        trainer.engineer_features()
        trainer.prepare_training_data()
        
        # Train models
        trainer.train_lightgbm()
        trainer.train_xgboost()
        trainer.train_random_forest()
        
        # Save models
        trainer.save_models()
        
        logger.info("Training pipeline completed successfully!")
        
    except Exception as e:
        logger.error(f"Training pipeline failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()