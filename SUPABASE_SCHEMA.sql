-- Run this SQL in your Supabase SQL Editor
-- This aligns permissions with the Schema you provided

-- 1. Ensure RLS is enabled on ALL tables shown in your schema
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY; -- Changed from shop_menu
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY; -- Corrected table name

-- 2. Create Policies for Admin/Anon access
-- Dropping old ones to be clean (optional but recommended if re-running)
DROP POLICY IF EXISTS "admin_select_shops" ON shops;
DROP POLICY IF EXISTS "admin_insert_shops" ON shops;
DROP POLICY IF EXISTS "admin_update_shops" ON shops;
DROP POLICY IF EXISTS "admin_delete_shops" ON shops;

DROP POLICY IF EXISTS "admin_select_users" ON users;
DROP POLICY IF EXISTS "admin_insert_users" ON users;
DROP POLICY IF EXISTS "admin_update_users" ON users;
DROP POLICY IF EXISTS "admin_delete_users" ON users;

DROP POLICY IF EXISTS "admin_select_orders" ON orders;
DROP POLICY IF EXISTS "admin_insert_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
DROP POLICY IF EXISTS "admin_delete_orders" ON orders;

DROP POLICY IF EXISTS "admin_select_delivery" ON delivery_profiles;
DROP POLICY IF EXISTS "admin_insert_delivery" ON delivery_profiles;
DROP POLICY IF EXISTS "admin_update_delivery" ON delivery_profiles;
DROP POLICY IF EXISTS "admin_delete_delivery" ON delivery_profiles;

-- Note: using 'menu_items' table now
DROP POLICY IF EXISTS "admin_select_menu" ON menu_items;
DROP POLICY IF EXISTS "admin_insert_menu" ON menu_items;
DROP POLICY IF EXISTS "admin_update_menu" ON menu_items;
DROP POLICY IF EXISTS "admin_delete_menu" ON menu_items;

DROP POLICY IF EXISTS "admin_select_auth" ON shop_auth;
DROP POLICY IF EXISTS "admin_insert_auth" ON shop_auth;
DROP POLICY IF EXISTS "admin_update_auth" ON shop_auth;
DROP POLICY IF EXISTS "admin_delete_auth" ON shop_auth;


-- Create New OPEN Policies
-- shops
create policy "admin_select_shops" ON shops for select using (true);
create policy "admin_insert_shops" ON shops for insert with check (true);
create policy "admin_update_shops" ON shops for update using (true);
create policy "admin_delete_shops" ON shops for delete using (true);

-- users
create policy "admin_select_users" ON users for select using (true);
create policy "admin_insert_users" ON users for insert with check (true);
create policy "admin_update_users" ON users for update using (true);
create policy "admin_delete_users" ON users for delete using (true);

-- orders
create policy "admin_select_orders" ON orders for select using (true);
create policy "admin_insert_orders" ON orders for insert with check (true);
create policy "admin_update_orders" ON orders for update using (true);
create policy "admin_delete_orders" ON orders for delete using (true);

-- delivery_profiles
create policy "admin_select_delivery" ON delivery_profiles for select using (true);
create policy "admin_insert_delivery" ON delivery_profiles for insert with check (true);
create policy "admin_update_delivery" ON delivery_profiles for update using (true);
create policy "admin_delete_delivery" ON delivery_profiles for delete using (true);

-- menu_items (The new table name)
create policy "admin_select_menu" ON menu_items for select using (true);
create policy "admin_insert_menu" ON menu_items for insert with check (true);
create policy "admin_update_menu" ON menu_items for update using (true);
create policy "admin_delete_menu" ON menu_items for delete using (true);

-- shop_auth
create policy "admin_select_auth" ON shop_auth for select using (true);
create policy "admin_insert_auth" ON shop_auth for insert with check (true);
create policy "admin_update_auth" ON shop_auth for update using (true);
create policy "admin_delete_auth" ON shop_auth for delete using (true);

-- 3. Comments for Clarity
COMMENT ON TABLE menu_items IS 'Stores food menu items linked to shops';
