import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TuViChartComponent } from '@/components/tuvi';
import { lapLaSoTuVi, TuViChart, TuViInput } from '@/lib/tuvi';
import { toast } from 'sonner';

const gioSinhOptions = [
  { value: 1, label: 'Tý (23h-1h)' },
  { value: 2, label: 'Sửu (1h-3h)' },
  { value: 3, label: 'Dần (3h-5h)' },
  { value: 4, label: 'Mão (5h-7h)' },
  { value: 5, label: 'Thìn (7h-9h)' },
  { value: 6, label: 'Tỵ (9h-11h)' },
  { value: 7, label: 'Ngọ (11h-13h)' },
  { value: 8, label: 'Mùi (13h-15h)' },
  { value: 9, label: 'Thân (15h-17h)' },
  { value: 10, label: 'Dậu (17h-19h)' },
  { value: 11, label: 'Tuất (19h-21h)' },
  { value: 12, label: 'Hợi (21h-23h)' },
];

const TuViDemo = () => {
  const [hoTen, setHoTen] = useState('');
  const [ngay, setNgay] = useState('');
  const [thang, setThang] = useState('');
  const [nam, setNam] = useState('');
  const [gioSinh, setGioSinh] = useState('1');
  const [gioiTinh, setGioiTinh] = useState('1');
  const [duongLich, setDuongLich] = useState('true');
  const [chart, setChart] = useState<TuViChart | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!hoTen || !ngay || !thang || !nam) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const ngayNum = parseInt(ngay);
    const thangNum = parseInt(thang);
    const namNum = parseInt(nam);

    if (isNaN(ngayNum) || isNaN(thangNum) || isNaN(namNum)) {
      toast.error('Ngày, tháng, năm phải là số');
      return;
    }

    if (ngayNum < 1 || ngayNum > 31 || thangNum < 1 || thangNum > 12) {
      toast.error('Ngày hoặc tháng không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const input: TuViInput = {
        ngay: ngayNum,
        thang: thangNum,
        nam: namNum,
        gioSinh: parseInt(gioSinh),
        gioiTinh: parseInt(gioiTinh),
        hoTen,
        duongLich: duongLich === 'true',
        timeZone: 7,
      };

      const result = lapLaSoTuVi(input);
      setChart(result);
      toast.success('Lập lá số thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi lập lá số');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif text-center mb-6 mystic-text-gradient">
          Lập Lá Số Tử Vi
        </h1>

        {/* Form */}
        <div className="bg-card/50 border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Họ tên */}
            <div className="space-y-2">
              <Label htmlFor="hoten">Họ và tên</Label>
              <Input
                id="hoten"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                placeholder="Nhập họ tên"
              />
            </div>

            {/* Ngày */}
            <div className="space-y-2">
              <Label htmlFor="ngay">Ngày sinh</Label>
              <Input
                id="ngay"
                type="number"
                min="1"
                max="31"
                value={ngay}
                onChange={(e) => setNgay(e.target.value)}
                placeholder="1-31"
              />
            </div>

            {/* Tháng */}
            <div className="space-y-2">
              <Label htmlFor="thang">Tháng sinh</Label>
              <Input
                id="thang"
                type="number"
                min="1"
                max="12"
                value={thang}
                onChange={(e) => setThang(e.target.value)}
                placeholder="1-12"
              />
            </div>

            {/* Năm */}
            <div className="space-y-2">
              <Label htmlFor="nam">Năm sinh</Label>
              <Input
                id="nam"
                type="number"
                min="1900"
                max="2100"
                value={nam}
                onChange={(e) => setNam(e.target.value)}
                placeholder="1990"
              />
            </div>

            {/* Giờ sinh */}
            <div className="space-y-2">
              <Label>Giờ sinh</Label>
              <Select value={gioSinh} onValueChange={setGioSinh}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gioSinhOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Giới tính */}
            <div className="space-y-2">
              <Label>Giới tính</Label>
              <RadioGroup value={gioiTinh} onValueChange={setGioiTinh} className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="nam" />
                  <Label htmlFor="nam" className="cursor-pointer">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="-1" id="nu" />
                  <Label htmlFor="nu" className="cursor-pointer">Nữ</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Loại lịch */}
            <div className="space-y-2">
              <Label>Loại lịch</Label>
              <RadioGroup value={duongLich} onValueChange={setDuongLich} className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="duong" />
                  <Label htmlFor="duong" className="cursor-pointer">Dương lịch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="am" />
                  <Label htmlFor="am" className="cursor-pointer">Âm lịch</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit button */}
            <div className="flex items-end">
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Đang lập...' : 'Lập Lá Số'}
              </Button>
            </div>
          </div>
        </div>

        {/* Chart display */}
        {chart && (
          <TuViChartComponent chart={chart} />
        )}
      </div>
    </div>
  );
};

export default TuViDemo;
