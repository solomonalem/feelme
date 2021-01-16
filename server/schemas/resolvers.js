const {User, Thought} = require('../models/')
const resolvers = {
    Query:{
       // GET ALL USERS 
        users:async ()=>{
             const users = await  User.find()
             .select('-__v -password');

             return users;
        },

     // SINGLE USER
        user : async(_ ,{username})=>{
            const user = await  User.findOne({username})
            .select('-__v -password');

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
        addUser :async(parents ,args)=>{
            const user = await User.create(args)
            return user;

        }
    }
}

module.exports= resolvers;