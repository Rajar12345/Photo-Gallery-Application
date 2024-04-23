import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const [showSelectedImage, setShowSelectedImage] = useState(false); // Track if small window should be displayed

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('');
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg('Error fetching images. Try again later.');
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  const openImage = (image) => {
    setSelectedImage(image);
    setShowSelectedImage(true); // Show small window
  };

  const closeImage = () => {
    setSelectedImage(null);
    setShowSelectedImage(false); // Hide small window
  };

  return (
    <div className='container'>
      <h1 className='title'>Image Gallery</h1>
      {errorMsg && <p className='error-msg'>{errorMsg}</p>}
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control
            type='search'
            placeholder='Type something to search...'
            className='search-input'
            ref={searchInput}
          />
        </Form>
      </div>
      <div className='filters'>
        <div onClick={() => handleSelection('anime')}>Anime</div>
        <div onClick={() => handleSelection('game')}>Game</div>
        <div onClick={() => handleSelection('dogs')}>Dogs</div>
        <div onClick={() => handleSelection('cup')}>Cup</div>
      </div>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <>
          {showSelectedImage && selectedImage && ( // Conditionally render small window
            <div className="small-image-container">
              <img
                src={selectedImage.urls.small}
                alt={selectedImage.alt_description}
                className='small-image'
                onClick={closeImage}
              />
            </div>
          )}
          <div className='images'>
            {images.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className='image'
                onClick={() => openImage(image)}
              />
            ))}
          </div>
          <div className='buttons'>
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            {page < totalPages && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
