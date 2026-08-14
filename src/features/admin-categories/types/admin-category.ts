export interface AdminCategoryQuery {
  keyword?: string;
  deletedOnly?: boolean;
  page?: number;
  limit?: number;
}
