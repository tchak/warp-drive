import React, { useState } from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import { useMutation } from 'urql';

import { DeleteKeyDocument } from '../../graphql';
import { useListKeys, useProject } from '../../hooks';
import { KeyPanel } from '../KeyPanel';
import { KeyList, Key } from '../KeyList';
import { ProjectStatusBar } from '../ProjectStatusBar';

export default function ProjectKeysPage() {
  const [show, setShow] = useState(false);
  const [selectedKey, setSelectedKey] = useState<Key>();
  const { id } = useParams();
  const [{ data, fetching, error }] = useListKeys(id);
  const [{ fetching: deleting }, deleteKey] = useMutation(DeleteKeyDocument);
  const project = useProject(id);
  const open = () => setShow(true);
  const close = () => setShow(false);

  if (error) {
    return <>Error: {(error as Error).message}</>;
  }
  const keys = fetching ? [] : data?.getProject.keys ?? [];

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
              <HiPlusCircle className="-ml-1 mr-3 h-5 w-5" /> API Key
            </button>
          </ProjectStatusBar>
        </div>
      </div>

      <div className="mt-8">
        <div className="px-4 sm:px-6 max-w-6xl mx-auto lg:px-8">
          <KeyList
            keys={keys}
            remove={({ id }) => deleteKey({ id })}
            edit={(key) => {
              setSelectedKey(key);
              open();
            }}
            saving={deleting}
          />
        </div>
      </div>

      {project && (
        <KeyPanel
          initialValues={
            selectedKey
              ? selectedKey
              : {
                  projectId: project.id,
                  name: '',
                  scope: [],
                }
          }
          show={show}
          close={close}
          afterClose={() => setSelectedKey(undefined)}
        />
      )}
    </>
  );
}
