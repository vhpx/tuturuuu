import { createContext, useContext, useState } from 'react';
import { UserData } from '../types/primitives/UserData';
import { useUserData } from './useUserData';

const UserListContext = createContext({
  users: [] as UserData[],
  addUser: (user: UserData) => console.log('addUser', user),
  removeUser: (user: string) => console.log('removeUser', user),
  updateUsers: (users: UserData[]) => console.log('updateUsers', users),
  clearUsers: () => console.log('clearUsers'),
});

export const UserListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const { data: currentUser } = useUserData();

  const addUser = (user: UserData) => {
    // If the user is already in the list, don't add them again
    if (users.includes(user)) return;

    // If the user is the current user, don't add them
    if (currentUser?.id === user.id) return;

    setUsers((users) => [...users, user]);
  };

  const removeUser = (userId: string) => {
    setUsers((users) => users.filter((user) => user.id !== userId));
  };

  const updateUsers = (newUsers: UserData[]) => {
    if (!newUsers || newUsers.length === 0) {
      setUsers([]);
      return;
    }

    const isEmpty = users.length === 0;
    const isDifferent =
      !newUsers.every((user) => users.map((u) => u.id).includes(user.id)) ||
      !users.every((user) => newUsers.map((u) => u.id).includes(user.id));

    const shouldDelay = isEmpty || isDifferent;

    const delay = 300;

    // If the user list is empty, delay before updating it
    if (shouldDelay) {
      setUsers([]);
      setTimeout(() => setUsers(newUsers), delay);
    } else setUsers(newUsers);
  };

  const clearUsers = () => {
    setUsers([]);
  };

  const values = {
    users,
    addUser,
    removeUser,
    updateUsers,
    clearUsers,
  };

  return (
    <UserListContext.Provider value={values}>
      {children}
    </UserListContext.Provider>
  );
};

export const useUserList = () => {
  const context = useContext(UserListContext);

  if (context === undefined)
    throw new Error(`useUserList() must be used within a UserListProvider.`);

  return context;
};