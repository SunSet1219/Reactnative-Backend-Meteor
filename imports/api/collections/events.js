export const Events = new Mongo.Collection("events");

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

Schema.Events = new SimpleSchema({
  category : {
    type : String,
    optional : true
  },
  description: {
    type : String,
    optional : true
  },
  eventPic: {
    type : String,
    optional : true
  },
  fromTime : {
    type : Date,
    optional : true
  },
  location: {
      type: Schema.locationSchema,
      optional: true
  },
  name : {
    type : String,
    optional : true
  },
  privacy : {
    type: Object,
    optional: true,
    blackbox: true
  },
  selectedAttendCliques : {
    type : [String],
    optional : true
  },
  selectedAttendFriends : {
    type : [String],
    optional : true
  },
  selectedCliques : {
    type : [String],
    optional : true
  },
  selectedUsers : {
    type : [String],
    optional : true
  },
  tags : {
    type : [String],
    optional : true
  },
  toTime : {
    type : Date,
    optional : true
  },
  userId : {
    type : String,
    optional : true
  },
  whoCanAttend : {
    type: Object,
    optional: true,
    blackbox: true
  },
  savedBy : {
    type : [String],
    optional : true
  },
  repostClique : {
    type : [String],
    optional : true,
  },
  repostUser : {
    type : [String],
    optional : true,
  },
  checkIn: {
    type: [Object],
    optional: true,
    blackbox: true
  },
  // isRepost : {
  //   type:Boolean,
  //   defaultValue:false,
  //   optional:true
  // },
  // isSaved : {
  //   type:Boolean,
  //   defaultValue:false,
  //   optional:true
  // }
})
