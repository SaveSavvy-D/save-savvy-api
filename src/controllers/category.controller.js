const { Category } = require('../models');
const {
  sendSuccessResponse,
  sendFailureResponse,
  sendServerErrorResponse,
} = require('../utils/response.helper');

const CategoryController = {
  createCategory: async (req, res) => {
    const { title, description, image } = req.body;

    const newCategory = {
      title,
      description,
      image,
    };

    try {
      const category = await Category.create(newCategory);

      return sendSuccessResponse(
        res,
        { category },
        'Category created successfully',
      );
    } catch (err) {
      console.error(err.message);

      return sendServerErrorResponse(res, err.message);
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return sendFailureResponse(res, [{ msg: 'Category not found' }]);
      }

      return sendSuccessResponse(res, { category });
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Category not found' }]);
      }

      return sendServerErrorResponse(res, err.message);
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();

      if (categories.length === 0) {
        return sendFailureResponse(res, [{ msg: 'Categories not found' }]);
      }

      return sendSuccessResponse(res, { categories });
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Categories not found' }]);
      }

      return sendServerErrorResponse(res, err.message);
    }
  },
};

module.exports = CategoryController;
