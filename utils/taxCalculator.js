const TAX_RATE = 0.05; // 5% tax on land transactions

const calculateTax = (price) => {
  if (!price || price < 0) return 0; // ✅ Ensure valid price before calculating tax
  return price * TAX_RATE;
};

module.exports = { calculateTax };
