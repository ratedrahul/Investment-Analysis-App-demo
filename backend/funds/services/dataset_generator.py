"""
Dataset generation service.

Creates a synthetic CSV of 100 investment funds with 12 monthly returns.
Funds are split across three volatility tiers to produce a realistic mix:

  - Low volatility  (30 funds): tight range around a positive mean
  - Medium volatility (40 funds): wider spread, occasionally negative
  - High volatility  (30 funds): large swings spanning [-5%, +8%]
"""

from __future__ import annotations

import csv
import random
from pathlib import Path

from django.conf import settings

MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
NUM_FUNDS = 100
MIN_RETURN = -5.0
MAX_RETURN = 8.0

VOLATILITY_PROFILES = [
    # (count, mean, std_dev)
    (30, 2.5, 0.4),
    (40, 1.8, 2.0),
    (30, 1.0, 3.5),
]


def _clamp(value: float, lo: float = MIN_RETURN, hi: float = MAX_RETURN) -> float:
    return max(lo, min(hi, value))


def _generate_monthly_returns(mean: float, std_dev: float) -> list[float]:
    return [round(_clamp(random.gauss(mean, std_dev)), 1) for _ in range(12)]


def generate_dataset(output_path: Path | None = None) -> int:
    """Generate a fresh funds CSV and return the number of funds written.

    Parameters
    ----------
    output_path : Path, optional
        Where to write the CSV.  Defaults to ``DATA_DIR / "funds.csv"``.

    Returns
    -------
    int
        The number of fund rows written (always 100).
    """
    if output_path is None:
        output_path = settings.DATA_DIR / "funds.csv"

    rows: list[list] = []
    fund_index = 1

    for count, mean, std_dev in VOLATILITY_PROFILES:
        for _ in range(count):
            name = f"Fund_{fund_index}"
            returns = _generate_monthly_returns(mean, std_dev)
            rows.append([name] + returns)
            fund_index += 1

    random.shuffle(rows)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["fund_name"] + MONTHS)
        writer.writerows(rows)

    return len(rows)
