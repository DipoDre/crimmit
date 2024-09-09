import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema({
  _id: true,
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  attributes: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  meta: any;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
