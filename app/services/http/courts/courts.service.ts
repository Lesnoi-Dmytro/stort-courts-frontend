import type {
  Court,
  CreateCourtDTO,
  FindCourtsQueryDTO,
  PaginatedResponse,
  UpdateCourtDTO,
} from "~/shared/types";
import { ApiPaths } from "../api-paths";
import { http, type RequestOptions } from "../config";

export const CourtsService = {
  async findPage(
    query?: FindCourtsQueryDTO,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Court>> {
    const { data } = await http.get<PaginatedResponse<Court>>(ApiPaths.COURTS, {
      params: query,
      ...options,
    });
    return data;
  },

  async findOne(id: string, options?: RequestOptions): Promise<Court> {
    const { data } = await http.get<Court>(ApiPaths.COURT(id), {
      skipAuthRedirect: true,
      ...options,
    });
    return data;
  },

  async create(dto: CreateCourtDTO): Promise<Court> {
    const { data } = await http.post<Court>(ApiPaths.COURTS, dto);
    return data;
  },

  async update(id: string, dto: UpdateCourtDTO): Promise<Court> {
    const { data } = await http.put<Court>(ApiPaths.COURT(id), dto);
    return data;
  },

  async deactivate(id: string): Promise<Court> {
    const { data } = await http.put<Court>(ApiPaths.COURT_DEACTIVATE(id));
    return data;
  },
};
