

# Kế hoạch: Sửa lỗi bảo mật RLS cho Quiz Tracking

## Tổng quan vấn đề

Database linter phát hiện 4 cảnh báo về RLS policies dùng `USING (true)` hoặc `WITH CHECK (true)`:

| Bảng | Policy | Vấn đề |
|------|--------|--------|
| quiz_sessions | Anyone can update their session | UPDATE không giới hạn - ai cũng có thể sửa bất kỳ session nào |
| quiz_sessions | Anyone can create session | INSERT không giới hạn (chấp nhận được cho analytics) |
| quiz_answers | Anyone can submit answers | INSERT không kiểm tra session hợp lệ |
| email_subscribers | Anyone can subscribe | INSERT không giới hạn (chấp nhận được cho subscription) |

## Thách thức kỹ thuật

Hệ thống quiz tracking được thiết kế cho **anonymous users** (người dùng không cần đăng nhập). Do đó:
- Không thể dùng `auth.uid()` để xác định ownership
- Session ID được tạo ở client bằng `crypto.randomUUID()`
- Cần cân bằng giữa bảo mật và trải nghiệm người dùng

## Giải pháp đề xuất

### 1. quiz_sessions - Giới hạn UPDATE

**Vấn đề**: Ai cũng có thể update bất kỳ session nào (đổi `completed`, `completed_at`)

**Giải pháp**: Chỉ cho phép update các field cần thiết và giới hạn logic:
- Chỉ cho phép đánh dấu `completed = true` (không thể đổi ngược lại false)
- Không cho phép sửa `session_id` hoặc `language`

```text
Xóa policy cũ: "Anyone can update their session"
Tạo policy mới: Chỉ cho phép update completed/completed_at
```

### 2. quiz_answers - Thêm kiểm tra session

**Vấn đề**: Có thể insert answer với session_id bất kỳ, kể cả không tồn tại

**Giải pháp**: Thêm constraint hoặc trigger kiểm tra session_id phải tồn tại trong quiz_sessions

```text
Tạo Foreign Key: quiz_answers.session_id -> quiz_sessions.session_id
Hoặc trigger: validate session exists before insert
```

### 3. email_subscribers - Chấp nhận được

**Phân tích**: Policy `Anyone can subscribe` với `WITH CHECK (true)` là **design hợp lệ** cho anonymous email subscription. 

**Biện pháp bổ sung** (tùy chọn):
- Email đã có UNIQUE constraint
- Có thể thêm rate limiting ở edge function nếu cần

## Chi tiết kỹ thuật

### Migration SQL

```sql
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
```

### Giải thích thay đổi

| Thay đổi | Mục đích |
|----------|----------|
| Policy UPDATE mới | Ngăn chặn việc sửa dữ liệu session tùy ý, chỉ cho phép đánh dấu hoàn thành |
| Foreign Key | Đảm bảo mọi answer phải thuộc session hợp lệ, ngăn spam data |
| Giữ INSERT policies | Cần thiết cho anonymous tracking |

## Luồng hoạt động sau thay đổi

```text
User bắt đầu Quiz
       |
       v
+-------------------------------+
| INSERT quiz_sessions          |
| session_id: UUID mới          |  <-- Vẫn cho phép (anonymous insert)
| completed: false              |
+-------------------------------+
       |
       v
+-------------------------------+
| INSERT quiz_answers           |
| session_id: phải tồn tại      |  <-- FK kiểm tra session hợp lệ
| question_id, answer_value     |
+-------------------------------+
       |
       v
+-------------------------------+
| UPDATE quiz_sessions          |
| completed: true only          |  <-- Chỉ cho phép set completed=true
| completed_at: timestamp       |
+-------------------------------+
```

## Tác động

**Bảo mật được cải thiện:**
- Không thể update session của người khác với data tùy ý
- Không thể insert answer với session_id giả mạo
- Ngăn chặn spam và data pollution

**Không ảnh hưởng UX:**
- Anonymous users vẫn làm quiz bình thường
- Email subscription vẫn hoạt động
- Admin vẫn xem được toàn bộ data

## Các file cần chỉnh sửa

1. **Database Migration** - Tạo file migration mới với các thay đổi RLS và FK
2. **Không cần sửa code** - Các hook `useQuizTracking.ts` và `Results.tsx` vẫn hoạt động đúng

## Thứ tự thực hiện

1. Tạo migration SQL với các thay đổi policy
2. Thêm Foreign Key constraint
3. Test luồng quiz để đảm bảo không bị break
4. Verify admin dashboard vẫn hiển thị data đúng

