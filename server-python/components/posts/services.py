from services.firebase_service import FirebaseService

class PostService:
    def __init__(self):
        self.firebase = FirebaseService()

    def get_all_posts(self):
        return self.firebase.fetch_posts()

    def create_new_post(self, post_data):
        return self.firebase.create_post(post_data)

    def like_existing_post(self, post_id, user_id):
        return self.firebase.like_post(post_id, user_id)

    def get_post_comments(self, post_id):
        return self.firebase.fetch_comments(post_id)
