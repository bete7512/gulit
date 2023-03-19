import bcrypt from 'bcrypt';
import { config as dotenvConfig } from 'dotenv';
import { User } from '../tools/user';
import jwt from 'jsonwebtoken';
import { USER_QUERY_BY_ID } from '../constants/query';

dotenvConfig();

const handler = async (req, res) => {
  const { phone, password } = req.body.input.inputs;
  console.log(phone, password);
  const user  = await User({ phone }, USER_QUERY_BY_ID);
  console.log(user);

  if (!user) {
    return res.status(400).json({
      message: 'incorrect username or password please enter again',
    });
  } else {
    const value = await bcrypt.compare(password, user.password);
    console.log(value);
    if (!value) {
      return res.status(400).json({
        message: 'incorrect password',
      });
    }

    console.log(user.user_roles);
    let roles = [];
    user.user_roles.forEach((role) => {
      roles.push(role.role.name);
    });

    const token = jwt.sign(
      {
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': [
            'admins',
            'operator',
            'technician',
          ],
          'x-hasura-default-role': roles[0],
          'x-hasura-user-id': `${user.id}`,
        },
      },
      process.env.HASURA_GRAPHQL_JWT_SECRET
    );

    return res.json({
      accestoken: token,
      id: user.id,
    });
  }
};


module.exports = handler;