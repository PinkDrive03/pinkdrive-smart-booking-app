export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateFare = (distance, options = {}) => {
  const {
    weather = "normal",
    traffic = "normal",
    demand = "normal",
    timeType = "normal"
  } = options;

  const rateStructure = {
    bike: { baseFare: 12000, perKmRate: 4500, minimumFare: 18000 },
    auto: { baseFare: 15000, perKmRate: 6000, minimumFare: 25000 },
    cabEconomy: { baseFare: 25000, perKmRate: 11000, minimumFare: 50000 },
    cabPremium: { baseFare: 35000, perKmRate: 15000, minimumFare: 70000 }
  };

  const weatherFactor = {
    normal: 1,
    hot: 1.05,
    rain: 1.15,
    storm: 1.3
  };

  const trafficFactor = {
    light: 1,
    normal: 1,
    medium: 1.1,
    heavy: 1.25,
    jam: 1.4
  };

  const demandFactor = {
    low: 0.95,
    normal: 1,
    high: 1.2,
    surge: 1.45
  };

  const timeFactor = {
    normal: 1,
    peak: 1.2,
    night: 1.15
  };

  const getFactor = (table, key) => table[key] || 1;

  const totalFactor =
    getFactor(weatherFactor, weather) *
    getFactor(trafficFactor, traffic) *
    getFactor(demandFactor, demand) *
    getFactor(timeFactor, timeType);

  let extraFee = 0;

  if (weather === "rain" && (traffic === "heavy" || traffic === "jam")) {
    extraFee += 8000;
  }

  if (weather === "storm") {
    extraFee += 12000;
  }

  if (demand === "surge" && timeType === "peak") {
    extraFee += 15000;
  }

  if (timeType === "night") {
    extraFee += 7000;
  }

  if (distance > 10) {
    extraFee += 10000;
  }

  const fareCalculation = (baseFare, perKmRate, minimumFare) => {
    const rawFare = baseFare + distance * perKmRate;
    const dynamicFare = rawFare * totalFactor + extraFee;
    const finalFare = Math.max(dynamicFare, minimumFare);
    return Math.round(finalFare / 1000) * 1000;
  };

  return {
    bike: fareCalculation(
      rateStructure.bike.baseFare,
      rateStructure.bike.perKmRate,
      rateStructure.bike.minimumFare
    ),
    auto: fareCalculation(
      rateStructure.auto.baseFare,
      rateStructure.auto.perKmRate,
      rateStructure.auto.minimumFare
    ),
    cabEconomy: fareCalculation(
      rateStructure.cabEconomy.baseFare,
      rateStructure.cabEconomy.perKmRate,
      rateStructure.cabEconomy.minimumFare
    ),
    cabPremium: fareCalculation(
      rateStructure.cabPremium.baseFare,
      rateStructure.cabPremium.perKmRate,
      rateStructure.cabPremium.minimumFare
    )
  };
};

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
