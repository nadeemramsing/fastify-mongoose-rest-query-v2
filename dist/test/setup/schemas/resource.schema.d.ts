import { Schema, InferSchemaType, Types } from 'mongoose';
declare const AliasSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    _id: Types.ObjectId;
    name?: string | null | undefined;
    abbreviation?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    _id: Types.ObjectId;
    name?: string | null | undefined;
    abbreviation?: string | null | undefined;
}>> & import("mongoose").FlatRecord<{
    _id: Types.ObjectId;
    name?: string | null | undefined;
    abbreviation?: string | null | undefined;
}> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
declare const AddressSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    _id: Types.ObjectId;
    aliases: Types.DocumentArray<{
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }, Types.Subdocument<Types.ObjectId, any, {
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }> & {
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }>;
    flags?: {
        is_a_city?: boolean | null | undefined;
        is_near_the_coast?: boolean | null | undefined;
    } | null | undefined;
    street?: string | null | undefined;
    city?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    _id: Types.ObjectId;
    aliases: Types.DocumentArray<{
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }, Types.Subdocument<Types.ObjectId, any, {
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }> & {
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }>;
    flags?: {
        is_a_city?: boolean | null | undefined;
        is_near_the_coast?: boolean | null | undefined;
    } | null | undefined;
    street?: string | null | undefined;
    city?: string | null | undefined;
}>> & import("mongoose").FlatRecord<{
    _id: Types.ObjectId;
    aliases: Types.DocumentArray<{
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }, Types.Subdocument<Types.ObjectId, any, {
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }> & {
        _id: Types.ObjectId;
        name?: string | null | undefined;
        abbreviation?: string | null | undefined;
    }>;
    flags?: {
        is_a_city?: boolean | null | undefined;
        is_near_the_coast?: boolean | null | undefined;
    } | null | undefined;
    street?: string | null | undefined;
    city?: string | null | undefined;
}> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const ResourceSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    _id: Types.ObjectId;
    archived: boolean;
    addresses: Types.DocumentArray<{
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }, Types.Subdocument<Types.ObjectId, any, {
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }> & {
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }>;
    name?: string | null | undefined;
    mobile?: number | null | undefined;
    auth?: {
        password?: string | null | undefined;
    } | null | undefined;
    age?: number | null | undefined;
    dateStart?: NativeDate | null | undefined;
    dateEnd?: NativeDate | null | undefined;
    father?: Types.ObjectId | null | undefined;
    mother?: Types.ObjectId | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    _id: Types.ObjectId;
    archived: boolean;
    addresses: Types.DocumentArray<{
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }, Types.Subdocument<Types.ObjectId, any, {
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }> & {
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }>;
    name?: string | null | undefined;
    mobile?: number | null | undefined;
    auth?: {
        password?: string | null | undefined;
    } | null | undefined;
    age?: number | null | undefined;
    dateStart?: NativeDate | null | undefined;
    dateEnd?: NativeDate | null | undefined;
    father?: Types.ObjectId | null | undefined;
    mother?: Types.ObjectId | null | undefined;
}>> & import("mongoose").FlatRecord<{
    _id: Types.ObjectId;
    archived: boolean;
    addresses: Types.DocumentArray<{
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }, Types.Subdocument<Types.ObjectId, any, {
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }> & {
        _id: Types.ObjectId;
        aliases: Types.DocumentArray<{
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }, Types.Subdocument<Types.ObjectId, any, {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }> & {
            _id: Types.ObjectId;
            name?: string | null | undefined;
            abbreviation?: string | null | undefined;
        }>;
        flags?: {
            is_a_city?: boolean | null | undefined;
            is_near_the_coast?: boolean | null | undefined;
        } | null | undefined;
        street?: string | null | undefined;
        city?: string | null | undefined;
    }>;
    name?: string | null | undefined;
    mobile?: number | null | undefined;
    auth?: {
        password?: string | null | undefined;
    } | null | undefined;
    age?: number | null | undefined;
    dateStart?: NativeDate | null | undefined;
    dateEnd?: NativeDate | null | undefined;
    father?: Types.ObjectId | null | undefined;
    mother?: Types.ObjectId | null | undefined;
}> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export type TypeAlias = InferSchemaType<typeof AliasSchema>;
export type TypeAddress = Omit<InferSchemaType<typeof AddressSchema>, 'aliases'> & {
    aliases: TypeAlias[];
};
export type TypeResource = Omit<InferSchemaType<typeof ResourceSchema>, 'addresses'> & {
    addresses: TypeAddress[];
};
export {};
