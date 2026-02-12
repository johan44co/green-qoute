/**
 * Risk band classification based on consumption and system size
 */
export type RiskBand = "A" | "B" | "C";

/**
 * Financing offer for a specific term
 */
export interface FinancingOffer {
  termYears: number;
  apr: number;
  principalUsed: number;
  monthlyPayment: number;
}

/**
 * Quote calculation result
 */
export interface QuoteResult {
  systemPrice: number;
  principalAmount: number;
  riskBand: RiskBand;
  offers: FinancingOffer[];
}

/**
 * Calculate system price based on system size
 * @param systemSizeKw System size in kilowatts
 * @returns System price
 */
export function calculateSystemPrice(systemSizeKw: number): number {
  return systemSizeKw * 1200;
}

/**
 * Determine risk band based on consumption and system size
 * @param monthlyConsumptionKwh Monthly consumption in kWh
 * @param systemSizeKw System size in kilowatts
 * @returns Risk band (A, B, or C)
 */
export function calculateRiskBand(
  monthlyConsumptionKwh: number,
  systemSizeKw: number
): RiskBand {
  if (monthlyConsumptionKwh >= 400 && systemSizeKw <= 6) {
    return "A";
  }
  if (monthlyConsumptionKwh >= 250) {
    return "B";
  }
  return "C";
}

/**
 * Get base APR for a risk band
 * @param riskBand Risk band (A, B, or C)
 * @returns APR as a decimal (e.g., 0.069 for 6.9%)
 */
export function getBaseAPR(riskBand: RiskBand): number {
  const aprMap: Record<RiskBand, number> = {
    A: 0.069, // 6.9%
    B: 0.089, // 8.9%
    C: 0.119, // 11.9%
  };
  return aprMap[riskBand];
}

/**
 * Calculate monthly payment using standard amortization formula
 * @param principal Principal amount
 * @param annualRate Annual interest rate (as decimal, e.g., 0.069)
 * @param termYears Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal === 0) return 0;
  
  const monthlyRate = annualRate / 12;
  const numPayments = termYears * 12;
  
  // Amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Number(payment.toFixed(2));
}

/**
 * Generate financing offers for standard terms (5, 10, 15 years)
 * @param principal Principal amount
 * @param riskBand Risk band
 * @returns Array of financing offers
 */
export function generateOffers(
  principal: number,
  riskBand: RiskBand
): FinancingOffer[] {
  const apr = getBaseAPR(riskBand);
  const terms = [5, 10, 15];
  
  return terms.map((termYears) => ({
    termYears,
    apr,
    principalUsed: principal,
    monthlyPayment: calculateMonthlyPayment(principal, apr, termYears),
  }));
}

/**
 * Calculate complete quote result
 * @param input Quote input parameters
 * @returns Complete quote calculation result
 */
export function calculateQuote(input: {
  systemSizeKw: number;
  monthlyConsumptionKwh: number;
  downPayment?: number;
}): QuoteResult {
  const systemPrice = calculateSystemPrice(input.systemSizeKw);
  const principalAmount = systemPrice - (input.downPayment || 0);
  const riskBand = calculateRiskBand(
    input.monthlyConsumptionKwh,
    input.systemSizeKw
  );
  const offers = generateOffers(principalAmount, riskBand);
  
  return {
    systemPrice,
    principalAmount,
    riskBand,
    offers,
  };
}
