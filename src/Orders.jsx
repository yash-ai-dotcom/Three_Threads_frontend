import React, { useState, useEffect } from 'react';
import { getInventoryList, getOrders, createOrder, updateOrderStatus, deleteOrder } from './api';

function Orders() {
  const [activeTab, setActiveTab] = useState('MANAGEMENT');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Customer & Shipping Details
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    receiverName: '',
    shippingAddress: ''
  });

  const initialLooseSizes = { sizeS: 0, sizeM: 0, sizeL: 0, sizeXL: 0, sizeXXL: 0 };

  // Article Rows with Sets and Loose Pieces per Color
  const [orderItems, setOrderItems] = useState([
    {
      inventoryId: '',
      articleNo: '',
      pricePerPiece: 0,
      colorConfigs: [] // Array of { colorName: '', setsOrdered: 1, excludedSizes: [], ...initialLooseSizes }
    }
  ]);

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, ordRes] = await Promise.all([getInventoryList(), getOrders()]);
      setInventory(invRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error('Failed to load order data:', err);
    }
  };

  const handleCustomerChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleArticleSelect = (articleIdx, invId) => {
    const selectedInv = inventory.find((item) => item.id === Number(invId));
    const newItems = [...orderItems];
    
    if (selectedInv) {
      const defaultColor = selectedInv.colors[0]?.colorName || '';
      newItems[articleIdx] = {
        inventoryId: selectedInv.id,
        articleNo: selectedInv.articleNo,
        pricePerPiece: selectedInv.sellingCostPerPiece || 0,
        colorConfigs: defaultColor 
          ? [{ colorName: defaultColor, setsOrdered: 1, excludedSizes: [], ...initialLooseSizes }] 
          : []
      };
    }
    setOrderItems(newItems);
  };

  const addColorConfig = (articleIdx) => {
    const selectedInv = inventory.find((i) => i.id === Number(orderItems[articleIdx].inventoryId));
    if (!selectedInv) return;

    const usedColors = orderItems[articleIdx].colorConfigs.map((c) => c.colorName);
    const availableColor = selectedInv.colors.find((c) => !usedColors.includes(c.colorName));

    if (!availableColor) {
      alert('All available colors for this article have already been added!');
      return;
    }

    const newItems = [...orderItems];
    newItems[articleIdx].colorConfigs.push({
      colorName: availableColor.colorName,
      setsOrdered: 1,
      excludedSizes: [],
      ...initialLooseSizes
    });
    setOrderItems(newItems);
  };

  const removeColorConfig = (articleIdx, colorIdx) => {
    const newItems = [...orderItems];
    if (newItems[articleIdx].colorConfigs.length > 1) {
      newItems[articleIdx].colorConfigs.splice(colorIdx, 1);
      setOrderItems(newItems);
    } else {
      alert('Each article must have at least one color selection.');
    }
  };

  const updateColorConfig = (articleIdx, colorIdx, field, value) => {
    const newItems = [...orderItems];
    const isNumberField = ['setsOrdered', 'sizeS', 'sizeM', 'sizeL', 'sizeXL', 'sizeXXL'].includes(field);
    newItems[articleIdx].colorConfigs[colorIdx][field] = isNumberField ? Math.max(0, Number(value)) : value;
    setOrderItems(newItems);
  };

  const handleSizeToggle = (articleIdx, colorIdx, size) => {
    const newItems = [...orderItems];
    const currentExclusions = newItems[articleIdx].colorConfigs[colorIdx].excludedSizes;
    
    if (currentExclusions.includes(size)) {
      newItems[articleIdx].colorConfigs[colorIdx].excludedSizes = currentExclusions.filter((s) => s !== size);
    } else {
      newItems[articleIdx].colorConfigs[colorIdx].excludedSizes = [...currentExclusions, size];
    }
    setOrderItems(newItems);
  };

  const addArticleRow = () => {
    setOrderItems([...orderItems, { inventoryId: '', articleNo: '', pricePerPiece: 0, colorConfigs: [] }]);
  };

  const removeArticleRow = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Calculates Grand Total: (Sets Quantity + Loose Quantity) * Price Per Piece
  const calculateTotal = () => {
    return orderItems.reduce((total, article) => {
      const selectedInv = inventory.find((i) => i.id === Number(article.inventoryId));
      if (!selectedInv) return total;
      
      const sizeInSet = selectedInv.colors?.[0]?.sizeInSet || 4;

      const articleTotal = article.colorConfigs.reduce((subTotal, color) => {
        const piecesPerSet = Math.max(0, sizeInSet - color.excludedSizes.length);
        const setPieces = color.setsOrdered * piecesPerSet;
        const loosePieces = (color.sizeS || 0) + (color.sizeM || 0) + (color.sizeL || 0) + (color.sizeXL || 0) + (color.sizeXXL || 0);
        
        return subTotal + ((setPieces + loosePieces) * article.pricePerPiece);
      }, 0);

      return total + articleTotal;
    }, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    const flattenedItems = [];
    orderItems.forEach((article) => {
      const selectedInv = inventory.find((i) => i.id === Number(article.inventoryId));
      const sizeInSet = selectedInv?.colors?.[0]?.sizeInSet || 4;

      article.colorConfigs.forEach((color) => {
        const piecesPerSet = Math.max(0, sizeInSet - color.excludedSizes.length);
        const totalSetPieces = color.setsOrdered * piecesPerSet;
        const totalLoosePieces = (color.sizeS || 0) + (color.sizeM || 0) + (color.sizeL || 0) + (color.sizeXL || 0) + (color.sizeXXL || 0);
        const totalPieces = totalSetPieces + totalLoosePieces;

        flattenedItems.push({
          inventoryId: article.inventoryId,
          articleNo: article.articleNo,
          colorName: color.colorName,
          setsOrdered: color.setsOrdered,
          excludedSizes: color.excludedSizes.join(','),
          sizeS: color.sizeS || 0,
          sizeM: color.sizeM || 0,
          sizeL: color.sizeL || 0,
          sizeXL: color.sizeXL || 0,
          sizeXXL: color.sizeXXL || 0,
          totalPiecesOrdered: totalPieces,
          pricePerPiece: article.pricePerPiece,
          itemTotal: totalPieces * article.pricePerPiece
        });
      });
    });

    const payload = {
      ...customerDetails,
      totalAmount: calculateTotal(),
      items: flattenedItems
    };

    try {
      await createOrder(payload);
      alert('Order Placed Successfully! Inventory adjusted for sets and loose pieces.');
      setCustomerDetails({ customerName: '', customerPhone: '', customerEmail: '', receiverName: '', shippingAddress: '' });
      setOrderItems([{ inventoryId: '', articleNo: '', pricePerPiece: 0, colorConfigs: [] }]);
      fetchData();
      setActiveTab('MANAGEMENT');
    } catch (err) {
      alert(err.response?.data || 'Failed to place order.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchData();
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Delete this order record?')) {
      await deleteOrder(orderId);
      fetchData();
    }
  };

  const handleDownloadInvoice = (orderId) => {
  // Replace with your actual deployed Render backend URL
  const baseUrl = 'https://your-render-backend-app-name.onrender.com';
  window.open(`${baseUrl}/api/orders/${orderId}/pdf`, '_blank');
};

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="fw-bold text-primary">🛒 Order Operations</h2>
        <div className="btn-group">
          <button 
            className={`btn ${activeTab === 'MANAGEMENT' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('MANAGEMENT')}
          >
            Order Management Table
          </button>
          <button 
            className={`btn ${activeTab === 'FORM' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('FORM')}
          >
            + Take Retail Order
          </button>
        </div>
      </div>

      {activeTab === 'FORM' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">New Retail Customer Order Entry</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitOrder}>
              {/* Customer Info */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Customer / Store Name *</label>
                  <input type="text" className="form-control" name="customerName" value={customerDetails.customerName} onChange={handleCustomerChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Phone Number *</label>
                  <input type="text" className="form-control" name="customerPhone" value={customerDetails.customerPhone} onChange={handleCustomerChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Email Address *</label>
                  <input type="email" className="form-control" name="customerEmail" value={customerDetails.customerEmail} onChange={handleCustomerChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Receiver Name (Optional)</label>
                  <input type="text" className="form-control" name="receiverName" placeholder="Same as Customer if blank" value={customerDetails.receiverName} onChange={handleCustomerChange} />
                </div>
                <div className="col-md-8">
                  <label className="form-label fw-bold">Shipping Address</label>
                  <input type="text" className="form-control" name="shippingAddress" placeholder="Full address..." value={customerDetails.shippingAddress} onChange={handleCustomerChange} />
                </div>
              </div>

              <h6 className="fw-bold mb-3">Order Articles, Color Variants & Loose Pieces</h6>
              {orderItems.map((article, artIdx) => {
                const selectedInv = inventory.find((i) => i.id === Number(article.inventoryId));
                
                return (
                  <div key={artIdx} className="card p-3 mb-3 bg-light border shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                      <div className="col-md-5">
                        <label className="form-label small fw-bold">Select Article *</label>
                        <select className="form-select" value={article.inventoryId} onChange={(e) => handleArticleSelect(artIdx, e.target.value)} required>
                          <option value="">Select Article...</option>
                          {inventory.map((inv) => (
                            <option key={inv.id} value={inv.id}>{inv.articleNo} ({inv.brand})</option>
                          ))}
                        </select>
                      </div>
                      {orderItems.length > 1 && (
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeArticleRow(artIdx)}>Remove Article</button>
                      )}
                    </div>

                    {/* Color Row Matrix */}
                    {article.colorConfigs.map((color, colIdx) => (
                      <div key={colIdx} className="card p-3 mb-2 bg-white border">
                        <div className="row g-2 align-items-center">
                          <div className="col-md-2">
                            <label className="form-label small fw-bold text-muted">Color Option</label>
                            <select 
                              className="form-select form-select-sm" 
                              value={color.colorName} 
                              onChange={(e) => updateColorConfig(artIdx, colIdx, 'colorName', e.target.value)}
                            >
                              {selectedInv?.colors?.map((c) => (
                                <option key={c.id || c.colorName} value={c.colorName}>{c.colorName}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-1">
                            <label className="form-label small fw-bold text-muted">Sets</label>
                            <input 
                              type="number" 
                              min="0" 
                              className="form-control form-control-sm" 
                              value={color.setsOrdered} 
                              onChange={(e) => updateColorConfig(artIdx, colIdx, 'setsOrdered', e.target.value)} 
                            />
                          </div>

                          {/* Loose Pieces Inputs */}
                          {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                            <div className="col" key={sz}>
                              <label className="form-label small fw-bold text-muted">Loose {sz}</label>
                              <input 
                                type="number" 
                                min="0" 
                                className="form-control form-control-sm" 
                                value={color[`size${sz}`]} 
                                onChange={(e) => updateColorConfig(artIdx, colIdx, `size${sz}`, e.target.value)} 
                              />
                            </div>
                          ))}

                          <div className="col-md-3">
                            <label className="form-label small fw-bold text-danger">Exclude Set Sizes</label>
                            <div>
                              {availableSizes.map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  className={`btn btn-sm me-1 mb-1 ${color.excludedSizes.includes(sz) ? 'btn-danger' : 'btn-outline-secondary'}`}
                                  onClick={() => handleSizeToggle(artIdx, colIdx, sz)}
                                >
                                  {color.excludedSizes.includes(sz) ? `No ${sz}` : sz}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="col-md-1 text-end">
                            {article.colorConfigs.length > 1 && (
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeColorConfig(artIdx, colIdx)}>✕</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {selectedInv && (
                      <div className="mt-2">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addColorConfig(artIdx)}>
                          + Add Another Color for {article.articleNo}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="d-flex justify-content-between align-items-center mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={addArticleRow}>+ Add Another Article</button>
                <div className="text-end">
                  <h4 className="fw-bold text-success mb-2">Grand Total: ₹{calculateTotal().toFixed(2)}</h4>
                  <button type="submit" className="btn btn-success btn-lg px-5">Submit Order</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'MANAGEMENT' && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Invoice & Buyer</th>
                  <th>Shipping Details</th>
                  <th>Ordered Breakdown (Sets + Loose)</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No customer orders recorded yet.</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <span className="badge bg-secondary mb-1">{ord.invoiceNo}</span>
                        <div className="fw-bold">{ord.customerName}</div>
                        <small className="text-muted d-block">{ord.customerPhone}</small>
                        <small className="text-muted d-block">{ord.customerEmail}</small>
                      </td>
                      <td>
                        <div className="fw-semibold">{ord.receiverName || ord.customerName}</div>
                        <small className="text-muted">{ord.shippingAddress || 'N/A'}</small>
                      </td>
                      <td>
                        {ord.items.map((it, i) => (
                          <div key={i} className="small border-bottom py-1">
                            <span className="fw-bold text-primary">{it.articleNo}</span> - <span className="fw-bold">{it.colorName}</span>:
                            <span className="ms-1">Sets: {it.setsOrdered}</span>
                            <span className="ms-2 text-secondary">
                              (Loose: S:{it.sizeS || 0} M:{it.sizeM || 0} L:{it.sizeL || 0} XL:{it.sizeXL || 0} XXL:{it.sizeXXL || 0})
                            </span>
                            {it.excludedSizes && (
                              <span className="badge bg-warning text-dark ms-2">
                                Excluded Set Sizes: {it.excludedSizes}
                              </span>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="fw-bold text-success">₹{ord.totalAmount}</td>
                      <td>
                        <select 
                          className="form-select form-select-sm fw-bold"
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button 
                            className="btn btn-outline-primary btn-sm me-1" 
                            onClick={() => handleDownloadInvoice(ord.id)}
                          >
                            📄 PDF Invoice
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteOrder(ord.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;