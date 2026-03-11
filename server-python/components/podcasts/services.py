from services.firebase_service import FirebaseService

class PodcastService:
    def __init__(self):
        self.firebase = FirebaseService()

    def get_all_podcasts(self):
        return [
            {
                "id": "pod_1",
                "title": "Tech Talk Africa",
                "description": "Discussing the latest in African tech",
                "author": "Kwame Mensah",
                "imageUrl": "/podcasts/tech-talk.jpg",
                "episodesCount": 15
            }
        ]

    def get_podcast_by_id(self, podcast_id):
        return {
            "id": podcast_id,
            "title": "Sample Podcast",
            "episodes": []
        }

    def create_podcast(self, data):
        print(f"Creating podcast: {data.get('title')}")
        return {"id": "new_pod_id", **data}

    def get_episodes(self, podcast_id):
        return [
            {
                "id": "ep_1",
                "podcastId": podcast_id,
                "title": "The Future of AI",
                "duration": 1800
            }
        ]
