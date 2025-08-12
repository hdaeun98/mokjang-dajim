import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Person, WeekDay } from '../types';

interface EditPersonModalProps {
  isOpen: boolean;
  person: Person | null;
  onClose: () => void;
  onSubmit: (personId: string, updates: Partial<Person>) => void;
}

const EMOJI_OPTIONS = ['🏆', '💪', '📚', '🎯', '🔥', '⭐', '💎', '🌟', '🚀', '🎨', '🎵', '🏃‍♂️'];
const WEEK_DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const KOREAN_DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

export const EditPersonModal: React.FC<EditPersonModalProps> = ({ isOpen, person, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [emoji, setEmoji] = useState('🏆');
  const [frequencyType, setFrequencyType] = useState<'specific' | 'count'>('specific');
  const [specificDays, setSpecificDays] = useState<string[]>([]);
  const [targetCount, setTargetCount] = useState(3);

  useEffect(() => {
    if (person) {
      setName(person.name);
      setGoal(person.goal);
      setEmoji(person.emoji);
      setFrequencyType(person.frequencyType);
      setSpecificDays(person.specificDays || []);
      setTargetCount(person.targetCount || 3);
    }
  }, [person]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !goal.trim() || !person) return;

    const updates: Partial<Person> = {
      name: name.trim(),
      goal: goal.trim(),
      emoji,
      frequencyType,
      specificDays: frequencyType === 'specific' ? specificDays : undefined,
      targetCount: frequencyType === 'count' ? targetCount : undefined,
    };

    onSubmit(person.id, updates);
    onClose();
  };

  const toggleDay = (day: string) => {
    setSpecificDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  if (!isOpen || !person) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">인원 편집</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              목표 설명
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="목표를 설명하세요 (예: 30분 운동하기)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              완성 이모지
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emojiOption) => (
                <button
                  key={emojiOption}
                  type="button"
                  onClick={() => setEmoji(emojiOption)}
                  className={`p-2 text-2xl rounded-md border-2 transition-colors ${
                    emoji === emojiOption
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emojiOption}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              목표 일수
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="specific"
                  checked={frequencyType === 'specific'}
                  onChange={(e) => setFrequencyType(e.target.value as 'specific')}
                  className="mr-2 text-blue-600"
                />
                <span>특정 요일 선택</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="count"
                  checked={frequencyType === 'count'}
                  onChange={(e) => setFrequencyType(e.target.value as 'count')}
                  className="mr-2 text-blue-600"
                />
                <span>주당 횟수 설정</span>
              </label>
            </div>
          </div>

          {frequencyType === 'specific' && (
            <div>
              <div className="grid grid-cols-2 gap-2">
                {WEEK_DAYS.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      specificDays.includes(day)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {KOREAN_DAYS[index]}
                  </button>
                ))}
              </div>
              {specificDays.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  선택됨: 주 {specificDays.length}일
                </p>
              )}
            </div>
          )}

          {frequencyType === 'count' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주당 목표 횟수
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !goal.trim() || (frequencyType === 'specific' && specificDays.length === 0)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};