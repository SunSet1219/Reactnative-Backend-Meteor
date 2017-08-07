export const Messages = new Mongo.Collection("messages");

Schema = {};

Schema.chat = new SimpleSchema({
    senderId: {
        type: String,
    },
    message: {
        type: String,
        optional: true
    },
    image: {
        type: String,
        optional: true
    },
    isRead: {
        type: String,
        defaultValue: false
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset(); // Prevent user from supplying their own value
            }
        }
    },
});

Schema.Messages = new SimpleSchema({
    senderId: {
        type: String,
    },
    receiverId: {
        type: String,
    },
    type: {
        type: String,
    },

    chats: {
        type: [Schema.chat],
        optional: true
    },
    lastUpdated: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset(); // Prevent user from supplying their own value
            }
        }
    },

})
