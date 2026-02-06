

# Kế hoạch: Trang Quản Trị cho Eastern Life Insight

## Tổng quan

Tạo một trang quản trị đầy đủ chức năng để:
- Xem danh sách email khách hàng đã đăng ký nhận hướng dẫn hàng tháng
- Thống kê chi tiết số lượng người dùng và lượt truy cập
- Theo dõi số lượt click vào từng lựa chọn trong mỗi câu hỏi quiz

---

## Cấu trúc Database

### Bảng 1: `email_subscribers`
Lưu trữ email khách hàng đăng ký

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | uuid | Primary key |
| email | text | Email khách hàng (unique) |
| language | text | Ngôn ngữ đã chọn |
| created_at | timestamp | Thời điểm đăng ký |

### Bảng 2: `quiz_sessions`
Lưu trữ mỗi lượt làm quiz

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | uuid | Primary key |
| session_id | text | ID phiên unique |
| language | text | Ngôn ngữ sử dụng |
| completed | boolean | Đã hoàn thành quiz chưa |
| created_at | timestamp | Thời điểm bắt đầu |
| completed_at | timestamp | Thời điểm hoàn thành |

### Bảng 3: `quiz_answers`
Lưu trữ từng câu trả lời

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | uuid | Primary key |
| session_id | text | Liên kết với quiz_sessions |
| question_id | text | ID câu hỏi (birthDate, gender, lifeFocus, etc.) |
| answer_value | text | Giá trị lựa chọn |
| created_at | timestamp | Thời điểm trả lời |

### Bảng 4: `user_roles`
Quản lý quyền admin (theo tiêu chuẩn bảo mật)

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | uuid | Primary key |
| user_id | uuid | Liên kết với auth.users |
| role | app_role enum | admin / user |

---

## Tính năng Admin Dashboard

### 1. Bảng điều khiển tổng quan
- Tổng số người dùng làm quiz
- Số lượt hoàn thành quiz
- Tỷ lệ hoàn thành (%)
- Số email đăng ký
- Biểu đồ xu hướng theo ngày/tuần/tháng

### 2. Quản lý Email Subscribers
- Bảng danh sách email với thời gian đăng ký
- Lọc theo ngôn ngữ
- Tìm kiếm email
- Xuất danh sách (CSV)

### 3. Phân tích Quiz
- Thống kê chi tiết từng câu hỏi
- Số lượt click vào từng lựa chọn
- Biểu đồ tròn/cột hiển thị tỷ lệ
- So sánh theo thời gian

### 4. Xác thực Admin
- Đăng nhập bằng email/password
- Bảo vệ trang admin bằng RLS
- Chỉ user có role "admin" mới truy cập được

---

## Các file cần tạo/sửa

### Database
- Migration: Tạo các bảng và RLS policies
- Function: `has_role()` để kiểm tra quyền admin

### Frontend

**Trang mới:**
- `src/pages/admin/Login.tsx` - Đăng nhập admin
- `src/pages/admin/Dashboard.tsx` - Trang chính admin
- `src/pages/admin/EmailSubscribers.tsx` - Quản lý email
- `src/pages/admin/QuizAnalytics.tsx` - Phân tích quiz

**Components mới:**
- `src/components/admin/AdminLayout.tsx` - Layout chung
- `src/components/admin/StatsCard.tsx` - Card thống kê
- `src/components/admin/AnswerChart.tsx` - Biểu đồ câu trả lời
- `src/components/admin/EmailTable.tsx` - Bảng email

**Hooks mới:**
- `src/hooks/useAdminAuth.ts` - Xác thực admin
- `src/hooks/useAnalytics.ts` - Lấy dữ liệu thống kê

### Cập nhật file hiện có
- `src/App.tsx` - Thêm routes admin
- `src/pages/Results.tsx` - Lưu email vào database
- `src/hooks/useQuiz.ts` - Lưu session và answers vào database

---

## Luồng hoạt động

```text
+-------------------+     +------------------+     +-------------------+
|   User làm quiz   | --> | Lưu quiz_session | --> | Lưu quiz_answers  |
+-------------------+     +------------------+     +-------------------+
         |
         v
+-------------------+     +------------------+
|  User đăng ký     | --> | Lưu email_       |
|  nhận email       |     | subscribers      |
+-------------------+     +------------------+

+-------------------+     +------------------+     +-------------------+
|  Admin đăng nhập  | --> | Kiểm tra role    | --> | Hiển thị          |
|                   |     | trong user_roles |     | Dashboard         |
+-------------------+     +------------------+     +-------------------+
```

---

## Bảo mật

1. **RLS Policies:**
   - Các bảng tracking chỉ cho phép INSERT public (anonymous)
   - SELECT chỉ dành cho admin role

2. **Admin Role:**
   - Sử dụng function `has_role()` với SECURITY DEFINER
   - Không lưu role trong localStorage

3. **Email Privacy:**
   - Email được lưu trữ an toàn
   - Chỉ admin mới xem được

---

## Chi tiết kỹ thuật

### Database Migration

```sql
-- Enum cho roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Bảng user_roles
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Bảng email_subscribers
CREATE TABLE public.email_subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    language text DEFAULT 'en',
    created_at timestamp with time zone DEFAULT now()
);

-- Bảng quiz_sessions
CREATE TABLE public.quiz_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL UNIQUE,
    language text DEFAULT 'en',
    completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);

-- Bảng quiz_answers
CREATE TABLE public.quiz_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    question_id text NOT NULL,
    answer_value text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Function kiểm tra role
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

-- RLS Policies
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert email
CREATE POLICY "Anyone can subscribe" ON public.email_subscribers
    FOR INSERT WITH CHECK (true);

-- Policy: Only admin can view emails
CREATE POLICY "Admin can view subscribers" ON public.email_subscribers
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Similar policies for quiz data...
```

### Tracking Integration

Khi user làm quiz, tự động:
1. Tạo session_id unique (UUID)
2. Lưu mỗi câu trả lời vào quiz_answers
3. Cập nhật completed khi hoàn thành

### Admin Dashboard Components

- Sử dụng Recharts (đã cài đặt) cho biểu đồ
- Sử dụng Table components cho danh sách
- Responsive design cho mobile

---

## Thứ tự thực hiện

1. Tạo database schema và RLS policies
2. Cập nhật useQuiz.ts để tracking answers
3. Cập nhật Results.tsx để lưu email
4. Tạo auth flow cho admin
5. Tạo layout và components admin
6. Tạo trang Dashboard với thống kê
7. Tạo trang Email Subscribers
8. Tạo trang Quiz Analytics với biểu đồ
9. Thêm routes vào App.tsx
10. Test toàn bộ luồng

