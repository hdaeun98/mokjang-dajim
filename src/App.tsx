import React, { useState } from 'react';
import { TrendingUp, Plus, MessageSquare } from 'lucide-react';
import { usePersons, useAnnouncements } from './hooks/useFirestore';
import { Person } from './types';
import { PersonCard } from './components/PersonCard';
import { AnnouncementCard } from './components/AnnouncementCard';
import { AddPersonModal } from './components/AddPersonModal';
import { EditPersonModal } from './components/EditPersonModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AddAnnouncementModal } from './components/AddAnnouncementModal';

function App() {
  const { persons, loading: personsLoading, addPerson, updatePerson, deletePerson } = usePersons();
  const { announcements, loading: announcementsLoading, addAnnouncement, deleteAnnouncement } = useAnnouncements();
  
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showEditPersonModal, setShowEditPersonModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);

  const handleToggleCompletion = async (personId: string, date: string, completed: boolean) => {
    const person = persons.find(p => p.id === personId);
    if (!person) return;

    const updatedCompletions = {
      ...person.completions,
      [date]: completed
    };

    if (!completed) {
      delete updatedCompletions[date];
    }

    await updatePerson(personId, { completions: updatedCompletions });
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setShowEditPersonModal(true);
  };

  const handleDeletePerson = (personId: string) => {
    setDeletingPersonId(personId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeletePerson = async () => {
    if (deletingPersonId) {
      await deletePerson(deletingPersonId);
      setDeletingPersonId(null);
      setShowDeleteConfirmModal(false);
    }
  };

  const handleUpdatePerson = async (personId: string, updates: Partial<Person>) => {
    await updatePerson(personId, updates);
  };

  if (personsLoading || announcementsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">목장 다짐 포인트</h1>
                <p className="text-gray-600">함께 성장하는 목장 생활</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-md border">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                동기화됨
              </div>
              <button
                onClick={() => setShowAddPersonModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                인원 추가
              </button>
            </div>
          </div>
        </header>

        {/* Announcements */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">공지사항</h2>
            </div>
            <button
              onClick={() => setShowAddAnnouncementModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              + 공지사항 추가
            </button>
          </div>
          
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>아직 공지사항이 없습니다.</p>
                <p className="text-sm">첫 번째 공지사항을 추가해보세요!</p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onDelete={deleteAnnouncement}
                />
              ))
            )}
          </div>
        </section>

        {/* Person Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {persons.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <TrendingUp size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">목표를 시작해보세요!</h3>
                <p className="text-gray-600 mb-6">
                  첫 번째 인원을 추가하고 목표 달성을 시작해보세요.
                </p>
                <button
                  onClick={() => setShowAddPersonModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  인원 추가하기
                </button>
              </div>
            ) : (
              persons.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onToggleCompletion={handleToggleCompletion}
                  onEdit={handleEditPerson}
                  onDelete={handleDeletePerson}
                />
              ))
            )}
          </div>
        </section>

        {/* Modals */}
        <AddPersonModal
          isOpen={showAddPersonModal}
          onClose={() => setShowAddPersonModal(false)}
          onSubmit={addPerson}
        />

        <EditPersonModal
          isOpen={showEditPersonModal}
          person={editingPerson}
          onClose={() => {
            setShowEditPersonModal(false);
            setEditingPerson(null);
          }}
          onSubmit={handleUpdatePerson}
        />

        <DeleteConfirmModal
          isOpen={showDeleteConfirmModal}
          personName={persons.find(p => p.id === deletingPersonId)?.name || ''}
          onClose={() => {
            setShowDeleteConfirmModal(false);
            setDeletingPersonId(null);
          }}
          onConfirm={confirmDeletePerson}
        />

        <AddAnnouncementModal
          isOpen={showAddAnnouncementModal}
          onClose={() => setShowAddAnnouncementModal(false)}
          onSubmit={addAnnouncement}
        />
      </div>
    </div>
  );
}

export default App;