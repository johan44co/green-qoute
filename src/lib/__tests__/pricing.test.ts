import {
  calculateSystemPrice,
  calculateRiskBand,
  getBaseAPR,
  calculateMonthlyPayment,
  generateOffers,
  calculateQuote,
} from "@/lib/pricing";

describe("Pricing Calculations", () => {
  describe("calculateSystemPrice", () => {
    it("should calculate system price correctly", () => {
      expect(calculateSystemPrice(5)).toBe(6000); // 5 * 1200
      expect(calculateSystemPrice(10)).toBe(12000); // 10 * 1200
      expect(calculateSystemPrice(3.5)).toBe(4200); // 3.5 * 1200
    });
  });

  describe("calculateRiskBand", () => {
    it("should return A for consumption >= 400 and size <= 6", () => {
      expect(calculateRiskBand(400, 6)).toBe("A");
      expect(calculateRiskBand(500, 5)).toBe("A");
      expect(calculateRiskBand(450, 6)).toBe("A");
    });

    it("should return B for consumption >= 250 (but not A)", () => {
      expect(calculateRiskBand(250, 10)).toBe("B");
      expect(calculateRiskBand(300, 7)).toBe("B");
      expect(calculateRiskBand(399, 7)).toBe("B");
    });

    it("should return C for consumption < 250", () => {
      expect(calculateRiskBand(249, 5)).toBe("C");
      expect(calculateRiskBand(100, 3)).toBe("C");
      expect(calculateRiskBand(200, 10)).toBe("C");
    });

    it("should return B when consumption >= 400 but size > 6", () => {
      expect(calculateRiskBand(400, 7)).toBe("B");
      expect(calculateRiskBand(500, 8)).toBe("B");
    });

    it("should return B when consumption >= 250 but < 400", () => {
      expect(calculateRiskBand(250, 5)).toBe("B");
      expect(calculateRiskBand(300, 10)).toBe("B");
    });
  });

  describe("getBaseAPR", () => {
    it("should return correct APR for each risk band", () => {
      expect(getBaseAPR("A")).toBe(0.069);
      expect(getBaseAPR("B")).toBe(0.089);
      expect(getBaseAPR("C")).toBe(0.119);
    });
  });

  describe("calculateMonthlyPayment", () => {
    it("should calculate monthly payment using amortization formula", () => {
      const principal = 10000;
      const apr = 0.069;
      const termYears = 10;

      const monthlyPayment = calculateMonthlyPayment(principal, apr, termYears);

      // Expected monthly payment for €10,000 at 6.9% APR over 10 years
      // M = P * [r(1+r)^n] / [(1+r)^n - 1]
      // where r = 0.069/12 and n = 10*12
      expect(monthlyPayment).toBeCloseTo(115.59, 1);
    });

    it("should handle different terms correctly", () => {
      const principal = 5000;
      const apr = 0.089;

      const payment5yr = calculateMonthlyPayment(principal, apr, 5);
      const payment10yr = calculateMonthlyPayment(principal, apr, 10);
      const payment15yr = calculateMonthlyPayment(principal, apr, 15);

      // Shorter term should have higher monthly payment
      expect(payment5yr).toBeGreaterThan(payment10yr);
      expect(payment10yr).toBeGreaterThan(payment15yr);
    });
  });

  describe("generateOffers", () => {
    it("should generate 3 offers with different terms", () => {
      const principal = 10000;
      const riskBand = "A";

      const offers = generateOffers(principal, riskBand);

      expect(offers).toHaveLength(3);
      expect(offers[0].termYears).toBe(5);
      expect(offers[1].termYears).toBe(10);
      expect(offers[2].termYears).toBe(15);
    });

    it("should use correct APR based on risk band", () => {
      const principal = 10000;

      const offersA = generateOffers(principal, "A");
      const offersB = generateOffers(principal, "B");
      const offersC = generateOffers(principal, "C");

      expect(offersA[0].apr).toBe(0.069);
      expect(offersB[0].apr).toBe(0.089);
      expect(offersC[0].apr).toBe(0.119);
    });

    it("should include principal amount in each offer", () => {
      const principal = 10000;
      const offers = generateOffers(principal, "B");

      offers.forEach((offer) => {
        expect(offer.principalUsed).toBe(principal);
      });
    });
  });

  describe("calculateQuote", () => {
    it("should calculate complete quote correctly", () => {
      const input = {
        systemSizeKw: 5,
        monthlyConsumptionKwh: 400,
        downPayment: 1000,
      };

      const result = calculateQuote(input);

      expect(result.systemPrice).toBe(6000); // 5 * 1200
      expect(result.principalAmount).toBe(5000); // 6000 - 1000
      expect(result.riskBand).toBe("A"); // 400 kWh, 5 kW
      expect(result.offers).toHaveLength(3);
      expect(result.offers[0].apr).toBe(0.069); // Band A APR
    });

    it("should handle no down payment", () => {
      const input = {
        systemSizeKw: 6,
        monthlyConsumptionKwh: 300,
      };

      const result = calculateQuote(input);

      expect(result.systemPrice).toBe(7200); // 6 * 1200
      expect(result.principalAmount).toBe(7200); // No down payment
      expect(result.riskBand).toBe("B"); // 300 kWh
    });

    it("should handle different risk bands", () => {
      const inputA = {
        systemSizeKw: 5,
        monthlyConsumptionKwh: 450,
      };
      const inputB = {
        systemSizeKw: 8,
        monthlyConsumptionKwh: 300,
      };
      const inputC = {
        systemSizeKw: 4,
        monthlyConsumptionKwh: 200,
      };

      const resultA = calculateQuote(inputA);
      const resultB = calculateQuote(inputB);
      const resultC = calculateQuote(inputC);

      expect(resultA.riskBand).toBe("A");
      expect(resultB.riskBand).toBe("B");
      expect(resultC.riskBand).toBe("C");

      expect(resultA.offers[0].apr).toBe(0.069);
      expect(resultB.offers[0].apr).toBe(0.089);
      expect(resultC.offers[0].apr).toBe(0.119);
    });

    it("should calculate monthly payments for all offers", () => {
      const input = {
        systemSizeKw: 5,
        monthlyConsumptionKwh: 400,
        downPayment: 0,
      };

      const result = calculateQuote(input);

      result.offers.forEach((offer) => {
        expect(offer.monthlyPayment).toBeGreaterThan(0);
        expect(typeof offer.monthlyPayment).toBe("number");
      });

      // Shorter term should have higher monthly payment
      expect(result.offers[0].monthlyPayment).toBeGreaterThan(
        result.offers[1].monthlyPayment
      );
      expect(result.offers[1].monthlyPayment).toBeGreaterThan(
        result.offers[2].monthlyPayment
      );
    });
  });
});
