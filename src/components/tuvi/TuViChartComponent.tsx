import TuViCung from './TuViCung';
import TuViInfo from './TuViInfo';
import { cn } from '@/lib/utils';

type NguHanhType = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

interface Sao { ten: string; nguHanh: NguHanhType; dacTinh: string; tuHoa?: string; id?: string; loai?: string; }
interface CungData { ten?: string; tenCung?: string; canChi?: string; diaChi?: string; nguHanh: NguHanhType; saoList?: Sao[]; danhSachSao?: Sao[]; isMain?: boolean; isThan?: boolean; isTuan?: boolean; isTriet?: boolean; daiHan?: number; id?: string; }
interface DiaBanData { cungs?: CungData[]; thapNhiCung?: CungData[]; cungMenh?: number; }
interface ThienBanData { menh?: string; than?: string; cucSo?: number; cucName?: string; cungs?: CungData[]; hoTen?: string; gioiTinh?: string; ngayDuong?: number; thangDuong?: number; namDuong?: number; ngayAm?: number; thangAm?: number; namAm?: number; canNam?: string; chiNam?: string; canNgay?: string; chiNgay?: string; gioSinh?: string; amDuongMenh?: string; amDuongNamSinh?: string; hanhCuc?: string; tenCuc?: string; hanhMenh?: string; banMenh?: string; sinhKhac?: string; menhChu?: string; thanChu?: string; }
interface TuViChart { input: any; diaBan: DiaBanData; thienBan: ThienBanData; }

interface TuViChartComponentProps { chart: TuViChart; className?: string; showInfo?: boolean; }

const getGridPosition = (index: number) => {
  const positions: Record<number, string> = { 0: 'col-start-2 row-start-4', 1: 'col-start-1 row-start-4', 2: 'col-start-1 row-start-3', 3: 'col-start-1 row-start-2', 4: 'col-start-1 row-start-1', 5: 'col-start-2 row-start-1', 6: 'col-start-3 row-start-1', 7: 'col-start-4 row-start-1', 8: 'col-start-4 row-start-2', 9: 'col-start-4 row-start-3', 10: 'col-start-4 row-start-4', 11: 'col-start-3 row-start-4' };
  return positions[index] || '';
};

const TuViChartComponent = ({ chart, className, showInfo = true }: TuViChartComponentProps) => {
  const { thienBan, diaBan } = chart;
  const cung = diaBan.thapNhiCung || diaBan.cungs || [];

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-4', className)}>
      {showInfo && <TuViInfo thienBan={thienBan} />}
      <div className="grid grid-cols-4 grid-rows-4 gap-[1px] sm:gap-0.5 bg-border/20 rounded-xl overflow-hidden border border-border/50">
        {cung.map((c, i) => (
          <div key={c.id || i} className={cn(getGridPosition(i))}>
            <TuViCung cung={c} isMenh={i === diaBan.cungMenh} position={[0, 5, 6, 11].includes(i) ? 'top' : [1, 2, 3, 4].includes(i) ? 'left' : [7, 8, 9, 10].includes(i) ? 'right' : 'corner'} />
          </div>
        ))}
        <div className="col-start-2 col-span-2 row-start-2 row-span-2 flex items-center justify-center bg-card/30 backdrop-blur-sm">
          <div className="text-center p-4"><h2 className="font-serif text-xl sm:text-2xl mystic-text-gradient">Lá Số Tử Vi</h2><p className="text-xs text-muted-foreground">{thienBan.canNam} {thienBan.chiNam}</p></div>
        </div>
      </div>
    </div>
  );
};

export default TuViChartComponent;
