
export interface ICreateBooking{
  serviceId: string;
  scheduledAt: Date;
  customerNote?: string;
}