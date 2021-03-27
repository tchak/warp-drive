import { ObjectType, InterfaceType, Field } from 'type-graphql';

@InterfaceType()
export abstract class MutationResponse {
  @Field()
  code!: string;

  @Field()
  success!: boolean;

  @Field()
  message!: string;
}

@ObjectType({ implements: MutationResponse })
export class DeleteMutationResponse extends MutationResponse {}
