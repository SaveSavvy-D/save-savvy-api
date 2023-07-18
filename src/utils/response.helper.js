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

const sendFailureResponse = (res, errors) => {
  res.status(400).json({
    type: 'bad',
    status: false,
    errors,
  });
};

const sendNotFoundResponse = (res, errors) => {
  res.status(404).json({
    type: 'notFound',
    status: false,
    errors,
  });
};

const sendServerErrorResponse = (res, errors) => {
  res.status(500).json({
    type: 'error',
    status: false,
    errors,
  });
};

const sendAuthErrorResponse = (res, errors) => {
  res.status(401).json({
    type: 'failed',
    status: false,
    errors,
  });
};

const sendValidationErrorResponse = (res, errors) => {
  res.status(422).json({
    type: 'validation error',
    status: false,
    errors,
  });
};

const sendDeleteResponse = (res, message) => {
  res.status(200).json({
    type: 'delete',
    status: true,
    message,
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
  sendDeleteResponse,
};
