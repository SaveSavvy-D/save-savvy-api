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

const sendNotFoundResponse = (res, message) => {
  res.status(404).json({
    type: 'notFound',
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

const sendAuthErrorResponse = (res, message) => {
  res.status(401).json({
    type: 'failed',
    status: false,
    message,
  });
};

const sendValidationErrorResponse = (res, errors) => {
  res.status(422).json({
    type: 'validation error',
    status: false,
    errors,
  });
};

module.exports = {
  sendSuccessResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendFailureResponse,
  sendServerErrorResponse,
  sendNotFoundResponse,
  sendAuthErrorResponse,
  sendValidationErrorResponse,
};
