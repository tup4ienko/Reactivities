import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Activity, ActivityFormValues } from '../models/activity';
import { Photo, Profile, UserActivity } from '../models/profile';
import { User, UserFormValues } from '../models/user';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { PaginatedResult } from '../models/pagination';

// const sleep = (delay: number) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, delay);
//     })
// }

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    const pagination = response.headers['pagination'];
    if (pagination) {
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));
      return response as AxiosResponse<PaginatedResult<any>>;
    }

    return response;
    // await sleep(1000);
  },
  (error: AxiosError) => {
    handleErrorResponse(error);
    return Promise.reject(error);
  },
);

function handleErrorResponse(error: AxiosError) {
  const { data, status, config } = error.response as AxiosResponse;
  switch (status) {
    case 400:
      handleBadRequestError(data, config);
      break;
    case 401:
      handleUnauthorizedError();
      break;
    case 403:
      handleForbiddenError();
      break;
    case 404:
      handleNotFoundError();
      break;
    case 500:
      handleServerError(data);
      break;
    default:
      break;
  }
}

function handleBadRequestError(data: any, config: AxiosRequestConfig) {
  if (typeof data === 'string') {
    toast.error(data);
  } else if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
    router.navigate('/not-found');
  } else if (data.errors) {
    const modalStateErrors = Object.values(data.errors).filter((error) => error);
    throw modalStateErrors.flat();
  }
}

function handleUnauthorizedError() {
  toast.error('unauthorized');
}

function handleForbiddenError() {
  toast.error('forbidden');
}

function handleNotFoundError() {
  router.navigate('/not-found');
}

function handleServerError(data: any) {
  store.commonStore.setServerError(data);
  router.navigate('/server-error');
}

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: (params: URLSearchParams) =>
    axios.get<PaginatedResult<Activity[]>>(`/activities`, { params }).then(responseBody),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void>(`/activities`, activity),
  update: (activity: ActivityFormValues) =>
    requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user),
};

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  setMainPhoto: (id: string) => requests.post<void>(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del<void>(`/photos/${id}`),
  updateProfile: (profile: Partial<Profile>) => requests.put<void>(`/profiles`, profile),
  updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
  listFollowings: (username: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) => 
    requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
};

const agent = {
  Activities,
  Account,
  Profiles,
};

export default agent;
