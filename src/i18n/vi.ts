const translations: Record<string, string> = {
  // Start page
  'start.title': 'Bạn đang ở giai đoạn nào của cuộc sống?',
  'start.subtitle': 'Khám phá nhịp sống hiện tại qua trí tuệ phương Đông',
  'start.button': 'Bắt Đầu Hành Trình',
  
  // Quiz page
  'quiz.back': 'Quay lại',
  'quiz.next': 'Tiếp tục',
  'quiz.submit': 'Xem Kết Quả',
  'quiz.skip': 'Bỏ qua câu hỏi này',
  'quiz.step': 'Bước',
  'quiz.of': 'trên',
  
  // Quiz questions
  'quiz.birthDate': 'Hành trình của bạn bắt đầu khi nào?',
  'quiz.birthTime': 'Bạn sinh vào giờ nào?',
  'quiz.gender': 'Bạn xác định mình như thế nào?',
  'quiz.lifeFocus': 'Lĩnh vực nào của cuộc sống đang gọi tên bạn nhiều nhất?',
  'quiz.currentAttention': 'Điều gì đang thu hút sự chú ý của bạn nhất lúc này?',
  'quiz.seekClarity': 'Bạn tìm kiếm sự rõ ràng ở đâu?',
  
  // Birth time options
  'quiz.morning': 'Buổi sáng',
  'quiz.morning.desc': '6:00 - 12:00',
  'quiz.afternoon': 'Buổi chiều',
  'quiz.afternoon.desc': '12:00 - 18:00',
  'quiz.evening': 'Buổi tối',
  'quiz.evening.desc': '18:00 - 24:00',
  'quiz.night': 'Đêm khuya',
  'quiz.night.desc': '0:00 - 6:00',
  'quiz.unknown': 'Tôi không chắc',
  'quiz.unknown.desc': 'Không sao, chúng tôi sẽ làm việc với những gì có',
  
  // Gender options
  'quiz.feminine': 'Năng lượng Âm',
  'quiz.feminine.desc': 'Xu hướng Âm tính',
  'quiz.masculine': 'Năng lượng Dương',
  'quiz.masculine.desc': 'Xu hướng Dương tính',
  'quiz.balanced': 'Cân bằng',
  'quiz.balanced.desc': 'Hài hòa Âm Dương',
  'quiz.preferNot': 'Không muốn nói',
  'quiz.preferNot.desc': 'Chúng tôi sẽ phân tích tổng quát',
  
  // Life focus options
  'quiz.career': 'Sự nghiệp & Mục đích',
  'quiz.career.desc': 'Phát triển nghề nghiệp và công việc ý nghĩa',
  'quiz.relationships': 'Các mối quan hệ',
  'quiz.relationships.desc': 'Kết nối với người thân yêu',
  'quiz.personal': 'Phát triển bản thân',
  'quiz.personal.desc': 'Khám phá bản thân và phát triển nội tâm',
  'quiz.balance': 'Cân bằng cuộc sống',
  'quiz.balance.desc': 'Hài hòa trong mọi lĩnh vực',
  
  // Current attention options
  'quiz.stability': 'Ổn định',
  'quiz.stability.desc': 'Xây dựng nền tảng vững chắc',
  'quiz.change': 'Thay đổi',
  'quiz.change.desc': 'Đón nhận hướng đi mới',
  'quiz.growth': 'Phát triển',
  'quiz.growth.desc': 'Mở rộng tầm nhìn',
  'quiz.rest': 'Nghỉ ngơi',
  'quiz.rest.desc': 'Phục hồi và tái tạo năng lượng',
  
  // Seek clarity options
  'quiz.work': 'Công việc & Sự nghiệp',
  'quiz.work.desc': 'Con đường nghề nghiệp và quyết định',
  'quiz.love': 'Tình yêu & Kết nối',
  'quiz.love.desc': 'Những vấn đề của trái tim',
  'quiz.health': 'Sức khỏe & Sinh lực',
  'quiz.health.desc': 'Sức khỏe thể chất và tinh thần',
  'quiz.purpose': 'Mục đích sống',
  'quiz.purpose.desc': 'Ý nghĩa và phương hướng',
  
  // Results page
  'results.title': 'Nhận Định Cuộc Sống',
  'results.personality': 'Chân Dung Tính Cách',
  'results.coreNature': 'Bản Chất Cốt Lõi',
  'results.coreNature.subtitle': 'Cách bạn tự nhiên suy nghĩ, phản ứng và quyết định',
  'results.naturalStrength': 'Thế Mạnh Tự Nhiên',
  'results.naturalStrength.subtitle': 'Lợi thế độc đáo của bạn khi cân bằng',
  'results.blindSpot': 'Điểm Mù',
  'results.blindSpot.subtitle': 'Nơi bạn vô tình tự giới hạn bản thân',
  'results.innerTension': 'Xung Đột Nội Tâm',
  'results.innerTension.subtitle': 'Mâu thuẫn bên trong bạn thường trải qua',
  'results.growthDirection': 'Hướng Phát Triển',
  'results.growthDirection.subtitle': 'Cách cân bằng được khôi phục',
  
  'results.recognition': 'Mức Độ Nhận Ra Bản Thân',
  'results.recognition.subtitle': 'Mức độ phản ánh này phù hợp với trải nghiệm sống của bạn',
  'results.recognition.20': 'Hầu như không phù hợp',
  'results.recognition.40': 'Có phần quen thuộc',
  'results.recognition.60': 'Phần lớn chính xác',
  'results.recognition.80': 'Rất gần',
  'results.recognition.100': 'Chính xác đến mức khó tin',
  'results.recognition.message': 'Nếu phản ánh này phù hợp, việc hiểu thời điểm có thể quan trọng như việc hiểu chính mình.',
  
  'results.lifeEnergy': 'Bản Đồ Năng Lượng Sống',
  'results.currentState': 'Trạng Thái Hiện Tại',
  'results.guidance': 'Hướng Dẫn',
  
  'results.achievement': 'Thành Tựu & Công Nhận',
  'results.achievement.desc': 'Động lực của bạn cho thành tựu và sự công nhận',
  'results.connection': 'Mối Quan Hệ & Kết Nối',
  'results.connection.desc': 'Cách bạn gắn kết và duy trì các mối quan hệ',
  'results.emotional': 'Cân Bằng Nội Tâm & Cảm Xúc',
  'results.emotional.desc': 'Sự hài hòa bên trong và ổn định cảm xúc',
  'results.support': 'Hỗ Trợ & Nguồn Lực',
  'results.support.desc': 'Sự giúp đỡ và nguồn lực dành cho bạn',
  'results.direction': 'Phương Hướng & Mục Đích',
  'results.direction.desc': 'Ý nghĩa và con đường cuộc sống của bạn',
  
  'results.overall': 'Nhận Định Tổng Quan',
  'results.reflection': 'Câu Hỏi Suy Ngẫm',
  
  'results.guidance2026': 'Hướng Dẫn Hàng Tháng 2026',
  'results.guidance2026.subtitle': 'Nhận thông tin về thời điểm được cá nhân hóa mỗi tháng',
  'results.email.placeholder': 'Nhập email của bạn',
  'results.email.button': 'Nhận Thông Tin Hàng Tháng',
  'results.email.success': 'Cảm ơn bạn! Hãy chờ đợi thông tin đầu tiên sớm nhé.',
  'results.email.privacy': 'Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào.',
  
  'results.startOver': 'Bắt Đầu Lại',
  
  // Balance levels
  'balance.low': 'Thấp',
  'balance.moderate': 'Trung bình',
  'balance.strong': 'Mạnh',
  
  // Loading
  'loading.title': 'Đang phân tích xu hướng của bạn...',
  'loading.subtitle': 'Tham vấn trí tuệ phương Đông',
  
  // Common
  'common.loading': 'Đang tải...',
  'common.error': 'Đã có lỗi xảy ra',
};

export default translations;
