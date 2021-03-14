import React, { KeyboardEvent } from 'react';
import {
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineX,
} from 'react-icons/hi';
import { useHotkeys } from 'react-hotkeys-hook';

import { AttributeType } from '../graphql';
import { SlideOverPanel } from './SlideOverPanel';
import { Collection } from './CollectionList';
import { AttributeTypeBadge, RelationshipTypeBadge } from './badges';

import {
  useAttributeForm,
  useRelationshipForm,
  AttributeForm,
  RelationshipForm,
  useCollectionForm,
} from '../forms';

export function CollectionPanel({
  initialValues,
  collections,
  show,
  close,
  afterClose,
}: {
  initialValues: Collection | { projectId: string; name: string };
  collections: Collection[];
  show: boolean;
  close: () => void;
  afterClose?: () => void;
}) {
  return (
    <SlideOverPanel afterLeave={afterClose} show={show}>
      {'id' in initialValues ? (
        <EditCollectionForm
          initialValues={initialValues}
          collections={collections}
          close={close}
        />
      ) : (
        <AddCollectionForm initialValues={initialValues} close={close} />
      )}
    </SlideOverPanel>
  );
}

function EditCollectionForm({
  initialValues,
  collections,
  close,
}: {
  initialValues: Collection;
  collections: Collection[];
  close: () => void;
}) {
  const attribute = useAttributeForm(initialValues.id, {
    success() {
      attribute.form.resetForm();
    },
  });
  const relationship = useRelationshipForm(
    initialValues.id,
    collections[0]?.id ?? '',
    {
      success() {
        relationship.form.resetForm();
      },
    }
  );
  const fetching = attribute.fetching || relationship.fetching;

  useHotkeys('esc', close, { enabled: !fetching });

  return (
    <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
      <div className="flex-1 h-0 overflow-y-auto">
        <div className="py-6 px-4 bg-green-700 sm:px-6">
          <div className="flex items-center justify-between">
            <h2
              id="slide-over-heading"
              className="text-lg font-medium text-white"
            >
              {initialValues.name}
            </h2>
            <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className="bg-green-700 rounded-md text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={close}
                disabled={fetching}
              >
                <span className="sr-only">Close panel</span>
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="mt-1"></div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Attributes
                </span>
                <AttributeList
                  attributes={initialValues.attributes}
                  fetching={fetching}
                  remove={(id) => attribute.delete({ id })}
                />
              </div>
            </div>
            <div className="pt-2 pb-6">
              <AddAttributeForm
                form={attribute.form}
                fetching={fetching}
                close={close}
              />
            </div>
          </div>
          {collections.length ? (
            <div className="px-4 sm:px-6">
              <div className="space-y-6 pt-6 pb-5">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Relationships
                  </span>
                  <RelationshipList
                    relationships={initialValues.relationships}
                    fetching={fetching}
                    remove={(id) => relationship.delete({ id })}
                  />
                </div>
              </div>
              <div className="pt-2 pb-6">
                <AddRelationshipForm
                  collections={collections}
                  form={relationship.form}
                  fetching={fetching}
                  close={close}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AddAttributeForm({
  fetching,
  form,
  close,
}: {
  fetching: boolean;
  form: AttributeForm;
  close: () => void;
}) {
  return (
    <form onSubmit={form.handleSubmit}>
      <label
        htmlFor="attribute-name"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Add attribute
      </label>
      <span className="relative z-0 inline-flex shadow-sm rounded-md w-full">
        <select
          name="type"
          className="-mr-px w-36 px-2 py-2 rounded-r-none rounded-l-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          value={form.values.type}
          onChange={form.handleChange}
        >
          <option value={AttributeType.String}>String</option>
          <option value={AttributeType.Boolean}>Boolean</option>
          <option value={AttributeType.Int}>Integer</option>
          <option value={AttributeType.Float}>Float</option>
          <option value={AttributeType.Datetime}>DateTime</option>
          <option value={AttributeType.Date}>Date</option>
        </select>
        <input
          id="attribute-name"
          type="text"
          name="name"
          placeholder="Attribute name"
          className="-mr-px w-full sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 placeholder-gray-500"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus={true}
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          onKeyUp={closeOnKeyUp(close)}
        />
        <button
          type="submit"
          className={`${
            fetching ? 'opacity-50' : ''
          } py-2 px-2 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500`}
          disabled={fetching}
        >
          <HiOutlinePlusCircle className="text-xl" />
        </button>
      </span>
      {!form.isValid && form.errors.name && (
        <p className="mt-2 text-sm text-red-600">{form.errors.name}</p>
      )}
    </form>
  );
}

function AttributeList({
  attributes,
  fetching,
  remove,
}: {
  attributes: { id: string; name: string; type: AttributeType }[];
  fetching: boolean;
  remove: (id: string) => void;
}) {
  return (
    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
      {attributes.map((attribute) => (
        <li
          key={attribute.id}
          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
        >
          <div className="w-0 flex-1 flex items-center">
            <span className="w-20">
              <AttributeTypeBadge type={attribute.type} />
            </span>
            <span className="ml-2 flex-1 w-0 truncate">{attribute.name}</span>
          </div>
          <div className="ml-4 flex-shrink-0 flex items-center">
            <button
              disabled={fetching}
              type="button"
              onClick={() => remove(attribute.id)}
            >
              <HiOutlineTrash className="text-xl hover:text-red-600" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AddRelationshipForm({
  collections,
  fetching,
  form,
  close,
}: {
  collections: Collection[];
  fetching: boolean;
  form: RelationshipForm;
  close: () => void;
}) {
  return (
    <form
      onSubmit={form.handleSubmit}
      className="rounded-md shadow-sm -space-y-px"
    >
      <label
        htmlFor="relationship-name"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Add relationship
      </label>
      <span className="relative inline-flex w-full">
        <select
          name="type"
          className="-mr-px w-44 px-2 py-2 rounded-tl-md border-gray-300 border-b-0 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          value={form.values.type}
          onChange={form.handleChange}
        >
          <option value="ManyToOne">Many to One</option>
          <option value="OneToOne">One to One</option>
        </select>
        <input
          id="relationship-name"
          type="text"
          name="name"
          placeholder="Relationship name"
          className="-mr-px w-full sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 border-b-0 rounded-tr-md focus:z-10 placeholder-gray-500"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          onKeyUp={closeOnKeyUp(close)}
        />
      </span>
      <span className="relative inline-flex  w-full">
        <select
          name="relatedCollectionId"
          className="-mr-px w-44 px-2 py-2 rounded-bl-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          value={form.values.relatedCollectionId}
          onChange={form.handleChange}
        >
          {collections.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="inverse"
          placeholder="Relationship inverse"
          className="-mr-px w-full sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 focus:z-10 placeholder-gray-500"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          value={form.values.inverse ?? ''}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          onKeyUp={closeOnKeyUp(close)}
        />
        <button
          type="submit"
          className={`${
            fetching ? 'opacity-50' : ''
          } py-2 px-2 border border-gray-300 rounded-br-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500`}
          disabled={fetching}
        >
          <HiOutlinePlusCircle className="text-xl" />
        </button>
      </span>
      {!form.isValid && form.errors.inverse && (
        <p className="mt-2 text-sm text-red-600">{form.errors.inverse}</p>
      )}
      {!form.isValid && form.errors.name && (
        <p className="mt-2 text-sm text-red-600">{form.errors.name}</p>
      )}
    </form>
  );
}

function RelationshipList({
  relationships,
  fetching,
  remove,
}: {
  relationships: Collection['relationships'];
  fetching: boolean;
  remove: (id: string) => void;
}) {
  return (
    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
      {relationships.map((relationship) => (
        <li
          key={relationship.id}
          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
        >
          <div className="w-0 flex-1 flex items-center">
            <span className="w-20">
              <RelationshipTypeBadge type={relationship.type} />
            </span>
            <span className="ml-2 flex-1 w-0 truncate">
              {relationship.name}
            </span>
          </div>
          <div className="ml-4 flex-shrink-0 flex items-center">
            {relationship.owner && (
              <button
                disabled={fetching}
                type="button"
                onClick={() => remove(relationship.id)}
              >
                <HiOutlineTrash className="text-xl hover:text-red-600" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function AddCollectionForm({
  initialValues,
  close,
}: {
  initialValues: { projectId: string; name: string };
  close: () => void;
}) {
  const { form, fetching } = useCollectionForm(initialValues.projectId, {
    success() {
      close();
    },
  });
  useHotkeys('esc', close, { enabled: !fetching });

  return (
    <form
      className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
      onSubmit={form.handleSubmit}
    >
      <div className="flex-1 h-0 overflow-y-auto">
        <div className="py-6 px-4 bg-green-700 sm:px-6">
          <div className="flex items-center justify-between">
            <h2
              id="slide-over-heading"
              className="text-lg font-medium text-white"
            >
              Add Collection
            </h2>
            <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className="bg-green-700 rounded-md text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={close}
                disabled={fetching}
              >
                <span className="sr-only">Close panel</span>
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-sm text-green-300">
              A collection defines a schema for a type of document your
              application can create.
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <label
                  htmlFor="collection-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="collection-name"
                    className="block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus={true}
                    value={form.values.name}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    onKeyUp={closeOnKeyUp(close)}
                  />
                </div>
                {!form.isValid && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="pt-4 pb-6"></div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={close}
          disabled={fetching}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={fetching}
        >
          Save
        </button>
      </div>
    </form>
  );
}

function closeOnKeyUp(close: () => void) {
  return ({ key, currentTarget }: KeyboardEvent<HTMLInputElement>) => {
    if (key == 'Escape' && currentTarget.value == '') {
      close();
    }
  };
}
