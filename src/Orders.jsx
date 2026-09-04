import React, { useState, useEffect } from 'react';
import { getInventoryList, getOrders, createOrder, updateOrderStatus, deleteOrder } from './api';

function Orders() {
  const [activeTab, setActiveTab] = useState('MANAGEMENT');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Customer Details
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    receiverName: '',
    shippingAddress: ''
  });

  // Order Items with Color-Specific Sets
  const [orderItems, setOrderItems] = useState([
    { inventoryId: '', articleNo: '', colorSelections: [], excludedSizes: [], pricePerPiece: 0 }
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

  const handleArticleSelect = (index, invId) => {
    const selectedInv = inventory.find((item) => item.id === Number(invId));
    const newItems = [...orderItems];
    
    if (selectedInv) {
      // Default to first available color with 1 set
      const defaultColors = selectedInv.colors[0] 
        ? [{ colorName: selectedInv.colors[0].colorName, setsOrdered: 1 }] 
        : [];

      newItems[index] = {
        ...newItems[index],
        inventoryId: selectedInv.id,
        articleNo: selectedInv.articleNo,
        colorSelections: defaultColors,
        pricePerPiece: selectedInv.sellingCostPerPiece || 0
      };
    }
    setOrderItems(newItems);
  };

  // Toggle color selection
  const handleColorToggle = (itemIndex, colorName) => {
    const newItems = [...orderItems];
    const currentSelections = newItems[itemIndex].colorSelections;
    const exists = currentSelections.find((c) => c.colorName === colorName);

    if (exists) {
      if (currentSelections.length > 1) {
        newItems[itemIndex].colorSelections = currentSelections.filter((c) => c.colorName !== colorName);
      } else {
        alert('At least one color must be selected.');
      }
    } else {
      newItems[itemIndex].colorSelections = [...currentSelections, { colorName, setsOrdered: 1 }];
    }
    setOrderItems(newItems);
  };

  // Change individual set count for a specific color
  const handleColorSetsChange = (itemIndex, colorName, sets) => {
    const newItems = [...orderItems];
    const targetColor = newItems[itemIndex].colorSelections.find((c) => c.colorName === colorName);
    if (targetColor) {
      targetColor.setsOrdered = Math.max(1, Number(sets));
    }
    setOrderItems(newItems);
  };

  const handleSizeToggle = (itemIndex, size) => {
    const newItems = [...orderItems];
    const currentExclusions = newItems[itemIndex].excludedSizes;
    
    if (currentExclusions.includes(size)) {
      newItems[itemIndex].excludedSizes = currentExclusions.filter((s) => s !== size);
    } else {
      newItems[itemIndex].excludedSizes = [...currentExclusions, size];
    }
    setOrderItems(newItems);
  };

  const addItemRow = () => {
    setOrderItems([...orderItems, { inventoryId: '', articleNo: '', colorSelections: [], excludedSizes: [], pricePerPiece: 0 }]);
  };

  const removeItemRow = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const selectedInv = inventory.find((i) => i.id === Number(item.inventoryId));
      if (!selectedInv) return total;
      
      const sizeInSet = selectedInv.colors?.[0]?.sizeInSet || 4;
      const piecesPerSet = Math.max(0, sizeInSet - item.excludedSizes.length);
      
      const totalSetsInRow = item.colorSelections.reduce((sum, c) => sum + (c.setsOrdered || 0), 0);
      return total + (totalSetsInRow * piecesPerSet * item.pricePerPiece);
    }, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Map individual color sets directly to backend payload items
    const flattenedItems = [];
    orderItems.forEach((item) => {
      item.colorSelections.forEach((colorObj) => {
        flattenedItems.push({
          inventoryId: item.inventoryId,
          articleNo: item.articleNo,
          colorName: colorObj.colorName,
          setsOrdered: colorObj.setsOrdered,
          excludedSizes: item.excludedSizes.join(','),
          pricePerPiece: item.pricePerPiece,
          itemTotal: colorObj.setsOrdered * item.pricePerPiece
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
      alert('Order Placed Successfully! Stock Auto-Adjusted per color sets.');
      setCustomerDetails({ customerName: '', customerPhone: '', customerEmail: '', receiverName: '', shippingAddress: '' });
      setOrderItems([{ inventoryId: '', articleNo: '', colorSelections: [], excludedSizes: [], pricePerPiece: 0 }]);
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

              <h6 className="fw-bold mb-3">Order Articles & Color Breakdowns</h6>
              {orderItems.map((item, idx) => {
                const selectedInv = inventory.find((i) => i.id === Number(item.inventoryId));
                return (
                  <div key={idx} className="card p-3 mb-3 bg-light border">
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Select Article</label>
                        <select className="form-select" value={item.inventoryId} onChange={(e) => handleArticleSelect(idx, e.target.value)} required>
                          <option value="">Select Article...</option>
                          {inventory.map((inv) => (
                            <option key={inv.id} value={inv.id}>{inv.articleNo} ({inv.brand})</option>
                          ))}
                        </select>
                      </div>

                      {/* Dynamic Color Selection & Color-wise Sets */}
                      <div className="col-md-5">
                        <label className="form-label small fw-bold">Colors & Color-Wise Sets</label>
                        {selectedInv?.colors?.length > 0 ? (
                          <div className="d-flex flex-column gap-2">
                            {selectedInv.colors.map((c) => {
                              const activeColor = item.colorSelections.find((sel) => sel.colorName === c.colorName);
                              const isSelected = !!activeColor;

                              return (
                                <div key={c.id || c.colorName} className="d-flex align-items-center gap-2">
                                  <button
                                    type="button"
                                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    style={{ width: '100px' }}
                                    onClick={() => handleColorToggle(idx, c.colorName)}
                                  >
                                    {c.colorName}
                                  </button>
                                  {isSelected && (
                                    <div className="input-group input-group-sm" style={{ width: '130px' }}>
                                      <span className="input-group-text">Sets:</span>
                                      <input
                                        type="number"
                                        min="1"
                                        className="form-control"
                                        value={activeColor.setsOrdered}
                                        onChange={(e) => handleColorSetsChange(idx, c.colorName, e.target.value)}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <small className="text-muted d-block mt-1">Select an article first</small>
                        )}
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small fw-bold text-danger">Exclude Sizes (Restocks to Inv)</label>
                        <div>
                          {availableSizes.map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              className={`btn btn-sm me-1 mb-1 ${item.excludedSizes.includes(sz) ? 'btn-danger' : 'btn-outline-secondary'}`}
                              onClick={() => handleSizeToggle(idx, sz)}
                            >
                              {item.excludedSizes.includes(sz) ? `No ${sz}` : sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-1 text-end">
                        {orderItems.length > 1 && (
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeItemRow(idx)}>✕</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="d-flex justify-content-between align-items-center mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={addItemRow}>+ Add Another Article Row</button>
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
                  <th>Ordered Items (Color-Wise Sets)</th>
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
                            <span className="fw-bold text-primary">{it.articleNo}</span> - <span className="fw-bold">{it.colorName}</span>: {it.setsOrdered} Sets
                            {it.excludedSizes && (
                              <span className="badge bg-warning text-dark ms-2">
                                Excluded: {it.excludedSizes}
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
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteOrder(ord.id)}>
                          Delete
                        </button>
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