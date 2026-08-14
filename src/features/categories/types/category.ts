export interface CategoryRelationResponse {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CategoryListResponse {
  items: CategoryResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryResponse extends CategoryRelationResponse {
  parent?: CategoryRelationResponse | null;
  children?: CategoryRelationResponse[];
}

export interface Category extends CategoryRelationResponse {
  parent: CategoryRelationResponse | null;
  children: CategoryRelationResponse[];
}

export interface CreateCategoryRequest {
  parentId?: string;
  name: string;
  slug: string;
  isActive?: boolean;
}

export interface AdminCategoryQuery {
  keyword?: string;
  deletedOnly?: boolean;
  page?: number;
  limit?: number;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
