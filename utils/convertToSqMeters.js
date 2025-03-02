// utils/convertToSquareMeter.js

const conversionFactors = {
    ropani: 508.72, // 1 Ropani = 508.72 m²
    anna: 31.80, // 1 Anna = 31.80 m²
    paisa: 7.95, // 1 Paisa = 7.95 m²
    daam: 1.99, // 1 Daam = 1.99 m²
    bigha: 6772.63, // 1 Bigha = 6772.63 m²
    katha: 338.63, // 1 Katha = 338.63 m²
    dhur: 16.93, // 1 Dhur = 16.93 m²
    square_meter: 1, // Already in square meters
  };
  
  const convertToSquareMeter = (value, unit) => {
    const lowerUnit = unit.toLowerCase();
    if (conversionFactors[lowerUnit]) {
      return value * conversionFactors[lowerUnit];
    } else {
      throw new Error("Invalid unit provided for conversion.");
    }
  };
  
  module.exports =convertToSquareMeter;
  