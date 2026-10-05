import type {
  CourtBooking,
  CourtBookingSlot,
  CourtFilterQueryDTO,
  CreateCourtBookingDTO,
  DateRangeQueryDTO,
  DaySummary,
  SummaryQueryDTO,
} from "~/shared/types";
import { ApiPaths } from "../api-paths";
import { http, type RequestOptions } from "../config";

export const CourtBookingsService = {
  /** Bookings and income of all courts (or one court) for a UTC day range (admin only). */
  async getDaySummary(
    query: SummaryQueryDTO,
    options?: RequestOptions,
  ): Promise<DaySummary> {
    const { data } = await http.get<DaySummary>(
      ApiPaths.COURT_BOOKINGS_SUMMARY,
      { params: query, ...options },
    );
    return data;
  },

  async findMine(
    query?: CourtFilterQueryDTO,
    options?: RequestOptions,
  ): Promise<CourtBooking[]> {
    const { data } = await http.get<CourtBooking[]>(
      ApiPaths.COURT_BOOKINGS_MY,
      { params: query, ...options },
    );
    return data;
  },

  async findByCourt(
    courtId: string,
    range: DateRangeQueryDTO,
    options?: RequestOptions,
  ): Promise<CourtBookingSlot[]> {
    const { data } = await http.get<CourtBookingSlot[]>(
      ApiPaths.COURT_BOOKINGS_BY_COURT(courtId),
      { params: range, ...options },
    );
    return data;
  },

  async create(dto: CreateCourtBookingDTO): Promise<CourtBooking> {
    const { data } = await http.post<CourtBooking>(
      ApiPaths.COURT_BOOKINGS,
      dto,
    );
    return data;
  },

  /** Owner or admin only, and only until 2 hours before the start. */
  async cancel(id: string): Promise<void> {
    await http.delete(ApiPaths.COURT_BOOKING(id));
  },
};
