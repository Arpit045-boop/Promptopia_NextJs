'use client';
import React, { useEffect, useState } from 'react'
import PromptCard from "./PromptCard";

let debounceTimer;

const PromptCardList =({data,handleTagClick,searchText})=>{
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Clear the previous timer
    clearTimeout(debounceTimer);

    // Set a new timer to delay the filtering operation
    debounceTimer = setTimeout(() => {
      const filtered = data.filter((post) => {
        return searchText && (post.prompt.includes(searchText) || post.creator.email.includes(searchText)
          || post.creator.username.includes(searchText) || post.tag.includes(searchText)
        );
      });

      setFilteredData(filtered);
    }, 300); //Delay time of 300 miliseconds

    // Clean up the timer when the component unmounts
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchText, data]);


  return (
    <div className='mt-16 prompt_layout'>
       {searchText
        ? filteredData.map((postItem) => (
            <PromptCard
              key={postItem._id}
              post={postItem}
              handleTagClick={handleTagClick}
            />
          ))
        : data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleTagClick={handleTagClick}
            />
          ))}
      
      
      
    </div>
  )
}
function Feed() {
  const [searchText , setSearchText] = useState('');
  const [posts,setPosts] = useState([]);

  const handleSearchChange = (e)=>{
    setSearchText(e.target.value);
  }

  useEffect(()=>{
    const fetchPost = async()=>{
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
      // console.log(posts);
    }
    fetchPost();
  })

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a prompt or username or email or tag'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>
      <PromptCardList
      data= {posts}
      handleTagClick = {()=>{}}
      searchText = {searchText}

      />
    </section>
  )
}

export default Feed