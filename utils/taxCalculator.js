const TAX_RATE = 0.05; // 5% tax on land transactions

const calculateTax = (price) => {
  return price * TAX_RATE;
};

module.exports = { calculateTax };
