import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "birthDate",
    question: "Bạn sinh ngày nào?",
    type: "date",
  },
  {
    id: "calendarType",
    question: "Ngày sinh trên là theo lịch nào?",
    type: "calendar-type",
    options: [
      { value: "solar", label: "Dương lịch", description: "Lịch phổ biến (Gregorian)" },
      { value: "lunar", label: "Âm lịch", description: "Lịch truyền thống Việt Nam" },
    ],
  },
  {
    id: "birthHour",
    question: "Bạn sinh vào giờ nào?",
    type: "time",
    options: [
      { value: "ty", label: "Giờ Tý", description: "23:00 - 01:00" },
      { value: "suu", label: "Giờ Sửu", description: "01:00 - 03:00" },
      { value: "dan", label: "Giờ Dần", description: "03:00 - 05:00" },
      { value: "mao", label: "Giờ Mão", description: "05:00 - 07:00" },
      { value: "thin", label: "Giờ Thìn", description: "07:00 - 09:00" },
      { value: "ti", label: "Giờ Tỵ", description: "09:00 - 11:00" },
      { value: "ngo", label: "Giờ Ngọ", description: "11:00 - 13:00" },
      { value: "mui", label: "Giờ Mùi", description: "13:00 - 15:00" },
      { value: "than", label: "Giờ Thân", description: "15:00 - 17:00" },
      { value: "dau", label: "Giờ Dậu", description: "17:00 - 19:00" },
      { value: "tuat", label: "Giờ Tuất", description: "19:00 - 21:00" },
      { value: "hoi", label: "Giờ Hợi", description: "21:00 - 23:00" },
    ],
  },
  {
    id: "gender",
    question: "Giới tính sinh học của bạn?",
    type: "select",
    options: [
      { value: "male", label: "Nam", description: "Dương mệnh trong Tử Vi" },
      { value: "female", label: "Nữ", description: "Âm mệnh trong Tử Vi" },
    ],
  },
  {
    id: "lifeFocus",
    question: "Lĩnh vực nào đang thu hút sự quan tâm của bạn nhất?",
    type: "select",
    options: [
      { value: "career", label: "Sự nghiệp", description: "Công việc và phát triển nghề nghiệp" },
      { value: "relationships", label: "Tình cảm", description: "Các mối quan hệ và tình yêu" },
      { value: "personal", label: "Bản thân", description: "Phát triển và hoàn thiện bản thân" },
      { value: "balance", label: "Cân bằng", description: "Hài hòa mọi khía cạnh cuộc sống" },
    ],
  },
  {
    id: "seekClarity",
    question: "Bạn muốn tìm hiểu rõ hơn về điều gì?",
    type: "select",
    options: [
      { value: "work", label: "Công danh", description: "Sự nghiệp và con đường phát triển" },
      { value: "love", label: "Tình duyên", description: "Nhân duyên và hôn nhân" },
      { value: "health", label: "Sức khỏe", description: "Thể chất và tinh thần" },
      { value: "purpose", label: "Mục đích sống", description: "Ý nghĩa và hướng đi" },
    ],
  },
];
