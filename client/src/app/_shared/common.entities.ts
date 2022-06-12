export interface ApiResponse {
    message: string;
}

export interface PaginationResponse<T> {
    data: T;
    totalRecords: number;
}