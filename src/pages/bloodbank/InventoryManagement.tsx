import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodInventoryItem, BloodGroup, BloodComponent } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Building2,
  Save,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv, getTodayDateString } from '../../utils/csvExport';

export const InventoryManagement: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [filterComponent, setFilterComponent] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BloodInventoryItem | null>(null);

  // New inventory form state
  const [newGroup, setNewGroup] = useState<BloodGroup>('O+');
  const [newComponent, setNewComponent] = useState<BloodComponent>('Whole Blood');
  const [newUnits, setNewUnits] = useState<number>(5);
  const [newVolume, setNewVolume] = useState<number>(450);
  const [newCollectionDate, setNewCollectionDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [newExpiryDate, setNewExpiryDate] = useState<string>(
    new Date(Date.now() + 35 * 86400000).toISOString().slice(0, 10)
  );
  const [newTestingStatus, setNewTestingStatus] = useState<BloodInventoryItem['testingStatus']>('Tested & Cleared');
  const [newStorage, setNewStorage] = useState('Cold Vault A - Rack 3');

  const filteredInventory = inventory.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = item.unitCode.toLowerCase().includes(q);
      const matchGroup = item.bloodGroup.toLowerCase().includes(q);
      const matchStorage = item.locationStorage.toLowerCase().includes(q);
      if (!matchCode && !matchGroup && !matchStorage) return false;
    }
    if (filterGroup !== 'All' && item.bloodGroup !== filterGroup) return false;
    if (filterComponent !== 'All' && item.component !== filterComponent) return false;
    if (filterStatus !== 'All' && item.testingStatus !== filterStatus) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      bloodBankId: currentUser.id,
      bloodBankName: currentUser.name,
      bloodGroup: newGroup,
      component: newComponent,
      quantityUnits: Number(newUnits),
      volumeMl: Number(newVolume),
      collectionDate: newCollectionDate,
      expiryDate: newExpiryDate,
      testingStatus: newTestingStatus,
      availability: 'Available',
      locationStorage: newStorage,
      isLowStock: Number(newUnits) < 5,
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateInventoryItem(editingItem.id, {
      quantityUnits: Number(editingItem.quantityUnits),
      testingStatus: editingItem.testingStatus,
      availability: editingItem.availability,
      locationStorage: editingItem.locationStorage,
      isLowStock: Number(editingItem.quantityUnits) < 5,
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Cold Vault Blood Inventory Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track quarantined batches, tested clinical units, temperature chambers, and near-expiry reserves.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => {
              exportToCsv(
                `BloodLink_Inventory_${getTodayDateString()}`,
                filteredInventory,
                [
                  { header: 'Unit Code', accessor: 'unitCode' },
                  { header: 'Blood Group', accessor: 'bloodGroup' },
                  { header: 'Component', accessor: 'component' },
                  { header: 'Units', accessor: 'quantityUnits' },
                  { header: 'Total Volume (mL)', accessor: (i) => i.volumeMl || i.quantityUnits * 450 },
                  { header: 'Collection Date', accessor: 'collectionDate' },
                  { header: 'Expiry Date', accessor: 'expiryDate' },
                  { header: 'Testing Status', accessor: 'testingStatus' },
                  { header: 'Availability', accessor: 'availability' },
                  { header: 'Storage Vault Location', accessor: 'locationStorage' },
                ]
              );
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 shadow-md shadow-red-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Inventory Batch
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search barcode or vault rack..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
          </div>

          {/* Blood group */}
          <div>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Blood Groups</option>
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                <option key={bg} value={bg}>
                  Blood Group {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Component */}
          <div>
            <select
              value={filterComponent}
              onChange={(e) => setFilterComponent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Components</option>
              <option value="Whole Blood">Whole Blood</option>
              <option value="Red Blood Cells">Red Blood Cells (RBC)</option>
              <option value="Platelets">Platelets</option>
              <option value="Fresh Frozen Plasma">Fresh Frozen Plasma</option>
              <option value="Cryoprecipitate">Cryoprecipitate</option>
            </select>
          </div>

          {/* Testing Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="All">All Testing Statuses</option>
              <option value="Tested & Cleared">Tested & Cleared</option>
              <option value="Pending Serology">Pending Serology</option>
              <option value="Quarantine">Quarantine</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Batch Barcode</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Component</th>
                <th className="py-3.5 px-4">In-Stock Quantity</th>
                <th className="py-3.5 px-4">Collection Date</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Serology Status</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.unitCode}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.locationStorage}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="blood" size="sm">
                      {item.bloodGroup}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.component}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {item.quantityUnits} Units
                      </span>
                      {item.quantityUnits < 5 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {item.collectionDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {item.expiryDate}
                      </span>
                      {item.isNearExpiry && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                          Near Expiry
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {item.testingStatus === 'Tested & Cleared' ? (
                      <Badge variant="success" size="sm" dot>
                        Cleared
                      </Badge>
                    ) : item.testingStatus === 'Pending Serology' ? (
                      <Badge variant="warning" size="sm" dot>
                        Testing
                      </Badge>
                    ) : (
                      <Badge variant="danger" size="sm" dot>
                        Quarantine
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        item.availability === 'Available'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.availability}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit batch record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteInventoryItem(item.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Discard unit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Inventory Batch Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Register Inbound Blood Unit Batch"
          subtitle="Generate cold vault barcodes and record donor serology details."
          maxWidth="lg"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Blood Group *
                </label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Blood Component *
                </label>
                <select
                  value={newComponent}
                  onChange={(e) => setNewComponent(e.target.value as BloodComponent)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Red Blood Cells">Red Blood Cells</option>
                  <option value="Platelets">Platelets</option>
                  <option value="Fresh Frozen Plasma">Fresh Frozen Plasma</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quantity Units *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newUnits}
                  onChange={(e) => setNewUnits(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Unit Volume (mL)
                </label>
                <input
                  type="number"
                  value={newVolume}
                  onChange={(e) => setNewVolume(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Collection Date *
                </label>
                <input
                  type="date"
                  value={newCollectionDate}
                  onChange={(e) => setNewCollectionDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Expiration Date *
                </label>
                <input
                  type="date"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Testing & Serology Status
                </label>
                <select
                  value={newTestingStatus}
                  onChange={(e) => setNewTestingStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Tested & Cleared">Tested & Cleared</option>
                  <option value="Pending Serology">Pending Serology</option>
                  <option value="Quarantine">Quarantine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cold Vault Chamber / Rack
                </label>
                <input
                  type="text"
                  value={newStorage}
                  onChange={(e) => setNewStorage(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md"
              >
                <Save className="w-4 h-4" /> Save Batch Units
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Inventory Item Modal */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title={`Edit Batch: ${editingItem.unitCode}`}
          subtitle={`${editingItem.bloodGroup} • ${editingItem.component}`}
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quantity Units In Vault
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={editingItem.quantityUnits}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, quantityUnits: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Serology Testing Status
              </label>
              <select
                value={editingItem.testingStatus}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, testingStatus: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Tested & Cleared">Tested & Cleared</option>
                <option value="Pending Serology">Pending Serology</option>
                <option value="Quarantine">Quarantine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Availability Status
              </label>
              <select
                value={editingItem.availability}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, availability: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Vault Storage Location
              </label>
              <input
                type="text"
                value={editingItem.locationStorage}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, locationStorage: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blood-600 hover:bg-blood-700 rounded-xl shadow-md"
              >
                Update Batch
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
