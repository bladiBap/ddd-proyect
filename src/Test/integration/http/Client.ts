import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type Method,
} from 'axios';

export class HttpClientBuilder {
	private baseUrl = 'http://localhost:3000';
	private relativeUrl = '/';
	private method: Method = 'GET';
	private body: unknown = undefined;
	private headers: Record<string, string> = {};

	withUrl(url: string, method: Method = 'GET') {
		this.baseUrl = url.replace(/\/+$/, '');
		this.method = method;
		return this;
	}

	withRequestBody(
		body: unknown,
		relativeUrl: string,
		method: Method = 'POST'
	) {
		this.body = body;
		this.relativeUrl = relativeUrl.startsWith('/')
			? relativeUrl
			: `/${relativeUrl}`;
		this.method = method;
		return this;
	}

	withHeader(key: string, value: string) {
		this.headers[key] = value;
		return this;
	}

	async send<T>(): Promise<AxiosResponse<T>> {
		const client: AxiosInstance = axios.create({ baseURL: this.baseUrl });

		return client.request<T>({
			url: this.relativeUrl,
			method: this.method,
			data: this.body,
			headers: this.headers,
			validateStatus: () => true,
		});
	}
}
