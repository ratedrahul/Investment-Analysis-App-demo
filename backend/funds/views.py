from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import FundDetailSerializer, FundRankingSerializer, FundStatsSerializer
from .services.analysis import (
    get_all_fund_stats,
    get_fund_detail,
    get_fund_rankings,
    get_top_consistent_funds,
)
from .services.dataset_generator import generate_dataset


@api_view(["GET"])
def api_root(request):
    """Entry point for the Investment Fund Analysis API.

    Returns a directory of all available endpoints so developers can
    discover the API without external documentation.
    """
    return Response({
        "message": "Investment Fund Analysis API",
        "endpoints": {
            "health": "/api/health/",
            "generate_dataset": "/api/funds/generate-dataset/",
            "top_consistent_funds": "/api/funds/top-consistent/",
            "all_funds": "/api/funds/all/",
            "fund_rankings": "/api/funds/rankings/",
            "fund_detail": "/api/funds/<fund_name>/",
        },
    })


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})


@api_view(["GET"])
def top_consistent_funds(request):
    """Return the top 3 most consistent funds ranked by lowest volatility."""
    stats = get_top_consistent_funds(n=3)
    serializer = FundStatsSerializer(stats, many=True)
    return Response({"funds": serializer.data})


@api_view(["GET"])
def all_funds(request):
    """Return every fund with its average return and volatility metrics."""
    stats = get_all_fund_stats()
    serializer = FundStatsSerializer(stats, many=True)
    return Response({"funds": serializer.data})


@api_view(["GET"])
def fund_rankings(request):
    """Return all funds ranked by consistency (lowest volatility first)."""
    rankings = get_fund_rankings()
    serializer = FundRankingSerializer(rankings, many=True)
    return Response({"funds": serializer.data})


@api_view(["POST"])
def generate_dataset_view(request):
    """Generate a fresh 100-fund CSV dataset and save it to disk."""
    fund_count = generate_dataset()
    return Response({"status": "success", "fund_count": fund_count})


@api_view(["GET"])
def fund_detail(request, fund_name):
    """Return detailed metrics for a single fund."""
    detail = get_fund_detail(fund_name)
    if detail is None:
        return Response(
            {"error": f"Fund '{fund_name}' not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    serializer = FundDetailSerializer(detail)
    return Response(serializer.data)
