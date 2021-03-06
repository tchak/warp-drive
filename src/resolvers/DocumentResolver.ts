import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ID,
  ObjectType,
  Field,
  FieldResolver,
  Root,
  Int,
  Float,
  createUnionType,
} from 'type-graphql';

import { Document } from '../entities/Document';
import { AttributeType } from '../entities/CollectionAttribute';

import { Context } from '../lib/context';
import { deleteDocument, updateDocument } from '../lib/database';

@ObjectType()
export class TypedAttributeClass {
  @Field()
  name!: string;

  type!: AttributeType;
}

@ObjectType()
export class StringAttribute extends TypedAttributeClass {
  @Field()
  value!: string;
}

@ObjectType()
export class IntAttribute extends TypedAttributeClass {
  @Field(() => Int)
  value!: number;
}

@ObjectType()
export class FloatAttribute extends TypedAttributeClass {
  @Field(() => Float)
  value!: number;
}

@ObjectType()
export class BooleanAttribute extends TypedAttributeClass {
  @Field()
  value!: boolean;
}

@ObjectType()
export class NullAttribute extends TypedAttributeClass {
  null!: true;
}

const TypedAttribute = createUnionType({
  name: 'TypedAttribute',
  types: () =>
    [
      StringAttribute,
      IntAttribute,
      FloatAttribute,
      BooleanAttribute,
      NullAttribute,
    ] as const,
  resolveType(attribute) {
    if ('null' in attribute) {
      return NullAttribute;
    }
    switch (attribute.type) {
      case AttributeType.int:
        return IntAttribute;
      case AttributeType.float:
        return FloatAttribute;
      case AttributeType.boolean:
        return BooleanAttribute;
      default:
        return StringAttribute;
    }
  },
});
type TypedAttributeType =
  | StringAttribute
  | IntAttribute
  | FloatAttribute
  | BooleanAttribute
  | NullAttribute;

@ObjectType()
class DeletedDocument {
  @Field(() => ID)
  id!: string;
}

@Resolver(Document)
export class DocumentResolver {
  @Mutation(() => DeletedDocument)
  async deleteDocument(
    @Ctx('context') context: Context,
    @Arg('id', () => ID) documentId: string
  ): Promise<DeletedDocument> {
    await deleteDocument({ context, documentId });
    return { id: documentId };
  }

  @Mutation(() => StringAttribute)
  async updateStringAttribute(
    @Ctx('context') context: Context,
    @Arg('documentId', () => ID) documentId: string,
    @Arg('name') name: string,
    @Arg('value') value: string
  ): Promise<StringAttribute> {
    await updateDocument({
      context,
      documentId,
      attributes: { [name]: value },
    });
    return { name, value, type: AttributeType.string };
  }

  @Mutation(() => IntAttribute)
  async updateIntAttribute(
    @Ctx('context') context: Context,
    @Arg('documentId', () => ID) documentId: string,
    @Arg('name') name: string,
    @Arg('value', () => Int) value: number
  ): Promise<IntAttribute> {
    await updateDocument({
      context,
      documentId,
      attributes: { [name]: value },
    });
    return { name, value, type: AttributeType.int };
  }

  @Mutation(() => FloatAttribute)
  async updateFloatAttribute(
    @Ctx('context') context: Context,
    @Arg('documentId', () => ID) documentId: string,
    @Arg('name') name: string,
    @Arg('value', () => Float) value: number
  ): Promise<FloatAttribute> {
    await updateDocument({
      context,
      documentId,
      attributes: { [name]: value },
    });
    return { name, value, type: AttributeType.float };
  }

  @Mutation(() => BooleanAttribute)
  async updateBooleanAttribute(
    @Ctx('context') context: Context,
    @Arg('documentId', () => ID) documentId: string,
    @Arg('name') name: string,
    @Arg('value') value: boolean
  ): Promise<BooleanAttribute> {
    await updateDocument({
      context,
      documentId,
      attributes: { [name]: value },
    });
    return { name, value, type: AttributeType.boolean };
  }

  @FieldResolver(() => [TypedAttribute])
  async attributes(@Root() document: Document): Promise<TypedAttributeType[]> {
    const { attributes } = document;
    return [...document.collection.attributes].map(({ name, type }) => {
      if (attributes[name] == null) {
        return { name, type, null: true };
      }

      switch (type) {
        case AttributeType.int:
        case AttributeType.float:
          return { name, type, value: attributes[name] as number };
        case AttributeType.boolean:
          return { name, type, value: attributes[name] as boolean };
        default:
          return { name, type, value: attributes[name] as string };
      }
    });
  }
}
