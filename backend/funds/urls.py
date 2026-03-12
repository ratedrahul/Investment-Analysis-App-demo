from django.urls import path

from . import views

urlpatterns = [
    path("", views.api_root, name="api-root"),
    path("health/", views.health_check, name="health-check"),
    path("funds/top-consistent/", views.top_consistent_funds, name="top-consistent-funds"),
    path("funds/all/", views.all_funds, name="all-funds"),
    path("funds/rankings/", views.fund_rankings, name="fund-rankings"),
    path("funds/generate-dataset/", views.generate_dataset_view, name="generate-dataset"),
    path("funds/export/", views.export_rankings, name="export-rankings"),
    path("funds/<str:fund_name>/", views.fund_detail, name="fund-detail"),
]
