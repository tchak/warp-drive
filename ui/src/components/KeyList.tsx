import React, { useEffect, useState } from 'react';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineClipboardCheck,
} from 'react-icons/hi';
import useClipboard from 'react-use-clipboard';

import { Key as _Key } from '../graphql';
import { useKeyToken } from '../hooks';

export type Key = Pick<_Key, 'id' | 'name' | 'scope' | 'updatedDate'>;

export function KeyList({
  keys,
  remove,
  edit,
  saving,
}: {
  keys: Key[];
  remove: (key: Key) => void;
  edit: (key: Key) => void;
  saving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {keys.map((key) => (
        <KeyItem
          key={key.id}
          item={key}
          remove={remove}
          edit={edit}
          saving={saving}
        />
      ))}
    </div>
  );
}

function useKeyTokenClipboard(keyId: string): [boolean, () => void] {
  const [id, setId] = useState<string>();
  const token = useKeyToken(id);
  const [isCopied, setCopied] = useClipboard(token ?? '', {
    successDuration: 2000,
  });
  useEffect(() => {
    if (isCopied) {
      setId(undefined);
    } else if (id && token) {
      console.log('copied', token);
      setCopied();
    }
  }, [id, token, isCopied]);

  return [isCopied, () => setId(keyId)];
}

function KeyItem({
  item,
  remove,
  edit,
  saving,
}: {
  item: Key;
  remove: (key: Key) => void;
  edit: (key: Key) => void;
  saving: boolean;
}) {
  const [, setCopied] = useKeyTokenClipboard(item.id);

  return (
    <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
      <div className="flex-1">{item.name}</div>
      <div className="flex-shrink-0 min-w-0">
        <button
          type="button"
          className="p-1 hover:text-blue-600 mr-2"
          onClick={setCopied}
          title="Copy token"
        >
          <HiOutlineClipboardCheck className="text-xl" />
        </button>
        <button
          type="button"
          className="p-1 hover:text-blue-600 mr-2"
          disabled={saving}
          onClick={() => edit(item)}
        >
          <HiOutlinePencil className="text-xl" />
        </button>
        <button
          type="button"
          className="p-1 hover:text-red-600"
          disabled={saving}
          onClick={() => remove(item)}
        >
          <HiOutlineTrash className="text-xl" />
        </button>
      </div>
    </div>
  );
}
