import { HttpMethod, OptionalsData } from '@/constants/types';
import axios from 'axios';
import { FieldValues } from 'react-hook-form';
import { UseFormProps } from '../useForm';
import useTokenStore from '../store/useTokenStore';

type UseApiDefault = {
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
};

export type UseApiQuery = {
  queryKey: string[];
  process: (data?: any) => Promise<any>;
} & UseApiDefault;

export type UseApiForm<T extends FieldValues> = {
  process: (data: T) => Promise<any>;
  onFormError?: UseFormProps<T>['onError'];
} & UseApiDefault;

const useApi = () => {
  const { token } = useTokenStore();

  const fetchUrl = async (
    url: string,
    method: HttpMethod,
    requestData: object = {},
    optionals?: OptionalsData
  ) => {
    if (__DEV__) console.log('📀📀📀 - Request Sent', axios.defaults.baseURL + (url ?? ''));

    const { config, data, request, status, statusText } = await axios({
      method,
      url,
      ...(['GET'].includes(method) ? { params: requestData } : { data: requestData }),
      ...optionals,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (__DEV__) {
      console.log('📀📀 - Request Response');
      console.log('📀 - url', config.baseURL + (config.url ?? ''));
      // console.log('📀 - config', config);
      // console.log('📀 - data', data.data);
      // console.log('📀 - metadata', data.metadata);
      // console.log('📀 - request', request);
      console.log(`📀 - status: ${status} - ${statusText}`);
      console.log('📀📀 - End Request Response');
    }

    return data.data;
  };

  const get = (url: string, optionals?: OptionalsData) => {
    return fetchUrl(url, 'GET', undefined, optionals);
  };

  const post = (url: string, data?: object, optionals?: OptionalsData) => {
    return fetchUrl(url, 'POST', data, optionals);
  };

  const put = (url: string, data?: object, optionals?: OptionalsData) => {
    return fetchUrl(url, 'PUT', data, optionals);
  };

  const patch = (url: string, data?: object, optionals?: OptionalsData) => {
    return fetchUrl(url, 'PATCH', data, optionals);
  };

  const del = (url: string, optionals?: OptionalsData) => {
    return fetchUrl(url, 'DELETE', undefined, optionals);
  };

  return { get, post, put, patch, del };
};

export default useApi;
