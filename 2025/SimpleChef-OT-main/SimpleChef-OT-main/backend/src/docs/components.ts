export const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  schemas: {
    Ingredient: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Tomato" },
      },
      example: { id: 1, name: "Tomato" },
    },
    Recipe: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        title: { type: "string", example: "Pannukakku" },
        description: { type: "string", example: "Helppo jälkiruoka" },
        ingredients: {
          type: "array",
          items: { $ref: "#/components/schemas/Ingredient" },
        },
        instructions: { type: "string", example: "Sekoita aineet ja paista" },
        imageUrl: { type: "string", nullable: true },
        isPublic: { type: "boolean", example: false },
        createdAt: { type: "string", format: "date-time" },
      },
      example: {
        id: 1,
        title: "Pannukakku",
        description: "Helppo ja nopea jälkiruoka koko perheelle.",
        ingredients: [
          { id: 1, name: "Jauhot" },
          { id: 2, name: "Maito" },
          { id: 3, name: "Muna" },
        ],
        instructions:
          "Sekoita kaikki ainekset kulhossa tasaiseksi taikinaksi. Kuumenna pannu, paista n. 2 min/puoli kullankeltaiseksi.",
        imageUrl: null,
        isPublic: false,
        createdAt: "2025-12-09T12:34:56Z",
      },
    },
    CreateRecipe: {
      type: "object",
      required: ["title", "ingredients", "instructions"],
      properties: {
        title: { type: "string" },
        ingredients: {
          type: "array",
          items: { $ref: "#/components/schemas/Ingredient" },
        },
        instructions: { type: "string" },
        description: { type: "string" },
        imageUrl: { type: "string" },
        isPublic: { type: "boolean" },
      },
      example: {
        title: "Pannukakku",
        ingredients: [
          { id: 1, name: "Jauhot" },
          { id: 2, name: "Maito" },
          { id: 3, name: "Muna" },
        ],
        instructions: "Sekoita aineet ja paista pannulla.",
        description: "Nopea ja helppo jälkiruoka.",
        imageUrl: null,
        isPublic: false,
      },
    },
    Favorite: {
      type: "object",
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        recipeId: { type: "integer" },
        recipe: { $ref: "#/components/schemas/Recipe" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    AuthRegister: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email", example: "user@example.com" },
        password: { type: "string", example: "secret123" },
      },
    },
    AuthLogin: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email", example: "user@example.com" },
        password: { type: "string", example: "secret123" },
      },
    },
    TokenResponse: {
      type: "object",
      properties: {
        token: { type: "string" },
      },
    },
  },
};

export const tags = [
  {
    name: "Auth",
    description: "Authentication endpoints: register and login",
  },
  {
    name: "Recipes",
    description: "Recipe CRUD endpoints",
  },
  {
    name: "Favorites",
    description: "User favorites endpoints",
  },
];

export default { components, tags };
