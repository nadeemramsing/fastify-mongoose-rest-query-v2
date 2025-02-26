import { Schema, InferSchemaType, Types } from 'mongoose'

const AliasSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    default: () => new Types.ObjectId(),
  },
  name: String,
  abbreviation: String,
})

const AddressSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    default: () => new Types.ObjectId(),
  },
  street: String,
  city: String,
  aliases: [AliasSchema],
  flags: {
    is_a_city: Boolean,
    is_near_the_coast: Boolean,
  },
})

export const ResourceSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    default: () => new Types.ObjectId(),
  },

  name: {
    type: String,
    trim: true,
  },

  age: Number,

  mobile: Number,

  archived: {
    type: Boolean,
    default: false,
  },

  dateStart: Date,

  dateEnd: Date,

  father: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
  },

  mother: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
  },

  addresses: [AddressSchema],
})

ResourceSchema.statics.firstCity = function (
  doc: TypeResource,
  { req, query }
) {
  try {
    return doc.addresses.find((address) => address.flags?.is_a_city)?.city
  } catch (e) {}
}

// KEEP FOR REFERENCE
// ResourceSchema.pre(['find', 'findOne'], function (next) {
//   const { req, ...options } = this.getOptions();

//   // TEST
//   // this.setQuery({ ...this.getQuery(), name: 'NONE' });

//   this.setOptions({ ...options, req: {} });

//   this['req'] = req;

//   next();
// });

// ResourceSchema.post(['find', 'findOne'], function (result, next) {
//   // WORKING
//   console.log(this['req']);

//   next();
// });

export type TypeAlias = InferSchemaType<typeof AliasSchema>

export type TypeAddress = Omit<
  InferSchemaType<typeof AddressSchema>,
  'aliases'
> & {
  aliases: TypeAlias[]
}

export type TypeResource = Omit<
  InferSchemaType<typeof ResourceSchema>,
  'addresses'
> & {
  addresses: TypeAddress[]
}
