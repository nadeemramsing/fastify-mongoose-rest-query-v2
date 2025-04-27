import { Schema, Types } from 'mongoose';
const AliasSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        default: () => new Types.ObjectId(),
    },
    name: String,
    abbreviation: String,
});
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
});
export const ResourceSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        default: () => new Types.ObjectId(),
    },
    auth: {
        password: {
            type: String,
            select: false,
            secure: true,
        },
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
});
ResourceSchema.statics.firstCity = function (doc, { req, query }) {
    try {
        return doc.addresses.find((address) => address.flags?.is_a_city)?.city;
    }
    catch (e) { }
};
