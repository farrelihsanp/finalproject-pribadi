// components/dashboard/ReportAnalysis.tsx
import { useState } from 'react';

const ReportAnalysis = () => {
  const [salesReports, setSalesReports] = useState([
    { id: 1, month: 'January', totalSales: 1500 },
    { id: 2, month: 'February', totalSales: 1800 },
    { id: 3, month: 'March', totalSales: 2000 },
  ]);

  const [stockReports, setStockReports] = useState([
    {
      id: 1,
      month: 'January',
      product: 'Apple',
      totalAdded: 100,
      totalRemoved: 50,
      stock: 150,
    },
    {
      id: 2,
      month: 'February',
      product: 'Banana',
      totalAdded: 200,
      totalRemoved: 100,
      stock: 100,
    },
    {
      id: 3,
      month: 'March',
      product: 'Carrot',
      totalAdded: 150,
      totalRemoved: 75,
      stock: 75,
    },
  ]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Report & Analysis</h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Sales Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salesReports.map((report) => (
            <div key={report.id} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-bold">{report.month}</h4>
              <p className="mt-2 text-gray-600">
                Total Sales: ${report.totalSales.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Stock Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stockReports.map((report) => (
            <div key={report.id} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-bold">{report.month}</h4>
              <p className="mt-2 text-gray-600">Product: {report.product}</p>
              <p className="mt-2 text-gray-600">
                Total Added: {report.totalAdded}
              </p>
              <p className="mt-2 text-gray-600">
                Total Removed: {report.totalRemoved}
              </p>
              <p className="mt-2 text-gray-600">Stock: {report.stock}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
