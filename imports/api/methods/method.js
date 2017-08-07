import { Accounts } from 'meteor/accounts-base';
import { Users } from '/imports/api/collections/user.js';
import { Cliques } from '/imports/api/collections/cliques.js';
import { Events } from '/imports/api/collections/events.js';
import { Messages } from '/imports/api/collections/messages.js';

Meteor.methods({
    createUserServer: function(values) {
        var result = Accounts.createUser(values);
        return result;
    },

    updateUser: function(id, values) {
      return  Users.update({
            _id: id
        }, {
          $set:  values

        }
      );
    },

    cliqueAdd: function(values){
      return Cliques.insert(values);
    },

    cliqueUpdate: function(id, values){
      return Cliques.update({
          _id: id
      }, {
        $set:  values

      });
    },

    eventAdd: function(values){
      values.fromTime = new Date(values.fromTime);
      values.toTime = new Date(values.toTime);
      return Events.insert(values);
    },

    addFriend: function(userId) {
      let userDetail = Users.findOne({'_id': this.userId});
      if(userDetail.profile.userFriendsList){
        let isFriend = userDetail.profile.userFriendsList;
        let cheackIsFriend = isFriend.indexOf(userId);
        if(cheackIsFriend > -1){
          return  Users.update({
                _id: this.userId
            }, {
              $pull:
                {
                  'profile.userFriendsList': userId
                }
              }
          );
        }else{
          return  Users.update({
                _id: this.userId
            }, {
              $push:
                {
                  'profile.userFriendsList': userId
                }
              }
          );
        }
      }else{
        return  Users.update({
              _id: this.userId
          }, {
            $push:
              {
                'profile.userFriendsList': userId
              }
            }
        );
      }


    },

    isFreind: function(userId){
      let userDetail = Users.findOne({'_id': this.userId});
      if(userDetail.profile.userFriendsList){
        let isFriend = userDetail.profile.userFriendsList;
        let cheackIsFriend = isFriend.indexOf(userId);
        if(cheackIsFriend > -1){
          return true;
        }else{
          return false;
        }
      }
    },

    addFollowers: function(userId) {
      let userDetail = Users.findOne({'_id': this.userId});
      if(userDetail.profile.userFollowList){
        let isFollow = userDetail.profile.userFollowList;
        let cheackIsFollow = isFollow.indexOf(userId);
        if(cheackIsFollow > -1){
          return  Users.update({
                _id: this.userId
            }, {
              $pull:
                {
                  'profile.userFollowList': userId
                }
              }
          );
        }else{
          return  Users.update({
                _id: this.userId
            }, {
              $push:
                {
                  'profile.userFollowList': userId
                }
              }
          );
        }
      }else{
        return  Users.update({
              _id: this.userId
          }, {
            $push:
              {
                'profile.userFollowList': userId
              }
            }
        );
      }


    },

    isFollow: function(userId){
      let userDetail = Users.findOne({'_id': this.userId});
      if(userDetail.profile.userFollowList){
        let isFriend = userDetail.profile.userFollowList;
        let cheackIsFriend = isFriend.indexOf(userId);
        if(cheackIsFriend > -1){
          return true;
        }else{
          return false;
        }
      }
    },

    friendFollowCounter(){
      let userDetail = Users.findOne({'_id': this.userId});
      let friendsCount, followCount;
      if(userDetail.profile.userFriendsList){
        friendsCount = userDetail.profile.userFriendsList.length;
      }else{
        friendsCount = 0;
      }
      if(userDetail.profile.userFollowList){
        followCount = userDetail.profile.userFollowList.length;
      }else{
        followCount = 0;
      }
      let followingCount=Users.find({ 'profile.userFollowList': { $in: [this.userId] } }).count()

      return {
        'friendsCount': friendsCount,
        'followersCount': followCount,
        'followingCount':followingCount
      };
    },
    saveEvent(eventID){
      let savedArray = Events.findOne({_id: eventID});
      if(savedArray.savedBy && savedArray.savedBy.indexOf(this.userId) > -1){
        return  Events.update({
              _id:eventID
          }, {
            $pull:
              {
                'savedBy': this.userId
              }
            }
        );
      }else{
        return  Events.update({
              _id:eventID
          }, {
            $push:
              {
                'savedBy': this.userId
              }
            }
        );
      }

    },
    repostEvent(eventID,cliqueIds, userId){
      let currentEvent=Events.findOne({_id:eventID});
      let newrepostClique=Sugar.Array.union(currentEvent.repostClique?currentEvent.repostClique:[], cliqueIds);
      let userArray=[]
      if(userId && userId!=""){
        userArray.push(userId)
      }
      let newrepostUser=Sugar.Array.union(currentEvent.repostUser?currentEvent.repostUser:[],userArray)
        return  Events.update({
              _id:eventID,
          }, {
            $set:
              {
                'repostClique': newrepostClique,
                'repostUser':newrepostUser
              }
            },

        );
    },
    addMessage(values){
      console.log('values',values);
      let getMessage;
      if(values.type=='user'){
        getMessage=Messages.findOne(
          {$or:
            [{ 'senderId':this.userId ,'receiverId': values.receiverId } ,
            {'senderId':values.receiverId ,'receiverId': this.userId }
        ]});
      }else if(values.type=='clique'){
         getMessage=Messages.findOne({'receiverId': values.receiverId});
      }

      if(values._id){
        getMessage=Messages.findOne({"_id":values._id});
      }
      // let getMessage=Messages.findOne({$or: [ { 'senderId':this.userId }, {'receiverId': values.receiverId } ],$or: [ { 'senderId':values.senderId }, {'receiverId': this.userId } ]});
      if(getMessage){
        // console.log('values',values);
          let chatObj={}
          chatObj['senderId']=this.userId;
          if(values.message){
            chatObj['message']=values.message;
          }
          if(values.image){
            chatObj['image']=values.image;
          }
          chatObj['isRead']=false;
          chatObj['updatedAt']=new Date();
          if(values.message || values.image){
          Messages.update({
                _id:getMessage._id
            }, {
              $push:
                {
                  'chats': chatObj
                }
              }
          );
        }
        return getMessage._id;
      }
      else {
        let newObj={};
        newObj['senderId']=this.userId;
        newObj['receiverId']=values.receiverId;
        newObj['type']=values.type;
        newObj['chats']=[]
        if(values.message){
          let chatObj={}
          chatObj['senderId']=this.userId;
          if(values.message){
            chatObj['message']=values.message;
          }
          if(values.image){
            chatObj['image']=values.image;
          }
          chatObj['isRead']=false;
          chatObj['updatedAt']=new Date();
          newObj['chats']=[chatObj]
        }
        return  Messages.insert(newObj)
      }
    },
    getCurrentMessages(){
      return Messages.find({$or: [ { 'senderId':this.userId }, {'receiverId': this.userId } ]}).fetch();
      let messagesSenderId=[];
      let messages=Messages.find({$or: [ { 'senderId':this.userId }, {'receiverId': this.userId } ]}).fetch();
              messages.forEach(function(d,i){
                  messagesSenderId.push(d.senderId)
              })
      let messageUserDetail = Users.findOne({'_id': { "$in": messagesSenderId }});

      //return  {'messages':messages,'UserDetails':messageUserDetail} ;
      // return {
      //       find: function() {
      //         return Messages.find({$or: [ { 'senderId':this.userId }, {'receiverId': this.userId } ]}).fetch();
      //       },
      //       children: [
      //         {
      //           find:function(messages) {
      //             return Users.find({_id:messages.senderId});
      //           }
      //         }
      //       ]
      // }


    },

    checkEvent(eventID, cheackOption){
          console.log('call this-> check event');
        return  Events.update({
              _id:eventID
          }, {
            $push:
              {
                'checkIn': {
                  'userId': this.userId,
                  'checkInOption': cheackOption,
                  'description': '',
                  'media': [],
                  'createdAt': new Date()
                }
              }
            }
        );


    },

    PostEvent(eventID, postData){
      let self = this;
      let getEvent = Events.findOne({_id:eventID});
      let newCheckInArray = [];
      if(getEvent.checkIn && getEvent.checkIn.length > 0){

        getEvent.checkIn.forEach((d, i) => {
          if(d.userId == self.userId){
            d['media'] = postData.media;
            d['description'] = postData.description;
            d['createdAt'] = new Date();
            newCheckInArray.push(d);
          }else{
            newCheckInArray.push(d);
          }
        })

        return  Events.update({
              _id:eventID
          }, {
            $set:
              {
                'checkIn': newCheckInArray
              }
            }
        );

      }
    },

    getMediaByUser(userId, type){
      let events =  [];

      if(type == 'event'){
        events =  Events.find({'_id': userId, 'checkIn': { $exists: true } }).fetch();

      }else{
        events =  Events.find({'repostUser': { $in: [userId] }, 'checkIn': { $exists: true } }).fetch();

      }
      let allMedia = [];
      events.forEach((d, i) => {
        d.checkIn.forEach((dd,ii) => {
          dd.media.forEach((ddd,iii) => {
            allMedia.push(ddd);
          })
        })
      })
      console.log('allMedia',allMedia);
      return allMedia;
    },

    eventAttendCliqueAndUserUpdate(id, selectedAttendFreinds, selectedAttendCliques){
      return  Events.update({
            _id:id
        }, {
          $set:
            {
              'selectedAttendCliques': selectedAttendCliques,
              'selectedAttendFriends': selectedAttendFreinds
            }
          }
      );
    },

    testMethod(){

      return Sugar.Array.union([1,3,5], [5,7,9])

    }
})
