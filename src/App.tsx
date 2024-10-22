import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Define TypeScript types
type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type User = {
  firstName: string;
  lastName: string;
};

// Styled components for layout
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;
`;

const PostCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
`;

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userNames, setUserNames] = useState<{ [key: number]: User }>({});

  // Fetch posts and user names on component load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch the first 10 posts
        const postResponse = await fetch('https://dummyjson.com/posts');
        const postData = await postResponse.json();
        const firstTenPosts = postData.posts.slice(0, 10);
        setPosts(firstTenPosts);

        // Fetch user data for each post based on userId
        const userData = await Promise.all(
          firstTenPosts.map(async (post) => {
            const userResponse = await fetch(
              `https://dummyjson.com/users/${post.userId}`
            );
            const user = await userResponse.json();
            return {
              userId: post.userId,
              firstName: user.firstName,
              lastName: user.lastName,
            };
          })
        );

        // Create a user map for quick lookup
        const userMap: { [key: number]: User } = {};
        userData.forEach((user) => {
          userMap[user.userId] = {
            firstName: user.firstName,
            lastName: user.lastName,
          };
        });
        setUserNames(userMap);
      } catch (error) {
        console.error('Error fetching posts or users:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container>
      {posts.map((post) => (
        <PostCard key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          {userNames[post.userId] && (
            <p>
              Author: {userNames[post.userId].firstName}{' '}
              {userNames[post.userId].lastName}
            </p>
          )}
        </PostCard>
      ))}
    </Container>
  );
};

export default App;
