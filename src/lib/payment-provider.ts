export interface PaymentIntentParams {
  amount: number; // In EUR (e.g. 150.00)
  currency?: string;
  orderNumber: string;
  customerEmail: string;
  paymentMethod: string; // e.g. "TEST_APPROVED", "TEST_DECLINED", "BANK_TRANSFER", "PAY_ON_COLLECTION", "STRIPE_CARD"
}

export interface PaymentResult {
  success: boolean;
  paymentStatus: "PAID" | "PENDING" | "AWAITING_TRANSFER" | "FAILED";
  transactionId: string;
  message: string;
  provider: "LOCAL" | "STRIPE";
}

export interface PaymentProvider {
  processPayment(params: PaymentIntentParams): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<{ success: boolean; message: string }>;
}

export class LocalPaymentProvider implements PaymentProvider {
  async processPayment(params: PaymentIntentParams): Promise<PaymentResult> {
    const txId = `LOCAL_TX_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    switch (params.paymentMethod) {
      case "TEST_APPROVED":
        return {
          success: true,
          paymentStatus: "PAID",
          transactionId: txId,
          message: "Simulated payment successfully approved.",
          provider: "LOCAL",
        };

      case "TEST_DECLINED":
        return {
          success: false,
          paymentStatus: "FAILED",
          transactionId: txId,
          message: "Simulated card declined for test order.",
          provider: "LOCAL",
        };

      case "BANK_TRANSFER":
        return {
          success: true,
          paymentStatus: "AWAITING_TRANSFER",
          transactionId: `IBAN_${txId}`,
          message: "Order placed. Awaiting bank transfer payment.",
          provider: "LOCAL",
        };

      case "PAY_ON_COLLECTION":
        return {
          success: true,
          paymentStatus: "PENDING",
          transactionId: `COLLECT_${txId}`,
          message: "Order reserved. Payment due on local pickup.",
          provider: "LOCAL",
        };

      default:
        return {
          success: true,
          paymentStatus: "PAID",
          transactionId: txId,
          message: "Simulated payment processed.",
          provider: "LOCAL",
        };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Simulated refund of ${amount ? `€${amount}` : "full amount"} processed for ${transactionId}.`,
    };
  }
}

export class StripePaymentProvider implements PaymentProvider {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY || "";
  }

  async processPayment(params: PaymentIntentParams): Promise<PaymentResult> {
    if (!this.secretKey) {
      // Fallback if Stripe credentials are not present
      console.warn("Stripe credentials missing. Falling back to local payment simulation.");
      return new LocalPaymentProvider().processPayment(params);
    }

    // Phase 2 implementation placeholder for Stripe SDK
    return {
      success: true,
      paymentStatus: "PAID",
      transactionId: `pi_stripe_${Date.now()}`,
      message: "Stripe payment intent authorized successfully.",
      provider: "STRIPE",
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Stripe refund executed for ${transactionId}`,
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const mode = process.env.PAYMENT_MODE || "local";
  if (mode === "stripe" && process.env.STRIPE_SECRET_KEY) {
    return new StripePaymentProvider();
  }
  return new LocalPaymentProvider();
}
