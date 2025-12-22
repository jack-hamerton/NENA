
import { userService } from '../services/userService';

export const useUser = () => {
  const getUser = async (userId) => {
    return await userService.getUser(userId);
  };

  return { getUser };
};
