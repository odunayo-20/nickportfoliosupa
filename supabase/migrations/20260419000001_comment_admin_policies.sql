-- Allow authenticated admin users to update comments
CREATE POLICY "Admins can update comments"
ON comments FOR UPDATE
USING (auth.role() = 'authenticated');

-- Allow authenticated admin users to delete comments
CREATE POLICY "Admins can delete comments"
ON comments FOR DELETE
USING (auth.role() = 'authenticated');
