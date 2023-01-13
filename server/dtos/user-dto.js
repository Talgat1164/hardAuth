module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id; // mongo к айди добавляет _ указывая что поле не изменяемое
    this.isActivated = model.isActivated;
  }
};
