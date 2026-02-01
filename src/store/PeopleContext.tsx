import React, { useEffect, useState } from 'react';
import { Person } from '../types';
import { getPeople } from '../api';

interface Props {
  children: React.ReactNode;
}

enum Notification {
  Initial = '',
  LoadingError = 'Something went wrong',
  NoPeople = 'There are no people on the server',
}

export const UsersContext = React.createContext({
  people: [] as Person[],
  message: Notification.Initial,
  loading: false,
});

export const PeopleProvider: React.FC<Props> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [message, setMessage] = useState<Notification>(Notification.Initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMessage(Notification.Initial);

    getPeople()
      .then(persons => {
        if (persons.length === 0) {
          setMessage(Notification.NoPeople);
        } else {
          setPeople(persons);
        }
      })
      .catch(() => {
        setMessage(Notification.LoadingError);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = React.useMemo(
    () => ({ people, message, loading }),
    [people, message, loading],
  );

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};
