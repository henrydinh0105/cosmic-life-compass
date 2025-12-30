import { CungData, NguHanhType } from '@/lib/tuvi/types';
import TuViSao from './TuViSao';
import { cn } from '@/lib/utils';

interface TuViCungProps {
  cung: CungData;
  isMenh?: boolean;
  position: 'top' | 'bottom' | 'left' | 'right' | 'corner';
}

// Ngũ Hành border colors
const nguHanhBorderColors: Record<NguHanhType, string> = {
  Kim: 'border-slate-500/50',
  Mộc: 'border-green-500/50',
  Thủy: 'border-blue-500/50',
  Hỏa: 'border-orange-500/50',
  Thổ: 'border-amber-500/50',
};

const nguHanhBgColors: Record<NguHanhType, string> = {
  Kim: 'bg-slate-500/5',
  Mộc: 'bg-green-500/5',
  Thủy: 'bg-blue-500/5',
  Hỏa: 'bg-orange-500/5',
  Thổ: 'bg-amber-500/5',
};

const TuViCung = ({ cung, isMenh = false, position }: TuViCungProps) => {
  // Group stars by type
  const chinhTinh = cung.danhSachSao.filter(s => s.loai === 'Chính tinh');
  const phuTinh = cung.danhSachSao.filter(s => s.loai !== 'Chính tinh');

  return (
    <div
      className={cn(
        'relative flex flex-col p-1.5 sm:p-2 border border-border/50 min-h-[100px] sm:min-h-[120px] overflow-hidden transition-all duration-300',
        nguHanhBorderColors[cung.nguHanh],
        nguHanhBgColors[cung.nguHanh],
        isMenh && 'ring-1 ring-primary/50 bg-primary/5',
        cung.isThan && 'ring-1 ring-accent/50',
        'hover:bg-card/50'
      )}
    >
      {/* Header: Cung name and Địa Chi */}
      <div className="flex justify-between items-start mb-1 flex-shrink-0">
        <span className={cn(
          'text-[10px] sm:text-xs font-serif',
          isMenh ? 'text-primary font-medium' : 'text-muted-foreground'
        )}>
          {cung.tenCung}
          {cung.isThan && <span className="ml-1 text-accent">(Thân)</span>}
        </span>
        <span className="text-[9px] text-muted-foreground/70">
          {cung.diaChi}
        </span>
      </div>

      {/* Main stars (Chính tinh) */}
      {chinhTinh.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mb-1">
          {chinhTinh.map((s, i) => (
            <TuViSao key={`chinh-${s.id}-${i}`} sao={s} />
          ))}
        </div>
      )}

      {/* Minor stars (Phụ tinh) */}
      {phuTinh.length > 0 && (
        <div className="flex flex-wrap gap-x-1 gap-y-0.5 text-[9px]">
          {phuTinh.slice(0, 6).map((s, i) => (
            <TuViSao key={`phu-${s.id}-${i}`} sao={s} compact />
          ))}
          {phuTinh.length > 6 && (
            <span className="text-muted-foreground/50 text-[8px]">
              +{phuTinh.length - 6}
            </span>
          )}
        </div>
      )}

      {/* Footer: Đại Hạn */}
      <div className="mt-auto pt-1 flex justify-between items-end text-[8px] text-muted-foreground/60">
        <span>{cung.daiHan}-{cung.daiHan + 9}</span>
        {(cung.isTuan || cung.isTriet) && (
          <span className={cn(
            'px-1 py-0.5 rounded text-[7px]',
            cung.isTuan ? 'bg-muted text-muted-foreground' : 'bg-destructive/20 text-destructive'
          )}>
            {cung.isTuan ? 'Tuần' : 'Triệt'}
          </span>
        )}
      </div>
    </div>
  );
};

export default TuViCung;
