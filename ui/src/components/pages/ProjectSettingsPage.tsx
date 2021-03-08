import React from 'react';
import { useParams } from 'react-router-dom';

import { useProject } from '../../hooks';
import { ProjectStatusBar } from '../ProjectStatusBar';
import { NotImplemented } from '../NotImplemented';

export default function ProjectSettingsPage() {
  const { id } = useParams();
  const project = useProject(id);

  return (
    <>
      <div className="bg-white">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <ProjectStatusBar name={project?.name} />
        </div>
      </div>

      <div className="mt-8">
        <div className="px-4 sm:px-6 max-w-6xl mx-auto lg:px-8">
          <NotImplemented />
        </div>
      </div>
    </>
  );
}
