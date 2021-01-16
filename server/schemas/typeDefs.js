const { gql } = require("apollo-server-express");


const typeDefs= gql`
 type User {
     _id: ID
     username:String
     email:String
     password:String
    }

 type Reaction{
     _id:ID
     reactionBody:String
     username:String
     createdAt:String
    }

 type Thought{
     _id:ID
     thoughtText:String
     createdAt:String
     username:String
     reactions:[Reaction]
   }

 type Query{
     users: [User]
     user(username:String!):User
 }

 type Mutation{
     addUser(username:String!,email:String!,password:String!): User
 }
`
module.exports = typeDefs;