# Data Directory

Place your F1 CSV datasets in this directory:

## Required Files:
- circuits.csv
- constructor_results.csv
- constructor_standings.csv
- constructors.csv
- driver_standings.csv
- drivers.csv
- lap_times.csv
- pit_stops.csv
- qualifying.csv
- races.csv
- results.csv
- seasons.csv
- sprint_results.csv
- status.csv

## Live Telemetry:
- Create a `live_telemetry_saved/` subdirectory for parquet/pickle files
- Use FastF1 to capture and save live timing data

## Example FastF1 Usage:
```python
import fastf1
import pandas as pd

# Load session
session = fastf1.get_session(2024, 'Monaco', 'R')
session.load()

# Save telemetry data
telemetry = session.laps.pick_drivers(['VER', 'HAM', 'LEC'])
telemetry.to_parquet('live_telemetry_saved/monaco_2024_race.parquet')
```