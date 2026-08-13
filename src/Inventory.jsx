import { useState, useEffect } from 'react';
import { getInventoryList, createInventory, deleteInventory } from './api';

function Inventory() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    articleNo: '',
    category: '',
    brand: '',
    photo: '', // Base64 string
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

  // Convert uploaded image file to Base64 string
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
      
      // Reset form including photo
      setFormData({
        articleNo: '', category: '', brand: '', photo: '',
        setTotal: 0, sizeInSet: 0, sizeS: 0, sizeM: 0,
        sizeL: 0, sizeXL: 0, sizeXXL: 0, costPerPiece: 0, sellingCostPerPiece: 0
      });

      // Clear file input
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Three Threads Inventory</h1>

      {/* --- ADD ITEM FORM --- */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Add New Item</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <input type="text" name="articleNo" placeholder="Article No" value={formData.articleNo} onChange={handleInputChange} required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
          <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleInputChange} required />
          
          <label>
            Article Photo:
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'block', marginTop: '5px' }} />
          </label>

          <label>Sets Total: <input type="number" name="setTotal" value={formData.setTotal} onChange={handleInputChange} /></label>
          <label>Size In Set: <input type="number" name="sizeInSet" value={formData.sizeInSet} onChange={handleInputChange} /></label>
          <label>Cost/Piece: <input type="number" step="0.01" name="costPerPiece" value={formData.costPerPiece} onChange={handleInputChange} /></label>
          <label>Selling Price/Piece: <input type="number" step="0.01" name="sellingCostPerPiece" value={formData.sellingCostPerPiece} onChange={handleInputChange} /></label>
        </div>

        <h4>Loose Pieces</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <label>S: <input type="number" name="sizeS" value={formData.sizeS} onChange={handleInputChange} style={{ width: '50px' }} /></label>
          <label>M: <input type="number" name="sizeM" value={formData.sizeM} onChange={handleInputChange} style={{ width: '50px' }} /></label>
          <label>L: <input type="number" name="sizeL" value={formData.sizeL} onChange={handleInputChange} style={{ width: '50px' }} /></label>
          <label>XL: <input type="number" name="sizeXL" value={formData.sizeXL} onChange={handleInputChange} style={{ width: '50px' }} /></label>
          <label>XXL: <input type="number" name="sizeXXL" value={formData.sizeXXL} onChange={handleInputChange} style={{ width: '50px' }} /></label>
        </div>

        <button type="submit" style={{ marginTop: '15px', padding: '10px 15px', cursor: 'pointer' }}>Add Inventory Item</button>
      </form>

      {/* --- INVENTORY TABLE --- */}
      <h3>Current Stock</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>ID</th>
            <th>Photo</th>
            <th>Article No</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Grand Total Qty</th>
            <th>Total Cost</th>
            <th>Selling Cost</th>
            <th>Profit Margin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.photo ? (
                  <img src={item.photo} alt={item.articleNo} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{item.articleNo}</td>
              <td>{item.brand}</td>
              <td>{item.category}</td>
              <td>{item.grandTotal}</td>
              <td>₹{item.totalCost}</td>
              <td>₹{item.sellingTotalCost}</td>
              <td style={{ color: item.profitMargin >= 0 ? 'green' : 'red' }}>₹{item.profitMargin}</td>
              <td>
                <button onClick={() => handleDelete(item.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;