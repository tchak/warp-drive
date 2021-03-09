import React, { useState } from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import { useParams, NavLink } from 'react-router-dom';
import { useMutation } from 'urql';

import { DeleteCollectionDocument } from '../../graphql';
import { useListCollections, useProject } from '../../hooks';
import { ProjectStatusBar } from '../ProjectStatusBar';
import { CollectionList, Collection } from '../CollectionList';
import { CollectionPanel } from '../CollectionPanel';

export default function ProjectDatabasePage() {
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const [{ data, fetching, error }] = useListCollections(id);
  const [{ fetching: deleting }, deleteCollection] = useMutation(
    DeleteCollectionDocument
  );
  const project = useProject(id);
  const open = () => setShow(true);
  const close = () => setShow(false);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const collections = fetching ? [] : data?.getProject.collections ?? [];

  return (
    <>
      <div className="bg-white">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <ProjectStatusBar name={project?.name}>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={open}
            >
              <HiPlusCircle className="-ml-1 mr-3 h-5 w-5" /> Collection
            </button>
          </ProjectStatusBar>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <NavLink
                to="../database"
                activeClassName="border-green-500 text-green-600 hover:border-green-500 hover:text-green-600"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
              >
                Collections
              </NavLink>
              <NavLink
                to="documents"
                activeClassName="border-green-500 text-green-600 hover:border-green-500 hover:text-green-600"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
              >
                Documents
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="px-4 sm:px-6 max-w-6xl mx-auto lg:px-8">
          <CollectionList
            collections={collections}
            remove={deleteCollection}
            edit={(collection) => {
              open();
              setSelectedCollection(collection);
            }}
            saving={deleting}
          />
        </div>
      </div>

      {project && (
        <CollectionPanel
          initialValues={
            selectedCollection
              ? selectedCollection
              : { projectId: project.id, name: '' }
          }
          show={show}
          close={close}
          afterClose={() => setSelectedCollection(undefined)}
        />
      )}
    </>
  );
}
