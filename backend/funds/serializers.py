from rest_framework import serializers


class FundStatsSerializer(serializers.Serializer):
    fund_name = serializers.CharField()
    average_return = serializers.FloatField()
    volatility = serializers.FloatField()


class FundRankingSerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    fund_name = serializers.CharField()
    average_return = serializers.FloatField()
    volatility = serializers.FloatField()


class FundDetailSerializer(serializers.Serializer):
    fund_name = serializers.CharField()
    average_return = serializers.FloatField()
    volatility = serializers.FloatField()
    monthly_returns = serializers.ListField(child=serializers.FloatField())
