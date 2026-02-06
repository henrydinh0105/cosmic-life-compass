-- Enum cho roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Bảng user_roles - quản lý quyền admin
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Bảng email_subscribers - lưu email đăng ký
CREATE TABLE public.email_subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    language text DEFAULT 'en',
    created_at timestamp with time zone DEFAULT now()
);

-- Bảng quiz_sessions - theo dõi mỗi lượt làm quiz
CREATE TABLE public.quiz_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL UNIQUE,
    language text DEFAULT 'en',
    completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);

-- Bảng quiz_answers - lưu từng câu trả lời
CREATE TABLE public.quiz_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    question_id text NOT NULL,
    answer_value text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Function kiểm tra role với SECURITY DEFINER để tránh infinite recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Enable RLS trên tất cả các bảng
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies cho user_roles
CREATE POLICY "Admin can view all roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies cho email_subscribers
CREATE POLICY "Anyone can subscribe" ON public.email_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view subscribers" ON public.email_subscribers
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage subscribers" ON public.email_subscribers
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies cho quiz_sessions
CREATE POLICY "Anyone can create session" ON public.quiz_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their session" ON public.quiz_sessions
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can view all sessions" ON public.quiz_sessions
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies cho quiz_answers
CREATE POLICY "Anyone can submit answers" ON public.quiz_answers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all answers" ON public.quiz_answers
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Indexes để tối ưu query
CREATE INDEX idx_quiz_sessions_created_at ON public.quiz_sessions(created_at);
CREATE INDEX idx_quiz_sessions_completed ON public.quiz_sessions(completed);
CREATE INDEX idx_quiz_answers_session_id ON public.quiz_answers(session_id);
CREATE INDEX idx_quiz_answers_question_id ON public.quiz_answers(question_id);
CREATE INDEX idx_email_subscribers_created_at ON public.email_subscribers(created_at);