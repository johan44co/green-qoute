"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

interface DownloadQuotePdfButtonProps {
  quoteId: string;
}

export function DownloadQuotePdfButton({
  quoteId,
}: DownloadQuotePdfButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      // Get the PDF blob from the API
      const blob = await apiClient.downloadQuotePdf(quoteId);

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Green-Quote-${quoteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download PDF. Please try again.");
      console.error("PDF download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? "Generating PDF..." : "Download PDF"}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
