import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import Modal from '../../components/admin/model.jsx';
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
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Single modal state for all operations
  const [modal, setModal] = useState({
    isOpen: false,
    type: null, // 'add-category', 'edit-category', 'add-subcategory', 'edit-subcategory'
    title: '',
    data: null,
    value: ''
  });

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ 
    isOpen: false, 
    type: null, 
    item: null 
  });

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

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Open modal for different operations
  const openModal = (type, data = null) => {
    const modalConfig = {
      'add-category': {
        title: 'Add New Category',
        value: ''
      },
      'edit-category': {
        title: 'Edit Category',
        value: data?.name || ''
      },
      'add-subcategory': {
        title: 'Add Subcategory',
        value: ''
      },
      'edit-subcategory': {
        title: 'Edit Subcategory',
        value: data?.subCategory?.name || ''
      }
    };

    setModal({
      isOpen: true,
      type,
      title: modalConfig[type].title,
      data,
      value: modalConfig[type].value
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: null,
      title: '',
      data: null,
      value: ''
    });
  };

  // Handle modal submit
  const handleModalSubmit = async () => {
    if (!modal.value.trim()) return;

    try {
      switch (modal.type) {
        case 'add-category':
          await createCategory({ name: modal.value });
          break;

        case 'edit-category':
          await updateCategoryApi(modal.data._id, modal.value);
          break;

        case 'add-subcategory':
          await addSubCategory(modal.data.categoryId, { name: modal.value });
          break;

        case 'edit-subcategory':
          await updateSubCategoryApi(
            modal.data.categoryId,
            modal.data.subCategory._id,
            modal.value
          );
          break;

        default:
          break;
      }

      closeModal();
      fetchCategories();
    } catch (error) {
      console.error('Operation failed:', error);
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  // Handle delete operations
  const handleDelete = async () => {
    try {
      if (deleteDialog.type === 'category') {
        await deleteCategoryApi(deleteDialog.item._id);
      } else if (deleteDialog.type === 'subcategory') {
        await deleteSubCategoryApi(
          deleteDialog.item.categoryId,
          deleteDialog.item.subCategoryId
        );
      }

      setDeleteDialog({ isOpen: false, type: null, item: null });
      fetchCategories();
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout title="Category Management">
      {/* Add Category Button */}
      <div className="mb-6">
        <button
          onClick={() => openModal('add-category')}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-700 rounded-full animate-spin"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-slate-500 mb-4">No categories found</p>
            <button
              onClick={() => openModal('add-category')}
              className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-sm font-medium"
            >
              Create First Category
            </button>
          </div>
        ) : (
          categories.map((category) => {
            const isExpanded = expandedCategories.has(category._id);
            const hasSubcategories = category.subCategories?.length > 0;

            return (
              <div 
                key={category._id} 
                className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                  {/* Left: Expand + Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className="flex-shrink-0 text-slate-600 hover:text-green-700 transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    {/* Category Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-slate-800 truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {category.subCategories?.length || 0} subcategories • {category.providerCount || 0} providers
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                    <button
                      onClick={() => openModal('add-subcategory', { categoryId: category._id })}
                      className="px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors font-medium"
                    >
                      Add Sub
                    </button>
                    <button
                      onClick={() => openModal('edit-category', category)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit category"
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
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories - Accordion Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-gray-200 bg-gray-50">
                    {!hasSubcategories ? (
                      // Empty State
                      <div className="px-4 py-8 text-center">
                        <p className="text-xs text-slate-500 mb-3">No subcategories yet</p>
                        <button
                          onClick={() => openModal('add-subcategory', { categoryId: category._id })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-slate-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add First Subcategory
                        </button>
                      </div>
                    ) : (
                      // Subcategories List
                      <div className="px-4 py-3 space-y-2">
                        {category.subCategories.map((sub, index) => (
                          <div
                            key={sub._id}
                            className="flex items-center justify-between px-4 py-2.5 bg-white rounded-md border border-gray-200 hover:border-green-300 transition-colors group"
                          >
                            {/* Subcategory Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Nested Indicator */}
                              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-green-500 transition-colors"></div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">
                                  {sub.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {sub.slug}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                              <button
                                onClick={() => openModal('edit-subcategory', { 
                                  categoryId: category._id, 
                                  subCategory: sub 
                                })}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                title="Edit subcategory"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteDialog({ 
                                  isOpen: true, 
                                  type: 'subcategory', 
                                  item: { 
                                    categoryId: category._id, 
                                    subCategoryId: sub._id,
                                    name: sub.name
                                  } 
                                })}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete subcategory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reusable Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        onSubmit={handleModalSubmit}
        submitText={modal.type?.includes('edit') ? 'Update' : 'Add'}
        submitDisabled={!modal.value.trim()}
      >
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {modal.type?.includes('subcategory') ? 'Subcategory Name' : 'Category Name'}
        </label>
        <input
          type="text"
          value={modal.value}
          onChange={(e) => setModal((prev) => ({ ...prev, value: e.target.value }))}
          placeholder={
            modal.type?.includes('subcategory') 
              ? 'e.g., Plumbing' 
              : 'e.g., Home Services'
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          autoFocus
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: null, item: null })}
        onConfirm={handleDelete}
        title={`Delete ${deleteDialog.type === 'category' ? 'Category' : 'Subcategory'}`}
        message={`Are you sure you want to delete ${
          deleteDialog.type === 'category'
            ? `"${deleteDialog.item?.name}"`
            : `"${deleteDialog.item?.name}"`
        }? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />
    </AdminLayout>
  );
};

export default AdminCategories;
