// PostCard Component Tests

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PostCard from '../../src/components/posts/PostCard';
import type { Post } from '../../src/types';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.count !== undefined) {
        return `${options.count}`;
      }
      return key;
    },
  }),
}));

describe('PostCard Component', () => {
  const mockPost: Post = {
    post_id: '1',
    user_id: 'user123',
    title: 'Test Post Title',
    content: 'This is test post content',
    username: 'TestUser',
    avatar: '😀',
    timestamp: Date.now(),
    bus_tag: '路线1',
    likes: 10,
    comments: 5,
    image_urls: '',
    is_liked: false,
  };

  it('should render post correctly', () => {
    const { getByText } = render(<PostCard post={mockPost} onLike={() => {}} />);

    expect(getByText('Test Post Title')).toBeTruthy();
    expect(getByText('This is test post content')).toBeTruthy();
    expect(getByText('TestUser')).toBeTruthy();
    expect(getByText('路线1')).toBeTruthy();
  });

  it('should display avatar emoji', () => {
    const { getByText } = render(<PostCard post={mockPost} onLike={() => {}} />);
    expect(getByText('😀')).toBeTruthy();
  });

  it('should display like count', () => {
    const { getByText } = render(<PostCard post={mockPost} onLike={() => {}} />);
    expect(getByText(/10/)).toBeTruthy();
  });

  it('should display comment count', () => {
    const { getByText } = render(<PostCard post={mockPost} onLike={() => {}} />);
    expect(getByText(/5/)).toBeTruthy();
  });

  it('should call onLike when like button pressed', () => {
    const onLikeMock = jest.fn();
    const { getAllByText } = render(<PostCard post={mockPost} onLike={onLikeMock} />);

    const likeIcon = getAllByText('👍')[0];
    fireEvent.press(likeIcon);

    expect(onLikeMock).toHaveBeenCalledWith('1', true);
  });

  it('should toggle like state', () => {
    const { getAllByText, getByText } = render(<PostCard post={mockPost} onLike={() => {}} />);

    // Initial state
    expect(getByText(/10/)).toBeTruthy();

    // Click like
    const likeIcon = getAllByText('👍')[0];
    fireEvent.press(likeIcon);

    // Like count should increase
    expect(getByText(/11/)).toBeTruthy();

    // Click again to unlike
    fireEvent.press(likeIcon);

    // Like count should decrease
    expect(getByText(/10/)).toBeTruthy();
  });

  it('should render post with already liked state', () => {
    const likedPost = { ...mockPost, is_liked: true };
    const { getByText } = render(<PostCard post={likedPost} onLike={() => {}} />);

    expect(getByText(/10/)).toBeTruthy();
  });

  it('should call onPress when card pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<PostCard post={mockPost} onLike={() => {}} onPress={onPressMock} />);

    fireEvent.press(getByText('Test Post Title'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('should render without bus tag', () => {
    const postWithoutTag = { ...mockPost, bus_tag: '' };
    const { queryByText } = render(<PostCard post={postWithoutTag} onLike={() => {}} />);

    expect(queryByText('路线1')).toBeNull();
  });

  it('should render with images', () => {
    const postWithImages = {
      ...mockPost,
      image_urls: 'https://example.com/1.jpg,https://example.com/2.jpg',
    };
    const { UNSAFE_getAllByType } = render(<PostCard post={postWithImages} onLike={() => {}} />);

    const Image = require('react-native').Image;
    const images = UNSAFE_getAllByType(Image);
    expect(images.length).toBeGreaterThan(0);
  });

  it('should render maximum 3 images', () => {
    const postWithManyImages = {
      ...mockPost,
      image_urls: 'url1,url2,url3,url4,url5',
    };
    const { UNSAFE_getAllByType } = render(<PostCard post={postWithManyImages} onLike={() => {}} />);

    const Image = require('react-native').Image;
    const images = UNSAFE_getAllByType(Image);
    // Should only render 3 images
    expect(images.length).toBeLessThanOrEqual(3);
  });

  it('should handle long content with numberOfLines', () => {
    const longPost = {
      ...mockPost,
      content: 'This is a very long content '.repeat(20),
    };
    const { getByText } = render(<PostCard post={longPost} onLike={() => {}} />);

    expect(getByText(/This is a very long content/)).toBeTruthy();
  });

  it('should handle empty image_urls', () => {
    const postNoImages = { ...mockPost, image_urls: '' };
    const { UNSAFE_queryAllByType } = render(<PostCard post={postNoImages} onLike={() => {}} />);

    const Image = require('react-native').Image;
    const images = UNSAFE_queryAllByType(Image);
    expect(images.length).toBe(0);
  });
});
