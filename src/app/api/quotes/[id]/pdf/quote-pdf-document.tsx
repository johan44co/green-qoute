import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { QuoteResponse } from "@/lib/api-client";
import type { FinancingOffer } from "@/lib/pricing";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCountryName } from "@/lib/countries";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2pt solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
  },
  value: {
    width: "60%",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  col1: {
    width: "25%",
  },
  col2: {
    width: "25%",
  },
  col3: {
    width: "25%",
  },
  col4: {
    width: "25%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    borderTop: "1pt solid #ccc",
    paddingTop: 10,
  },
});

interface QuotePDFDocumentProps {
  quote: QuoteResponse;
}

export function QuotePDFDocument({ quote }: QuotePDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Green Quote</Text>
          <Text style={styles.subtitle}>Solar Panel Installation Quote</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{quote.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{quote.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>
              {[
                quote.address1,
                quote.address2,
                quote.city,
                quote.region,
                quote.zip,
                getCountryName(quote.country),
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Quote Date:</Text>
            <Text style={styles.value}>{formatDate(quote.createdAt)}</Text>
          </View>
        </View>

        {/* Installation Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Installation Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>System Size:</Text>
            <Text style={styles.value}>{quote.systemSizeKw} kW</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Consumption:</Text>
            <Text style={styles.value}>{quote.monthlyConsumptionKwh} kWh</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>System Price:</Text>
            <Text style={styles.value}>
              {formatCurrency(quote.systemPrice)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Down Payment:</Text>
            <Text style={styles.value}>
              {formatCurrency(quote.downPayment ?? 0)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Principal Amount:</Text>
            <Text style={styles.value}>
              {formatCurrency(quote.principalAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Risk Band:</Text>
            <Text style={styles.value}>{quote.riskBand}</Text>
          </View>
        </View>

        {/* Financing Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financing Options</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Term</Text>
              <Text style={styles.col2}>APR</Text>
              <Text style={styles.col3}>Monthly Payment</Text>
              <Text style={styles.col4}>Total Cost</Text>
            </View>
            {(quote.offers as unknown as FinancingOffer[])?.map(
              (offer, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>{offer.termYears} Years</Text>
                  <Text style={styles.col2}>
                    {(offer.apr * 100).toFixed(2)}%
                  </Text>
                  <Text style={styles.col3}>
                    {formatCurrency(offer.monthlyPayment)}
                  </Text>
                  <Text style={styles.col4}>
                    {formatCurrency(
                      offer.monthlyPayment * offer.termYears * 12
                    )}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          For questions or assistance, contact us at info@greenquote.com
        </Text>
      </Page>
    </Document>
  );
}
