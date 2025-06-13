'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Prediction, TrendData } from '@/lib/types/analytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, TrendingUp } from 'lucide-react';

// Mock data - replace with API calls
const mockPredictions: Prediction[] = [
  {
    id: '1',
    metric: 'Claim Volume',
    value: 150,
    confidence: 0.85,
    lowerBound: 130,
    upperBound: 170,
    timestamp: '2024-03-15T10:00:00Z',
    horizon: 'short',
  },
  {
    id: '2',
    metric: 'Average Processing Time',
    value: 2.3,
    confidence: 0.75,
    lowerBound: 2.0,
    upperBound: 2.6,
    timestamp: '2024-03-15T10:00:00Z',
    horizon: 'medium',
  },
];

const mockTrendData: TrendData = {
  id: '1',
  metric: 'Claim Volume',
  period: 'daily',
  startDate: '2024-02-15T00:00:00Z',
  endDate: '2024-03-15T00:00:00Z',
  values: [
    { timestamp: '2024-02-15T00:00:00Z', value: 120 },
    { timestamp: '2024-02-22T00:00:00Z', value: 130 },
    { timestamp: '2024-03-01T00:00:00Z', value: 140 },
    { timestamp: '2024-03-08T00:00:00Z', value: 145 },
    { timestamp: '2024-03-15T00:00:00Z', value: 150 },
  ],
};

const horizonColors = {
  short: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  long: 'bg-purple-100 text-purple-800',
};

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [trendData, setTrendData] = useState<TrendData>(mockTrendData);

  const handleRefresh = async () => {
    // TODO: Implement API call to refresh data
    // For now, just simulate a refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    // TODO: Implement export functionality
    console.log(`Exporting to ${format}...`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Predictive Analytics</h1>
          <p className="text-muted-foreground">
            Forecast trends and analyze patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {predictions.map((prediction) => (
          <Card key={prediction.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{prediction.metric}</CardTitle>
                <Badge
                  className={
                    horizonColors[prediction.horizon as keyof typeof horizonColors]
                  }
                >
                  {prediction.horizon.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{prediction.value}</span>
                  <span className="text-sm text-muted-foreground">
                    Confidence: {prediction.confidence * 100}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Range:</span>
                  <span>{prediction.lowerBound}</span>
                  <span>-</span>
                  <span>{prediction.upperBound}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trend Analysis</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {trendData.period.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData.values}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={formatDate}
                  formatter={(value: number) => [value, 'Value']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Period: {formatDate(trendData.startDate)} -{' '}
            {formatDate(trendData.endDate)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 