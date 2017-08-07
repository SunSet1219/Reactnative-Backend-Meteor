import {
    Users
} from '/imports/api/collections/user';
import {
    Cliques
} from '/imports/api/collections/cliques';
import {
    Events
} from '/imports/api/collections/events';
import { Messages } from '/imports/api/collections/messages.js';

import moment from 'moment';

Meteor.publish('userDetail', (userId) => {
    return Users.find({
        "_id": userId
    });
});

Meteor.publish('allUserPublish', () => {
    return Users.find({});
});

Meteor.publish('cliqueDetail', (cliqueId) => {
    return Cliques.find({
        "_id": cliqueId
    });
});

Meteor.publish('allCliques', () => {
    return Cliques.find({});
});

Meteor.publish('allEvents', () => {
  return [Events.find({}),Users.find({}),Cliques.find({})];
});

Meteor.publish('allCalendarEvents', () => {
  var start = new Date();
  // start.setHours(0,0,0,0);
  var end = new Date();
  end.setHours(23,59,59,999);
  return [Events.find({'fromTime':{ $gte: start }}),Users.find({}),Cliques.find({})];
});
Meteor.publish('AllcliqueOrUsers', () => {
    return [Cliques.find({}),Users.find({})];
});

Meteor.publish('allEventsOfcurrentUser', () => {
      return Events.find({});
});
Meteor.publish('allMessageOfcurrentUser', (userid) => {
  let allCliquesOfcurrentUser=Cliques.find({ 'members': { $in: [userid] } }).fetch();
  let allCliqueIds=[];
  allCliqueIds.push(userid)
  allCliquesOfcurrentUser.forEach(function(d,i){
    allCliqueIds.push(d._id);
  })
      //console.log('allCliqueIds',allCliqueIds);
      // console.log('message',Messages.find({'receiverId': { $in: allCliqueIds }}).count());
      return [Messages.find({$or: [ { 'senderId':userid },{'receiverId': { $in: allCliqueIds }} ]}),Users.find({}),Cliques.find({})];
});
Meteor.publish('allUsersNotFollowingTocurrentUser', () => {
  // filter current User
    return Users.find({ 'profile.userFollowList': { $nin: [this.userId] } })
});
Meteor.publish('allCliquesNotMemberOfcurrentUser', () => {
      return Cliques.find({ 'members': { $nin: [this.userId] } })
});
Meteor.publish('allCliquesOfcurrentUser', () => {
      return Cliques.find({ 'members': { $in: [this.userId] } })
});
Meteor.publish('allEventsSavedBycurrentUser', () => {
      return Events.find({'userId':this.userId, 'savedBy': { $in: [this.userId] } })
});
Meteor.publish('allEventsGoingBycurrentUser', () => {
      return Events.find({'userId':this.userId, 'isRepost': true})
});
Meteor.publish('allEventsHostOrMemberBycurrentUser', () => {
      return Events.find({$or: [ { 'userId':this.userId }, { 'selectedUsers': { $in: [this.userId] } }]})
});
Meteor.publish('allEventsFollowingBycurrentUser', () => {
  let allFollowingUsers=  Users.find({ 'profile.userFollowList': { $in: [this.userId] } }).fetch();
  let userIds=[]
  allFollowingUsers.forEach(function(d,i){
    userIds.push(d._id)
  })
      return Events.find({ 'userId': { $in: userIds }, 'isRepost': true})
});

Meteor.publish('allCliquesAdministratorBycurrentUser', () => {
      return Cliques.find( { 'administrators': { $in: [this.userId] }})
});

Meteor.publish('getMessageById', (id) => {
      return [Messages.find( { "_id": id}),Users.find({}),Cliques.find({})]
});
