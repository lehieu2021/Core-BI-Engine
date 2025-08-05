# Dữ liệu mẫu cho ứng dụng Core BI Engine

File `sampleData.ts` cung cấp dữ liệu mẫu để kiểm thử ứng dụng Core BI Engine. Dữ liệu này bao gồm các dataset và cấu hình biểu đồ mẫu.

## Cách sử dụng

### 1. Import dữ liệu mẫu

```typescript
import { salesDataset, hrDataset, sampleCharts, sampleReport } from './data/sampleData';
```

### 2. Sử dụng dataset mẫu

```typescript
// Sử dụng dataset bán hàng
const salesData = salesDataset;

// Sử dụng dataset nhân sự
const hrData = hrDataset;
```

### 3. Sử dụng biểu đồ mẫu

```typescript
// Sử dụng một biểu đồ cụ thể
const columnChart = sampleCharts[0]; // Biểu đồ cột doanh số theo danh mục
const lineChart = sampleCharts[1];   // Biểu đồ đường doanh số theo ngày
```

### 4. Sử dụng báo cáo mẫu hoàn chỉnh

```typescript
// Sử dụng báo cáo mẫu
const report = sampleReport;
```

## Tích hợp với useReport hook

Bạn có thể sử dụng dữ liệu mẫu với hook `useReport` như sau:

```typescript
import { useReport } from '../hooks/useReport';
import { sampleReport } from '../data/sampleData';

function YourComponent() {
  // Khởi tạo report với dữ liệu mẫu
  const { report, setReport, addChart, removeChart, updateChart } = useReport();
  
  // Sử dụng dữ liệu mẫu khi cần
  const loadSampleData = () => {
    setReport(sampleReport);
  };
  
  return (
    <div>
      <button onClick={loadSampleData}>Tải dữ liệu mẫu</button>
      {/* Phần còn lại của component */}
    </div>
  );
}
```

## Mô tả dữ liệu mẫu

### Dataset bán hàng (salesDataset)

Dữ liệu về doanh số bán hàng theo sản phẩm, danh mục, khu vực và thời gian.

### Dataset nhân sự (hrDataset)

Dữ liệu về nhân sự theo phòng ban, chức vụ, giới tính, tuổi, lương và kinh nghiệm.

### Biểu đồ mẫu (sampleCharts)

1. Biểu đồ cột: Doanh số theo danh mục sản phẩm
2. Biểu đồ đường: Doanh số theo ngày
3. Biểu đồ tròn: Doanh số theo khu vực
4. Biểu đồ thanh ngang: Lương trung bình theo phòng ban
5. Bảng dữ liệu: Chi tiết dữ liệu bán hàng