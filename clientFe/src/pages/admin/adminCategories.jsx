import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { 
  getAdminCategoriesApi, 
  updateCategoryApi, 
  deleteCategoryApi,
  updateSubCategoryApi,
  deleteSubCategoryApi
} from '../../api/admin.api.js';
import { createCategory, addSubCategory } from '../../api/categories.api.js';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Modals
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState({ isOpen: false, category: null });
  const [addSubCategoryModal, setAddSubCategoryModal] = useState({ isOpen: false, categoryId: null });
  const [editSubCategoryModal, setEditSubCategoryModal] = useState({ isOpen: false, categoryId: null, subCategory: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, type: null, item: null });

  // Form states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [editSubCategoryName, setEditSubCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategoriesApi();
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategory({ name: newCategoryName });
      setAddCategoryModal(false);
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
      alert(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !editCategoryModal.category) return;

    try {
      await updateCategoryApi(editCategoryModal.category._id, editCategoryName);
      setEditCategoryModal({ isOpen: false, category: null });
      setEditCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      alert(error.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategoryApi(categoryId);
      setDeleteDialog({ isOpen: false, type: null, item: null });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategoryName.trim() || !addSubCategoryModal.categoryId) return;

    try {
      await addSubCategory(addSubCategoryModal.categoryId, { name: newSubCategoryName });
      setAddSubCategoryModal({ isOpen: false, categoryId: null });
      setNewSubCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      alert(error.response?.data?.message || 'Failed to add subcategory');
    }
  };

  const handleEditSubCategory = async () => {
    if (!editSubCategoryName.trim() || !editSubCategoryModal.categoryId || !editSubCategoryModal.subCategory) return;

    try {
      await updateSubCategoryApi(
        editSubCategoryModal.categoryId,
        editSubCategoryModal.subCategory._id,
        editSubCategoryName
      );
      setEditSubCategoryModal({ isOpen: false, categoryId: null, subCategory: null });
      setEditSubCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to update subcategory:', error);
      alert(error.response?.data?.message || 'Failed to update subcategory');
    }
  };

  const handleDeleteSubCategory = async (categoryId, subCategoryId) => {
    try {
      await deleteSubCategoryApi(categoryId, subCategoryId);
      setDeleteDialog({ isOpen: false, type: null, item: null });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete subcategory:', error);
      alert(error.response?.data?.message || 'Failed to delete subcategory');
    }
  };

  return (
    <AdminLayout title="Category Management">
      {/* Add Category Button */}
      <div className="mb-6">
        <button
          onClick={() => setAddCategoryModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-slate-500">No categories found</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg border border-gray-200">
              {/* Category Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category._id ? null : category._id)}
                    className="text-green-700 hover:text-green-800 transition-colors"
                  >
                    <FolderTree className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-lg font-medium text-slate-800">{category.name}</h3>
                    <p className="text-sm text-slate-500">
                      {category.subCategories?.length || 0} subcategories • {category.providerCount || 0} providers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAddSubCategoryModal({ isOpen: true, categoryId: category._id })}
                    className="px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors font-medium"
                  >
                    Add Subcategory
                  </button>
                  <button
                    onClick={() => {
                      setEditCategoryModal({ isOpen: true, category });
                      setEditCategoryName(category.name);
                    }}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ 
                      isOpen: true, 
                      type: 'category', 
                      item: category 
                    })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategory === category._id && (
                <div className="px-6 py-4">
                  {category.subCategories?.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No subcategories</p>
                  ) : (
                    <div className="space-y-2">
                      {category.subCategories.map((sub) => (
                        <div
                          key={sub._id}
                          className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-800">{sub.name}</p>
                            <p className="text-xs text-slate-500">Slug: {sub.slug}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditSubCategoryModal({ 
                                  isOpen: true, 
                                  categoryId: category._id, 
                                  subCategory: sub 
                                });
                                setEditSubCategoryName(sub.name);
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteDialog({ 
                                isOpen: true, 
                                type: 'subcategory', 
                                item: { category, subCategory: sub } 
                              })}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      {addCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800">Add New Category</h3>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Home Services"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setAddCategoryModal(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editCategoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800">Edit Category</h3>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setEditCategoryModal({ isOpen: false, category: null });
                  setEditCategoryName('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {addSubCategoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800">Add Subcategory</h3>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subcategory Name
              </label>
              <input
                type="text"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                placeholder="e.g., Plumbing"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setAddSubCategoryModal({ isOpen: false, categoryId: null });
                  setNewSubCategoryName('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800"
              >
                Add Subcategory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {editSubCategoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800">Edit Subcategory</h3>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subcategory Name
              </label>
              <input
                type="text"
                value={editSubCategoryName}
                onChange={(e) => setEditSubCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setEditSubCategoryModal({ isOpen: false, categoryId: null, subCategory: null });
                  setEditSubCategoryName('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: null, item: null })}
        onConfirm={() => {
          if (deleteDialog.type === 'category') {
            handleDeleteCategory(deleteDialog.item._id);
          } else if (deleteDialog.type === 'subcategory') {
            handleDeleteSubCategory(
              deleteDialog.item.category._id,
              deleteDialog.item.subCategory._id
            );
          }
        }}
        title={`Delete ${deleteDialog.type === 'category' ? 'Category' : 'Subcategory'}`}
        message={`Are you sure you want to delete ${
          deleteDialog.type === 'category'
            ? deleteDialog.item?.name
            : deleteDialog.item?.subCategory?.name
        }? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />
    </AdminLayout>
  );
};

export default AdminCategories;