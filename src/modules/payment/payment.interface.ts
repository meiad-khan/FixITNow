export interface TInitPaymentPayload {
  bookingId: string;
}

export interface TSSLCommerzInitResponse {
  status: string;
  failedreason: string;
  GatewayPageURL: string;
}

export interface TSSLCommerzValidationResponse {
  status: string;
  tran_date: string;
  tran_id: string;
  val_id: string;
  amount: string;
  card_type?: string;
}
