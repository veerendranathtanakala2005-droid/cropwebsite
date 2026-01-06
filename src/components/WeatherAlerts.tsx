import React, { useState, useEffect } from 'react';
import { X, CloudRain, Sun, Wind, Thermometer, Droplets, AlertTriangle, Sprout, Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  rainfall: number;
}

interface Alert {
  id: string;
  type: 'planting' | 'harvesting' | 'warning' | 'tip';
  title: string;
  message: string;
  crop?: string;
  priority: 'high' | 'medium' | 'low';
}

const WeatherAlerts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    rainfall: 0,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showNotification, setShowNotification] = useState(true);

  // Simulate weather data and generate alerts
  useEffect(() => {
    const generateAlerts = () => {
      const currentMonth = new Date().getMonth();
      const newAlerts: Alert[] = [];

      // Seasonal recommendations
      if (currentMonth >= 5 && currentMonth <= 8) {
        // June to September - Kharif season
        newAlerts.push({
          id: '1',
          type: 'planting',
          title: 'Kharif Planting Season',
          message: 'Optimal time to plant rice, maize, and cotton. Monsoon conditions are favorable.',
          crop: 'Rice, Maize, Cotton',
          priority: 'high',
        });
      } else if (currentMonth >= 9 && currentMonth <= 11) {
        // October to December - Rabi sowing
        newAlerts.push({
          id: '2',
          type: 'planting',
          title: 'Rabi Sowing Time',
          message: 'Begin sowing wheat, mustard, and chickpea. Soil moisture is optimal.',
          crop: 'Wheat, Mustard, Chickpea',
          priority: 'high',
        });
      } else if (currentMonth >= 2 && currentMonth <= 4) {
        // March to May - Harvesting
        newAlerts.push({
          id: '3',
          type: 'harvesting',
          title: 'Rabi Harvest Season',
          message: 'Time to harvest rabi crops. Check grain moisture before storage.',
          crop: 'Wheat, Barley',
          priority: 'high',
        });
      }

      // Weather-based alerts
      if (weather.temperature > 35) {
        newAlerts.push({
          id: '4',
          type: 'warning',
          title: 'Heat Wave Alert',
          message: 'High temperatures expected. Increase irrigation frequency and apply mulching to protect crops.',
          priority: 'high',
        });
      }

      if (weather.humidity > 80) {
        newAlerts.push({
          id: '5',
          type: 'warning',
          title: 'High Humidity Warning',
          message: 'Risk of fungal diseases. Apply preventive fungicides and ensure proper drainage.',
          priority: 'medium',
        });
      }

      if (weather.rainfall > 50) {
        newAlerts.push({
          id: '6',
          type: 'tip',
          title: 'Heavy Rainfall Expected',
          message: 'Delay fertilizer application. Ensure drainage channels are clear to prevent waterlogging.',
          priority: 'medium',
        });
      }

      // General tips
      newAlerts.push({
        id: '7',
        type: 'tip',
        title: 'Soil Testing Reminder',
        message: 'Regular soil testing helps optimize fertilizer use. Test before each major planting season.',
        priority: 'low',
      });

      setAlerts(newAlerts);
    };

    generateAlerts();

    // Simulate weather changes
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(95, prev.humidity + (Math.random() - 0.5) * 5)),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [weather.temperature, weather.humidity, weather.rainfall]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'planting': return <Sprout className="w-5 h-5 text-primary" />;
      case 'harvesting': return <Calendar className="w-5 h-5 text-secondary" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'tip': return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-secondary bg-secondary/5';
      case 'low': return 'border-l-muted bg-muted/50';
    }
  };

  const highPriorityCount = alerts.filter(a => a.priority === 'high').length;

  return (
    <>
      {/* Floating Weather Button */}
      <button
        onClick={() => { setIsOpen(true); setShowNotification(false); }}
        className="fixed bottom-24 left-6 z-40 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
        aria-label="Weather Alerts"
      >
        <CloudRain className="w-6 h-6" />
        {showNotification && highPriorityCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {highPriorityCount}
          </span>
        )}
      </button>

      {/* Weather Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="gradient-hero p-4 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CloudRain className="w-6 h-6" />
                  Weather & Farm Alerts
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Current Weather */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Thermometer className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-bold">{Math.round(weather.temperature)}°C</p>
                  <p className="text-xs opacity-80">Temp</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Droplets className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-bold">{Math.round(weather.humidity)}%</p>
                  <p className="text-xs opacity-80">Humidity</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Wind className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-bold">{weather.windSpeed}</p>
                  <p className="text-xs opacity-80">km/h</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Sun className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">{weather.condition}</p>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Farming Recommendations
              </h3>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm">{alert.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                        {alert.crop && (
                          <p className="text-xs text-primary mt-2 font-medium">
                            <Sprout className="w-3 h-3 inline mr-1" />
                            {alert.crop}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href="/predict">Get Crop Prediction</a>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href="/shop">Shop Farm Supplies</a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default WeatherAlerts;