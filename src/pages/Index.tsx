import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Cloud, CloudRain, CloudSun, Wind, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { fetchWeatherData } from "@/utils/weatherApi";

const Index = () => {
  const [cityName, setCityName] = useState("New York");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch default city on component mount
  useEffect(() => {
    const fetchDefaultCity = async () => {
      setIsLoading(true);
      try {
        const weatherData = await fetchWeatherData("New York");
        setCities([weatherData]);
      } catch (error) {
        toast.error("Failed to fetch default city weather data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (cities.length === 0) {
      fetchDefaultCity();
    }
  }, []);

  const handleAddCity = async () => {
    if (cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      toast.error("City already exists!");
      return;
    }

    setIsLoading(true);
    try {
      const weatherData = await fetchWeatherData(cityName);
      setCities([...cities, weatherData]);
      toast.success("City added successfully!");
    } catch (error) {
      toast.error("Failed to fetch weather data. Please check the city name.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCity = (cityId: string) => {
    if (cities.length === 1) {
      toast.error("Cannot delete the last city!");
      return;
    }
    setCities(cities.filter(city => city.id !== cityId));
    toast.success("City removed successfully!");
  };

  if (isLoading && cities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#accbee] to-[#e7f0fd] p-4 sm:p-8 flex items-center justify-center">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#accbee] to-[#e7f0fd] p-4 sm:p-8">
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Enter city name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="pr-12 h-12 text-lg bg-white/80 backdrop-blur-sm border-none"
          />
          <Button
            size="icon"
            className="absolute right-1 top-1 h-10 w-10 bg-[#6E59A5] hover:bg-[#7E69AB]"
            onClick={handleAddCity}
            disabled={isLoading}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {cities.length > 0 && (
          <Tabs defaultValue={cities[0].id} className="w-full">
            <TabsList className="w-full mb-4 flex overflow-x-auto bg-white/20 backdrop-blur-sm">
              {cities.map((city) => (
                <TabsTrigger key={city.id} value={city.id} className="flex-1 text-gray-700">
                  {city.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {cities.map((city) => (
              <TabsContent key={city.id} value={city.id}>
              <Card className="weather-card p-8 animate-slide-up relative bg-white/80">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleDeleteCity(city.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="text-center mb-8">
                  <h1 className="text-3xl font-semibold mb-2 text-gray-800">{city.name}</h1>
                  <p className="text-gray-600">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex justify-center mb-8">
                  <Cloud className="weather-icon h-24 w-24 text-[#6E59A5]" />
                </div>

                <div className="text-center mb-12">
                  <div className="text-6xl font-light mb-2 text-gray-800">{city.temperature}°</div>
                  <div className="text-xl text-gray-600">{city.condition}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-[#F2FCE2] rounded-lg shadow-sm">
                    <div className="flex space-x-3 items-center">
                      <CloudRain className="h-5 w-5 text-gray-600" />
                      <div className="text-sm text-gray-700">Today</div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#E5DEFF] rounded-lg shadow-sm">
                    <div className="flex space-x-3 items-center">
                      <CloudSun className="h-5 w-5 text-gray-600" />
                      <div className="text-sm text-gray-700">Tomorrow</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: "Humidity", value: `${city.metrics.humidity}%`, bg: "bg-[#FDE1D3]" },
                    { label: "Cloudiness", value: `${city.metrics.cloudiness}%`, bg: "bg-[#D3E4FD]" },
                    { label: "Wind Speed", value: `${city.metrics.windspeed} km/h`, bg: "bg-[#FFDEE2]" },
                    { label: "Pressure", value: `${city.metrics.pressure} hPa`, bg: "bg-[#E5DEFF]" },
                  ].map((metric, index) => (
                    <div 
                      key={index} 
                      className={`${metric.bg} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]`}
                    >
                      <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                      <div className="text-xl font-semibold text-gray-800">{metric.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between px-4 bg-[#F1F0FB] rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    <div>Sunrise</div>
                    <div className="font-semibold">{city.metrics.sunrise}</div>
                  </div>
                  <div className="h-1 flex-1 mx-4 bg-[#D6BCFA] rounded">
                    <div className="h-full w-1/3 bg-[#9b87f5] rounded" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Sunset</div>
                    <div className="font-semibold">{city.metrics.sunset}</div>
                  </div>
                </div>
              </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
