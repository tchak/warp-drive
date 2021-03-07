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
      <ProjectStatusBar name={project?.name} />

      <div className="p-10 bg-white">
        <NotImplemented />
      </div>
    </>
  );
}
