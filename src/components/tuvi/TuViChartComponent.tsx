import { TuViChart } from '@/lib/tuvi/types';
import TuViCung from './TuViCung';
import TuViInfo from './TuViInfo';
import { cn } from '@/lib/utils';

interface TuViChartComponentProps {
  chart: TuViChart;
  className?: string;
  showInfo?: boolean;
}

/**
 * Tử Vi Chart Layout (Traditional 12 Palace Grid)
 * 
 * Layout positions (0-11):
 * 
 *    [4]  [5]  [6]  [7]
 *    [3]  CENTER   [8]
 *    [2]  CENTER   [9]
 *    [1]  [0]  [11] [10]
 * 
 * Địa Chi mapping:
 *   0=Tý, 1=Sửu, 2=Dần, 3=Mão, 4=Thìn, 5=Tỵ
 *   6=Ngọ, 7=Mùi, 8=Thân, 9=Dậu, 10=Tuất, 11=Hợi
 */

const TuViChartComponent = ({ chart, className, showInfo = true }: TuViChartComponentProps) => {
  const { thienBan, diaBan } = chart;
  const cung = diaBan.thapNhiCung;

  // Helper to get position class in grid
  const getGridPosition = (index: number) => {
    const positions: Record<number, string> = {
      0: 'col-start-2 row-start-4',   // Tý - bottom middle-left
      1: 'col-start-1 row-start-4',   // Sửu - bottom left
      2: 'col-start-1 row-start-3',   // Dần - left middle-bottom
      3: 'col-start-1 row-start-2',   // Mão - left middle-top
      4: 'col-start-1 row-start-1',   // Thìn - top left corner
      5: 'col-start-2 row-start-1',   // Tỵ - top middle-left
      6: 'col-start-3 row-start-1',   // Ngọ - top middle-right
      7: 'col-start-4 row-start-1',   // Mùi - top right corner
      8: 'col-start-4 row-start-2',   // Thân - right middle-top
      9: 'col-start-4 row-start-3',   // Dậu - right middle-bottom
      10: 'col-start-4 row-start-4',  // Tuất - bottom right
      11: 'col-start-3 row-start-4',  // Hợi - bottom middle-right
    };
    return positions[index] || '';
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-4', className)}>
      {/* Chart Info Header */}
      {showInfo && <TuViInfo thienBan={thienBan} />}

      {/* Main Chart Grid */}
      <div className="grid grid-cols-4 grid-rows-4 gap-[1px] sm:gap-0.5 bg-border/20 rounded-xl overflow-hidden border border-border/50">
        {/* 12 Cung around the edge */}
        {cung.map((c, i) => (
          <div key={c.id} className={cn(getGridPosition(i))}>
            <TuViCung
              cung={c}
              isMenh={i === diaBan.cungMenh}
              position={
                [0, 5, 6, 11].includes(i) ? 'top' :
                [1, 2, 3, 4].includes(i) ? 'left' :
                [7, 8, 9, 10].includes(i) ? 'right' : 'corner'
              }
            />
          </div>
        ))}

        {/* Center area (spans 2x2) */}
        <div className="col-start-2 col-span-2 row-start-2 row-span-2 flex items-center justify-center bg-card/30 backdrop-blur-sm">
          <div className="text-center p-4">
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-primary/20 animate-pulse-slow" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border border-primary/10 animate-rotate-slow" />
              </div>
              
              {/* Center content */}
              <div className="relative z-10 space-y-2">
                <h2 className="font-serif text-xl sm:text-2xl mystic-text-gradient">
                  Lá Số Tử Vi
                </h2>
                <p className="text-xs text-muted-foreground">
                  {thienBan.canNam} {thienBan.chiNam}
                </p>
                <div className="flex justify-center gap-3 text-[10px] text-muted-foreground/70">
                  <span>🌙 {thienBan.ngayAm}/{thienBan.thangAm}</span>
                  <span>☀️ {thienBan.ngayDuong}/{thienBan.thangDuong}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground/70">
        <span><span className="text-green-400">V</span>=Vượng</span>
        <span><span className="text-blue-400">M</span>=Miếu</span>
        <span><span className="text-cyan-400">Đ</span>=Đắc</span>
        <span><span className="text-muted-foreground">B</span>=Bình</span>
        <span><span className="text-red-400">H</span>=Hãm</span>
        <span className="border-l border-border/30 pl-4">
          <span className="text-green-400">L</span>=Hóa Lộc
        </span>
        <span><span className="text-orange-400">Q</span>=Hóa Quyền</span>
        <span><span className="text-blue-400">K</span>=Hóa Khoa</span>
        <span><span className="text-red-400">Ky</span>=Hóa Kỵ</span>
      </div>
    </div>
  );
};

export default TuViChartComponent;
