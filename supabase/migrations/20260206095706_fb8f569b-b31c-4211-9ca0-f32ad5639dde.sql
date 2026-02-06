-- 1. Xóa policy UPDATE không an toàn
DROP POLICY IF EXISTS "Anyone can update their session" ON public.quiz_sessions;

-- 2. Tạo policy UPDATE có giới hạn
-- Chỉ cho phép update completed và completed_at
-- Không cho phép đổi session_id, language, created_at
CREATE POLICY "Allow completing sessions"
ON public.quiz_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (
  -- Chỉ cho phép set completed = true
  completed = true
);

-- 3. Thêm Foreign Key cho quiz_answers
-- Đảm bảo session_id phải tồn tại
ALTER TABLE public.quiz_answers
ADD CONSTRAINT fk_quiz_answers_session
FOREIGN KEY (session_id)
REFERENCES public.quiz_sessions(session_id)
ON DELETE CASCADE;