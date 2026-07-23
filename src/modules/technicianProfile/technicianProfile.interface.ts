export interface ICreateTechnicianProfile{
  profilePhoto?: string;
  bio: string;
  experienceYears: number;
  location: string;
  availability: IAvailability;
}
export interface IUpdateTechnicianProfile {
  profilePhoto?: string;
  bio?: string;
  experienceYears?: number;
  location?: string;
  availability?: IAvailability;
}
interface IAvailability {
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
  sunday?: string[];
}