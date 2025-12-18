
import { useState } from 'react';
import podcastService from '../../services/podcast.service';

const CreatePodcast = () => {
    const [title, setTitle] = useState("");
    const [artistName, setArtistName] = useState("");
    const [description, setDescription] = useState("");
    const [coverArt, setCoverArt] = useState(null);
    const [podcastFile, setPodcastFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("artist_name", artistName);
        formData.append("description", description);
        formData.append("cover_art", coverArt);
        formData.append("podcast_file", podcastFile);

        try {
            await podcastService.createPodcast(formData);
            setTitle("");
            setArtistName("");
            setDescription("");
            setCoverArt(null);
            setPodcastFile(null);
            setSuccessMessage("Podcast created successfully!");
        } catch (error) {
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {successMessage && <div>{successMessage}</div>}
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Artist Name" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="file" onChange={(e) => setCoverArt(e.target.files[0])} />
            <input type="file" onChange={(e) => setPodcastFile(e.target.files[0])} />
            <button type="submit">Create Podcast</button>
        </form>
    );
};

export default CreatePodcast;
