import axios from 'axios';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: any;
}

class Request {
  private axiosInstance: any;

  constructor(domain:string) {
    this.axiosInstance = axios.create({
      baseURL: domain,
      timeout: 5000,
    });
  }

  public async send(options: RequestOptions): Promise<any> {
    try {
      const { url, method = 'GET', data, params } = options;
      let response: any;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await this.axiosInstance.get(url, { params });
          break;
        case 'POST':
          response = await this.axiosInstance.post(url, data);
          break;
        case 'PUT':
          response = await this.axiosInstance.put(url, data);
          break;
        case 'DELETE':
          response = await this.axiosInstance.delete(url, { data });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error during API request:', error);
      throw error;
    }
  }
}

export default Request;