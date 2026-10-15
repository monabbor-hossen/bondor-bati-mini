/**
 * types/index.ts
 *
 * Shared TypeScript types for the Bondor Bati Next.js application.
 * These mirror the database schema (database/schema.sql) exactly
 * and are the single source of truth used by both API routes
 * and the Flutter app's Dart models.
 */

// ─── Menu ─────────────────────────────────────────────────────────────────────

export type MenuTier = 'standard' | 'premium';

export interface MenuItem {
  id: number;
  day_index: number; // 0 = Saturday … 5 = Thursday
  day_name: string;  // Day name, e.g. 'Sat'
  tier: MenuTier;
  name: string;
  description: string;
  price: number;     // in BDT (integer)
  emoji: string;
  image_url: string | null;
  is_available: boolean;
  created_at: string; // ISO 8601
  updated_at: string;
}

export interface WeeklyMenuDay {
  day_index: number;
  day_name: string;
  items: MenuItem[];
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number | null;
  item_name: string;
  tier: string;
  unit_price: number;
  quantity: number;
  plan_days: number;
  line_total: number;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string; // e.g. "BB-123456-ABCDEF"
  customer_name: string;
  phone: string;
  address: string;
  delivery_date: string; // "YYYY-MM-DD"
  plan_days: number;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// ─── Create Order Request (Flutter → API) ─────────────────────────────────────

export interface CreateOrderItemInput {
  item_id: number;
  quantity: number;
  plan_days: number;
}

export interface CreateOrderInput {
  customer_name: string;
  phone: string;
  address: string;
  delivery_date: string; // "YYYY-MM-DD"
  notes?: string;
  idempotency_key: string; // UUID, prevents duplicate orders
  items: CreateOrderItemInput[];
}

// ─── Catering Bookings ────────────────────────────────────────────────────────

export type CateringStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface CateringBooking {
  id: number;
  booking_number: string;
  menu_name: string;
  guest_count: number;
  client_name: string;
  phone: string;
  event_date: string; // ISO datetime
  venue: string;
  notes: string | null;
  status: CateringStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateCateringInput {
  menu_name: string;
  guest_count: number;
  client_name: string;
  phone: string;
  event_date: string;
  venue: string;
  notes?: string;
}

// ─── Catering Menus ───────────────────────────────────────────────────────────

export interface CateringMenu {
  id: number;
  category: string;  // e.g. "Wedding", "Corporate"
  badge_text: string;
  title: string;
  items: string;     // comma-separated list of included items
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Testimonials / Success Stories ───────────────────────────────────────────

export interface SuccessStory {
  id: number;
  client_name: string;
  avatar_url?: string | null;
  rating: number; // 1–5
  content: string;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Admin Users ──────────────────────────────────────────────────────────────

export type AdminRole = 'superadmin' | 'manager';

export interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // password_hash is intentionally omitted — never expose to client
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardCounts {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;       // sum of delivered order totals
  catering_pending: number;
  total_menu_items: number;
  total_testimonials: number;
}

export interface RevenuePoint {
  date: string; // "YYYY-MM-DD"
  revenue: number;
}

// ─── API Envelope (mirrors lib/api-response.ts) ───────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: Record<string, string> | null;
  meta: Record<string, unknown> | null;
}

// ─── Top Marquee Scrolling Bar Notices ────────────────────────────────────────

export interface MarqueeNotice {
  id: number;
  text: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
