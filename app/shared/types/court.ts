import type { PaginatedQueryDTO } from "./pagination";

export const SportType = {
  TENNIS: "TENNIS",
  PADEL: "PADEL",
  BADMINTON: "BADMINTON",
  SQUASH: "SQUASH",
  BASKETBALL: "BASKETBALL",
  VOLLEYBALL: "VOLLEYBALL",
  FOOTBALL: "FOOTBALL",
} as const;

export type SportType = (typeof SportType)[keyof typeof SportType];

export const CourtStatusFilter = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ALL: "ALL",
} as const;

export type CourtStatusFilter =
  (typeof CourtStatusFilter)[keyof typeof CourtStatusFilter];

export type Court = {
  id: string;
  name: string;
  sportType: SportType;
  hourlyPrice: string;
  openingHour: string;
  closingHour: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCourtDTO = {
  name: string;
  sportType: SportType;
  hourlyPrice: string;
  openingHour: string;
  closingHour: string;
};

export type UpdateCourtDTO = Partial<CreateCourtDTO>;

export type FindCourtsQueryDTO = PaginatedQueryDTO & {
  status?: CourtStatusFilter;
  name?: string;
  sportType?: SportType;
};
