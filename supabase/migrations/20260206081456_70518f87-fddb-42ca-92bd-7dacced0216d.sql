-- Function to search users by email (admin only)
CREATE OR REPLACE FUNCTION public.search_users_by_email(search_term text)
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Return matching users
  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    u.created_at
  FROM auth.users u
  WHERE u.email ILIKE '%' || search_term || '%'
  ORDER BY u.created_at DESC
  LIMIT 20;
END;
$$;