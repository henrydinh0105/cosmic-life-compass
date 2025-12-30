import { NguHanhType, Sao, DacTinhType } from '@/lib/tuvi/types';
import { cn } from '@/lib/utils';

interface TuViSaoProps {
  sao: Sao;
  compact?: boolean;
}

// Color mapping for Ngũ Hành
const nguHanhColors: Record<NguHanhType, string> = {
  Kim: 'text-slate-300',
  Mộc: 'text-green-400',
  Thủy: 'text-blue-400',
  Hỏa: 'text-orange-400',
  Thổ: 'text-amber-500',
};

// Đặc tính indicators
const dacTinhStyles: Record<DacTinhType, { text: string; color: string }> = {
  'Vượng': { text: 'V', color: 'text-green-400' },
  'Miếu': { text: 'M', color: 'text-blue-400' },
  'Đắc': { text: 'Đ', color: 'text-cyan-400' },
  'Bình': { text: 'B', color: 'text-muted-foreground' },
  'Hãm': { text: 'H', color: 'text-red-400' },
  '': { text: '', color: '' },
};

// Tứ Hóa styles
const tuHoaStyles: Record<string, { abbr: string; color: string }> = {
  'Hóa Lộc': { abbr: 'L', color: 'text-green-400' },
  'Hóa Quyền': { abbr: 'Q', color: 'text-orange-400' },
  'Hóa Khoa': { abbr: 'K', color: 'text-blue-400' },
  'Hóa Kỵ': { abbr: 'Ky', color: 'text-red-400' },
};

const TuViSao = ({ sao, compact = false }: TuViSaoProps) => {
  const isChinhTinh = sao.loai === 'Chính tinh';
  const dacTinh = dacTinhStyles[sao.dacTinh];
  const tuHoa = sao.tuHoa ? tuHoaStyles[sao.tuHoa] : null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 leading-tight',
        nguHanhColors[sao.nguHanh],
        isChinhTinh ? 'font-medium' : 'font-normal',
        compact ? 'text-[9px]' : 'text-[10px]'
      )}
    >
      <span className={isChinhTinh ? 'underline decoration-dotted underline-offset-2' : ''}>
        {sao.ten}
      </span>
      {dacTinh.text && (
        <sup className={cn('text-[7px] -top-0.5', dacTinh.color)}>
          {dacTinh.text}
        </sup>
      )}
      {tuHoa && (
        <sup className={cn('text-[7px] -top-0.5 ml-0.5', tuHoa.color)}>
          {tuHoa.abbr}
        </sup>
      )}
    </span>
  );
};

export default TuViSao;
