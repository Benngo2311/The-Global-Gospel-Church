import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Edit2, Trash2, Folder, FileText, Check, X, Save } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface AdminSermonDashboardProps {
  sermons: any[];
  groups: any[];
}

export const AdminSermonDashboard: React.FC<AdminSermonDashboardProps> = ({ sermons, groups }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'sermons' | 'groups'>('sermons');
  
  // State for forms
  const [editingSermon, setEditingSermon] = useState<any | null>(null);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);

  // Stats
  const totalSermons = sermons.length;
  const publishedSermons = sermons.filter(s => s.status === 'published').length;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Dashboard Header Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('sermons')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'sermons' ? 'bg-slate-50 text-church-red border-b-2 border-church-red' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          {t({ en: 'Manage Sermons', vi: 'Quản Lý Bài Giảng' })}
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'groups' ? 'bg-slate-50 text-church-red border-b-2 border-church-red' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          {t({ en: 'Manage Groups', vi: 'Quản Lý Chủ Đề' })}
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'sermons' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t({ en: 'Sermons', vi: 'Bài Giảng' })}</h2>
                <p className="text-sm text-slate-500">
                  {t({ en: `Total: ${totalSermons} (${publishedSermons} published)`, vi: `Tổng: ${totalSermons} (${publishedSermons} đã xuất bản)` })}
                </p>
              </div>
              <button
                onClick={() => setEditingSermon({
                  title: '', preacher: '', sermonDate: new Date().toISOString().split('T')[0], status: 'draft', groupId: ''
                })}
                className="flex items-center gap-2 px-4 py-2 bg-church-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={16} />
                {t({ en: 'Add Sermon', vi: 'Thêm Bài Giảng' })}
              </button>
            </div>

            {editingSermon ? (
              <SermonForm 
                sermon={editingSermon} 
                groups={groups} 
                onClose={() => setEditingSermon(null)} 
              />
            ) : (
              <SermonList sermons={sermons} onEdit={setEditingSermon} />
            )}
          </div>
        )}

        {activeTab === 'groups' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t({ en: 'Series & Groups', vi: 'Loạt Bài & Chủ Đề' })}</h2>
              </div>
              <button
                onClick={() => setEditingGroup({ name: '', customOrder: 0 })}
                className="flex items-center gap-2 px-4 py-2 bg-church-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={16} />
                {t({ en: 'Add Group', vi: 'Thêm Chủ Đề' })}
              </button>
            </div>

            {editingGroup ? (
              <GroupForm 
                group={editingGroup} 
                onClose={() => setEditingGroup(null)} 
              />
            ) : (
              <GroupList groups={groups} onEdit={setEditingGroup} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub components ---

const SermonForm = ({ sermon, groups, onClose }: any) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(sermon);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const selectedGroup = groups.find((g: any) => g.id === formData.groupId);
      const payload = {
        ...formData,
        groupName: selectedGroup ? selectedGroup.name : '',
        updatedAt: serverTimestamp(),
      };
      
      // Filter out undefined payload fields or empty fields that shouldn't be saved if needed.
      // Basic cleanup
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      if (sermon.id) {
        await updateDoc(doc(db, 'sermons', sermon.id), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'sermons'), payload);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert(t({ en: 'Failed to save.', vi: 'Lỗi khi lưu.' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900">
          {sermon.id ? t({ en: 'Edit Sermon', vi: 'Sửa Bài Giảng' }) : t({ en: 'New Sermon', vi: 'Bài Giảng Mới' })}
        </h3>
        <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input required type="text" className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Preacher *</label>
          <input required type="text" className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.preacher || ''} onChange={e => setFormData({...formData, preacher: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
          <input required type="date" className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.sermonDate || ''} onChange={e => setFormData({...formData, sermonDate: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
          <select required className="w-full p-2 border border-slate-300 rounded font-sans text-sm bg-white" value={formData.status || 'draft'} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Group / Series</label>
          <select className="w-full p-2 border border-slate-300 rounded font-sans text-sm bg-white" value={formData.groupId || ''} onChange={e => setFormData({...formData, groupId: e.target.value})}>
            <option value="">None</option>
            {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bible Passage</label>
          <input type="text" className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.biblePassage || ''} onChange={e => setFormData({...formData, biblePassage: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Document URL (Google Docs Link)</label>
          <input type="url" className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.documentUrl || ''} onChange={e => setFormData({...formData, documentUrl: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description / Summary</label>
          <textarea rows={2} className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Sermon Notes (Full Info)</label>
          <textarea rows={5} className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.fullInformation || ''} onChange={e => setFormData({...formData, fullInformation: e.target.value})}></textarea>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
        <button disabled={saving} type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-church-red rounded-lg hover:bg-red-700 disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

const SermonList = ({ sermons, onEdit }: any) => {
  const { t } = useLanguage();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-700 font-medium">
          <tr>
            <th className="p-3 rounded-tl-lg">Date</th>
            <th className="p-3">Title</th>
            <th className="p-3">Preacher</th>
            <th className="p-3">Status</th>
            <th className="p-3 rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sermons.map((s: any) => (
            <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="p-3">{new Date(s.sermonDate).toLocaleDateString()}</td>
              <td className="p-3 font-medium text-slate-900 line-clamp-1 max-w-[200px]">{s.title}</td>
              <td className="p-3">{s.preacher}</td>
              <td className="p-3">
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded flex inline-block w-fit ${
                  s.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {s.status}
                </span>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                  <button onClick={async () => {
                    if (window.confirm('Delete this sermon?')) {
                      await deleteDoc(doc(db, 'sermons', s.id));
                    }
                  }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
          {sermons.length === 0 && (
             <tr>
               <td colSpan={5} className="p-8 text-center text-slate-400">No sermons exist.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const GroupForm = ({ group, onClose }: any) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(group);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, updatedAt: serverTimestamp() };
      
      if (group.id) {
        await updateDoc(doc(db, 'sermonGroups', group.id), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'sermonGroups'), payload);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert(t({ en: 'Failed to save.', vi: 'Lỗi khi lưu.' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900">
          {group.id ? t({ en: 'Edit Group', vi: 'Sửa Chủ Đề' }) : t({ en: 'New Group', vi: 'Chủ Đề Mới' })}
        </h3>
        <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
          <input required type="text" className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea rows={2} className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Custom Order (Number)</label>
          <input required type="number" className="w-full p-2 border border-slate-300 rounded font-sans text-sm" value={formData.customOrder || 0} onChange={e => setFormData({...formData, customOrder: Number(e.target.value)})} />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
        <button disabled={saving} type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-church-red rounded-lg hover:bg-red-700 disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

const GroupList = ({ groups, onEdit }: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-700 font-medium">
          <tr>
            <th className="p-3 rounded-tl-lg">Order</th>
            <th className="p-3">Name</th>
            <th className="p-3 rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g: any) => (
            <tr key={g.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="p-3">{g.customOrder}</td>
              <td className="p-3 font-medium text-slate-900">{g.name}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(g)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                  <button onClick={async () => {
                    if (window.confirm('Delete this group? Sermons will lose their group association but will NOT be deleted.')) {
                      await deleteDoc(doc(db, 'sermonGroups', g.id));
                    }
                  }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
          {groups.length === 0 && (
             <tr>
               <td colSpan={3} className="p-8 text-center text-slate-400">No groups exist.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
