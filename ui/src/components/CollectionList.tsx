import React from 'react';
import {
  HiOutlineClipboardCheck,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import useClipboard from 'react-use-clipboard';

import { Collection as _Collection, Attribute } from '../graphql';

export type Collection = Pick<_Collection, 'id' | 'name' | 'updatedDate'> & {
  attributes: Array<Pick<Attribute, 'id' | 'name' | 'type'>>;
};

export function CollectionList({
  collections,
  remove,
  edit,
  saving,
}: {
  collections: Collection[];
  remove: (collection: Collection) => void;
  edit: (collection: Collection) => void;
  saving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {collections.map((collection) => (
        <CollectionItem
          collection={collection}
          remove={remove}
          edit={edit}
          saving={saving}
        />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  remove,
  edit,
  saving,
}: {
  collection: Collection;
  remove: (collection: Collection) => void;
  edit: (collection: Collection) => void;
  saving: boolean;
}) {
  const { id } = useParams();
  const [, setCopied] = useClipboard(
    `https://warp.tchak.dev/v1/${id}/collections/${collection.id}/documents`
  );

  return (
    <div
      key={collection.id}
      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
    >
      <div className="flex-1">{collection.name}</div>
      <div className="flex-shrink-0 min-w-0">
        <button
          type="button"
          className="p-1 hover:text-blue-600 mr-2"
          onClick={setCopied}
          title="Copy collection URL"
        >
          <HiOutlineClipboardCheck className="text-xl" />
        </button>
        <button
          type="button"
          className="p-1 hover:text-blue-600 mr-2"
          disabled={saving}
          onClick={() => edit(collection)}
          title="Edit collection"
        >
          <HiOutlinePencil className="text-xl" />
        </button>
        <button
          type="button"
          className="p-1 hover:text-red-600"
          disabled={saving}
          onClick={() => remove(collection)}
          title="Remove collection"
        >
          <HiOutlineTrash className="text-xl" />
        </button>
      </div>
    </div>
  );
}
