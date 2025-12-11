import { useApi } from '@gravitate-js/excalibrr';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { NotificationMessage } from '@gravitate-js/excalibrr';
import {
  DogGroomingAPIResponse,
  DogGroomingFilters,
  DogGroomingCreateRequest,
  DogGroomingUpdateRequest,
} from './types.schema';

const endpoints = {
  read: 'api/dog-grooming/read',
  create: 'api/dog-grooming/create',
  update: 'api/dog-grooming/update',
  delete: 'api/dog-grooming/delete',
} as const;

export function useDogGrooming() {
  const api = useApi();
  const queryClient = useQueryClient();

  const useDogGroomingQuery = (filters: DogGroomingFilters) =>
    useQuery([endpoints.read, filters], () => api.post(endpoints.read, filters), {
      enabled: true,
    }) as UseQueryResult<DogGroomingAPIResponse, Error>;

  const useCreateMutation = () =>
    useMutation((request: DogGroomingCreateRequest) => api.post(endpoints.create, request), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Created successfully', false);
        queryClient.invalidateQueries([endpoints.read]);
      },
      onError: () => {
        NotificationMessage('Error.', 'Failed to create', true);
      },
    });

  const useUpdateMutation = () =>
    useMutation((request: DogGroomingUpdateRequest) => api.post(endpoints.update, request), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Updated successfully', false);
        queryClient.invalidateQueries([endpoints.read]);
      },
      onError: () => {
        NotificationMessage('Error.', 'Failed to update', true);
      },
    });

  const useDeleteMutation = () =>
    useMutation((request: { Id: number }) => api.post(endpoints.delete, request), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Deleted successfully', false);
        queryClient.invalidateQueries([endpoints.read]);
      },
      onError: () => {
        NotificationMessage('Error.', 'Failed to delete', true);
      },
    });

  return {
    useDogGroomingQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
  };
}
