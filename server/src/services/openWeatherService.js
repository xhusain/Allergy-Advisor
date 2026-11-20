function fallbackAdvice() {
  return [
    {
      condition: "Dry or windy",
      message: "Pollen and dust can travel more easily. Keep windows closed and rinse after outdoor exposure."
    },
    {
      condition: "Rainy or damp",
      message: "Mold can increase in damp areas. Avoid musty rooms and dry wet clothing quickly."
    },
    {
      condition: "Cold",
      message: "Cold air can irritate airways. Cover your nose and mouth outdoors if symptoms flare."
    }
  ];
}

function buildAdvice(weather) {
  const advice = [];
  const windSpeed = weather.wind?.speed || 0;
  const humidity = weather.main?.humidity || 0;
  const temperature = weather.main?.temp || 0;
  const rain = weather.rain?.["1h"] || weather.rain?.["3h"] || 0;
  const snow = weather.snow?.["1h"] || weather.snow?.["3h"] || 0;

  if (windSpeed >= 5.5) {
    advice.push({
      condition: "Windy",
      message: "Wind can move pollen and dust around quickly. Limit long outdoor exposure and rinse after coming inside."
    });
  }

  if (humidity >= 70 || rain > 0) {
    advice.push({
      condition: "Damp",
      message: "Damp conditions can increase mold exposure. Keep indoor areas dry and avoid musty rooms."
    });
  }

  if (humidity <= 35) {
    advice.push({
      condition: "Dry air",
      message: "Dry air may irritate airways and skin. Stay hydrated and consider indoor humidity control."
    });
  }

  if (temperature <= 8 || snow > 0) {
    advice.push({
      condition: "Cold",
      message: "Cold air may trigger respiratory irritation. Cover your nose and mouth outdoors."
    });
  }

  if (advice.length === 0) {
    advice.push({
      condition: "Moderate conditions",
      message: "Weather-related allergy risk looks moderate. Keep tracking your symptoms and usual triggers."
    });
  }

  return advice;
}

export async function getOpenWeatherAdvice(city) {
  if (!process.env.OPENWEATHER_API_KEY) {
    return {
      configured: false,
      location: null,
      weather: null,
      advice: fallbackAdvice()
    };
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", process.env.OPENWEATHER_API_KEY);
  url.searchParams.set("units", "metric");

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    return {
      configured: false,
      error: "OpenWeatherMap rejected the API key. Check the key value, wait if it was newly created, then restart the server.",
      location: null,
      weather: null,
      advice: fallbackAdvice()
    };
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not load weather for that city");
  }

  return {
    configured: true,
    location: {
      name: data.name,
      country: data.sys?.country,
      latitude: data.coord?.lat,
      longitude: data.coord?.lon
    },
    weather: {
      condition: data.weather?.[0]?.main || "Current weather",
      description: data.weather?.[0]?.description || "",
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed
    },
    advice: buildAdvice(data)
  };
}
