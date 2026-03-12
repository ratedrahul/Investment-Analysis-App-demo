"""
Generate a synthetic dataset of 100 investment funds with 12 months of returns.

Funds are split into three volatility tiers so that the resulting dataset
contains a realistic mix of stable, moderate, and volatile instruments:

  - Low volatility  (30 funds): tight range around a positive mean
  - Medium volatility (40 funds): wider spread, occasionally negative
  - High volatility  (30 funds): large swings spanning the full [-5, +8] range
"""

import csv
import os
import random

MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
NUM_FUNDS = 100
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "funds.csv")

VOLATILITY_PROFILES = [
    # (count, mean, std_dev, label)
    (30, 2.5, 0.4, "low"),
    (40, 1.8, 2.0, "medium"),
    (30, 1.0, 3.5, "high"),
]

MIN_RETURN = -5.0
MAX_RETURN = 8.0


def clamp(value, lo=MIN_RETURN, hi=MAX_RETURN):
    return max(lo, min(hi, value))


def generate_monthly_returns(mean, std_dev):
    return [round(clamp(random.gauss(mean, std_dev)), 1) for _ in range(12)]


def main():
    random.seed(42)

    rows = []
    fund_index = 1

    for count, mean, std_dev, _label in VOLATILITY_PROFILES:
        for _ in range(count):
            name = f"Fund_{fund_index}"
            returns = generate_monthly_returns(mean, std_dev)
            rows.append([name] + returns)
            fund_index += 1

    random.shuffle(rows)

    with open(OUTPUT_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["fund_name"] + MONTHS)
        writer.writerows(rows)

    print(f"Generated {len(rows)} funds → {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
