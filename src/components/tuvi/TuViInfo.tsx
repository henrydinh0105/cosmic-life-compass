import { cn } from '@/lib/utils';

interface ThienBanData {
  menh?: string;
  than?: string;
  cucSo?: number;
  cucName?: string;
  hoTen?: string;
  gioiTinh?: string;
  ngayDuong?: number;
  thangDuong?: number;
  namDuong?: number;
  ngayAm?: number;
  thangAm?: number;
  namAm?: number;
  canNam?: string;
  chiNam?: string;
  canNgay?: string;
  chiNgay?: string;
  gioSinh?: string;
  amDuongMenh?: string;
  amDuongNamSinh?: string;
  hanhCuc?: string;
  tenCuc?: string;
  hanhMenh?: string;
  banMenh?: string;
  sinhKhac?: string;
  menhChu?: string;
  thanChu?: string;
}

interface TuViInfoProps {
  thienBan: ThienBanData;
  className?: string;
}

const nguHanhColors: Record<string, string> = {
  Kim: 'text-slate-300', Mộc: 'text-green-400', Thủy: 'text-blue-400', Hỏa: 'text-orange-400', Thổ: 'text-amber-500',
};

const TuViInfo = ({ thienBan, className }: TuViInfoProps) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm p-3 rounded-xl bg-card/50 border border-border/30', className)}>
      <div className="col-span-2 sm:col-span-3 text-center pb-2 border-b border-border/30">
        <h3 className="font-serif text-lg mystic-text-gradient">{thienBan.hoTen || 'Lá Số Tử Vi'}</h3>
        <p className="text-muted-foreground text-[11px]">{thienBan.gioiTinh} · {thienBan.ngayDuong}/{thienBan.thangDuong}/{thienBan.namDuong}<span className="mx-1">·</span>Giờ {thienBan.gioSinh}</p>
      </div>
      <div className="space-y-0.5"><span className="text-muted-foreground text-[10px]">Năm sinh</span><p className="font-medium">{thienBan.canNam} {thienBan.chiNam}</p></div>
      <div className="space-y-0.5"><span className="text-muted-foreground text-[10px]">Âm lịch</span><p className="font-medium">{thienBan.ngayAm}/{thienBan.thangAm}/{thienBan.namAm}</p></div>
      <div className="space-y-0.5"><span className="text-muted-foreground text-[10px]">Hướng</span><p className="font-medium">{thienBan.amDuongMenh}</p></div>
      <div className="space-y-0.5"><span className="text-muted-foreground text-[10px]">Cục</span><p className={cn('font-medium', nguHanhColors[thienBan.hanhCuc || ''])}>{thienBan.tenCuc}</p></div>
      <div className="space-y-0.5"><span className="text-muted-foreground text-[10px]">Bản mệnh</span><p className={cn('font-medium', nguHanhColors[thienBan.hanhMenh || ''])}>{thienBan.banMenh}</p></div>
      <div className="space-y-0.5"><span className="text-muted-foreground text-[10px]">Sinh khắc</span><p className="font-medium text-primary">{thienBan.sinhKhac}</p></div>
    </div>
  );
};

export default TuViInfo;
