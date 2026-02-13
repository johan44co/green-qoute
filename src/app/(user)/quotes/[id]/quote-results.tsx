import { QuoteResponse } from "@/lib/api-client";
import { FinancingOffer } from "@/lib/pricing";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { getCountryName } from "@/lib/countries";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { InstallationMap } from "@/components/installation-map";

interface QuoteResultsProps {
  quote: QuoteResponse;
}

const riskBandLabels = {
  A: { label: "Excellent", color: "bg-green-600" },
  B: { label: "Good", color: "bg-yellow-600" },
  C: { label: "Standard", color: "bg-orange-600" },
};

export function QuoteResults({ quote }: QuoteResultsProps) {
  const riskBandInfo = riskBandLabels[quote.riskBand as "A" | "B" | "C"];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left column: Summary, Risk Band, and Financing */}
      <div className="space-y-6">
        {/* Installation Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Installation Summary</CardTitle>
            <CardDescription>
              System overview and pricing breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 md:grid-cols-3">
              <div>
                <dt className="text-sm text-foreground/70 mb-1">System Size</dt>
                <dd className="text-xl font-semibold">{quote.systemSizeKw} kW</dd>
              </div>
              <div>
                <dt className="text-sm text-foreground/70 mb-1">System Price</dt>
                <dd className="text-xl font-semibold">
                  {formatCurrency(quote.systemPrice)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-foreground/70 mb-1">Down Payment</dt>
                <dd className="text-xl font-semibold">
                  {formatCurrency(quote.downPayment ?? 0)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Risk Band */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Risk Band</CardTitle>
            <CardDescription>
              Based on your monthly consumption of {quote.monthlyConsumptionKwh}{" "}
              kWh and system size of {quote.systemSizeKw} kW
            </CardDescription>
          </CardHeader>
          <CardContent className={`${riskBandInfo.color} text-white pt-6`}>
            <span className="text-xl font-bold">
              {quote.riskBand} - {riskBandInfo.label}
            </span>
          </CardContent>
        </Card>

        {/* Financing Offers */}
        <Card>
          <CardHeader>
            <CardTitle>Financing Options</CardTitle>
            <CardDescription>
              Available payment plans for your solar installation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Table for mobile */}
            <div className="md:hidden border border-foreground/20 rounded-lg overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-right">Monthly Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(quote.offers as unknown as FinancingOffer[]).map((offer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{offer.termYears} Years</TableCell>
                      <TableCell className="text-right">{formatCurrency(offer.monthlyPayment)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Cards for desktop */}
            <div className="hidden md:grid gap-4 md:grid-cols-3 mb-6">
              {(quote.offers as unknown as FinancingOffer[]).map((offer, index) => (
                <div
                  key={index}
                  className="border border-foreground/20 rounded-lg p-4 text-center"
                >
                  <p className="text-sm text-foreground/70 mb-2">
                    {offer.termYears} Years
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(offer.monthlyPayment)}
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">per month</p>
                </div>
              ))}
            </div>

            {/* Financing details */}
            <dl className="grid gap-4 grid-cols-2 md:grid-cols-3 text-left md:text-right">
              <div className="hidden md:block"></div>
              <div>
                <dt className="text-sm text-foreground/70 mb-1">Financing Amount</dt>
                <dd className="text-xl font-semibold">
                  {formatCurrency(quote.principalAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-foreground/70 mb-1">APR</dt>
                <dd className="text-xl font-semibold">
                  {formatPercent((quote.offers as unknown as FinancingOffer[])[0].apr)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Right column: Installation Details */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Installation Details</CardTitle>
          <CardDescription>
            Contact and location information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-foreground/70 mb-1">Customer Name</dt>
              <dd className="font-medium">{quote.fullName}</dd>
            </div>
            <div>
              <dt className="text-foreground/70 mb-1">Email</dt>
              <dd className="font-medium">{quote.email}</dd>
            </div>
            <div>
              <dt className="text-foreground/70 mb-1">Installation Address</dt>
              <dd className="font-medium">
                {quote.address1}
                {quote.address2 && <>, {quote.address2}</>}
                <br />
                {quote.city}
                {quote.region && <>, {quote.region}</>} {quote.zip}
                <br />
                {getCountryName(quote.country)}
              </dd>
            </div>
            <div>
              <dt className="text-foreground/70 mb-1">Monthly Consumption</dt>
              <dd className="font-medium">
                {quote.monthlyConsumptionKwh} kWh
              </dd>
            </div>
          </dl>
        </CardContent>
        
        {/* Map */}
        <div className="flex-1">
          <InstallationMap
            address={quote.address1}
            city={quote.city}
            region={quote.region ?? undefined}
            zip={quote.zip}
            country={quote.country}
          />
        </div>
      </Card>
    </div>
  );
}
