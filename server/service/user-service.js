const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw new Error(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    // Проверяем есть ли пользователь с таким email, if true throw error
    const hashPassword = await bcrypt.hash(password, 3); // хешируем пароль
    const activationLink = uuid.v4(); // и делаем ссылку для активации v34fa-sad2ds-132dsa-fd-fdf

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    // сохраняем пользователя в бд

    const userDto = new UserDto(user); // id, email, isActivated
    // отправляем на почту письмо для активации
    const tokens = tokenService.generateTokens({ ...userDto }); // генерируем токены
    await tokenService.saveToken(userDto.id, tokens.refreshToken); // сохраняем токены в базу данных

    return {
      ...tokens,
      user: userDto,
    };
    // возвращаем данных о пользователе и токены
  }
}
module.exports = new UserService();
