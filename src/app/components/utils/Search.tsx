'use client'

import { useState, useEffect, useRef } from 'react';
import { searchUsername, debounceSearch } from '../../actions';
import { redirect } from 'next/navigation'
import style from './../styles/Search.module.css';

// Go to user page by "enter" key
async function handleSearch(event: React.FormEvent<HTMLFormElement>, username: string) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way
  console.log({ username });
  const formData = new FormData();
  formData.append('username', username);
  const res = await searchUsername(formData);

  if (!res.result) {
    alert('No user found');
  } else if (res.code === "NotFound") {
    alert('No user found');
  } else {
    return redirect(`/users/${res.result.user.fid}`)
  }
}

// Custom hook for debouncing
function useDebounce(callback: Function, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Clean up the timer on unmount
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [delay]);

  const debouncedCallback = (...args: any[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
}

export default function Page() {
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDebouncedSearch = useDebounce(async (searchTerm: string) => {
    if (!searchTerm) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const res = await debounceSearch(searchTerm);
    if (res.result && res.result.users) {
      setSearchResults(res.result.users);
    } else {
      setSearchResults([]);
    }
    setIsLoading(false);
  }, 400); // Adjusted to 250ms as you specified

  useEffect(() => {
    if (username) {
      handleDebouncedSearch(username);
    }
  }, [username]); // Dependency array ensures this effect runs only when username changes

  return (
    <div className={style.search}>
       <form onSubmit={(e) => handleSearch(e, username)}>
        <input
          id="username"
          name="username"
          placeholder="Search by username"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
        />

        <button type="submit" disabled={!username}>
          Search
        </button>
      </form>
      <div className={style.results}>
        {isLoading ? (
          <p>Searching for @{username}...</p>
        ) : searchResults.length === 0 && username ? (
          <p>No results found for '{username}'</p>
        ) : (
          searchResults.map((user: any) => (
            <div key={user.fid} className={style.resultItem}>
                <div>
                  <a className={style['link-wrapper']} href={`/users/${user.fid}`}>
                    <img src={user.pfp_url ? user.pfp_url : "/avatar.png"} />
                    <p className={style['name']}>{user.display_name ? user.display_name : "No name"}</p>
                    <p className={style['username']}>@{user.username ? user.username : "noname"}</p>
                  </a>
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.94531 5.83105C6.94531 5.90853 6.93164 5.97917 6.9043 6.04297C6.87695 6.10677 6.83366 6.16602 6.77441 6.2207L1.63379 11.1973C1.53353 11.2975 1.4082 11.3477 1.25781 11.3477C1.15755 11.3477 1.06641 11.3249 0.984375 11.2793C0.906901 11.2383 0.843099 11.1768 0.792969 11.0947C0.747396 11.0127 0.724609 10.9215 0.724609 10.8213C0.724609 10.6755 0.77474 10.5501 0.875 10.4453L5.64648 5.83105L0.875 1.22363C0.77474 1.11426 0.724609 0.988932 0.724609 0.847656C0.724609 0.742839 0.747396 0.651693 0.792969 0.574219C0.843099 0.492188 0.906901 0.428385 0.984375 0.382812C1.06641 0.33724 1.15755 0.314453 1.25781 0.314453C1.4082 0.314453 1.53353 0.366862 1.63379 0.47168L6.77441 5.44824C6.83366 5.50293 6.87695 5.56217 6.9043 5.62598C6.93164 5.68978 6.94531 5.75814 6.94531 5.83105Z" fill="white"/></svg>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
