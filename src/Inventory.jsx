import { useState, useEffect } from 'react';
import { getInventoryList, createInventory, deleteInventory } from './api';

function Inventory() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    articleNo: '',
    category: '',
    brand: '',
    photo: '',
    setTotal: 0,
    sizeInSet: 0,
    sizeS: 0,
    sizeM: 0,
    sizeL: 0,
    sizeXL: 0,
    sizeXXL: 0,
    costPerPiece: 0,
    sellingCostPerPiece: 0
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
      alert('Inventory Item Added Successfully!');
      fetchItems();
      
      setFormData({
        articleNo: '', category: '', brand: '', photo: '',
        setTotal: 0, sizeInSet: 0, sizeS: 0, sizeM: 0,
        sizeL: 0, sizeXL: 0, sizeXXL: 0, costPerPiece: 0, sellingCostPerPiece: 0
      });

      e.target.reset();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item. Check if Article No already exists.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventory(id);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="h2 text-primary fw-bold mb-0">Three Threads Inventory</h1>
        <span className="badge bg-dark fs-6">Total Items: {items.length}</span>
      </div>

      {/* --- ADD ITEM FORM --- */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-light">
          <h3 className="h5 mb-0 text-secondary">Add New Inventory Item</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Primary Details Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Article No</label>
                <input type="text" className="form-control" name="articleNo" placeholder="e.g. TT-101" value={formData.articleNo} onChange={handleInputChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Category</label>
                <input type="text" className="form-control" name="category" placeholder="e.g. T-Shirt" value={formData.category} onChange={handleInputChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Brand</label>
                <input type="text" className="form-control" name="brand" placeholder="e.g. Three Threads" value={formData.brand} onChange={handleInputChange} required />
              </div>
            </div>

            {/* Pricing & Image Row */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <label className="form-label fw-semibold">Total Sets</label>
                <input type="number" className="form-control" name="setTotal" value={formData.setTotal} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Size In Set</label>
                <input type="number" className="form-control" name="sizeInSet" value={formData.sizeInSet} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Cost / Piece (₹)</label>
                <input type="number" step="0.01" className="form-control" name="costPerPiece" value={formData.costPerPiece} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Selling Price / Piece (₹)</label>
                <input type="number" step="0.01" className="form-control" name="sellingCostPerPiece" value={formData.sellingCostPerPiece} onChange={handleInputChange} />
              </div>
            </div>

            {/* File Upload Row */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Article Photo</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Loose Pieces Section */}
            <div className="bg-light p-3 rounded mb-4">
              <h5 className="h6 text-muted mb-3">Loose Pieces Breakdown</h5>
              <div className="row g-2">
                {['sizeS', 'sizeM', 'sizeL', 'sizeXL', 'sizeXXL'].map((sizeKey) => {
                  const label = sizeKey.replace('size', '');
                  return (
                    <div className="col" key={sizeKey}>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text fw-bold">{label}</span>
                        <input type="number" className="form-control" name={sizeKey} value={formData[sizeKey]} onChange={handleInputChange} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-success fw-semibold px-4">
              + Add Inventory Item
            </button>
          </form>
        </div>
      </div>

      {/* --- INVENTORY TABLE --- */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h3 className="h5 mb-0 text-secondary">Current Stock Overview</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Article No</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Total Set</th>   
                <th>Size In Set</th>
                <th>Total Qty</th>
                <th>Cost/Piece</th>
                <th>Total Cost</th>
                <th>Selling Price/Piece</th>
                <th>Selling Cost</th>
                <th>Profit Margin</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="14" className="text-center py-4 text-muted">No inventory items found. Add one above!</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold">#{item.id}</td>
                    <td>
                      {item.photo ? (
                        <img src={item.photo} alt={item.articleNo} className="rounded border object-fit-cover" style={{ width: '45px', height: '45px' }} />
                      ) : (
                        <span className="badge bg-secondary">No Image</span>
                      )}
                    </td>
                    <td><span className="badge bg-light text-dark border">{item.articleNo}</span></td>
                    <td>{item.brand}</td>
                    <td>{item.category}</td>
                    <td>{item.setTotal}</td>
                    <td>{item.sizeInSet}</td>
                    <td className="fw-semibold">{item.grandTotal}</td>
                    <td>₹{item.costPerPiece}</td>
                    <td>₹{item.totalCost}</td>
                    <td>₹{item.sellingCostPerPiece}</td>
                    <td>₹{item.sellingTotalCost}</td>
                    <td>
                      <span className={`fw-bold ${item.profitMargin >= 0 ? 'text-success' : 'text-danger'}`}>
                        ₹{item.profitMargin}
                      </span>
                    </td>
                    <td className="text-center">
                      <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger btn-sm">
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
    </div>
  );
}

export default Inventory;