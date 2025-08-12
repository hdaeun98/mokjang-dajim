import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Person } from '../types';
import { getWeekDays, getDateString, calculateStreak, calculateWeeklyProgress, formatDateTime } from '../utils/dateUtils';

interface PersonCardProps {
  person: Person;
  onToggleCompletion: (personId: string, date: string, completed: boolean) => void;
  onEdit: (person: Person) => void;
  onDelete: (personId: string) => void;
}

const KOREAN_DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

export const PersonCard: React.FC<PersonCardProps> = ({ person, onToggleCompletion, onEdit, onDelete }) => {
  const weekDays = getWeekDays();
  const streak = calculateStreak(person.completions);
  const weeklyProgress = calculateWeeklyProgress(
    person.completions,
    person.frequencyType,
    person.specificDays,
    person.targetCount
  );

  const isTargetDay = (dayIndex: number) => {
    if (person.frequencyType === 'specific' && person.specificDays) {
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return person.specificDays.includes(dayNames[dayIndex]);
    }
    return true; // For count-based, all days are potential target days
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{person.emoji}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{person.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{person.goal}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {person.frequencyType === 'specific' ? '지정일' : '목표'}: {weeklyProgress.target}일
            </div>
          </div>
          <button
            onClick={() => onEdit(person)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="편집"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(person.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">주간 진행률</span>
          <span className="text-sm text-gray-600">
            {weeklyProgress.completed}/{weeklyProgress.target}일
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-3">
          {weekDays.map((day, index) => {
            const dateStr = getDateString(day);
            const isCompleted = person.completions[dateStr] || false;
            const isTarget = isTargetDay(index);
            
            return (
              <div
                key={dateStr}
                className="text-center"
              >
                <div className="text-xs text-gray-500 mb-1">
                  {KOREAN_DAY_NAMES[index]}
                </div>
                <button
                  onClick={() => onToggleCompletion(person.id, dateStr, !isCompleted)}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 text-white shadow-sm hover:bg-green-600'
                      : isTarget
                      ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isTarget}
                >
                  {isCompleted ? person.emoji : day.getDate()}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${weeklyProgress.percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="text-gray-600">
            완료율 <span className="font-semibold text-gray-900">{weeklyProgress.percentage}%</span>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            🔥 <span className="font-semibold">연속 {streak}일</span>
          </div>
        </div>
        <div className="text-gray-500">
          업데이트 {formatDateTime(person.updatedAt)}
        </div>
      </div>
    </div>
  );
};