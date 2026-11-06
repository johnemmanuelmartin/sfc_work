import React from 'react';
import { PastorsSection } from '../features/leadership/PastorsSection';

interface LeadershipPageProps {
  onOpenPrayerModal: () => void;
}

export const LeadershipPage: React.FC<LeadershipPageProps> = ({ onOpenPrayerModal }) => {
  return (
    <div className="pt-4">
      <PastorsSection onOpenPrayerModal={onOpenPrayerModal} />
    </div>
  );
};
