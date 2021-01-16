const {User} = require('../models/')
const resolvers = {
    Query:{
        users:async ()=>{
             const users = await  User.find()
             .select('-__v -password');

             return users;
        },
        user : async(_ ,{username})=>{
            const user = await  User.findOne({username})
            .select('-__v -password');

            return user;
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