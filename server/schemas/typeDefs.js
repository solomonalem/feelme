const { gql } = require("apollo-server-express");


const typeDefs= gql`

 type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
      }

 type Reaction{
     _id:ID
     reactionBody:String
     username:String
     createdAt:String
    }

 type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions:[Reaction]

    }


 type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

 type Mutation{
     addUser(username:String!,email:String!,password:String!): User
 }
`
module.exports = typeDefs;