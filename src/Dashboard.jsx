import React, { useState, useEffect } from 'react';
import { getDashboardMetrics } from './api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await getDashboardMetrics();
      setMetrics(res.data);
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Calculating inventory & sales performance metrics...</p>
      </div>
    );
  }

  if (!metrics) return <div className="container py-4">Failed to load performance metrics.</div>;

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 text-dark fw-bold mb-0">📊 Performance & Profitability Dashboard</h1>
          <p className="text-muted mb-0">Real-time inventory valuation, revenue execution, and net profit analysis.</p>
        </div>
        <button onClick={fetchMetrics} className="btn btn-outline-dark btn-sm fw-bold">🔄 Refresh Metrics</button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {/* Stock Valuation Card */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-dark text-white p-3">
            <small className="text-uppercase fw-bold text-muted">Total Stock Valuation (Buy Cost)</small>
            <h3 className="fw-bold text-warning mb-1">₹{metrics.totalStockCostValuation?.toLocaleString('en-IN')}</h3>
            <small className="text-light">{metrics.totalStockPieces} total pieces in warehouse</small>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white p-3">
            <small className="text-uppercase fw-bold text-white-50">Gross Revenue Collected</small>
            <h3 className="fw-bold mb-1">₹{metrics.totalRevenue?.toLocaleString('en-IN')}</h3>
            <small>{metrics.totalUnitsSold} items sold across {metrics.totalOrdersPlaced} orders</small>
          </div>
        </div>

        {/* Operational Expenses Card */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-danger text-white p-3">
            <small className="text-uppercase fw-bold text-white-50">Operational Expenses</small>
            <h3 className="fw-bold mb-1">₹{metrics.totalOperationalExpenses?.toLocaleString('en-IN')}</h3>
            <small>Utilities, Rent, Payroll & Freight</small>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="col-md-3">
          <div className={`card border-0 shadow-sm p-3 text-white ${metrics.netProfitOrLoss >= 0 ? 'bg-success' : 'bg-danger'}`}>
            <small className="text-uppercase fw-bold text-white-50">Net P&L (Revenue - OpEx)</small>
            <h3 className="fw-bold mb-1">₹{metrics.netProfitOrLoss?.toLocaleString('en-IN')}</h3>
            <small>{metrics.netProfitOrLoss >= 0 ? 'Positive Operating Margin' : 'Operating at a Loss'}</small>
          </div>
        </div>
      </div>

      {/* Stock Performance Breakdown Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
          <span>📋 Article Stock & Sales Execution Breakdown</span>
          <span className="badge bg-primary">{metrics.articlePerformances?.length || 0} Unique Articles</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Article No</th>
                  <th>Category / Brand</th>
                  <th>Buy Cost / Piece</th>
                  <th>Sell Price / Piece</th>
                  <th>In-Stock Qty</th>
                  <th>Stock Valuation (Cost)</th>
                  <th>Stock Valuation (Sell)</th>
                  <th>Units Sold</th>
                  <th className="text-end">Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {metrics.articlePerformances?.map((art) => (
                  <tr key={art.articleNo}>
                    <td className="fw-bold">{art.articleNo}</td>
                    <td>
                      <div>{art.brand}</div>
                      <small className="text-muted">{art.category}</small>
                    </td>
                    <td>₹{art.costPerPiece}</td>
                    <td>₹{art.sellingCostPerPiece}</td>
                    <td>
                      <span className={`badge ${art.inStockQty > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {art.inStockQty} pcs
                      </span>
                    </td>
                    <td>₹{art.totalStockBuyCost?.toLocaleString('en-IN')}</td>
                    <td className="fw-bold text-primary">₹{art.totalStockSellValuation?.toLocaleString('en-IN')}</td>
                    <td className="fw-bold">{art.unitsSold} pcs</td>
                    <td className="text-end fw-bold text-success">
                      ₹{art.totalRevenueGenerated?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}