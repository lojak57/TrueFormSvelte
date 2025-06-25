export class PDFService {
  static async downloadProposal(proposalId: string): Promise<void> {
    try {
      // Get the HTML content from the API
      const response = await fetch(
        `/api/proposals/${proposalId}/pdf?payment_qr=true&acceptance_qr=true`
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const htmlContent = await response.text();

      // Create a new window with the PDF content
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow popups for this site to download PDFs");
      }

      // Write the HTML content and add auto-print script
      const htmlDoc = this.createPrintDocument(htmlContent);
      printWindow.document.write(htmlDoc);
      printWindow.document.close();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  }

  private static createPrintDocument(htmlContent: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Proposal PDF</title>
  <style>
    @media print {
      @page { margin: 0.5in; size: letter; }
      body { margin: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.onafterprint = function() {
          window.close();
        };
      }, 500);
    };
  <\/script>
</body>
</html>`;
  }

  static setButtonLoading(button: HTMLButtonElement, loading: boolean): void {
    if (loading) {
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `
        <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Generating PDF...
      `;
      button.disabled = true;
    } else {
      const originalText = button.dataset.originalText;
      if (originalText) {
        button.innerHTML = originalText;
        delete button.dataset.originalText;
      }
      button.disabled = false;
    }
  }
}
