# Core BI Engine

## Tiếng Việt

Core BI Engine là bộ xử lý trung tâm cho hệ thống BI report với các chức năng (Azure deployed):

- Import file HTML dạng report
- Edit data trong chart: đổi field hiển thị, đổi công thức tính toán (Sum, Max, Min, Count, Count Distinct)
- Save file report theo nội dung đã edit
- Kéo/thả các chart
- Hỗ trợ nhiều loại biểu đồ:
  - Line chart
  - Column chart
  - Bar chart
  - Donut chart
  - Table (table, matrix table)
  - Card (card, KPI card)

### Cài đặt

```bash
npm install
```

### Chạy ứng dụng

```bash
npm start
```

### Xây dựng

```bash
npm run build
```

## English

Core BI Engine is a central processing engine for BI reporting systems with the following features:

- Import HTML report files
- Edit chart data: change display fields, modify calculation formulas (Sum, Max, Min, Count, Count Distinct)
- Save report files with edited content
- Drag and drop charts
- Support for multiple chart types:
  - Line chart
  - Column chart
  - Bar chart
  - Donut chart
  - Table (standard table, matrix table)
  - Card (standard card, KPI card)

### Project Structure

```
/
├── public/               # Static files
│   └── index.html        # HTML entry point
├── src/                  # Source code
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # React components
│   │   ├── Chart/        # Chart components
│   │   └── App.tsx       # Main application component
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Business logic services
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── index.tsx         # Application entry point
│   └── index.css         # Global styles
├── .babelrc              # Babel configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── webpack.config.js     # Webpack configuration
```

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

This will start the development server at http://localhost:8080

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Features

- **HTML Import/Export**: Import existing HTML reports and export modified reports back to HTML
- **Interactive Charts**: Create and customize various chart types
- **Data Manipulation**: Add, remove, and modify datasets and fields
- **Responsive Layout**: Drag, resize, and arrange charts in the report
- **Calculation Engine**: Apply different calculation types to measures (Sum, Average, Min, Max, etc.)

### Technologies Used

- React
- TypeScript
- Chart.js
- Webpack
- Babel
