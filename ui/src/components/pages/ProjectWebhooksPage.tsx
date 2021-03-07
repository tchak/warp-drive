import React, { useState } from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

import { useProject } from '../../hooks';
import { NotImplemented } from '../NotImplemented';
import { ProjectStatusBar } from '../ProjectStatusBar';

export default function ProjectWebhooksPage() {
  const [, setSlideOverOpen] = useState(false);
  const { id } = useParams();
  const project = useProject(id);

  return (
    <>
      <ProjectStatusBar name={project?.name}>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => setSlideOverOpen(true)}
        >
          <HiPlusCircle className="-ml-1 mr-3 h-5 w-5" /> Webhook
        </button>
      </ProjectStatusBar>

      <div className="p-10 bg-white">
        <NotImplemented />
      </div>
    </>
  );
}
