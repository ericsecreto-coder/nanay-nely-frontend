export type UserRole = "customer" | "admin";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type ContactStatus = "new" | "read" | "archived";

export type ContactMessage = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

export const CONTACT_STATUSES: ContactStatus[] = ["new", "read", "archived"];

export type Product = {
  id: string;
  name: string;
  origin: string;
  description: string;
  price: number;
  image_url: string;
  is_active: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type ProductInput = {
  name: string;
  origin: string;
  description: string;
  price: number;
  image_url: string;
  is_active: boolean;
  stock: number;
};

export type ProductReview = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type ProductReviewInput = {
  product_id: string;
  rating: number;
  comment: string;
};

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  customer_name: string;
  contact_number: string;
  delivery_address: string;
  notes: string | null;
  total: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

export type NotificationType = "new_order" | "order_confirmed" | "order_status" | "info";

export type Notification = {
  id: string;
  user_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  related_order_id: string | null;
  is_read: boolean;
  created_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];
