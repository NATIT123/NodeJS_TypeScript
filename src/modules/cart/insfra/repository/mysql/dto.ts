import { DataTypes, Model, Sequelize } from "sequelize";

export class CartPersistence extends Model {}

export const modelName = "Cart";

export function init(sequelize: Sequelize) {
  CartPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      attribute: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },

      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "product_id",
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "carts",
    }
  );

  // CategoryPersistence.init(
  //   {
  //     id: {
  //       type: DataTypes.STRING,
  //       primaryKey: true,
  //     },

  //     name: {
  //       type: DataTypes.STRING,
  //       allowNull: false
  //     },
  //   },
  //   {
  //     sequelize,
  //     modelName: 'ProductCategory',
  //     // timestamps: true,
  //     createdAt: false,
  //     updatedAt: false,
  //     tableName: 'categories'
  //   }
  // );

  // BrandPersistence.init(
  //   {
  //     id: {
  //       type: DataTypes.STRING,
  //       primaryKey: true,
  //     },

  //     name: {
  //       type: DataTypes.STRING,
  //       allowNull: false
  //     },
  //   },
  //   {
  //     sequelize,
  //     modelName: 'ProductBrand',
  //     // timestamps: true,
  //     createdAt: false,
  //     updatedAt: false,
  //     tableName: 'brands'
  //   }
  // );

  // ProductPersistence.belongsTo(CategoryPersistence, { foreignKey: { field: 'category_id' }, as: 'category' });
  // ProductPersistence.belongsTo(BrandPersistence, { foreignKey: { field: 'brand_id' }, as: 'brand' });
}
