import React from 'react';

interface User {
  _id: string;
  username: string;
}

interface ListProps {
  data: {
    list: User[];
  };
}

const List: React.FC<ListProps> = ({ data }) => {
  const { list } = data;

  return (
    <nav >
      <ul>
        {list.map((item) => (
          <li key={item._id}>
            <a href='/'>{item.username}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default List;

