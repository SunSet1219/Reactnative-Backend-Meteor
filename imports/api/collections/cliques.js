export const Cliques = new Mongo.Collection("cliques");

Schema = {};

Schema.locationSchema = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    lat: {
        type: Number,
        decimal: true,
        defaultValue: 0
    },
    lang: {
        type: Number,
        decimal: true,
        defaultValue: 0
    }
});

Schema.Cliques = new SimpleSchema({
  about: {
    type : String,
    optional : true
  },
  administrators: {
    type : [String],
    optional : true
  },
  cliquePic: {
    type : String,
    optional : true
  },
  interest: {
    type : [String],
    optional : true
  },
  location: {
      type: Schema.locationSchema,
      optional: true
  },
  member: {
    type : [String],
    optional : true
  },
  name: {
    type : String,
    optional : true
  },
  userid : {
    type : String
  }
})
