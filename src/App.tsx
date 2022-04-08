import React, { memo, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import './styles.css';
import { INITIAL_LIST, LIST_SIZE, TIME_INTERVAL } from './constants';

const getCollection = (name: string) =>
  fetch(
    `https://itunes.apple.com/search?term=${name}`
  )
    .then((res) => res.json())
    .then((data) =>
      data.results
        .map((item: any) => item.collectionName)
        .filter((item: string) => Boolean(item))
        .sort((a: string, b: string) => a.localeCompare(b))
    );

const List = memo(({ list }: any) => {
  const [currentList, setCurrentList] = useState(list);

  useEffect(() => {
    setCurrentList((list: []) => [
      ...list.slice(0, LIST_SIZE),
      ...list
    ]);
  }, [list]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentList((list: []) => {
        const newList = list.slice(1);
        return newList.length >= LIST_SIZE ? newList : [...newList, ...list];
      });
    }, TIME_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [list]);

  return (
    <div className="list-container">
      {currentList.slice(0, LIST_SIZE).map((item: string, i: number) => (
        <div key={i} className="list-item">
          {item}
        </div>
      ))}
    </div>
  );
});

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState(INITIAL_LIST);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  useEffect(() => {
    if (inputValue.length > 1) {
      getCollection(inputValue).then((names) => {
        if (names.length > 0) {
          setList([...names].slice(0, LIST_SIZE));
        }
      });
    }
  }, [inputValue]);

  return (
    <div className="App">
      <TextField
        id="outlined-basic"
        label="Search Band"
        variant="outlined"
        className="searchInput"
        type="search"
        value={inputValue}
        onChange={handleInputChange}
      />
      <List list={list}/>
    </div>
  );
};
