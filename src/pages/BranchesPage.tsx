import React from 'react';
import { BranchDirectory } from '../features/branches/BranchDirectory';

export const BranchesPage: React.FC = () => {
  return (
    <div className="pt-4">
      <BranchDirectory />
    </div>
  );
};
