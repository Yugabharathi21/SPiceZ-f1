#!/usr/bin/env python3
"""
Script to capture live F1 telemetry using FastF1
"""

import fastf1
import pandas as pd
import numpy as np
from datetime import datetime
import os
import logging
import argparse

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class F1TelemetryCapture:
    def __init__(self, output_dir="data/live_telemetry_saved"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
        # Enable FastF1 cache
        fastf1.Cache.enable_cache('cache')
        
    def capture_session(self, year: int, event: str, session: str):
        """
        Capture telemetry data for a specific session
        """
        try:
            logger.info(f"Loading session: {year} {event} {session}")
            
            # Load session
            session_obj = fastf1.get_session(year, event, session)
            session_obj.load()
            
            # Get session info
            session_info = {
                'session_id': f"{year}_{event}_{session}",
                'year': year,
                'event': event,
                'session_type': session,
                'date': session_obj.date,
                'total_laps': len(session_obj.laps)
            }
            
            logger.info(f"Session loaded: {session_info['total_laps']} laps")
            
            # Extract telemetry data
            telemetry_data = []
            
            for driver in session_obj.drivers:
                try:
                    driver_laps = session_obj.laps.pick_driver(driver)
                    
                    for lap_idx, lap in driver_laps.iterrows():
                        # Get telemetry for this lap
                        try:
                            lap_telemetry = lap.get_telemetry()
                            
                            # Sample telemetry data (reduce size)
                            if len(lap_telemetry) > 100:
                                sample_indices = np.linspace(0, len(lap_telemetry)-1, 100, dtype=int)
                                lap_telemetry = lap_telemetry.iloc[sample_indices]
                            
                            # Process telemetry points
                            for telem_idx, telem_point in lap_telemetry.iterrows():
                                telemetry_data.append({
                                    'session_id': session_info['session_id'],
                                    'timestamp': telem_point['Time'],
                                    'event_type': 'telemetry',
                                    'driverId': self._get_driver_id(driver),
                                    'raceId': self._get_race_id(year, event),
                                    'lap': lap['LapNumber'],
                                    'sector': self._get_sector(telem_point.get('Sector', 1)),
                                    'lap_time_ms': lap['LapTime'].total_seconds() * 1000 if pd.notna(lap['LapTime']) else None,
                                    'sector_time_ms': None,  # Would need sector timing data
                                    'speed_kmh': telem_point.get('Speed', 0),
                                    'track_pos_x': telem_point.get('X', 0),
                                    'track_pos_y': telem_point.get('Y', 0),
                                    'additional_json': {
                                        'throttle': telem_point.get('Throttle', 0),
                                        'brake': telem_point.get('Brake', 0),
                                        'gear': telem_point.get('nGear', 0),
                                        'rpm': telem_point.get('RPM', 0),
                                        'drs': telem_point.get('DRS', 0)
                                    }
                                })
                                
                        except Exception as e:
                            logger.warning(f"Error processing lap {lap['LapNumber']} for driver {driver}: {str(e)}")
                            continue
                            
                except Exception as e:
                    logger.warning(f"Error processing driver {driver}: {str(e)}")
                    continue
            
            # Convert to DataFrame
            df = pd.DataFrame(telemetry_data)
            
            if len(df) > 0:
                # Save as parquet
                output_file = os.path.join(
                    self.output_dir, 
                    f"{session_info['session_id']}_telemetry.parquet"
                )
                df.to_parquet(output_file, index=False)
                
                logger.info(f"Saved {len(df)} telemetry points to {output_file}")
                
                # Save session info
                info_file = os.path.join(
                    self.output_dir,
                    f"{session_info['session_id']}_info.json"
                )
                
                import json
                with open(info_file, 'w') as f:
                    json.dump(session_info, f, indent=2, default=str)
                
                return output_file
            else:
                logger.warning("No telemetry data captured")
                return None
                
        except Exception as e:
            logger.error(f"Error capturing session: {str(e)}")
            raise
    
    def _get_driver_id(self, driver_code: str) -> int:
        """
        Map driver code to driver ID (mock mapping)
        """
        driver_map = {
            'VER': 1, 'HAM': 2, 'LEC': 3, 'RUS': 4, 'NOR': 5,
            'PER': 6, 'SAI': 7, 'PIA': 8, 'ALO': 9, 'STR': 10,
            'TSU': 11, 'GAS': 12, 'OCO': 13, 'HUL': 14, 'MAG': 15,
            'RIC': 16, 'BOT': 17, 'ZHO': 18, 'ALB': 19, 'SAR': 20
        }
        return driver_map.get(driver_code, 999)
    
    def _get_race_id(self, year: int, event: str) -> int:
        """
        Generate race ID from year and event (mock)
        """
        return hash(f"{year}_{event}") % 10000
    
    def _get_sector(self, sector_value) -> int:
        """
        Get sector number
        """
        if pd.isna(sector_value):
            return 1
        return int(sector_value) if sector_value in [1, 2, 3] else 1
    
    def capture_live_session(self, year: int, event: str, session: str, interval: int = 30):
        """
        Capture live session data with periodic updates
        """
        logger.info(f"Starting live capture for {year} {event} {session}")
        
        import time
        
        while True:
            try:
                # Capture current session state
                output_file = self.capture_session(year, event, session)
                
                if output_file:
                    logger.info(f"Live capture update saved: {output_file}")
                
                # Wait for next update
                time.sleep(interval)
                
            except KeyboardInterrupt:
                logger.info("Live capture stopped by user")
                break
            except Exception as e:
                logger.error(f"Error in live capture: {str(e)}")
                time.sleep(interval)

def main():
    parser = argparse.ArgumentParser(description='Capture F1 telemetry data')
    parser.add_argument('--year', type=int, default=2024, help='Season year')
    parser.add_argument('--event', type=str, default='Monaco', help='Event name')
    parser.add_argument('--session', type=str, default='R', help='Session type (FP1, FP2, FP3, Q, R)')
    parser.add_argument('--live', action='store_true', help='Enable live capture mode')
    parser.add_argument('--interval', type=int, default=30, help='Live capture interval (seconds)')
    parser.add_argument('--output', type=str, default='data/live_telemetry_saved', help='Output directory')
    
    args = parser.parse_args()
    
    # Create capture instance
    capture = F1TelemetryCapture(args.output)
    
    try:
        if args.live:
            # Live capture mode
            capture.capture_live_session(args.year, args.event, args.session, args.interval)
        else:
            # Single capture
            output_file = capture.capture_session(args.year, args.event, args.session)
            if output_file:
                logger.info(f"Telemetry data saved to: {output_file}")
            else:
                logger.warning("No data captured")
                
    except Exception as e:
        logger.error(f"Capture failed: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())