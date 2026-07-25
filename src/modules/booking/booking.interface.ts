
export interface ICreateBooking{
  serviceId: string;
  price: number;
  scheduledAt: Date;
  customerNote?: string;
}