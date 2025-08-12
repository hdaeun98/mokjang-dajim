import React from 'react';
import { Trash2 } from 'lucide-react';
import { Announcement } from '../types';
import { formatDateTime } from '../utils/dateUtils';

interface AnnouncementCardProps {
  announcement: Announcement;
  onDelete: (id: string) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ 
  announcement, 
  onDelete 
}) => {
  return (
    <div className={`border-l-4 bg-white p-4 rounded-r-lg shadow-sm ${
      announcement.isImportant 
        ? 'border-l-red-500 bg-red-50' 
        : 'border-l-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {announcement.isImportant && (
              <span className="text-red-500 text-sm font-medium">🚨</span>
            )}
            <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap mb-3 leading-relaxed">
            {announcement.content}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>작성자 {announcement.author}</span>
            <span>{formatDateTime(announcement.createdAt)}</span>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(announcement.id)}
          className="ml-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="공지사항 삭제"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};