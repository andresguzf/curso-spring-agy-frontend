export interface UserDto {
  id: number;
  email: string;
  roles: string; // e.g. "ROLE_USER" or "ROLE_USER,ROLE_ADMIN"
}

export interface UserCreateDto {
  email: string;
  password?: string;
  roles?: string;
}

export interface CustomerDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface InvoiceItemDto {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceDto {
  id?: number;
  customerId: number;
  amount: number;
  description?: string;
  status: string;
  items?: InvoiceItemDto[];
}
