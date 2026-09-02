import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInventoryList, createInventory, deleteInventory } from './api';

function Inventory({ viewMode = 'ALL' }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const initialColorState = {
    colorName: '',
    setTotal: 0,
    sizeInSet: 0,
    sizeS: 0, sizeM: 0, sizeL: 0, sizeXL: 0, sizeXXL: 0
  };

  const [formData, setFormData] = useState({
    articleNo: '',
    category: '',
    brand: '',
    photo: '',
    costPerPiece: 0,
    sellingCostPerPiece: 0,
    colors: [{ ...initialColorState }]
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getInventoryList();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle nested color array state
  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[index][field] = value;
    setFormData({ ...formData, colors: updatedColors });
  };

  const addColorRow = () => {
    if (formData.colors.length < 8) {
      setFormData({ ...formData, colors: [...formData.colors, { ...initialColorState }] });
    } else {
      alert('Maximum 8 colors allowed per article.');
    }
  };

  const removeColorRow = (index) => {
    if (formData.colors.length > 1) {
      const updatedColors = formData.colors.filter((_, i) => i !== index);
      setFormData({ ...formData, colors: updatedColors });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInventory(formData);
      alert('Inventory Article Added Successfully!');
      navigate('/inventory');
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item.');
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="h2 text-primary fw-bold mb-0">
          {viewMode === 'FORM_ONLY' ? 'Add New Article' : 'Stock Overview'}
        </h1>
        <span className="badge bg-dark fs-6">Total Articles: {items.length}</span>
      </div>

      {/* FORM MODE */}
      {viewMode === 'FORM_ONLY' && (
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-light">
            <h3 className="h5 mb-0 text-secondary">Add New Inventory Article</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Primary Details Row */}
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Article No</label>
                  <input type="text" className="form-control" name="articleNo" placeholder="e.g. TT-101" value={formData.articleNo} onChange={handleInputChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Category</label>
                  <input type="text" className="form-control" name="category" placeholder="e.g. T-Shirt" value={formData.category} onChange={handleInputChange} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Brand</label>
                  <input type="text" className="form-control" name="brand" placeholder="e.g. Three Threads" value={formData.brand} onChange={handleInputChange} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Cost / Piece (₹)</label>
                  <input type="number" step="0.01" className="form-control" name="costPerPiece" value={formData.costPerPiece} onChange={handleInputChange} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Selling Price / Piece (₹)</label>
                  <input type="number" step="0.01" className="form-control" name="sellingCostPerPiece" value={formData.sellingCostPerPiece} onChange={handleInputChange} />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Article Photo</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              </div>

              {/* Color & Size Matrix */}
              <div className="bg-light p-3 rounded mb-4 border">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="h6 text-dark fw-bold mb-0">Color Breakdown & Loose Stock (Max 8 Colors)</h5>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={addColorRow} disabled={formData.colors.length >= 8}>
                    + Add Color Variant
                  </button>
                </div>

                {formData.colors.map((colorItem, index) => (
                  <div key={index} className="card p-3 mb-3 border shadow-sm">
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2">
                        <label className="form-label text-muted small fw-bold">Color Name</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Red, Navy..." value={colorItem.colorName} onChange={(e) => handleColorChange(index, 'colorName', e.target.value)} required />
                      </div>
                      <div className="col-md-1">
                        <label className="form-label text-muted small fw-bold">Sets</label>
                        <input type="number" className="form-control form-control-sm" value={colorItem.setTotal} onChange={(e) => handleColorChange(index, 'setTotal', e.target.value)} />
                      </div>
                      <div className="col-md-1">
                        <label className="form-label text-muted small fw-bold">Size/Set</label>
                        <input type="number" className="form-control form-control-sm" value={colorItem.sizeInSet} onChange={(e) => handleColorChange(index, 'sizeInSet', e.target.value)} />
                      </div>
                      
                      {/* Loose Sizes */}
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <div className="col" key={sz}>
                          <label className="form-label text-muted small fw-bold">{sz}</label>
                          <input type="number" className="form-control form-control-sm" value={colorItem[`size${sz}`]} onChange={(e) => handleColorChange(index, `size${sz}`, e.target.value)} />
                        </div>
                      ))}

                      <div className="col-md-1 text-end mt-4">
                        {formData.colors.length > 1 && (
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeColorRow(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-success fw-semibold px-4">
                Save Article Data
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TABLE OVERVIEW MODE */}
      {viewMode === 'TABLE_ONLY' && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Article No</th>
                  <th>Photo</th>
                  <th>Brand / Category</th>
                  <th>Color Breakdown (Loose + Sets)</th>
                  <th>Grand Total Qty</th>
                  <th>Cost / Sell Price</th>
                  <th>Profit</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">No items found.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.articleNo}</td>
                      <td>
                        {item.photo ? (
                          <img src={item.photo} alt={item.articleNo} className="rounded border object-fit-cover" style={{ width: '45px', height: '45px' }} />
                        ) : (
                          <span className="badge bg-secondary">No Image</span>
                        )}
                      </td>
                      <td>
                        <div>{item.brand}</div>
                        <small className="text-muted">{item.category}</small>
                      </td>
                      <td>
                        {item.colors && item.colors.map((c, i) => (
                          <div key={i} className="small border-bottom py-1">
                            <span className="fw-bold text-primary">{c.colorName || 'Default'}:</span> {' '}
                            Sets: {c.setTotal * c.sizeInSet} | Loose: S:{c.sizeS} M:{c.sizeM} L:{c.sizeL} XL:{c.sizeXL} XXL:{c.sizeXXL}
                          </div>
                        ))}
                      </td>
                      <td className="fw-bold fs-5">{item.grandTotal}</td>
                      <td>
                        <div>Buy: ₹{item.costPerPiece}</div>
                        <div>Sell: ₹{item.sellingCostPerPiece}</div>
                      </td>
                      <td>
                        <span className={`fw-bold ${item.profitMargin >= 0 ? 'text-success' : 'text-danger'}`}>
                          ₹{item.profitMargin}
                        </span>
                      </td>
                      <td className="text-center">
                        <button onClick={() => deleteInventory(item.id).then(fetchItems)} className="btn btn-outline-danger btn-sm">
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

export default Inventory;