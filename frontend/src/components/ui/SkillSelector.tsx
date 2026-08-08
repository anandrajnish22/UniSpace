import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Plus, X, Loader2 } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface UserSkill {
  skillId: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  skill: Skill;
}

export const SkillSelector = () => {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, profileRes] = await Promise.all([
          api.get('/profiles/skills'),
          api.get('/profiles/me/details')
        ]);
        
        setAvailableSkills(skillsRes.data.data.skills);
        setUserSkills(profileRes.data.data.user.skills || []);
      } catch (error) {
        console.error('Failed to load skills', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;
    setIsAdding(true);
    try {
      const res = await api.post('/profiles/skills', { skillId: selectedSkillId, proficiency });
      if (res.data.success) {
        const addedSkill = availableSkills.find(s => s.id === selectedSkillId)!;
        setUserSkills([...userSkills, { skillId: selectedSkillId, proficiency, skill: addedSkill }]);
        setSelectedSkillId('');
      }
    } catch (error) {
      console.error('Failed to add skill', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await api.delete(`/profiles/skills/${skillId}`);
      setUserSkills(userSkills.filter(s => s.skillId !== skillId));
    } catch (error) {
      console.error('Failed to remove skill', error);
    }
  };

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin text-surface-400" />;

  const unselectedSkills = availableSkills.filter(
    s => !userSkills.some(us => us.skillId === s.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {userSkills.map((us) => (
          <Badge key={us.skillId} variant="secondary" className="px-3 py-1 flex items-center gap-2">
            <span>{us.skill.name}</span>
            <span className="text-xs opacity-60 capitalize">({us.proficiency.toLowerCase()})</span>
            <button 
              type="button" 
              onClick={() => handleRemoveSkill(us.skillId)}
              className="hover:text-danger-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select 
          className="flex-1 px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={selectedSkillId}
          onChange={(e) => setSelectedSkillId(e.target.value)}
        >
          <option value="">Select a skill...</option>
          {unselectedSkills.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
          ))}
        </select>
        
        <select
          className="w-full sm:w-36 px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={proficiency}
          onChange={(e: any) => setProficiency(e.target.value)}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="EXPERT">Expert</option>
        </select>

        <button 
          type="button"
          disabled={!selectedSkillId || isAdding}
          onClick={handleAddSkill}
          className="px-4 py-2 bg-surface-900 text-white rounded-xl hover:bg-surface-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium transition-colors"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </div>
    </div>
  );
};
