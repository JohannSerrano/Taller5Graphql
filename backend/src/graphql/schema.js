const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type User {
        id: ID!
        name: String!
        email: String!
    }

    input UserInput {
        name: String!
        email: String!
    }

    type Product {
        id: ID!
        name: String!
        description: String!
        price: Float!
        stock: Int!
    }

    input ProductInput {
        name: String!
        description: String!
        price: Float!
        stock: Int!
    }

    type DeleteResult {
        success: Boolean!
        message: String!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User

        products: [Product!]!
        product(id: ID!): Product
    }

    type Mutation {
        createUser(input: UserInput!): User!
        updateUser(id: ID!, input: UserInput!): User!
        deleteUser(id: ID!): DeleteResult!

        createProduct(input: ProductInput!): Product!
        updateProduct(id: ID!, input: ProductInput!): Product!
        deleteProduct(id: ID!): DeleteResult!
    }
`);

module.exports = schema;
