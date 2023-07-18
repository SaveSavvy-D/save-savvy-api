const { Category } = require('../models');
const {
  sendSuccessResponse,
  sendFailureResponse,
} = require('../utils/response.helper');
const { serverResponse } = require('../middlewares/validators/validatorResponse');

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
    } catch (error) {
      console.error(error.message);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return sendFailureResponse(res, [{ msg: 'Category not found' }]);
      }

      return sendSuccessResponse(res, { category });
    } catch (error) {
      console.error(error.message);

      if (error.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Category not found' }]);
      }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();

      if (categories.length === 0) {
        return sendFailureResponse(res, [{ msg: 'Categories not found' }]);
      }

      return sendSuccessResponse(res, { categories });
    } catch (error) {
      console.error(error.message);

      if (error.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Categories not found' }]);
      }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
};

module.exports = CategoryController;
