from django.core.cache import cache

from rest_framework import serializers as drf_serializers
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, inline_serializer

from .serializers import FundDetailSerializer, FundRankingSerializer, FundStatsSerializer
from .services.analysis import (
    get_all_fund_stats,
    get_fund_detail,
    get_fund_rankings,
    get_top_consistent_funds,
)
from .services.dataset_generator import generate_dataset

CACHE_TTL = 60  # seconds
ANALYSIS_CACHE_KEYS = [
    "funds:top_consistent",
    "funds:all",
    "funds:rankings",
]


def _clear_analysis_cache():
    """Remove all cached analysis results (called after dataset regeneration)."""
    cache.delete_many(ANALYSIS_CACHE_KEYS)


@extend_schema(
    summary="API root",
    description="Returns a directory of all available endpoints.",
    responses={200: dict},
    tags=["General"],
)
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
            "schema": "/api/schema/",
            "docs": "/api/docs/",
        },
    })


@extend_schema(
    summary="Health check",
    description="Simple liveness probe that returns {\"status\": \"ok\"}.",
    responses={200: inline_serializer("HealthResponse", fields={
        "status": drf_serializers.CharField(),
    })},
    tags=["General"],
)
@api_view(["GET"])
def health_check(request):
    """Simple liveness probe for monitoring."""
    return Response({"status": "ok"})


@extend_schema(
    summary="Top consistent funds",
    description=(
        "Return the top 3 most consistent funds ranked by lowest volatility "
        "(standard deviation of monthly returns)."
    ),
    responses={200: inline_serializer("TopFundsResponse", fields={
        "funds": FundStatsSerializer(many=True),
    })},
    tags=["Fund Analysis"],
)
@api_view(["GET"])
def top_consistent_funds(request):
    """Return the top 3 most consistent funds ranked by lowest volatility."""
    result = cache.get("funds:top_consistent")
    if result is None:
        stats = get_top_consistent_funds(n=3)
        result = {"funds": FundStatsSerializer(stats, many=True).data}
        cache.set("funds:top_consistent", result, CACHE_TTL)
    return Response(result)


@extend_schema(
    summary="All funds",
    description="Return every fund with its average return and volatility, sorted by volatility ascending.",
    responses={200: inline_serializer("AllFundsResponse", fields={
        "funds": FundStatsSerializer(many=True),
    })},
    tags=["Fund Analysis"],
)
@api_view(["GET"])
def all_funds(request):
    """Return every fund with its average return and volatility metrics."""
    result = cache.get("funds:all")
    if result is None:
        stats = get_all_fund_stats()
        result = {"funds": FundStatsSerializer(stats, many=True).data}
        cache.set("funds:all", result, CACHE_TTL)
    return Response(result)


@extend_schema(
    summary="Fund rankings",
    description="Return all funds ranked by consistency (lowest volatility = rank 1).",
    responses={200: inline_serializer("RankingsResponse", fields={
        "funds": FundRankingSerializer(many=True),
    })},
    tags=["Fund Analysis"],
)
@api_view(["GET"])
def fund_rankings(request):
    """Return all funds ranked by consistency (lowest volatility first)."""
    result = cache.get("funds:rankings")
    if result is None:
        rankings = get_fund_rankings()
        result = {"funds": FundRankingSerializer(rankings, many=True).data}
        cache.set("funds:rankings", result, CACHE_TTL)
    return Response(result)


@extend_schema(
    summary="Generate dataset",
    description=(
        "Generate a fresh CSV dataset of 100 investment funds with 12 monthly "
        "returns each. Values range from -5% to +8% with a mix of low, medium, "
        "and high volatility profiles. Overwrites the existing data file."
    ),
    request=None,
    responses={200: inline_serializer("GenerateResponse", fields={
        "status": drf_serializers.CharField(),
        "fund_count": drf_serializers.IntegerField(),
    })},
    tags=["Dataset"],
)
@api_view(["POST"])
def generate_dataset_view(request):
    """Generate a fresh 100-fund CSV dataset and save it to disk."""
    fund_count = generate_dataset()
    _clear_analysis_cache()
    return Response({"status": "success", "fund_count": fund_count})


@extend_schema(
    summary="Fund detail",
    description=(
        "Return detailed metrics for a single fund including its 12 monthly "
        "return values, average return, and volatility score."
    ),
    responses={
        200: FundDetailSerializer,
        404: inline_serializer("FundNotFoundResponse", fields={
            "error": drf_serializers.CharField(),
        }),
    },
    tags=["Fund Analysis"],
)
@api_view(["GET"])
def fund_detail(request, fund_name):
    """Return detailed metrics for a single fund including monthly returns."""
    detail = get_fund_detail(fund_name)
    if detail is None:
        return Response(
            {"error": f"Fund '{fund_name}' not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    serializer = FundDetailSerializer(detail)
    return Response(serializer.data)
