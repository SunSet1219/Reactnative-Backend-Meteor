//Declare Users collection
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
Schema.UserProfile = new SimpleSchema({
    fullname: {
        type: String,
        optional: true
    },
    username: {
        type: String,
        optional: true
    },
    dob: {
        type: String,
        optional: true
    },
    gender: {
        type: String,
        optional: true
    },
    interest: {
        type: [String],
        optional: true
    },
    bio: {
        type: String,
        optional: true
    },
    location: {
        type: Schema.locationSchema,
        optional: true
    },
    profilePic: {
        type: String,
        optional: true
    },
    whoCanSeeFeed: {
      type: Object,
      optional: true,
      blackbox: true
    },
    userFriendsList: {
      type: [String],
      optional: true
    },
    userFollowList: {
      type: [String],
      optional: true
    },

});
export const Users = Meteor.users;
// this.user = Meteor.users;

//Declared Schema of users
Schema.user = new SimpleSchema({

    emails: {
        type: [Object],
        // optional: true
    },
    "emails.$.address": {
        type: String
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date()
            }
        },
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    profile: {
        type: Schema.UserProfile
    },
    isActive: {
        type: Boolean,
        defaultValue: true
    }

});
//Attached Schema with users collection
Users.attachSchema(Schema.user);
