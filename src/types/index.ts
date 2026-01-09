/**
 * Vision Trip interface for 2026 schedule
 */
export interface VisionTrip {
  dateRange: string;
  leader?: string;
  tripId: string;
  registrationUrl: string;
}

/**
 * Country interface for HopeChest Country Picker
 */
export interface Country {
  id: string;
  name: string;
  region: string;
  ministryType: string;
  imgUrl: string;
  tags: string[];
  visionTrips: VisionTrip[];
}
