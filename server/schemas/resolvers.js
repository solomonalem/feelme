const {User, Thought} = require('../models/')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query:{

        // MY PROFILE

        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');
          
              return userData;
            }
          
            throw new AuthenticationError('Not logged in');
          
        },
       // GET ALL USERS 
        users:async ()=>{
             const users = await  User.find()
             .select('-__v -password');

             return users;
        },

     // SINGLE USER
        user : async(_ ,{username})=>{
            const user = await  User.findOne({username})
            .select('-__v -password')
            .populate('thoughts')
            .populate('friends');

            return user;
        },

     // GET ALL THOUGHTS
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },

     // SINGLE THOUGHT
        thought:async (parents,{_id}) =>{
            return Thought.findOne({_id})
        }

        
    },
    Mutation:{
        // SIGN-UP
        addUser :async(parents ,args)=>{
            const user = await User.create(args)

            const token = signToken(user);
            return { token, user };

        },
        // LOGIN
        login:async(parents,{email,password}) =>{

            const user = await User.findOne({email});
            if(!user){
                throw new AuthenticationError('incorrect credentials')
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('incorrect credentials')
            }
            const token = signToken(user);
            return { token, user };
        },

        // ADD THOUGHT

        addThought: async (parent, args, context) => {
            if (context.user) {
              const thought = await Thought.create({ ...args, username: context.user.username });
          
              await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { thoughts: thought._id } },
                { new: true }
              );
          
              return thought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },

          // ADD REACTION 
          addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
              const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $push: { reactions: { reactionBody, username: context.user.username } } },
                { new: true, runValidators: true }
              );
          
              return updatedThought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },

          // ADD FRIEND
          addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { friends: friendId } },
                { new: true }
              ).populate('friends');
          
              return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          }
    }

}

module.exports= resolvers;