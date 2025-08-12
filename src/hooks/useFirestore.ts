import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Person, Announcement } from '../types';

export const usePersons = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'persons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const personsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Person[];
      setPersons(personsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPerson = async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Filter out undefined values as Firestore doesn't accept them
      const filteredPerson = Object.fromEntries(
        Object.entries(person).filter(([_, value]) => value !== undefined)
      );
      
      await addDoc(collection(db, 'persons'), {
        ...filteredPerson,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    try {
      // Filter out undefined values as Firestore doesn't accept them
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );
      
      await updateDoc(doc(db, 'persons', id), {
        ...filteredUpdates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  const deletePerson = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'persons', id));
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  return { persons, loading, addPerson, updatePerson, deletePerson };
};

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const announcementsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Announcement[];
      setAnnouncements(announcementsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'announcements'), {
        ...announcement,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return { announcements, loading, addAnnouncement, deleteAnnouncement };
};