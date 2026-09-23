const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Usuario {
        id: Int!
        nombre: String!
        correo: String!
        edad: Int!
    }

    input UsuarioInput {
        nombre: String!
        correo: String!
        edad: Int!
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
  usuarios: [Usuario!]!
  usuario(id: Int!): Usuario

  products: [Product!]!
  product(id: ID!): Product
}
    type Mutation {
        crearUsuario(datos: UsuarioInput!): Usuario!
        actualizarUsuario(id: Int!, datos: UsuarioInput!): Usuario!
        eliminarUsuario(id: Int!): Usuario!

        createProduct(input: ProductInput!): Product!
        updateProduct(id: ID!, input: ProductInput!): Product!
        deleteProduct(id: ID!): DeleteResult!
    }
`);

module.exports = schema;
