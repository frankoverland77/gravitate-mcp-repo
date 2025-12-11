import { APIResponse } from '@api/globalTypes';

export interface DogGroomingData {
  Id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface DogGroomingResponse {
  TotalRecords: number;
  Data: DogGroomingData[];
}

export interface DogGroomingFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface DogGroomingCreateRequest {
  name: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface DogGroomingUpdateRequest extends DogGroomingCreateRequest {
  Id: number;
}

export type DogGroomingAPIResponse = APIResponse<DogGroomingResponse>;
