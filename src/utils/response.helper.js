const sendSuccessResponse = (res, data, message) => {
  res.status(200).json({
    type: 'success',
    status: true,
    message,
    data,
  });
};

const sendCreateResponse = (res, data, message) => {
  res.status(201).json({
    type: 'create',
    status: true,
    message,
    data,
  });
};

const sendUpdateResponse = (res, data, message) => {
  res.status(201).json({
    type: 'update',
    status: true,
    message,
    data,
  });
};

const sendFailureResponse = (res, message) => {
  res.status(400).json({
    type: 'bad',
    status: false,
    message,
  });
};

const sendServerErrorResponse = (res, error) => {
  res.status(500).json({
    type: 'error',
    status: false,
    message: 'Internal Server Error',
    error,
  });
};

module.exports = {
  sendSuccessResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendFailureResponse,
  sendServerErrorResponse,
};
