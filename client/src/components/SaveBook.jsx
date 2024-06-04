import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from './mutations';
import Auth from '../utils/auth';

const SaveBookComponent = () => {
  const [bookDetails, setBookDetails] = useState({
    authors: '',
    description: '',
    title: '',
    bookId: '',
    image: '',
    link: '',
  });

  const [saveBookMutation] = useMutation(SAVE_BOOK);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBookDetails({
      ...bookDetails,
      [name]: value,
    });
  };

  const saveBook = async (book) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      console.log('Token found:', token);
      const { data } = await saveBookMutation({
        variables: { ...book },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      console.log('Book saved successfully:', data);
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  const handleSaveBook = (event) => {
    event.preventDefault();
    saveBook(bookDetails);
  };

  return (
    <div>
      <form onSubmit={handleSaveBook}>
        <input
          type="text"
          name="authors"
          placeholder="Authors"
          value={bookDetails.authors}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={bookDetails.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={bookDetails.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bookId"
          placeholder="Book ID"
          value={bookDetails.bookId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={bookDetails.image}
          onChange={handleChange}
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={bookDetails.link}
          onChange={handleChange}
        />
        <button type="submit">Save Book</button>
      </form>
    </div>
  );
};

export default SaveBookComponent;
