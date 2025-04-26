import { ObjectId } from 'bson'
import { TypeResource } from '@test/setup/schemas/resource.schema'

export const resources: TypeResource[] = [
  {
    _id: ObjectId.createFromTime(1),
    auth: { password: 'tmp1234' },
    name: 'Nadeem',
    age: 28,
    mobile: 51234567,
    archived: false,
    dateStart: new Date('2022-01-01'),
    dateEnd: new Date('2022-04-04'),
    addresses: [
      {
        _id: ObjectId.createFromTime(100),
        street: 'street1',
        city: 'Beau Bassin',
        aliases: [],
        flags: {
          is_a_city: true,
          is_near_the_coast: false,
        },
      },
      {
        _id: ObjectId.createFromTime(101),
        street: 'streetA',
        city: 'Curepipe',
        aliases: [],
      },
    ],
  },
  {
    _id: ObjectId.createFromTime(2),
    name: 'Samira',
    age: 24,
    mobile: 5000000,
    archived: false,
    dateStart: new Date('2021-01-01'),
    dateEnd: new Date('2025-01-01'),
    addresses: [
      {
        _id: ObjectId.createFromTime(200),
        street: 'street2',
        city: 'Beau Bassin',
        aliases: [],
      },
    ],
  },
  {
    _id: ObjectId.createFromTime(3),
    name: 'Zakariyya',
    age: 1,
    mobile: 5999999,
    archived: true,
    dateStart: new Date('2000-01-01'),
    dateEnd: new Date('2005-01-01'),
    father: ObjectId.createFromTime(1),
    mother: ObjectId.createFromTime(2),
    addresses: [
      {
        _id: ObjectId.createFromTime(300),
        street: 'street3',
        city: 'Beau Bassin',
        aliases: [
          {
            _id: ObjectId.createFromTime(2999),
            name: 'Beau Bassin',
            abbreviation: 'BBRH',
          },
          {
            _id: ObjectId.createFromTime(3000),
            name: 'Beau Bassin',
            abbreviation: 'BB',
          },
          {
            _id: ObjectId.createFromTime(3001),
            name: 'Beau Bassin Rose Hill',
            abbreviation: 'BBRH',
          },
          {
            _id: ObjectId.createFromTime(3002),
            name: 'Coeur de Ville',
            abbreviation: 'Coeur',
          },
          {
            _id: ObjectId.createFromTime(3003),
            name: "Tang's Way Headquarter",
            abbreviation: 'Tang',
          },
          {
            _id: ObjectId.createFromTime(3004),
            name: 'Home to QEC',
            abbreviation: 'QEC',
          },
          {
            _id: ObjectId.createFromTime(3005),
            name: "Saint-Pierre, Réunion's Twin Sister City",
            abbreviation: 'Saint-Pierre',
          },
        ],
      },
    ],
  },
]
