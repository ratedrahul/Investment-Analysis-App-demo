"""
Fund consistency analysis.

Consistency is defined as low volatility in monthly returns: a fund whose
returns stay close to its own average month after month is considered more
consistent than one with large swings.  We quantify this with the population
standard deviation of the 12 monthly return percentages.
"""

from __future__ import annotations

import csv
import math
from pathlib import Path
from typing import TypedDict

from django.conf import settings

MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
CSV_PATH: Path = settings.DATA_DIR / "funds.csv"


class FundStats(TypedDict):
    fund_name: str
    average_return: float
    volatility: float


class FundRanking(TypedDict):
    rank: int
    fund_name: str
    average_return: float
    volatility: float


class FundDetail(TypedDict):
    fund_name: str
    average_return: float
    volatility: float
    monthly_returns: list[float]


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_funds(path: Path = CSV_PATH) -> list[dict]:
    """Read the CSV file and return a list of row dicts with numeric returns.

    Each returned dict has the shape::

        {"fund_name": "Fund_12", "returns": [2.4, 2.1, ...]}
    """
    funds: list[dict] = []
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            returns = [float(row[m]) for m in MONTHS]
            funds.append({"fund_name": row["fund_name"], "returns": returns})
    return funds


# ---------------------------------------------------------------------------
# Statistical helpers
# ---------------------------------------------------------------------------

def mean(values: list[float]) -> float:
    """Arithmetic mean."""
    return sum(values) / len(values)


def std_dev(values: list[float]) -> float:
    """Population standard deviation.

    We use population (N) rather than sample (N-1) because the 12 monthly
    returns represent the complete observation period for each fund, not a
    sample drawn from a larger population.
    """
    avg = mean(values)
    variance = sum((v - avg) ** 2 for v in values) / len(values)
    return math.sqrt(variance)


# ---------------------------------------------------------------------------
# Analysis
# ---------------------------------------------------------------------------

def compute_fund_stats(fund: dict) -> FundStats:
    """Derive average return and volatility for a single fund."""
    returns = fund["returns"]
    return {
        "fund_name": fund["fund_name"],
        "average_return": round(mean(returns), 2),
        "volatility": round(std_dev(returns), 2),
    }


def get_fund_detail(fund_name: str) -> FundDetail | None:
    """Return detailed metrics for a single fund, or ``None`` if not found."""
    funds = load_funds()
    for fund in funds:
        if fund["fund_name"] == fund_name:
            returns = fund["returns"]
            return {
                "fund_name": fund["fund_name"],
                "average_return": round(mean(returns), 2),
                "volatility": round(std_dev(returns), 2),
                "monthly_returns": returns,
            }
    return None


def get_fund_rankings() -> list[FundRanking]:
    """Return all funds ranked by consistency (lowest volatility = rank 1)."""
    funds = load_funds()
    stats = [compute_fund_stats(f) for f in funds]
    stats.sort(key=lambda s: s["volatility"])
    return [
        {
            "rank": i + 1,
            "fund_name": s["fund_name"],
            "average_return": s["average_return"],
            "volatility": s["volatility"],
        }
        for i, s in enumerate(stats)
    ]


def get_all_fund_stats() -> list[FundStats]:
    """Return stats for every fund, sorted by lowest volatility first."""
    funds = load_funds()
    stats = [compute_fund_stats(f) for f in funds]
    stats.sort(key=lambda s: s["volatility"])
    return stats


def get_top_consistent_funds(n: int = 3) -> list[FundStats]:
    """Return the *n* most consistent funds, ranked by lowest volatility.

    Algorithm
    ---------
    1. Load every fund's 12 monthly returns from the CSV.
    2. For each fund compute the mean return and population standard deviation.
    3. Sort ascending by standard deviation (volatility).
    4. Return the first *n* entries — these are the most consistent funds.
    """
    funds = load_funds()
    stats = [compute_fund_stats(f) for f in funds]
    stats.sort(key=lambda s: s["volatility"])
    return stats[:n]
